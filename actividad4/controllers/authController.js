
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// REGISTRO DE USUARIOS
async function registrarUsuario(req, res) {
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

    const existente = await Usuario.findOne({
      correo: correoNormalizado
    });

    if (existente) {
      return res.status(409).json({
        mensaje: "Este correo ya está registrado."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      correo: correoNormalizado,
      passwordHash
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Este correo ya está registrado."
      });
    }

    console.error("Error de registro:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al registrar usuario."
    });
  }
}

// INICIO DE SESIÓN
async function iniciarSesion(req, res) {
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

    const usuario = await Usuario.findOne({
      correo: correo.trim().toLowerCase()
    });

    if (
      !usuario ||
      !(await bcrypt.compare(password, usuario.passwordHash))
    ) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas."
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id.toString(),
        correo: usuario.correo
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      mensaje: "Inicio de sesión correcto.",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });
  } catch (error) {
    console.error("Error de login:", error.message);

    return res.status(500).json({
      mensaje: "Error interno al iniciar sesión."
    });
  }
}

module.exports = {
  registrarUsuario,
  iniciarSesion
};
