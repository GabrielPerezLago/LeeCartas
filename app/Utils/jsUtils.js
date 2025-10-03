

export function isObject(obj) {
    if (obj instanceof Object && !Array.isArray(obj) && obj != {}) {
        return true;
    }

    return false;
}

export function iterateObjArr(data, biDim = false) {
    if (isObject(data)) {
        return iterateObject(data, biDim);
    } else if (Array.isArray(data)) {
        return iterateArray(data);
    } else {
        return console.error("Error: Los datos introducidos solo pueden ser arrays u objetos.");
    }
}

function iterateObject(obj, biDim = false) {
    if (!isObject(obj)) {
        return;
    }

    Object.entries(obj).forEach(([key, value]) => {
        if (biDim == true) {
            console.log(key + ' : { ' + iterateObjArr(value) + ' }');
        } else {
            console.log(key + ' : ' + value);
        }
    });
}

function iterateArray(arr) {
    arr.forEach((value) => {
        console.log(value);
    });
}


export function parseObjToArr(obj) {

    if (!isObject(obj)) {
        console.error('Error: Los datos introducidos no son validos , la funcion solicita objetos ');
        return;
    }

    let arr = new Array();
    Object.entries(obj).forEach(([key, value]) => {
        arr.push(value);
    });
    return arr;
}

export function parseObjToOrderArr(data, arr){
    const inOrder = arr.map((clave) => data[clave]);
    return inOrder;
}

/**
 * 
 * @param {*} data 
 * 
 * Esta funcion parsea los datos que devulve el mysql dos de la base de datos un objeto sencillo
 */
export function iterateMysal2Data(data) {
    const newDta = {};

    data.forEach((element) => {
        Object.entries(element).forEach(([key, value]) => {
            newDta[key] = value;
        });
    });

    return newDta;
}

export function inObject(obj, value) {
    if (obj.hasOwnProperty(value)) {
        return true;
    }

    return false;
}

export function printArrayTexts(array) {
    array.forEach( (value) => {
        console.log(value);
    });
}

export function checkWhitelistData(param, whiteList){
    return whiteList.includes(param);
}


