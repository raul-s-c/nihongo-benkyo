const STORAGE_KEY = "nihongo-benkyo-state-v2";
const LEGACY_STORAGE_KEY = "nihongo-benkyo-state";

const skills = [
  { id: "vocab", label: "Vocabulario" },
  { id: "kanji", label: "Kanji" },
  { id: "grammar", label: "Gramatica" },
  { id: "particles", label: "Particulas" },
  { id: "reading", label: "Lectura" },
  { id: "writing", label: "Produccion" },
  { id: "listening", label: "Escucha" },
  { id: "work", label: "Empresa" }
];

const jlptTargets = {
  N5: { vocab: 800, kanji: 100, grammar: 80, particles: 70, reading: 65, writing: 45, listening: 45, work: 10 },
  N4: { vocab: 1500, kanji: 300, grammar: 180, particles: 150, reading: 130, writing: 90, listening: 90, work: 25 },
  N3: { vocab: 3750, kanji: 650, grammar: 360, particles: 260, reading: 260, writing: 180, listening: 180, work: 70 },
  N2: { vocab: 6000, kanji: 1000, grammar: 560, particles: 400, reading: 430, writing: 300, listening: 320, work: 160 },
  N1: { vocab: 10000, kanji: 2000, grammar: 760, particles: 520, reading: 650, writing: 500, listening: 520, work: 300 }
};

const exercises = [
  {
    type: "Traduccion JP → ES",
    prompt: "今日は会社で会議があります。",
    accepted: "Hoy hay una reunion en la empresa.",
    tags: ["vocab", "reading", "work"]
  },
  {
    type: "Traduccion ES → JP",
    prompt: "Mañana llamare al cliente.",
    accepted: "明日、お客さんに電話します。",
    tags: ["writing", "grammar", "work", "particles"]
  },
  {
    type: "Particula",
    prompt: "Escribe una frase sencilla usando で para indicar lugar de accion.",
    accepted: "図書館で勉強します。",
    tags: ["particles", "writing", "grammar"]
  },
  {
    type: "Categoria",
    prompt: "Di cinco palabras japonesas utiles en una oficina.",
    accepted: "会社、会議、資料、電話、メール",
    tags: ["vocab", "work"]
  },
  {
    type: "Pregunta",
    prompt: "日本語を勉強する理由は何ですか。",
    accepted: "日本で働きたいからです。",
    tags: ["writing", "grammar", "work"]
  }
];

const defaultUserState = {
  settings: {
    renshuuApiKey: window.NIHONGO_LOCAL_CONFIG?.renshuuApiKey || "",
    mainGoal: "work",
    dailyMinutes: 10,
    showFurigana: false
  },
  progress: {
    vocab: 90,
    kanji: 12,
    grammar: 18,
    particles: 22,
    reading: 20,
    writing: 14,
    listening: 8,
    work: 5
  },
  currentExercise: 0
};

let appState = loadAppState();
let state = getActiveUserState();

const furiganaEntries = [
  ["日本語", "にほんご"],
  ["今日", "きょう"],
  ["会社", "かいしゃ"],
  ["会議", "かいぎ"],
  ["明日", "あした"],
  ["電話", "でんわ"],
  ["客", "きゃく"],
  ["図書館", "としょかん"],
  ["勉強", "べんきょう"],
  ["働", "はたら"],
  ["理由", "りゆう"],
  ["何", "なん"],
  ["資料", "しりょう"]
].sort((a, b) => b[0].length - a[0].length);

const romajiDictionary = [
  { romaji: "nihongo", text: "日本語", reading: "にほんご", gloss: "japones" },
  { romaji: "nihon", text: "日本", reading: "にほん", gloss: "Japon" },
  { romaji: "kyo", text: "今日", reading: "きょう", gloss: "hoy" },
  { romaji: "kyou", text: "今日", reading: "きょう", gloss: "hoy" },
  { romaji: "ashita", text: "明日", reading: "あした", gloss: "manana" },
  { romaji: "kaisha", text: "会社", reading: "かいしゃ", gloss: "empresa" },
  { romaji: "kaigi", text: "会議", reading: "かいぎ", gloss: "reunion" },
  { romaji: "denwa", text: "電話", reading: "でんわ", gloss: "telefono" },
  { romaji: "meeru", text: "メール", reading: "メール", gloss: "email" },
  { romaji: "shiryo", text: "資料", reading: "しりょう", gloss: "documentos" },
  { romaji: "shiryou", text: "資料", reading: "しりょう", gloss: "documentos" },
  { romaji: "okyakusan", text: "お客さん", reading: "おきゃくさん", gloss: "cliente" },
  { romaji: "toshokan", text: "図書館", reading: "としょかん", gloss: "biblioteca" },
  { romaji: "benkyo", text: "勉強", reading: "べんきょう", gloss: "estudio" },
  { romaji: "benkyou", text: "勉強", reading: "べんきょう", gloss: "estudio" },
  { romaji: "hataraki", text: "働き", reading: "はたらき", gloss: "trabajo" },
  { romaji: "hataraku", text: "働く", reading: "はたらく", gloss: "trabajar" },
  { romaji: "riyuu", text: "理由", reading: "りゆう", gloss: "razon" },
  { romaji: "nani", text: "何", reading: "なに", gloss: "que" },
  { romaji: "nan", text: "何", reading: "なん", gloss: "que" },
  { romaji: "watashi", text: "私", reading: "わたし", gloss: "yo" },
  { romaji: "anata", text: "あなた", reading: "あなた", gloss: "tu" },
  { romaji: "gakusei", text: "学生", reading: "がくせい", gloss: "estudiante" },
  { romaji: "sensei", text: "先生", reading: "せんせい", gloss: "profesor" },
  { romaji: "taberu", text: "食べる", reading: "たべる", gloss: "comer" },
  { romaji: "nomu", text: "飲む", reading: "のむ", gloss: "beber" },
  { romaji: "iku", text: "行く", reading: "いく", gloss: "ir" },
  { romaji: "kuru", text: "来る", reading: "くる", gloss: "venir" },
  { romaji: "suru", text: "する", reading: "する", gloss: "hacer" },
  { romaji: "desu", text: "です", reading: "です", gloss: "ser/estar" },
  { romaji: "masu", text: "ます", reading: "ます", gloss: "formal" },
  { romaji: "arigatou", text: "ありがとう", reading: "ありがとう", gloss: "gracias" },
  { romaji: "ohayou", text: "おはよう", reading: "おはよう", gloss: "buenos dias" },
  { romaji: "konnichiwa", text: "こんにちは", reading: "こんにちは", gloss: "hola" },
  { romaji: "sumimasen", text: "すみません", reading: "すみません", gloss: "perdon" }
];

function loadAppState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (stored?.users && stored?.activeUserId) {
      return stored;
    }

    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
    if (legacy) {
      return {
        activeUserId: "personal",
        users: {
          personal: {
            id: "personal",
            name: "Raul",
            ...mergeUserState(legacy)
          }
        }
      };
    }
  } catch {
    // Fall through to a clean first-run state.
  }

  return {
    activeUserId: "personal",
    users: {
      personal: {
        id: "personal",
        name: "Raul",
        ...structuredClone(defaultUserState)
      }
    }
  };
}

function saveState() {
  appState.users[appState.activeUserId] = { ...appState.users[appState.activeUserId], ...state };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function getActiveUserState() {
  return mergeUserState(appState.users[appState.activeUserId]);
}

function mergeUserState(userState) {
  return {
    ...structuredClone(defaultUserState),
    ...userState,
    settings: { ...defaultUserState.settings, ...(userState?.settings || {}) },
    progress: { ...defaultUserState.progress, ...(userState?.progress || {}) }
  };
}

function createProfile(name) {
  const cleanName = name.trim();
  if (!cleanName) return;

  const id = `user-${Date.now()}`;
  appState.users[id] = {
    id,
    name: cleanName,
    ...structuredClone(defaultUserState)
  };
  appState.activeUserId = id;
  state = getActiveUserState();
  saveState();
  renderAll();
}

function switchProfile(userId) {
  if (!appState.users[userId]) return;
  saveState();
  appState.activeUserId = userId;
  state = getActiveUserState();
  saveState();
  renderAll();
}

function getReadiness(level) {
  const target = jlptTargets[level];
  const values = skills.map((skill) => Math.min(100, Math.round((state.progress[skill.id] / target[skill.id]) * 100)));
  const average = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  return { values, average };
}

function drawRadar() {
  const canvas = document.querySelector("#jlptRadar");
  const ctx = canvas.getContext("2d");
  const level = document.querySelector("#jlptLevelSelect").value;
  const { values, average } = getReadiness(level);
  const size = canvas.width;
  const center = size / 2;
  const radius = 112;

  ctx.clearRect(0, 0, size, size);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#ddd5c7";
  ctx.fillStyle = "#706b62";
  ctx.font = "12px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let ring = 1; ring <= 4; ring += 1) {
    ctx.beginPath();
    skills.forEach((_, index) => {
      const point = radarPoint(index, radius * ring / 4, center);
      index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();
  }

  skills.forEach((skill, index) => {
    const edge = radarPoint(index, radius, center);
    const label = radarPoint(index, radius + 26, center);
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(edge.x, edge.y);
    ctx.stroke();
    ctx.fillText(skill.label, label.x, label.y);
  });

  ctx.beginPath();
  values.forEach((value, index) => {
    const point = radarPoint(index, radius * value / 100, center);
    index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(22, 127, 122, 0.28)";
  ctx.strokeStyle = "#167f7a";
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();

  document.querySelector("#readinessPercent").textContent = `${average}%`;
  renderSkillGrid(level);
}

function radarPoint(index, distance, center) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index / skills.length);
  return {
    x: center + Math.cos(angle) * distance,
    y: center + Math.sin(angle) * distance
  };
}

function renderSkillGrid(level) {
  const target = jlptTargets[level];
  const grid = document.querySelector("#skillGrid");
  grid.innerHTML = skills.map((skill) => {
    const percent = Math.min(100, Math.round((state.progress[skill.id] / target[skill.id]) * 100));
    return `
      <div class="skill-pill">
        <strong>${skill.label} · ${percent}%</strong>
        <div class="meter"><span style="width: ${percent}%"></span></div>
      </div>
    `;
  }).join("");
}

function renderMatrix() {
  const matrix = document.querySelector("#progressMatrix");
  matrix.innerHTML = skills.map((skill) => {
    const value = state.progress[skill.id];
    const max = jlptTargets.N1[skill.id];
    const percent = Math.min(100, Math.round(value / max * 100));
    return `
      <div class="matrix-row">
        <strong>${skill.label}</strong>
        <div class="meter"><span style="width: ${percent}%"></span></div>
        <span>${value}</span>
      </div>
    `;
  }).join("");
}

function renderExercise() {
  const exercise = exercises[state.currentExercise];
  document.querySelector("#exerciseType").textContent = exercise.type;
  setJapaneseText(document.querySelector("#exercisePrompt"), exercise.prompt);
  document.querySelector("#answerInput").value = "";
  document.querySelector("#feedbackPanel").classList.add("hidden");
}

function evaluateAnswer(answer, exercise) {
  const trimmed = answer.trim();
  const hasJapanese = /[\u3040-\u30ff\u3400-\u9fff]/.test(trimmed);
  const lengthScore = Math.min(100, Math.round(trimmed.length / Math.max(1, exercise.accepted.length) * 85));
  const objective = trimmed ? Math.max(25, Math.min(96, lengthScore + (hasJapanese ? 8 : 0))) : 0;
  const comprehension = trimmed ? Math.max(objective, Math.min(98, objective + 14)) : 0;

  return {
    objective,
    comprehension,
    feedback: trimmed
      ? "Correccion provisional: valoro que hay una respuesta interpretable. La siguiente fase conectara un evaluador IA para medir naturalidad, intencion y errores concretos."
      : "Necesito una respuesta para poder corregir.",
    better: `Respuesta modelo: ${exercise.accepted}`
  };
}

function applyProgress(exercise, objective, comprehension) {
  const gain = Math.max(1, Math.round((objective + comprehension) / 55));
  exercise.tags.forEach((tag) => {
    state.progress[tag] = (state.progress[tag] || 0) + gain;
  });
  saveState();
  drawRadar();
  renderMatrix();
}

function switchView(view) {
  document.querySelectorAll(".view").forEach((element) => element.classList.remove("active"));
  document.querySelector(`#view-${view}`).classList.add("active");
  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
}

function bindEvents() {
  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.querySelector("#settingsButton").addEventListener("click", () => switchView("settings"));
  document.querySelector("#startSessionButton").addEventListener("click", () => switchView("practice"));
  document.querySelector("#jlptLevelSelect").addEventListener("change", drawRadar);

  document.querySelector("#newExerciseButton").addEventListener("click", () => {
    state.currentExercise = (state.currentExercise + 1) % exercises.length;
    saveState();
    renderExercise();
  });

  document.querySelectorAll(".keyboard-row button").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector("#answerInput");
      const insert = button.dataset.insert;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = `${input.value.slice(0, start)}${insert}${input.value.slice(end)}`;
      input.focus();
      input.selectionStart = input.selectionEnd = start + insert.length;
      updateImeSuggestions();
    });
  });

  const answerInput = document.querySelector("#answerInput");
  answerInput.addEventListener("input", updateImeSuggestions);
  answerInput.addEventListener("keyup", updateImeSuggestions);
  answerInput.addEventListener("click", updateImeSuggestions);
  answerInput.addEventListener("blur", () => {
    window.setTimeout(() => document.querySelector("#imePanel").classList.add("hidden"), 140);
  });

  document.querySelector("#checkAnswerButton").addEventListener("click", () => {
    const exercise = exercises[state.currentExercise];
    const result = evaluateAnswer(document.querySelector("#answerInput").value, exercise);
    document.querySelector("#objectiveScore").textContent = result.objective;
    document.querySelector("#comprehensionScore").textContent = result.comprehension;
    document.querySelector("#feedbackText").textContent = result.feedback;
    setJapaneseText(document.querySelector("#betterAnswer"), result.better);
    document.querySelector("#feedbackPanel").classList.remove("hidden");
    applyProgress(exercise, result.objective, result.comprehension);
  });

  document.querySelector("#saveSettingsButton").addEventListener("click", () => {
    state.settings.renshuuApiKey = document.querySelector("#renshuuApiKey").value.trim();
    state.settings.mainGoal = document.querySelector("#mainGoal").value;
    state.settings.dailyMinutes = Number(document.querySelector("#dailyMinutes").value || 10);
    saveState();
    switchView("today");
  });

  document.querySelector("#activeProfile").addEventListener("change", (event) => {
    switchProfile(event.target.value);
  });

  document.querySelector("#createProfileButton").addEventListener("click", () => {
    createProfile(document.querySelector("#newProfileName").value);
    document.querySelector("#newProfileName").value = "";
  });

  document.querySelector("#resetProgressButton").addEventListener("click", () => {
    document.querySelector("#resetConfirm").classList.remove("hidden");
  });

  document.querySelector("#cancelResetButton").addEventListener("click", () => {
    document.querySelector("#resetConfirm").classList.add("hidden");
  });

  document.querySelector("#resetConfirm").addEventListener("click", (event) => {
    if (event.target.id === "resetConfirm") {
      document.querySelector("#resetConfirm").classList.add("hidden");
    }
  });

  document.querySelector("#confirmResetButton").addEventListener("click", () => {
    state.progress = structuredClone(defaultUserState.progress);
    saveState();
    drawRadar();
    renderMatrix();
    document.querySelector("#resetConfirm").classList.add("hidden");
  });

  document.querySelector("#furiganaToggle").addEventListener("click", () => {
    state.settings.showFurigana = !state.settings.showFurigana;
    saveState();
    renderAll();
  });

  document.querySelectorAll("[data-tooltip]").forEach((element) => {
    element.addEventListener("touchstart", () => {
      element.classList.add("show-tooltip");
      window.setTimeout(() => element.classList.remove("show-tooltip"), 1800);
    }, { passive: true });
  });
}

function hydrateSettings() {
  const profileSelect = document.querySelector("#activeProfile");
  profileSelect.innerHTML = Object.values(appState.users).map((user) => {
    return `<option value="${user.id}">${user.name}</option>`;
  }).join("");
  profileSelect.value = appState.activeUserId;
  document.querySelector("#renshuuApiKey").value = state.settings.renshuuApiKey || "";
  document.querySelector("#mainGoal").value = state.settings.mainGoal || "work";
  document.querySelector("#dailyMinutes").value = state.settings.dailyMinutes || 10;
  document.querySelector("#furiganaToggle").classList.toggle("active", Boolean(state.settings.showFurigana));
  document.querySelector("#furiganaToggle").setAttribute(
    "aria-label",
    state.settings.showFurigana ? "Desactivar furigana" : "Activar furigana"
  );
}

function renderAll() {
  hydrateSettings();
  renderExercise();
  drawRadar();
  renderMatrix();
}

function setJapaneseText(element, text) {
  element.dataset.rawText = text;
  if (!state.settings.showFurigana) {
    element.textContent = text;
    return;
  }
  element.innerHTML = addFurigana(text);
}

function addFurigana(text) {
  let output = escapeHtml(text);
  furiganaEntries.forEach(([kanji, reading]) => {
    const escapedKanji = escapeRegExp(kanji);
    output = output.replace(new RegExp(escapedKanji, "g"), `<ruby>${kanji}<rt>${reading}</rt></ruby>`);
  });
  return output;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function updateImeSuggestions() {
  const input = document.querySelector("#answerInput");
  const token = getCurrentRomajiToken(input);
  const panel = document.querySelector("#imePanel");
  const suggestions = findImeSuggestions(token.value);

  if (!token.value || suggestions.length === 0) {
    panel.classList.add("hidden");
    return;
  }

  document.querySelector("#imeQuery").textContent = token.value;
  document.querySelector("#imeSuggestions").innerHTML = suggestions.map((item, index) => {
    return `
      <button type="button" data-ime-index="${index}" data-tooltip="Sustituye '${token.value}' por '${item.text}'.">
        ${item.text}
        <small>${item.reading} · ${item.gloss}</small>
      </button>
    `;
  }).join("");

  document.querySelectorAll("[data-ime-index]").forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => {
      insertImeSuggestion(token, suggestions[Number(button.dataset.imeIndex)].text);
    });
  });

  panel.classList.remove("hidden");
}

function getCurrentRomajiToken(input) {
  const cursor = input.selectionStart;
  const beforeCursor = input.value.slice(0, cursor);
  const match = beforeCursor.match(/[A-Za-z]+$/);
  const value = match ? match[0].toLowerCase() : "";
  return {
    value,
    start: cursor - value.length,
    end: cursor
  };
}

function findImeSuggestions(query) {
  if (query.length < 2) return [];

  const direct = romajiDictionary.filter((item) => item.romaji.startsWith(query));
  const kana = romajiToHiragana(query);
  const kanaSuggestion = kana && kana !== query
    ? [{ romaji: query, text: kana, reading: kana, gloss: "kana" }]
    : [];

  return uniqueImeSuggestions([...direct, ...kanaSuggestion]).slice(0, 8);
}

function uniqueImeSuggestions(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.text}-${item.reading}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function insertImeSuggestion(token, replacement) {
  const input = document.querySelector("#answerInput");
  input.value = `${input.value.slice(0, token.start)}${replacement}${input.value.slice(token.end)}`;
  const cursor = token.start + replacement.length;
  input.focus();
  input.selectionStart = input.selectionEnd = cursor;
  document.querySelector("#imePanel").classList.add("hidden");
}

function romajiToHiragana(input) {
  const map = {
    kya: "きゃ", kyu: "きゅ", kyo: "きょ",
    sha: "しゃ", shu: "しゅ", sho: "しょ",
    cha: "ちゃ", chu: "ちゅ", cho: "ちょ",
    nya: "にゃ", nyu: "にゅ", nyo: "にょ",
    hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
    mya: "みゃ", myu: "みゅ", myo: "みょ",
    rya: "りゃ", ryu: "りゅ", ryo: "りょ",
    gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
    ja: "じゃ", ju: "じゅ", jo: "じょ",
    bya: "びゃ", byu: "びゅ", byo: "びょ",
    pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
    a: "あ", i: "い", u: "う", e: "え", o: "お",
    ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
    sa: "さ", shi: "し", su: "す", se: "せ", so: "そ",
    ta: "た", chi: "ち", tsu: "つ", te: "て", to: "と",
    na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
    ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ",
    ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
    ya: "や", yu: "ゆ", yo: "よ",
    ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
    wa: "わ", wo: "を", n: "ん",
    ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
    za: "ざ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
    da: "だ", de: "で", do: "ど",
    ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
    pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ"
  };

  let result = "";
  let rest = input.toLowerCase();

  while (rest.length > 0) {
    if (/^([bcdfghjklmpqrstvwxyz])\1/.test(rest) && !rest.startsWith("nn")) {
      result += "っ";
      rest = rest.slice(1);
      continue;
    }

    const chunk = [3, 2, 1].map((size) => rest.slice(0, size)).find((candidate) => map[candidate]);
    if (!chunk) return "";
    result += map[chunk];
    rest = rest.slice(chunk.length);
  }

  return result;
}

bindEvents();
renderAll();
