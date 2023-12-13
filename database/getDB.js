require('dotenv').config();
const mysql = require('mysql2/promise');

// importamos las variables de entorno necesarias para la conexion
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_DBPORT } =
  process.env;

const getDB = async () => {
  let pool;

  try {
    if (!pool) {
      // Creamos un grupo de conexiones
      pool = mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        port: MYSQL_DBPORT,
        timezone: 'Z',
      });

      // Ejecutamos el método getConnection y devolvemos una conexión libre
      return await pool.getConnection();
    }
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = getDB;
