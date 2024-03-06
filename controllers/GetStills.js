const getDB = require('../database/getDB');

const GetStills = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [photos] = await connection.query(`select * from stills`);
    //result[collection.collection] = photos;

    res.send({
      status: 'Ok',
      message: 'Stills results:',
      data: photos,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = GetStills;
