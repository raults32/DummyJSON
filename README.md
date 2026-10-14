# Mi panel con DummyJSON

## Descripción
Este proyecto es una página web creada con HTML, CSS y JavaScript que permite iniciar sesión, consultar la información del usuario y administrar sus tareas utilizando la API de DummyJSON.

## Funcionalidades
- Inicio de sesión con usuario y contraseña.
- Guardado del token de sesión en `localStorage`.
- Consulta y visualización del perfil del usuario.
- Consulta de tareas y cálculo del progreso.
- Filtro de tareas completadas y pendientes.
- Búsqueda de tareas por texto.
- Agregar, completar y eliminar tareas.
- Cierre de sesión.

## Tecnologías utilizadas
- HTML
- CSS
- JavaScript
- API de DummyJSON

## Métodos de arreglos utilizados
- `map()`: actualizar una tarea sin modificar directamente el arreglo original.
- `filter()`: filtrar tareas por estado, búsqueda y eliminación.
- `find()`: localizar una tarea por su identificador.
- `sort()`: ordenar las tareas por identificador.
- `forEach()`: recorrer las tareas y mostrarlas en la interfaz.

## Nota
DummyJSON simula las operaciones de escritura. Por eso, las tareas agregadas, modificadas o eliminadas se actualizan localmente en la página, pero no se guardan permanentemente en el servidor.