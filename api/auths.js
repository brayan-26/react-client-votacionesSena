import axios from 'axios'


// Se define la URL base del servidor back-end
// const API = "https://votacionessena.up.railway.app";
const API = "http://localhost:8080";

// Realiza una solicitud de inicio de sesión al servidor back-end.
export const loginRequest = (values) => axios.post(`${API}/api/v2/login`, values)

export const getCandidatos = (token) => axios.get(`${API}/api/v2/candidatos`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});


export const voto = (token, values) =>
    axios.post(`${API}/api/v2/votos`, { candidatoID: values }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });