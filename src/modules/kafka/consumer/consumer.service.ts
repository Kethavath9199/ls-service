// import { SUBSCRIBER_MAP } from "../common/kafka.decorator";
import { KafkaService } from "../service/kafka.service";
import { DI } from "../../../di/diContainer";
import { Logger } from "../../../logger/logger";
import { KafkaModuleOption } from "../common/interfaces";
import { isOfMessageType } from "../../helpers/isOfMessageType";
import { DispatchService } from "../../dispatch/service/dispatch.service";
import { ExcelService } from "../../excel/service/excel.service";

export const SUBSCRIBER_MAP = new Map();
const bulkUploadTopic = process.env.KAFKA_TOPIC_BULK_UPLOADS || '';

export class ConsumerService {
    private client: KafkaService;
    private readonly logger: Logger;
    private dispatchService: DispatchService;
    private excelService: ExcelService;
    constructor() {
        const options: KafkaModuleOption['options'] = {
            client: {
                clientId: 'linesight-backend',
                brokers: process.env.KAFKA_BROKERS?.split(',') ?? []
            },
            consumer: {
                groupId: process.env.KAFKA_GROUP_ID ?? '',
            }
        };
        this.client = DI.get<KafkaService>(KafkaService, options)
        this.logger = DI.get<Logger>(Logger)
        this.dispatchService = DI.get<DispatchService>(DispatchService)
        this.excelService = DI.get<ExcelService>(ExcelService)

    }

    async onModuleInit(): Promise<any> {
        if (!bulkUploadTopic) {
            throw new Error(
                'Make sure KAFKA_TOPIC_BULK_UPLOADS are set in the environment variables',
            );
        }
        // console.log('Function binding for incomingCustomsMessage:', this.incomingCustomsMessage.bind(this));
        await SUBSCRIBER_MAP.set(bulkUploadTopic, this.incomingExcelMessage.bind(this));

        await this.client.subscribeToResponseOf(bulkUploadTopic, this);
        await this.client.onModuleInit()
    }

    async incomingExcelMessage(
        message: any,
        _headers: any,
        _key: string,
        timestamp: string
    ): Promise<void> {
        this.logger.debug(
            'incoming kafka to topic: ' +
            bulkUploadTopic +
            ' - at timestamp: ' +
            timestamp +
            '- messageType' +
            message.msgType +
            '- message' +
            message
        );
        switch (true) {
            case isOfMessageType(
                process.env.BULK_UPLOAD_MESSAGE_TYPE,
                message.msgType
            ):
                await this.parseBulkUploadMessage(message);
        }
    }


    async parseBulkUploadMessage(message: any): Promise<void> {
        try {
            this.logger.debug(`message:${JSON.stringify(message)} typeof:${typeof(message)}`)
            const data = await this.excelService.excelToJson(message.url, message.type);
            this.logger.debug(`data:${JSON.stringify(data)}`)
            // await this.dispatchService.processDispatchData(data)
        } catch (err) {
            throw err;
        }
    }
}
