const getDB = require('../database/getDB');
const { generateError, savePhoto } = require('../helpers');

const SavePhotos = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { collection } = req.query;

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
        const photoName = await savePhoto(photo, collection); // indicamos la coleccion a la que pertenece

        // insertamos referencia en bbdd
        await connection.query(
          `INSERT INTO photos (name, collection)
            VALUES (?, ?)`,
          [photoName, collection]
        );
      }
    } else {
      // Si es una única foto
      const photoName = await savePhoto(req.files.photos, collection);

      await connection.query(
        `INSERT INTO photos (name, collection)
            VALUES (?, ?)`,
        [photoName, collection]
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
