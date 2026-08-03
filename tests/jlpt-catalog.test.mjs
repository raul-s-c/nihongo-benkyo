import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const expectedMinimums = { n5: 100, n4: 100, n3: 100, n2: 150 };

for (const [level, minimum] of Object.entries(expectedMinimums)) {
  test(`catalogo de gramatica ${level.toUpperCase()} importado y estructurado`, () => {
    const entries = JSON.parse(readFileSync(new URL(`../data/jlpt-grammar-${level}.json`, import.meta.url), "utf8").replace(/^\uFEFF/, ""));
    assert.ok(entries.length >= minimum);
    assert.ok(entries.every((entry) => entry.title && entry.formation && Array.isArray(entry.examples) && entry.examples.length));
  });
}
