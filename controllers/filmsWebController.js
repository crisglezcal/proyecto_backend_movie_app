const fetchFilm = require("../utils/fetchFilms");
const Film = require("../models/films.model");

async function renderMovieDetail(req, res) {
  const title = req.params.title;

  try {
    let film = await fetchFilm(title);

    // Si no existe en OMDB, buscamos en MongoDB
    if (!film) {
      film = await Film.findOne({ title: new RegExp(`^${title}$`, "i") });
    }

    if (!film) {
      return res.render("user/movieDetail", { movie: null, error: "Película no encontrada" });
    }

    res.render("user/movieDetail", { movie: film });

  } catch (error) {
    console.error(error);
    res.render("user/movieDetail", { movie: null, error: "Error interno" });
  }
}

module.exports = { renderMovieDetail };
