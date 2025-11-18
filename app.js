const express = require("express");
const cowsay = require("cowsay");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require("path");

// Leer fichero .env
require('dotenv').config();
const connectDB = require("./config/db_mongo");
const cookieParser = require('cookie-parser');

// Importar configuración de Google Auth
require('./config/authConfig');

// Importar modelos
const Movie = require("./models/films.model");

// Importar rutas
const viewsRoutes = require("./routes/viewsRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes"); 
const userRoutes = require("./routes/userRoutes");
const filmsRoutes = require("./routes/filmsRoutes"); 
const authRoutes = require("./routes/authRoutes");   

// Importar middlewares
const error404 = require("./middlewares/error404");
const morgan = require("./middlewares/morgan");

// Conexión a BDD
const connectDB = require("./config/db_mongo");

// ========================================================== INICIALIZACIÓN ==========================================================
const app = express(); 
const port = 3000;

// ========================================================== CONFIGURACIÓN ==========================================================
// Configuración de vistas 
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ========================================================== MIDDLEWARES ==========================================================
// Middlewares básicos de Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

// Session middleware
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true 
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Morgan middleware
app.use(morgan(':method :url :status :param[id] - :response-time ms :body'));

// ========================================================== RUTAS ==========================================================
app.use('/', viewsRoutes);
app.use('/', favoritesRoutes); 
app.use('/', userRoutes);  
app.use('/', filmsRoutes);
app.use('/', authRoutes);

// ========================================================== MANEJO DE ERRORES ==========================================================
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

// ========================================================== INICIAR SERVIDOR ==========================================================
connectDB().then(() => {
  app.listen(port, () => {
    console.log(
      cowsay.say({
        text: `✅ Movie App funcionando en http://localhost:${port}`,
        f: "owl", 
      })
    );
  });
}).catch(error => {
  console.error('❌ Error conectando a MongoDB:', error);
});

module.exports = app;