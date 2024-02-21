const createConnection = require("../../config/db");


//funcion para obtener informacion del usuario
const getUserInf = async (info) => {
  //creo la conexion dentro de la peticion
  const db = await createConnection();
  try {
    //la query 
    const status = await db.query(
      `SELECT id_votantes, cedula 
        FROM votantes 
        JOIN fichas ON votantes.ficha = fichas.id_fichas 
        WHERE cedula = ? AND fichas.codigo = ?`,
        //la cedula y ficha del usuario
      info
    );
    //si la consulta fue exitosa devuelve los resultados encontrados
    return status;
  } catch (error) {
    console.log(error);
     //en caso de que haya error en la consulta devuelve null para futuras comparaciones
    return null;
  } finally {
    //se cierra la conexion
    await db.end();
  }
};

//funcion para obtener la jornada del aprendiz logeado
const getVotanteJornada = async (ficha) => {
  const db = await createConnection();
  //se crea la conexion
  try {
    //la query
    const jornada = await db.query(
      `SELECT jornada 
        FROM fichas 
        WHERE codigo = ?`,
        //ficha del aprendixz logeado
      ficha
    );
     //si la consulta fue exitosa devuelve los resultados encontrados
    return jornada;
  } catch (error) {
    console.log(error);
    ///en caso de que haya error en la consulta devuelve null para futuras comparaciones
    return null;
  } finally {
    //se cierra la conexion
    await db.end();
  }
};

//funcion para obtener la informacion de todos los candidatos de una jornada
const getCandidatoInfo = async (jornada) => {
  //se crea la coneccion
  const db = await createConnection();
  try {
    //la query
    const candidatoInfo = await db.query(
      `SELECT  c.id_candidatos,vt.cedula,vt.nombre,vt.apellido,vt.ciudad,vt.ficha,c.img_candidato,c.img_tarjeton,c.tarjeton,c.plan_gob1,c.plan_gob2,c.plan_gob3,c.perfil_personal,c.slogan,j.jornada
FROM candidatos c
JOIN votantes vt ON c.id_votantes_candidatos = vt.id_votantes
JOIN fichas f ON vt.ficha = f.id_fichas
JOIN jornadas j ON f.jornada = j.id_jornada
WHERE j.id_jornada = ?;
`,
//se le pasa la jornada
      jornada
    );
    //si la consulta fue exitosa devuelve los resultados encontrados
    return candidatoInfo;
  } catch (error) {
    console.log(error);
    ///en caso de que haya error en la consulta devuelve null para futuras comparaciones
    return null;
  } finally {
    //se cierra la conexion
    await db.end();
  }
};

//obtiene la jornada del candidato que eligio el aprendiz logeado 
const getCandidatoJornada = async (userID) => {
  const db = await createConnection();
  //se crea la conexion
  try {
    // query
    const ficha = await db.query(
      `SELECT fichas.jornada
        FROM candidatos
        JOIN votantes ON candidatos.id_votantes_candidatos = votantes.id_votantes
        JOIN fichas ON votantes.ficha = fichas.id_fichas
        WHERE candidatos.id_candidatos = ?;`,
        //se le pasa el candidatoID, como el id del candidato a votar
      userID
    );
       //si la consulta fue exitosa devuelve los resultados encontrados
    return ficha;
  } catch (error) {
    console.log(error);
      ///en caso de que haya error en la consulta devuelve null para futuras comparaciones
    return null;
  } finally {
    //se cierra la conexion 
    await db.end();
  }
};

//obtiene la fecha de un voto hecho por el aprendiz logeado
const getFecha = async (userID) => {
  const db = await createConnection();
  //se crea la conexion
  try {
    //query
    const voto = await db.query(
      `SELECT fecha 
        FROM votos 
        WHERE id_votante = ?`,
        //se le pasa el id del aprendiz logeado
      userID
    );
    //si la consulta fue exitosa devuelve los resultados encontrados
    return voto;
  } catch (error) {
    console.log(error);
         ///en caso de que haya error en la consulta devuelve null para futuras comparaciones
    return null;
  } finally {
    //se cierra la conexion
    await db.end();
  }
};
const insertVotoBlanco = async(voto)=>{
  const db = await createConnection()
    //se crea la conexion 
  try{
    //query
    const inserted = await db.query(`
    INSERT INTO votos_blancos (jornada,id_votante,fecha) 
    VALUES (?,?,NOW())
    `,voto)
    return inserted
  }catch(error){
    console.log(error)
    ///en caso de que haya error en la consulta devuelve null para futuras comparaciones
    return null
  }finally{
    //se cierra la conexion
    await db.end();
  }
};
const getFechaBlanco = async (userID) => {
  const db = await createConnection();
  //se crea la conexion
  try {
    //query
    const voto = await db.query(
      `SELECT fecha 
        FROM votos_blancos 
        WHERE id_votante = ?`,
        //se le pasa el id del aprendiz logeado
      userID
    );
    //si la consulta fue exitosa devuelve los resultados encontrados
    return voto;
  } catch (error) {
    console.log(error);
         ///en caso de que haya error en la consulta devuelve null para futuras comparaciones
    return null;
  } finally {
    //se cierra la conexion
    await db.end();
  }
};
//funcion para crear los votos
const insertVotos = async (voto) => {
  const db = await createConnection();
  //se crea la conexion 
  try {
    //query
    const inserted = await db.query(
      `INSERT INTO votos (id_candidato, fecha, id_votante) 
        VALUES (?,NOW(),?)`,
        //se le pasa el id del aprendiz logeado y el id del candidato a votar
      voto
    );
    //si la consulta fue exitosa devuelve los resultados encontrados
    return inserted;
  } catch (error) {
    console.log(error);
      ///en caso de que haya error en la consulta devuelve null para futuras comparaciones
    return null;
  } finally {
    //se cierra la conexion
    await db.end();
  }
};

module.exports = {
  getUserInf,
  getVotanteJornada,
  getCandidatoInfo,
  getFecha,
  insertVotos,
  getCandidatoJornada,
  insertVotoBlanco,
  getFechaBlanco
};
