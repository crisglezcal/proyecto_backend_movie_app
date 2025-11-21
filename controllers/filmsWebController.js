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


const renderSearch = (req, res) => {
  res.render("search");
};

// moviesWeb.controller.js

// Renderizar página de detalle
const renderMovieDetail = async (req, res) => {
  try {
    const { title } = req.params;
    let movies = await fetchFilm.fetchOneFilm(title);

    if (!movies || movies.length === 0) {
      // Si no existe en OMDB, buscar en Mongo
      const localFilm = await Film.findOne({ Title: new RegExp(`^${title}$`, "i") });
      if (!localFilm) {
        return res.status(404).render("details", { movie: null, message: "Película no encontrada" });
      }
      movies = [localFilm];
    }

    // Mapear campos a minúsculas para Pug
    const m = movies[0];
    const movie = {
      title: m.Title,
      poster: m.Poster,
      plot: m.Plot,
      year: m.Year,
      director: m.Director,
      genres: m.Genre ? m.Genre.split(", ").map(g => g.trim()) : [],
      actors: m.Actors ? m.Actors.split(", ").map(a => a.trim()) : [],
      ratings: m.Ratings || [],
      id: m.imdbID,
      opinions: m.Opinions || []
    };

    res.render("details", { movie });
  } catch (error) {
    console.error(error);
    res.status(500).render("details", { movie: null, message: "Error al cargar la película" });
  }
};

// [GET] /manage - Renderizar página de gestión (SOLO ADMIN)
const renderManagePage = async (req, res) => {
  try {
    // Verificar que el usuario está autenticado y es administrador
    if (!req.user) {
      return res.redirect('/login');
    }
    // Verificar rol - usa 'role' que es lo que tienes en tu BD SQL
    if (req.user.role !== 'admin') {
      return res.redirect('/dashboard');
    }
    // Obtener todas las películas de MongoDB
    const peliculas = await Film.find().sort({ Title: 1 });
    res.render('manage', {
      peliculas,
      user: req.user
    });
  } catch (error) {
    console.error('Error loading manage page:', error);
    res.redirect('/dashboard');
  }
};
module.exports = {
  getAllMovies,
  renderSearch,
  renderMovieDetail,
  renderManagePage
};