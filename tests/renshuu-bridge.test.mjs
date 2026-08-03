import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function getRenshuuBridgeTerm");
const end = source.indexOf("function renderRenshuuBridge");
const contentContext = { window: {} };
vm.createContext(contentContext);
vm.runInContext(readFileSync(new URL("../content.js", import.meta.url), "utf8"), contentContext);
const exercises = contentContext.window.NIHONGO_CONTENT.exercises;
const levelRank = (level) => ["N5", "N4", "N3", "N2", "N1"].indexOf(level);
const todayKey = () => "2026-08-03";

function getTerm(state, category, rotation) {
  const selector = new Function("state", "exercises", "levelRank", "todayKey", `${source.slice(start, end)}; return getRenshuuBridgeTerm;`)(state, exercises, levelRank, todayKey);
  return selector(category, 4, rotation);
}

test("el puente Renshuu rota los terminos ya propuestos el mismo dia", () => {
  const state = { settings: { targetJlpt: "N4" }, renshuuBridgeHistory: [] };
  const first = getTerm(state, "grammar", 0);
  state.renshuuBridgeHistory.push({ date: todayKey(), category: "grammar", term: first.text });
  const second = getTerm(state, "grammar", 1);

  assert.notEqual(second.text, first.text);
});

test("el puente vuelve a usar el catalogo cuando ya se ofrecieron todas las alternativas", () => {
  const state = {
    settings: { targetJlpt: "N4" },
    renshuuBridgeHistory: [
      { date: todayKey(), category: "grammar", term: "から" },
      { date: todayKey(), category: "grammar", term: "なら" }
    ]
  };

  const term = getTerm(state, "grammar", 2);
  assert.ok(["から", "なら"].includes(term.text));
});
