import { RecordMetadata } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { KafkaService } from '../service/kafka.service';
import { DI } from '../../../di/diContainer';
import { KafkaModuleOption } from '../common/interfaces';

export class ProducerService {

    private client: KafkaService;
    constructor() {
        const options: KafkaModuleOption['options'] = {
            client: {
                clientId: 'linesight-backend',
                brokers: process.env.KAFKA_BROKERS?.split(',') ?? []
            },
            consumer: {
                groupId: process.env.KAFKA_GROUP_ID ?? '',
            }
        };

        this.client = DI.get<KafkaService>(KafkaService, options)
    }


    async post(topic: string, message: string): Promise<RecordMetadata[]> {
        console.debug(`topic: ${topic} - msg : ${JSON.stringify(message)}`)
        return this.client.send({
            topic: topic,
            messages: [
                {
                    key: `${uuidv4()}`,
                    value: JSON.stringify(message),
                },
            ],
        });
    }

}