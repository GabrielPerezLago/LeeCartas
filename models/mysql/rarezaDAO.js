import { connection } from "../../Data/mysql.js";
import { iterateMysal2Data } from "../../Utils/jsUtils.js";

export async function findByRareza(rareza, bol = false) {
    try{
        const conn = await connection();
        const [data] = await conn.execute('SELECT id, rareza FROM RAREZA WHERE rareza = ? ' , [rareza]);
        if (bol) {
            if (data.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            console.log("findRareza: " + data)
            return data;
        }
    } catch (ex) {
        console.error(ex);
    }
}

export async function getIdRareza(rareza){
    try{
        const conn = await connection();

        const [idRareza] = await conn.execute('SELECT id FROM RAREZA WHERE rareza = ? ', [rareza]);
        const id = iterateMysal2Data(idRareza);
        console.log('idRareza: ' + id);
        return id.id;
    } catch (ex) {
        console.error(ex);
    }
}