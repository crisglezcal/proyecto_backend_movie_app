const Film = require('../models/films.model');

// Controlador "Página de inicio" ➡️ "homeController"
const homeController = async (req, res) => {
    try {
        const movies = await Film.find();
        
        res.render('home', {
            title: 'Movie App - Inicio',
            message: 'Bienvenido a nuestra aplicación de películas',
            movies: movies
        });
    } catch (error) {
        console.error('Error en homeController:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error al cargar la página de inicio'
        });
    }
};

// Controlador "Panel de control" ➡️ "dashborardController"
const dashboardController = async (req, res) => {
    try {
        const totalMovies = await Film.countDocuments();
        
        res.render('dashboard', {
            title: 'Movie App - Dashboard',
            user: {
                name: 'Usuario',
                email: 'usuario@ejemplo.com'
            },
            stats: {
                totalMovies: totalMovies
            }
        });
    } catch (error) {
        console.error('Error en dashboardController:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error al cargar el dashboard'
        });
    }
};

module.exports = {
    homeController,
    dashboardController
};