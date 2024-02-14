const jwt = require("jsonwebtoken");

const validarToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    res.status(401).send({
      error: "es necesario el token",
    });
    return;
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (token) {
    try {
      const result = jwt.verify(token, process.env.SK);
      // console.log(result)
      req.result = result;
      next();
    } catch (error) {
      return res.status(400).json({
        message: "el token no es valido",
      });
    }
  }
};

module.exports = {
  validarToken,
};
