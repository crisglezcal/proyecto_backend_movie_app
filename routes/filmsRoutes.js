//Todo lo relacionado con peliculas
const express = require('express');

const router = express.Router();
//------------- WEB -------------
//[GET] http://localhost:3000/search 
router.get('/search'); // Buscador

//[GET] http://localhost:3000/search/:title
router.get('/search/:title'); // Detalle

//[GET] http://localhost:3000/movies 
router.get('/movies'); // 

// -------------API--------------
//[GET] http://localhost:3000/api/movie/:title Buscar película o películas
router.get('/api/movie/:title');

//[POST] http://localhost:3000/api/movie Crear película (admin)
router.post('/api/movie');

//[PUT] http://localhost:3000/api/movie Editar película (admin)
router.put('/api/movie/:id');

//[DELETE] http://localhost:3000/api/movie Borrar película (admin)
router.delete('/api/movie/:id');

module.exports = router;
