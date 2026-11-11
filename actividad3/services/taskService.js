
const fs = require("fs").promises;
const path = require("path");

const archivoTareas = path.join(__dirname, "../data/tareas.json");

// Cola de operaciones para evitar escrituras simultáneas.
let cola = Promise.resolve();

// Leer las tareas almacenadas en el archivo JSON.
async function leerTareas() {
  try {
    const contenido = await fs.readFile(archivoTareas, "utf8");
    const tareas = JSON.parse(contenido);

    if (!Array.isArray(tareas)) {
      throw new Error("El archivo de tareas no contiene un arreglo.");
    }

    return tareas;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

// Guardar tareas utilizando escritura asíncrona.
async function guardarTareas(tareas) {
  await fs.writeFile(
    archivoTareas,
    JSON.stringify(tareas, null, 2),
    "utf8"
  );
}

// Ejecutar modificaciones de forma secuencial.
function ejecutarOperacion(operacion) {
  const resultado = cola.then(operacion);

  cola = resultado.catch(() => {});

  return resultado;
}

module.exports = {
  leerTareas,
  guardarTareas,
  ejecutarOperacion
};
