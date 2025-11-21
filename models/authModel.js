const pool = require("../config/db_sql");
const bcrypt = require('bcryptjs');
const queries = require("../queries/users.queries");

//[POST] /api/signup - Registro tradicional
const createUser = async (name, email, role = 'user', password) => {
    try {
        console.log('Crear usuario:', { name, email, role });
        
        if (!name || !email || !password) {
            throw new Error('Nombre, email y contraseña son obligatorios');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(queries.insertUser, [
            name, 
            '', // ????
            email, 
            hashedPassword,
            role
        ]);
        
        return result.rows[0];
    } catch (error) {
        console.error('Error en createUser:', error.message);
        throw new Error('Error al crear usuario');
    }
}

//[POST] /api/login - Buscar por username
const findUserByUsername = async (username) => {
    try {
        console.log('Buscando usuario por nombre:', username);
        
        if (!username) {
            throw new Error('Nombre de usuario es obligatorio');
        }
        
        const result = await pool.query(queries.findUserByUsername, [username]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en findUserByUsername:', error.message);
        throw new Error('Error al buscar usuario por nombre');
    }
}

//[GET] /api/recoverpassword - Buscar por email
const findUserByEmail = async (email) => {
    try {
        console.log('Buscando usuario por email:', email);
        
        if (!email) {
            throw new Error('Email es obligatorio');
        }
        
        const result = await pool.query(queries.findUserByEmail, [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en findUserByEmail:', error.message);
        throw new Error('Error al buscar usuario por email');
    }
}

//[GOOGLE OAUTH] - Crear usuario de Google
const createGoogleUser = async (name, email, googleId, role = 'user') => {
    try {
        console.log('Creando usuario de Google:', { name, email, googleId, role });
        
        if (!name || !email || !googleId) {
            throw new Error('Nombre, email y Google ID son obligatorios');
        }
        
        const result = await pool.query(queries.createGoogleUser, [
            name, 
            null, // password null para Google
            email, 
            role, 
            'google', // auth_method
            googleId
        ]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en createGoogleUser:', error.message);
        throw new Error('Error al crear usuario de Google');
    }
}

module.exports = {
    createUser,
    findUserByUsername,  
    findUserByEmail,
    createGoogleUser
};

// // const pool = require("../config/db_sql");

// const queries = require("../queries/users.queries");

// const createUser = async (name, surname, email, password, role = 'user') => {
//     const result = await pool.query(queries.insertUser, [name, surname, email, password, role]);
//     return result;
// }

// const logInModel = async (name, email, password) => {
//     try {
//         const valuesLogin = [name, email, password];
//         return await pool.query(queries.loginUser, valuesLogin);

//     } catch (error) {
//         console.error('Error al logar usuario', error.message);
//         throw new Error('Error al buscar el usuario por email')
//     }
// }

// const logOutModel = async (email, password) => {
//     try {
//         const valuesLogout = [email, password];
//         return await pool.query(queries.logoutUser, valuesLogout);
//     } catch (error) {
//         console.error('Error al deslogar usuario', error.message);
//         throw new Error('Error al cerrar sesión')
//     }
// }

// const getUserModel = async (email, password) => {
//     try {
//         const value = [email, password];
//         return await pool.query(queries.getUser, value)

//     } catch (error) {
//         console.error('Error al leer contraseña', erromessage);
//         throw new Error('Error al recuperar contraseña')
//     }
// }

// module.exports = {
//     createUser,
//     logInModel,
//     logOutModel,
//     getUserModel
// }