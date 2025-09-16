;
export function isObject(obj) {
    if (obj instanceof Object && !Array.isArray(obj) && obj != {}){
        return true;
    }

    return false;
}

export function iterateObjArr(data, ret = false){
    if (isObject(data)){
        return iterateObject(data, ret);
    } else if (Array.isArray(data)){
        return iterateArray(data);
    } else  {
        return console.error("Error: Los datos introducidos solo pueden ser arrays u objetos.");
    }
}

function iterateObject(obj, ret = false ) {
    if (!isObject(obj)){
        return;
    }

    Object.entries(obj).forEach(([key, value]) => {
        if (!ret) {
            console.log(key + " : " + value);
        } else {
            return {value}
        }
    });
}

function iterateArray(arr) {
    arr.forEach((value) => {
        console.log(value);
    });
}


