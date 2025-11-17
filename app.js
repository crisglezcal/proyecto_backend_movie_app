const express = require("express"); // Importando express
const cowsay = require("cowsay");

const connectDB = require("./config/db_mongo");
const Film = require("./models/films.model");

// Importar rutas
const viewsRoutes = require("./routes/viewsRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes"); 

const app = express(); // Creando el servidor
const port = 3000; // Puerto de pruebas

// Leer fichero .env
require('dotenv').config();

// Middlewares
// const error404 = require("./middlewares/error404");
// Morgan
// const morgan = require("./middlewares/morgan");

// Configuración del logger con Morgan
// app.use(morgan(':method :url :status :param[id] - :response-time ms :body'));

// Habilitar recepción de JSON por mi backend
// Parsear el body entrante a JSON
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos del front CSS, JS, assets


// Usar rutas
app.use('/', viewsRoutes);
app.use('/', favoritesRoutes); 

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
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

connectDB(); // Conexión Mongo

module.exports = app; // Exportar la app para usarla en tests