import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const completenessPath = new URL("../data/content-completeness.json", import.meta.url);
const completeness = JSON.parse(await readFile(completenessPath, "utf8"));
const grammarLevels = ["N5", "N4", "N3", "N2", "N1"];

for (const level of grammarLevels) {
  try {
    const entries = JSON.parse(await readFile(new URL(`../data/jlpt-grammar-${level.toLowerCase()}.json`, import.meta.url), "utf8").then((text) => text.replace(/^\uFEFF/, "")));
    completeness.actual[level].grammar = entries.length;
  } catch {
    completeness.actual[level].grammar = 0;
  }
}

const batteryContext = { window: {} };
vm.createContext(batteryContext);
vm.runInContext(await readFile(new URL("../translation-battery.js", import.meta.url), "utf8"), batteryContext);
for (const level of grammarLevels) completeness.actual[level].translations = batteryContext.window.NIHONGO_TRANSLATION_BATTERY.filter((entry) => entry.level === level).length;

completeness.updatedAt = new Date().toISOString().slice(0, 10);
await writeFile(completenessPath, `${JSON.stringify(completeness, null, 2)}\n`);
console.log(JSON.stringify(completeness.actual));
