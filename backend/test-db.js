const pool = require("./config/database");

async function probarConexion() {
  try {
    const resultado = await pool.query(
      "SELECT current_database() AS base_datos, NOW() AS fecha"
    );

    console.log("Conexión exitosa a PostgreSQL");
    console.log(resultado.rows[0]);
  } catch (error) {
    console.error("Error de conexión:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

probarConexion();