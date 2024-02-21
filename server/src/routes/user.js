const express = require('express')
const router = express.Router()
const {postLogin,postVotos,getCandidatos,getEstadisticas} = require('../presentation/controller/user.controller')
const {validarToken} = require('../middlewares/auth.middleware')

router.post('/login',postLogin) //ruta para iniciar sesion como aprendiz o administrador
    .get('/candidatos',validarToken,getCandidatos)
    .post('/votos',validarToken,postVotos) //ruta para que el aprendiz vote
    .get('/estadisticas',validarToken,getEstadisticas)
 

 
module.exports = router 