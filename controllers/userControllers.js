// controllers/userController.js

const userModel = require('../models/userModels');


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

        // Sanitizar campos permitidos
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


// GET /profile
const renderProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        const user = await userModel.getUserById(req.user.id);

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


module.exports = {
    getUser,
    updateUser,
    deleteUser,
    renderProfile,
    renderUsersList
};
