
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const pool = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use(express.static(path.join(__dirname, "../frontend")));
const tareasRoutes = require("./routes/tareasRoutes");
app.use("/api/tareas", tareasRoutes);


// Ruta inicial
app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a TaskFlow Full Stack",
    estado: "Servidor funcionando"
  });
});

// Ruta para comprobar la base de datos
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      estado: "OK",
      baseDatos: "Conectada"
    });
  } catch (error) {
    console.error("Error de base de datos:", error.message);

    res.status(503).json({
      estado: "ERROR",
      baseDatos: "No disponible"
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor TaskFlow activo en puerto ${PORT}`);
});
