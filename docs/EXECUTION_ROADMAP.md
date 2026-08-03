# Hoja de ejecucion del MVP

Ultima actualizacion: 2026-08-03

Este documento convierte la auditoria tecnica y de producto en trabajo verificable. Los elementos marcados como bloqueados no se simularan: requieren una decision de producto o infraestructura externa.

## P0: Confianza y correccion

- [ ] Evaluacion semantica flexible: requiere un evaluador remoto y una politica de privacidad antes de enviar respuestas de usuarios.
- [~] Sincronizacion: el MVP usa GitHub OAuth y un Gist privado mediante un Cloudflare Worker; el siguiente paso comercial sera sustituir el token local por cuentas propias, almacenamiento de servidor y resolucion de conflictos por evento. Las claves de Renshuu siguen siendo locales al navegador.

## P1: Utilidad diaria del MVP

- [x] Recalibrar el radar para que mida cobertura del contenido disponible, no puntos arbitrarios frente a una cifra JLPT total. Verificacion: la radial y el detalle calculan ejercicios confirmados por habilidad y nivel; no prometen un aprobado.
- [x] Conectar objetivo principal y foco Vida diaria con la planificacion real. Verificacion: el selector de objetivo y el foco diario ponderan empresa o tematicas cotidianas al ordenar el plan.
- [x] Anadir repeticion espaciada con proxima fecha de repaso y prioridad por vencimiento. Verificacion: cada respuesta guarda una fecha e intervalo, y los vencidos se recomiendan antes que contenido nuevo.
- [x] Incorporar contenido inicial para kanji y escucha, con una experiencia de reproduccion de audio local. Verificacion: hay un ejercicio suplementario N5-N1 por cada habilidad; la escucha usa la voz ja-JP disponible en el dispositivo.
- [x] Permitir exportar e importar una copia del progreso local. Verificacion: Ajustes descarga e importa un JSON de perfil, incluyendo intentos, plan y ajustes.
- [x] Documentar controles de datos y limites de privacidad dentro de la app. Verificacion: Ajustes explica almacenamiento local, copia y limite de sincronizacion; la politica ampliada esta en `docs/PRIVACY_MVP.md`.

## P2: Calidad de entrega

- [x] Anadir pruebas automaticas de integridad del contenido y flujo basico de planificacion. Verificacion: `npm test` valida ids, rutas troncales y cobertura suplementaria N5-N1.
- [x] Ejecutar las pruebas en GitHub Actions antes del despliegue. Verificacion: el trabajo `test` es requisito del despliegue de Pages.
- [x] Ofrecer instalacion PWA desde la propia app cuando el navegador lo permita. Verificacion: el boton solo aparece tras el evento estandar de instalacion y delega la confirmacion al navegador.
- [x] Anadir eliminacion controlada de perfiles locales. Verificacion: requiere un segundo perfil y una confirmacion explicita; no toca Renshuu.

## P1.5: Claridad y navegacion movil

- [x] Distinguir practica confirmada de cobertura de catalogo. Verificacion: el radar, sus etiquetas y el detalle hablan de practica confirmada; un perfil nuevo empieza en 0% sin aparentar que la biblioteca este vacia.
- [x] Hacer que `Empezar` vuelva siempre al plan diario. Verificacion: una seleccion manual previa se limpia al iniciar sesion y la barra deja de marcar practica libre.
- [x] Reducir la friccion de la seleccion manual. Verificacion: `Elegir` ofrece busqueda, nivel JLPT y tematica, con contador de resultados, en lugar de una lista plana.
- [x] Agrupar las acciones de sustituir y saltar. Verificacion: cada propuesta muestra un unico menu de acciones con etiquetas legibles.
- [x] Aclarar que GitHub sincroniza perfiles y progreso, mientras que la clave de Renshuu sigue local. Verificacion: Ajustes explica ambas situaciones sin contradiccion.
- [x] Eliminar desplazamiento horizontal en la superficie movil. Verificacion: la raiz limita el desbordamiento horizontal.

## Criterios de cierre

- Toda tarea terminada incluye una verificacion concreta y queda marcada aqui.
- Las tareas bloqueadas describen exactamente la dependencia externa.
- No se afirmara que el radar predice un aprobado JLPT ni que la correccion local comprende significado.

## Fuentes de contenido y licencia

- [x] Vocabulario y kanji: `scriptin/jmdict-simplified` distribuye conversiones JSON de JMdict y KANJIDIC2 bajo CC BY-SA 4.0. Los catalogos generados conservan lecturas, glosas, atribucion y licencia en `data/SOURCES.md`.
- [x] Etiquetado JLPT: se incorporaron etiquetas pedagogicas versionadas de `stephenmk/yomitan-jlpt-vocab` para vocabulario y de `anzumura/kanji-tools` para kanji. La interfaz y la documentacion indican que no son listas oficiales cerradas.
- [x] Importacion: `scripts/import-jlpt-vocabulary.mjs` y `scripts/import-jlpt-kanji.mjs` generan catalogos consultables por la PWA; las pruebas validan cobertura, metadatos e identificadores.

## Siguiente corte

Las dos tareas P0 son el limite intencional del MVP estatico. El siguiente desarrollo comercial debe empezar por autenticacion, una base de datos por usuario y un servicio de evaluacion semantica con consentimiento, limites de coste y borrado de datos. Solo entonces tiene sentido sincronizar dispositivos o valorar equivalencias de traduccion con criterio de significado.
# Base de datos JLPT

Consulta el progreso cuantitativo en [CONTENT_COMPLETENESS.md](CONTENT_COMPLETENESS.md). El inventario se recalcula con `scripts/report-content-completeness.mjs` tras cada importacion.

- [x] Fijar objetivos acumulados de cobertura: N5 `800/100/100`, N4 `1500/300/150`, N3 `3750/650/220`, N2 `6000/1000/250`, N1 `11000/2100/300` para vocabulario, kanji y gramatica respectivamente.
- [x] Importar y atribuir gramática N5-N2: 583 puntos en JSON, procedentes de Hanabira.
- [x] Importar vocabulario N5-N2 con lectura y significado en espanol; el catalogo actual se extiende hasta N1 y se documenta con CC BY-SA 4.0.
- [x] Importar kanji N5-N2 con lecturas, significado y trazos desde fuente MIT/CC BY-SA compatible; el catalogo actual se extiende hasta N1.
- [ ] Sustituir los puntos agregados actuales por progreso por elemento individual con repetición espaciada.
