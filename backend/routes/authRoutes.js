
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const router = express.Router();

// Registrar un nuevo usuario
router.post("/registro", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof correo !== "string" ||
      typeof password !== "string" ||
      !nombre.trim() ||
      !correo.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        mensaje: "Introduce nombre, correo y contraseña de al menos 8 caracteres."
      });
    }

    const correoNormalizado = correo.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
      return res.status(400).json({
        mensaje: "El correo electrónico no es válido."
      });
    }

    const hash = await bcrypt.hash(password, 12);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, correo`,
      [nombre.trim(), correoNormalizado, hash]
    );

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: resultado.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        mensaje: "Este correo ya está registrado."
      });
    }

    console.error("Error al registrar usuario:", error.message);
    return res.status(500).json({
      mensaje: "No fue posible registrar al usuario."
    });
  }
});

// Iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (typeof correo !== "string" || typeof password !== "string") {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios."
      });
    }

    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo.trim().toLowerCase()]
    );

    const usuario = resultado.rows[0];

    if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas."
      });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      mensaje: "Inicio de sesión correcto",
      token
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    return res.status(500).json({
      mensaje: "No fue posible iniciar sesión."
    });
  }
});

module.exports = router;
