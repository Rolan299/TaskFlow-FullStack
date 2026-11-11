
function rutaNoEncontrada(req, res, next) {
  res.status(404).json({
    mensaje: "Ruta no encontrada.",
    ruta: req.originalUrl
  });
}

function manejarErrores(err, req, res, next) {
  // Registrar el error para facilitar la depuración.
  console.error("[ERROR]", {
    metodo: req.method,
    ruta: req.originalUrl,
    mensaje: err.message
  });

  // Errores al interpretar el cuerpo JSON.
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      mensaje: "El cuerpo de la solicitud contiene JSON inválido."
    });
  }

  // Errores con un código HTTP definido.
  const estado =
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status < 600
      ? err.status
      : 500;

  return res.status(estado).json({
    mensaje:
      estado === 500
        ? "Error interno del servidor."
        : err.message
  });
}

module.exports = {
  rutaNoEncontrada,
  manejarErrores
};
