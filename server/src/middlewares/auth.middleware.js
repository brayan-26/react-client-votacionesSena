const jwt = require("jsonwebtoken");

//middleware para validacion del token recibido a la hora de votar
const validarToken = async (req, res, next) => {
  //se recibe por los headers el token
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    //si el token no existe, se envia el error correspondiente
    res.status(401).send({
      error: "es necesario el token",
    });
    return;
  }
  //si el token empeiza con los caracteres "Bearer", se le quiten y se guardan en la variable
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  //si, si existe el token llama a la funcion verify de la liberia JWT para comprobar la validez del token
  if (token) {
    try {
      const result = jwt.verify(token, process.env.SK);
      //si el token es valido se guarda en la variable req.result
      req.result = result;
      next();
    } catch (error) {
      //si no es valido se envia el status y el mensaje de error
      return res.status(400).json({
        message: "el token no es valido",
      });
    }
  }
};

module.exports = {
  validarToken,
};
