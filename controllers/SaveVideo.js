const getDB = require('../database/getDB');
const { generateError } = require('../helpers');

const SaveVideo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { urlVideo, title } = req.body;

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
      `INSERT INTO videos (urlVideo, title)
        VALUES (?, ?)`,
      [urlVideo, title]
    );

    res.send({
      status: 'ok',
      message: '¡Video guardado con éxito!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = SaveVideo;
