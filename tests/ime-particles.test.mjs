import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const functionSource = (name) => {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf("\nfunction ", start + 1);
  const finalEnd = end === -1 ? source.indexOf("\nbindEvents();", start) : end;
  return source.slice(start, finalEnd === -1 ? source.length : finalEnd);
};
const particlesStart = source.indexOf("const particleImeDictionary");
const particlesEnd = source.indexOf("const kanaRomanization", particlesStart);
const ime = new Function(`
  const romajiDictionary = [];
  const imeVocabularyDictionary = [];
  ${source.slice(particlesStart, particlesEnd)}
  ${functionSource("findImeSuggestions")}
  ${functionSource("getImeContextPriority")}
  ${functionSource("romajiToHiragana")}
  ${functionSource("uniqueImeSuggestions")}
  return { findImeSuggestions };
`)();

test("el IME prioriza las particulas exactas sobre palabras largas", () => {
  const direction = ime.findImeSuggestions("he", null);
  const topic = ime.findImeSuggestions("wa", null);
  const object = ime.findImeSuggestions("o", null);

  assert.equal(direction[0].text, "へ");
  assert.match(direction[0].gloss, /direccion/);
  assert.equal(topic[0].text, "は");
  assert.equal(object[0].text, "を");
});
