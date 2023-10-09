const getDB = require('./getDB');

async function main() {
  let connection;

  try {
    connection = await getDB();

    // Eliminamos las tablas si existen
    await connection.query('DROP TABLE IF EXISTS photos');
    console.log('Tablas eliminadas...');

    // Creamos las tablas
    console.log('Creando tablas...');

    await connection.query(
      `CREATE TABLE IF NOT EXISTS photos(
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                collection VARCHAR(200) NOT NULL
            )`
    );

    console.log('Tablas creadas con exito!');
  } catch (err) {
    console.error(err.message);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
