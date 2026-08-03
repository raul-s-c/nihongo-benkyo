# Registro de decisiones

## 2026-08-03: Publicacion PWA en GitHub Pages

Se elige GitHub Pages para el MVP porque el proyecto es estatico, no necesita un servidor propio y cada push a `main` puede actualizar un enlace estable para movil.

Consecuencias:

- La URL publica contiene solo archivos versionados.
- `secrets.local.js` permanece ignorado y no puede usarse como configuracion de la version publicada.
- El estado en `localStorage` no se sincroniza entre dispositivos.
- La futura comercializacion requerira autenticacion y backend antes de prometer continuidad de progreso.

## 2026-08-03: Empezar con HTML movil

Decision: crear una app estatica HTML/CSS/JS antes de convertir a APK.

Motivo:

- Iteracion rapida.
- Facil probar en navegador movil.
- Menos friccion inicial.
- Compatible con PWA y Capacitor en fases posteriores.

## 2026-08-03: Correccion con dos criterios

Decision: separar la evaluacion en correccion objetiva y comprension comunicativa.

Motivo:

- Las traducciones no deben depender de una unica respuesta literal.
- Una frase puede ser entendible aunque no sea natural.
- El usuario necesita feedback realista, no solo bien/mal.

## 2026-08-03: Renshuu como fuente complementaria

Decision: usar Renshuu para informar la practica, no para reemplazarlo.

Motivo:

- Renshuu ya cubre SRS y quizzes.
- La API de Renshuu no esta pensada para replicar quizzes.
- La app debe centrarse en practica flexible, produccion y objetivos personales.

Actualizacion:

- La app consulta el perfil read-only de Renshuu de forma manual.
- Sus porcentajes JLPT se muestran junto al progreso propio, sin fusionar escalas diferentes.
- Cambiar la clave elimina la copia local del perfil anterior.

## 2026-08-03: No guardar API keys en codigo

Decision: la clave read-only de Renshuu se introduce en Ajustes y se guarda localmente.

Motivo:

- Evitar subir secretos a GitHub.
- Preparar una futura arquitectura con backend.
- Reducir riesgo aunque la clave sea read-only.

Actualizacion MVP:

- Para comodidad local se permite precargar la clave desde `secrets.local.js`.
- `secrets.local.js` esta incluido en `.gitignore`.
- `secrets.local.example.js` documenta la forma del archivo sin incluir claves reales.

## 2026-08-03: Preparar perfiles desde el principio

Decision: el estado local se organiza por usuarios/perfiles.

Motivo:

- Hoy el producto es personal.
- En el futuro podria comercializarse.
- Es mas facil empezar con separacion de usuarios que migrar despues desde un estado global.

## 2026-08-03: Radar JLPT por habilidades

Decision: mostrar preparacion JLPT N5-N1 con un radar por aspectos.

Motivo:

- JLPT da una escala objetiva.
- El objetivo laboral exige mas que aprobar tests.
- El radar permite ver desequilibrios, por ejemplo vocabulario alto pero produccion baja.

## 2026-08-03: Progreso guiado por autovaloracion

Decision: no convertir la estimacion local de una respuesta en una nota definitiva.

Motivo: el MVP aun no tiene un evaluador semantico capaz de juzgar respuestas libres, y la longitud de una frase no equivale a dominio real.

Implementado: cada intento se registra como solido o repaso; el plan siguiente prioriza los ejercicios pendientes de repaso y el avance crece mas cuando el usuario indica comprension solida.

## 2026-08-03: Mantener el MVP sin servicio externo de cuentas

Decision: los perfiles continuan siendo locales y se conservan las copias manuales de exportacion e importacion.

Motivo:

- El MVP debe funcionar sin crear ni administrar cuentas en una plataforma adicional.
- Una PWA estatica no puede custodiar con seguridad el secreto de una aplicacion OAuth.
- GitHub Device Flow es una opcion futura valida para identificar usuarios con GitHub, pero requiere registrar una OAuth App y otorgar acceso explicito a un almacenamiento privado.

## 2026-08-03: Sincronizacion privada con GitHub OAuth y Cloudflare Worker

Decision: usar GitHub OAuth con alcance minimo `gist` y un Cloudflare Worker como intermediario para el intercambio del codigo OAuth.

Motivo: GitHub bloquea por CORS el intercambio directo desde una PWA estatica. El Worker conserva el Client Secret fuera del navegador y devuelve el token exclusivamente a la ventana que inicio la autorizacion.

Implementacion:

- La PWA abre una ventana de autorizacion de GitHub mediante `https://nihongo-benkyo-auth.raul-nihongo.workers.dev/auth/start`.
- El Worker valida un `state` protegido por cookie, intercambia el codigo OAuth y devuelve el token a la PWA mediante `postMessage` dirigido al origen de GitHub Pages.
- El token queda solo en el almacenamiento local de ese navegador.
- El progreso completo se guarda en un Gist privado llamado `Nihongo Benkyo private progress sync`.
- Al conectar otro dispositivo, la app busca ese Gist, compara la fecha de actualizacion y conserva la copia mas reciente.

Limites aceptados del MVP:

- Dos cambios simultaneos en distintos dispositivos se resuelven por la copia mas reciente.
- La revision semantica avanzada no se delega en GitHub; esta integracion solo identifica al usuario y guarda progreso.
- Una version comercial debera migrar a un backend propio con resolucion de conflictos por evento.
