import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../content.js", import.meta.url), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);
const { exercises, dictionary } = context.window.NIHONGO_CONTENT;

test("el catalogo no contiene ids ni firmas duplicadas", () => {
  const ids = exercises.map((exercise) => exercise.id);
  const signatures = exercises.map((exercise) => `${exercise.level}|${exercise.type}|${exercise.prompt}`);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(signatures).size, signatures.length);
  assert.equal(new Set(dictionary.map((item) => item.text)).size, dictionary.length);
});

test("la ruta troncal y el contenido suplementario cubren N5 a N1", () => {
  const levels = ["N5", "N4", "N3", "N2", "N1"];
  assert.ok(exercises.some((exercise) => exercise.core));
  for (const level of levels) {
    assert.ok(exercises.some((exercise) => exercise.core && exercise.level === level), `falta ruta troncal ${level}`);
    assert.ok(exercises.some((exercise) => !exercise.core && exercise.level === level && exercise.tags.includes("kanji")), `falta kanji ${level}`);
    assert.ok(exercises.some((exercise) => !exercise.core && exercise.level === level && exercise.tags.includes("listening") && exercise.audioText), `falta escucha ${level}`);
  }
});
