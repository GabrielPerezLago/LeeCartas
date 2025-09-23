import { connection } from '../Data/connectionDB.js';


const SELECT_CARTAS = 'SELECT c.nombre, r.rareza as rareza, c.poder, c.velocidad FROM CARTAS c INNER JOIN RAREZA r ON c.id_rareza = r.id'

export async function findAllCards() {
    const conn = await connection();
    const [cartas] = await conn.execute(SELECT_CARTAS);
    return cartas;
}