const queries = {
    insertUser: `
        INSERT INTO users (name, surname, email, password, role)
        VALUES ($1, $2, $3, $4, $5);`,

    getAllUsers:`SELECT *
    FROM users`,

    loginUser: `
    SELECT * FROM users
    WHERE name = $1 AND email = $2 AND password = $3;
    `,

    logoutUser: `
        UPDATE users SET logado = false
        WHERE email = $1 AND password = $2;
    `,

    getUser: `
        SELECT id, email, password
        FROM users
        WHERE email = $1 AND password = $2;
    `

};

    
module.exports = queries;