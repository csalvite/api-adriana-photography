const { unlink, ensureDir } = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');

const { UPLOADS_DIRECTORY } = process.env;

// Funcion que crea un nuevo error
function generateError(message, code) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

// Funcion para insertar nuevas fotos
async function savePhoto(image, collection) {
  try {
    // Convertimos la imagen en un objeto sharp
    const sharpImage = sharp(image.data).jpeg({ quality: 50 });

    // Creamos la variable que guardara la ruta absoluta al directorio donde guardaremos la imagen dependiendo si es
    // de avatar o de producto

    // const processedImage = await sharpImage
    //   .jpeg({ quality: 70 }) // Ajuste la calidad JPEG según sus necesidades
    //   .toBuffer();

    // Generamos un nombre único para la imagen
    const imageName = uuid.v4() + '.jpg';

    // Según la colección seleccionada ubicaremos el directorio en el cual se guardará
    let imageDirectory = path.join(__dirname, UPLOADS_DIRECTORY, collection);

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

module.exports = {
  generateError,
  savePhoto,
};
