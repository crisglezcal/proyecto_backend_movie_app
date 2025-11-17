// controllers/userController.js

const userModel = require('../models/userModels'); // Importar el modelo de la BBDD

// GET /api/user 
// Obtener datos del perfil
const getUser = async (req, res) => {
    const userId = req.user.id; // viene del middleware auth

    const user = await userModel.getUserById(userId); // método del modelo

    res.status(200).json(user);
};

// PUT /api/user
// Editar datos del perfil del usuario o administrador
const updateUser = async (req, res) => {
    const userId = req.user.id;
    const newData = req.body; // {name, email, ...}

    await userModel.updateUserById(userId, newData);

    res.status(200).json({
        message: "Usuario actualizado correctamente",
        data: newData
    });
};

// DELETE /api/user/:id
// Borrar un usuario de la base de datos (solo admin)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    await userModel.deleteUserById(id);

    res.status(200).json({
        message: "Usuario eliminado correctamente",
    });
};

// GET /profile (ver el perfil)
const renderProfile = async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.getUserById(userId);

    res.status(200).render("profile", { user });
};

// GET /users (ver los usuarios - solo admin)
const renderUsersList = async (req, res) => {
    const users = await userModel.getAllUsers();

    res.status(200).render("users", { users });
};

// Exportar estilo simple
module.exports = {
    getUser,
    updateUser,
    deleteUser,
    renderProfile,
    renderUsersList
};
