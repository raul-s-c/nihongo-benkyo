import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const context = { window: {} };
vm.createContext(context);
vm.runInContext(readFileSync(new URL("../translation-battery.js", import.meta.url), "utf8"), context);
const entries = context.window.NIHONGO_TRANSLATION_BATTERY;

test("la bateria de traduccion cubre N5-N1 sin frases duplicadas", () => {
  assert.deepEqual(Object.fromEntries(["N5", "N4", "N3", "N2", "N1"].map((level) => [level, entries.filter((entry) => entry.level === level).length])), { N5: 100, N4: 200, N3: 300, N2: 400, N1: 500 });
  assert.equal(new Set(entries.map((entry) => `${entry.prompt}|${entry.accepted}`)).size, entries.length);
});

test("cada traduccion incluye metadatos para diagnostico y repaso", () => {
  assert.ok(entries.every((entry) => entry.id && entry.type && entry.prompt && entry.accepted && entry.theme && entry.diagnostic?.grammar && entry.diagnostic?.required?.length && entry.diagnostic?.remediation));
  assert.equal(entries.filter((entry) => entry.type === "Traduce ES → JP").length, 750);
  assert.equal(entries.filter((entry) => entry.type === "Traduce JP → ES").length, 750);
});
