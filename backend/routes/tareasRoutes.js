
const express = require("express");
const pool = require("../config/database");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// GET: consultar tareas del usuario
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, titulo, completada, fecha_creacion
       FROM tareas
       WHERE usuario_id = $1
       ORDER BY id DESC`,
      [req.usuario.id]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al consultar tareas." });
  }
});

// POST: crear una tarea
router.post("/", async (req, res) => {
  try {
    const { titulo } = req.body;

    if (
      typeof titulo !== "string" ||
      !titulo.trim() ||
      titulo.trim().length > 120
    ) {
      return res.status(400).json({
        mensaje: "El título debe contener entre 1 y 120 caracteres."
      });
    }

    const resultado = await pool.query(
      `INSERT INTO tareas (usuario_id, titulo)
       VALUES ($1, $2)
       RETURNING *`,
      [req.usuario.id, titulo.trim()]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear tarea." });
  }
});

// PUT: editar una tarea y actualizar su estado
router.put("/:id", async (req, res) => {
  try {
    const { titulo, completada } = req.body;
    const id = Number(req.params.id);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      typeof titulo !== "string" ||
      !titulo.trim() ||
      titulo.trim().length > 120 ||
      typeof completada !== "boolean"
    ) {
      return res.status(400).json({
        mensaje: "Datos de actualización inválidos."
      });
    }

    const resultado = await pool.query(
      `UPDATE tareas
       SET titulo = $1, completada = $2
       WHERE id = $3 AND usuario_id = $4
       RETURNING *`,
      [titulo.trim(), completada, id, req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada."
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar tarea." });
  }
});

// DELETE: eliminar una tarea
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        mensaje: "Identificador inválido."
      });
    }

    const resultado = await pool.query(
      `DELETE FROM tareas
       WHERE id = $1 AND usuario_id = $2
       RETURNING id`,
      [id, req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada."
      });
    }

    res.json({
      mensaje: "Tarea eliminada correctamente."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar tarea." });
  }
});

module.exports = router;
