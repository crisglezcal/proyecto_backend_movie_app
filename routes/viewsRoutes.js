// vistas generales o estáticas del sitio (sin lógica de usuario/películas)
const express = require('express');
const { homeController, dashboardController } = require('../controllers/viewsController');

const router = express.Router();

// [GET] http://localhost:3000/api - Página de inicio
router.get('/api', homeController);

// [GET] http://localhost:3000/api/dashboard - Panel de control
router.get('/api/dashboard', dashboardController);


module.exports = router;

