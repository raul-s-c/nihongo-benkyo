import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function evaluateAnswer");
const end = source.indexOf("function applyProgress");
const evaluator = new Function(`${source.slice(start, end)}; return { evaluateAnswer };`)();
const contentContext = { window: {} };
vm.createContext(contentContext);
vm.runInContext(readFileSync(new URL("../content.js", import.meta.url), "utf8"), contentContext);
const { exercises } = contentContext.window.NIHONGO_CONTENT;

test("acepta una conjugacion japonesa del termino requerido", () => {
  const result = evaluator.evaluateAnswer("僕の友達に会いました。", {
    target: "会う",
    keywords: ["会う", "あう"],
    accepted: "Una frase personal que use 会う。"
  });

  assert.equal(result.objective, 100);
  assert.equal(result.comprehension, 90);
  assert.match(result.feedback, /forma conjugada/);
});

test("no confirma una respuesta japonesa que no contiene el termino requerido", () => {
  const result = evaluator.evaluateAnswer("僕は日本語を勉強します。", {
    target: "会う",
    keywords: ["会う", "あう"],
    accepted: "Una frase personal que use 会う。"
  });

  assert.equal(result.objective, null);
  assert.equal(result.comprehension, null);
});

test("las respuestas modelo del catalogo pasan su propia comprobacion", () => {
  const failures = exercises
    .filter((exercise) => exercise.target || exercise.keywords.length)
    .map((exercise) => ({ id: exercise.id, result: evaluator.evaluateAnswer(exercise.accepted, exercise) }))
    .filter(({ result }) => result.objective !== 100)
    .map(({ id, result }) => `${id}: ${result.objective}`);

  assert.equal(failures.length, 0, failures.join(", "));
});

test("todo ejercicio de produccion gramatical exige al menos una estructura comprobable", () => {
  const missingRequirements = exercises
    .filter((exercise) => exercise.tags.includes("grammar") && exercise.tags.includes("writing"))
    .filter((exercise) => !exercise.target && !exercise.keywords.length)
    .map((exercise) => exercise.id);

  assert.equal(missingRequirements.length, 0, missingRequirements.join(", "));
});

test("marca una frase japonesa sin final verbal como gramatica basica pendiente", () => {
  const result = evaluator.evaluateAnswer("会い", {
    type: "Descripción",
    target: "会う",
    keywords: ["会う"],
    tags: ["writing", "grammar"],
    accepted: "友達に会いました。"
  });

  assert.equal(result.objective, 100);
  assert.equal(result.comprehension, 55);
  assert.match(result.feedback, /frase japonesa suficiente/);
});

test("explica una particula de lugar incorrecta sin negar la comprension", () => {
  const result = evaluator.evaluateAnswer("今日は家に日本語を勉強します。", {
    type: "Traduce ES → JP",
    target: "今日|家で|日本語|勉強します",
    keywords: [],
    tags: ["writing", "grammar", "particles"],
    accepted: "今日は家で日本語を勉強します。"
  });

  assert.equal(result.objective, 75);
  assert.equal(result.comprehension, 80);
  assert.match(result.correction, /家.*で.*に/);
});

test("el furigana no vuelve a envolver texto ya procesado", () => {
  const start = source.indexOf("function addFurigana");
  const end = source.indexOf("function escapeRegExp");
  const renderer = new Function(`${source.slice(start, end)}; return { addFurigana };`)();
  const output = renderer.addFurigana("日本語を勉強します。", [["日本語", "にほんご"], ["日本", "にほん"], ["勉強", "べんきょう"]]);

  assert.equal((output.match(/<ruby>/g) || []).length, 2);
  assert.equal(output.slice(1, output.indexOf("</ruby>")).includes("<ruby>"), false);
});
