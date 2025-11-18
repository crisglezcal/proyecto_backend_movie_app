// controllers/movieController.js
const Film = require('../models/films.model');  // ← Usar Film como alias
require('dotenv').config(); //para cargar
const fetchFilm = require('../utils/fetchFilms');


// [GET] /api/film/:title  // Buscar película por título (Usuario y Admin)
async function getMovieByTitle(req, res) {
  const title = req.params.title;

  try {
    // 1. Buscar primero en OMDB
    const film = await fetchFilm(title); 
    return res.status(200).json(film);

  } catch (error) {
    // Si OMDB devuelve 404, intentamos buscar en MongoDB
    if (error.status === 404) {
      try {
        const localFilm = await Film.findOne({ title: new RegExp(`^${title}$`, 'i') });

        if (localFilm) {
          return res.status(200).json(localFilm);
        } else {
          return res.status(404).json({ message: 'Film not found in OMDB or local database' });
        }
      } catch (dbError) {
        console.error(dbError);
        return res.status(500).json({ message: 'Database error' });
      }
    }

    // Otros errores (red, API caída, etc.)
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
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
function deleteMovie(req, res) {
  try {
    const { id } = req.body;
    res.status(200).json({ id, message: `Se ha borrado la película con ID: ${id}` });
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