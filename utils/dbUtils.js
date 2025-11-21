const pool = require('../config/db_sql');

// Método genérico para ejecutar consultas SQL
async function executeQuery(query, values) {
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw new Error('Error al ejecutar la consulta');
    }
}

module.exports = { executeQuery };