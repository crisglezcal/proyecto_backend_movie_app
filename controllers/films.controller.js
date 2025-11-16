// controllers/movieController.js
const Movie = require("../models/Movie");

const OMDB_API_KEY = process.env.OMDB_API_KEY;


// Buscar película por título (Usuario y Admin)
exports.getMovieByTitle = async (req, res) => {
  const title = req.params.title;

  try {
    // =======================
    // 1. BUSCAR EN OMDB (fetch)
    // =======================
    const omdbResponse = await fetch(
      `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
    );

    const omdbData = await omdbResponse.json();

    if (omdbData && omdbData.Response !== "False") {
      return res.json({
        source: "OMDB",
        movie: omdbData
      });
    }

    // =========================
    // 2. BUSCAR EN MONGODB
    // =========================
    const movie = await Movie.findOne({
      title: new RegExp("^" + title + "$", "i")
    });

    if (movie) {
      return res.json({
        source: "MongoDB",
        movie
      });
    }

    return res.status(404).json({ message: "No hay resultados." });

  } catch (error) {
    return res.status(500).json({ message: "Error en la búsqueda." });
  }
};


// Crear película (ADMIN)
exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      message: "Película creada correctamente",
      movie
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la película." });
  }
};


// Editar película (ADMIN)
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true
    });

    res.json({
      message: "Película actualizada",
      movie
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la película." });
  }
};


// Eliminar película (ADMIN)
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    await Movie.findByIdAndDelete(id);

    res.json({ message: "Película eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la película." });
  }
};
