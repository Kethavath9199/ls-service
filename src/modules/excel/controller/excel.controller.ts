import { Router, Request, Response } from "express";
import { DI } from "../../../di/diContainer";
import { Logger } from "../../../logger/logger";
import { ExcelService } from "../service/excel.service";
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


export class ExcelController {

    private readonly logger: Logger;
    private excelService: ExcelService;
    constructor() {
        this.logger = DI.get<Logger>(Logger)
        this.excelService = DI.get<ExcelService>(ExcelService)
    }

    getRouter(): Router {
        const router = Router()

        router.post('/uploadExcel/:type',
            upload.single('file'),
            async (req: Request, res: Response) => {
                try {
                    const result = await this.excelService.uploadExcel(req)
                    res.json({
                        sucess: true,
                        primary: result,
                        status: {
                            code: 200,
                            message: "Success"
                        }
                    });

                } catch (err) {
                    console.log(`error:${err}`)
                    res.json({
                        success: false,
                        error: {
                            code: "Error code",
                            message: err,
                        }
                    });
                }
            })

        return router;
    }

}