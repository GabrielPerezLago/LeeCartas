import { showCards, readJson , whiteList , findByName, countCards, createCard, deleteCard, updateCard} from "./JS/jsonManager.js";
import { createRequire } from 'module';

let dataJs = {};
const dataJson = "./Data/cartas.json";
const require = createRequire(import.meta.url);
const prompt = require('prompt-sync')();

async function main(){
    dataJs = await readJson(dataJson);
    console.log(dataJs);

    const list = whiteList(dataJs);
    const contaCartas = "Hay un total de " + countCards(dataJs) + " cartas.";
    console.log(contaCartas);
     
    findByName(dataJs, "pedro", list);

    // Interfaz
    var action = prompt('Dime que quieres hacer ?: ').toLowerCase();

    switch(action) {
        case 'mostrar' : showCards(dataJs);
        break;
        case 'buscar' : (() => {
            var name = prompt('Inserta la carta que quieres buscar: ').toLowerCase();
            findByName(dataJs, name.toLowerCase() , list);
        })();
        break;

        case 'crear' : (() => {
            const nombre = { nombre : prompt('Inserte el nombre de la carta: ').toLowerCase()};
            const titulo = Object.values(nombre);
            const rareza = { rareza : prompt('Inserte la rareza de la carta:').toLowerCase()};
            const poder = { poder : parseInt(prompt('Inserte el poder de la carta :'), 10)};
            const velocidad = { velocidad : parseInt(prompt('Inserte la velidad de la carta: '), 10)};

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

        case 'editar' : (() => {
            const nombre = prompt("Que carta quieres actualizar? :").toLowerCase();
            console.log(dataJs[nombre]);

            if (!dataJs.hasOwnProperty(nombre)){
                console.error('Error: Esta carta no existe, intentalo de nuevo.');
                return;
            }
            
            let actualizar = true;
            //Objeto que se enviara a la funcion que actualza el json;
            let updateData = {};
            while(actualizar) {
                const doEdit = prompt('Que deseas editar?: ');

                switch(doEdit) {
                    case 'nombre' : (() => {
                        editPrompt('Introduce el nuevo nombre: ', updateData, doEdit);
                    })();
                    break;
                    
                    case 'rareza' : (() => {
                        editPrompt('Introduce la nueva rareza:  ', updateData, doEdit);
                    })();
                    break;

                    case 'poder' : (() => {
                        editPrompt('Introduce su nuevo nivel de fuerza: ', updateData, doEdit, 'int');
                    })();
                    break;

                    case 'velocidad' : (() =>  {
                        editPrompt('Introduce su nuevo nivel de velocidad: ', updateData, doEdit, 'int');
                    })();
                }
                console.log(updateData);
                let kill = prompt('Deseas seguir editando?: ').toLowerCase();

                if (kill == 'no'){
                    actualizar = false;
                }

                
            }

            const sendData = {};
            sendData[nombre] = updateData;
            console.log(sendData);
            updateCard(dataJs, sendData, dataJson);

        })();
    }
    
}

/**
 * 
 * @param {*} promp 
 * @param {*} objData 
 * @param {*} key 
 * @param {*} type 
 * 
 * Recibe el promp del texto , un objeto y una clave para gardar en el objeto junto al valor
 * y un tipo de dato que por defecto se queda string.
 * 
 * Esta funcion con todos eses datos saca el texto del promp por consola y con los demas valores modifica el objeto introducido
 * con la clave introducida y el valor del promp guardadndo asi los datos en ese objeto.
 * 
 * Tipos:
 * 'string' : guarda los datos en formato texto en MINUSCULAS.
 * 'int' : guarda los datos parseandolos a numero entero. 
 */
function editPrompt(promp, objData, key, type = 'string') {
    let data;

    switch(type) {
        case 'int' : data = parseInt(prompt(promp), 10);
        break;

        default : data = prompt(promp).toLowerCase();
    }

    objData[key] = data; 

}


main();
