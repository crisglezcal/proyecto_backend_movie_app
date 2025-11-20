// vistas generales o estáticas del sitio (sin lógica de usuario/películas)
const express = require('express');
const { homeController, dashboardController} = require('../controllers/viewsController');

const router = express.Router();

// [GET] http://localhost:3000/search - Página de búsqueda
router.get('/search', homeController);

// [GET] http://localhost:3000/dashboard - Panel de control
router.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/signup');
  }
  res.render('dashboard', { user: req.user });
});

// [GET] http://localhost:3000/signup - Vista de registro/login
router.get('/signup', (req, res) => {
  // Si ya está logueado, redirigir al dashboard
  if (req.user) {
    return res.redirect('/dashboard');
  }
  res.render('signup', { user: req.user });
});


// [GET] http://localhost:3000/login - Vista de login
router.get('/login', (req, res) => {
  // Si ya está logueado, redirigir al dashboard
  if (req.user) {
    return res.redirect('/dashboard');
  }
  res.render('signup', { user: req.user, tab: 'login' });
});

module.exports = router;