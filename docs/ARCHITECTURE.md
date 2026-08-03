# Arquitectura

## Entrega web

La aplicacion se publica como sitio estatico desde GitHub Pages. El workflow `.github/workflows/deploy-pages.yml` se ejecuta en cada push a `main` y entrega la raiz del repositorio.

El manifest `manifest.webmanifest`, el icono `assets/app-icon.svg` y `service-worker.js` permiten instalar la aplicacion desde navegadores compatibles y conservar una copia offline de los recursos de interfaz.

El service worker no cachea `secrets.local.js`, por lo que una clave local nunca se incluye en la version publicada.

## Estado actual

La app es estatica y funciona con tres archivos principales:

- `index.html`: estructura de pantallas.
- `styles.css`: diseno movil y componentes.
- `app.js`: estado, radar, ejercicios, perfiles y progreso.

No hay dependencias externas.

## Persistencia

Se usa `localStorage`.

Clave actual:

```text
nihongo-benkyo-state-v2
```

Estructura:

```js
{
  activeUserId: "personal",
  users: {
    personal: {
      id: "personal",
      name: "Raul",
      settings: {
        renshuuApiKey: "",
        mainGoal: "work",
        dailyMinutes: 10
      },
      progress: {
        vocab: 90,
        kanji: 12,
        grammar: 18,
        particles: 22,
        reading: 20,
        writing: 14,
        listening: 8,
        work: 5
      },
      currentExercise: 0
    }
  }
}
```

## Modelo de usuarios

Aunque ahora el producto sea personal, el codigo ya separa datos por perfil.

Esto permite migrar en el futuro a:

- Usuarios autenticados.
- Base de datos remota.
- Sincronizacion entre dispositivos.
- Suscripciones.

## Progreso

El progreso se guarda como puntos acumulados por habilidad.

Habilidades actuales:

- `vocab`
- `kanji`
- `grammar`
- `particles`
- `reading`
- `writing`
- `listening`
- `work`

El radar JLPT compara esos puntos contra objetivos aproximados por nivel. Es una visualizacion de evidencia acumulada en la app, no una medicion clinica ni una prediccion de aprobado. Los nuevos perfiles comienzan en cero; una migracion elimina los valores de demostracion de perfiles sin historial de ejercicios.

### Plan diario y repaso

El perfil conserva un plan diario con fecha, ejercicios elegidos, ejercicios completados e historial por ejercicio. Al cambiar de dia o modificar configuracion, la funcion ensureDailyPlan ordena ejercicios compatibles con el objetivo JLPT y da prioridad a habilidades bajas y ejercicios marcados para repaso.

El contenido vive en content.js, separado de la interfaz. Esto permite ampliar bancos de preguntas sin mezclar datos pedagogicos con logica de pantalla.

## Furigana

El toggle de furigana usa:

- `state.settings.showFurigana` para persistir la preferencia por usuario.
- `setJapaneseText()` para renderizar texto japones normal o con `<ruby>`.
- `furiganaEntries` como diccionario local inicial.

Limitacion:

- No analiza cualquier palabra japonesa de forma automatica todavia.
- Solo anade furigana a entradas conocidas en el diccionario local.

Futuro recomendado:

- Integrar un diccionario/morfologia japonesa.
- Obtener lecturas desde Renshuu cuando este disponible.
- Cachear lecturas por texto para uso offline.

## Entrada japonesa sin teclado japones

La app incluye una mini IME local para el campo de respuesta.

Componentes:

- `romajiDictionary`: diccionario inicial de romaji -> japones.
- `updateImeSuggestions()`: actualiza sugerencias segun el token bajo el cursor.
- `romajiToHiragana()`: conversor basico de romaji a hiragana.
- `insertImeSuggestion()`: sustituye el token latino por la sugerencia seleccionada.

Limitaciones:

- No usa prediccion estadistica todavia.
- No desambigua frases completas.
- No conjuga automaticamente.
- El diccionario de kanji es pequeno.

Futuro recomendado:

- Aprender de los terminos de Renshuu del usuario.
- Ordenar sugerencias por frecuencia y contexto.
- Permitir elegir entre kana, kanji comun y variantes.
- Anadir historial personal de elecciones.

## Renshuu

La API key se guarda actualmente en el navegador del usuario.

Durante el MVP local tambien puede precargarse desde:

```text
secrets.local.js
```

Ese archivo esta ignorado por Git y no debe subirse al repositorio.

### Sincronizacion de perfil

La app usa el endpoint read-only `GET https://api.renshuu.org/v1/profile` con el encabezado `Authorization: Bearer <api-key>` cuando el usuario pulsa Actualizar.

La respuesta se guarda por perfil en `state.renshuu`:

```js
{
  profile: {},
  syncedAt: "2026-08-03T00:00:00.000Z",
  error: ""
}
```

Se extraen `studied`, `streaks` y `level_progress_percs`. La informacion de Renshuu se presenta como fuente independiente: no se combina matematicamente con los puntos internos de Nihongo Benkyo.

Regla de seguridad:

- No escribir claves reales en el codigo fuente.
- No subir claves a GitHub.
- No exponer claves en documentacion.

Futuro recomendado:

- Mover llamadas API a backend.
- El endpoint de perfil permite crear un ejercicio puente por categoria estudiada hoy, pero no expone aun los terminos exactos de esa actividad.
- Guardar secretos cifrados o mediante proveedor seguro.
- Respetar los limites y terminos de Renshuu.

## Evaluacion inteligente

El evaluador real deberia vivir fuera del HTML final si usa una API privada.

Flujo futuro:

```text
App movil -> Backend -> Modelo IA -> Backend -> App movil
```

Respuesta esperada:

```json
{
  "objectiveScore": 0,
  "comprehensionScore": 0,
  "naturalnessScore": 0,
  "isAcceptable": true,
  "feedbackEs": "",
  "betterAnswer": "",
  "nextPracticeTags": []
}
```

## Ruta Android

La ruta prevista es:

```text
HTML/CSS/JS -> PWA -> Capacitor -> APK
```
