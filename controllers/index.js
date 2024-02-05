const GetCitaDoblePhotos = require('./CitaDoble/GetCitaDoblePhotos');
const SaveCitaDoblePhotos = require('./CitaDoble/SaveCitaDoblePhotos');
const GetCategories = require('./GetCategories');
const GetPhotosController = require('./GetPhotosController');
const GetVideosController = require('./GetVideosController');
const SavePhotos = require('./SavePhotos');
const SaveVideo = require('./SaveVideo');
const loginUser = require('./loginUser');
const newUser = require('./newUser');

module.exports = {
  GetPhotosController,
  SavePhotos,
  SaveVideo,
  GetVideosController,
  loginUser,
  newUser,
  GetCategories,
  SaveCitaDoblePhotos,
  GetCitaDoblePhotos,
};
