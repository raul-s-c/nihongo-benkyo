# Funcionalidades

## Implementadas

### Navegacion movil

La app usa una navegacion inferior con cuatro vistas:

- Hoy.
- Practicar.
- Matriz.
- Ajustes.

Objetivo: que la app sea comoda con una mano y parezca pensada para telefono desde el primer dia.

### Instalacion web en movil

La app incluye un manifest web, un icono y cache offline mediante service worker.

Funcionamiento:

- Se publica desde GitHub Pages.
- Android permite anadirla a la pantalla de inicio desde Chrome.
- Una nueva version publicada reemplaza la cache anterior al volver a abrir la app.

Limitacion:

- El progreso sigue siendo local al navegador y no se comparte entre dispositivos.

### Pantalla Hoy

Muestra una sesion diaria sugerida y acceso rapido a practicar.

Objetivo: reducir friccion y facilitar sesiones cortas.

### Radar JLPT

Muestra preparacion estimada para N5, N4, N3, N2 y N1.

Aspectos medidos:

- Vocabulario.
- Kanji.
- Gramatica.
- Particulas.
- Lectura.
- Produccion.
- Escucha.
- Empresa.

Objetivo: ver de forma visual si el usuario esta listo para un nivel JLPT en cada habilidad relevante.

### Matriz de progreso

Lista cada habilidad con un valor acumulado y una barra de avance.

Objetivo: convertir cada ejercicio en progreso visible.

### Practica

Ejercicios iniciales:

- Traduccion de japones a espanol.
- Traduccion de espanol a japones.
- Uso de particulas.
- Palabras por categoria.
- Respuesta a preguntas.

Objetivo: cubrir produccion y comprension, no solo reconocimiento pasivo.

### Teclado auxiliar japones

Incluye botones rapidos para:

- は
- が
- を
- に
- で
- ます

Objetivo: ayudar en movil incluso si el teclado japones no esta configurado.

### Mini IME romaji

Cuando el usuario escribe en romaji dentro del campo de respuesta, la app muestra sugerencias japonesas.

Ejemplos:

- `kyo` sugiere `今日` y `きょ`.
- `kaisha` sugiere `会社`.
- `nihongo` sugiere `日本語`.

Funcionamiento actual:

- Detecta la palabra latina justo antes del cursor.
- Muestra una barra horizontal de sugerencias.
- Al tocar una sugerencia, sustituye el token escrito por japones.
- Incluye conversion basica de romaji a hiragana.
- Incluye un diccionario local inicial para kanji frecuentes del MVP.

Objetivo:

- Permitir escribir japones aunque el telefono no tenga teclado japones configurado.
- Reducir friccion durante la practica.
- Preparar una futura experiencia de entrada similar a una IME real.

### Toggle de furigana

Incluye un boton global `ふ` en la barra superior para activar o desactivar furigana en textos japoneses mostrados por la app.

Estado actual:

- Funciona sobre textos renderizados por la app, como prompts y respuestas modelo.
- Usa un diccionario local pequeno y extensible.

Objetivo:

- Facilitar lectura rapida en movil.
- Permitir estudiar con o sin ayuda visual.
- Preparar una futura integracion con un analizador morfologico o diccionario mas completo.

### Correccion provisional

La correccion actual es local y temporal.

Devuelve:

- Puntuacion objetiva.
- Puntuacion de comprension.
- Respuesta modelo.
- Feedback provisional.

Objetivo: fijar la forma de feedback antes de conectar IA real.

Limitacion importante:

- La puntuacion actual se basa en senales simples de presencia, longitud y escritura japonesa; no comprende el significado de la respuesta.
- No debe interpretarse como una medicion real de nivel ni como una correccion linguistica definitiva.

### Perfiles locales

Permite crear y cambiar perfiles de usuario dentro del navegador.

Cada perfil conserva:

- Progreso.
- Ajustes.
- API key de Renshuu.
- Ejercicio actual.

Objetivo: preparar la app para varios usuarios o futura comercializacion.

### Ajustes

Permite configurar:

- Perfil activo.
- API key read-only de Renshuu.
- Objetivo principal.
- Minutos diarios.

Objetivo: separar preferencias del codigo.

### Tooltips y confirmacion destructiva

Todos los botones principales muestran una explicacion breve de su efecto mediante `data-tooltip`.

El boton `Reiniciar` ya no modifica la matriz directamente:

- Abre un dialogo de confirmacion.
- Explica que solo afecta al progreso del perfil activo.
- Permite cancelar sin cambios.

Objetivo:

- Reducir miedo a tocar la interfaz.
- Evitar acciones destructivas accidentales.
- Hacer clara la implicacion de cada boton.

## Pendientes

### Evaluador IA real

Debe valorar respuestas libres sin depender de una lista cerrada.

### Integracion Renshuu

Debe usar datos read-only para proponer ejercicios personalizados.

### Sesiones diarias adaptativas

Debe elegir ejercicios segun:

- Progreso.
- Debilidades.
- Tiempo disponible.
- Objetivo JLPT.
- Objetivo profesional.

### Voz y escucha

Posibles mejoras:

- Texto a voz japones.
- Dictado.
- Evaluacion de pronunciacion.

### Backend

Necesario para:

- Comercializacion.
- Seguridad de claves.
- Sincronizacion.
- Modelos de pago.

### Sincronizacion de cuenta

Necesaria para conservar el mismo perfil y progreso en movil, ordenador y futuras instalaciones.
