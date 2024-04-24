import { Router } from "express";
import { Logger } from "../../../logger/logger";
import { DI } from "../../../di/diContainer";

export class DashboardController {
    constructor() {
    }

    getRouter(): Router {
        const router = Router();

        router.get('/', async (req, res) => {

            try {
                const result = { a: '' };
                res.json({
                    sucess: true,
                    primary: result,
                    status: {
                        code: '200',
                        message: "Success"
                    }
                });

            } catch (err) {
                res.json({
                    success: false,
                    error: {
                        code: "Error code",
                        message: err,
                    }
                });
            }
        })

        return router
    }
}