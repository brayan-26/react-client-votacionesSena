require("dotenv").config();
const mysql = require("mysql2/promise");

//se crea la funcion de crear coneccion para exportarla

async function createConnection() {
  const connection = await mysql.createConnection({
    //se usan variables de entorno para trabajar con el servidor (o de manera local con el archivo .env)
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  return connection;
}

module.exports = createConnection;
