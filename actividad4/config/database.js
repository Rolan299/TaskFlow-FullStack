
const mongoose = require("mongoose");

async function conectarMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("Conexión exitosa a MongoDB Atlas");
    console.log("Base de datos:", mongoose.connection.name);
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error.message);
    throw error;
  }
}

module.exports = conectarMongoDB;
