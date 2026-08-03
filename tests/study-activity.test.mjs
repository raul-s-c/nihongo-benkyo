import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function getAttemptXp");
const end = source.indexOf("function getDateKey", start);
const { getAttemptXp } = new Function(`${source.slice(start, end)}; return { getAttemptXp };`)();

test("el XP distingue aciertos, parciales, ejercicios abiertos y repasos", () => {
  assert.equal(getAttemptXp("correct"), 20);
  assert.equal(getAttemptXp("manual"), 16);
  assert.equal(getAttemptXp("partial"), 12);
  assert.equal(getAttemptXp("review"), 8);
  assert.equal(getAttemptXp("unknown"), 0);
});
