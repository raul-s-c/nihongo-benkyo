# Completitud de Contenido

Este es el registro de trabajo para el estudio personal. Cuenta elementos estructurados disponibles en el repositorio, no puntuaciones del usuario ni estimaciones de dominio. Se actualiza al ejecutar `scripts/report-content-completeness.mjs` despues de cada importacion.

| Nivel | Vocabulario | Kanji | Gramatica | Frases de traduccion |
| --- | --- | --- | --- | --- |
| N5 | 684 / 800 (86%) | 103 / 100 (100% del objetivo) | 136 / 100 (100% del objetivo) | 100 / 100 (100%) |
| N4 | 1.324 / 1.500 (88%) | 284 / 300 (95%) | 124 / 150 (83%) | 200 / 200 (100%) |
| N3 | 3.054 / 3.750 (81%) | 645 / 650 (99%) | 132 / 220 (60%) | 300 / 300 (100%) |
| N2 | 4.866 / 6.000 (81%) | 1.060 / 1.000 (100% del objetivo) | 191 / 250 (76%) | 400 / 400 (100%) |
| N1 | 8.289 / 11.000 (75%) | 2.222 / 2.100 (100% del objetivo) | 0 / 300 (0%) | 500 / 500 (100%) |

## Estado por familia

- Vocabulario: catalogo importado de 8.293 entradas etiquetadas (8.289 terminos distintos acumulados) con lecturas y hasta tres glosas espanolas de JMDict. N5-N2 ya se puede estudiar y buscar; falta curacion editorial de acepciones, ejemplos y etiquetas tematicas para los casos complejos.
- Kanji: catalogo completo de 2.222 kanji N5-N1, con lecturas on/kun, glosas en espanol, trazos, radical y frecuencia. Las etiquetas tematicas se heredan del vocabulario que contiene el kanji; falta crear tarjetas y ejercicios de escritura dedicados para todo el catalogo.
- Gramatica: N5-N2 importada desde Hanabira con procedencia en [SOURCES.md](../data/SOURCES.md). N1 pendiente.
- Frases: bateria completa de 1.500 frases, repartida entre traduccion espanol-japones y japones-espanol; sirve para diagnostico y repaso por ejercicio.

Los conteos de vocabulario y kanji son acumulados: N4 incluye N5, N3 incluye N4 y N5, etc. Los porcentajes se limitan al 100% aunque una fuente tenga mas entradas que el objetivo orientativo. El JLPT no publica una lista oficial cerrada; estos objetivos son metas de cobertura pedagogica.
