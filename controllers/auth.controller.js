const authModel = require("../models/authModels");

// POST http://localhost:3000/api/signup
const createUser = async (req, res) => {
    try {
        const { name, surname, email, password, role } = req.body;
        console.log("BODY RECIBIDO:", req.body);
        if(!name || !surname || !email || !password || !role) {
            return res.status(400).json({ message: "Faltan campos por rellenar"});
        }

        const newUser = await authModel.createUser(name, surname, email, password, role);
        console.log("USUARIO CREADO:", newUser);
        res.status(201).json({
            message: "Usuario creado correctamente",
            user: newUser
        })
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error});
    }
}

// POST http://localhost:3000/api/login
const logIn = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        if(!name || !email || !password) {
            return res.status(400).json({ message: "Faltan campos por rellenar"});
        }
        const userLogin = await authModel.logInModel(name, email, password);
            res.status(201).json({
            message: "Login correcto",
            user: userLogin
        })
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error});
    }
}

const logOut = async (req, res) => {
    const { email, password } = req.body;
    try {
            if(!email || !password) {
            return res.status(400).json({ message: "Faltan campos por rellenar"});
            }

            const userLogout = await authModel.logOutModel(email, password);
            res.status(201).json({
            message: "Logout correcto",
            email: userLogout.email,
            password: userLogout.password
            })
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error});
    }
}

const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) {
            return res.status(400).json({ message: "Faltan campos por rellenar"});
        }

        const userRecoverPassword = await authModel.getUserModel(email);
            res.status(201).json({
            message: "Contraseña:",
            id: userRecoverPassword.id,
            email: userRecoverPassword.email,
            password: userRecoverPassword.password
            })
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error});
    }
}

module.exports = {
    createUser,
    logIn,
    logOut,
    recoverPassword
}