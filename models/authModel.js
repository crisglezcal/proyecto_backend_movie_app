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

// ========== NUEVAS FUNCIONES PARA GOOGLE OAUTH ==========

//[GOOGLE OAUTH] - Buscar usuario por Google ID
const findUserByGoogleId = async (googleId) => {
    try {
        console.log('Buscando usuario por Google ID:', googleId);
        
        const result = await pool.query(
            'SELECT * FROM users WHERE google_id = $1', 
            [googleId]
        );
        console.log('Resultado búsqueda por Google ID:', result.rows[0] ? 'Encontrado' : 'No encontrado');
        return result.rows[0];
    } catch (error) {
        console.error('Error en findUserByGoogleId:', error.message);
        throw new Error('Error al buscar usuario por Google ID');
    }
}

//[GOOGLE OAUTH] - Buscar usuario por ID
const findUserById = async (id) => {
    try {
        console.log('Buscando usuario por ID:', id);
        
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1', 
            [id]
        );
        console.log('Resultado búsqueda por ID:', result.rows[0] ? 'Encontrado' : 'No encontrado');
        return result.rows[0];
    } catch (error) {
        console.error('Error en findUserById:', error.message);
        throw new Error('Error al buscar usuario por ID');
    }
}

//[GOOGLE OAUTH] - Actualizar usuario existente con Google ID
const updateUserWithGoogleId = async (userId, googleId) => {
    try {
        console.log('Actualizando usuario con Google ID:', { userId, googleId });
        
        const result = await pool.query(
            'UPDATE users SET google_id = $1, auth_method = $2 WHERE id = $3 RETURNING *',
            [googleId, 'google', userId]
        );
        console.log('Usuario actualizado con Google ID:', result.rows[0]?.email);
        return result.rows[0];
    } catch (error) {
        console.error('Error en updateUserWithGoogleId:', error.message);
        throw new Error('Error al actualizar usuario con Google ID');
    }
}

//[GOOGLE OAUTH] - Buscar o crear usuario de Google (función de conveniencia)
const findOrCreateGoogleUser = async (profile) => {
    try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        console.log('Buscando o creando usuario Google:', { email, name, googleId });

        // Primero buscar por Google ID
        let user = await findUserByGoogleId(googleId);
        
        // Si no existe, buscar por email
        if (!user) {
            user = await findUserByEmail(email);
        }

        // Si no existe, crear nuevo usuario
        if (!user) {
            console.log('🆕 Creando NUEVO usuario de Google');
            user = await createGoogleUser(name, email, googleId);
        } else {
            console.log('✅ Usuario EXISTENTE encontrado:', user.email);
            
            // Si el usuario existe pero no tiene google_id, actualizarlo
            if (!user.google_id) {
                console.log('🔄 Actualizando usuario existente con Google ID');
                user = await updateUserWithGoogleId(user.id, googleId);
            }
        }

        return user;
    } catch (error) {
        console.error('Error en findOrCreateGoogleUser:', error);
        throw error;
    }
}

module.exports = {
    createUser,
    findUserByUsername,  
    findUserByEmail,
    createGoogleUser,
    updatePasswordByEmail,
    // Nuevas funciones para Google OAuth
    findUserByGoogleId,
    findUserById,
    updateUserWithGoogleId,
    findOrCreateGoogleUser
};

// const pool = require("../config/db_sql");
// const bcrypt = require('bcryptjs');
// const queries = require("../queries/users.queries");

// //[POST] /api/signup - Registro tradicional
// const createUser = async (username, email, password, role = 'user') => {
//     try {
//         console.log('Crear usuario:', { username, email, role });
        
//         if (!username || !email || !password) {
//             throw new Error('Username, email y contraseña son obligatorios');
//         }
        
//         const result = await pool.query(queries.insertUser, [
//             username,     // $1 - name
//             email,        // $2 - email
//             password,     // $3 - password (ya hasheado)
//             role          // $4 - role
//         ]);
        
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error en createUser:', error.message);
//         throw new Error('Error al crear usuario');
//     }
// }

// //[POST] /api/login - Buscar por username
// const findUserByUsername = async (username) => {
//     try {
//         console.log('Buscando usuario por nombre:', username);
        
//         if (!username) {
//             throw new Error('Nombre de usuario es obligatorio');
//         }
        
//         const result = await pool.query(queries.findUserByUsername, [username]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error en findUserByUsername:', error.message);
//         throw new Error('Error al buscar usuario por nombre');
//     }
// }

// //[GET] /api/recoverpassword - Buscar por email
// // const findUserByEmail = async (email) => {
// //     try {
// //         console.log('Buscando usuario por email:', email);
        
// //         if (!email) {
// //             throw new Error('Email es obligatorio');
// //         }
        
// //         const result = await pool.query(queries.findUserByEmail, [email]);
// //         return result.rows[0];
// //     } catch (error) {
// //         console.error('Error en findUserByEmail:', error.message);
// //         throw new Error('Error al buscar usuario por email');
// //     }
// // }
// const findUserByEmail = async (email) => {
//     if (!email) throw new Error('Email es obligatorio');

//     try {
//         console.log('Buscando usuario por email:', email);
//         const result = await pool.query(queries.findUserByEmail, [email]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error en findUserByEmail:', error.message);
//         throw new Error('Error al buscar usuario por email');
//     }
// };

// //[GOOGLE OAUTH] - Crear usuario de Google
// const createGoogleUser = async (name, email, googleId, role = 'user') => {
//     try {
//         console.log('Creando usuario de Google:', { name, email, googleId, role });
        
//         if (!name || !email || !googleId) {
//             throw new Error('Nombre, email y Google ID son obligatorios');
//         }
        
//         const result = await pool.query(queries.createGoogleUser, [
//             name, 
//             null, // password null para Google
//             email, 
//             role, 
//             'google', // auth_method
//             googleId
//         ]);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error en createGoogleUser:', error.message);
//         throw new Error('Error al crear usuario de Google');
//     }
// }

// //[PUT] Actualizar contraseña por email
// const updatePasswordByEmail = async (email, hashedPassword) => {
//     try {
//         console.log('Actualizando contraseña para:', email);
        
//         const result = await pool.query(
//             'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
//             [hashedPassword, email]
//         );
        
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error en updatePasswordByEmail:', error.message);
//         throw new Error('Error al actualizar contraseña');
//     }
// }

// module.exports = {
//     createUser,
//     findUserByUsername,  
//     findUserByEmail,
//     createGoogleUser,
//     updatePasswordByEmail
// };