
const express = require("express");

const {
  registrarUsuario,
  iniciarSesion
} = require("../controllers/authController");

const router = express.Router();

// Registrar un nuevo usuario
router.post("/registro", registrarUsuario);

// Iniciar sesión
router.post("/login", iniciarSesion);

module.exports = router;
