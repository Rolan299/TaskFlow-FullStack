
const fs = require("fs").promises;
const path = require("path");

const archivoUsuarios = path.join(__dirname, "../data/usuarios.json");

// Cola para organizar las operaciones sobre el archivo.
let cola = Promise.resolve();

async function leerUsuarios() {
  try {
    const contenido = await fs.readFile(archivoUsuarios, "utf8");
    const usuarios = JSON.parse(contenido);

    if (!Array.isArray(usuarios)) {
      throw new Error("El archivo de usuarios no contiene un arreglo.");
    }

    return usuarios;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function guardarUsuarios(usuarios) {
  await fs.writeFile(
    archivoUsuarios,
    JSON.stringify(usuarios, null, 2),
    "utf8"
  );
}

function ejecutarOperacionUsuario(operacion) {
  const resultado = cola.then(operacion);
  cola = resultado.catch(() => {});
  return resultado;
}

module.exports = {
  leerUsuarios,
  guardarUsuarios,
  ejecutarOperacionUsuario
};
