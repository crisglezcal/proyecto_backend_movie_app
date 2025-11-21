const Film = require('../models/films.model');

/**
 * Controlador para la página de búsqueda de películas
 * @async
 * @function homeController
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Renderiza la página de búsqueda con las películas
 * @throws {Error} Si hay un error al consultar la base de datos
 * @example
 * // Uso en rutas:
 * router.get('/search', homeController);
 */
const homeController = async (req, res) => {
    try {
        const movies = await Film.find();
        
        res.render('search', {
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

/**
 * Controlador para el panel de control del usuario
 * @async
 * @function dashboardController
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Renderiza el dashboard con estadísticas
 * @throws {Error} Si hay un error al contar los documentos en la base de datos
 * @example
 * // Uso en rutas:
 * router.get('/dashboard', dashboardController);
 */
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

/**
 * Controlador para la página de detalle de películas
 * @async
 * @function detailController
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Renderiza la página de detalles de películas
 * @throws {Error} Si hay un error al consultar la base de datos
 * @example
 * // Uso en rutas:
 * router.get('/movies/:id', detailController);
 */
const detailController = async (req, res) => {
    try {
        const movies = await Film.find();
        
        res.render('search', {
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

module.exports = {
    homeController,
    dashboardController,
    detailController
};