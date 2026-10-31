# Declaración de uso de Inteligencia Artificial

## a) Herramientas utilizadas y momentos

- **Herramienta:** Claude (Anthropic).
- **Momentos de uso:**
  - Planificación de los commits y de la estructura del proyecto.
  - Generación de ejemplos de código HTML, CSS y JavaScript para distintas etapas
    (CRUD, localStorage, consumo de la API, Custom Events y paginación), 
    que fui adaptando y probando commit por commit.
  - Solución de errores durante la integración del código.
  - Redacción del README.md, de este archivo y de la estructura base del informe en Word.

## b) Prompts clave utilizados

1. "Generar una estructura de commits según las etapas del proyecto que debería subir."
2. "En mensaje de error en estado offline, mantener en pantalla hasta realizar intentos de reconexión."
3. "Error al aumentar cantidad de tareas importadas de 10 a 50, adjunto captura del error en
    consola del navegador, menciona sugerencias del motivo de este error."

## c) Partes del código que requirieron ajustes

1. **Bloque de la lista duplicado en `index.html`:** al reemplazar la lista por una sola
   línea, la etiqueta `<ul>` original no se borró y quedó un `id="task-list"` repetido.
   El editor lo marcó como error y lo corregí dejando un solo bloque.
2. **Carga desde la API que no se ejecutaba:** la función `loadTasks` devolvía una lista
   vacía cuando fallaba el almacenamiento, y la aplicación asumía que ya había datos y no
   consultaba la API. Además, las 10 tareas guardadas antes impedían importar las 50. Se
   ajustó para que devolviera `null` y se agregó una versión de los datos (`DATA_VERSION`)
   para volver a importar.
3. **Constante `TASKS_CHANGED` perdida:** al aplicar los cambios del código por partes se
   borró esa constante y apareció el error `TASKS_CHANGED is not defined`, que detenía toda
   la aplicación. La restauré en el bloque de constantes.
4. **Pruebas en la vista previa de Phoenix Code:** la vista previa y el navegador usan
   `localStorage` distintos, así que hubo que borrar los datos guardados para probar la
   carga inicial en cada entorno.