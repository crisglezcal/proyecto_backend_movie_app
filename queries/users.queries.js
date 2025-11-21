const queries = {
    // =================================================== AUTENTICACIÓN TRADICIONAL ===================================================
    insertUser: `
        INSERT INTO users (name, surname, email, password, role)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`,

    findUserByUsername: `
        SELECT * FROM users WHERE name = $1;`,

    findUserByEmail: `
        SELECT * FROM users WHERE email = $1;`,

    // =================================================== GOOGLE OAUTH ===================================================
    createGoogleUser: `
        INSERT INTO users (name, password, email, role, auth_method, google_id) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,

    // =================================================== GESTIÓN DE USUARIOS ===================================================
    getAllUsers: `
        SELECT * FROM users;`,

    getUserById: `
        SELECT * FROM users WHERE id = $1;`,

    updateUserById: `
        UPDATE users SET name = $1, email = $2, role = $3 
        WHERE id = $4 RETURNING *;`,

    deleteUserById: `
        DELETE FROM users WHERE id = $1 RETURNING *;`,

    // =================================================== OTRAS CONSULTAS ===================================================
    loginUser: `
        SELECT * FROM users
        WHERE name = $1 AND email = $2 AND password = $3;`,

    logoutUser: `
        UPDATE users SET logado = false
        WHERE email = $1 AND password = $2;`,

    getUser: `
        SELECT id, email, password
        FROM users
        WHERE email = $1 AND password = $2;`
};

module.exports = queries;