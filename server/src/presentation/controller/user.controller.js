const userService = require("../../business/services/user.services");
const statsService = require("../../business/services/stats.services");

const jwt = require("jsonwebtoken");

const getMain = async (req, res) => {
  res.send("hola mundo");
};

const postSi = async(req,res)=>{
  res.json({
    mensaje:'estoy respondiendo'
  })
}

const postLogin = async (req, res) => {
  const status = await userService.loginUser(req.body);
  if (status.status == 202) {
    if (status.rol == "admin") {
      const options = { expiresIn: "500m" };
      const userInf = {
        rol: "admin",
      };
      const token = jwt.sign(userInf, process.env.SK, options);
      res.status(status.status).json({
        token: token,
        message: status.message,
      });
    } else if (status.rol == "user") {
      const userInf = {
        rol: "user",
        userID: status.userID,
        jornadaID: status.jornadaID,
        cedula: status.cedula,
      };

      const options = { expiresIn: "15m" };
      const token = jwt.sign(userInf, process.env.SK, options);

      res.status(status.status).json({
        token: token,
        message: status.message,
      });
    }
  } else {
    res.status(status.status).json(status.message);
  }
};

const getVotos = async (req, res) => {
  if (req.result.rol == "user") {

    const candidatoID = req.body.candidatoID;

    const userID = parseInt(req.result.userID);

    const jornadaID = req.result.jornadaID;

    const voto = await userService.verifyVoto({
      userID,
      candidatoID,
      jornadaID,
    });
    if (voto.status == 200) {
      const status = await userService.insertVoto([candidatoID, userID]);
      if (status.status == 201) {
        res.status(status.status).json(status.message);
      } else {
        res.status(status.status).json(status.message);
      }
    } else {
      res.status(voto.status).json(voto.message);
    }
  }else{
    res.status(401).json({ mensaje: "denegado" });
  }
};

const getEstadisticas = async (req, res) => {

  const stats = await statsService.getEstadisticas()
  
  if (req.result.rol == "admin") {
    statsService
  } else {
    res.status(401).json({ mensaje: "denegado" });
  }
};

module.exports = {
  postLogin,
  getVotos,
  getMain,
  getEstadisticas,
  postSi
};