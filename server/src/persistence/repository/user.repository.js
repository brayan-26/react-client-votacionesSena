const db = require('../../config/db')

const getUserInf = async (cedula) => {
    try {
        const status = await db.query(`SELECT id_votantes, cedula 
        FROM votantes 
        JOIN fichas ON votantes.ficha = fichas.id_fichas 
        WHERE cedula = ? AND fichas.codigo = ?`, cedula)
        return status
    } catch (error) {
        console.log(error)
        return null
    }
}

const getVotanteJornada = async (ficha) => {
    try {
        const jornada = await db.query(`SELECT jornada 
        FROM fichas 
        WHERE codigo = ?`, ficha)
        return jornada
    } catch (error) {
        console.log(error)
        return null
    }
}

const getCandidatoJornada = async (userID) => {
    try {
        const ficha = await db.query(`SELECT fichas.jornada
        FROM candidatos
        JOIN votantes ON candidatos.id_votantes_candidatos = votantes.id_votantes
        JOIN fichas ON votantes.ficha = fichas.id_fichas
        WHERE candidatos.id_candidatos = ?;`, userID)
        return ficha
    } catch (error) {
        console.log(error)
        return null
    }
}

const getFecha = async (userID) => {
    try {
        const voto = await db.query(`SELECT fecha 
        FROM votos 
        WHERE id_votante = ?`, userID)
        return voto
    } catch (error) {
        console.log(error)
        return null
    }
}

const insertVotos = async (voto) => {
    try {
        const inserted = await db.query(`INSERT INTO votos (id_candidato, fecha, id_votante) 
        VALUES (?,NOW(),?)`, voto)
        return inserted
    } catch (error) {
        console.log(error)
        return null
    }
}


module.exports = {
    getUserInf,
    getVotanteJornada,
    getFecha,
    insertVotos,
    getCandidatoJornada,

}