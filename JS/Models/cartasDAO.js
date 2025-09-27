import { connection } from "../../Data/connectionDB.js";
import { inObject, iterateMysal2Data, parseObjToArr, parseObjToOrderArr } from "../Utils/jsUtils.js";
import { whiteList } from "./jsonManager.js";
import { findByRareza, getIdRareza } from "./rarezaDAO.js";

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
        const validacion = await filterInput({nombre : name}, 1);
        if (validacion != true){
            throw new Error(validacion);
        }

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
        if (await findByName(obj.nombre, true) === true) {
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

export async function deleteCard(name) {
    try {
        if (!findByName(name, true)){
            throw new Error('La carta insertada no existe.');
        }

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

/**
 * 
 * @param {*} data 
 * @param {*} id 
 * 
 * Esta funcion se encarga de comprobar que los datos insertados en consola sean validos
 * antes de enviarlos a la base de datos.
 * Comprueba: 
 * nombre : Que el nombre Introducido exista o no (id : 1 pora comprobar que el nombre exista, id = 0 para asegurarse de que el nombre no exista).
 * rareza : Que la Rareza Exista.
 * poder : Que el nivel introducido este comprendido entre 0 y 100.
 * velocidad : Que el nivel este comprendido entre 0 y 100. 
 * @returns 
 */
export async function filterInput(data, id) {
    let errors = new Array();
    
    if (inObject(data, 'nombre')) {
        if(id == 1) {
            if (! await findByName(data.nombre, true)){
                errors.push('Error: El nombre no existe');
            } 
        } else if (id == 0){
            if ( await findByName(data.nombre, true)){
                errors.push('Error: El nombre ya existe');
            } 
        }
    }

    if (inObject(data, 'rareza')){
        if (! await findByRareza(data.rareza, true)) {
            errors.push('Error: La rareza no existe')
        }
    }

    if (inObject(data, 'poder')) {
        if (data.poder < 0 && obj.poder > 100) {
            errors.push('Error: El nivel de poder debe de estar establecido entre 0 y 100.');
        }
    }

    if (inObject(data, 'velocidad')) {
        if (data.velocidad < 0 && data.velocidad > 100) {
            errors.push('Error: El nivel de velocidad debe de estar establecido entre 0 y 100.');
        }
    }

    return errors.length > 0 ? errors : true ;
}