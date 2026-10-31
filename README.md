# Integradora2
Actividad Integradora 2 - Javascript

# TaskManager

**Estudiante:** Pincay Mora Ana Belén

## Descripción

Aplicación web de gestión de tareas desarrollada con JavaScript puro (ES6+), sin librerías
ni frameworks. Permite crear, editar, eliminar y completar tareas, filtrarlas, buscarlas y
ordenarlas, y funciona sin conexión gracias a `localStorage`. La primera vez que se abre,
importa 50 tareas de prueba desde la API pública JSONPlaceholder.

## Funcionalidades

- **CRUD de tareas** con validación de campos vacíos.
- **Filtros** por estado (Todas, Pendientes, Completadas) y **búsqueda** en tiempo real por título.
- **Ordenamiento** por fecha de creación o por prioridad (alta, media, baja).
- **Dashboard de métricas**: total, pendientes y completadas, actualizado en tiempo real.
- **Paginación** de 10 tareas por página.
- **Consumo de API REST** con `fetch()` y `async/await`, con manejo de errores mediante
  `try/catch` y aviso visual. Si no hay conexión, el aviso se mantiene hasta que se recupera
  la red y se reintenta la carga automáticamente.
- **Persistencia local** con `localStorage`: los cambios se guardan en el navegador y se
  recuperan al recargar o al trabajar sin internet.
- **Custom Events (patrón Observador)**: el gestor de tareas emite el evento `tasks:changed`
  y el dashboard y la lista se actualizan escuchándolo.

## Tecnologías utilizadas

- HTML5
- CSS3 (variables CSS, Flexbox)
- JavaScript (ES6+)
- localStorage (Web Storage API)
- API REST de pruebas [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos)

## Estructura del proyecto

```
Integradora2/
├── index.html
├── styles.css
├── app.js
├── README.md
└── AI_DECLARATION.md
```

## Instrucciones para visualizar el proyecto

1. Clonar el repositorio:
   `git clone https://github.com/anabpm98-dev/Integradora2.git`
2. Abrir la carpeta del proyecto.
3. Hacer doble clic en `index.html` para abrirlo en un navegador.

La primera carga necesita conexión a internet para importar las tareas desde la API.
Después, la aplicación funciona sin conexión con los datos guardados en el navegador.

## Declaración de uso de IA

Consulta el archivo [AI_DECLARATION.md](AI_DECLARATION.md).