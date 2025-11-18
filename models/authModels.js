const pool = require("../config/db_sql");
const queries = require("../queries/users.queries");

const createUser = async (name, surname, email, password, role = 'user') => {
    const result = await pool.query(queries.insertUser, [name, surname, email, password, role]);
    return result;
}

const logInModel = async (name, email, password) => {
    try {
        const valuesLogin = [name, email, password];
        return await pool.query(queries.loginUser, valuesLogin);

    } catch (error) {
        console.error('Error al logar usuario', error.message);
        throw new Error('Error al buscar el usuario por email')
    }
}

const logOutModel = async (email, password) => {
    try {
        const valuesLogout = [email, password];
        return await pool.query(queries.logoutUser, valuesLogout);
    } catch (error) {
        console.error('Error al deslogar usuario', error.message);
        throw new Error('Error al cerrar sesión')
    }
}

const getUserModel = async (email, password) => {
    try {
        const value = [email, password];
        return await pool.query(queries.getUser, value)

    } catch (error) {
        console.error('Error al leer contraseña', erromessage);
        throw new Error('Error al recuperar contraseña')
    }
}

module.exports = {
    createUser,
    logInModel,
    logOutModel,
    getUserModel
}