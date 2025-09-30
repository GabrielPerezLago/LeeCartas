import { createCard, deleteCard, findAllCards, findByName, getCardId } from "../../models/mysql/cartasModel.js";
import { inObject } from "../../Utils/jsUtils.js";
import { findByRareza } from "../../models/mysql/rarezaModel.js";

export async function findAllCardsController() {
    try {
        const cards = await findAllCards();

        if (cards.length < 0) {
            throw new Error('Algo a ocurrido mal, intentalo mas tarde');
        }
        return cards;
    } catch (ex) {
        console.error(ex);
    }
}


export async function findByNameCardCotroller(name, bol = false) {

    try {
        const filter = await filterInput({ nombre: name }, 1);

        if (filter != true) {
            const err = filter.join(' :: ');
            throw new Error(err);
        }

        const find = bol == false ? await findByName(name) : await findByName(name, true);
        return find;
    } catch (ex) {
        console.error(ex);
    }

}

export async function getIdCardController(name) {
    const validacion = await filterInput({ nombre: name }, 1);
    if (validacion != true) {
        validacion.join(' :: ');
        throw new Error(validacion);
    }

    const id = getCardId(name);

    return id;
}

export async function createCardController(card) {
    try {
        const filter = await filterInput(card, 0);

        if (filter != true) {
            filter.join(' :: ');
            throw new Error(filter);
        }

        card.id = await getIdCardController(card.nombre);

        const carta = await createCard(card);
        return carta;
    } catch (ex) {
        console.error(ex);
    }
}

export async function deleteCardController(name) {
    try{

        const filter = await filterInput(name);

        if (filter != true) {
            filter.join(' :: ');
            throw new Error(filter);
        }

        const carta = await deleteCard(name);
        return carta;

    } catch(ex) {
        console.error(ex);
    }
}

export async function updateCardController(card) {
    try {
        const filter = await filterInput(card);

        if (filter !=  true) {
            filter.join(' :: ');
            throw new Error(filter);
        }

        const carta = await updateCard(card);
        return carta;
    } catch (ex) {
        console.error(ex);
    }
} 



/**
 * 
 * @param {*} data 
 * @param {*} id 
 * 
 * 
 * Esta funcion se encarga de comprobar que los datos insertados en consola sean validos
 * antes de enviarlos a la base de datos.
 * Comprueba: 
 * nombre : Que el nombre Introducido exista o no (id : 1 pora comprobar que el nombre exista, id = 0 para asegurarse de que el nombre no exista).
 * rareza : Que la Rareza Exista.
 * poder : Que el nivel introducido este comprendido entre 0 y 100.
 * velocidad : Que el nivel este comprendido entre 0 y 100.
 * 
 * 
 * @returns 
 */
export async function filterInput(data, id = 1) {
    let errors = new Array();

    if (inObject(data, 'nombre')) {
        if (id == 1) {
            if (! await findByNameCardCotroller(data.nombre, true)) {
                errors.push('Error: El nombre no existe');
            }
        } else if (id == 0) {
            if (await findByNameCardCotroller(data.nombre, true)) {
                errors.push('Error: El nombre ya existe');
            }
        }
    }

    if (inObject(data, 'rareza')) {
        if (! await findByRareza(data.rareza, true)) {
            errors.push('Error: La rareza no existe')
        }
    }

    if (inObject(data, 'poder')) {
        if (data.poder < 0 && obj.poder > 100) {
            errors.push('Error: El nivel de poder debe de estar establecido entre 0 y 100.');
        }
    }

    if (inObject(data, 'velocidad')) {
        if (data.velocidad < 0 && data.velocidad > 100) {
            errors.push('Error: El nivel de velocidad debe de estar establecido entre 0 y 100.');
        }
    }

    return errors.length > 0 ? errors : true;
}