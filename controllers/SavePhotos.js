const getDB = require('../database/getDB');
const { generateError, savePhoto } = require('../helpers');

const SavePhotos = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idCollection } = req.query;

    const { nameCollection, title, description } = req.body;

    let [data] = await connection.query(
      `select * from collections where collection = ?`,
      [nameCollection]
    );

    // Si no existe la coleccion la creamos
    if (data.length < 1) {
      // Guardamos la colección en la bbdd y devolvemos su id
      await connection.query(
        `INSERT INTO collections (collection, title, description)
        VALUES (?, ?, ?)`,
        [nameCollection, title, description]
      );

      // Recuperamos el id de la coleccion
      [data] = await connection.query(
        `select * from collections where collection = ?`,
        [nameCollection]
      );
    }

    // Si no indica la nueva foto de producto, lanzamos un error
    if (!req.files || !req.files.photos) {
      throw generateError(
        '¡Debes indicar al menos una nueva foto a subir!',
        400
      );
    }

    // Guardamos las fotos en nuestro server y en base de datos
    if (req.files.photos?.length > 0) {
      // Si es más de una las recorremos y guardamos
      for (const photo of req.files.photos) {
        const photoName = await savePhoto(photo, data[0].collection); // indicamos la coleccion a la que pertenece

        // insertamos referencia en bbdd
        await connection.query(
          `INSERT INTO photos (name, idCollection)
            VALUES (?, ?)`,
          [photoName, data[0].id]
        );
      }
    } else {
      // Si es una única foto
      const photoName = await savePhoto(req.files.photos, data[0].collection);

      await connection.query(
        `INSERT INTO photos (name, idCollection)
            VALUES (?, ?)`,
        [photoName, data[0].id]
      );
    }

    res.send({
      status: 'Ok',
      message: '¡Fotos guardadas correctamente!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = SavePhotos;
