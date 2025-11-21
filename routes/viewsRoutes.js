// vistas generales o estáticas del sitio (sin lógica de usuario/películas)
const express = require('express');
const { homeController, dashboardController} = require('../controllers/viewsController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Views
 *   description: Endpoints para vistas HTML del frontend
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Página de búsqueda de películas
 *     description: Renderiza la página principal de búsqueda donde los usuarios pueden buscar películas
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: HTML de la página de búsqueda renderizado correctamente
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html>...</html>"
 */

// [GET] http://localhost:3000/search - Página de búsqueda
router.get('/search', homeController);


/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Panel de control del usuario
 *     description: Renderiza el dashboard personalizado del usuario. Requiere autenticación.
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: HTML del dashboard renderizado correctamente
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html>...</html>"
 *       302:
 *         description: Redirección a /signup si el usuario no está autenticado
 */

// [GET] http://localhost:3000/dashboard - Panel de control
router.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/signup');
  }
  res.render('dashboard', { user: req.user });
});

/**
 * @swagger
 * /signup:
 *   get:
 *     summary: Vista de registro de usuario
 *     description: Renderiza la página de registro de nuevos usuarios. Redirige al dashboard si ya está autenticado.
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: HTML de la página de registro renderizado correctamente
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html>...</html>"
 *       302:
 *         description: Redirección a /dashboard si el usuario ya está autenticado
 */

// [GET] http://localhost:3000/signup - Vista de registro/login
router.get('/signup', (req, res) => {
  // Si ya está logueado, redirigir al dashboard
  if (req.user) {
    return res.redirect('/dashboard');
  }
  res.render('signup', { user: req.user });
});

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Vista de inicio de sesión
 *     description: Renderiza la página de inicio de sesión. Redirige al dashboard si ya está autenticado.
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: HTML de la página de login renderizado correctamente
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html>...</html>"
 *       302:
 *         description: Redirección a /dashboard si el usuario ya está autenticado
 */

// [GET] http://localhost:3000/login - Vista de login
router.get('/login', (req, res) => {
  // Si ya está logueado, redirigir al dashboard
  if (req.user) {
    return res.redirect('/dashboard');
  }
  res.render('signup', { user: req.user, tab: 'login' });
});

module.exports = router;