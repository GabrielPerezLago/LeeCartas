import { readJson , whiteList , findByName, countCards, createCard, deleteCard, updateCard} from "./JS/jsonManager.js";
import { createRequire } from 'module'; 

let dataJs = {};
const dataJson = "./Data/cartas.json";


async function main(){
    dataJs = await readJson(dataJson);
    console.log(dataJs);

    const list = whiteList(dataJs);
    const contaCartas = "Hay un total de " + countCards(dataJs) + " cartas.";
    console.log(contaCartas);
     
    findByName(dataJs, "pedro", list);

    const require = createRequire(import.meta.url);
    const prompt = require('prompt-sync')();

    // Interfaz
    var action = 'actualizar' //prompt('Dime que quieres hacer ?: ').toLowerCase();

    switch(action) {
        case 'buscar' : (() => {
            var name = prompt('Inserta la carta que quieres buscar: ').toLowerCase();
            findByName(dataJs, name.toLowerCase() , list);
        })();
        break;

        case 'crear' : (() => {
            var nombre = { nombre : prompt('Inserte el nombre de la carta: ').toLowerCase()};
            var titulo = Object.values(nombre);
            var rareza = { rareza : prompt('Inserte la rareza de la carta:').toLowerCase()};
            var poder = { poder : parseInt(prompt('Inserte el poder de la carta :'), 10)};
            var velocidad = { velocidad : parseInt(prompt('Inserte la velidad de la carta: '), 10)};

            const datos = {...nombre, ...rareza, ...poder, ...velocidad};
            const carta = { [titulo] : datos};

            console.log(carta);

            createCard(dataJs, carta, dataJson);

        })();
        break;

        case 'eliminar' : (() => {
            const nombre = prompt("Que carta deseas eliminar? : ").toLowerCase();
            deleteCard(dataJs, nombre, dataJson);
        })();
        break; 

        case 'actualizar' : (() => {
            const nombre = 'elfo'//prompt("Que carta quieres actualizar? :").toLowerCase();

            updateCard(dataJs, nombre, dataJson);

        })();
    }
    
}




main();
