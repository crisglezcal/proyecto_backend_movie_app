
const express = require('express');



const router = express.Router();
//------------- WEB -------------
//[GET] http://localhost:3000/favorites 
router.get('/favorites');

// -------------API--------------
//[GET] http://localhost:3000/api/favorites Obtener películas favoritas del usuario
router.get('/api/favorites'); // Listar favoritos
//[POST] http://localhost:3000/api/favorites Guardar favorito del usuario
router.post('/api/favorites'); // Añadir favorito
//[DELETE] http://localhost:3000/api/favorites Borrar favorito del usuario
router.delete('/api/favorites/:id'); // Quitar favorito


module.exports = router;
