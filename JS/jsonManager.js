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

export function whiteList(data){
    let list = [];
    Object.keys(data).forEach((key) => {
        list.push(key);
    });
    return list;
}

export function findByName(data, name, list) {
    if (!isObject(data) && !Array.isArray(data)) {
        console.log("Error: la base de datos introducida debe ser en formato Objeto o un Array");
    }

    if (!list.includes(name)){
        console.log("Error: La carta introducida no existe.");
    }

    Object.entries(data).forEach(([key, value]) => {
        if (name == key) {
            iterateObjArr(value);
        }
    });
}

export function countCards(data){
    const keys = Object.keys(data);
    let contador = 0;
    
    for(let i = 0 ; i<keys.length; i++) {
        contador ++;
    }

    return contador;
}

export function createCard(){}