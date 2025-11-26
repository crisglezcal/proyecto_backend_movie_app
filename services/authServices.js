const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const resetTokens = {};

//[POST] http://localhost:3000/api/signup
async function createUser(username, email, password, role = 'user') {
    try {
        console.log('Creando usuario en service:', { username, email, role });
        
        if (!username || !email || !password) {
            const error = new Error('Todos los campos son obligatorios');
            error.status = 400;
            throw error;
        }
        
        // Verificar si el usuario ya existe
        const existingUser = await authModel.findUserByEmail(email);
        if (existingUser) {
            const error = new Error('El email ya está registrado');
            error.status = 400;
            throw error;
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Contraseña hasheada correctamente');
        
        // Crear usuario
        const user = await authModel.createUser(username, email, hashedPassword, role);
        console.log('Usuario creado en service:', user);
        
        return user;
    } catch (error) {
        console.error('Error en createUser service:', error);
        throw error;
    }
}

//[POST] http://localhost:3000/api/login - CORREGIDO
async function logIn(email, password) {
    try {
        console.log('Service login - Buscando usuario con email:', email);
        
        if (!email || !password) {
            const error = new Error('Email y contraseña son obligatorios');
            error.status = 400;
            throw error;
        }

        // Buscar usuario por EMAIL (no por username)
        const user = await authModel.findUserByEmail(email);
        console.log('Usuario encontrado en BD:', user ? 'Sí' : 'No');

        if (!user) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            throw error;
        }

        console.log('Usuario encontrado:', { 
            id: user.id, 
            name: user.name, 
            email: user.email,
            hasPassword: !!user.password 
        });

        // Verificar si es usuario de Google (no tiene password)
        if (!user.password) {
            const error = new Error('Este usuario está registrado con Google. Usa Google Sign-In');
            error.status = 401;
            throw error;
        }

        // Verificar contraseña
        console.log('Comparando contraseñas...');
        const match = await bcrypt.compare(password, user.password);
        console.log('Contraseña válida:', match);

        if (!match) {
            const error = new Error('Contraseña incorrecta');
            error.status = 401;
            throw error;
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                name: user.name,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Token generado correctamente');

        return { 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }, 
            token 
        };
    } catch (error) {
        console.error('Error en login service:', error);
        throw error;
    }
}

//[POST] http://localhost:3000/api/logout
function logOut(res) {
    try {
        console.log('Ejecutando logout service');
        res.clearCookie('token');
        return true;
    } catch (error) {
        console.error('Error en logout service:', error);
        throw error;
    }
}

//[GET] http://localhost:3000/api/recoverpassword
async function recoverPassword(email) {
    try {
        console.log('Recuperando password para:', email);
        
        const user = await authModel.findUserByEmail(email);
        if (!user) {
            console.log('Usuario no encontrado para recovery');
            return null;
        }

        const token = Math.random().toString(36).substring(2, 15);
        resetTokens[token] = { 
            email, 
            expires: Date.now() + 3600000 // 1 hora
        };
        
        console.log(`Token de recuperación para ${email}: ${token}`);
        return token;
    } catch (error) {
        console.error('Error en recoverPassword service:', error);
        throw error;
    }
}

//[GET] http://localhost:3000/api/restorepassword
async function restorePassword(token, newPassword) {
    try {
        console.log('Restaurando password con token:', token);
        
        const tokenData = resetTokens[token];

        if (!tokenData || Date.now() > tokenData.expires) {
            const error = new Error('Token inválido o expirado');
            error.status = 400;
            throw error;
        }

        // Actualizar la contraseña en DB
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await authModel.updatePasswordByEmail(tokenData.email, hashedPassword);

        delete resetTokens[token];
        console.log('Contraseña actualizada correctamente');
        return true;
    } catch (error) {
        console.error('Error en restorePassword service:', error);
        throw error;
    }
}

//[GOOGLE OAUTH] Callback de Google
async function googleAuthCallback(userObj) {
    try {
        console.log('Google auth callback service:', userObj);
        return { 
            user: userObj.user, 
            token: userObj.token 
        };
    } catch (error) {
        console.error('Error en googleAuthCallback service:', error);
        throw error;
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