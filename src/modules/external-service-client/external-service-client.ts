import dotenv from 'dotenv';
import { Logger } from "../../logger/logger";
import { DI } from '../../di/diContainer';
import { Shipment } from '../dispatch/dto/shipment.dto';
const axios = require('axios');

dotenv.config();

const realtraceBaseUrl = process.env.REALTRACE_BASE_URL

export class ExternalServiceClient {
    private readonly logger: Logger;

    constructor() {
        this.logger = DI.get(Logger);
    }

    async invokeShipmentRegistration(shipment: Array<Shipment>): Promise<any> {

        const result = await this.checkExternalServiceInvoke('cargoEs/shipmentsRegistration', shipment)
        this.logger.debug(`result: ${result}`)
        return result;
    }

    private async checkExternalServiceInvoke<T>(ExternalEndPoint: string, params: T) {
        if (process.env.REALTRACE_SERIVCE_ACTIVE === 'true')
            return this.invokeExternalService(ExternalEndPoint, params);
        else
            return {
                message: {
                    response: 'service is inactive',
                    txnId: '000',
                },
                error: '',
            };
    }

    private async invokeExternalService<T>(
        methodName: string,
        methodParams: T,
    ): Promise<any> {
        return await this.postToExternalService(methodParams, `${methodName}`);
    }

    private async postToExternalService<T>(
        methodParams: T,
        route: string,
    ): Promise<any> {
        try {
            this.logger.debug(`realtrace url: ${realtraceBaseUrl}/${route}`)
            this.logger.debug(`methodParams: ${JSON.stringify(methodParams)}`)
            const response = await axios.post(`${realtraceBaseUrl}/${route}`, methodParams)
            // this.logger.debug(`response status: ${response.status}`)
            if (response.data.status.code == 'Error')
                throw `${response.data.status.message}`
            // this.logger.debug(`response data: ${response.data.primary}`)
            return response.data.primary;
        } catch (error: any) {
            // Handle error
            this.logger.error('Error occurred:', error.message);
            throw error;
        } ``
    }


}