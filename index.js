const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

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

// Configurar el límite de carga del cuerpo a 50 megabytes
// app.use(express.json({ limit: '50mb' }));

// Configuración para aumentar el límite del tamaño del cuerpo de la solicitud
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

/*
  #############################
  ### Imports Controladores ###
  #############################
*/

const {
  GetPhotosController,
  SavePhotos,
  SaveVideo,
  GetVideosController,
  loginUser,
  newUser,
  GetCategories,
} = require('./controllers');

const isAuth = require('./middlewares/isAuth');

/*
  #################
  ### Endpoints ###
  #################
*/

app.get('/', (req, res) => {
  res.send({
    status: 'Ok',
    message: '¡Servidor a la escucha!',
  });
});

// Crea un nuevo usuario
app.post('/new', newUser);

// Acceder a la web como admin
app.post('/acceso', loginUser);

// Obtener las fotos para la página de muestra
app.get('/photos', GetPhotosController);

// Obtiene una lista de las categorias de photos
app.get('/categories', GetCategories);

// Guardar nuevas fotos en el servidor
app.post('/photos/new', isAuth, SavePhotos);

// Guarda url del video en nuestra bbdd
app.post('/videos', isAuth, SaveVideo);

// Obtiene todos los videos
app.get('/videos', GetVideosController);

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
