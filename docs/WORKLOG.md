# Bitacora de trabajo

Este archivo documenta los pasos realizados en el proyecto. Cada cambio relevante debe anadirse aqui.

## 2026-08-03

### Definicion inicial del producto

Se definio la app como una herramienta movil para aprender japones en sesiones cortas, con objetivo final de trabajar en Japon.

Objetivos acordados:

- Practica de japones a espanol.
- Practica de espanol a japones.
- Palabras por categoria.
- Descripcion de objetos o situaciones.
- Respuestas a preguntas.
- Frases usando particulas.
- Ejercicios para vida diaria y empresa.
- Correccion flexible e inteligente.
- Progreso guardado por usuario.
- Integracion futura con Renshuu.

### Investigacion de Renshuu

Se comprobo que Renshuu tiene una API oficial.

Notas:

- La API key se encuentra en Renshuu dentro de Tools > Renshuu API.
- Renshuu indica que no planea incluir funcionalidad de quizzes en la API.
- La app debe usar Renshuu como apoyo de datos, no como reemplazo de sus cuestionarios.

### Creacion del prototipo HTML

Archivos creados:

- `index.html`
- `styles.css`
- `app.js`

Funcionalidad anadida:

- Layout movil.
- Navegacion inferior.
- Pantalla Hoy.
- Pantalla Practicar.
- Pantalla Matriz.
- Pantalla Ajustes.
- Ejercicios iniciales.
- Teclado auxiliar japones.
- Evaluacion provisional.
- Guardado local.

### Radar JLPT

Se anadio un radar visual por nivel JLPT.

Niveles:

- N5
- N4
- N3
- N2
- N1

Aspectos:

- Vocabulario.
- Kanji.
- Gramatica.
- Particulas.
- Lectura.
- Produccion.
- Escucha.
- Empresa.

### Gestion de API key de Renshuu

Se recibio una API key read-only del usuario.

Decision tomada:

- No escribir la clave en el codigo.
- No documentar la clave completa.
- Guardarla solo desde Ajustes en `localStorage`.

Actualizacion:

- Se anadio soporte para precargar la clave desde `secrets.local.js` durante el MVP local.
- Se anadio `secrets.local.js` a `.gitignore`.
- Se anadio `secrets.local.example.js` como plantilla sin clave.

### Preparacion para varios usuarios

Se modifico el estado local para soportar perfiles.

Motivo:

- El uso inicial sera personal.
- El producto podria comercializarse en el futuro.
- Cada usuario debe tener progreso y ajustes propios.

Implementado:

- Selector de perfil.
- Creacion de perfil local.
- Estado separado por usuario.
- Migracion basica desde el estado anterior.

### Documentacion del proyecto

Se anadieron estos archivos:

- `README.md`
- `docs/PROJECT_PLAN.md`
- `docs/FEATURES.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/WORKLOG.md`

Objetivo:

- Que cada paso, funcionalidad y decision quede registrado.
- Facilitar continuar el proyecto sin perder contexto.
- Preparar una base ordenada para GitHub.

### Configuracion de Git local

Se inicializo el repositorio Git local y se configuro:

- Rama principal: `main`.
- Remoto `origin`: `https://github.com/raul-s-c/nihongo-benkyo.git`.
- `safe.directory` para permitir que Codex ejecute comandos Git en esta carpeta.

Estado:

- Archivos creados y pendientes de primer commit.
- No se hizo push automatico.

### Plan profesional de producto

Se creo `docs/PRODUCT_STRATEGY.md`.

Contenido:

- Vision comercial.
- Posicionamiento.
- Audiencias.
- Inspiracion selectiva en Busuu, Renshuu y Duolingo.
- Principios de experiencia movil.
- Identidad visual.
- Estructura futura de la app.
- Modelo de negocio.
- MVP personal.
- MVP comercial.
- Roadmap.
- Metricas.
- Riesgos.
- Criterios de calidad.

Decision:

- El MVP seguira siendo una herramienta comoda para uso personal desde movil.
- La arquitectura, perfiles, documentacion y experiencia se disenaran con una posible comercializacion futura en mente.

### Toggle de furigana

Se anadio un boton global `ふ` en la barra superior.

Funcionalidad:

- Activa o desactiva furigana por usuario.
- Persiste la preferencia en ajustes.
- Renderiza prompts y respuestas modelo con etiquetas HTML `<ruby>`.
- Usa un diccionario local inicial de lecturas.

Limitacion documentada:

- En el MVP no analiza automaticamente cualquier texto japones.
- El diccionario local se ampliara o se sustituira por una solucion morfologica mas adelante.

### Tooltips y proteccion del reinicio

Se anadieron tooltips a los botones principales mediante `data-tooltip`.

Tambien se cambio el comportamiento de `Reiniciar`:

- Antes: reiniciaba la matriz al pulsar.
- Ahora: abre un dialogo de confirmacion.
- La confirmacion explica que solo se restaura el progreso del perfil activo.
- Cancelar o pulsar fuera cierra el dialogo sin cambios.

Objetivo:

- Que cada boton comunique su implicacion.
- Evitar miedo o accidentes con acciones destructivas.

### Mini IME romaji

Se anadio una barra de sugerencias bajo el campo de respuesta.

Funcionalidad:

- Detecta texto latino antes del cursor.
- Sugiere palabras japonesas desde un diccionario local.
- Convierte romaji basico a hiragana.
- Permite tocar una sugerencia para sustituir el token escrito.

Ejemplos:

- `kyo` -> `今日` o `きょ`.
- `kaisha` -> `会社`.
- `nihongo` -> `日本語`.

Objetivo:

- Poder escribir respuestas en japones aunque el movil no tenga teclado japones instalado.
- Reducir friccion durante las sesiones cortas.

### Publicacion movil y PWA

Se anadieron los archivos necesarios para poder instalar la web en movil:

- `manifest.webmanifest` para identidad de aplicacion web.
- `assets/app-icon.svg` como icono.
- `service-worker.js` para cache offline.
- `.github/workflows/deploy-pages.yml` para desplegar automaticamente GitHub Pages desde `main`.

Tambien se actualizo el README con el enlace estable previsto y con las instrucciones de instalacion desde Android.

Decision de producto:

- El progreso y la clave siguen siendo locales a cada navegador.
- No se presentara esta version como sincronizada entre movil y ordenador.
- La correccion actual se documenta explicitamente como provisional: aun no analiza significado ni naturalidad.
- El cache offline usa red primero para que el enlace publicado muestre la ultima version siempre que haya conexion.
