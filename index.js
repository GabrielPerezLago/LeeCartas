import { showCards, readJson, whiteList, findByNameJson, countCards, createCardJson, deleteCardJson, updateCardJson } from "./app/models/json/jsonManager.js";
import { createRequire } from 'module';
import { findAllCards, findByName, createCard, deleteCard, updateCard, filterInput, getCardId } from "./app/models/mysql/cartasDAO.js";
import { inObject, printArrayTexts } from "./app/Utils/jsUtils.js";


// Constantes Globales para manejar los datos y las funciones necesarias.
// Esta constante guarda los datos del json parseados a objeto JS.
let dataJs = {};
// Esta es la constante que apunta directamente a la direccion del JSON.
const dataJson = "./Data/cartas.json";

//Funciones de librerias de node que estoy usando , y son necesarias de usar globalmente.
const require = createRequire(import.meta.url);
const prompt = require('prompt-sync')();

/**
 * Funcion global que ejecuta el progama.
 * 
 * Se encarga de interactuar con el usuario.
 */
async function main() {

    const db = 'db' //prompt('Deseas acceder al servidor(Base de Datos): "db",  o a los datos locales(JSON) "json"? : ').toLowerCase();

    if (db !== 'db' && db !== 'json') {
        console.error("Error: Se deben insertar uno de los tipos de base de datos mostrados anteriormente, '" + db + "' no es un dato valido. ");
        process.exit(1);
    }
    if (db === 'json') {
        // Se encarga de guardar los datos del Json en objeto JS.
        dataJs = await readJson(dataJson);
        console.log(dataJs);

        const list = whiteList(dataJs);
        const contaCartas = "Hay un total de " + countCards(dataJs) + " cartas.";
        console.log(contaCartas);
    }

    // Interfaz
    var action = prompt('Dime que quieres hacer ?: ').toLowerCase();

    switch (action) {
        // Mostar las Cartas
        case 'mostrar': (async () => {
            if (db === "db") {
                const cartas = await findAllCards();
                console.log(cartas);
                process.exit(1);
            }
        })();
            break;

        //Buscar Cartas por nombre
        case 'buscar': (async () => {
            const name = prompt('Inserta la carta que quieres buscar: ').toLowerCase();
            if (db === 'json') {
                findByNameJson(dataJs, name.toLowerCase(), list);
            } else if (db === 'db') {
                const carta = await findByName(name);
                console.log(carta);
                process.exit(1);
            }
        })();
            break;

        // Crear cartas 
        case 'crear': (async () => {
            const nombre = { nombre: prompt('Inserte el nombre de la carta: ').toLowerCase() };
            const titulo = Object.values(nombre);
            const rareza = { rareza: prompt('Inserte la rareza de la carta:').toLowerCase() };
            const poder = { poder: parseInt(prompt('Inserte el poder de la carta :'), 10) };
            const velocidad = { velocidad: parseInt(prompt('Inserte la velidad de la carta: '), 10) };

            const datos = { ...nombre, ...rareza, ...poder, ...velocidad };

            if (db === 'json') {
                const carta = { [titulo]: datos };
                console.log(carta);
                createCardJson(dataJs, carta, dataJson);

            } else {
                const insert = await createCard(datos);
                const creacion = insert ? 'Se a creado la carta correctamente' : 'Algo a ocurrido mal la carta no se a creado';
                console.log(creacion);

                process.exit(1);
            }
        })();
            break;

        // Eliminar Cartas
        case 'eliminar': (async () => {
            const nombre = prompt("Que carta deseas eliminar? : ").toLowerCase();
            if (db === 'json') {
                deleteCardJson(dataJs, nombre, dataJson);
            } else {
                const del = await deleteCard(nombre);
                del == true ? console.log('La carta ' + nombre + ' se ha eliminado correctamente') : console.log('Algo a ocurrido mal, ' + nombre + ' la carta no a podido ser eliminada');
                process.exit(1);
            }
        })();
            break;
        // Actualizar Cartas
        case 'editar': (async () => {
            const nombre = prompt("Que carta quieres actualizar? :").toLowerCase();
            
            const exist = db === 'json' ? inObject(dataJs, nombre) : await findByName(nombre, true);
            
            if (!exist){
                console.error('La carta introducida no existe.');
                process.exit(1);
            }

            const idCard = await getCardId(nombre);

            let actualizar = true;
            //Objeto que se enviara a la funcion que actualza el json;
            let updateData = {};
            updateData = {id : idCard};
            console.log(updateData);
            while (actualizar) {
                const doEdit = prompt('Que deseas editar?: ');

                switch (doEdit) {
                    case 'nombre': (() => {
                        editPrompt('Introduce el nuevo nombre: ', updateData, doEdit);
                    })();
                        break;

                    case 'rareza': (() => {
                        editPrompt('Introduce la nueva rareza:  ', updateData, doEdit);
                    })();
                        break;

                    case 'poder': (() => {
                        editPrompt('Introduce su nuevo nivel de fuerza: ', updateData, doEdit, 'int');
                    })();
                        break;

                    case 'velocidad': (() => {
                        editPrompt('Introduce su nuevo nivel de velocidad: ', updateData, doEdit, 'int');
                    })();
                }
                console.log(updateData);
                let kill = prompt('Deseas seguir editando?: ').toLowerCase();

                if (kill == 'no') {
                    actualizar = false;
                }
            }

            if (db === 'json') {
                const sendData = {};
                sendData[nombre] = updateData;
                console.log(sendData);
                updateCardJson(dataJs, sendData, dataJson);
            } else {
                const checkErros = await filterInput(updateData, 0);
                if (checkErros != true) {
                    printArrayTexts(checkErros);
                } else {
                    const upd = await updateCard(updateData);
                    upd ? console.log('Carta actualizada correctamente') : console.error('Carta no a sido actualizada');
                }
                process.exit(1);
            }


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
 * default -> 'string' : guarda los datos en formato texto en MINUSCULAS.
 * 'int' : guarda los datos parseandolos a numero entero. 
 */
function editPrompt(promp, objData, key, type = 'string') {
    let data;

    switch (type) {
        case 'int': data = parseInt(prompt(promp), 10);
            break;

        default: data = prompt(promp).toLowerCase();
    }

    objData[key] = data;

}

function validateImportData(data) {

}


main();
