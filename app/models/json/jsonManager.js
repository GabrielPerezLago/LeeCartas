import fs from 'fs/promises';
import {isObject, iterateObjArr} from '../../Utils/jsUtils.js';

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
        console.error("A habido un error en el lector del Json, Error : " + err);
    }
}

export async function updateJson(url, data) {

    try {
        const updatedJson = JSON.stringify(data, null, 2)
        await fs.writeFile(url, updatedJson, 'utf-8');
    } catch (err) {
        console.error("Algo no funciona como es debido :: Error: " + err);
    }
}

export function showCards(data){
    iterateObjArr(data, true);
};

export function whiteList(data){
    let list = [];
    Object.keys(data).forEach((key) => {
        list.push(key);
    });
    return list;
}

export function findByNameJson(data, name, list) {
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

export function createCardJson(data, obj, url = null){
    const mergeData = {...data , ...obj };
    console.log(mergeData);
    updateJson(url, mergeData);
}

export function deleteCardJson(data, nombre, url = null){
    delete data[nombre];
    console.log(data);
    updateJson(url, data);
};

export function updateCardJson(globalData , updatedData, url = null){
    const newData = {};
    let deleteKey = '';
    Object.entries(globalData).forEach(([gKey, gValue])=> {
        Object.entries(updatedData).forEach(([uKey, uValue]) => {
            if (gKey == uKey){
                if(uValue.hasOwnProperty('nombre')){
                    deleteKey = gKey;
                    newData[uValue.nombre] = {...gValue, ...uValue};
                } else {
                    newData[gKey] = {...gValue, ...uValue};
                }
                
            }
        });
    });
    const updatedAllData = {...globalData, ...newData};
    if(deleteKey != ''){
        deleteCard(updatedAllData, deleteKey, url);
    }
    updateJson(url, updatedAllData);
}


function filterData(obj){
    Object.entries(obj).forEach(([key, values]) =>  {
        if(key == nombre) { 
        }
    });
}

