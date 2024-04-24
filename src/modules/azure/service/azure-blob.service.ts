require('dotenv').config();
import { Logger } from '../../../logger/logger';
import { v4 as uuidv4 } from 'uuid';
import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
} from '@azure/storage-blob';
import streamifier from 'streamifier';
import { DI } from '../../../di/diContainer';
import { blobRequest, blobResult } from '../interface/azure-blob.interface';
import axios from 'axios';
import { BlobResponseDataType } from '../../../core/valueEnums';

export class AzureBlobService {
    private readonly logger: Logger;
    constructor() {
        this.logger = DI.get<Logger>(Logger)
    }
    async storeBlob(params: blobRequest): Promise<blobResult> {
        return new Promise(async (resolve, reject) => {
            try {
                const sharedKeyCredential = new StorageSharedKeyCredential(
                    process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
                    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY || '',
                );
                const pipeline = newPipeline(sharedKeyCredential);
                const blobServiceClient = new BlobServiceClient(
                    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
                    pipeline
                );

                const getBlobName = (originalName: any) => {
                    const identifier = uuidv4()
                    return `${params.folderName}/${params.type}/${identifier}-${originalName}`;
                };
                const blobName = getBlobName(params.fileName);
                const containerClient = blobServiceClient.getContainerClient(
                    process.env.AZURE_STORAGE_CONTAINER_NAME || ''
                );
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                const ONE_MEGABYTE = 1024 * 1024;
                const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
                const buffer = params.data;
                const stream = streamifier.createReadStream(buffer);

                const uploadBlobResponse = await blockBlobClient.uploadStream(
                    stream,
                    uploadOptions.bufferSize,
                    uploadOptions.maxBuffers,
                    {
                        blobHTTPHeaders:
                        {
                            blobContentType: params.mimetype
                        },
                    }
                );

                this.logger.debug(`uploadBlobResponse: ${uploadBlobResponse}`)
                this.logger.debug('blockBlobClient.url', blockBlobClient.url);

                return resolve({ status: true, path: blockBlobClient.url });
            } catch (err) {
                this.logger.debug(err);
                return resolve({ status: false });
            }
        });
    };

    async fetchDataFromBlob(blobUrl: string, responseDataType: BlobResponseDataType): Promise<any> {
        return await axios.get(blobUrl, { responseType: 'arraybuffer' })
            .then(response => {
                // Handle the response here
                const blobContent = response.data;
                switch (responseDataType) {
                    case BlobResponseDataType.XML:
                        return blobContent;
                    case BlobResponseDataType.String:
                        return blobContent.toString('utf-8');
                    case BlobResponseDataType.JSON:
                        return JSON.parse(blobContent.toString('utf-8'));
                    case BlobResponseDataType.Binary:
                        return Buffer.from(blobContent);
                    default:
                        return blobContent;
                }
            })
            .catch(error => {
                console.error('Error fetching blob data:', error);
            });
    }
}
