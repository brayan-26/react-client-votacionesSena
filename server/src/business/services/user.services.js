const userRepository = require("../../persistence/repository/user.repository");

//servicio de verificar credenciales del aprendiz o administrador
const loginUser = async (info) => {
  //se crea una funcion para validar si la fecha actual es en la que se inicia las votaciones  recibe cedula y ficha

  let votacionActivada = true; //colocar en false al sacarlo a produccion

  const fechaActual = new Date();
  //cambiar las fechas si se quiere probar con otros dias con minima y maxima correspondientemente
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

  //pregunta si la fecha actuale es valida
  if (fechaActual > fechaLimiteMinima && fechaActual < fechaLimiteMaxima) {
    votacionActivada = true;
  }

  //si la fecha es valida se empieza a validar las credenciales
  if (votacionActivada) {
    //se pregunta si existe la cedula y la ficha
    if (info.cedula && info.ficha) {
      //pregunta si la cedula y la ficha es un numero ES OBLIGATORIO QUE LOS CAMPOS DEL FORMULARION SEAN TIPO TEXTO Y NO NUMBER
      if (isNaN(info.cedula) || isNaN(info.ficha)) {
        //en caso de que existan letras se valida si son las credenciales exactas del administrador, SE PODRIAN USAR VARIABLES DE ENTORNO
        if (info.cedula == "colombia62T" && info.ficha == "622022*") {
          //si es asi se envia el rol, el mensaje y el codigo de status
          return { rol: "admin", message: "admin autenticado", status: 202 };
        } else {
          return {
            //en caso de que no sean las credenciales de administrador se envia mensaje de error y codigo de status
            message: "ecriba ficha o cedula valida (numero)",
            status: 400,
          };
        }
        //si ambos son numeros se parsean para que queden como enteros y se guardan en variables
      } else {
        const cedula = parseInt(info.cedula);
        const ficha = parseInt(info.ficha);

        //se llama al repositorio del usuario para usar la funcion de obtener informacion del aprendiz (mandadole cedula y ficha)
        const status = await userRepository.getUserInf([cedula, ficha]);
        if (status) {
          //en caso de que la consulta sea exitosa se checha si trae algo consigo
          if (status[0].length > 0) {
            //en caso de que si traiga datos se obtiene el userID y la cedula para mandarlos a la siguiente funcion
            const userID = status[0][0].id_votantes;
            const cedula = status[0][0].cedula;

            //se llama al repositorio del usuario a la funcion de obtener la jornada del aprendiz logeado pasandole le la ficha
            const jornada = await userRepository.getVotanteJornada([ficha]);
            //aqui no hay ningun try and catch pero se podria crear en caso de que la consulta falle - segun mi logica no deberia de fallar pero se puede implementar
            const jornadaID = jornada[0][0].jornada;
            //se retorna un objeto con la informacion del usuario logeado, un mensaje de autenticacion y el codigo de status
            return {
              rol: "user",
              message: "user autenticado",
              jornadaID,
              userID,
              cedula,
              status: 202,
            };
            //en caso de que la consulta haya sido exitosa pero no traiga nada se envia el mensaje de error y el codigo de status
          } else {
            return { message: "no existe cedula o ficha", status: 404 };
          }
        } else {
          //en caso de que no haya sido exitosa la consulta se envia error del servidor y el codigo de status
          return { message: "error interno del servidor", status: 500 };
        }
      }
      //en caso de que no exita alguna de las dos se envia el codigo de status y el mensaje de error
    } else {
      return { message: "espacios en blanco", status: 400 };
    }
  } else {
    //si la fecha aun no es la correcta se envia mensaje de status y codigo de error
    return {
      message: "las votaciones ya acabaron o aun no comienzan",
      status: 401,
    };
  }
};

//funcion para obtener informacion de todos los candidatos de la jornada del aprendiz logeado recibe la jornada del aprendiz
const getCandidatoInfo = async (jornada) => {
  //se llama al repositorio del usuaruio para obtener la informacion
  const info = await userRepository.getCandidatoInfo(jornada);
  //se retorna todos los candidatos de la jornada con su informacion
  if(info){
    return {message:"candidatos obtenidos",status:200,info:info[0]};
  }else{
    return { message: "error interno del servidor", status: 500 };
  }
};

//funcion para verificar si el voto es valido
const verifyVoto = async (data) => {
  //se llama el repositorio del usuario para llamar la funcion de obtener la jornadad pero esta vez del candidato recibe la jornada del aprendiz logeado
  const jornada = await userRepository.getCandidatoJornada([data.candidatoID]);
  console.log;
  if (jornada) {
    //si la consula fue exitosa obtiene los resultados de esta
    if (!jornada[0].length > 0) {
      //pregunta si la devolvio algo la consulta y si es distinto de vacio si no es asi es por que metio un id del candidato que no existe
      return { message: "no existe ese candidato", status: 404 };
      //se envia el mensaje de error y el status
    } else {
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
//funcion para crear el voto
const insertVoto = async (votos) => {
  //se llama al repositorio del usuario a la funcion de crear el voto, recibe el id del candidato y el id del usuario
  const inserted = await userRepository.insertVotos(votos);
  // como ya se verifico el voto en la funcion anterior, se crea directamente en la base de datos
  if (inserted) {
    //si la consulta fue bien, se manda mensaje de exito y el codigo de status
    return { message: "la persona realizo el voto", status: 201 };
  } else {
    //si la consulta fue MAL, se manda mensaje de ERROR y el codigo de status
    return { message: "error interno del servidor", status: 500 };
  }
};

const insertVotoBlanco = async (data) => {
  const voto = await userRepository.getFechaBlanco([data.userID]);
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
      //se llama funcion para insertar el voto en blanco
      const votoBlanco = await userRepository.insertVotoBlanco([
        data.jornadaID,
        data.userID,
      ]);
      if (votoBlanco) {
            //si la consula fue exitosa devuelve un mensaje de exito y codigo 201
        return { message: "la persona realizo el voto", status: 201 };
      } else {
        //si la consula no fue exitosa devuelve un mensaje de error del servidor y codigo 500
        return { message: "error interno del servidor", status: 500 };
      }
    }
  } else {
    //en caso de que la consulta no devuelva nada manda mensaje de error del servidor y el codigo de status
    return { message: "error interno del servidor", status: 500 };
  }
};
module.exports = {
  loginUser,
  getCandidatoInfo,
  verifyVoto,
  insertVoto,
  insertVotoBlanco,
};
