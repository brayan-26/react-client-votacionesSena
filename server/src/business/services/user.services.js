const { stat } = require("fs");
const userRepository = require("../../persistence/repository/user.repository");

const loginUser = async (info) => {
  let votacionActivada = true; //colocar en false al sacarlo a produccion

  const fechaActual = new Date();
  const fechaLimiteMinima = new Date(
    new Date().getFullYear(),
    2,
    11,
    6,
    0,
    0,
    0
  );
  const fechaLimiteMaxima = new Date(
    new Date().getFullYear(),
    2,
    11,
    0,
    0,
    0,
    0
  );

  if (fechaActual > fechaLimiteMinima && fechaActual < fechaLimiteMaxima) {
    votacionActivada = true;
  }

  if (votacionActivada) {
    if (info.cedula && info.ficha) {
      if (isNaN(info.cedula) || isNaN(info.ficha)) {
        if (info.cedula == "colombia62T" && info.ficha == "622022*") {
          return { rol: "admin", message: "autenticado", status: 202 };
        } else {
          return {
            message: "ecriba ficha o cedula valida (numero)",
            status: 400,
          };
        }
      } else {
        const cedula = parseInt(info.cedula);
        const ficha = parseInt(info.ficha);

        const status = await userRepository.getUserInf([cedula, ficha]);
        if (status) {
          if (status[0].length > 0) {
            const userID = status[0][0].id_votantes;
            const cedula = status[0][0].cedula;

            const jornada = await userRepository.getVotanteJornada([ficha]);

            const jornadaID = jornada[0][0].jornada;

            return {
              rol: "user",
              message: "autenticado",
              jornadaID,
              userID,
              cedula,
              status: 202,
            };
          } else {
            return { message: "no existe cedula o ficha", status: 404 };
          }
        } else {
          return { message: "error interno del servidor", status: 500 };
        }
      }
    } else {
      return { message: "espacios en blanco", status: 400 };
    }
  } else {
    return {
      message: "las votaciones ya acabaron o aun no comienzan",
      status: 401,
    };
  }
};

const verifyVoto = async (data) => {
  //se llama el repositorio del usuario para llamar la funcion de obtener la jornadad pero esta vez del candidato recibe la jornada del aprendiz logeado
  const jornada = await userRepository.getCandidatoJornada([data.candidatoID]);
  if (jornada) {
    //si la consula fue exitosa obtiene los resultados de esta
    if(!jornada[0].length > 0){
      //pregunta si la devolvio algo la consulta y si es distinto de vacio si no es asi es por que metio un id del candidato que no existe
      return { message: "no existe ese candidato", status: 404 };
      //se envia el mensaje de error y el status
    }else{
    if (jornada[0][0].jornada == data.jornadaID) {
      //si existen resultados compara con la jornada que obtubo del candidato con la jornada del aprendiz logeado
      const voto = await userRepository.getFecha([data.userID]);
      //llama al repositorio del usuario para usar la funcion de obtener fecha para verificar si existe ya el voto
      if (voto) {
        //en caso de que la consulta sea exitosa pregunta si existen resultados
        if (voto[0].length > 0) {
          //si existen resultados devuelve el mensaje de error puesto que ya hay un voto asociado entre el aprendiz logeado
          return {
            message: "la persona ya voto",
            fecha: voto[0][0].fecha,
            status: 400,
          };
        } else {
          //en caso de que no exista un voto asociado le da un mensaje de exito y el codigo de status
          return { message: "la persona puede votar", status: 200 };
        }
      } else {
        //en caso de que la consulta no devuelva nada manda mensaje de error del servidor y el codigo de status
        return { message: "error interno del servidor", status: 500 };
      }
    } else {
      //en caso de que las jornadas del usuario y la jornada del candidato no sean las mismas, se envia el emnsaje de error y el codigo de status
      return {
        message:
          "se esta votanto de otra jornada que no es la del usuario logeado",
        status: 400,
      };
    }
  }
  } else {
      //en caso de que la consulta no devuelva nada manda mensaje de error del servidor y el codigo de status
    return { message: "error interno del servidor", status: 500 };
  }
};

const insertVoto = async (votos) => {
  const inserted = await userRepository.insertVotos(votos);
  if (inserted) {
    return { message: "la persona realizo el voto", status: 201 };
  } else {
    return { message: "error interno del servidor", status: 500 };
  }
};

module.exports = {
  loginUser,
  verifyVoto,
  insertVoto,
};
