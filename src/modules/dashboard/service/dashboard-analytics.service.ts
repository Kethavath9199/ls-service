import { Logger } from "../../../logger/logger";
import { DI } from "../../../di/diContainer";

export class DashboardAnalyticService {
    private logger: Logger;

    constructor() {
        this.logger = DI.get<Logger>(Logger)
    }
}