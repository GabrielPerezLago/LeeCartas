import { readJson , whiteList , findByName, countCards} from "./JS/jsonManager.js";


let dataJs = {};
const dataJson = "./Data/cartas.json";


async function main(){
    dataJs = await readJson(dataJson);
    console.log(dataJs);

    const list = whiteList(dataJs);
    const contaCartas = "Hay un total de " + countCards(dataJs) + " cartas.";
    console.log(contaCartas);
     
    findByName(dataJs, "pedro", list);

    const prompt = require('prompt-sync')();


    var action = prompt('Dime que quieres hacer ?');

    switch(action) {
        case 'buscar' : (() => {
            var name = prompt('Inserta la carta que quieres buscar: ');
            findByName(dataJs, name, list);
        })();
    }
    
}




main();
