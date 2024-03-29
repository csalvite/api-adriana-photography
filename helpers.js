const { unlink, ensureDir } = require('fs-extra');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');
const crypto = require('crypto');

const { CITA_DOBLE_STATIC } = process.env;

// Funcion que crea un nuevo error
function generateError(message, code) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

// Genera un string random para encriptar la contraseña
function generateRandomString(leght) {
  return crypto.randomBytes(leght).toString('hex');
}

// Funcion para insertar nuevas fotos
async function savePhoto(image, collection) {
  try {
    // Comprobamos que el directorio static existe
    const staticDir = path.join(__dirname, 'static');
    // Verificar si el directorio existe
    if (!fs.existsSync(staticDir)) {
      // Crear el directorio si no existe
      fs.mkdirSync(staticDir, { recursive: true });
    }

    // Convertimos la imagen en un objeto sharp
    const sharpImage = sharp(image.data);

    // Generamos un nombre único para la imagen
    const imageName = uuid.v4() + '.jpg';

    // Según la colección seleccionada ubicaremos el directorio en el cual se guardará
    // let imageDirectory = path.join(__dirname, UPLOADS_DIRECTORY, collection);
    let imageDirectory = path.join(staticDir, collection);

    ensureDir(imageDirectory);

    const saveDirectory = path.join(imageDirectory, imageName);

    // Guardamos la imagen
    await sharpImage.toFile(saveDirectory);

    // Retornamos el nombre "encriptado" de la imagen para guardarlo en base de datos
    return imageName;
  } catch (error) {
    console.error(error);
    throw new Error('Error al procesar la imagen');
  }
}

// Funcion para insertar nuevas fotos
async function saveCitaDoblePhoto(image) {
  try {
    // Comprobamos que el directorio static existe
    const staticDir = path.join(__dirname, CITA_DOBLE_STATIC);

    // Convertimos la imagen en un objeto sharp
    const sharpImage = sharp(image.data);

    // Generamos un nombre único para la imagen
    const imageName = uuid.v4() + '.jpg';

    const saveDirectory = path.join(staticDir, imageName);

    // Guardamos la imagen
    await sharpImage.toFile(saveDirectory);

    // Retornamos el nombre "encriptado" de la imagen para guardarlo en base de datos
    return imageName;
  } catch (error) {
    console.error(error);
    throw new Error('Error al procesar la imagen');
  }
}

async function savePhotoVideoBackground(image) {
  try {
    // Comprobamos que el directorio static existe
    const staticDir = path.join(__dirname, 'static');
    // Verificar si el directorio existe
    if (!fs.existsSync(staticDir)) {
      // Crear el directorio si no existe
      fs.mkdirSync(staticDir, { recursive: true });
    }

    // Convertimos la imagen en un objeto sharp
    const sharpImage = sharp(image.data); // .jpeg({ quality: 50 })

    // Generamos un nombre único para la imagen
    const imageName = uuid.v4() + '.jpg';

    // Según la colección seleccionada ubicaremos el directorio en el cual se guardará
    // let imageDirectory = path.join(
    //   __dirname,
    //   UPLOADS_DIRECTORY,
    //   'video-images'
    // );

    // ensureDir(imageDirectory);

    // const saveDirectory = path.join(imageDirectory, imageName);
    const saveDirectory = './static/video-images' + imageName;

    // Guardamos la imagen
    await sharpImage.toFile(saveDirectory);

    // Retornamos el nombre "encriptado" de la imagen para guardarlo en base de datos
    return imageName;
  } catch (error) {
    console.error(error);
    throw new Error('Error al procesar la imagen');
  }
}

module.exports = {
  generateError,
  savePhoto,
  savePhotoVideoBackground,
  generateRandomString,
  saveCitaDoblePhoto,
};
