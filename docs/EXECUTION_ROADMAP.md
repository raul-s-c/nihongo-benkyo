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

## Criterios de cierre

- Toda tarea terminada incluye una verificacion concreta y queda marcada aqui.
- Las tareas bloqueadas describen exactamente la dependencia externa.
- No se afirmara que el radar predice un aprobado JLPT ni que la correccion local comprende significado.

## Siguiente corte

Las dos tareas P0 son el limite intencional del MVP estatico. El siguiente desarrollo comercial debe empezar por autenticacion, una base de datos por usuario y un servicio de evaluacion semantica con consentimiento, limites de coste y borrado de datos. Solo entonces tiene sentido sincronizar dispositivos o valorar equivalencias de traduccion con criterio de significado.
# Base de datos JLPT

- [x] Fijar objetivos acumulados de cobertura: N5 `800/100/100`, N4 `1500/300/150`, N3 `3750/650/220`, N2 `6000/1000/250`, N1 `11000/2100/300` para vocabulario, kanji y gramatica respectivamente.
- [x] Importar y atribuir gramática N5-N2: 583 puntos en JSON, procedentes de Hanabira.
- [ ] Importar vocabulario N5-N2 con lectura y significado en español; se necesita una fuente estructurada que no pierda lecturas ni derechos de distribución comercial.
- [ ] Importar kanji N5-N2 con lecturas, significado y trazos desde fuente MIT/CC BY-SA compatible.
- [ ] Sustituir los puntos agregados actuales por progreso por elemento individual con repetición espaciada.
