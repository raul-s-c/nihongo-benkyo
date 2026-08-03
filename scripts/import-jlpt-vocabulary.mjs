import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const argument = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? "" : args[index + 1];
};

const sourceDir = argument("--source-dir");
const jmdictPath = argument("--jmdict");
const outputPath = resolve(argument("--out") || "data/jlpt-vocabulary.js");

if (!sourceDir || !jmdictPath) {
  throw new Error("Uso: node scripts/import-jlpt-vocabulary.mjs --source-dir <directorio-csv> --jmdict <jmdict-spa.json> [--out data/jlpt-vocabulary.js]");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  row.push(cell);
  if (row.some(Boolean)) rows.push(row);
  const [headers, ...values] = rows;
  return values.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
}

function sourcePath(filename) {
  return resolve(sourceDir, filename);
}

function collectSpanishGlosses(word) {
  return [...new Set((word?.sense || []).flatMap((sense) =>
    (sense.gloss || []).filter((gloss) => gloss.lang === "spa").map((gloss) => gloss.text.trim())
  ).filter(Boolean))].slice(0, 3);
}

function inferThemes(term, reading, glosses) {
  const searchable = `${term} ${reading} ${glosses.join(" ")}`.toLowerCase();
  const rules = [
    ["trabajo", /trabaj|oficina|empresa|cliente|jefe|reuni[oó]n|documento|contrato|negocio|emplead|salario|proyecto|correo|電話|会社|会議|仕事|客|資料|契約/],
    ["comida", /comida|beber|bebida|restaurante|cocina|desayuno|almuerzo|cena|arroz|pan|carne|pescado|食|飲|料理|酒|飯/],
    ["compras", /comprar|tienda|precio|dinero|pagar|producto|venta|mercado|talla|barato|caro|買|店|値段|円|売/],
    ["ciudad-y-transporte", /tren|estaci[oó]n|autob[uú]s|metro|calle|ciudad|aeropuerto|camino|viaje|taxi|電車|駅|道|空港|車|旅行/],
    ["amistades-y-ocio", /amigo|familia|pel[ií]cula|m[uú]sica|deporte|juego|fiesta|ocio|hermano|padre|madre|友|家族|映画|音楽|遊|兄|姉|父|母/],
    ["hogar-y-estudio", /casa|habitaci[oó]n|escuela|estudi|libro|universidad|clase|profesor|alumno|家|部屋|学校|勉強|本|大学|先生|学生/],
    ["comunicacion", /decir|hablar|preguntar|responder|llamar|mensaje|explicar|correo|言|話|聞|答|電話|手紙/]
  ];
  const matched = rules.filter(([, pattern]) => pattern.test(searchable)).map(([theme]) => theme);
  return matched.length ? matched : ["vida-diaria"];
}

const jmdict = JSON.parse(await readFile(resolve(jmdictPath), "utf8"));
const wordsById = new Map(jmdict.words.map((word) => [String(word.id), word]));
const entries = [];
const report = [];

for (const levelNumber of [5, 4, 3, 2, 1]) {
  const level = `N${levelNumber}`;
  const rows = parseCsv(await readFile(sourcePath(`n${levelNumber}.csv`), "utf8"));
  let missingJmdict = 0;
  let missingSpanish = 0;
  for (const [rowIndex, row] of rows.entries()) {
    const word = wordsById.get(row.jmdict_seq);
    const glosses = collectSpanishGlosses(word);
    if (!word) missingJmdict += 1;
    if (!glosses.length) missingSpanish += 1;
    const term = row.kanji || row.kana;
    const termIdentifier = [...term].map((character) => character.codePointAt(0).toString(16)).join("-");
    const sourceIdentifier = row.jmdict_seq || `source-${termIdentifier}`;
    entries.push({
      id: `jlpt-vocab-${level.toLowerCase()}-${sourceIdentifier}-${termIdentifier}-${rowIndex}`,
      jlpt: level,
      jmdictId: row.jmdict_seq,
      text: term,
      reading: row.kana,
      meanings: glosses,
      fallbackMeaning: row.waller_definition,
      themes: inferThemes(term, row.kana, glosses),
      source: "jmdict-spa"
    });
  }
  report.push({ level, entries: rows.length, missingJmdict, missingSpanish });
}

entries.sort((left, right) => left.jlpt.localeCompare(right.jlpt) || left.text.localeCompare(right.text, "ja"));
const catalog = {
  meta: {
    generatedAt: new Date().toISOString().slice(0, 10),
    catalogVersion: "jmdict-spa-3.6.2+20260803141815__yomitan-jlpt-vocab-main",
    source: "JMDict Spanish via scriptin/jmdict-simplified, filtered with stephenmk/yomitan-jlpt-vocab",
    license: "CC BY-SA 4.0; see data/SOURCES.md",
    levelTags: "Pedagogical, unofficial JLPT coverage"
  },
  entries
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `window.NIHONGO_JLPT_VOCABULARY = ${JSON.stringify(catalog)};\n`, "utf8");
console.log(JSON.stringify({ outputPath, total: entries.length, report }, null, 2));
