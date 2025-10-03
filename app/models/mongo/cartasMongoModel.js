import { run } from "../../Data/mongodb.js";
import { connection } from "../../Data/mysql.js";

export async function findAllCartasMongo() {
    try {
        const conn = await run();
        const collection = conn.collection('carta');
        const cartas = await collection.find({}).toArray();
        return cartas;
    } catch (ex) {
        console.error(ex);
    }
}

export async function findByNameCartasMongo(name, bol = false) {
    try {
        const connect = await run();
        const conn = connect.collection('carta');
        const carta = await conn.find({nombre: name}).toArray();
        if (bol && carta.length > 0){
            return true;
        } else if (bol && carta.length <= 0) {
            return false;
        } else {
            return carta;
        }
        return carta;
    } catch(ex) {
        console.error(ex);
    }
}

export async function createCartaMongo(carta) {
    try {
        const connect = await run();
        const conn = connect.collection('carta');
        const create = await conn.insertOne(carta);
        return Object.keys(create).length > 0 ? true : false;
    } catch(ex) {
        console.error(ex);
    }
}


export async function deleteCartaMongo(name) {

    try{
        const conn = await run();
        const collection = conn.collection('carta');
        const deleteCarta = await collection.deleteOne({nombre: name});
        
        if ( Object.keys(deleteCarta).length > 0 ) {
            return true;
        } else {
            return false ;
        }

    } catch(ex) {
        console.error(ex);
    }

}


export async function upodateCartaMongo(carta, nameCarta) {
    try {
        const conn = await run();
        const collection = conn.collection(`carta`);
        const update = await collection.updateOne({nombre: nameCarta}, {$set : carta} );
        return update.modifiedCount > 0 ? true : false;
    } catch(ex) {
        console.error
    }
}