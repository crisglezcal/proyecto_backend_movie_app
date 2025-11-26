const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const resetTokens = {};

//[POST] http://localhost:3000/api/signup
async function createUser(username, email, password, role = 'user') {
    if (!username || !email || !password) {
        const error = new Error('Todos los campos son obligatorios');
        error.status = 400;
        throw error;
    }
    
    // ¡HASHEAR la contraseña antes de enviar al modelo!
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await authModel.createUser(username, email, hashedPassword, role);
}


// //[POST] http://localhost:3000/api/login
// async function logIn(email, password) {
//     try {
//         // Buscar usuario por username O email
//         let user = await authModel.findUserByUsername(email);
        
//         // Si no encuentra por username, buscar por email
//         if (!user) {
//             user = await authModel.findUserByEmail(email);
//         }

//         if (!user) {
//             const error = new Error('Credenciales inválidas');
//             error.status = 401;
//             throw error;
//         }

//         // Verificar si es usuario de Google (no tiene password)
//         if (!user.password) {
//             const error = new Error('Este usuario está registrado con Google. Usa Google Sign-In');
//             error.status = 401;
//             throw error;
//         }

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             const error = new Error('Credenciales inválidas');
//             error.status = 401;
//             throw error;
//         }

//         const token = jwt.sign(
//             { id: user.id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         return { user, token };
//     } catch (error) {
//         console.error('Error en login:', error);
//         throw error;
//     }
// }
// services/authService.js

async function logIn(email, password) {
    // Buscar usuario por email
    const user = await authModel.findUserByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');

    // Validar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Contraseña incorrecta');

    // Generar token JWT
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { user, token };
}


//[POST] http://localhost:3000/api/logout
function logOut() {
    return true; 
}

//[GET] http://localhost:3000/api/recoverpassword
async function recoverPassword(email) {

        const user = await authModel.findUserByEmail(email);
        if (!user) return null; 
            const token = Math.random().toString(36).substring(2, 15);
            resetTokens[token] = { email, expires: Date.now() + 3600000 };
            console.log(`Token de recuperación para ${email}: ${token}`);
            return token;
}

//[GET] http://localhost:3000/api/restorepassword
async function restorePassword(token, newPassword) {
    const tokenData = resetTokens[token];

    if (!tokenData || Date.now() > tokenData.expires) {
        const error = new Error('Token inválido o expirado');
        error.status = 400;
        throw error;
    }

    // Aquí podrías actualizar la contraseña en DB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authModel.updatePasswordByEmail(tokenData.email, hashedPassword);

    delete resetTokens[token];
    return true;
}
//[GOOGLE OAUTH] Callback de Google
async function googleAuthCallback(userObj) {
    // userObj = { user, token }
    return { user: userObj.user, token: userObj.token };
}

module.exports = { 
    createUser, 
    logIn, 
    logOut, 
    recoverPassword, 
    restorePassword,
    googleAuthCallback
};
