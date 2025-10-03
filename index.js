import { showCards, readJson, whiteList, findByNameJson, countCards, createCardJson, deleteCardJson, updateCardJson } from "./app/models/json/jsonManager.js";
import { createRequire } from 'module';
import { checkWhitelistData, inObject } from "./app/Utils/jsUtils.js";
import { createCardController, deleteCardController, findAllCardsController, findByNameCardCotroller, getIdCardController, updateCardController } from "./app/Controllers/mysql/cartasController.js";
import { findCartasMongoCotroller, findByNameCartasMogoController, createCartaMongoController, deleteCartaMongoController, updateCartaMongoController } from "./app/Controllers/mongo/cartasMongoController.js";
import { verify } from "crypto";
import { dirname } from "path";

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

    const db = 'mongo' //prompt('Deseas acceder al servidor(Base de Datos): "db",  o a los datos locales(JSON) "json"? : ').toLowerCase();
    const whiteList = ['text', 'json', 'mysql', 'mongo'];

    if (!checkWhitelistData(db, whiteList)) {
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
            switch (db) {
                case 'mysql': (async () => {
                    const cartas = await findAllCardsController();
                    console.log(cartas);
                    process.exit(1);
                })();
                    break;
                case 'mongo': (async () => {
                    const carta = await findCartasMongoCotroller();
                    console.log(carta);
                    process.exit(1);
                })();
            }
        })();
            break;

        //Buscar Cartas por nombre
        case 'buscar': (async () => {
            const name = prompt('Inserta la carta que quieres buscar: ').toLowerCase();
            switch (db) {
                case 'json': (() => {
                    findByNameJson(dataJs, name.toLowerCase(), list);
                })();
                    break;

                case 'mysql': (async () => {
                    const carta = await findByNameCardCotroller(name);
                    console.log(carta);
                    process.exit(1);
                })();
                break;

                case 'mongo' : (async () => {
                    const carta = await findByNameCartasMogoController(name);
                    console.log(carta);
                    process.exit(1);
                })();
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

            switch(db){
                case 'json' : (() => {
                    const carta = { [titulo]: datos };
                    console.log(carta);
                    createCardJson(dataJs, carta, dataJson);

                })();
                break;

                case 'mysql' : (async () => {
                    const insert = await createCardController(datos);
                    const creacion = insert ? 'Se a creado la carta correctamente' : 'Algo a ocurrido mal la carta no se a creado';
                    console.log(creacion);

                    process.exit(1);
                })();
                break;

                case `mongo` : (async () => {
                    const insert = await createCartaMongoController(datos);
                    const create = insert ? 'Se ha creado la carta Correctamente' : 'No se a creado la carta';
                    console.log(create);

                    process.exit(1);
                })() ;
            }
        })();
            break;

        // Eliminar Cartas
        case 'eliminar': (async () => {
            const nombre = prompt("Que carta deseas eliminar? : ").toLowerCase();

            switch (db) {
                case `json` : (() => {deleteCardJson(dataJs, nombre, dataJson);})();
                break;

                case `mysql` : (async () => {
                    const del = await deleteCardController(nombre);
                    del == true ? console.log('La carta ' + nombre + ' se ha eliminado correctamente') : console.log('Algo a ocurrido mal, ' + nombre + ' la carta no a podido ser eliminada');
                    process.exit(1);
                })();
                break;

                case `mongo` : (async () => {
                    const del = await deleteCartaMongoController(nombre);
                    del == true ? console.log('La carta ' + nombre + ' se ha eliminado correctamente') : console.log('Algo a ocurrido mal, ' + nombre + ' la carta no a podido ser eliminada');
                    process.exit(1);
                })(); 
            }
        })();
            break;

        // Actualizar Cartas
        case 'editar': (async () => {
            const nombre = prompt("Que carta quieres actualizar? :").toLowerCase();

            let exist = null;

            switch(db) {
                case `json` : exist = inObject(dataJs, nombre);
                break;

                case `mysql` : exist = await findByNameCardCotroller(nombre, true);
                break;

                case `mongo` :  exist = await findByNameCartasMogoController(nombre, true);
                break;
            }

            if (!exist) {
                console.error('La carta introducida no existe.');
                process.exit(1);
            }


            


            let actualizar = true;
            //Objeto que se enviara a la funcion que actualza el json;
            let updateData = {};

            if (db == `mysql`) {
                const idCard = await getIdCardController(nombre);
                updateData = { id: idCard };
            }
            
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

            switch(db) {
                case `json` : ( () => {
                    const sendData = {};
                    sendData[nombre] = updateData;
                    console.log(sendData);
                    updateCardJson(dataJs, sendData, dataJson);
                })();
                break;

                case `mysql` : ( async () => {
                    const upd = await updateCardController(updateData);
                    upd ? console.log('Carta actualizada correctamente') : console.error('Carta no a sido actualizada');
                    process.exit(1);
                })() ;
                break;

                case `mongo` : ( async () => {
                    const upd = await updateCartaMongoController(updateData, nombre);
                    upd ? console.log('Carta actualizada correctamente') : console.error('Carta no a sido actualizada');
                    process.exit(1);
                })() ;
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


main();
