const STORAGE_KEY = "nihongo-benkyo-state-v2";
const LEGACY_STORAGE_KEY = "nihongo-benkyo-state";
const APP_VERSION = "0.4.4";
const RENSHUU_PROFILE_URL = "https://api.renshuu.org/v1/profile";

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

const exercises = window.NIHONGO_CONTENT?.exercises || [];
const embeddedDictionary = window.NIHONGO_CONTENT?.dictionary || [];

const defaultUserState = {
  settings: {
    renshuuApiKey: window.NIHONGO_LOCAL_CONFIG?.renshuuApiKey || "",
    mainGoal: "work",
    dailyMinutes: 10,
    showFurigana: false,
    targetJlpt: "N4",
    studyFocus: "balanced"
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
  renshuu: {
    profile: null,
    syncedAt: "",
    error: ""
  },
  currentExerciseId: "n5-01",
  dailyPlan: { date: "", exerciseIds: [], completedIds: [] },
  exerciseHistory: {},
  renshuuBridge: null,
  draftAnswers: {}
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
  ["資料", "しりょう"],
  ...embeddedDictionary.map((item) => [item.text, item.reading])
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
    progress: { ...defaultUserState.progress, ...(userState?.progress || {}) },
    renshuu: { ...defaultUserState.renshuu, ...(userState?.renshuu || {}) },
    dailyPlan: { ...defaultUserState.dailyPlan, ...(userState?.dailyPlan || {}) },
    exerciseHistory: userState?.exerciseHistory || {},
    renshuuBridge: userState?.renshuuBridge || null,
    draftAnswers: userState?.draftAnswers || {}
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
  const renshuu = getRenshuuLevelProgress(level);
  const grid = document.querySelector("#skillGrid");
  grid.innerHTML = skills.map((skill) => {
    const percent = Math.min(100, Math.round((state.progress[skill.id] / target[skill.id]) * 100));
    const renshuuPercent = renshuu[skill.id];
    return `
      <div class="skill-pill">
        <strong>${skill.label} · ${percent}%</strong>
        <div class="meter"><span style="width: ${percent}%"></span></div>
        ${renshuuPercent === undefined ? "" : `<small>Renshuu: ${renshuuPercent}%</small>`}
      </div>
    `;
  }).join("");
}

function getRenshuuLevelProgress(level) {
  const source = state.renshuu.profile?.level_progress_percs || {};
  return {
    vocab: readRenshuuPercent(source.vocab, level),
    kanji: readRenshuuPercent(source.kanji, level),
    grammar: readRenshuuPercent(source.grammar, level),
    reading: readRenshuuPercent(source.sent, level)
  };
}

function readRenshuuPercent(category, level) {
  const value = category?.[level.toLowerCase()];
  return Number.isFinite(Number(value)) ? Number(value) : undefined;
}

function getRenshuuAnalysis(profile, level) {
  const studied = profile.studied || {};
  const streaks = profile.streaks || {};
  const progress = getRenshuuLevelProgress(level);
  const areas = [
    { id: "vocab", label: "vocabulario", value: progress.vocab, today: Number(studied.today_vocab) || 0 },
    { id: "kanji", label: "kanji", value: progress.kanji, today: Number(studied.today_kanji) || 0 },
    { id: "grammar", label: "gramatica", value: progress.grammar, today: Number(studied.today_grammar) || 0 },
    { id: "sent", label: "frases", value: progress.reading, today: Number(studied.today_sent) || 0 }
  ].filter((area) => area.value !== undefined);
  const activeStreaks = [
    ["vocab", "vocabulario"], ["kanji", "kanji"], ["grammar", "gramatica"], ["sent", "frases"]
  ].map(([id, label]) => ({ id, label, days: Number(streaks[id]?.days_studied_in_a_row) || 0 }))
    .filter((item) => item.days > 0);
  const weakest = [...areas].sort((left, right) => left.value - right.value)[0];
  const strongest = [...areas].sort((left, right) => right.value - left.value)[0];
  const range = weakest && strongest ? strongest.value - weakest.value : 0;
  const todayAreas = areas.filter((area) => area.today > 0);
  const inactive = ["vocabulario", "kanji", "gramatica", "frases"].filter((label) => !activeStreaks.some((item) => item.label === label));
  const recommendation = weakest
    ? `Prioridad sugerida: ${weakest.label}. Renshuu registra ${weakest.value}% de cobertura para ${level}; completa una frase propia o una mini respuesta usando ese material.`
    : "Actualiza Renshuu para recibir una recomendacion basada en cobertura.";

  return { areas, activeStreaks, weakest, strongest, range, todayAreas, inactive, recommendation };
}

function renderRenshuuProgress() {
  const profile = state.renshuu.profile;
  const status = document.querySelector("#renshuuStatus");
  const summary = document.querySelector("#renshuuSummary");
  const levels = document.querySelector("#renshuuLevels");
  const analysis = document.querySelector("#renshuuAnalysis");
  const syncButton = document.querySelector("#syncRenshuuButton");
  const level = document.querySelector("#jlptLevelSelect").value;

  syncButton.disabled = false;
  if (!profile) {
    status.textContent = state.renshuu.error || (state.settings.renshuuApiKey
      ? "Pulsa Actualizar para leer tu progreso de Renshuu."
      : "Anade tu clave de Renshuu en Ajustes para leer tu progreso.");
    summary.classList.add("hidden");
    levels.classList.add("hidden");
    analysis.classList.add("hidden");
    return;
  }

  const studied = profile.studied || {};
  const streaks = profile.streaks || {};
  const streak = Math.max(...Object.values(streaks).map((item) => Number(item?.days_studied_in_a_row) || 0), 0);
  const syncedAt = state.renshuu.syncedAt ? new Date(state.renshuu.syncedAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "ahora";
  status.textContent = `Datos de Renshuu actualizados: ${syncedAt}.`;
  summary.innerHTML = `
    <div><strong>Nivel ${profile.adventure_level || "-"}</strong><small>aventura</small></div>
    <div><strong>${studied.today_all || 0}</strong><small>hoy</small></div>
    <div><strong>${streak}</strong><small>dias de racha</small></div>
  `;

  const progress = getRenshuuLevelProgress(level);
  const items = [
    ["Vocabulario", progress.vocab],
    ["Kanji", progress.kanji],
    ["Gramatica", progress.grammar],
    ["Frases", progress.reading]
  ].filter(([, value]) => value !== undefined);
  levels.innerHTML = `<p class="renshuu-level-title">Cobertura Renshuu para ${level}</p>${items.map(([label, value]) => `
    <div class="renshuu-level-row"><span>${label}</span><div class="meter"><span style="width: ${value}%"></span></div><strong>${value}%</strong></div>
  `).join("")}`;
  const detail = getRenshuuAnalysis(profile, level);
  const activityText = detail.todayAreas.length
    ? detail.todayAreas.map((area) => `${area.today} ${area.label}`).join(" · ")
    : "Sin actividad registrada hoy en estas cuatro areas.";
  const streakText = detail.activeStreaks.length
    ? detail.activeStreaks.map((item) => `${item.label}: ${item.days} dias`).join(" · ")
    : "No hay rachas activas en las areas leidas por la API.";
  const balanceText = detail.weakest && detail.strongest
    ? detail.range <= 15
      ? `Cobertura bastante equilibrada: la diferencia entre ${detail.strongest.label} y ${detail.weakest.label} es de ${detail.range} puntos.`
      : `Principal desequilibrio: ${detail.weakest.label} (${detail.weakest.value}%) queda ${detail.range} puntos por debajo de ${detail.strongest.label} (${detail.strongest.value}%).`
    : "Renshuu no ha devuelto cobertura suficiente para comparar areas.";
  analysis.innerHTML = `
    <div class="renshuu-analysis-head"><p class="renshuu-level-title">Lectura de tu avance</p><span class="analysis-level">${level}</span></div>
    <p><strong>Hoy:</strong> ${activityText}</p>
    <p><strong>Continuidad:</strong> ${streakText}</p>
    <p><strong>Balance:</strong> ${balanceText}</p>
    ${detail.inactive.length ? `<p class="analysis-muted">Sin racha activa: ${detail.inactive.join(", ")}.</p>` : ""}
    <p class="renshuu-recommendation">${detail.recommendation}</p>
    <p class="analysis-note">Es una lectura de cobertura y actividad de Renshuu, no una prediccion de aprobado del JLPT.</p>
  `;
  summary.classList.remove("hidden");
  levels.classList.remove("hidden");
  analysis.classList.remove("hidden");
}

function getRenshuuBridge() {
  const studied = state.renshuu.profile?.studied;
  if (!studied) return null;
  const category = [
    ["vocab", Number(studied.today_vocab) || 0],
    ["kanji", Number(studied.today_kanji) || 0],
    ["grammar", Number(studied.today_grammar) || 0],
    ["reading", Number(studied.today_sent) || 0]
  ].sort((left, right) => right[1] - left[1])[0];

  if (!category || category[1] === 0) return null;
  const prompts = {
    vocab: {
      prompt: "Elige una palabra que hayas repasado hoy en Renshuu y escribe una frase corta y natural con ella.",
      accepted: "Frase personal usando vocabulario repasado hoy.",
      explanation: "Renshuu indica que hoy has trabajado vocabulario. Esta tarea no conoce las palabras exactas: te invita a recuperar una y usarla en un contexto propio.",
      tags: ["vocab", "writing"]
    },
    kanji: {
      prompt: "Elige un kanji que hayas repasado hoy en Renshuu. Escríbelo y crea una frase breve que lo use.",
      accepted: "Frase personal usando un kanji repasado hoy.",
      explanation: "Renshuu indica actividad de kanji hoy. Produce una frase corta para conectar forma, lectura y significado.",
      tags: ["kanji", "writing", "reading"]
    },
    grammar: {
      prompt: "Usa una estructura gramatical que hayas repasado hoy en Renshuu en una frase sobre tu día.",
      accepted: "Frase personal usando la gramática repasada hoy.",
      explanation: "Renshuu indica actividad de gramática hoy. Convertir una pauta en una frase propia es una buena segunda capa de práctica.",
      tags: ["grammar", "writing", "particles"]
    },
    reading: {
      prompt: "Reescribe con tus palabras una idea de una frase que hayas visto hoy en Renshuu.",
      accepted: "Reformulación personal de una frase repasada hoy.",
      explanation: "Renshuu indica actividad con frases hoy. Reformular activa comprensión y producción, aunque la idea sea sencilla.",
      tags: ["reading", "writing", "vocab"]
    }
  };
  const selected = prompts[category[0]];
  return {
    id: "renshuu-bridge",
    level: state.settings.targetJlpt,
    type: "Puente con Renshuu",
    prompt: selected.prompt,
    accepted: selected.accepted,
    tags: selected.tags,
    help: [],
    explanation: selected.explanation,
    keywords: [],
    target: "",
    sourceCount: category[1]
  };
}

function renderRenshuuBridge() {
  const bridge = getRenshuuBridge();
  const description = document.querySelector("#bridgeDescription");
  const button = document.querySelector("#startBridgeButton");
  button.disabled = !bridge;
  if (!bridge) {
    description.textContent = state.renshuu.profile
      ? "Renshuu no registra actividad de vocabulario, kanji, gramática o frases para hoy todavía."
      : "Actualiza Renshuu para proponer una práctica relacionada con tu actividad de hoy.";
    return;
  }
  const label = { vocab: "vocabulario", kanji: "kanji", grammar: "gramática", reading: "frases" }[bridge.tags[0]];
  description.textContent = "Hoy Renshuu registra " + bridge.sourceCount + " elementos de " + label + ". Te proponemos una aplicación breve y personal.";
}

function startRenshuuBridge() {
  const bridge = getRenshuuBridge();
  if (!bridge) return;
  state.renshuuBridge = bridge;
  if (!state.dailyPlan.exerciseIds.includes(bridge.id)) state.dailyPlan.exerciseIds.unshift(bridge.id);
  state.currentExerciseId = bridge.id;
  saveState();
  switchView("practice");
  renderExercise();
  renderDailyPlan();
}

async function syncRenshuuProgress() {
  const key = state.settings.renshuuApiKey.trim();
  const status = document.querySelector("#renshuuStatus");
  const button = document.querySelector("#syncRenshuuButton");

  if (!key) {
    state.renshuu.error = "Anade primero tu clave read-only de Renshuu en Ajustes.";
    saveState();
    renderRenshuuProgress();
    switchView("settings");
    return;
  }

  button.disabled = true;
  status.textContent = "Leyendo tu perfil de Renshuu...";
  try {
    const response = await fetch(RENSHUU_PROFILE_URL, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const profile = await response.json();
    if (!profile || typeof profile !== "object") throw new Error("Respuesta no valida");
    state.renshuu = { profile, syncedAt: new Date().toISOString(), error: "" };
    saveState();
    renderAll();
  } catch {
    state.renshuu.error = "No se pudo actualizar Renshuu. Comprueba la clave y tu conexion.";
    saveState();
    renderRenshuuProgress();
  }
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

function getCurrentExercise() {
  return (state.currentExerciseId === "renshuu-bridge" ? state.renshuuBridge : null)
    || exercises.find((exercise) => exercise.id === state.currentExerciseId)
    || exercises.find((exercise) => exercise.id === state.dailyPlan.exerciseIds[0])
    || exercises[0];
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function levelRank(level) {
  return ["N5", "N4", "N3", "N2", "N1"].indexOf(level);
}

function ensureDailyPlan() {
  if (!exercises.length || (state.dailyPlan.date === todayKey() && state.dailyPlan.exerciseIds.length)) return;
  const targetLevel = state.settings.targetJlpt || "N4";
  const candidates = exercises.filter((item) => levelRank(item.level) <= levelRank(targetLevel));
  const count = state.settings.dailyMinutes <= 6 ? 2 : state.settings.dailyMinutes <= 15 ? 3 : 4;
  const target = jlptTargets[targetLevel];
  const focus = state.settings.studyFocus;
  const sorted = [...candidates].sort((left, right) => scorePlanExercise(left, target, focus) - scorePlanExercise(right, target, focus));
  const ids = sorted.slice(0, count).map((item) => item.id);
  state.dailyPlan = { date: todayKey(), exerciseIds: ids, completedIds: [] };
  state.currentExerciseId = ids[0];
  saveState();
}

function scorePlanExercise(exercise, target, focus) {
  const history = state.exerciseHistory[exercise.id] || {};
  const weakness = exercise.tags.reduce((sum, tag) => sum + ((state.progress[tag] || 0) / (target[tag] || 1)), 0) / exercise.tags.length;
  return weakness + (focus !== "balanced" && exercise.tags.includes(focus) ? -0.5 : 0) + (history.status === "review" ? -1 : 0) + (history.attempts || 0) * 0.08;
}

function renderDailyPlan() {
  ensureDailyPlan();
  const plan = state.dailyPlan;
  document.querySelector("#planCount").textContent = plan.completedIds.length + " / " + plan.exerciseIds.length;
  const focusText = { balanced: "equilibrar tus habilidades", work: "situaciones de empresa", daily: "vida diaria", writing: "producción escrita", grammar: "gramática y partículas" }[state.settings.studyFocus] || "equilibrar tus habilidades";
  document.querySelector("#planReason").textContent = "Plan para " + focusText + ", ajustado a tu objetivo " + state.settings.targetJlpt + ".";
  document.querySelector("#planSteps").innerHTML = plan.exerciseIds.map((id, index) => {
    const item = id === "renshuu-bridge" ? state.renshuuBridge : exercises.find((exercise) => exercise.id === id);
    const done = plan.completedIds.includes(id);
    return '<button class="plan-step ' + (done ? "done" : "") + ' ' + (id === state.currentExerciseId ? "current" : "") + '" data-plan-exercise="' + id + '"><span>' + (done ? "✓" : index + 1) + "</span><strong>" + item.type + "</strong><small>" + item.level + "</small></button>";
  }).join("");
  document.querySelectorAll("[data-plan-exercise]").forEach((button) => button.addEventListener("click", () => {
    state.currentExerciseId = button.dataset.planExercise;
    saveState();
    switchView("practice");
    renderExercise();
  }));
}

function renderExercise() {
  ensureDailyPlan();
  const exercise = getCurrentExercise();
  if (!exercise) return;
  document.querySelector("#exerciseType").textContent = exercise.type;
  setJapaneseText(document.querySelector("#exercisePrompt"), exercise.prompt);
  document.querySelector("#answerInput").value = state.draftAnswers[exercise.id] || "";
  document.querySelector("#practiceMeta").textContent = exercise.level + " · " + exercise.tags.map((tag) => skills.find((skill) => skill.id === tag)?.label || tag).join(" · ");
  document.querySelector("#contextHelp").innerHTML = exercise.help.map((item) => '<button class="term-helper" data-dictionary-term="' + item.text + '"><strong>' + item.text + "</strong><span>" + item.reading + "</span><small>" + item.meaning + "</small></button>").join("") + "<p>" + exercise.explanation + "</p>";
  document.querySelector("#contextHelp").classList.add("hidden");
  document.querySelector("#helpToggle").setAttribute("aria-expanded", "false");
  document.querySelector("#feedbackPanel").classList.add("hidden");
}

function evaluateAnswer(answer, exercise) {
  const trimmed = answer.trim();
  const normalized = normalizeAnswer(trimmed);
  const expected = exercise.target.split("|").filter(Boolean).map(normalizeAnswer);
  const keywords = exercise.keywords.map(normalizeAnswer);
  const checks = expected.length ? expected : keywords;
  const matches = checks.filter((item) => normalized.includes(item)).length;
  const objective = checks.length && matches ? Math.round((matches / checks.length) * 100) : null;

  return {
    objective,
    comprehension: null,
    feedback: trimmed
      ? (checks.length
        ? "La app solo ha podido comparar elementos clave con una respuesta modelo. Una alternativa correcta puede no coincidir literalmente."
        : "Este es un ejercicio abierto: no se puntúa automáticamente para no inventar una nota.")
      : "Necesito una respuesta para poder corregir.",
    better: `Respuesta modelo: ${exercise.accepted}`
  };
}

function normalizeAnswer(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s、。,.!?¿¡]/g, "");
}

function applyProgress(exercise, confidence, result) {
  const checkedScore = result.objective ?? 50;
  const gain = confidence === "solid" ? Math.max(2, Math.round(checkedScore / 25)) : 1;
  exercise.tags.forEach((tag) => {
    state.progress[tag] = (state.progress[tag] || 0) + gain;
  });
  state.exerciseHistory[exercise.id] = {
    attempts: (state.exerciseHistory[exercise.id]?.attempts || 0) + 1,
    status: confidence,
    lastAttempted: new Date().toISOString()
  };
  if (!state.dailyPlan.completedIds.includes(exercise.id)) state.dailyPlan.completedIds.push(exercise.id);
  saveState();
  drawRadar();
  renderMatrix();
  renderDailyPlan();
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
  document.querySelector("#backToPlanButton").addEventListener("click", () => {
    saveState();
    switchView("today");
    renderDailyPlan();
  });
  document.querySelector("#jlptLevelSelect").addEventListener("change", drawRadar);
  document.querySelector("#syncRenshuuButton").addEventListener("click", syncRenshuuProgress);
  document.querySelector("#startBridgeButton").addEventListener("click", startRenshuuBridge);
  document.querySelector("#dictionarySearch").addEventListener("input", (event) => renderDictionary(event.target.value));
  document.addEventListener("click", (event) => {
    const helper = event.target.closest("[data-dictionary-term]");
    if (!helper) return;
    const query = helper.dataset.dictionaryTerm;
    document.querySelector("#dictionarySearch").value = query;
    renderDictionary(query);
  });

  document.querySelector("#newExerciseButton").addEventListener("click", () => {
    ensureDailyPlan();
    const current = state.dailyPlan.exerciseIds.indexOf(state.currentExerciseId);
    state.currentExerciseId = state.dailyPlan.exerciseIds[(current + 1) % state.dailyPlan.exerciseIds.length];
    saveState();
    renderExercise();
  });

  document.querySelector("#helpToggle").addEventListener("click", () => {
    const help = document.querySelector("#contextHelp");
    const isHidden = help.classList.toggle("hidden");
    document.querySelector("#helpToggle").setAttribute("aria-expanded", String(!isHidden));
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
  answerInput.addEventListener("input", () => {
    const exercise = getCurrentExercise();
    if (exercise) {
      state.draftAnswers[exercise.id] = answerInput.value;
      saveState();
    }
    updateImeSuggestions();
  });
  answerInput.addEventListener("keyup", updateImeSuggestions);
  answerInput.addEventListener("click", updateImeSuggestions);
  answerInput.addEventListener("blur", () => {
    window.setTimeout(() => document.querySelector("#imePanel").classList.add("hidden"), 140);
  });

  document.querySelector("#checkAnswerButton").addEventListener("click", () => {
    const exercise = getCurrentExercise();
    const result = evaluateAnswer(document.querySelector("#answerInput").value, exercise);
    document.querySelector("#objectiveScore").textContent = result.objective === null ? "—" : result.objective + "%";
    document.querySelector("#comprehensionScore").textContent = "—";
    document.querySelector("#objectiveLabel").textContent = result.objective === null ? "revisión manual" : "elementos modelo";
    document.querySelector("#comprehensionLabel").textContent = "interpretación";
    document.querySelector("#scoreMeaning").textContent = result.objective === null
      ? "La app no ha reconocido suficientes elementos de referencia. Esto no demuestra que tu frase sea incorrecta."
      : "Este porcentaje indica cuántos elementos de la respuesta modelo se han reconocido; no mide por sí solo naturalidad ni comprensión.";
    document.querySelector("#feedbackText").textContent = result.feedback;
    setJapaneseText(document.querySelector("#betterAnswer"), result.better);
    document.querySelector("#exerciseExplanation").textContent = exercise.explanation;
    document.querySelector("#feedbackPanel").classList.remove("hidden");
    document.querySelectorAll("[data-review]").forEach((button) => {
      button.onclick = () => {
        applyProgress(exercise, button.dataset.review, result);
        delete state.draftAnswers[exercise.id];
        const plan = state.dailyPlan.exerciseIds;
        const index = plan.indexOf(exercise.id);
        state.currentExerciseId = plan[(index + 1) % plan.length];
        saveState();
        renderExercise();
      };
    });
  });

  document.querySelector("#saveSettingsButton").addEventListener("click", () => {
    const nextRenshuuApiKey = document.querySelector("#renshuuApiKey").value.trim();
    if (nextRenshuuApiKey !== state.settings.renshuuApiKey) {
      state.renshuu = structuredClone(defaultUserState.renshuu);
    }
    state.settings.renshuuApiKey = nextRenshuuApiKey;
    state.settings.mainGoal = document.querySelector("#mainGoal").value;
    state.settings.dailyMinutes = Number(document.querySelector("#dailyMinutes").value || 10);
    state.settings.targetJlpt = document.querySelector("#targetJlpt").value;
    state.settings.studyFocus = document.querySelector("#studyFocus").value;
    state.dailyPlan = structuredClone(defaultUserState.dailyPlan);
    saveState();
    ensureDailyPlan();
    renderAll();
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
  document.querySelector("#targetJlpt").value = state.settings.targetJlpt || "N4";
  document.querySelector("#studyFocus").value = state.settings.studyFocus || "balanced";
  document.querySelector("#jlptLevelSelect").value = state.settings.targetJlpt || "N4";
  document.querySelector("#furiganaToggle").classList.toggle("active", Boolean(state.settings.showFurigana));
  document.querySelector("#furiganaToggle").setAttribute(
    "aria-label",
    state.settings.showFurigana ? "Desactivar furigana" : "Activar furigana"
  );
  document.querySelector("#appVersion").textContent = `Version ${APP_VERSION} · progreso local`;
}

function renderAll() {
  hydrateSettings();
  ensureDailyPlan();
  renderExercise();
  renderDailyPlan();
  drawRadar();
  renderMatrix();
  renderRenshuuProgress();
  renderRenshuuBridge();
  renderDictionary();
}

function renderDictionary(query = "") {
  const normalized = normalizeAnswer(query);
  const matches = embeddedDictionary.filter((item) => !normalized || [item.text, item.reading, item.meaning].some((value) => normalizeAnswer(value).includes(normalized))).slice(0, 10);
  document.querySelector("#dictionaryResults").innerHTML = matches.map((item) => '<button class="dictionary-row" data-insert-dictionary="' + item.text + '"><strong>' + item.text + "</strong><span>" + item.reading + "</span><small>" + item.meaning + (item.note ? " · " + item.note : "") + "</small></button>").join("") || '<p class="muted">No hay coincidencias aún.</p>';
  document.querySelectorAll("[data-insert-dictionary]").forEach((button) => button.addEventListener("click", () => {
    const input = document.querySelector("#answerInput");
    input.value += (input.value ? " " : "") + button.dataset.insertDictionary;
    input.focus();
  }));
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js?v=0.4.4").catch(() => {
      // La app sigue funcionando en navegadores que no permiten cache offline.
    });
  });
}
