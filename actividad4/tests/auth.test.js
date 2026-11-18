
const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "clave-exclusiva-para-pruebas-jest";

// Simular el modelo Usuario sin acceder a MongoDB Atlas
jest.mock("../models/Usuario", () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

const Usuario = require("../models/Usuario");
const app = require("../server");

const usuarioPrueba = {
  _id: "507f1f77bcf86cd799439011",
  nombre: "Usuario de prueba",
  correo: "usuario@taskflow.test"
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Autenticación - TaskFlow Inventario", () => {

  // PRUEBA 1: Registrar un usuario correctamente
  test("POST registro crea un usuario válido", async () => {
    Usuario.findOne.mockResolvedValue(null);

    Usuario.create.mockImplementation(async (datos) => ({
      _id: usuarioPrueba._id,
      ...datos
    }));

    const respuesta = await request(app)
      .post("/api/auth/registro")
      .send({
        nombre: usuarioPrueba.nombre,
        correo: usuarioPrueba.correo,
        password: "PasswordSeguro2026!"
      });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.mensaje).toBe(
      "Usuario registrado correctamente."
    );
    expect(respuesta.body.usuario.correo).toBe(
      usuarioPrueba.correo
    );

    const datosGuardados = Usuario.create.mock.calls[0][0];

    expect(datosGuardados.passwordHash).not.toBe(
      "PasswordSeguro2026!"
    );

    expect(
      await bcrypt.compare(
        "PasswordSeguro2026!",
        datosGuardados.passwordHash
      )
    ).toBe(true);
  });

  // PRUEBA 2: Rechazar contraseñas demasiado cortas
  test("POST registro rechaza contraseña corta", async () => {
    const respuesta = await request(app)
      .post("/api/auth/registro")
      .send({
        nombre: "Usuario de prueba",
        correo: "usuario@taskflow.test",
        password: "123"
      });

    expect(respuesta.status).toBe(400);
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  // PRUEBA 3: Impedir correos duplicados
  test("POST registro rechaza correo duplicado", async () => {
    Usuario.findOne.mockResolvedValue(usuarioPrueba);

    const respuesta = await request(app)
      .post("/api/auth/registro")
      .send({
        nombre: "Otro usuario",
        correo: usuarioPrueba.correo,
        password: "PasswordSeguro2026!"
      });

    expect(respuesta.status).toBe(409);
    expect(Usuario.create).not.toHaveBeenCalled();
  });

  // PRUEBA 4: Iniciar sesión y generar JWT
  test("POST login genera token con credenciales válidas", async () => {
    const passwordHash = await bcrypt.hash(
      "PasswordSeguro2026!",
      4
    );

    Usuario.findOne.mockResolvedValue({
      ...usuarioPrueba,
      passwordHash
    });

    const respuesta = await request(app)
      .post("/api/auth/login")
      .send({
        correo: usuarioPrueba.correo,
        password: "PasswordSeguro2026!"
      });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.token).toBeDefined();
    expect(respuesta.body.usuario.correo).toBe(
      usuarioPrueba.correo
    );

    const datosToken = jwt.verify(
      respuesta.body.token,
      process.env.JWT_SECRET
    );

    expect(datosToken.id).toBe(usuarioPrueba._id);
  });

  // PRUEBA 5: Rechazar contraseña incorrecta
  test("POST login rechaza contraseña incorrecta", async () => {
    const passwordHash = await bcrypt.hash(
      "PasswordSeguro2026!",
      4
    );

    Usuario.findOne.mockResolvedValue({
      ...usuarioPrueba,
      passwordHash
    });

    const respuesta = await request(app)
      .post("/api/auth/login")
      .send({
        correo: usuarioPrueba.correo,
        password: "PasswordIncorrecto"
      });

    expect(respuesta.status).toBe(401);
    expect(respuesta.body.token).toBeUndefined();
  });

  // PRUEBA 6: Rechazar credenciales incompletas
  test("POST login rechaza campos incompletos", async () => {
    const respuesta = await request(app)
      .post("/api/auth/login")
      .send({
        correo: usuarioPrueba.correo
      });

    expect(respuesta.status).toBe(400);
    expect(Usuario.findOne).not.toHaveBeenCalled();
  });

});
