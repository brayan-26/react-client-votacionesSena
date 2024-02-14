const db = require("../../config/db");

const getVotos = async (jornada) => {
  try {
    const votos = await db.query(`SELECT
    vt.nombre AS nombre_candidato,
    COUNT(v.id_votos) AS cantidad_votos
FROM
    votos v
JOIN
    candidatos c ON v.id_candidato = c.id_candidatos
JOIN
    votantes vt ON c.id_votantes_candidatos = vt.id_votantes
JOIN
    fichas f ON vt.ficha = f.id_fichas
JOIN
    jornadas j ON f.jornada = j.id_jornada
WHERE
    j.id_jornada = ?
GROUP BY
    c.id_candidatos, vt.nombre
ORDER BY
    cantidad_votos DESC;
`,jornada)
    return votos
  } catch (error) {
    console.log(error)
  }
};


module.exports = {
    getVotos
}
