import { Router, Request, Response } from "express";
import { DI } from "../../../di/diContainer";
import { DispatchService } from "../service/dispatch.service";
import { ProducerService } from "../../kafka/producer/producer.service";
import { Shipment } from "../dto/shipment.dto";

export class DispatchController {

    private dispatchService: DispatchService;
    private producerService: ProducerService;
    constructor() {
        this.dispatchService = DI.get(DispatchService)
        this.producerService = DI.get(ProducerService)
    }

    getRouter(): Router {
        const router = Router()

        router.post('/registerShipment', async (req: Request, res: Response) => {
            try {
                const data: Array<Shipment> = req.body.data;
                const result = await this.dispatchService.registerShipment('user', data);
                // console.log(`final result :${JSON.stringify(result)}`)
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

        router.post('/post', async (req: Request, res: Response) => {
            try {
                const data: any = req.body.data;
                const result = await this.producerService.post(process.env.KAFKA_TOPIC_BULK_UPLOADS || '', data)
                // console.log(`final result :${JSON.stringify(result)}`)
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
