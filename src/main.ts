import express, { Application } from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { Logger } from './logger/logger';
import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { DI } from './di/diContainer';
import { ErrorHandler } from './error/error-handler';
import { DashboardController } from './modules/dashboard/controller/dashboard.controller';
import { DispatchController } from './modules/dispatch/controller/dispatch.controller';
import { ConsumerService } from './modules/kafka/consumer/consumer.service';
import { ExcelController } from './modules/excel/controller/excel.controller';
import { MongoConnection } from './config/mongo-connection.config';
dotenv.config();
const expressApp: Application = express();


class Main {
    private logger: Logger;
    private consumerService: ConsumerService;
    private mongoConnection: MongoConnection;
    constructor() {
        this.logger = DI.get(Logger);
        this.consumerService = DI.get(ConsumerService)
        this.mongoConnection = DI.get(MongoConnection)
    }

    initializeApplication() {
        this.registerControllers();
        this.initializeSwagger();
        this.startServer();
    }

    initializeRepositories() {
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'Logistics API Documentation',
                    version: '1.0.0',
                    description: 'Logistics API documentation generated using Swagger',
                },
            },
            apis: ['./src/modules/*/controller/*.ts'],
        };

        const specs = swaggerJSDoc(options);
        console.log(`specs: `, JSON.stringify(specs, null, 2));
        expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    private registerControllers() {
        const baseUrl = process.env.BASE_URL
        this.initializeRepositories();
        expressApp.use(cors());
        expressApp.use(bodyParser.urlencoded({ extended: true }));
        expressApp.use(bodyParser.json());
        expressApp.use((req, res, next) => {
            DI.destroy();
            next();
        })
        this.logger.debug("BaseURl", baseUrl)

        expressApp.use(`${baseUrl}/dashboard`, DI.get<DashboardController>(DashboardController).getRouter());
        expressApp.use(`${baseUrl}/dispatch`, DI.get<DispatchController>(DispatchController).getRouter());
        expressApp.use(`${baseUrl}/excel`, DI.get<ExcelController>(ExcelController).getRouter());

        expressApp.use(DI.get<ErrorHandler>(ErrorHandler).errorHandler);
    }

    private async initializeDB() {
        await this.mongoConnection.getClient()
    }


    private startServer() {
        expressApp.listen(process.env.SERVER_PORT, async () => {
            await this.initializeDB();
            await this.consumerService.onModuleInit();
            this.logger.debug(`Application Server Started ${process.env.SERVER_PORT}`);
        });
    }
}

const app = DI.get<Main>(Main);
app.initializeApplication();
