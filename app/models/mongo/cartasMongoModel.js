import { connect, run } from "../../Data/mongodb.js";

export async function findAllCartasMongo() {
    try {
        const conn = await run();
        const collection = conn.collection('cartas');
        const cartas = await collection.find({}).toArray();
        return cartas;
    } catch (ex) {
        console.error(ex);
    }
}

export async function findByNameCartasMongo(name) {
    try {
        const conn = connect();
        const carta = conn.find({nombre: name}).toArray();
        return carta;
    } catch(ex) {
        console.error(ex);
    }
}