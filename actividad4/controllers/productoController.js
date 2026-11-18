
const mongoose = require("mongoose");
const Producto = require("../models/Producto");

// GET: Consultar los productos del usuario autenticado
async function obtenerProductos(req, res) {
  try {
    const productos = await Producto.find({
      usuario: req.usuario.id
    }).sort({ createdAt: -1 });

    return res.status(200).json(productos);
  } catch (error) {
    console.error("Error al consultar productos:", error.message);
    return res.status(500).json({
      mensaje: "Error al consultar los productos."
    });
  }
}

// POST: Crear un producto
async function crearProducto(req, res) {
  try {
    const { nombre, descripcion, precio, stock } = req.body || {};

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      nombre.trim().length > 120 ||
      typeof descripcion !== "string" ||
      !descripcion.trim() ||
      descripcion.trim().length > 500 ||
      typeof precio !== "number" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        mensaje: "Datos del producto inválidos."
      });
    }

    const producto = await Producto.create({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio,
      stock,
      usuario: req.usuario.id
    });

    return res.status(201).json({
      mensaje: "Producto creado correctamente.",
      producto
    });
  } catch (error) {
    console.error("Error al crear producto:", error.message);
    return res.status(500).json({
      mensaje: "Error al crear el producto."
    });
  }
}

// PUT: Actualizar un producto propio
async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "Identificador de producto inválido."
      });
    }

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      nombre.trim().length > 120 ||
      typeof descripcion !== "string" ||
      !descripcion.trim() ||
      descripcion.trim().length > 500 ||
      typeof precio !== "number" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return res.status(400).json({
        mensaje: "Datos de actualización inválidos."
      });
    }

    const producto = await Producto.findOneAndUpdate(
      {
        _id: id,
        usuario: req.usuario.id
      },
      {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio,
        stock
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado."
      });
    }

    return res.status(200).json({
      mensaje: "Producto actualizado correctamente.",
      producto
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);
    return res.status(500).json({
      mensaje: "Error al actualizar el producto."
    });
  }
}

// DELETE: Eliminar un producto propio
async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "Identificador de producto inválido."
      });
    }

    const producto = await Producto.findOneAndDelete({
      _id: id,
      usuario: req.usuario.id
    });

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado."
      });
    }

    return res.status(200).json({
      mensaje: "Producto eliminado correctamente."
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    return res.status(500).json({
      mensaje: "Error al eliminar el producto."
    });
  }
}

module.exports = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
