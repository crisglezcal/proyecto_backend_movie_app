const pool = require('../config/db_sql');
const Film = require('../models/films.model');


// [GET] /api/favorites - Películas favoritas (API)

const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await pool.query(
            'SELECT id_film FROM fav_films WHERE id_user = $1',
            [userId]
        );
        
        const favoriteIds = result.rows.map(row => row.id_film);
        const favorites = await Film.find({ id_film: { $in: favoriteIds } });
        
        res.json({
            success: true,
            count: favorites.length,
            data: favorites
        });
    } catch (error) {
        console.error('Error en getFavorites:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener favoritos'
        });
    }
};

// [POST] /api/favorites - Añadir película a favoritos

const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { film_id } = req.body;

        if (!film_id) {
            return res.status(400).json({
                success: false,
                error: 'El ID de la película es requerido'
            });
        }

        // Verificar si la película existe en MongoDB
        const filmExists = await Film.findOne({ id_film: film_id });
        if (!filmExists) {
            return res.status(404).json({
                success: false,
                error: 'Película no encontrada'
            });
        }

        // Verificar si ya es favorita
        const existingFavorite = await pool.query(
            'SELECT * FROM fav_films WHERE id_user = $1 AND id_film = $2',
            [userId, film_id]
        );

        if (existingFavorite.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'La película ya está en favoritos'
            });
        }

        // Añadir a favoritos
        await pool.query(
            'INSERT INTO fav_films (id_user, id_film) VALUES ($1, $2)',
            [userId, film_id]
        );

        res.status(201).json({
            success: true,
            message: 'Película añadida a favoritos',
            film_id: film_id
        });

    } catch (error) {
        console.error('Error en addFavorite:', error);
        res.status(500).json({
            success: false,
            error: 'Error al añadir a favoritos'
        });
    }
};

// [DELETE] /api/favorites/:id - Eliminar película de favoritos

const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const film_id = req.params.id;

        // Eliminar de favoritos
        const result = await pool.query(
            'DELETE FROM fav_films WHERE id_user = $1 AND id_film = $2',
            [userId, film_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Película no encontrada en favoritos'
            });
        }

        res.json({
            success: true,
            message: 'Película eliminada de favoritos',
            film_id: film_id
        });
        
    } catch (error) {
        console.error('Error en removeFavorite:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar de favoritos'
        });
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite
};