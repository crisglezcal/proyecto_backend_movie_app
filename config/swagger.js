const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación generada automáticamente con Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: [ // Ruta a los archivos donde se documentarán los endpoints
    './routes/viewsRoutes.js',
    './routes/authRoutes.js'
], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;