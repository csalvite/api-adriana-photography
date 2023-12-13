const getDB = require('../database/getDB');
const { generateError, savePhotoVideoBackground } = require('../helpers');

const SaveVideo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { urlVideo, title, description } = req.body;

    if (!(urlVideo || title)) {
      throw generateError(
        'Debes indicar los campos de url y titulo para poder insertar las referencias.',
        400
      );
    }

    const [video] = await connection.query(
      `select * from videos where urlVideo = ?`,
      [urlVideo]
    );

    if (video.length > 0) {
      throw generateError(
        'El video con la url proporcionada ya está guardado en base de datos.',
        400
      );
    }

    await connection.query(
      `INSERT INTO videos (urlVideo, title, description)
        VALUES (?, ?, ?)`,
      [urlVideo, title, description]
    );

    const [idVideo] = await connection.query(
      `select id from videos where urlVideo = ?`,
      [urlVideo]
    );

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
        const photoName = await savePhotoVideoBackground(photo);

        // insertamos referencia en bbdd
        await connection.query(
          `INSERT INTO videophotos (photo, idVideo)
            VALUES (?, ?)`,
          [photoName, idVideo[0].id]
        );
      }
    }

    res.send({
      status: 'ok',
      message: '¡Video guardado con éxito!',
      idVideo: idVideo[0].id,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = SaveVideo;
