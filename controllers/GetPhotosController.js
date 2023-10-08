const GetPhotosController = async (req, res, next) => {
  try {
    res.send({
      status: 'Ok',
      message: 'Ahi van las fotooooos',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = GetPhotosController;
