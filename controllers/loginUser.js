const getDB = require('../database/getDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    // Obtenemos el email y el password que pedimos.
    const { username, password } = req.body;

    // Si falta algún campo lanzamos un error.
    if (!username || !password) {
      const error = new Error(
        'Para acceder hacen falta los campos de username y contraseña'
      );
      error.httpStatus = 400;
      throw error;
    }

    // Comprobamos si existe un usuario con ese email.
    const [user] = await connection.query(
      `SELECT * FROM user WHERE username = ?`,
      [username]
    );

    // Variable que almacenará un valor booleano: contraseña correcta o incorrecta.
    let validPassword = false;

    // Sino hay un  usuario con ese email comprobamos que la contraseña sea
    // correcta.
    if (user.length > 0) {
      // Comprobamos que la contraseña sea correcta.
      validPassword = await bcrypt.compare(password, user[0].password);
    }

    // Si no existe ningún usuario con ese email o si la contraseña es incorrecta.
    if (user.length < 1 || !validPassword) {
      const error = new Error('Email o contraseña incorrectos');
      error.httpStatus = 401;
      throw error;
    }

    // Objeto con la información que le vamos a pasar al token.
    const tokenInfo = {
      id: user[0].id,
    };

    // Creamos el token.
    const token = jwt.sign(tokenInfo, process.env.SECRET, {
      expiresIn: '10d',
    });

    res.send({
      status: 'ok',
      token,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = loginUser;
