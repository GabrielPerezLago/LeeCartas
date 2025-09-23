import { createRequire } from 'module';


const require = createRequire(import.meta.url);
const mysql = require('mysql2/promise');
require('dotenv').config();

export async function connection() {
    try {
        const HOST = process.env.DB_HOST;
        const USUARIO = process.env.DB_USER;
        const PASS = process.env.DB_PASS;
        const DATA = process.env.DB_NAME;
        const PORT = process.env.DB_PORT;
        
        const connection = await mysql.createConnection({
            host: HOST,
            user: USUARIO,
            password: PASS,
            database: DATA,
            port: PORT
        });
        return connection;
    } catch (err){
        console.error("Error: A ocurriodo un error al conectarse a la base de datos. Error =>  " + err);
        process.exit(1);
    }
}


