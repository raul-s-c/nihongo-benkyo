import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("function evaluateAnswer");
const end = source.indexOf("function applyProgress");
const evaluator = new Function(`${source.slice(start, end)}; return { evaluateAnswer };`)();

test("acepta una conjugacion japonesa del termino requerido", () => {
  const result = evaluator.evaluateAnswer("僕の友達に会いました。", {
    target: "会う",
    keywords: ["会う", "あう"],
    accepted: "Una frase personal que use 会う。"
  });

  assert.equal(result.objective, 100);
  assert.equal(result.comprehension, 85);
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
