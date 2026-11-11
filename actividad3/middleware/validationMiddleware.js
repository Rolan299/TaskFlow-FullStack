
function validarTarea(req, res, next) {
  const { titulo, descripcion, completada } = req.body || {};

  if (
    typeof titulo !== "string" ||
    !titulo.trim() ||
    titulo.trim().length > 120
  ) {
    return res.status(400).json({
      mensaje: "El título debe contener entre 1 y 120 caracteres."
    });
  }

  if (
    typeof descripcion !== "string" ||
    !descripcion.trim() ||
    descripcion.trim().length > 500
  ) {
    return res.status(400).json({
      mensaje: "La descripción debe contener entre 1 y 500 caracteres."
    });
  }

  if (
    req.method === "PUT" &&
    typeof completada !== "boolean"
  ) {
    return res.status(400).json({
      mensaje: "El campo completada debe ser verdadero o falso."
    });
  }

  next();
}

module.exports = validarTarea;
