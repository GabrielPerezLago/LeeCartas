import { Long } from "mongodb";
import { createCartaMongo, findAllCartasMongo, findByNameCartasMongo, deleteCartaMongo, upodateCartaMongo } from "../../models/mongo/cartasMongoModel.js";
import { findAllRarezaMongo, findByNameRarezaMongo, getIdRarezaMongo } from "../../models/mongo/rarezaMongoModel.js";
import { inObject } from "../../Utils/jsUtils.js";

export async function findCartasMongoCotroller() {
    try {
        const data = await findAllCartasMongo();
        return data;
    } catch(ex) {
        console.error(ex);
    }
}

export async function findByNameCartasMogoController(name) {
    try {
        const filter = await filterInpuit({nombre: name});
        if(filter != true && Array.isArray(filter)){
            const err = filter.join(' .. ');
            throw new Error(err);
        }

        const data = await findByNameCartasMongo(name);
        return data;
    } catch(ex) {
        console.error(ex);
    }
}

export async function createCartaMongoController(carta) {
    try{
        const filter = await filterInpuit(carta, 1);

        if (filter != true && Array.isArray(filter)) {
            const err = filter.join(` .. `);
            throw new Error(err);
            process.exit(1);
        }

        if(inObject(carta, 'rareza')) {
            const idRareza = await getIdRarezaMongo(carta.rareza);
            carta[`id_rareza`] = idRareza;
            delete carta.rareza;
        }
        const card = await createCartaMongo(carta, nameCarta);

        return card;

        
    } catch(ex) {
        console.error(ex);
    }
}

export async function deleteCartaMongoController(nombre) {
    try {
        const filter = await filterInpuit({nombre: nombre});
        if(filter != true) {
            const er = filter.join(` .. `);
            throw new Error(er);
        }

        const del = await deleteCartaMongo(nombre);
        return del;
    } catch (ex) {
        console.error(ex);
    }
}

export async function updateCartaMongoController(carta, nameCarta) {
    try {
        const filter = await filterInpuit(carta, 1);
        if(filter != true) {
            const er = filter.join(` .. `);
            throw new Error(er);
        }

        if (inObject(carta, 'rareza')){
            const idRareza = await getIdRarezaMongo(carta.rareza);
            carta[`id_rareza`] = idRareza;
            delete carta.rareza;
        }

        const upd = await upodateCartaMongo(carta, nameCarta);
        return upd;
    } catch(ex) {
        console.error(ex);
    }
    
}

async function filterInpuit(cartas, namExist = 0) {
    const errors = new Array();

    if (inObject(cartas, 'nombre')){
        if(!cartas.nombre instanceof String ) {
            errors.push('El nombre debe de ser de tipo : Capo de texto');
        }
        
        if (namExist == 0) {
            if(!await findByNameCartasMongo(cartas.nombre, true)){
                errors.push("La carta no existe");
            }
        } else if (namExist == 1) {
            if(await findByNameCartasMongo(cartas.nombre, true)){
                errors.push("La carta ya existe");
            }
        }
    }

    if (inObject(cartas, 'rareza')) {
        if(!cartas.rareza instanceof String){
            errors.push('La rareza debe de ser de tipo : Capo de texto');
        }

        if(!await findByNameRarezaMongo(cartas.rareza, true)) {
            errors.push('La Rareza introducida no existe');
        }
    }

    if (inObject(cartas, 'poder')){
       

        if (cartas.poder < 0 || cartas.poder > 100 ) {
            errors.push('El poder introducido debe estar comprendido entre 0 y 100');
        }
    }

    if (inObject(cartas, 'velocidad')){
    

        if (cartas.velocidad < 0 || cartas.velocidad > 100 ) {
            errors.push('La velocidad introducida debe estar comprendido entre 0 y 100');
        }
    }

    

    return errors.length > 0 ? errors : true; 
}