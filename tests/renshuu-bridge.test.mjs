import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function getRenshuuBridgeTerm");
const end = source.indexOf("function renderRenshuuBridge");
const currentExerciseStart = source.indexOf("function getCurrentExercise");
const currentExerciseEnd = source.indexOf("function todayKey");
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

test("la ruta posterior a Renshuu resume las areas y genera varias practicas vinculadas", () => {
  const routeStart = source.indexOf("function getRenshuuTodayActivity");
  const routeEnd = source.indexOf("function renderRenshuuBridge", routeStart);
  const state = {
    settings: { targetJlpt: "N4" },
    renshuu: { profile: { studied: { today_vocab: 73, today_kanji: 2, today_grammar: 1, today_sent: 0 } } },
    renshuuBridgeHistory: []
  };
  const createRoute = new Function("state", "todayKey", "getRenshuuBridge", "getRenshuuBridgeTerm", `${source.slice(routeStart, routeEnd)}; return createRenshuuBridgePlan;`)(
    state,
    todayKey,
    () => null,
    (category) => ({ text: category === "kanji" ? "人" : "会う", reading: category === "kanji" ? "ひと" : "あう", meaning: "prueba", level: "N5", theme: "vida-diaria" })
  );
  const route = createRoute();

  assert.deepEqual(route.activity.map((item) => [item.category, item.count]), [["vocab", 73], ["kanji", 2], ["grammar", 1]]);
  assert.equal(route.items.length, 5);
  assert.equal(new Set(route.items.map((item) => item.id)).size, route.items.length);
});

test("un puente Renshuu completado no vuelve a ocupar la pantalla de practica", () => {
  const state = {
    manualExerciseId: "",
    currentExerciseId: "renshuu-bridge",
    renshuuBridge: { id: "renshuu-bridge", type: "Puente con Renshuu" },
    dailyPlan: { exerciseIds: ["renshuu-bridge", "next"], completedIds: ["renshuu-bridge"], skippedIds: [] }
  };
  const getCurrentExercise = new Function("state", "exercises", `function getActiveRenshuuBridgePlan() { return null; } ${source.slice(currentExerciseStart, currentExerciseEnd)}; return getCurrentExercise;`)(state, [{ id: "next", type: "Siguiente ejercicio" }]);

  assert.equal(getCurrentExercise().id, "next");
});

test("una ruta Renshuu completada no salta a la sesion diaria", () => {
  const state = {
    manualExerciseId: "",
    activePracticeMode: "renshuu",
    currentExerciseId: "",
    renshuuBridgePlan: { sourceDate: todayKey(), items: [{ id: "renshuu-route-1" }], completedIds: ["renshuu-route-1"] },
    dailyPlan: { exerciseIds: ["next"], completedIds: [], skippedIds: [] }
  };
  const getCurrentExercise = new Function("state", "exercises", "todayKey", `function getActiveRenshuuBridgePlan() { return state.renshuuBridgePlan; } ${source.slice(currentExerciseStart, currentExerciseEnd)}; return getCurrentExercise;`)(state, [{ id: "next", type: "Siguiente ejercicio" }], todayKey);

  assert.equal(getCurrentExercise(), null);
});
