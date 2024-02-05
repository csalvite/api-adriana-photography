const getDB = require('./getDB');

async function main() {
  let connection;

  try {
    connection = await getDB();

    // Eliminamos las tablas si existen
    await connection.query('DROP TABLE IF EXISTS photos');
    await connection.query('DROP TABLE IF EXISTS collections');
    await connection.query('DROP TABLE IF EXISTS videophotos');
    await connection.query('DROP TABLE IF EXISTS videos');
    await connection.query('DROP TABLE IF EXISTS user');
    await connection.query('DROP TABLE IF EXISTS citaDoble');
    console.log('Tablas eliminadas...');

    // Creamos las tablas
    console.log('Creando tablas...');

    await connection.query(
      `CREATE TABLE IF NOT EXISTS collections (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        collection VARCHAR(200) NOT NULL,
        title VARCHAR(200),
        description VARCHAR(500)
      )`
    );

    await connection.query(
      `CREATE TABLE IF NOT EXISTS photos(
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          idCollection INT UNSIGNED NOT NULL
      )`
    );

    await connection.query(
      `CREATE TABLE IF NOT EXISTS videos (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        urlVideo VARCHAR(255) NOT NULL,
        title VARCHAR(500),
        description VARCHAR(500)
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

    await connection.query(
      `CREATE TABLE IF NOT EXISTS user (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(30) UNIQUE NOT NULL,
        name VARCHAR(30) NOT NULL,
        password VARCHAR(255) NOT NULL,
        registrationCode VARCHAR(100),
        createdAt DATETIME NOT NULL
      )`
    );

    // Tabla para las imagenes de cita doble para otra web
    await connection.query(
      `CREATE TABLE IF NOT EXISTS citaDoble (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL
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
