const express = require('express');
const router = express.Router();

const movieAPI = require("../controllers/filmsApiController.js");
const movieWeb = require("../controllers/filmsWebController.js");
const Movie = require("../models/films.model");

//------------- WEB -------------


// GET ALL FILMS /api/movie/:title
router.get("/search/:title", movieWeb.getAllMovies);

// -------------API--------------

// GET /api/movie/:title
router.get("/api/movie/:title", movieAPI.getMovieByTitle);

// POST /api/movie
router.post("/api/movie", movieAPI.createMovie);

// PUT /api/movie/:id
router.put("/api/movie", movieAPI.updateMovie);

// DELETE /api/movie/:title
router.delete("/api/movie/:title", movieAPI.deleteMovie);

module.exports = router;
