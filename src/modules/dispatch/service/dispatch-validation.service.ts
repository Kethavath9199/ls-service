import { Logger } from "../../../logger/logger";
import { DI } from "../../../di/diContainer";


export class DispatchValidationService {
    private readonly logger: Logger;
    constructor() {
        this.logger = DI.get<Logger>(Logger)
    }

    async validateDispatchData(data: any, dispatchDataMap: Map<string, any>): Promise<any> {
        try {

        } catch (err) {
            this.logger.error(`error in validating dispatch data, err : ${err}`)
            throw err;
        }
    }



}