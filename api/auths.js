import axios from 'axios'


// Se define la URL base del servidor back-end
const API = "http://localhost:8080";

// Realiza una solicitud de inicio de sesión al servidor back-end.
export const loginRequest = (values) => axios.post(`${API}/api/v2/login`, values)