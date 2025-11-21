//esta ruta es para las acciones que hace el usuario
const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');


//[GET] http://localhost:3000/profile 
router.get('/profile', userController.renderProfile); // Vista del perfil

//[GET] http://localhost:3000/login 
router.get('/login', userController.renderProfile); 

//[GET] http://localhost:3000/user
router.get('/users', userController.renderUsersList); // Vista lista de usuarios (admin)

//[GET] http://localhost:3000/api/user Obtener datos del perfil del usuario o administrador
router.get('/api/user', userController.getUser); // Obtener datos de usuario

//[PUT] http://localhost:3000/api/user Editar datos del perfil del usuario o administrador
router.put('/api/user', userController.updateUser); // Editar perfil

//[DELETE] http://localhost:3000/api/user Borrar un usuario de la base de datos (admin)
router.delete('/api/user/:id', userController.deleteUser);

// Ruta para actualizar el perfil del usuario
router.post('/api/user', userController.updateUserProfile);

module.exports = router;