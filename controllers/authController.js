const authService = require('../services/authServices');

/**
 * Almacén temporal en memoria para tokens de recuperación de contraseña
 * @type {Object}
 * @property {Object} resetTokens - Tokens activos con estructura { token: { email: string, expires: number } }
 */
const resetTokens = {};

/**
 * Crea un nuevo usuario en el sistema
 * @async
 * @function createUser
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.username - Nombre de usuario único
 * @param {string} req.body.password - Contraseña del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Redirecciona a /login en éxito, error en caso contrario
 * @throws {Error} Cuando faltan campos obligatorios o hay error en la base de datos
 * @example
 * // POST /api/signup
 * // Body: { username: "usuario", password: "123456", email: "usuario@ejemplo.com" }
 */
async function createUser(req, res) {
    try {
        await authService.createUser(req.body.username, req.body.email, req.body.password);
        res.redirect('/login');
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
}

/**
 * Autentica un usuario y genera token JWT
 * @async
 * @function logIn
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.username - Nombre de usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Redirecciona a /dashboard en éxito, error en credenciales inválidas
 * @throws {Error} Cuando hay error en la base de datos o comparación de contraseñas
 * @example
 * // POST /api/login
 * // Body: { username: "usuario", password: "123456" }
 */
async function logIn(req, res) {
    try {
        const { email, password } = req.body;

        // Validar que el email y la contraseña existen
        if (!email || !password) {
            return res.status(400).send('Email y contraseña son obligatorios');
        }

        // Llamar al servicio de autenticación
        const { user, token } = await authService.logIn(email, password);

        // Guardar token en cookie y redirigir
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        // Enviar error con status si existe
        res.status(error.status || 500).send(error.message);
    }
}

/**
 * Cierra la sesión del usuario eliminando el token JWT Y la sesión de Passport
 * @async
 * @function logOut
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Redirecciona a /login después de eliminar la cookie
 * @example
 * // POST /api/logout
 */
async function logOut(req, res) {
    try {
        console.log('🔐 Iniciando logout - Usuario:', req.user?.email);
        
        // 1. Limpiar cookie JWT (para login tradicional)
        res.clearCookie('token');
        console.log('✅ Cookie JWT limpiada');

        // 2. Cerrar sesión de Passport (para Google OAuth)
        if (req.logout) {
            req.logout(function(err) {
                if (err) {
                    console.log('⚠️  Error en req.logout:', err);
                } else {
                    console.log('✅ Sesión de Passport cerrada');
                }
                
                // 3. Destruir la sesión completamente
                if (req.session) {
                    req.session.destroy(function(err) {
                        if (err) {
                            console.log('⚠️  Error destruyendo sesión:', err);
                        } else {
                            console.log('✅ Sesión destruida');
                        }
                        
                        // 4. Limpiar cookie de sesión de Express
                        res.clearCookie('connect.sid');
                        console.log('✅ Cookie de sesión limpiada');
                        
                        console.log('🎉 Logout COMPLETO - Redirigiendo a login');
                        res.redirect('/login');
                    });
                } else {
                    console.log('🎉 Logout COMPLETO (sin sesión) - Redirigiendo a login');
                    res.redirect('/login');
                }
            });
        } else {
            // Fallback si req.logout no existe
            console.log('⚠️  req.logout no disponible, usando método alternativo');
            if (req.session) {
                req.session.destroy(() => {
                    res.clearCookie('connect.sid');
                    res.redirect('/login');
                });
            } else {
                res.redirect('/login');
            }
        }
        
    } catch (error) {
        console.error('💥 Error en logout controller:', error);
        // En caso de error, igual redirigir a login
        res.redirect('/login');
    }
}

/**
 * Inicia el proceso de recuperación de contraseña generando un token temporal
 * @async
 * @function recoverPassword
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Mensaje de confirmación (siempre retorna éxito por seguridad)
 * @throws {Error} Cuando hay error en la base de datos
 * @example
 * // GET /api/recoverpassword
 * // Body: { email: "usuario@ejemplo.com" }
 */
async function recoverPassword(req, res) {
    try {
        await authService.recoverPassword(req.body.email);
        res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

/**
 * Restablece la contraseña usando un token de recuperación válido
 * @async
 * @function restorePassword
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.token - Token de recuperación recibido por email
 * @param {string} req.body.newPassword - Nueva contraseña
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Mensaje de éxito o error si el token es inválido
 * @throws {Error} Cuando hay error en el servidor
 * @example
 * // GET /api/restorepassword
 * // Body: { token: "abc123", newPassword: "nueva123" }
 */
async function restorePassword(req, res) {
    try {
        await authService.restorePassword(req.body.token, req.body.newPassword);
        res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

/**
 * Maneja el callback de autenticación con Google OAuth
 * @async
 * @function googleAuthCallback
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.user - Usuario autenticado por Google
 * @param {Object} req.user.user - Datos del usuario de Google
 * @param {string} req.user.token - Token JWT generado
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Redirecciona a /dashboard en éxito, a /login en error
 * @throws {Error} Cuando hay error en el proceso de autenticación con Google
 * @example
 * // Ruta interna de callback de Google OAuth
 */
async function googleAuthCallback(req, res) {
    try {
        const { user, token } = await authService.googleAuthCallback(req.user);
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.redirect('/login?error=google_auth_failed');
    }
}

module.exports = {
    createUser,
    logIn,
    logOut,
    recoverPassword,
    restorePassword,
    googleAuthCallback
};