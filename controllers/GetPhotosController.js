const getDB = require('../database/getDB');

const GetPhotosController = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [data] = await connection.query(`select * from collections`);

    const result = [];
    // Por cada colección hacemos una peticion a la tabla de photos
    for (const collection of data) {
      const [photos] = await connection.query(
        `select * from photos where idCollection = ?`,
        [collection.id]
      );
      //result[collection.collection] = photos;
      result.push({ ...collection, photos: photos });
    }

    res.send({
      status: 'Ok',
      message: 'Ahi van las fotooooos',
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = GetPhotosController;
