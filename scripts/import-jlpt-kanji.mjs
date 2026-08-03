import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const argument = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? "" : args[index + 1];
};

const sourceDir = argument("--source-dir");
const kanjidicPath = argument("--kanjidic");
const vocabularyPath = argument("--vocabulary");
const outputPath = resolve(argument("--out") || "data/jlpt-kanji.js");

if (!sourceDir || !kanjidicPath || !vocabularyPath) {
  throw new Error("Uso: node scripts/import-jlpt-kanji.mjs --source-dir <listas-jlpt> --kanjidic <kanjidic2.json> --vocabulary <jlpt-vocabulary.js> [--out data/jlpt-kanji.js]");
}

const parseCatalog = (text, name) => JSON.parse(text.replace(new RegExp(`^window\\.${name}\\s*=\\s*`), "").replace(/;\s*$/, ""));
const unique = (values) => [...new Set(values.filter(Boolean))];

const vocabulary = parseCatalog(await readFile(resolve(vocabularyPath), "utf8"), "NIHONGO_JLPT_VOCABULARY");
const themesByKanji = new Map();
for (const entry of vocabulary.entries) {
  for (const character of entry.text) {
    if (!/\p{Script=Han}/u.test(character)) continue;
    const themes = themesByKanji.get(character) || new Set();
    (entry.themes || []).forEach((theme) => themes.add(theme));
    themesByKanji.set(character, themes);
  }
}

const kanjidic = JSON.parse(await readFile(resolve(kanjidicPath), "utf8"));
const charactersByLiteral = new Map(kanjidic.characters.map((character) => [character.literal, character]));
const entries = [];
const report = [];

for (const levelNumber of [5, 4, 3, 2, 1]) {
  const level = `N${levelNumber}`;
  const literals = unique((await readFile(resolve(sourceDir, `n${levelNumber}.txt`), "utf8")).match(/\p{Script=Han}/gu) || []);
  let missingKanjidic = 0;
  for (const literal of literals) {
    const character = charactersByLiteral.get(literal);
    if (!character) missingKanjidic += 1;
    const group = character?.readingMeaning?.groups?.[0] || {};
    const readings = group.readings || [];
    entries.push({
      id: `jlpt-kanji-${level.toLowerCase()}-${literal.codePointAt(0).toString(16)}`,
      jlpt: level,
      literal,
      onReadings: unique(readings.filter((reading) => reading.type === "ja_on").map((reading) => reading.value)),
      kunReadings: unique(readings.filter((reading) => reading.type === "ja_kun").map((reading) => reading.value)),
      meanings: unique((group.meanings || []).filter((meaning) => meaning.lang === "es").map((meaning) => meaning.value)).slice(0, 5),
      strokes: character?.misc?.strokeCounts?.[0] || null,
      radical: character?.radicals?.find((radical) => radical.type === "classical")?.value || null,
      grade: character?.misc?.grade || null,
      frequency: character?.misc?.frequency || null,
      themes: [...(themesByKanji.get(literal) || new Set(["vida-diaria"]))].slice(0, 4),
      source: "kanjidic2-all"
    });
  }
  report.push({ level, entries: literals.length, missingKanjidic });
}

const catalog = {
  meta: {
    generatedAt: new Date().toISOString().slice(0, 10),
    catalogVersion: "kanjidic2-all-3.6.2+20260803141815__kanji-tools-master",
    source: "KANJIDIC2 Spanish via scriptin/jmdict-simplified, JLPT tag lists via anzumura/kanji-tools",
    license: "KANJIDIC2 CC BY-SA 4.0; tag lists MIT; see data/SOURCES.md",
    levelTags: "Pedagogical, unofficial JLPT coverage"
  },
  entries
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `window.NIHONGO_JLPT_KANJI = ${JSON.stringify(catalog)};\n`, "utf8");
console.log(JSON.stringify({ outputPath, total: entries.length, report }, null, 2));
