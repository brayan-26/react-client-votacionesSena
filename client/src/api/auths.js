import axios from 'axios'; 

const API = "http://localhost:8080"; 

// ruta del login
export const loginRequest = user => axios.post(`${API}/api/user/login`, user);
export const voto = user => axios.post(`${API}/api/user/votos`, user)