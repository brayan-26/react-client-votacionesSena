const userService = require("../../business/services/user.services");
const statsService = require("../../business/services/stats.services");
const jwt = require("jsonwebtoken");


//funcion para iniciar sesion 
const postLogin = async (req, res) => {

  //llama al servicio del usuario para validar credenciales
  const status = await userService.loginUser(req.body); //recibe credenciales por el body de la peticion

  //si estatus devolvio 202, puede ser tanto admin como administrador, revisar el rol
  if (status.status == 202) {
    //si es administrador, recibas las estadisticas de las votaciones hasta el momento (todas las jornadas)
    if (status.rol == "admin") {
      //se crea el jwt con la informacion del admin
      const options = { expiresIn: "500m" };
      const userInf = {
        rol: "admin",
      };
      const token = jwt.sign(userInf, process.env.SK, options);
      //se envia el token, mensaje de autenticado, y todas las estadisticas de todas las jornadas
      res.header("Authorization", `Bearer ${token}`);

      res.status(status.status).json({
        message: status.message,
      });

      //se recibe del servicio los datos del aprendiz 
    } else if (status.rol == "user") {
      //se crea el jwt
      const userInf = {
        rol: "user",
        userID: status.userID,
        jornadaID: status.jornadaID,
        cedula: status.cedula,
      };

      const options = { expiresIn: "15m" };
      const token = jwt.sign(userInf, process.env.SK, options);

  

      //se envia el token, el mensaje de validacion y la informacion de los candidatos de la jornada en especifico
      res.header("Authorization", `Bearer ${token}`);

      res.status(status.status).json({
        message: status.message,
      });


    }
    //se envia el codigo de status y el error correspondiente en caso de errores
  } else {
    res.status(status.status).json(status.message);
  }
};

//funcion para insetar los votos
const postVotos = async (req, res) => {
  //si el rol recivido por el token es user, se empiezxa
  if (req.result.rol == "user") {
    //recibe por el body el id del candidato, por el cual el aprendiz voto (el id de todos los candidatos de la jornada del aprendiz se dio cuando este se logeo)
    const candidatoID = req.body.candidatoID;
    //recie por el token verificado y devuelto, el id del aprendiz y la jornada del mismo
    const userID = parseInt(req.result.userID);
    const jornadaID = req.result.jornadaID;

    if(candidatoID == 99999){
      const voto = await userService.insertVotoBlanco({
        userID,
        candidatoID,
        jornadaID,
      })

      res.status(voto.status).json(voto.message);


    }else{
      //se llama al servicio del usuario para verificar la validez del voto (se le mandan los 3 datos antes mencionados)
    const voto = await userService.verifyVoto({
      userID,
      candidatoID,
      jornadaID,
    });
    
    if (voto.status == 200) {
      //si la verificacion fue correcta se llamar al servicio del usuario de crear el voto en la DB
      const status = await userService.insertVoto([candidatoID, userID]);
      if (status.status == 201) {
        //si  el crear el voto fue exitoso, se envia el status y el mensaje de exito
        res.status(status.status).json(status.message);
      } else {
        //si  el crear el voto NO fue exitoso, se envia el status y el mensaje de error
        res.status(status.status).json(status.message);
      }
    } else {
      //si la verificacion no fue exitosa envia el codigo de estatus y el error
      res.status(voto.status).json(voto.message);
    }
    }
  } else {
    //si el rol no es usuario, se le deniega el acceso a poder votar
    res.status(401).json({ mensaje: "denegado" });
    
  }
};

const getCandidatos = async (req,res)=>{
  if (req.result.rol == "user") {
    const status = req.result.jornadaID
    const info = await userService.getCandidatoInfo(status);
    if(info.status == 200){
      res.status(info.status).json({
        message:info.message,
        info:info.info
      })
    }else{
      res.status(info.status).json({message:info.message})
    }
  }else{
    res.status(401).json({ message: "denegado" });
  }
    
}

const getEstadisticas = async(req,res)=>{
  if (req.result.rol == "admin") {
    const stats = await statsService.getEstadisticas();
    console.log(stats.info)
    if(stats){
      res.status(stats.status).json({message:stats.message, info:stats.info})
    }else{
      res.status(info.status).json({message:info.message})
    }
  }else{
    res.status(401).json({ message: "denegado" });
  }
 
}

module.exports = {
  postLogin,
  postVotos,
  getCandidatos,
  getEstadisticas
};
