import { run } from "../../Data/mongodb.js";
import { iterateMysal2Data } from "../../Utils/jsUtils.js";


 export async function findAllRarezaMongo() {
    try {
        const conn = await run();
        const collection = conn.collection('rareza');
        const rareza = await collection.find({}).toArray();
        
        return rareza;
    } catch(ex) {
        console.error(ex);
    }
 }


export async function findByNameRarezaMongo(name, bol = false) {
    try {
        const conn = await run();
        const collection = conn.collection('rareza');
        const rareza = await collection.find({tipo: name}).toArray();

        if(bol == true) {
            return rareza.length > 0 ? true : false ;
        }

        return rareza;
    } catch(ex) {
        console.error(ex);
    }
}


export async function findByIdRarezaMongo(id, bol) {
    try{
        const conn = await run();
        const collection = conn.collection('rareza');
        const rareza = await collection.find({_id: id}).toArray();

        if(bol == true) {
            return rareza.length > 0 ? true : false ;
        }

        return rareza;
        
    } catch(ex) {
        console.error(ex);
    }
    
}

export async function  getIdRarezaMongo(nombre) {
    try {
        const conn = await run();
        const collection = conn.collection(`rareza`);
        const rareza = await collection.find({tipo: nombre}).toArray();

        const dataRar = iterateMysal2Data(rareza);

        return dataRar._id;
    } catch(ex) {
        console.error(ex);
    }
}