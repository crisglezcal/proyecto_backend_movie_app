const pool = require('../config/db_pgsql'); // Conexión a PostgreSQL
const queries = require('./queries'); // SQL queries definidas en otro archivo

// GET /api/user -> Obtener usuario por id
const getUserById = async (id) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.getUserById, [id]);
        result = data.rows[0]; // devuelve un solo usuario
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
    return result;
};

// PUT /api/user -> Actualizar usuario
const updateUserById = async (id, userData) => {
    const { name, email, role } = userData;
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.updateUserById, [
            name,
            email,
            role,
            id
        ]);
        result = data.rowCount; // cantidad de filas afectadas
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
    return result;
};

// DELETE /api/user/:id -> Borrar usuario
const deleteUserById = async (id) => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.deleteUserById, [id]);
        result = data.rowCount; // cantidad de filas eliminadas
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
    return result;
};

// GET /users -> Obtener todos los usuarios
const getAllUsers = async () => {
    let client, result;
    try {
        client = await pool.connect();
        const data = await client.query(queries.getAllUsers);
        result = data.rows; // devuelve array de usuarios
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
    return result;
};

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers
};
