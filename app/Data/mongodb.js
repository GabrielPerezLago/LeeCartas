import { MongoClient } from 'mongodb';

const uri = "mongodb://admin:admin%4022@localhost:27017/cartas?authSource=admin";

const config = {
    serverSelectionTimeoutMS: 2500
}

const client = new MongoClient(uri, config);

export async function run() {
    try{
        
        await client.connect();
        const db = client.db("cartas");

        return db;

    }   catch (ex) {
        console.error(ex);
        process.exit(1);
    }
        
}
