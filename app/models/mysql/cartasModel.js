import { connection } from "../../Data/mysql.js";
import { inObject, iterateMysal2Data, parseObjToArr, parseObjToOrderArr } from "../../Utils/jsUtils.js";
import { findByRareza, getIdRareza } from "./rarezaModel.js";

const SELECT_ID_CARTAS = 'SELECT c.id FROM CARTAS c WHERE c.nombre = ?';
const SELECT_CARTAS = 'SELECT c.nombre, r.rareza as rareza, c.poder, c.velocidad FROM CARTAS c INNER JOIN RAREZA r ON c.id_rareza = r.id'
const INSERT_CARTAS = 'INSERT INTO CARTAS (nombre, id_rareza, poder, velocidad) values(?, ?, ?, ?)'
const DELETE_CARTAS = 'DELETE FROM CARTAS WHERE nombre = ?'; 

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
        
        if (bol == true && carta.length > 0){
            return true;
        } else if (bol == true && carta.length <= 0){
            return false;
        } else {
            return carta;
        }

    } catch (ex) {
        console.error(ex);
    }
}

export async function getCardId(name) {
    try {   
        

        const conn = await connection();
        const [query] = await conn.execute(SELECT_ID_CARTAS, [name]);
        
        const id = iterateMysal2Data(query);

        return id.id; 

    } catch (ex) {
        console.error(ex);
    }
}



export async function createCard(obj) {
    try {
        
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

export async function deleteCard(name) {
    try {

        const conn = await connection();
        const del = await conn.execute(DELETE_CARTAS, [name]);

        if(del.length > 0){
            return true;
        } else {
            return false ;
        }

    } catch (ex) {
        console.error(ex);
    }
}

export async function updateCard(obj) {
    try {
        let where = ' WHERE id = ';
        const id = obj.id;
        let conditions = new Array();
        let values = new Array();

        if (inObject('rareza')) {
            obj.rareza = await findByRareza(obj.rareza , true) ? await getIdRareza(obj.rareza) : obj.rareza;
        }
        
        Object.entries(obj).forEach(([key, value]) => {
            switch(key) {
                case 'nombre' : (() => {
                    conditions.push(value);
                    values.push(' nombre = ? ');
                })();
                break;
                
                case 'rareza' : (() => {
                    conditions.push(value)
                    values.push(' id_rareza = ? ');
                })();
                break;

                case 'poder' : (() => {
                    conditions.push(value)
                    values.push(' poder = ? ');
                })();
                break;

                case 'velocidad' : (() => {
                    conditions.push(value)
                    values.push(' velocidad = ? ');
                })();
            }
        });

        const query = 'UPDATE CARTAS SET' + values.join(',') + where + id ;
        console.log(query, );

        const conn = await connection();
        const update = await conn.execute(query, conditions);
        
        if(update.length > 0) {
            return true;
        } else {
            return false;
        }

    } catch (ex) {
        console.error(ex);
    }
}


