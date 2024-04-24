import { ClientSession, Collection, Db } from "mongodb";
import { MongoConnection } from "../../../config/mongo-connection.config";
import { DI } from "../../../di/diContainer";
import { Logger } from "../../../logger/logger";

export class DBService {

    private logger: Logger;
    private mongoConnection: MongoConnection;

    constructor() {
        this.logger = DI.get(Logger);
        this.mongoConnection = DI.get<MongoConnection>(MongoConnection);
    }

    async createIndex(collectionName: string, index: any): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result = await collection.createIndex(index);
            console.debug(`Index created for collection ${collectionName}: ${JSON.stringify(index)}`);
            return result;
        } catch (error) {
            console.error(`Error creating index for collection ${collectionName}:`, error);
            throw error;
        }
    }

    async insertOne(collectionName: string, data: any): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.insertOne(data);
            console.debug(`Data inserted into collection ${collectionName} : ${JSON.stringify(data)}`);
            console.debug(`Insert result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error inserting data into collection ${collectionName}:`, error);
            throw error;
        }
    }

    async insertMany(collectionName: string, data: any): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.insertMany(data);
            console.debug(`Data inserted into collection ${collectionName} : ${JSON.stringify(data)}`);
            console.debug(`Insert result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error inserting data into collection ${collectionName}:`, error);
            throw error;
        }
    }

    async insertOneWithSession(collectionName: string, data: any, session: ClientSession): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.insertOne(data, { session });
            console.debug(`Data inserted into collection ${collectionName} with session: ${JSON.stringify(data)}`);
            console.debug(`Insert result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error inserting data into collection ${collectionName} with session:`, error);
            throw error;
        }
    }

    async insertManyWithSession(collectionName: string, data: any, session: ClientSession): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.insertMany(data, { session });
            console.debug(`Data inserted into collection ${collectionName} with session: ${JSON.stringify(data)}`);
            console.debug(`Insert result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error inserting data into collection ${collectionName} with session:`, error);
            throw error;
        }
    }

    async updateOne(collectionName: string, data: any, whereObject: any): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.updateOne(whereObject, { $set: data });
            console.debug(`Data updated in collection ${collectionName}: ${JSON.stringify(data)}
                with filter: ${JSON.stringify(whereObject)}`
            );
            console.debug(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error updating data in collection ${collectionName}:`, error);
            throw error;
        }
    }

    async updateOneWithSession(
        collectionName: string,
        data: any, whereObject: any,
        session: ClientSession
    ): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.updateOne(whereObject, { $set: data }, { session });
            console.debug(`Data updated in collection ${collectionName} 
                with filter: ${JSON.stringify(whereObject)} 
                with data: ${JSON.stringify(data)} with session`
            );
            console.debug(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error updating data in collection ${collectionName} with session:`, error);
            throw error;
        }
    }

    async updateMany(collectionName: string, data: any, whereObject: any): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.updateMany(whereObject, { $set: data });
            console.debug(`Data updated in collection ${collectionName}: ${JSON.stringify(data)}
                with filter: ${JSON.stringify(whereObject)}`
            );
            console.debug(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error updating data in collection ${collectionName}:`, error);
            throw error;
        }
    }

    async updateManyWithSession(
        collectionName: string,
        data: any, whereObject: any,
        session: ClientSession
    ): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.updateMany(whereObject, { $set: data }, { session });
            console.debug(`Data updated in collection ${collectionName} 
                with filter: ${JSON.stringify(whereObject)} 
                with data: ${JSON.stringify(data)} with session`
            );
            console.debug(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error updating data in collection ${collectionName} with session:`, error);
            throw error;
        }
    }

    async updateOneByFilter(
        collectionName: string,
        data: any,
        whereObject: any,
        filter: any
    ): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.updateOne(whereObject, { $set: data }, filter);
            console.debug(`Data updated in collection ${collectionName} 
                with filter: ${JSON.stringify(whereObject)} 
                with data: ${JSON.stringify(data)} 
                with filter: ${JSON.stringify(filter)}`
            );
            console.debug(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error updating data in collection ${collectionName} by filter:`, error);
            throw error;
        }
    }

    async updateOneByFilterWithSession(
        collectionName: string,
        data: any, whereObject: any,
        filter: any,
        session: ClientSession
    ): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.updateOne(whereObject, { $set: data }, { ...filter, session });
            console.debug(`Data updated in collection ${collectionName} 
                with filter: ${JSON.stringify(whereObject)} 
                with data: ${JSON.stringify(data)} 
                with filter: ${JSON.stringify(filter)} with session`
            );
            console.debug(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error updating data in collection ${collectionName} by filter with session:`, error);
            throw error;
        }
    }

    async updateManyByFilter(
        collectionName: string,
        data: any,
        whereObject: any,
        filter: any
    ): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.updateOne(whereObject, { $set: data }, filter);
            console.debug(`Data updated in collection ${collectionName} 
                with filter: ${JSON.stringify(whereObject)} 
                with data: ${JSON.stringify(data)} 
                with filter: ${JSON.stringify(filter)}`
            );
            console.debug(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error updating data in collection ${collectionName} by filter:`, error);
            throw error;
        }
    }

    async updateManyByFilterWithSession(
        collectionName: string,
        data: any, whereObject: any,
        filter: any,
        session: ClientSession
    ): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const result: any = await collection.updateMany(whereObject, { $set: data }, { ...filter, session });
            console.debug(`Data updated in collection ${collectionName} 
                with filter: ${JSON.stringify(whereObject)} 
                with data: ${JSON.stringify(data)} 
                with filter: ${JSON.stringify(filter)} with session`
            );
            console.debug(`Update result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error updating data in collection ${collectionName} by filter with session:`, error);
            throw error;
        }
    }

    async fetchByQuery(collectionName: string, whereObject: any): Promise<any[]> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const queryCursor: any = collection.find<any>(whereObject, {});
            const result: any[] = await queryCursor.toArray();
            this.logger.debug(`Collection: ${collectionName},
                Query: ${JSON.stringify(whereObject)},
                Result: ${JSON.stringify(result)}`
            );
            return result;
        } catch (error) {
            this.logger.error('Error retrieving data from database:', error);
            throw error;
        }
    }

    async fetchByAggregateQuery(collectionName: string, query: any): Promise<any[]> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const queryCursor = collection.aggregate<any>(query);
            const result: any[] = await queryCursor.toArray();

            console.debug(`Query result from collection ${collectionName}: ${JSON.stringify(result)}`);

            return result;
        } catch (error) {
            console.error(`Error retrieving data from collection ${collectionName} by query:`, error);
            throw error;
        }
    }

    async fetchOneByQueryWithAlphaNumericSort(
        collectionName: string,
        whereObject: any,
        sortCondition: any
    ): Promise<any> {
        try {
            const db: Db = await this.mongoConnection.getDb();
            const collection: Collection<any> = db.collection(collectionName);
            const queryCursor = collection.find<any>(whereObject, {})
                .sort(sortCondition)
                .collation({ locale: "en_US", numericOrdering: true })
                .limit(1);

            const result: any[] = await queryCursor.toArray();

            console.debug(`Query result from collection ${collectionName} 
                with query: ${JSON.stringify(whereObject)} 
                and sort: ${JSON.stringify(sortCondition)}: ${JSON.stringify(result)}`
            );

            return result;
        } catch (error) {
            console.error(`Error retrieving data from collection ${collectionName}
                with query and sort:`, error
            );
            throw error;
        }
    }

}




