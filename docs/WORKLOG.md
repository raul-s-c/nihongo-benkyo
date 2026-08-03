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

Actualizacion posterior:

- Las lecturas del diccionario se romanizan localmente para poder sugerir kanji y katakana.
- Las palabras presentes en la ayuda del ejercicio y su contexto aparecen antes que candidatos genericos.

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

### Analisis de progreso Renshuu

Se verifico el endpoint oficial read-only `/v1/profile` con la clave local del MVP, sin registrar ni mostrar la clave.

La respuesta aporta nivel de aventura, actividad diaria, totales, rachas y cobertura por nivel JLPT en vocabulario, kanji, gramatica y frases.

Implementado:

- Boton Actualizar en la pantalla Hoy.
- Estado de carga y error legible.
- Resumen de actividad y racha.
- Cobertura Renshuu para el nivel JLPT seleccionado.
- Referencia Renshuu bajo las habilidades equivalentes de la matriz personal.

Decision:

- Renshuu y Nihongo Benkyo se muestran como fuentes separadas; no se mezclan para fabricar una unica puntuacion.

### Contenido utilizable y plan diario

Se inicio la primera biblioteca de aprendizaje real con ejercicios originales N5-N4, centrados en produccion, lectura, vida diaria y japones de empresa.

Archivos modificados:

- content.js: contenido, vocabulario y metadatos pedagogicos.
- app.js: plan diario, historial por ejercicio, repaso y diccionario.
- index.html y styles.css: ayudas contextuales, controles de repaso y configuracion personalizada.

Funcionalidades anadidas:

- Plan de 2 a 4 ejercicios segun minutos diarios.
- Objetivo JLPT y foco de estudio configurables.
- Priorizacion de puntos debiles y repasos.
- Explicacion y vocabulario para cada ejercicio.
- Diccionario local embebido.
- Registro de comprension por intento.

### Puente con la actividad diaria de Renshuu

Se anadio una propuesta breve posterior a Renshuu. La app lee que categoria tuvo actividad hoy y crea un ejercicio de transferencia activa. La propuesta se presenta claramente como relacionada con la categoria, no con palabras exactas, porque el endpoint de perfil no expone el listado diario de terminos.

### Claridad en la correccion local

Se elimino la presentacion ambigua de puntuaciones bajas como 15 en objetivo y comprension.

La interfaz ahora distingue entre elementos de la respuesta modelo detectados y evaluacion semantica pendiente. Los ejercicios abiertos no reciben una puntuacion ficticia.

### Actualizacion fiable de la PWA

Se detecto que la PWA podia seguir mostrando un app.js anterior pese a que GitHub Pages hubiese terminado el despliegue. Se incremento la version de cache del service worker, se fuerza una consulta de red sin cache para recursos de la propia app y se versionaron las referencias de contenido y aplicacion en HTML.

### Vuelta segura desde Practicar

Se anadio una flecha visible para volver al plan diario desde Practicar. Los borradores se almacenan por ejercicio en el perfil local, de modo que salir de la pantalla no borra la respuesta en curso ni modifica el progreso.

La cache y las referencias de scripts se han versionado de nuevo para que las instalaciones moviles reciban esta actualizacion tras el despliegue.
Tambien se versiona el registro del service worker para activar la renovacion en instalaciones que estuvieran abiertas durante la publicacion.

### Analisis detallado de Renshuu

Se amplio el bloque de Renshuu con una lectura por categorias del perfil read-only: actividad del dia, continuidad por area, comparacion de cobertura para el JLPT seleccionado, ausencia de rachas y una prioridad sugerida. La recomendacion transforma el punto de menor cobertura en una tarea corta de produccion, sin convertir esos datos en una promesa sobre el resultado de un examen.

Se incremento la version de la PWA para que el analisis aparezca tambien en instalaciones moviles que ya estaban abiertas.

### Matriz basada en evidencia propia

Se eliminaron los valores de demostracion con los que nacia el prototipo. Los perfiles nuevos empiezan en cero y los perfiles sin historial que conservaran exactamente aquella semilla se migran a cero. La pantalla Matriz ahora explica que solo se actualiza al finalizar un ejercicio y confirmar la autoevaluacion: repasar suma 1 punto por habilidad y entender suma de 2 a 4. Los datos de Renshuu no se incorporan a estos puntos.

### Plan diario dinamico

El plan usa la evidencia de la app, el foco configurado y los repasos pendientes para priorizar ejercicios. Los usuarios pueden sustituir o saltar cualquier propuesta, anadir una recomendacion extra y recibir un refuerzo relacionado tras marcar "Necesito repasarlo". Los controles solo cambian la ruta de la sesion actual: no alteran el historial ni la matriz.

### Estadisticas y familias de aprendizaje

Se anadio un registro persistente por intento. La pantalla Matriz muestra aciertos automaticos, parciales, ejercicios abiertos confirmados y contenidos marcados para repasar. Cada ejercicio se clasifica en una familia gramatical y una familia lexica, con los terminos de ayuda asociados. La evidencia se expresa como contextual al ejercicio, no como dominio absoluto de una palabra individual.

### Auditoria y progresion curricular

La auditoria detecto que el algoritmo anterior elegia cualquier ejercicio igual o inferior al objetivo JLPT y, con empates iniciales, podia repetir los primeros ejercicios N5 sin una puerta de avance. Se introdujo una ruta por bloques N5-N4 con requisitos de confirmacion, repasos acotados y navegacion que respeta los ejercicios saltados.

### Extension de la ruta hasta N1

La biblioteca y el itinerario se ampliaron con bloques N3, N2 y N1 centrados en coordinacion profesional, negociacion y comunicacion corporativa formal. El objetivo JLPT ahora limita una ruta real con contenido hasta N1, en vez de actuar solo como un selector visual.

### Rutas tematicas y JLPT en paralelo

Se anadio un segundo eje de contenido: tematica. Compras, Ciudad y transporte, y Amistades y ocio disponen ahora de una ruta propia desde N5 hasta N1. Cada ejercicio se etiqueta con una tematica y los terminos de ayuda reciben esa misma evidencia contextual junto con su nivel. El selector de Ajustes se persiste por perfil; el plan mantiene por lo menos una propuesta del bloque troncal y usa el resto para profundizar en la tematica elegida, sin presentar material por encima del nivel desbloqueado. El diccionario muestra esta clasificacion cuando existe.

### Ficha de detalle desde la radial JLPT

Se convirtieron los ejes de la radial y las tarjetas de habilidad en accesos a una ficha de detalle. La ficha agrega intentos por habilidad, contenidos pendientes, terminos deduplicados y etiquetas multiples de tema y JLPT. Para cada ejercicio explica el estado real de disponibilidad en el plan, incluido el bloque previo necesario cuando sigue bloqueado. La navegacion vuelve a Hoy sin modificar el progreso.

### Auditoria de duplicados y rutas

Se revisaron los 57 ejercicios y se anadieron validaciones para impedir IDs o ejercicios exactos duplicados, ejercicios troncales fuera de ruta, piezas repetidas entre bloques y contenido tematico tratado como obligatorio. El plan diario se reconcilia al abrir la app: elimina propuestas repetidas o heredadas de una ruta anterior y busca sustitutos compatibles con el bloque actual. Tambien se corrigio la sustitucion manual para que no pueda devolver el mismo ejercicio que se queria cambiar.

### Eleccion libre dentro de Practicar

Se separo la recomendacion diaria de la navegacion de practica. `Elegir` muestra el contenido desbloqueado de la ruta actual y los ejercicios tematicos o suplementarios del nivel disponible; seleccionar uno no altera las tareas del dia. `Nuevo` busca otra tarea activa y, si la cola no puede ampliarse, rota por ese mismo catalogo disponible. Los intentos de practica libre se guardan en las estadisticas y el repaso espaciado, sin marcar una tarea diaria ajena como completada.

Se actualizo la PWA a la version 0.7.6 y se renovo el cache del service worker para que el cambio llegue tambien a instalaciones moviles existentes.

### Auditoria de controles y respuestas visibles

Se revisaron los controles de navegacion, plan diario, practica, entrada japonesa, perfiles, matriz y Renshuu. Las acciones que antes podian parecer inertes ahora confirman su resultado dentro de la app: guardar ajustes, crear o cargar un perfil, exportar, anadir, sustituir o saltar una propuesta, registrar una autoevaluacion y reiniciar los puntos de la matriz. Cuando no existe una alternativa compatible o falta la clave read-only de Renshuu, la app explica el motivo.

Tambien se corrigio la persistencia de los textos insertados con los botones de particulas, el diccionario y las sugerencias IME: ahora disparan el mismo guardado de borrador que la escritura directa. La confirmacion de reinicio se aclaro para no sugerir que se borra el historial de intentos cuando solo se ponen a cero los puntos de la matriz.

### Correccion de verbos conjugados en el puente de Renshuu

Se detecto un fallo real con una frase correcta: el puente propuso `会う`, pero `僕の友達に会いました。` no se reconocia porque el comparador solo admitia la forma de diccionario. La correccion local ahora identifica las raices de conjugacion de verbos godan, `する`, `来る` y verbos terminados en `る`. Cuando reconoce el termino y una frase japonesa con contexto suficiente, muestra el termino requerido y una estimacion de comprension, dejando claro que la naturalidad fina sigue siendo una revision futura con IA o humana.

Se anadio una prueba automatica que protege especificamente el caso `会う` / `会いました`.

### Pruebas de correccion y gramatica

La suite ahora ejecuta las 67 respuestas modelo del catalogo contra el evaluador. Esta auditoria revelo y corrigio alias de lectura de kanji, alternativas validas de particula (`へ` o `に`) y ejercicios de escucha que estaban comparando por error la frase japonesa reproducida en vez de la respuesta española.

Para la produccion japonesa etiquetada como gramatica, la correccion local verifica que haya suficiente japones y detecta un final verbal o cortés. Si falta, reduce la estimacion y explica que debe revisarse la conjugacion; no se presenta esta comprobacion basica como un analisis linguistico completo. La validacion semantica y de naturalidad fina requerira la futura correccion con IA o revision humana.

### Inicio de sesion y sincronizacion con GitHub

Se registro una OAuth App propia y se desplego un Cloudflare Worker para completar OAuth sin incluir el Client Secret en la PWA. Desde Ajustes, `Conectar GitHub` abre la autorizacion; el Worker valida el estado de la sesion y devuelve el token solo a la pestaña de GitHub Pages que la inicio. Tras autorizar, el progreso se conserva en un Gist privado con el alcance minimo `gist`, se descubre automaticamente desde otro movil u ordenador y se sincroniza despues de cada cambio local. El token sigue siendo local a cada navegador; no forma parte de exportaciones de perfil ni del repositorio.

### Correccion explicable y progreso de sesion

Se sustituyo el renderizado iterativo de furigana por un recorrido de texto que genera cada bloque `ruby` una sola vez; asi se evita que terminos solapados vuelvan a envolver kanji ya anotados. La correccion distingue ahora entre coincidencia con la referencia y comprension probable. Cuando falta un requisito, enumera el termino ausente y detecta sustituciones sencillas de particula, por ejemplo `家に` frente a `家で` al indicar el lugar donde se estudia. La vista Practicar incorpora una barra con el avance real de la sesion diaria y conserva ese contador cuando se abre una practica libre.
