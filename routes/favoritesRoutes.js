const express = require('express');
const { 
    getFavoritesView, 
    getFavorites, 
    addFavorite, 
    removeFavorite 
} = require('../controllers/favoritesController');
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

//------------- WEB -------------
// [GET] http://localhost:3000/favorites - Vista de favoritos
router.get('/favorites', authMiddleware, getFavoritesView);

// -------------API--------------
// [GET] http://localhost:3000/api/favorites - Obtener películas favoritas
router.get('/api/favorites', authMiddleware, getFavorites);

// [POST] http://localhost:3000/api/favorites - Añadir favorito
router.post('/api/favorites', authMiddleware, addFavorite);

// [DELETE] http://localhost:3000/api/favorites/:id - Eliminar favorito
router.delete('/api/favorites/:id', authMiddleware, removeFavorite);

module.exports = router;