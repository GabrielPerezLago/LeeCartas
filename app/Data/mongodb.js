import { createRequire } from 'module';


const require = createRequire(import.meta.url);

const {MongoClient , ServerApiVersion} = require('mongodb');
const url = "mongodb+srv://admin:admin@22@cluster0.3cdr7i5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient( url , {
    serverApi: {
        version: ServerApiVersion,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try{
        await client.connect();
        await client.db("admin").command({ ping: 1 });

    }   catch(ex) {
        console.error(ex);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);