# Funcionalidades

## Implementadas

### Biblioteca inicial y plan personalizado

El plan diario es dinamico: ordena ejercicios por las habilidades con menos evidencia, el foco elegido en Ajustes y los contenidos marcados como pendientes de repaso. Al indicar "Necesito repasarlo", la app puede incorporar un refuerzo de habilidades relacionadas. Cada propuesta explica su motivo y dispone de controles para sustituirla o saltarla; tambien se puede anadir una recomendacion extra. Estas acciones reorganizan la sesion, pero no modifican el progreso.

La ruta guiada sigue bloques con orden real desde Fundamentos N5 hasta Comunicacion formal N1. Para abrir el siguiente bloque hay que confirmar los ejercicios del bloque actual; los repasos pendientes se intercalan como refuerzo, pero no sustituyen el avance. Cada nivel incorpora contenido propio de dificultad creciente y situaciones de empresa.

La app incluye una primera biblioteca de ejercicios originales N5-N1 para practicar desde el movil: traducciones, particulas, respuestas utiles, descripciones, preguntas abiertas, vocabulario por categoria y situaciones de vida diaria y empresa.

Cada ejercicio aporta nivel, habilidades relacionadas, vocabulario con lectura, significado y explicacion gramatical o comunicativa.

El plan diario se genera por perfil segun minutos disponibles, objetivo JLPT, enfoque elegido, habilidades menos desarrolladas y ejercicios que el usuario marco para repasar.

Tras ver la correccion, el usuario elige entre Necesito repasarlo y Lo he entendido. La primera opcion vuelve a priorizar el ejercicio; la segunda registra mas avance en sus habilidades.

### Diccionario rapido y ayudas contextuales

La pantalla Practicar incluye ayuda contextual desplegable para cada ejercicio, tarjetas con palabra, lectura y significado, y un diccionario local con busqueda por japones, romaji o espanol.

Objetivo: evitar abandonar la sesion para buscar una palabra basica fuera de la app.

### Navegacion movil

La app usa una navegacion inferior con cuatro vistas:

- Hoy.
- Practicar.
- Matriz.
- Ajustes.

Objetivo: que la app sea comoda con una mano y parezca pensada para telefono desde el primer dia.

Dentro de Practicar se muestra una flecha para volver al plan de hoy. No registra ni reinicia el ejercicio; los borradores se guardan por ejercicio y reaparecen al volver.

### Instalacion web en movil

La app incluye un manifest web, un icono y cache offline mediante service worker.

Funcionamiento:

- Se publica desde GitHub Pages.
- Android permite anadirla a la pantalla de inicio desde Chrome.
- Con conexion, la app consulta primero la version publicada; sin conexion, usa la ultima copia disponible.

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

La matriz empieza en cero. Guarda puntos propios de Nihongo Benkyo, no una declaracion de nivel ni una prediccion de examen. Al completar un ejercicio, la accion "Necesito repasarlo" suma 1 punto por habilidad relacionada. "Lo he entendido" suma de 2 a 4 puntos segun los elementos de la respuesta modelo reconocidos; si el ejercicio es abierto o requiere revision manual, suma 2 puntos al confirmarlo. Consultar, redactar o pulsar "Corregir" por si solo no cambia la matriz. Los porcentajes de Renshuu permanecen como fuente independiente.

La misma pantalla incluye estadisticas por intento: aciertos reconocidos automaticamente, respuestas parciales, ejercicios abiertos confirmados manualmente y contenidos marcados para repasar. Cada intento se asocia a una familia gramatical y una familia lexica. Los terminos que se listan heredan evidencia contextual del ejercicio donde aparecieron; no se presentan como una correccion aislada de cada palabra.

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

Actualizacion de experiencia:

- La app ya no muestra una cifra aislada de objetivo y comprension.
- En ejercicios con referencia indica el porcentaje de elementos modelo detectados.
- En ejercicios abiertos, o cuando no reconoce suficientes elementos, muestra revision manual.
- La interpretacion semantica queda marcada como pendiente hasta incorporar un evaluador linguistico real.

### Analisis de progreso Renshuu

La pantalla Hoy incluye un bloque de Renshuu que se actualiza manualmente con la clave read-only configurada en Ajustes.

Ademas de nivel, actividad total, racha maxima y cobertura del nivel JLPT seleccionado, la aplicacion genera una lectura explicable de los datos: actividad de hoy por categoria, rachas activas, equilibrio entre vocabulario, kanji, gramatica y frases, areas sin racha y una prioridad concreta de produccion. Esta lectura no se presenta como prediccion de aprobado del JLPT.

Datos mostrados:

- Nivel de aventura.
- Actividad total del dia.
- Mayor racha activa entre las categorias disponibles.
- Cobertura de vocabulario, kanji, gramatica y frases para el nivel JLPT seleccionado.

Integracion con la matriz:

- Las barras de habilidades indican el porcentaje propio de Nihongo Benkyo.
- Cuando existe informacion equivalente, se muestra debajo la cobertura de Renshuu como fuente separada.
- No se mezclan ambas cifras en una puntuacion falsa, porque miden actividades distintas.

Privacidad y limites:

- La consulta se realiza solo al pulsar Actualizar.
- Se guarda una copia local del perfil para consulta offline.
- Cambiar la API key elimina esa copia para no mostrar datos de otra cuenta.

### Ejercicio puente tras Renshuu

En la pantalla Hoy se propone un microejercicio llamado Puente con Renshuu. Se genera a partir de la categoria con mayor actividad en el perfil de Renshuu durante el dia:

- Vocabulario: usar una palabra repasada en una frase personal.
- Kanji: escribir un kanji repasado y usarlo en una frase.
- Gramatica: aplicar una estructura repasada al propio dia.
- Frases: reformular una idea vista en Renshuu.

La API no entrega aun los terminos concretos estudiados durante el dia. Por eso la app no finge conocerlos: el usuario elige uno de los que acaba de repasar y la app aporta la segunda capa de produccion y seguimiento.

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

Implementado: lectura read-only del perfil y de sus porcentajes JLPT.

Pendiente: usar esos datos para proponer ejercicios personalizados.

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

### Rutas tematicas paralelas

Ademas de la progresion por JLPT, cada ejercicio y cada termino de ayuda tiene una tematica y un nivel asociados. Ajustes permite elegir una tematica para profundizar sin desactivar el avance troncal: el plan reserva contenido del bloque curricular actual y completa la sesion con una ruta contextual del nivel que ya esta desbloqueado.

Las rutas iniciales con contenido propio de N5 a N1 son Compras, Ciudad y transporte, y Amistades y ocio. El diccionario muestra los niveles y tematicas en los que aparece cada entrada. Las categorias restantes, como mascotas, se incorporaran cuando tengan una ruta de contenido completa; no se ofrecen como filtros vacios.

Objetivo: permitir que una situacion real se estudie en profundidad mientras la dificultad linguistica sigue una progresion verificable.
