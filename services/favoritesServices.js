// services/favoritesService.js
const pool = require('../config/db_sql');

const getFavoritesByUser = async (userId) => {
    const result = await pool.query(
        `SELECT f.*
         FROM fav_films ff
         JOIN films f ON ff.id_film = f.id
         WHERE ff.id_user = $1`,
        [userId]
    );
    return result.rows;
};

const addFavorite = async (userId, filmId) => {
    // Verificar si ya es favorito
    const existing = await pool.query(
        'SELECT * FROM fav_films WHERE id_user = $1 AND id_film = $2',
        [userId, filmId]
    );

    if (existing.rows.length > 0) {
        throw new Error('La película ya está en favoritos');
    }

    await pool.query(
        'INSERT INTO fav_films (id_user, id_film) VALUES ($1, $2)',
        [userId, filmId]
    );

    return filmId;
};

const removeFavorite = async (userId, filmId) => {
    const result = await pool.query(
        'DELETE FROM fav_films WHERE id_user = $1 AND id_film = $2',
        [userId, filmId]
    );

    if (result.rowCount === 0) {
        throw new Error('Película no encontrada en favoritos');
    }

    return filmId;
};

module.exports = {
    getFavoritesByUser,
    addFavorite,
    removeFavorite
};
