import { Request } from "express";
import { Response } from "express-serve-static-core";
import { NextFunction } from "connect";
import { BaseResponse, ResponseStatus, ResponseCode } from "../response/base-response";
import { DI } from "../di/diContainer";
import { Logger } from "../logger/logger";

export class ErrorHandler extends Error{

    errorHandler (err: Error, req: Request, res: Response, next: NextFunction){     
        const logger: Logger = DI.get(Logger);
        const responseStatus: ResponseStatus = new ResponseStatus(ResponseCode.FAILURE, err.message);          
        logger.error('Error Message: ',err.message);
        logger.error('Error Name: ',err.name);
        logger.error('Error Stack: ',err.stack);
        res.json(new BaseResponse(responseStatus));
    }
}