import { readJson } from "./JS/jsonManager.js";

let dataJs = {};
const dataJson = "./Data/cartas.json";


async function main(){
    dataJs = await readJson(dataJson);
    console.log(dataJs);
}

console.log("Buenass");


main();
