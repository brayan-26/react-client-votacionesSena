const createConnection = require("../../config/db");

//funcion para obtener cedula nombre y cantidad de votos de cada candidato, respecto a una jornada dada
const getVotos = async (jornada) => {
  const db = await createConnection();
  //se crea la conexion
  try {
    //query
    const votos = await db.query(
      `SELECT vt.cedula AS cedula_candidato, 
      vt.nombre AS nombre_votante, 
      vt.apellido AS apellido_votante, 
      vt.ciudad AS ciudad_votante, 
      j.jornada AS nombre_jornada, 
      COALESCE(COUNT(v.id_votos), 0) AS cantidad_votos
FROM jornadas j
LEFT JOIN fichas f ON j.id_jornada = f.jornada
LEFT JOIN votantes vt ON f.id_fichas = vt.ficha
LEFT JOIN candidatos c ON vt.id_votantes = c.id_votantes_candidatos
LEFT JOIN votos v ON c.id_candidatos = v.id_candidato
WHERE j.id_jornada = ?
GROUP BY c.id_candidatos, vt.cedula, j.jornada
ORDER BY cantidad_votos DESC;

`,
//se le pasa la jornada a consultar
      jornada
    );
    //en caso de que la consulta sea exitosa se devuelve los resultados
    return votos;
  } catch (error) {
    console.log(error);
    //en caso de que la consulta no sea exitosa se devuelve null para futuras comparaciones
    return null
  } finally {
    //se cierra la conexion
    await db.end();
  }
};


//funcion para obtener cantidad de votos en blanco de cada jornada
const getVotosBlanco = async(jornada) =>{
  const db = await createConnection();
   //se crea la conexion
   try{
    const votos = await db.query(`SELECT j.jornada, COALESCE(COUNT(vb.id_blanco), 0) AS cantidad_votos_blanco
    FROM jornadas j
    LEFT JOIN votos_blancos vb ON j.id_jornada = vb.jornada
    GROUP BY j.id_jornada;
    `,jornada)
    return votos
   }catch(error){
    console.log(error)
      //en caso de que la consulta no sea exitosa se devuelve null para futuras comparaciones
    return null
   }finally{
      //se cierra la conexion
      await db.end();
   }

}

module.exports = {
  getVotos,
  getVotosBlanco
};
