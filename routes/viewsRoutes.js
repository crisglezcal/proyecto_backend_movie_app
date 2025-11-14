//vistas generales o estáticas del sitio (sin lógica de usuario/películas)
const express = require('express');



const router = express.Router();
//------------- WEB -------------
//[GET] http://localhost:3000/ 
router.get('/'); // Vista de inicio
//[GET] http://localhost:3000/dashboard 
router.get('/dashboard'); // Panel de control
// -------------API--------------


module.exports = router;
