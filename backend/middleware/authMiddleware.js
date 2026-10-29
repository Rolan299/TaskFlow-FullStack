
const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const autorizacion = req.headers.authorization;

  if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token requerido."
    });
  }

  const token = autorizacion.split(" ")[1];

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(403).json({
      mensaje: "Token inválido o expirado."
    });
  }
}

module.exports = verificarToken;
