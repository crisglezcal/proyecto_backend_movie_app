// services/userService.js
const pool = require('../config/db_sql');

// Obtener usuario por ID
const getUserById = async (id) => {
    const result = await pool.query(
        'SELECT id, name, email, avatar, role FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0]; // Devuelve el usuario o undefined
};

// Actualizar usuario por ID
const updateUserById = async (id, newData) => {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const key in newData) {
        fields.push(`${key} = $${idx}`);
        values.push(newData[key]);
        idx++;
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, email, avatar, role`;
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Eliminar usuario por ID
const deleteUserById = async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

// Obtener todos los usuarios (solo admin)
const getAllUsers = async () => {
    const result = await pool.query(
        'SELECT id, name, email, avatar, role FROM users ORDER BY id ASC'
    );
    return result.rows;
};

module.exports = {
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers
};
