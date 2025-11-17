// vistas generales o estáticas del sitio (sin lógica de usuario/películas)
const express = require('express');
const { homeController, dashboardController } = require('../controllers/viewsController');

const router = express.Router();

// [GET] http://localhost:3000/ - Página de inicio
router.get('/', homeController);

// [GET] http://localhost:3000/dashboard - Panel de control
router.get('/dashboard', dashboardController);


module.exports = router;

