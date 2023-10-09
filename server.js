const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');

// Creamos servidor express
const app = express();

const { PORT } = process.env;

// Problemas con Cors a la hora de realizar peticiones a servidor, lo solucionamos de la siguiente manera
app.use(cors());

app.options('*', cors());

// Desserializa body en formato raw
app.use(express.json());

app.use(morgan('dev'));

// Middleware para leer body en formato form-data
app.use(fileUpload());

app.use(express.static('static'));

/*
  #############################
  ### Imports Controladores ###
  #############################
*/

const { GetPhotosController, SavePhotos } = require('./controllers');

/*
  #################
  ### Endpoints ###
  #################
*/

app.get('/', (req, res) => {
  res.send({
    status: 'Ok',
    message: '¡Petición recibida con éxito!',
  });
});

// Obtener las fotos para la página de muestra
app.get('/photos', GetPhotosController);

// Guardar nuevas fotos en el servidor
app.post('/photos/new', SavePhotos);

/*
  #####################################
  ### Middlewares Error y Not Found ###
  #####################################
*/

app.use((error, req, res, _) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'Error',
    message: error.message,
  });
});

// Middleware not found

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
