const Film = require('../models/films.model');  // ← Usar Film como alias
require('dotenv').config(); //para cargar
const fetchFilm = require('../utils/fetchFilms');

// [GET] /search/:title // Buscar películas
async function getAllMovies(req, res) {
  const title = req.params.title;

  try {
    // 1. Buscar primero en OMDB
    const film = await fetchFilm.fetchAllFilms(title);

    if (film) {
      return res.status(200).json(film);
    }

    // 2. Si no está en OMDB, buscar en MongoDB
    const localFilm = await Film.findOne({
      title: new RegExp(`^${title}$`, 'i') // búsqueda insensible a mayúsculas
    });

    if (localFilm) {
      return res.status(200).json(localFilm);
    }

    // 3. Si no existe en ninguna fuente
    return res
      .status(404)
      .json({ message: 'Film not found in OMDB or local database' });

  } catch (error) {
    console.error("Error retrieving movie:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}


module.exports = {
  getAllMovies
};