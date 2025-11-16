const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


// ===============================
// 🔹 Middleware: Usuario autenticado
// ===============================
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Buscar token en cookies o header
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.redirect("/login");
    }

    // Verificar JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Guardamos info del usuario en la request
    req.user = decoded;

    next();

  } catch (error) {
    return res.redirect("/login");
  }
};


// ===============================
// 🔹 Middleware: Solo Administrador
// ===============================
exports.isAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar rol
    if (decoded.role !== "admin") {
      return res.status(403).send("No tienes permisos para acceder aquí.");
    }

    req.user = decoded;

    next();

  } catch (error) {
    return res.redirect("/login");
  }
};
