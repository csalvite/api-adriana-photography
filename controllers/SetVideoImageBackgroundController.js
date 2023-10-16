const getDB = require('../database/getDB');
const { generateError, savePhotoVideoBackground } = require('../helpers');

const SetVideoImageBackgroundController = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idVideo } = req.query;

    // Si no indica la nueva foto de producto, lanzamos un error
    if (!req.files || !req.files.photos) {
      throw generateError(
        '¡Debes indicar al menos una nueva foto a subir!',
        400
      );
    }

    const [video] = await connection.query(
      `select * from videos where id = ?`,
      [idVideo]
    );

    if (video.length !== 1) {
      throw generateError('No existe el video en base de datos.', 400);
    }

    // Guardamos las fotos en nuestro server y en base de datos
    if (req.files.photos?.length > 0) {
      // Si es más de una las recorremos y guardamos
      for (const photo of req.files.photos) {
        const photoName = await savePhotoVideoBackground(photo);

        // insertamos referencia en bbdd
        await connection.query(
          `INSERT INTO videophotos (photo, idVideo)
            VALUES (?, ?)`,
          [photoName, idVideo]
        );
      }
    }

    res.send({
      status: 'Ok',
      message: '¡Fotos del video guardadas correctamente!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = SetVideoImageBackgroundController;
