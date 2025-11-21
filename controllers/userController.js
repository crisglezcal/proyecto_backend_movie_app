// controllers/userController.js

//const userService = require('../services/userServices');
const pool = require('../config/db_sql');
const userModel = require('../models/userModel');
const queries = require('../queries/users.queries')

// GET /api/user
const getUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autorizado" });
        }

        const user = await userModel.getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Error en getUser:", error);
        res.status(500).json({ error: "Error interno" });
    }
};


// PUT /api/user
const updateUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autorizado" });
        }

        const allowedFields = ["name", "email", "avatar"];
        const newData = {};

        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                newData[key] = req.body[key];
            }
        }

        const updated = await userModel.updateUserById(req.user.id, newData);

        res.status(200).json({
            message: "Usuario actualizado correctamente",
            data: updated
        });

    } catch (error) {
        console.error("Error en updateUser:", error);
        res.status(500).json({ error: "Error interno" });
    }
};


// DELETE /api/user/:id (solo admin)
const deleteUser = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ error: "No autorizado. Solo admin." });
        }

        const { id } = req.params;

        await userModel.deleteUserById(id);

        res.status(200).json({
            message: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({ error: "Error interno" });
    }
};


// GET /profile (render de la vista)
const renderProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        const user = await userModel.getUserById(req.user.id);

        // AQUÍ se usa tu vista profile.pug que extiende layout.pug
        res.status(200).render("profile", { user });

    } catch (error) {
        console.error("Error en renderProfile:", error);
        res.status(500).send("Error interno");
    }
};


// GET /users (solo admin)
const renderUsersList = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }

        const users = await userModel.getAllUsers();

        res.status(200).render("users", { users });

    } catch (error) {
        console.error("Error en renderUsersList:", error);
        res.status(500).send("Error interno");
    }
};

const renderLogin = (req, res) => {
    if (req.session.user) return res.redirect("/profile");
    res.render("profile");
};

// Función para actualizar el perfil del usuario
const updateUserProfile = async (req, res) => {
    const { name, email, role } = req.body;

    // Verificar que los campos name y email existan en la solicitud
    if (!name || !email) {
        return res.status(400).json({ error: 'Nombre, correo y rol son obligatorios' });
    }

    try {
        const userId = req.user.id;

        // Usamos la consulta `updateUserById` para actualizar el usuario
        const result = await pool.query(queries.updateUserById, [name, email, role, userId]);

        // Si no se encuentra el usuario con ese ID
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Redirigir a la página del perfil para que se recargue
        res.redirect('/profile'); // Redirige al perfil del usuario para recargar la página

    } catch (err) {
        console.error('Error al actualizar el perfil:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getUser,
    updateUser,
    deleteUser,
    renderProfile,
    renderUsersList,
    renderLogin,
    updateUserProfile
};

