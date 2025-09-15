
export function isObject(obj) {
    if (obj instanceof Object && !Array.isArray(obj) && obj != {}){
        return true;
    }

    return false;
}

export function iterateObjArr(data){
    if (isObject(data)){
        return iterateObject(data);
    } else if (Array.isArray(data)){
        return iterateArray(data);
    } else  {
        return "Error: Los datos introducidos solo pueden ser arrays u objetos."
    }
}

function iterateObject(obj) {
    if (!isObject(obj)){
        return;
    }

    Object.entries(obj).forEach(([key, value]) => {
        console.log( key + " : " + value);
    });
}

function iterateArray(arr) {
    arr.forEach((value) => {
        console.log(value);
    });
}