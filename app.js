const API = "https://dummyjson.com";

const form = document.getElementById("loginForm");
const errorElement = document.getElementById("error");
const button = document.getElementById("enviar");
const contenido = document.getElementById("contenido");
let usuarioActual = null;
let tareas = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorElement.textContent = "";
  button.disabled = true;
  button.textContent = "Entrando…";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo iniciar sesión");
    }

    localStorage.setItem("accessToken", data.accessToken);

    await cargarPerfil();
  } catch (error) {
    errorElement.textContent =
      error instanceof Error
        ? error.message
        : "Ocurrió un error al iniciar sesión.";
  } finally {
    button.disabled = false;
    button.textContent = "Iniciar Sesión";
  }
});

async function cargarPerfil() {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      form.hidden = false;
      contenido.hidden = true;
      throw new Error("La sesión expiró. Inicia sesión nuevamente.");
    }

    if (!response.ok) {
      throw new Error("No se pudo cargar el perfil.");
    }

    const usuario = await response.json();

    usuarioActual = usuario;

    await cargarTareas(usuario.id);

    document.getElementById("foto").src = usuario.image;

    document.getElementById("nombre").textContent =
      `${usuario.firstName} ${usuario.lastName}`;

    document.getElementById("correo").textContent = usuario.email;

    document.getElementById("usuario").textContent = usuario.username;

    document.getElementById("edad").textContent = usuario.age;

    form.hidden = true;
    contenido.hidden = false;
  } catch (error) {
    errorElement.textContent = error.message;
  }
}

const tokenGuardado = localStorage.getItem("accessToken");

if (tokenGuardado) {
  cargarPerfil();
}

const cerrarSesion = document.getElementById("cerrarSesion");

cerrarSesion.addEventListener("click", () => {
  localStorage.removeItem("accessToken");

  contenido.hidden = true;
  form.hidden = false;
  errorElement.textContent = "";
  form.reset();
});

async function cargarTareas(userId) {
  try {
    const response = await fetch(`${API}/todos/user/${userId}`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las tareas.");
    }

    const data = await response.json();

    tareas = data.todos;
    mostrarTareas();

    console.log("Tareas cargadas:", tareas);
  } catch (error) {
    errorElement.textContent = error.message;
  }
}

function mostrarTareas() {
  const lista = document.getElementById("listaTareas");
  const filtro = document.getElementById("filtro").value;
  const busqueda = document.getElementById("buscar").value.toLowerCase();

  const completadas = tareas.filter((tarea) => tarea.completed).length;
  const pendientes = tareas.filter((tarea) => !tarea.completed).length;

  document.getElementById("totalTareas").textContent = tareas.length;
  document.getElementById("tareasCompletadas").textContent = completadas;
  document.getElementById("tareasPendientes").textContent = pendientes;

  const porcentaje = tareas.length
    ? Math.round((completadas / tareas.length) * 100)
    : 0;

  document.getElementById("progreso").textContent = `${porcentaje}%`;

  const tareasFiltradas = tareas
    .filter((tarea) => {
      if (filtro === "pendientes") return !tarea.completed;
      if (filtro === "completadas") return tarea.completed;
      return true;
    })
    .filter((tarea) => tarea.todo.toLowerCase().includes(busqueda))
    .sort((a, b) => a.id - b.id);

  lista.replaceChildren();

  tareasFiltradas.forEach((tarea) => {
    const elemento = document.createElement("li");
    elemento.textContent = tarea.todo;

    if (tarea.completed) {
      elemento.textContent += " (Completada)";
    } else {
      elemento.textContent += " (Pendiente)";
    }

    lista.appendChild(elemento);
  });
}

