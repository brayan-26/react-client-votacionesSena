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
  const jornada = await userRepository.getCandidatoJornada([data.candidatoID]);
  if (jornada) {
    if (jornada[0][0].jornada == data.jornadaID) {
      const voto = await userRepository.getFecha([data.userID]);
      if (voto) {
        if (voto[0].length > 0) {
          return {
            message: "la persona ya voto",
            fecha: voto[0][0].fecha,
            status: 400,
          };
        } else {
          return { message: "la persona puede votar", status: 200 };
        }
      } else {
        return { message: "error interno del servidor", status: 500 };
      }
    } else {
      return {
        message:
          "se esta votanto de otra jornada que no es la del usuario logeado",
        status: 400,
      };
    }
  } else {
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
