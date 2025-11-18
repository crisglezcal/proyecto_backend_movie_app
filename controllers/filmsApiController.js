const Film = require('../models/films.model');  //esto me trae el modelo especial de Mongoose para poder interactuar con mi colección
require('dotenv').config(); //para cargar
const fetchFilm = require('../utils/fetchFilms');


// [GET] /api/film/:title  // Buscar una película por título (Usuario y Admin)
async function getMovieByTitle(req, res) {
  const title = req.params.title;

  try {
    // 1. Buscar primero en OMDB
    const film = await fetchFilm.fetchOneFilm(title); 
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



// [POST] /api/film Crear película (ADMIN)
function createMovie(req, res) {
  try {
    const filmTitle = req.body.Title || req.body.title;
    res.status(200).json({ message: `Se ha guardado ${filmTitle}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}



// [POST] /api/film // Crear película (ADMIN)
function createMovie(req, res) {
  try {
    const filmTitle = req.body.Title || req.body.title;
    res.status(200).json({ message: `Se ha guardado ${filmTitle}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}


// [PUT] /api/film Editar película (ADMIN)
function updateMovie(req, res) {
  try {
    const { id, Title, title } = req.body;
    const filmTitle = Title || title;
    res.status(200).json({ id, message: `Se ha actualizado ${filmTitle}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}


// [DELETE] /api/film Eliminar película (ADMIN)
async function deleteMovie(req, res) {
  try {
    const { title } = req.body;
    res.status(200).json({ title, message: `Se ha borrado la película con título: ${title}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports = {
  getMovieByTitle,
  createMovie,
  updateMovie,
  deleteMovie,
};