import { MongoClient } from 'mongodb';

const uri = "mongodb://admin:admin@22@localhost:27017";

const client = MongoClient(uri);

export async function run() {
    try{
        const dbName = "cartas"
        await client.connect();
        const db = client.db(dbName);

        return db;

    }   catch(ex) {
        console.error(ex);
    } 
        
}

export async function connect() {
    try{
        const connect = await run();
        return connect.collection('cartas');
    } catch(ex) {
        console.error(ex);
    }
}