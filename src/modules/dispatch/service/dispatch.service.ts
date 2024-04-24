import { Logger } from "../../../logger/logger";
import { DI } from "../../../di/diContainer";
import { ExternalServiceClient } from "../../external-service-client/external-service-client";
import {
    addToMap,
    fetchValueFromMap,
    generateUniqueKey
} from "../../helpers/generic";
import { DispatchValidationService } from "./dispatch-validation.service";
import { DispatchDataTransformerService } from "./dispatch-data-transformer";
import { Shipment } from "../dto/shipment.dto";

export class DispatchService {
    private readonly logger: Logger;
    private externalServiceClient: ExternalServiceClient;
    private dispatchValidationService: DispatchValidationService;
    private dispatchDataTransformerService: DispatchDataTransformerService;

    constructor() {
        this.logger = DI.get<Logger>(Logger);
        this.externalServiceClient = DI.get<ExternalServiceClient>(ExternalServiceClient)
        this.dispatchValidationService = DI.get<DispatchValidationService>(DispatchValidationService)
        this.dispatchDataTransformerService = DI.get<DispatchDataTransformerService>(DispatchDataTransformerService)
    }

    async processDispatchData(data: any): Promise<any> {
        try {
            const dispatchDataMap = new Map<string, any>();
            const dispatchData: any = [];
            const shipmentData: Array<Shipment> = [];

            for (let row of data) {
                const { transformedKeysObject } = row;
                const key = generateUniqueKey([
                    transformedKeysObject.orderNumber,
                    transformedKeysObject.invoicenumber,
                    transformedKeysObject.materialId
                ]);
                const { exists } = fetchValueFromMap(key, dispatchDataMap);

                if (exists) {
                    transformedKeysObject.errorExist = true;
                    transformedKeysObject.error = "Duplicate Row";
                } else {
                    addToMap(key, transformedKeysObject, dispatchDataMap);
                    await this.dispatchValidationService
                        .validateDispatchData(transformedKeysObject, dispatchDataMap);
                }

                dispatchData.push(transformedKeysObject);
                shipmentData.push(
                    this.dispatchDataTransformerService
                        .transformExcelDispatchDataForShipmentRegistration(
                            transformedKeysObject
                        )
                )
            }
            await this.registerShipment('rv', shipmentData)
            return dispatchData; //persist dispatch data
        } catch (err) {
            this.logger.error(`error in validating dispatch data, err : ${err}`)
            throw err;
        }
    }

    async registerShipment(user: any, data: Array<Shipment>): Promise<any> {
        try {
            const result =
                await this.externalServiceClient.invokeShipmentRegistration(data);
            // this.logger.debug(`registerShipment result:${result}`)
            return result;

        } catch (err) {
            throw err;
        }
    }
}