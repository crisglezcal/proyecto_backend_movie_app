const express = require("express");
const cowsay = require("cowsay");
const cookieParser = require('cookie-parser');

const connectDB = require("./config/db_mongo");
const Movie = require("./models/films.model");  

// Importar rutas
const viewsRoutes = require("./routes/viewsRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes"); 
const userRoutes = require("./routes/userRoutes");
const filmsRoutes = require("./routes/filmsRoutes");    

const app = express(); // Creando el servidor
const port = 3000; // Puerto de pruebas
 
const path = require("path");

// Leer fichero .env
require('dotenv').config();

// Configuración PUG 
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos del front CSS, JS, assets
app.use(cookieParser());

// Morgan middleware
const error404 = require("./middlewares/error404");
const morgan = require("./middlewares/morgan");
app.use(morgan(':method :url :status :param[id] - :response-time ms :body'));

// Rutas
app.use('/', viewsRoutes);
app.use('/', favoritesRoutes); 
app.use('/', userRoutes);  
app.use('/', filmsRoutes);    

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor` 
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: error.message 
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(
    cowsay.say({
      text: `Endpoint Proyecto Movie App http://localhost:${port}`,
      f: "owl", 
    })
  );
});

connectDB();
module.exports = app;