
const token = sessionStorage.getItem("taskflow_token");

if (!token) {
  window.location.replace("/");
} else {
  iniciarDashboard();
}

function iniciarDashboard() {
  const lista = document.getElementById("task-list");
  const mensaje = document.getElementById("task-message");
  const formulario = document.getElementById("task-form");

  let tareas = [];
  let filtroActual = "todas";

  const encabezados = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  async function solicitar(ruta, opciones = {}) {
    const respuesta = await fetch(ruta, {
      ...opciones,
      headers: encabezados
    });

    if (respuesta.status === 401 || respuesta.status === 403) {
      sessionStorage.removeItem("taskflow_token");
      window.location.replace("/");
      throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
    }

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "Ocurrió un error.");
    }

    return resultado;
  }

  function actualizarEstadisticas() {
    document.getElementById("total-tareas").textContent = tareas.length;
    document.getElementById("tareas-pendientes").textContent =
      tareas.filter(t => !t.completada).length;
    document.getElementById("tareas-completadas").textContent =
      tareas.filter(t => t.completada).length;
  }

  function renderizar() {
    actualizarEstadisticas();
    lista.replaceChildren();

    const visibles = tareas.filter(t => {
      if (filtroActual === "pendientes") return !t.completada;
      if (filtroActual === "completadas") return t.completada;
      return true;
    });

    if (visibles.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "empty-state";
      vacio.textContent = "No hay tareas en esta categoría.";
      lista.appendChild(vacio);
      return;
    }

    visibles.forEach(tarea => {
      const elemento = document.createElement("article");
      elemento.className =
        `task-item ${tarea.completada ? "completed" : ""}`;

      const info = document.createElement("div");
      info.className = "task-info";

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = tarea.completada;
      check.setAttribute("aria-label", "Completar tarea");

      check.addEventListener("change", async () => {
        await actualizarTarea(tarea, {
          titulo: tarea.titulo,
          completada: check.checked
        });
      });

      const titulo = document.createElement("span");
      titulo.textContent = tarea.titulo;

      info.append(check, titulo);

      const acciones = document.createElement("div");
      acciones.className = "task-actions";

      const editar = document.createElement("button");
      editar.type = "button";
      editar.textContent = "Editar";

      editar.addEventListener("click", async () => {
        const nuevoTitulo = prompt("Modificar tarea:", tarea.titulo);

        if (nuevoTitulo === null) return;

        if (!nuevoTitulo.trim() || nuevoTitulo.trim().length > 120) {
          mensaje.textContent =
            "El título debe tener entre 1 y 120 caracteres.";
          return;
        }

        await actualizarTarea(tarea, {
          titulo: nuevoTitulo.trim(),
          completada: tarea.completada
        });
      });

      const eliminar = document.createElement("button");
      eliminar.type = "button";
      eliminar.textContent = "Eliminar";

      eliminar.addEventListener("click", async () => {
        if (!confirm("¿Eliminar esta tarea?")) return;

        try {
          await solicitar(`/api/tareas/${tarea.id}`, {
            method: "DELETE"
          });
          await cargarTareas();
        } catch (error) {
          mensaje.textContent = error.message;
        }
      });

      acciones.append(editar, eliminar);
      elemento.append(info, acciones);
      lista.appendChild(elemento);
    });
  }

  async function cargarTareas() {
    try {
      mensaje.textContent = "";
      tareas = await solicitar("/api/tareas");
      renderizar();
    } catch (error) {
      mensaje.textContent = error.message;
    }
  }

  async function actualizarTarea(tarea, datos) {
    try {
      await solicitar(`/api/tareas/${tarea.id}`, {
        method: "PUT",
        body: JSON.stringify(datos)
      });
      await cargarTareas();
    } catch (error) {
      mensaje.textContent = error.message;
      renderizar();
    }
  }

  formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    const input = document.getElementById("task-title");
    const titulo = input.value.trim();

    if (!titulo) return;

    try {
      await solicitar("/api/tareas", {
        method: "POST",
        body: JSON.stringify({ titulo })
      });

      input.value = "";
      await cargarTareas();
    } catch (error) {
      mensaje.textContent = error.message;
    }
  });

  document.querySelectorAll("[data-filter]").forEach(boton => {
    boton.addEventListener("click", () => {
      filtroActual = boton.dataset.filter;

      document.querySelectorAll("[data-filter]").forEach(b => {
        b.classList.toggle("filter-active", b === boton);
      });

      renderizar();
    });
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("taskflow_token");
    window.location.replace("/");
  });

  cargarTareas();
}
