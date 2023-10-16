const getDB = require('./getDB');

async function main() {
  let connection;

  try {
    connection = await getDB();

    // Eliminamos las tablas si existen
    await connection.query('DROP TABLE IF EXISTS photos');
    await connection.query('DROP TABLE IF EXISTS videophotos');
    await connection.query('DROP TABLE IF EXISTS videos');
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

    await connection.query(
      `CREATE TABLE IF NOT EXISTS videos (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        urlVideo VARCHAR(255) NOT NULL,
        title VARCHAR(500)
      )`
    );

    await connection.query(
      `CREATE TABLE IF NOT EXISTS videophotos (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        photo VARCHAR(255) NOT NULL,
        idVideo INT UNSIGNED NOT NULL,
        FOREIGN KEY (idVideo) REFERENCES videos(id)
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
