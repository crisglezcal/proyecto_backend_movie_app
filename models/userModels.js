const pool = require('../config/db_sql'); // Conexión a PostgreSQL

// ================================================== FUNCIONES PARA GOOGLE OAUTH ==================================================

// GET /api/user -> Buscar usuario por email (para Google OAuth)
const findUserByEmail = async (email) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        result = data.rows[0];
    } catch (err) {
        console.error('Error en findUserByEmail:', err);
        throw err;
    } finally {
        if (client) {
            client.release();
        } else {
            console.warn('No se pudo crear cliente en findUserByEmail');
        }
    }
    return result;
};

// POST /api/user -> Crear usuario (para Google OAuth)
const createUser = async (name, email, role, password = null) => {
    let client, result;
    try {
        client = await pool.connect();
        const query = `
            INSERT INTO users (name, email, role, password, auth_method, google_id) 
            VALUES ($1, $2, $3, $4, 'google', $5) 
            RETURNING *
        `;
        // Generar un google_id temporal
        const googleId = `google_${Date.now()}`;
        const data = await client.query(query, [name, email, role, password, googleId]);
        result = data.rows[0];
    } catch (err) {
        console.error('Error en createUser:', err);
        throw err;
    } finally {
        if (client) {
            client.release();
        } else {
            console.warn('No se pudo crear cliente en createUser');
        }
    }
    return result;
};

// ================================================== FUNCIONES DE USUARIOS ==================================================
// GET /api/user -> Obtener usuario por id
const getUserById = async (id) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        result = data.rows[0];
    } catch (err) {
        console.error('Error en getUserById:', err);
        throw err;
    } finally {
        if (client) {
            client.release();
        } else {
            console.warn('No se pudo crear cliente en getUserById');
        }
    }
    return result;
};
// PUT /api/user -> Actualizar usuario
const updateUserById = async (id, userData) => {
    const { name, email, role } = userData;
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(
            'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4', 
            [name, email, role, id]
        );
        result = data.rowCount;
    } catch (err) {
        console.error('Error en updateUserById:', err);
        throw err;
    } finally {
        if (client) {
            client.release();
        } else {
            console.warn('No se pudo crear cliente en updateUserById');
        }
    }
    return result;
};
// DELETE /api/user/:id -> Borrar usuario
const deleteUserById = async (id) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query('DELETE FROM users WHERE id = $1', [id]);
        result = data.rowCount;
    } catch (err) {
        console.error('Error en deleteUserById:', err);
        throw err;
    } finally {
        if (client) {
            client.release();
        } else {
            console.warn('No se pudo crear cliente en deleteUserById');
        }
    }
    return result;
};
// GET /users -> Obtener todos los usuarios
const getAllUsers = async () => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query('SELECT * FROM users');
        result = data.rows;
    } catch (err) {
        console.error('Error en getAllUsers:', err);
        throw err;
    } finally {
        if (client) {
            client.release();
        } else {
            console.warn('No se pudo crear cliente en getAllUsers');
        }
    }
    return result;
};

// ================================================== EXPORTAR TODAS LAS FUNCIONES ==================================================
module.exports = {
    findUserByEmail,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers
};