import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const targets = { N5: 100, N4: 200, N3: 300, N2: 400, N1: 500 };
const places = [
  ["家", "en casa", "vida-diaria"], ["会社", "en la empresa", "trabajo"], ["図書館", "en la biblioteca", "hogar-y-estudio"],
  ["駅", "en la estación", "ciudad-y-transporte"], ["店", "en la tienda", "compras"], ["カフェ", "en la cafetería", "comida"],
  ["会議室", "en la sala de reuniones", "trabajo"], ["公園", "en el parque", "amistades-y-ocio"]
];
const times = [["今日", "hoy"], ["明日", "mañana"], ["今週", "esta semana"], ["来週", "la semana que viene"], ["週末", "este fin de semana"], ["月曜日", "el lunes"], ["金曜日", "el viernes"], ["来月", "el mes que viene"]];
const tasks = [
  ["日本語を勉強する", "estudiar japonés", "日本語|勉強"], ["資料を確認する", "revisar los documentos", "資料|確認"], ["メールを書く", "escribir un correo", "メール|書"],
  ["会議の準備をする", "preparar la reunión", "会議|準備"], ["友達に会う", "quedar con un amigo", "友達|会"], ["買い物をする", "hacer la compra", "買い物"],
  ["電車を調べる", "consultar los trenes", "電車|調"], ["報告書を作る", "preparar el informe", "報告書|作"], ["予約を確認する", "confirmar la reserva", "予約|確認"],
  ["お客様に連絡する", "contactar con el cliente", "お客様|連絡"], ["問題を説明する", "explicar el problema", "問題|説明"], ["予定を変更する", "cambiar el plan", "予定|変更"],
  ["新しい言葉を覚える", "aprender palabras nuevas", "新しい|言葉|覚"], ["料理を作る", "cocinar", "料理|作"], ["宿題を終える", "terminar los deberes", "宿題|終"],
  ["同僚と相談する", "consultar con un compañero", "同僚|相談"], ["地図を見る", "mirar el mapa", "地図|見"], ["請求書を送る", "enviar la factura", "請求書|送"],
  ["結果を共有する", "compartir el resultado", "結果|共有"], ["手順を改善する", "mejorar el procedimiento", "手順|改善"]
];

function masu(plain) {
  const replacements = [["する", "します"], ["く", "きます"], ["う", "います"], ["る", "ます"]];
  for (const [end, value] of replacements) if (plain.endsWith(end)) return `${plain.slice(0, -end.length)}${value}`;
  return plain;
}

function buildSentence(level, time, place, task) {
  const [jpTime, esTime] = time;
  const [jpPlace, esPlace, theme] = place;
  const [plain, infinitive, required] = task;
  const polite = masu(plain);
  const variants = {
    N5: [`私は${jpTime}、${jpPlace}で${polite}。`, `Yo ${esTime} ${infinitive} ${esPlace}.`, "Lugar de accion con で"],
    N4: [`私は${jpTime}、${jpPlace}で${plain}予定です。`, `Tengo previsto ${infinitive} ${esPlace} ${esTime}.`, "Plan con 予定です"],
    N3: [`私は${jpTime}までに${jpPlace}で${plain}ように準備しています。`, `Me estoy preparando para ${infinitive} ${esPlace} antes de ${esTime}.`, "Preparacion con ように"],
    N2: [`${jpTime}までに${jpPlace}で${plain}ことになっています。`, `Esta previsto ${infinitive} ${esPlace} antes de ${esTime}.`, "Decision acordada con ことになっています"],
    N1: [`${plain}にあたり、${jpTime}までに${jpPlace}で必要な準備を整えます。`, `Al ${infinitive}, prepararé lo necesario ${esPlace} antes de ${esTime}.`, "Registro formal con にあたり"]
  };
  const [jp, es, grammar] = variants[level];
  return { jp, es, theme, grammar, required: required.split("|") };
}

const entries = [];
for (const [level, count] of Object.entries(targets)) {
  for (let index = 0; index < count; index += 1) {
    const sentence = buildSentence(level, times[Math.floor(index / (tasks.length * places.length)) % times.length], places[Math.floor(index / tasks.length) % places.length], tasks[index % tasks.length]);
    const direction = index % 2 === 0 ? "ES_JP" : "JP_ES";
    entries.push({
      id: `translation-${level.toLowerCase()}-${String(index + 1).padStart(3, "0")}`,
      level,
      type: direction === "ES_JP" ? "Traduce ES → JP" : "Traduce JP → ES",
      prompt: direction === "ES_JP" ? sentence.es : sentence.jp,
      accepted: direction === "ES_JP" ? sentence.jp : sentence.es,
      target: direction === "ES_JP" ? sentence.required.join("|") : "",
      keywords: direction === "JP_ES" ? sentence.es.toLowerCase().replace(/[.,]/g, "").split(" ").filter((word) => word.length > 4).slice(0, 3) : [],
      tags: ["vocab", "grammar", "writing", "reading"],
      theme: sentence.theme,
      core: false,
      help: [],
      explanation: sentence.grammar,
      diagnostic: { direction, grammar: sentence.grammar, required: sentence.required, theme: sentence.theme, remediation: `Repasa: ${sentence.required.join(" / ")}` }
    });
  }
}

if (new Set(entries.map((entry) => entry.id)).size !== entries.length || new Set(entries.map((entry) => `${entry.prompt}|${entry.accepted}`)).size !== entries.length) throw new Error("La bateria contiene frases duplicadas.");
await writeFile(resolve("translation-battery.js"), `window.NIHONGO_TRANSLATION_BATTERY = ${JSON.stringify(entries)};\n`);
console.log(JSON.stringify({ total: entries.length, byLevel: targets }));
