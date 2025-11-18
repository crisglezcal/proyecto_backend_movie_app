const Film = require('../models/films.model');  //esto me trae el modelo especial de Mongoose para poder interactuar con mi colección
require('dotenv').config(); //para cargar
const fetchFilm = require('../utils/fetchFilms');

// [GET] /search/:title // Buscar películas
async function getAllMovies(req, res) {
  const title = req.params.title;

  try {
    const film = await fetchFilm.fetchAllFilms(title);     // 1. Buscar primero en OMDB

    if (film) {
      return res.status(200).json(film);
    }
    const localFilm = await Film.findOne({     // 2. Si no está en OMDB, buscar en MongoDB
      Title: new RegExp(`^${title}$`, 'i') // búsqueda insensible a mayúsculas
    });
    if (localFilm) {
      return res.status(200).json(localFilm);
    }

    return res  // 3. Si no existe en ninguna fuente
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