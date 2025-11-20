const Film = require('../models/films.model');
require('dotenv').config();
const fetchFilm = require('../utils/fetchFilms');
// [GET] /api/movie/:title - Buscar película por título
async function getMovieByTitle(req, res) {
  const title = req.params.title;
  try {
    const film = await fetchFilm.fetchOneFilm(title);
    if (film) {
      return res.status(200).json(film);
    }
    const localFilm = await Film.findOne({
      Title: new RegExp(`^${title}$`, 'i')
    });
    if (localFilm) {
      return res.status(200).json(localFilm);
    }
    return res.status(404).json({ message: 'Film not found in OMDB or local database' });
  } catch (error) {
    console.error("Error retrieving movie:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}
// [POST] /api/movie - Crear película (ADMIN)
async function createMovie(req, res) {
  try {
    // Verificar que el usuario es administrador
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Administrator privileges required.'
      });
    }
    const {
      Title, Year, Rated, Released, Runtime, Genre,
      Director, Actors, Plot, Poster, Ratings, Opinions
    } = req.body;
    // Generar un imdbID único
    const imdbID = `tt${Date.now()}`;
    // Procesar Ratings
    let ratingsArray = [];
    try {
      ratingsArray = typeof Ratings === 'string' ? JSON.parse(Ratings) : Ratings;
      ratingsArray = ratingsArray.map(rating => ({
        type: rating.Source?.toLowerCase() || 'imdb',
        Source: rating.Source || 'Internet Movie Database',
        Value: rating.Value || 'N/A'
      }));
    } catch (error) {
      return res.status(400).json({
        message: 'Invalid JSON format in Ratings'
      });
    }
    // Procesar Opinions
    let opinionsArray = [];
    try {
      opinionsArray = typeof Opinions === 'string' ? JSON.parse(Opinions) : Opinions;
      opinionsArray = opinionsArray.map(opinion => ({
        message: typeof opinion === 'string' ? opinion : opinion.message
      }));
    } catch (error) {
      return res.status(400).json({
        message: 'Invalid JSON format in Opinions'
      });
    }
    // Crear nueva película en MongoDB
    const nuevaPelicula = new Film({
      Title,
      Year: parseInt(Year),
      Rated,
      Released,
      Runtime,
      Genre,
      Director,
      Actors,
      Plot,
      Poster,
      imdbID,
      Ratings: ratingsArray,
      Opinions: opinionsArray
    });
    await nuevaPelicula.save();
    res.status(200).json({
      message: `Se ha guardado ${Title}`
    });
  } catch (error) {
    console.error('Error creating movie:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Movie with this title already exists'
      });
    }
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}
// [PUT] /api/movie - Editar película (ADMIN)
async function updateMovie(req, res) {
  try {
    // Verificar que el usuario es administrador
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Administrator privileges required.'
      });
    }
    const {
      id,
      Title,
      Year,
      Rated,
      Released,
      Runtime,
      Genre,
      Director,
      Actors,
      Plot,
      Poster,
      Ratings,
      Opinions
    } = req.body;
    if (!id) {
      return res.status(400).json({
        message: 'Movie ID is required'
      });
    }
    // Verificar si ya existe una película con ese título (excluyendo la actual)
    if (Title) {
      const existingMovie = await Film.findOne({
        Title: new RegExp(`^${Title}$`, 'i'),
        _id: { $ne: id }
      });
      if (existingMovie) {
        return res.status(400).json({
          message: 'A movie with this title already exists'
        });
      }
    }
    // Crear objeto con todos los campos a actualizar
    const updateData = {};
    if (Title) updateData.Title = Title;
    if (Year) updateData.Year = parseInt(Year);
    if (Rated) updateData.Rated = Rated;
    if (Released) updateData.Released = Released;
    if (Runtime) updateData.Runtime = Runtime;
    if (Genre) updateData.Genre = Genre;
    if (Director) updateData.Director = Director;
    if (Actors) updateData.Actors = Actors;
    if (Plot) updateData.Plot = Plot;
    if (Poster) updateData.Poster = Poster;
    if (Ratings) updateData.Ratings = Ratings;
    if (Opinions) updateData.Opinions = Opinions;
    // Actualizar en MongoDB
    const peliculaActualizada = await Film.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!peliculaActualizada) {
      return res.status(404).json({
        message: 'Movie not found'
      });
    }
    res.status(200).json({
      message: `Película "${peliculaActualizada.Title}" actualizada exitosamente`
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}
// [DELETE] /api/movie/:title - Eliminar película (ADMIN)
async function deleteMovie(req, res) {
  try {
    // Verificar que el usuario es administrador
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Administrator privileges required.'
      });
    }
    const { title } = req.params;
    // Eliminar de MongoDB
    const resultado = await Film.findOneAndDelete({
      Title: new RegExp(`^${title}$`, 'i')
    });
    if (!resultado) {
      return res.status(404).json({
        message: `No se encontró la película con título: ${title}`
      });
    }
    res.status(200).json({
      message: `Se ha borrado la película con título: ${title}`
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}
module.exports = {
  getMovieByTitle,
  createMovie,
  updateMovie,
  deleteMovie,
};