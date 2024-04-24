import { v4 as uuidv4 } from 'uuid'
import { Logger } from '../../../logger/logger';
import { DI } from '../../../di/diContainer';
import { ProducerService } from '../../kafka/producer/producer.service';
import { AzureBlobService } from '../../azure/service/azure-blob.service';
import * as path from 'path';
import { blobRequest, blobResult } from '../../azure/interface/azure-blob.interface';
import { BlobResponseDataType } from '../../../core/valueEnums';
import * as xlsx from 'xlsx';
import { trimkey } from '../../helpers/generic';
import { ValidationStatus } from '../../../core/valueEnums';
import { dispatchExcelKeysMapping } from '../../../core/keys-mapping';

const bulkUploadTopic = process.env.KAFKA_TOPIC_BULK_UPLOADS || '';

export class ExcelService {

    private readonly logger: Logger;
    private producerService: ProducerService;
    private azureBlobService: AzureBlobService;

    constructor() {
        this.logger = DI.get<Logger>(Logger)
        this.producerService = DI.get<ProducerService>(ProducerService);
        this.azureBlobService = DI.get<AzureBlobService>(AzureBlobService)
    }

    async uploadExcel(req: any) {
        {
            try {
                const id = uuidv4();
                const type = req.params.type;
                this.logger.debug(
                    `timestamp: ${new Date()}, id :${id}, type:${type}`
                );

                if (!req.file) {
                    throw Error(`file required`);
                }
                const sampleFile: any = req.file;

                if (!this.ifOfFileExtentionType(
                    process.env.ALLOWED_FILE_EXTENTION_TYPES,
                    path.extname(sampleFile.originalname)
                )) {
                    throw Error(`Received unknown file extention`);
                }

                const params: blobRequest = {
                    fileName: sampleFile.originalname,
                    data: sampleFile.buffer,
                    mimetype: sampleFile.mimetype,
                    folderName: process.env.EXCEL_BLOB_FOLDER_NAME || 'excel',
                    type: type
                };
                // this.logger.debug(`type:${type}, params : ${JSON.stringify(params)}`);
                const result: blobResult = await this.azureBlobService.storeBlob(params);

                if (!result.status) {
                    throw Error(`Error in storing blob`);
                }

                //post to kafka
                const message = {
                    msgType: 'dipatchBulkUpload',
                    type: type,
                    url: result.path
                }

                await this.producerService.post(
                    bulkUploadTopic,
                    JSON.stringify(message)
                );

                return result;
            } catch (e) {
                this.logger.debug(`error:${e}`)
                throw Error(`${e} `);
            }
        }
    }

    async excelToJson(blobUrl: string | undefined, type: string): Promise<any> {
        try {
            if (!blobUrl) throw Error(`blobUrl required`);
            const data = await this.azureBlobService.fetchDataFromBlob(
                blobUrl,
                BlobResponseDataType.XML
            );

            const workbook = xlsx.read(data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            if (jsonData.length == 0) return [];
            return this.transformExcelRowsToJsonArray(jsonData, this.getMappingFunctionByType(type));
        } catch (err) {
            throw Error(`Error converting excel to json : ${err}`)
        }
    }

    transformExcelRowsToJsonArray(jsonData: any, keysMapping: any) {
        const headerRow: any = jsonData[0];
        const resultArray: any = [];

        // Iterate over each row starting from the second index (index 1)
        for (let i = 1; i < jsonData.length; i++) {
            const row: any = jsonData[i];
            const rowData: any = {};

            // Iterate over each column value in the row
            for (let j = 0; j < row.length; j++) {
                const headerField = trimkey(headerRow[j])
                const columnValue = row[j].trim();

                if (keysMapping[headerField]) {
                    rowData[keysMapping[headerField]] = columnValue;
                }
            }
            rowData['validationStatus'] = ValidationStatus.PENDING_VALIDATION;
            rowData['errorExist'] = false;
            rowData['error'] = null;

            resultArray.push(rowData);
        }

        return resultArray;
    }

    getMappingFunctionByType(type: string) {
        switch (type) {
            case 'dispatch':
                return dispatchExcelKeysMapping();
            default:
                return dispatchExcelKeysMapping();
        }
    }

    private ifOfFileExtentionType(
        allowedFileExtentionTypes: string | undefined,
        inputMessageType: string
    ): boolean {
        if (!allowedFileExtentionTypes) return false;
        console.log(`inputMessageType:${inputMessageType}`)
        this.logger.debug('env.....# ', allowedFileExtentionTypes)
        this.logger.debug(`split:${allowedFileExtentionTypes.split(',')}`)
        return allowedFileExtentionTypes
            .split(',')
            .map((msgType: string) => msgType.trim())
            .includes(inputMessageType.trim());
    }

}