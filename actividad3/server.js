require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const {
  rutaNoEncontrada,
  manejarErrores
} = require("./middleware/errorMiddleware");
// Middleware para procesar solicitudes JSON
app.use(bodyParser.json());
const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);
const tareasRoutes = require("./routes/tareasRoutes");
const verificarToken = require("./middleware/authMiddleware");

app.use("/tareas", verificarToken, tareasRoutes);
// Ruta principal
app.get("/", (req, res) => {
  res.status(200).json({
    proyecto: "TaskFlow - Actividad 3",
    mensaje: "API RESTful funcionando correctamente",
    almacenamiento: "Archivos JSON con fs.promises"
  });
});

// Ruta de comprobación
app.get("/health", (req, res) => {
  res.status(200).json({
    estado: "OK",
    servidor: "Express",
    puerto: PORT
  });
});

app.use(rutaNoEncontrada);
app.use(manejarErrores);
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`TaskFlow Actividad 3 activo en puerto ${PORT}`);
});
