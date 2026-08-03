import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

function loadWindowCatalog(filename, name) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(new URL(`../data/${filename}`, import.meta.url), "utf8"), context);
  return context.window[name];
}

const vocabulary = loadWindowCatalog("jlpt-vocabulary.js", "NIHONGO_JLPT_VOCABULARY");
const kanji = loadWindowCatalog("jlpt-kanji.js", "NIHONGO_JLPT_KANJI");
const levels = ["N5", "N4", "N3", "N2", "N1"];

test("el catalogo de vocabulario cubre N5-N1 con identificadores y metadatos", () => {
  assert.equal(vocabulary.entries.length, 8293);
  assert.ok(vocabulary.meta.license.includes("CC BY-SA"));
  assert.equal(new Set(vocabulary.entries.map((entry) => entry.id)).size, vocabulary.entries.length);
  for (const level of levels) {
    const entries = vocabulary.entries.filter((entry) => entry.jlpt === level);
    assert.ok(entries.length > 100, `faltan entradas de vocabulario ${level}`);
    assert.ok(entries.every((entry) => entry.text && entry.reading && (entry.jmdictId || entry.fallbackMeaning) && entry.themes.length), `metadatos incompletos en ${level}`);
  }
});

test("el catalogo de kanji cubre N5-N1 con lecturas y datos de consulta", () => {
  assert.equal(kanji.entries.length, 2222);
  assert.ok(kanji.meta.license.includes("MIT"));
  assert.equal(new Set(kanji.entries.map((entry) => entry.literal)).size, kanji.entries.length);
  for (const level of levels) {
    const entries = kanji.entries.filter((entry) => entry.jlpt === level);
    assert.ok(entries.length > 80, `faltan kanji ${level}`);
    assert.ok(entries.every((entry) => entry.literal && entry.strokes && entry.radical && (entry.onReadings.length || entry.kunReadings.length)), `metadatos incompletos en ${level}`);
  }
});
