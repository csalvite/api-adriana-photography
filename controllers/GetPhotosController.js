const getDB = require('../database/getDB');

const GetPhotosController = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [data] = await connection.query(`select * from photos`);

    // agrupamos las imágenes según la categoria a la que pertenecen y las devolvemos
    const groupedData = data.reduce((acc, item) => {
      const { collection } = item;

      // Si la colección ya existe en el resultado, agregamos el elemento a su array
      if (acc[collection]) {
        acc[collection].push(item);
      } else {
        // Si no existe, creamos un nuevo array con el elemento
        acc[collection] = [item];
      }

      return acc;
    }, {});

    res.send({
      status: 'Ok',
      message: 'Ahi van las fotooooos',
      data: groupedData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = GetPhotosController;
