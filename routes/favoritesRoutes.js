const express = require('express');
const { 
    getFavorites, 
    addFavorite, 
    removeFavorite ,
    getFavoritesView
} = require('../controllers/favoritesController');
const authMiddleware = require('../middlewares/authMiddlewares');

const router = express.Router();

// [GET] http://localhost:3000/favorites - Películas favoritas
router.get('/favorites', authMiddleware, getFavoritesView);

// [GET] http://localhost:3000/api/favorites - Películas favoritas
router.get('/api/favorites/', getFavorites);

// [POST] http://localhost:3000/api/favorites - Añadir favorito
router.post('/api/favorites', addFavorite);

// [DELETE] http://localhost:3000/api/favorites/:id - Eliminar favorito
router.delete('/api/favorites/:id', removeFavorite);

module.exports = router;