# Fuentes de contenido

## Gramática JLPT N5-N2

- Origen: [hanabira.org-japanese-content](https://github.com/tristcoil/hanabira.org-japanese-content).
- Archivos de origen: `grammar_ja_N5_full_alphabetical_0001.json` hasta `grammar_ja_N2_full_alphabetical_0001.json`.
- Licencia declarada por el proyecto: Creative Commons con atribución a [hanabira.org](https://hanabira.org/).
- Importado: 2026-08-03.

Los niveles de vocabulario, kanji y gramática del JLPT posterior a 2010 no constituyen una lista oficial cerrada. Esta aplicación los trata como una cobertura pedagógica versionada, mostrando fuente, fecha e identificador de cada catálogo.

## Vocabulario JLPT N5-N1

- Glosas, lecturas e identificadores: [JMDict Spanish JSON de scriptin/jmdict-simplified](https://github.com/scriptin/jmdict-simplified), version `3.6.2+20260803141815`.
- Etiquetas de nivel: [stephenmk/yomitan-jlpt-vocab](https://github.com/stephenmk/yomitan-jlpt-vocab), revision `main` consultada el 2026-08-03. Su documentacion atribuye las listas base a Jonathan Waller/Tanos.
- Importador reproducible: `scripts/import-jlpt-vocabulary.mjs`. Catalogo generado: `data/jlpt-vocabulary.js`.
- Licencia: CC BY-SA 4.0. La app conserva atribucion y enlaces; cualquier redistribucion del catalogo derivado debe mantener una licencia compatible y la atribucion.
- Los niveles son cobertura pedagogica no oficial: el JLPT actual no publica una lista cerrada de vocabulario. Una palabra puede cambiar de dificultad segun el examen y el contexto.
- Clasificacion tematica: etiquetas heuristicas a partir del termino y las glosas espanolas. Son un filtro de estudio, no una afirmacion linguistica autoritativa.

## Kanji JLPT N5-N1

- Lecturas, glosas espanolas, trazos, radicales y frecuencia: [KANJIDIC2 JSON de scriptin/jmdict-simplified](https://github.com/scriptin/jmdict-simplified), version `3.6.2+20260803141815`, CC BY-SA 4.0.
- Etiquetas de nivel: [anzumura/kanji-tools](https://github.com/anzumura/kanji-tools), listas `data/jlpt/n5.txt` a `n1.txt`, licencia MIT.
- Importador reproducible: `scripts/import-jlpt-kanji.mjs`. Catalogo generado: `data/jlpt-kanji.js`.
- Igual que en vocabulario, la etiqueta JLPT es una guia de secuenciacion, no una lista oficial publicada por el examen actual.
