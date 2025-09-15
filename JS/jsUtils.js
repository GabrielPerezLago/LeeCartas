export function isObject(obj) {
    if (obj instanceof Object && !Array.isArray(obj) && obj != {}){
        return true;
    }

    return false;
}