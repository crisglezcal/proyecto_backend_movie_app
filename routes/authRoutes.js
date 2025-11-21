const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require('passport');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints para gestión de autenticación de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignup:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: usuario@ejemplo.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "123456"
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: usuario@ejemplo.com
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             email:
 *               type: string
 *         token:
 *           type: string
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario en la aplicación
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Error en los datos de entrada (email ya existe, datos inválidos)
 *       500:
 *         description: Error interno del servidor
 */

//[POST] http://localhost:3000/api/signup Registrar usuario en la aplicación
router.post('/api/signup', authController.createUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario con email y contraseña
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

//[POST] http://localhost:3000/api/login Hacer login en la aplicación
router.post('/api/login', authController.logIn);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Finaliza la sesión del usuario actual
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesión cerrada exitosamente"
 *       500:
 *         description: Error interno del servidor
 */

//[POST] http://localhost:3000/api/logout Salir
router.post('/api/logout', authController.logOut);

/**
 * @swagger
 * /api/recoverpassword:
 *   get:
 *     summary: Solicitar recuperación de contraseña
 *     description: Inicia el proceso de recuperación de contraseña enviando un email al usuario
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario que solicita recuperar contraseña
 *     responses:
 *       200:
 *         description: Email de recuperación enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email de recuperación enviado"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

//[GET] http://localhost:3000/api/recoverpassword Recuperar password
router.get('/api/recoverpassword', authController.recoverPassword);

/**
 * @swagger
 * /api/restorepassword:
 *   get:
 *     summary: Restablecer contraseña
 *     description: Cambia la contraseña del usuario usando un token de recuperación
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de recuperación enviado por email
 *       - in: query
 *         name: newPassword
 *         required: true
 *         schema:
 *           type: string
 *           format: password
 *         description: Nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

//[GET] http://localhost:3000/api/restorepassword Cambiar password
router.get('/api/restorepassword', authController.restorePassword);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Autenticación con Google OAuth
 *     description: Inicia el proceso de autenticación con Google OAuth 2.0
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirección a Google OAuth
 */

//[GOOGLE OAUTH] Rutas de Google
router.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Callback de Google OAuth
 *     description: Endpoint de callback donde Google redirige después de la autenticación
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Código de autorización de Google
 *     responses:
 *       302:
 *         description: Redirección al dashboard (éxito) o a /login (fallo)
 *         headers:
 *           Location:
 *             description: URL de redirección
 *             schema:
 *               type: string
 */

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.googleAuthCallback
);

module.exports = router;