const express = require('express');
const movieController = require("../controllers/films.controller.js");
const { isAdmin, isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

//------------- WEB -------------

// Vista para admin → gestión completa
//http://localhost:3000/movies
router.get("/movies", isAdmin, async (req, res) => {
  const movies = await Movie.find();
  res.render("admin/movies", { movies });
});

//http://localhost:3000/search/:title
// Vista de detalle usuario → /search/:title
router.get("/search/:title", isAuthenticated, async (req, res) => {
  // Reutilizamos el controller
  req.params.title = req.params.title;
  const data = await movieController.getMovieByTitle(req, res);

  // render si funciona
  res.render("user/movieDetail", { movie: data.movie });
});

// -------------API--------------

// GET localhost:3000/api/movie/:title → Buscar película
router.get("/:title", isAuthenticated, movieController.getMovieByTitle);

// POST localhost:3000/api/movie → Crear película
router.post("/", isAdmin, movieController.createMovie);

// PUT localhost:3000/api/movie/:id → Editar película
router.put("/:id", isAdmin, movieController.updateMovie);

// DELETE localhost:3000/api/movie/:id → Eliminar película
router.delete("/:id", isAdmin, movieController.deleteMovie);

module.exports = router;
