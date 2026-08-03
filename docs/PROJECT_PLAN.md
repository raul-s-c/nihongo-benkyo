# Plan del proyecto

## Vision

Nihongo Benkyo sera una app movil de apoyo al aprendizaje de japones, pensada para sesiones cortas y frecuentes. El foco no es sustituir Renshuu, sino complementar su progreso con practica libre, produccion escrita, correcciones inteligentes y objetivos personales.

## Objetivo personal inicial

El usuario principal quiere aprender japones sin prisa, con la meta de poder trabajar en Japon en unos anos.

Esto implica que la app debe equilibrar:

- JLPT como estructura medible.
- Japones diario como supervivencia real.
- Japones de empresa como objetivo profesional.
- Habito movil como forma principal de uso.

## Fases

### Fase 1: Prototipo local

Objetivo: tener una app HTML util en telefono.

Incluye:

- Pantalla diaria.
- Menu inferior movil.
- Ejercicios basicos.
- Matriz de progreso.
- Radar JLPT.
- Ajustes locales.
- Perfiles locales.

Estado: en progreso.

### Fase 2: Correccion inteligente

Objetivo: corregir respuestas libres sin exigir literalidad.

La evaluacion debe separar:

- Correccion objetiva.
- Comprension comunicativa.
- Naturalidad.
- Registro formal/casual.
- Errores principales.
- Recomendacion siguiente.

Estado: pendiente.

### Fase 3: Integracion con Renshuu

Objetivo: usar el avance de Renshuu para recomendar ejercicios diarios.

Uso previsto:

- Leer listas o terminos disponibles.
- Detectar vocabulario reciente o debil.
- Generar practica complementaria.
- Evitar copiar la funcionalidad de quiz de Renshuu.

Estado: pendiente.

### Fase 4: Persistencia robusta

Objetivo: pasar de `localStorage` a una base mas solida.

Opciones:

- IndexedDB para uso local/offline.
- Backend con cuentas si se comercializa.
- Sincronizacion entre dispositivos.

Estado: pendiente.

### Fase 5: Android

Objetivo: empaquetar como APK.

Ruta prevista:

- Convertir la app en PWA.
- Empaquetar con Capacitor.
- Probar en Android.
- Anadir notificaciones.
- Preparar firma y distribucion.

Estado: pendiente.

### Fase 6: Producto comercial opcional

Objetivo: permitir usuarios reales sin rehacer el nucleo.

Necesidades futuras:

- Autenticacion.
- Cuentas de usuario.
- Backend.
- Gestion segura de claves API.
- Plan gratuito/pago.
- Politica de privacidad.
- Terminos de uso.
- Analitica respetuosa.

Estado: considerado desde el diseno, no implementado.

## Principios de producto

- Movil primero.
- Practica corta antes que sesiones largas.
- Feedback util antes que castigo.
- Respuestas flexibles antes que solucion unica.
- Progreso accionable antes que estadisticas decorativas.
- Privacidad desde el principio.
