
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, ".env")
});

const conectarMongoDB = require("./config/database");

async function probarConexion() {
  try {
    await conectarMongoDB();

    await mongoose.connection.db.admin().ping();

    console.log("Ping a MongoDB: OK");
  } catch (error) {
    console.error("No fue posible validar MongoDB Atlas.");
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

probarConexion();
