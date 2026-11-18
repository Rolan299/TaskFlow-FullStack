
const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const autorizacion = req.headers.authorization;

  // Comprobar que se recibió un token Bearer
  if (
    !autorizacion ||
    !autorizacion.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token requerido."
    });
  }

  const token = autorizacion.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Token requerido."
    });
  }

  try {
    // Verificar la firma y vigencia del JWT
    const usuario = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    // Guardar los datos del usuario autenticado
    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(403).json({
      mensaje: "Token inválido o expirado."
    });
  }
}

module.exports = verificarToken;
