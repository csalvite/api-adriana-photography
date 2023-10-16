const getDB = require('../database/getDB');

const GetVideosController = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [videos] = await connection.query(`select * from videos`);

    let results = [];
    // Con las id de los videos voy a pedir las imágenes
    for (const video of videos) {
      const [videoPhotos] = await connection.query(
        `select * from videophotos where idVideo = ?`,
        [video.id]
      );

      results.push({
        ...video,
        photos: videoPhotos,
      });
    }

    res.send({
      status: 'ok',
      message: 'Videos obtenidos con éxito',
      videos: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = GetVideosController;
