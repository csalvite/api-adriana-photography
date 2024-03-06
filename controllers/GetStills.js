const getDB = require('../database/getDB');

const GetStills = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const result = [];

    const [photos] = await connection.query(`select * from stills`);
    //result[collection.collection] = photos;
    result.push(photos);

    res.send({
      status: 'Ok',
      message: 'Stills results:',
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = GetStills;
