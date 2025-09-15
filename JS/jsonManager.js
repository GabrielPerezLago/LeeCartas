import fs from 'fs/promises';
export async function readJson(url) {
    try{
        const readDAta = await fs.readFile(url, 'utf-8');
        return JSON.parse(readDAta);
    } catch (err) {
        console.log("A habido un error en el lector del Json, Error : " + err);
    }
}

