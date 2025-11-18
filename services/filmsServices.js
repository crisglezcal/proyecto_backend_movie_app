// services/movieService.js
const fetchFilm = require('../utils/fetchFilms');
const Movie = require('../models/films.model');

const getAllMovies = async () => {
  return await Movie.find({});
};

// Buscar película por título (API externa + MongoDB)
const getMovieByTitle = async (title) => {
  try {
    const filmFromAPI = await fetchFilm(title);
    if (filmFromAPI) return filmFromAPI;
  } catch (err) {
    // Si falla la API, seguimos buscando en la base de datos
  }

  return await Movie.findOne({ title: new RegExp(`^${title}$`, 'i') });
};

// Buscar película por ID (solo MongoDB)
const getMovieById = async (id) => {
  return await Movie.findById(id);
};

// Crear película (solo MongoDB, admin)
const createMovie = async (movieData) => {
  const movie = new Movie(movieData);
  return await movie.save();
};

// Editar película (solo MongoDB, admin)
const updateMovie = async (id, movieData) => {
  return await Movie.findByIdAndUpdate(id, movieData, { new: true });
};

// Eliminar película (solo MongoDB, admin)
const deleteMovie = async (id) => {
  return await Movie.findByIdAndDelete(id);
};

module.exports = {
  getAllMovies,
  getMovieByTitle,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
