# Registro de decisiones

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
