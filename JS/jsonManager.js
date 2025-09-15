import fs from 'fs/promises';
import {isObject, iterateObjArr} from './jsUtils.js';

/**
 * 
 * @param {*} url 
 * @returns {*} Json
 * 
 * Esta funcion lee un archico json de manera asincrona y lo trasnforma 
 * en un objeto JavaScript. 
 */
export async function readJson(url) {
    try{
        const readDAta = await fs.readFile(url, 'utf-8');
        return JSON.parse(readDAta);
    } catch (err) {
        console.log("A habido un error en el lector del Json, Error : " + err);
    }
}


export function findByName(data, name) {
    if (!isObject(data)) {
        return "Error: la base de datos introducida debe ser un Objeto i";
    }

    Object.entries(data).forEach(([key, value]) => {
        if (name == key) {
            iterateObjArr(value);
        }
    });
}
