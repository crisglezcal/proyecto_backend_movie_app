const authService = require("../services/authServices");
const jwt = require('jsonwebtoken');

//[POST] http://localhost:3000/api/signup
const createUser = async (req, res) => {
    try {
        console.log('Controller signup - Datos recibidos:', req.body);
        
        const { username, email, password, role = 'user' } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: 'Nombre, email y contraseña son obligatorios' 
            });
        }

        const user = await authService.createUser(username, email, password, role);
        
        console.log('Usuario creado exitosamente:', user);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en controller signup:', error);
        res.status(error.status || 500).json({ 
            error: error.message 
        });
    }
};

//[POST] http://localhost:3000/api/login
const logIn = async (req, res) => {
    try {
        console.log('Controller login - Datos recibidos:', req.body);
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email y contraseña son requeridos' 
            });
        }

        const result = await authService.logIn(email, password);
        
        console.log('Login exitoso, configurando cookie...');

        // Configurar cookie con el token
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict'
        });

        res.json({
            message: 'Login exitoso',
            user: result.user,
            token: result.token
        });

    } catch (error) {
        console.error('Error en controller login:', error);
        res.status(error.status || 500).json({ 
            error: error.message 
        });
    }
};

//[POST] http://localhost:3000/api/logout - CORREGIDO (redirige a /signup)
const logOut = (req, res) => {
    try {
        console.log('Controller logout ejecutándose');
        
        // Limpiar cookie del token
        res.clearCookie('token');
        
        // Redirigir a /signup (que es la ruta que SÍ existe)
        res.redirect('/signup');
        
    } catch (error) {
        console.error('Error en controller logout:', error);
        // Si hay error, igual redirigir a signup
        res.redirect('/signup');
    }
};

//[GET] http://localhost:3000/api/recoverpassword
const recoverPassword = async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ 
                error: 'Email es requerido' 
            });
        }

        const token = await authService.recoverPassword(email);
        
        if (!token) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }

        res.json({
            message: 'Token de recuperación generado',
            token: token
        });

    } catch (error) {
        console.error('Error en controller recoverPassword:', error);
        res.status(error.status || 500).json({ 
            error: error.message 
        });
    }
};

//[GET] http://localhost:3000/api/restorepassword
const restorePassword = async (req, res) => {
    try {
        const { token, newPassword } = req.query;
        
        if (!token || !newPassword) {
            return res.status(400).json({ 
                error: 'Token y nueva contraseña son requeridos' 
            });
        }

        await authService.restorePassword(token, newPassword);

        res.json({
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error en controller restorePassword:', error);
        res.status(error.status || 500).json({ 
            error: error.message 
        });
    }
};

//[GOOGLE OAUTH] Callback de Google
const googleAuthCallback = (req, res) => {
    try {
        console.log('Google auth callback controller - Usuario:', req.user);
        
        const token = jwt.sign(
            { 
                id: req.user.id, 
                email: req.user.email,
                name: req.user.name,
                role: req.user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict'
        });

        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error en controller googleAuthCallback:', error);
        res.redirect('/signup?error=auth_failed');
    }
};

module.exports = {
    createUser,
    logIn,
    logOut,
    recoverPassword,
    restorePassword,
    googleAuthCallback
};