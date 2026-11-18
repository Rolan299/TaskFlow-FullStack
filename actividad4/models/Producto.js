
const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "El stock debe ser un número entero."
    }
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Producto", productoSchema);
