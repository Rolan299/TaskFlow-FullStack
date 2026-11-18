
"use strict";

const API_AUTH = "/api/auth";
const API_PRODUCTOS = "/api/productos";

const $ = (id) => document.getElementById(id);

let token = sessionStorage.getItem("taskflow_token");
let usuarioActual = null;
let productos = [];
let modoRegistro = false;

try {
  usuarioActual = JSON.parse(
    sessionStorage.getItem("taskflow_usuario") || "null"
  );
} catch {
  sessionStorage.removeItem("taskflow_usuario");
}

// Mostrar mensajes de éxito o error
function mostrarMensaje(elemento, mensaje, tipo = "error") {
  elemento.textContent = mensaje;
  elemento.className = `message ${tipo}`;
}

function limpiarMensaje(elemento) {
  elemento.textContent = "";
  elemento.className = "message hidden";
}

// Realizar solicitudes a nuestra API
async function solicitarAPI(ruta, opciones = {}) {
  const headers = {
    ...opciones.headers
  };

  if (opciones.body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(ruta, {
    ...opciones,
    headers
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    if (
      (respuesta.status === 401 || respuesta.status === 403) &&
      ruta.startsWith(API_PRODUCTOS)
    ) {
      cerrarSesion();
    }

    throw new Error(
      datos.mensaje || `Error HTTP ${respuesta.status}`
    );
  }

  return datos;
}

// Alternar entre iniciar sesión y crear cuenta
function cambiarModo(registro) {
  modoRegistro = registro;

  $("loginTab").classList.toggle("active", !registro);
  $("registerTab").classList.toggle("active", registro);
  $("nameGroup").classList.toggle("hidden", !registro);

  $("nombre").required = registro;
  $("password").autocomplete = registro
    ? "new-password"
    : "current-password";

  $("authTitle").textContent = registro
    ? "Crear cuenta"
    : "Iniciar sesión";

  $("authSubtitle").textContent = registro
    ? "Regístrate para administrar tu inventario."
    : "Ingresa tus credenciales para continuar.";

  $("authSubmit").textContent = registro
    ? "Crear cuenta"
    : "Iniciar sesión";

  limpiarMensaje($("authMessage"));
}

// Mostrar panel de usuario
function mostrarDashboard() {
  $("authSection").classList.add("hidden");
  $("dashboardSection").classList.remove("hidden");

  $("sidebarUser").textContent =
    usuarioActual?.nombre || "Usuario";

  cargarProductos();
}

// Registrar o iniciar sesión
$("authForm").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const boton = $("authSubmit");
  boton.disabled = true;

  limpiarMensaje($("authMessage"));

  const correo = $("correo").value.trim();
  const password = $("password").value;
  const nombre = $("nombre").value.trim();

  try {
    if (modoRegistro) {
      await solicitarAPI(`${API_AUTH}/registro`, {
        method: "POST",
        body: JSON.stringify({
          nombre,
          correo,
          password
        })
      });

      cambiarModo(false);
      $("password").value = "";

      mostrarMensaje(
        $("authMessage"),
        "Cuenta creada correctamente. Ahora inicia sesión.",
        "success"
      );
    } else {
      const resultado = await solicitarAPI(
        `${API_AUTH}/login`,
        {
          method: "POST",
          body: JSON.stringify({ correo, password })
        }
      );

      token = resultado.token;
      usuarioActual = resultado.usuario;

      sessionStorage.setItem("taskflow_token", token);
      sessionStorage.setItem(
        "taskflow_usuario",
        JSON.stringify(usuarioActual)
      );

      $("authForm").reset();
      mostrarDashboard();
    }
  } catch (error) {
    mostrarMensaje($("authMessage"), error.message);
  } finally {
    boton.disabled = false;
  }
});

// Cerrar sesión
function cerrarSesion() {
  token = null;
  usuarioActual = null;
  productos = [];

  sessionStorage.removeItem("taskflow_token");
  sessionStorage.removeItem("taskflow_usuario");

  $("dashboardSection").classList.add("hidden");
  $("productModal").classList.add("hidden");
  $("authSection").classList.remove("hidden");

  $("authForm").reset();
  cambiarModo(false);
}

$("logoutButton").addEventListener("click", cerrarSesion);

// Formato de moneda mexicana
function formatoMoneda(valor) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  }).format(valor);
}

// Consultar productos de MongoDB
async function cargarProductos() {
  try {
    const resultado = await solicitarAPI(API_PRODUCTOS);

    productos = Array.isArray(resultado) ? resultado : [];

    actualizarEstadisticas();
    mostrarProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error.message);
    mostrarMensaje($("authMessage"), error.message);
  }
}

// Actualizar indicadores del panel
function actualizarEstadisticas() {
  const unidades = productos.reduce(
    (total, producto) => total + producto.stock,
    0
  );

  const valor = productos.reduce(
    (total, producto) =>
      total + producto.precio * producto.stock,
    0
  );

  $("totalProducts").textContent = productos.length;
  $("totalStock").textContent = unidades;
  $("inventoryValue").textContent = formatoMoneda(valor);
}

// Crear botones de acciones de forma segura
function crearBotonAccion(texto, clase, accion, id) {
  const boton = document.createElement("button");

  boton.type = "button";
  boton.textContent = texto;
  boton.className = `action-btn ${clase}`;
  boton.dataset.accion = accion;
  boton.dataset.id = id;

  return boton;
}

// Mostrar tabla y búsqueda
function mostrarProductos() {
  const tabla = $("productsTable");
  const busqueda = $("searchProduct").value
    .trim()
    .toLowerCase();

  tabla.replaceChildren();

  const filtrados = productos.filter((producto) =>
    `${producto.nombre} ${producto.descripcion}`
      .toLowerCase()
      .includes(busqueda)
  );

  if (filtrados.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 5;
    celda.className = "empty-state";
    celda.textContent = busqueda
      ? "No se encontraron productos."
      : "Todavía no tienes productos registrados.";

    fila.appendChild(celda);
    tabla.appendChild(fila);
    return;
  }

  filtrados.forEach((producto) => {
    const fila = document.createElement("tr");

    [
      producto.nombre,
      producto.descripcion,
      formatoMoneda(producto.precio),
      String(producto.stock)
    ].forEach((valor) => {
      const celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    });

    const acciones = document.createElement("td");
    const contenedor = document.createElement("div");

    contenedor.className = "action-buttons";

    contenedor.appendChild(
      crearBotonAccion(
        "Editar",
        "edit",
        "editar",
        producto._id
      )
    );

    contenedor.appendChild(
      crearBotonAccion(
        "Eliminar",
        "delete",
        "eliminar",
        producto._id
      )
    );

    acciones.appendChild(contenedor);
    fila.appendChild(acciones);
    tabla.appendChild(fila);
  });
}

$("searchProduct").addEventListener("input", mostrarProductos);

// Abrir formulario de nuevo producto
function abrirNuevoProducto() {
  $("productForm").reset();
  $("productId").value = "";

  $("productModalTitle").textContent = "Nuevo producto";
  $("saveProductButton").textContent = "Guardar producto";

  limpiarMensaje($("productMessage"));
  $("productModal").classList.remove("hidden");
  $("productName").focus();
}

// Abrir formulario de edición
function abrirEditarProducto(id) {
  const producto = productos.find((p) => p._id === id);

  if (!producto) return;

  $("productId").value = producto._id;
  $("productName").value = producto.nombre;
  $("productDescription").value = producto.descripcion;
  $("productPrice").value = producto.precio;
  $("productStock").value = producto.stock;

  $("productModalTitle").textContent = "Editar producto";
  $("saveProductButton").textContent = "Guardar cambios";

  limpiarMensaje($("productMessage"));
  $("productModal").classList.remove("hidden");
  $("productName").focus();
}

function cerrarModal() {
  $("productModal").classList.add("hidden");
}

$("newProductButton").addEventListener(
  "click",
  abrirNuevoProducto
);

$("closeModalButton").addEventListener(
  "click",
  cerrarModal
);

$("cancelProductButton").addEventListener(
  "click",
  cerrarModal
);

// Guardar producto nuevo o actualizado
$("productForm").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const id = $("productId").value;
  const boton = $("saveProductButton");

  const producto = {
    nombre: $("productName").value.trim(),
    descripcion: $("productDescription").value.trim(),
    precio: Number($("productPrice").value),
    stock: Number($("productStock").value)
  };

  if (
    !producto.nombre ||
    !producto.descripcion ||
    !Number.isFinite(producto.precio) ||
    producto.precio < 0 ||
    !Number.isInteger(producto.stock) ||
    producto.stock < 0
  ) {
    mostrarMensaje(
      $("productMessage"),
      "Verifica los datos del producto."
    );
    return;
  }

  boton.disabled = true;
  limpiarMensaje($("productMessage"));

  try {
    await solicitarAPI(
      id ? `${API_PRODUCTOS}/${id}` : API_PRODUCTOS,
      {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(producto)
      }
    );

    cerrarModal();
    await cargarProductos();
  } catch (error) {
    mostrarMensaje($("productMessage"), error.message);
  } finally {
    boton.disabled = false;
  }
});

// Eliminar un producto
async function eliminarProducto(id) {
  const producto = productos.find((p) => p._id === id);

  if (!producto) return;

  const confirmar = window.confirm(
    `¿Deseas eliminar "${producto.nombre}"?`
  );

  if (!confirmar) return;

  try {
    await solicitarAPI(`${API_PRODUCTOS}/${id}`, {
      method: "DELETE"
    });

    await cargarProductos();
  } catch (error) {
    window.alert(error.message);
  }
}

// Gestionar acciones de la tabla
$("productsTable").addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton) return;

  const { accion, id } = boton.dataset;

  if (accion === "editar") {
    abrirEditarProducto(id);
  }

  if (accion === "eliminar") {
    eliminarProducto(id);
  }
});

// Recuperar sesión mientras el token siga vigente
if (token && usuarioActual) {
  mostrarDashboard();
} else {
  sessionStorage.removeItem("taskflow_token");
  sessionStorage.removeItem("taskflow_usuario");
  token = null;
}
