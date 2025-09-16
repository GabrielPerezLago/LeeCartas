import { readJson , whiteList , findByName} from "./JS/jsonManager.js";

let dataJs = {};
const dataJson = "./Data/cartas.json";


async function main(){
    dataJs = await readJson(dataJson);
    console.log(dataJs);

    const list = 
    whiteList(dataJs);

    findByName(dataJs, "marcos", list);
}




main();
