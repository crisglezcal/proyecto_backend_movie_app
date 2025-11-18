const express = require('express');
const router = express.Router();

const movieAPI = require("../controllers/filmsController.js");
const movieWeb = require("../controllers/filmsWebController.js");
const Movie = require("../models/films.model");

//------------- WEB -------------

router.get("/movies", async (req, res) => {
  const movies = await Movie.find();
  res.render("admin/movies", { movies });
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
