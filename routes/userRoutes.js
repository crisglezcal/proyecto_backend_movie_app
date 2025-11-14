//esta ruta es para las acciones que hace el usuario
const express = require('express');

const router = express.Router();

//------------- WEB -------------
//[GET] http://localhost:3000/profile 
router.get('/profile'); // Vista del perfil
//[GET] http://localhost:3000/users 
router.get('/users'); // Vista lista de usuarios (admin)

// -------------API--------------
//[GET] http://localhost:3000/api/user Obtener datos del perfil del usuario o administrador
router.get('/api/user'); // Obtener datos de usuario
//[PUT] http://localhost:3000/api/user Editar datos del perfil del usuario o administrador
router.put('/api/user'); // Editar perfil
//[DELETE] http://localhost:3000/api/user Borrar un usuario de la base de datos (admin)
router.delete('/api/user/:id'); // Borrar usuario



module.exports = router;