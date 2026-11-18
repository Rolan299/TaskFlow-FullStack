
const request = require("supertest");
const jwt = require("jsonwebtoken");

// Clave exclusiva para las pruebas automatizadas
process.env.JWT_SECRET = "clave-exclusiva-para-pruebas-jest";

// Simulamos Mongoose para no modificar MongoDB Atlas
jest.mock("../models/Producto", () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn()
}));

const Producto = require("../models/Producto");
const app = require("../server");

const usuarioId = "507f1f77bcf86cd799439011";

function crearToken() {
  return jwt.sign(
    {
      id: usuarioId,
      correo: "pruebas@taskflow.test"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("API de productos - TaskFlow Inventario", () => {

  // PRUEBA 1: Proteger rutas sin token
  test("GET sin token responde HTTP 401", async () => {
    const respuesta = await request(app)
      .get("/api/productos");

    expect(respuesta.status).toBe(401);
    expect(respuesta.body.mensaje).toMatch(/token/i);
  });

  // PRUEBA 2: Consultar productos autenticados
  test("GET con token válido devuelve productos", async () => {
    const productosPrueba = [
      {
        _id: "507f1f77bcf86cd799439012",
        nombre: "Monitor de prueba",
        descripcion: "Monitor para pruebas automatizadas",
        precio: 2500,
        stock: 4,
        usuario: usuarioId
      }
    ];

    Producto.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(productosPrueba)
    });

    const respuesta = await request(app)
      .get("/api/productos")
      .set("Authorization", `Bearer ${crearToken()}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(1);
    expect(respuesta.body[0].nombre).toBe("Monitor de prueba");

    expect(Producto.find).toHaveBeenCalledWith({
      usuario: usuarioId
    });
  });

  // PRUEBA 3: Crear un producto válido
  test("POST con datos válidos crea un producto", async () => {
    const nuevoProducto = {
      nombre: "Teclado de prueba",
      descripcion: "Teclado para desarrollo",
      precio: 1500,
      stock: 8
    };

    Producto.create.mockResolvedValue({
      _id: "507f1f77bcf86cd799439013",
      ...nuevoProducto,
      usuario: usuarioId
    });

    const respuesta = await request(app)
      .post("/api/productos")
      .set("Authorization", `Bearer ${crearToken()}`)
      .send(nuevoProducto);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.mensaje).toBe(
      "Producto creado correctamente."
    );

    expect(Producto.create).toHaveBeenCalledWith({
      ...nuevoProducto,
      usuario: usuarioId
    });
  });

  // PRUEBA 4: Rechazar precios negativos
  test("POST rechaza productos con precio negativo", async () => {
    const respuesta = await request(app)
      .post("/api/productos")
      .set("Authorization", `Bearer ${crearToken()}`)
      .send({
        nombre: "Producto inválido",
        descripcion: "Prueba de validación",
        precio: -100,
        stock: 5
      });

    expect(respuesta.status).toBe(400);
    expect(Producto.create).not.toHaveBeenCalled();
  });

  // PRUEBA 5: Actualizar producto propio
  test("PUT actualiza un producto del usuario autenticado", async () => {
    const productoId = "507f1f77bcf86cd799439014";

    const cambios = {
      nombre: "Monitor actualizado",
      descripcion: "Monitor de 27 pulgadas",
      precio: 3500,
      stock: 6
    };

    Producto.findOneAndUpdate.mockResolvedValue({
      _id: productoId,
      ...cambios,
      usuario: usuarioId
    });

    const respuesta = await request(app)
      .put(`/api/productos/${productoId}`)
      .set("Authorization", `Bearer ${crearToken()}`)
      .send(cambios);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.producto.precio).toBe(3500);

    expect(Producto.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: productoId,
        usuario: usuarioId
      },
      cambios,
      {
        new: true,
        runValidators: true
      }
    );
  });

  // PRUEBA 6: Rechazar identificadores inválidos
  test("PUT rechaza un identificador inválido", async () => {
    const respuesta = await request(app)
      .put("/api/productos/identificador-invalido")
      .set("Authorization", `Bearer ${crearToken()}`)
      .send({
        nombre: "Monitor",
        descripcion: "Monitor de prueba",
        precio: 2000,
        stock: 3
      });

    expect(respuesta.status).toBe(400);
    expect(Producto.findOneAndUpdate).not.toHaveBeenCalled();
  });

  // PRUEBA 7: Impedir actualizar productos ajenos
  test("PUT no permite actualizar un producto ajeno", async () => {
    const productoId = "507f1f77bcf86cd799439015";

    Producto.findOneAndUpdate.mockResolvedValue(null);

    const respuesta = await request(app)
      .put(`/api/productos/${productoId}`)
      .set("Authorization", `Bearer ${crearToken()}`)
      .send({
        nombre: "Producto ajeno",
        descripcion: "Intento de modificación",
        precio: 1000,
        stock: 2
      });

    expect(respuesta.status).toBe(404);

    expect(Producto.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: productoId,
        usuario: usuarioId
      }),
      expect.any(Object),
      expect.any(Object)
    );
  });

  // PRUEBA 8: Eliminar producto propio
  test("DELETE elimina un producto del usuario autenticado", async () => {
    const productoId = "507f1f77bcf86cd799439016";

    Producto.findOneAndDelete.mockResolvedValue({
      _id: productoId,
      usuario: usuarioId
    });

    const respuesta = await request(app)
      .delete(`/api/productos/${productoId}`)
      .set("Authorization", `Bearer ${crearToken()}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.mensaje).toBe(
      "Producto eliminado correctamente."
    );

    expect(Producto.findOneAndDelete).toHaveBeenCalledWith({
      _id: productoId,
      usuario: usuarioId
    });
  });

  // PRUEBA 9: Impedir eliminar productos ajenos
  test("DELETE no elimina productos de otros usuarios", async () => {
    const productoId = "507f1f77bcf86cd799439017";

    Producto.findOneAndDelete.mockResolvedValue(null);

    const respuesta = await request(app)
      .delete(`/api/productos/${productoId}`)
      .set("Authorization", `Bearer ${crearToken()}`);

    expect(respuesta.status).toBe(404);

    expect(Producto.findOneAndDelete).toHaveBeenCalledWith({
      _id: productoId,
      usuario: usuarioId
    });
  });

});
