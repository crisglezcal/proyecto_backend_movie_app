const express = require('express');
const router = express.Router();

const movieAPI = require("../controllers/filmsController.js");
const movieWeb = require("../controllers/filmsWebController.js");
const Movie = require("../models/films.model");

//------------- WEB -------------

router.get("/search", async (req, res) => {
  const title = req.query.title;

  if (!title) {
    return res.render("search", { movies: null });
  }

  // supongamos que llamas al controller...
  const results = await buscarPeliculas(title);

  res.render("search", {
    query: title,
    movies: results.movies,
    noResults: results.movies.length === 0
  });
});

// Vista web del detalle
router.get("/search/:title", movieWeb.renderMovieDetail);

// -------------API--------------

// GET /api/movie/:title
router.get("/:title", movieAPI.getMovieByTitle);

// POST /api/movie
router.post("/", movieAPI.createMovie);

// PUT /api/movie/:id
router.put("/:id", movieAPI.updateMovie);

// DELETE /api/movie/:id
router.delete("/:id", movieAPI.deleteMovie);

module.exports = router;
