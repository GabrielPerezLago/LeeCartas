

export function isObject(obj) {
    if (obj instanceof Object && !Array.isArray(obj) && obj != {}){
        return true;
    }

    return false;
}

export function iterateObjArr(data, biDim = false){
    if (isObject(data)){
        return iterateObject(data, biDim);
    } else if (Array.isArray(data)){
        return iterateArray(data);
    } else  {
        return console.error("Error: Los datos introducidos solo pueden ser arrays u objetos.");
    }
}

function iterateObject(obj, biDim = false ) {
    if (!isObject(obj)){
        return;
    }

    Object.entries(obj).forEach(([key, value]) => {
        if(biDim == true){
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
