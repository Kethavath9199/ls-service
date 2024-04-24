import { MongoClient, Db, ClientSession } from 'mongodb';

export class MongoConnection {
    private client?: MongoClient;
    private db?: Db;
    private session?: ClientSession;

    private async connect(): Promise<MongoClient> {
        try {
            const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
            const options = { auth: { username: process.env.DB_USER!, password: process.env.DB_PASS! } };
            return await MongoClient.connect(uri, options);
        } catch (error) {
            console.error('Error in Mongo connection:', error);
            throw error;
        }
    }

    async getClient(): Promise<MongoClient> {
        if (!this.client) {
            this.client = await this.connect();
            console.debug(`mongo connected successfully`);
        }
        return this.client;
    }

    async getDb(): Promise<Db> {
        if (!this.db) {
            const client = await this.getClient();
            this.db = client.db(process.env.DB_NAME);
        }
        return this.db!;
    }

    async getClientSession(): Promise<ClientSession> {
        if (!this.session) {
            const client = await this.getClient();
            this.session = client.startSession();
        }
        return this.session!;
    }
}


