const getDB = require('../database/getDB');

const GetCategories = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [categories] = await connection.query(`select * from collections`);

    const mapped = categories.map((cat) => {
      return {
        label: cat.collection,
        value: cat.collection,
      };
    });

    res.send({
      status: 'ok',
      categories: mapped,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = GetCategories;
