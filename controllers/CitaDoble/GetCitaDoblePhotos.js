const getDB = require('../../database/getDB');

const GetCitaDoblePhotos = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [photos] = await connection.query(`select * from citaDoble`);

    res.send({
      status: 'Ok',
      message: 'Ahi van las fotooooos',
      data: photos,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = GetCitaDoblePhotos;
