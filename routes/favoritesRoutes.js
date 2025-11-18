const express = require('express');
const { 
    getFavorites, 
    addFavorite, 
    removeFavorite 
} = require('../controllers/favoritesController');
// const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// [GET] http://localhost:3000/api/favorites - Películas favoritas
router.get('/api/favorites', getFavorites);

// [POST] http://localhost:3000/api/favorites - Añadir favorito
router.post('/api/favorites', addFavorite);

// [DELETE] http://localhost:3000/api/favorites/:id - Eliminar favorito
router.delete('/api/favorites/:id', removeFavorite);


// ‼️‼️‼️‼️‼️‼️ CAMBIAR POR LAS RUTAS SIN AUTENTICACIÓN CUANDO TENGAMOS AUTH HECHA

// // [GET] http://localhost:3000/api/favorites - Películas favoritas
// router.get('/api/favorites', isAuthenticated, getFavorites);

// // [POST] http://localhost:3000/api/favorites - Añadir favorito
// router.post('/api/favorites', isAuthenticated, addFavorite);

// // [DELETE] http://localhost:3000/api/favorites/:id - Eliminar favorito
// router.delete('/api/favorites/:id', isAuthenticated, removeFavorite);

module.exports = router;