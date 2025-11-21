const express = require("express");
const cowsay = require("cowsay");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require("path");
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); 

require('./config/googleAuthConfig'); 
require('dotenv').config();
const connectDB = require("./config/db_mongo");

// ========================================================== INICIALIZACIÓN ==========================================================
const app = express(); 
const port = 3000;

// ========================================================== CONFIGURACIÓN ==========================================================
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ========================================================== DOC-SWAGGER ==========================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========================================================== MIDDLEWARES ==========================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // carpeta pública
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

// Middleware para JWT (AÑADIR ESTO)
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            res.clearCookie('token');
        }
    }
    next();
});

// ========================================================== RUTAS ==========================================================
// Importar rutas
const viewsRoutes = require("./routes/viewsRoutes");
const authRoutes = require("./routes/authRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes"); 
const userRoutes = require("./routes/userRoutes");
const filmsRoutes = require("./routes/filmsRoutes"); 

app.use('/', viewsRoutes);    
app.use('/', authRoutes);     
app.use('/', favoritesRoutes); 
app.use('/', userRoutes);  
app.use('/', filmsRoutes);

// ========================================================== MANEJO DE ERRORES ==========================================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor` 
  });
});

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
        text: `Movie App funcionando en http://localhost:${port}/dashboard`,
        f: "owl", 
      })
    );
  });
}).catch(error => {
  console.error('Error conectando a MongoDB:', error);
});

module.exports = app;