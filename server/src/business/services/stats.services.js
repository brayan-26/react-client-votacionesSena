const statsRepository = require("../../persistence/repository/stats.repository");

//funcion de obtener estadisticas totales
const getEstadisticas = async () => {
  //se llama al repositorio de las estadisrticas a la funcion de obtener los votos, se le pasa la respectiva jornada
  const statsMañana = await statsRepository.getVotos(1);
  const statsTarde = await statsRepository.getVotos(2);
  const statsNoche = await statsRepository.getVotos(3);
  const statsVirtual = await statsRepository.getVotos(4);
  const statsBlanco = await statsRepository.getVotosBlanco();

  console.log(statsTarde)
  //en caso de que no sea null se ejecuta el algoritmo de separacion de candidatos y cantidad de votos
  if (
    statsMañana &&
    statsTarde &&
    statsNoche &&
    statsVirtual &&
    statsBlanco != null
  ) {
    //se cuentas cuantos votos tiene cada persona, y se adjunta con la cedula del candidato
    const votosMañana = countVotos(statsMañana[0]);
    const votosTarde = countVotos(statsTarde[0]);
    const votosNoche = countVotos(statsNoche[0]);
    const votosVirtual = countVotos(statsVirtual[0]);
    const votosBlancos = countVotosBlanco(statsBlanco[0]);
    console.log(statsTarde)


    //se guarda el objeto con todos los datos en objetos de votosJornada
    const allStats = { votosMañana, votosTarde, votosNoche, votosVirtual, votosBlancos };

    return {message:"estadisticas",status:200,info:allStats}

  } else {
    //en caso de que la consulta haya fallado se devuelve un mensaje de error y un codigo de estatus
    return { message: "error en el servidor", status: 500 };
  }


  function countVotosBlanco(array) {
    const mapa = {};
    array.forEach((e) => {
      mapa[e.jornada] = e.cantidad_votos_blanco;
    });
    return mapa;
  }

  //funcion de contar los votos
  function countVotos(statsArray) {
    //recibe el array de las estadisticas de la jornada
    const list = []
    const mapa = {};
    //se crea un objeto
    statsArray.forEach((e) => {
      //se recorre el array de las estadisticas de los candidatos
      mapa['nombre'] = e.nombre_votante
      mapa['apellido'] = e.apellido_votante
      mapa['cedula'] = e.cedula_candidato
      mapa['ciudad'] = e.ciudad_votante
      mapa['jornada'] = e.nombre_jornada
      mapa['cantidad_votos'] = e.cantidad_votos
      list.push(mapa)
    });


    return list
  }
};

module.exports = {
  getEstadisticas,
};
