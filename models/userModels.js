const pool = require('../config/db_sql'); // Conexión a PostgreSQL
//const queries = require('./queries'); // SQL queries definidas en otro archivo

// GET /api/user -> Obtener usuario por id
const getUserById = async (id) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.getUserById, [id]);
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
        const data = await client.query(queries.updateUserById, [name, email, role, id]);
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
        const data = await client.query(queries.deleteUserById, [id]);
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
        const data = await client.query(queries.getAllUsers);
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

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers
};
