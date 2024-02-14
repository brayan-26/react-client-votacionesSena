const statsRepository = require("../../persistence/repository/stats.repository");

const getEstadisticas = async()=>{
   const votosMañana = await statsRepository.getVotos(1)
   const votosTarde = await statsRepository.getVotos(2)
   const votosNoche = await statsRepository.getVotos(3)
   const votosVirtual = await statsRepository.getVotos(4)

   console.log(votosTarde[0][0])

}


module.exports = {
    getEstadisticas
}