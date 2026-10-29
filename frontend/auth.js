
const form = document.getElementById("auth-form");
const mensaje = document.getElementById("mensaje");
const switchMode = document.getElementById("switch-mode");
const nameGroup = document.getElementById("name-group");
const nombreInput = document.getElementById("nombre");
const passwordInput = document.getElementById("password");

let modoRegistro = false;

switchMode.addEventListener("click", () => {
  modoRegistro = !modoRegistro;

  document.getElementById("form-title").textContent =
    modoRegistro ? "Crear cuenta" : "Iniciar sesión";

  document.getElementById("form-description").textContent =
    modoRegistro
      ? "Regístrate para comenzar a organizar tus actividades."
      : "Accede a tu cuenta para administrar tus tareas.";

  nameGroup.hidden = !modoRegistro;
  nombreInput.required = modoRegistro;

  passwordInput.autocomplete =
    modoRegistro ? "new-password" : "current-password";

  document.getElementById("submit-btn").textContent =
    modoRegistro ? "Crear cuenta" : "Iniciar sesión";

  document.getElementById("switch-label").textContent =
    modoRegistro ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?";

  switchMode.textContent =
    modoRegistro ? "Inicia sesión" : "Regístrate";

  mensaje.textContent = "";
  mensaje.className = "";
});

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const boton = document.getElementById("submit-btn");

  const datos = {
    correo: document.getElementById("correo").value.trim(),
    password: passwordInput.value
  };

  if (modoRegistro) {
    datos.nombre = nombreInput.value.trim();
  }

  const ruta = modoRegistro
    ? "/api/auth/registro"
    : "/api/auth/login";

  boton.disabled = true;
  mensaje.textContent = "Procesando...";
  mensaje.className = "";

  try {
    const respuesta = await fetch(ruta, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "Error en la solicitud.");
    }

    if (modoRegistro) {
      mensaje.textContent =
        "Cuenta creada correctamente. Ahora inicia sesión.";
      mensaje.className = "success";

      switchMode.click();
      return;
    }

    sessionStorage.setItem("taskflow_token", resultado.token);
    window.location.href = "/dashboard.html";

  } catch (error) {
    mensaje.textContent = error.message;
    mensaje.className = "error";
  } finally {
    boton.disabled = false;
  }
});
