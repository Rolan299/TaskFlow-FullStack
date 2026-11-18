
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, ".env")
});

const conectarMongoDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const productoRoutes = require("./routes/productoRoutes");
const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware para procesar solicitudes
app.use(cors());
app.use(express.json());

// Archivos HTML, CSS y JavaScript
app.use(express.static(path.join(__dirname, "public")));

// Rutas de autenticación
app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
// Comprobar funcionamiento del servidor
app.get("/api/health", (req, res) => {
  res.status(200).json({
    estado: "OK",
    proyecto: "TaskFlow Inventario",
    servidor: "Express",
    baseDatos: "MongoDB Atlas"
  });
});

// Manejo básico de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada."
  });
});

// Iniciar servidor después de conectar MongoDB
async function iniciarServidor() {
  try {
    await conectarMongoDB();

    app.listen(PORT, () => {
      console.log(
        `TaskFlow Inventario activo en puerto ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "No fue posible iniciar TaskFlow Inventario."
    );
    process.exitCode = 1;
  }
}

if (require.main === module) {
  iniciarServidor();
}

module.exports = app;
