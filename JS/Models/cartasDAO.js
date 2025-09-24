import { connection } from "../../Data/connectionDB.js";
import { parseObjToArr } from "../Utils/jsUtils.js";
import { findByRareza, getIdRareza } from "./rarezaDAO.js";

const SELECT_CARTAS = 'SELECT c.nombre, r.rareza as rareza, c.poder, c.velocidad FROM CARTAS c INNER JOIN RAREZA r ON c.id_rareza = r.id'
const INSERT_CARTAS = 'INSERT INTO CARTAS (nombre, id_rareza, poder, velocidad) values(?, ?, ?, ?)'
export async function findAllCards() {
    try {
        const conn = await connection();
        const [cartas] = await conn.execute(SELECT_CARTAS);
        return cartas;
    } catch (ex) {
        console.error(ex);
    }
}

export async function findByName(name, bol = false) {
    try {
        const conn = await connection();
        const [carta] = await conn.execute(SELECT_CARTAS + ' WHERE c.nombre = ? ', [name]);
        
        if (name && carta.length > 0){
            return true;
        } else {
            return carta;
        }

    } catch (ex) {
        console.error(ex);
    }
}



export async function createCard(obj) {
    try {
        if (findByName(obj.nombre, true)) {
            throw new Error('La carta ya existe, por favor cree una nueva o actualice esta');
        }

        if(! await findByRareza(obj.rareza, true)){
            throw new Error('No se a encontrado la rareza insetada , porfavor inserte datos validos');
        }

        obj.rareza = await getIdRareza(obj.rareza);

        const data = parseObjToArr(obj);
        const conn = await connection();
        const insert = await conn.execute(INSERT_CARTAS, data);
        
        if (insert.length > 0){
            return true;
        }else {
            return false
        }

    } catch (ex) {
        console.error(ex);
    }
}