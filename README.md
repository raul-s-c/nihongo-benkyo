# Nihongo Benkyo

App movil primero para estudiar japones en ratos libres, con ejercicios flexibles, progreso por habilidades y preparacion JLPT orientada a un objetivo a largo plazo: poder trabajar en Japon.

## Estado actual

Prototipo HTML/CSS/JS sin dependencias externas.

- Interfaz optimizada para telefono.
- Navegacion inferior: Hoy, Practicar, Matriz y Ajustes.
- Radar de preparacion JLPT N5-N1.
- Matriz de progreso por habilidades.
- Ejercicios iniciales de traduccion, particulas, categorias y preguntas.
- Correccion provisional con dos criterios: correccion objetiva y comprension comunicativa.
- Perfiles locales de usuario para dejar abierta una futura comercializacion.
- Campo para API read-only de Renshuu guardado solo en el navegador.

## Objetivo del producto

Crear una app que complemente Renshuu y ayude a practicar produccion real del idioma, no solo respuestas cerradas.

La app debe valorar:

- Si la respuesta es objetivamente correcta.
- Si un receptor japones entenderia la intencion.
- Que aspecto conviene entrenar despues.
- Como se relaciona el avance con JLPT y con situaciones reales de vida/trabajo.

## Uso desde el movil

La version publicada se sirve en:

`https://raul-s-c.github.io/nihongo-benkyo/`

Cada `push` a la rama `main` activa el despliegue de GitHub Pages y actualiza esa misma direccion. En Android, abre el enlace con Chrome y elige **Anadir a pantalla de inicio** para usarla como una app.

El progreso se guarda actualmente en el navegador y dispositivo donde usas la app. Por tanto, movil y ordenador mantienen progresos distintos hasta que exista una cuenta con sincronizacion.

## Ejecucion local

Abre `index.html` directamente en el navegador.

No hay build ni dependencias. La app incluye manifest y cache offline para poder instalarse desde un navegador compatible.

## Publicacion

El workflow [deploy-pages.yml](.github/workflows/deploy-pages.yml) publica el contenido de `main` en GitHub Pages. La primera vez, en GitHub ve a **Settings > Pages** y selecciona **GitHub Actions** como fuente. Despues, cada push actualizara el enlace publicado.

## Documentacion

- [Plan profesional de producto](docs/PRODUCT_STRATEGY.md)
- [Plan del proyecto](docs/PROJECT_PLAN.md)
- [Funcionalidades](docs/FEATURES.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Registro de decisiones](docs/DECISIONS.md)
- [Bitacora de trabajo](docs/WORKLOG.md)

## Repositorio remoto

Repositorio: `https://github.com/raul-s-c/nihongo-benkyo`
