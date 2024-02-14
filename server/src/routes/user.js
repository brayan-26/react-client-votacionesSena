const express = require('express')
const router = express.Router()
const  {postLogin,getMain,getVotos,getEstadisticas,postSi} = require('../presentation/controller/user.controller')
const {validarToken} = require('../middlewares/auth.middleware')

router.post('/api/user/login',postLogin)
    .post('/api/user/votos',validarToken,getVotos)
    .get('/api/estadisticas',validarToken,getEstadisticas)
    .get('/',getMain)
    .post('/si',postSi)



module.exports = router 