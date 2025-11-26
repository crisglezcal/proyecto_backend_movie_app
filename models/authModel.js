const pool = require("../config/db_sql");
const bcrypt = require('bcryptjs');
const queries = require("../queries/users.queries");

//[POST] /api/signup - Registro tradicional
const createUser = async (username, email, password, role = 'user') => {
    try {
        console.log('Crear usuario:', { username, email, role });
        
        if (!username || !email || !password) {
            throw new Error('Username, email y contraseña son obligatorios');
        }
        
        const result = await pool.query(queries.insertUser, [
            username,     // $1 - name
            email,        // $2 - email
            password,     // $3 - password (ya hasheado)
            role          // $4 - role
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
// const findUserByEmail = async (email) => {
//     try {
//         console.log('Buscando usuario por email:', email);
        
//         if (!email) {
//             throw new Error('Email es obligatorio');
//         }
        
//         const result = await pool.query(queries.findUserByEmail, [email]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error en findUserByEmail:', error.message);
//         throw new Error('Error al buscar usuario por email');
//     }
// }
const findUserByEmail = async (email) => {
    if (!email) throw new Error('Email es obligatorio');

    try {
        console.log('Buscando usuario por email:', email);
        const result = await pool.query(queries.findUserByEmail, [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en findUserByEmail:', error.message);
        throw new Error('Error al buscar usuario por email');
    }
};

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

//[PUT] Actualizar contraseña por email
const updatePasswordByEmail = async (email, hashedPassword) => {
    try {
        console.log('Actualizando contraseña para:', email);
        
        const result = await pool.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
            [hashedPassword, email]
        );
        
        return result.rows[0];
    } catch (error) {
        console.error('Error en updatePasswordByEmail:', error.message);
        throw new Error('Error al actualizar contraseña');
    }
}

module.exports = {
    createUser,
    findUserByUsername,  
    findUserByEmail,
    createGoogleUser,
    updatePasswordByEmail
};