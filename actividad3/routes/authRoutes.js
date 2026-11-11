
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const {
  leerUsuarios,
  guardarUsuarios,
  ejecutarOperacionUsuario
} = require("../services/userService");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Falta configurar JWT_SECRET.");
}

// POST /register - Registrar usuarios
router.post("/register", async (req, res, next) => {
  try {
    const { nombre, correo, password } = req.body || {};

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof correo !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        mensaje: "Introduce nombre, correo válido y contraseña de al menos 8 caracteres."
      });
    }

    const correoNormalizado = correo.trim().toLowerCase();

    const resultado = await ejecutarOperacionUsuario(async () => {
      const usuarios = await leerUsuarios();

      if (usuarios.some(u => u.correo === correoNormalizado)) {
        return null;
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const usuario = {
        id: randomUUID(),
        nombre: nombre.trim(),
        correo: correoNormalizado,
        passwordHash
      };

      usuarios.push(usuario);
      await guardarUsuarios(usuarios);

      return {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      };
    });

    if (!resultado) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado."
      });
    }

    res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: resultado
    });
  } catch (error) {
    next(error);
  }
});

// POST /login - Iniciar sesión
router.post("/login", async (req, res, next) => {
  try {
    const { correo, password } = req.body || {};

    if (
      typeof correo !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        mensaje: "Correo y contraseña obligatorios."
      });
    }

    const usuarios = await ejecutarOperacionUsuario(leerUsuarios);

    const usuario = usuarios.find(
      u => u.correo === correo.trim().toLowerCase()
    );

    if (
      !usuario ||
      !(await bcrypt.compare(password, usuario.passwordHash))
    ) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas."
      });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      mensaje: "Inicio de sesión correcto.",
      token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
