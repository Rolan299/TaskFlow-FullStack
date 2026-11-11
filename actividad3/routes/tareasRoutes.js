
const express = require("express");
const { randomUUID } = require("crypto");
const validarTarea = require("../middleware/validationMiddleware");
const {
  leerTareas,
  guardarTareas,
  ejecutarOperacion
} = require("../services/taskService");

const router = express.Router();

// GET /tareas - Consultar todas las tareas
router.get("/", async (req, res, next) => {
  try {
    const tareas = await ejecutarOperacion(leerTareas);
    res.status(200).json(tareas);
  } catch (error) {
    next(error);
  }
});

// POST /tareas - Crear una tarea
router.post("/", validarTarea, async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body || {};

    if (
      typeof titulo !== "string" ||
      !titulo.trim() ||
      typeof descripcion !== "string" ||
      !descripcion.trim()
    ) {
      return res.status(400).json({
        mensaje: "El título y la descripción son obligatorios."
      });
    }

    const nuevaTarea = await ejecutarOperacion(async () => {
      const tareas = await leerTareas();

      const tarea = {
        id: randomUUID(),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        completada: false,
        fechaCreacion: new Date().toISOString()
      };

      tareas.push(tarea);
      await guardarTareas(tareas);

      return tarea;
    });

    res.status(201).json({
      mensaje: "Tarea creada correctamente.",
      tarea: nuevaTarea
    });
  } catch (error) {
    next(error);
  }
});

// PUT /tareas/:id - Actualizar una tarea
router.put("/:id", validarTarea, async (req, res, next) => {
  try {
    const { titulo, descripcion, completada } = req.body || {};

    if (
      typeof titulo !== "string" ||
      !titulo.trim() ||
      typeof descripcion !== "string" ||
      !descripcion.trim() ||
      typeof completada !== "boolean"
    ) {
      return res.status(400).json({
        mensaje: "Datos de actualización inválidos."
      });
    }

    const tareaActualizada = await ejecutarOperacion(async () => {
      const tareas = await leerTareas();
      const tarea = tareas.find(t => t.id === req.params.id);

      if (!tarea) return null;

      tarea.titulo = titulo.trim();
      tarea.descripcion = descripcion.trim();
      tarea.completada = completada;

      await guardarTareas(tareas);

      return tarea;
    });

    if (!tareaActualizada) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada."
      });
    }

    res.status(200).json({
      mensaje: "Tarea actualizada correctamente.",
      tarea: tareaActualizada
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /tareas/:id - Eliminar una tarea
router.delete("/:id", async (req, res, next) => {
  try {
    const eliminada = await ejecutarOperacion(async () => {
      const tareas = await leerTareas();
      const indice = tareas.findIndex(t => t.id === req.params.id);

      if (indice === -1) return false;

      tareas.splice(indice, 1);
      await guardarTareas(tareas);

      return true;
    });

    if (!eliminada) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada."
      });
    }

    res.status(200).json({
      mensaje: "Tarea eliminada correctamente."
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
