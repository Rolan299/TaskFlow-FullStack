
const express = require("express");
const verificarToken = require("../middleware/authMiddleware");

const {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require("../controllers/productoController");

const router = express.Router();

// Todas las rutas requieren autenticación JWT
router.use(verificarToken);

router.get("/", obtenerProductos);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

module.exports = router;
