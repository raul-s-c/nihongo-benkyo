const STORAGE_KEY = "nihongo-benkyo-state-v2";
const LEGACY_STORAGE_KEY = "nihongo-benkyo-state";
const APP_VERSION = "0.7.1";
const RENSHUU_PROFILE_URL = "https://api.renshuu.org/v1/profile";
const CLOUD_STATE_TABLE = "user_states";

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
const themes = {
  balanced: "Todas las tematicas",
  compras: "Compras",
  "ciudad-y-transporte": "Ciudad y transporte",
  "amistades-y-ocio": "Amistades y ocio",
  trabajo: "Trabajo",
  comida: "Comida",
  "hogar-y-estudio": "Hogar y estudio",
  comunicacion: "Comunicacion",
  "vida-diaria": "Vida diaria"
};
const dailyThemes = new Set(["compras", "ciudad-y-transporte", "amistades-y-ocio", "comida", "hogar-y-estudio", "comunicacion", "vida-diaria"]);
const PROTOTYPE_PROGRESS_SEED = { vocab: 90, kanji: 12, grammar: 18, particles: 22, reading: 20, writing: 14, listening: 8, work: 5 };
const exerciseTaxonomy = {
  "n5-01": ["Forma -masu", "Rutinas y tiempo"], "n5-02": ["Lugar de accion", "Estudio y hogar"], "n5-03": ["Particulas de lugar", "Estudio y lugares"], "n5-04": ["Registro cortés", "Comunicacion basica"],
  "n5-05": ["Posesion con no", "Objetos cotidianos"], "n5-06": ["Tiempo y destino", "Desplazamientos"], "n5-07": ["Clasificadores y listas", "Comida y bebida"], "n5-08": ["Forma te", "Rutinas y comida"],
  "n5-09": ["Razon con kara", "Motivacion y trabajo"], "n5-10": ["Particula ni", "Encuentros y ciudad"], "n5-11": ["Receptor con ni", "Correo y oficina"], "n5-12": ["Peticion cortés", "Comunicacion basica"],
  "n4-01": ["Registro respetuoso", "Clientes y llamadas"], "n4-02": ["Inicio con kara", "Reuniones y horarios"], "n4-03": ["Destino con e", "Viajes de trabajo"], "n4-04": ["Preguntas de objeto", "Gestion y plazos"],
  "n4-05": ["Secuencia temporal", "Reuniones y documentos"], "n4-06": ["Contraste con ga", "Incidencias laborales"], "n4-07": ["Condicion con nara", "Reuniones y horarios"], "n4-08": ["Categorias", "Vocabulario de oficina"],
  "n4-09": ["Pregunta cortés", "Reservas y atencion"], "n4-10": ["Secuencia te kara", "Documentos y preguntas"], "n4-11": ["Intervalo kara made", "Horarios de trabajo"], "n4-12": ["Planes con yotei", "Tiempo libre"],
  "n4-13": ["Forma potencial", "Conversacion laboral"], "n4-14": ["Condicional nakereba", "Ayuda y comunicacion"], "n4-15": ["Tiempo relativo", "Desplazamientos"],
  "n3-01": ["Contraste con temo", "Correo y plazos"], "n3-02": ["Preparacion te oku", "Reuniones y documentos"], "n3-03": ["Razon con node", "Incidencias laborales"], "n3-04": ["Registro profesional", "Seguimiento de asuntos"], "n3-05": ["Fecha limite made ni", "Gestion de tareas"],
  "n2-01": ["Peticion honorifica", "Contratos y clientes"], "n2-02": ["Inmediatez shidai", "Cambios de plan"], "n2-03": ["Rechazo atenuado", "Negociacion"], "n2-04": ["Particula ni", "Solicitudes y gestion"], "n2-05": ["Registro formal", "Prioridades de proyecto"],
  "n1-01": ["Secuencia uede", "Decision corporativa"], "n1-02": ["Compromiso formal", "Calidad y procesos"], "n1-03": ["Necesidad objetiva", "Toma de decisiones"], "n1-04": ["Keigo corporativo", "Expectativas de clientes"], "n1-05": ["Disculpa formal", "Atencion al cliente"],
  "renshuu-bridge": ["Produccion libre", "Transferencia de Renshuu"]
};
const curriculumStages = [
  { id: "n5-foundations", level: "N5", label: "Fundamentos N5", exerciseIds: ["n5-01", "n5-02", "n5-03", "n5-04"] },
  { id: "n5-daily", level: "N5", label: "Vida diaria N5", exerciseIds: ["n5-05", "n5-06", "n5-07", "n5-08"] },
  { id: "n5-interaction", level: "N5", label: "Interaccion N5", exerciseIds: ["n5-09", "n5-10", "n5-11", "n5-12"] },
  { id: "n4-work-basics", level: "N4", label: "Empresa N4: base", exerciseIds: ["n4-01", "n4-02", "n4-03", "n4-04", "n4-05"] },
  { id: "n4-work-scenarios", level: "N4", label: "Empresa N4: situaciones", exerciseIds: ["n4-06", "n4-07", "n4-08", "n4-09", "n4-10"] },
  { id: "n4-work-applied", level: "N4", label: "Empresa N4: aplicacion", exerciseIds: ["n4-11", "n4-12", "n4-13", "n4-14", "n4-15"] },
  { id: "n3-professional", level: "N3", label: "Empresa N3: coordinacion", exerciseIds: ["n3-01", "n3-02", "n3-03", "n3-04", "n3-05"] },
  { id: "n2-professional", level: "N2", label: "Empresa N2: negociacion", exerciseIds: ["n2-01", "n2-02", "n2-03", "n2-04", "n2-05"] },
  { id: "n1-professional", level: "N1", label: "Empresa N1: comunicacion formal", exerciseIds: ["n1-01", "n1-02", "n1-03", "n1-04", "n1-05"] }
];

function validateCurriculumIntegrity() {
  const errors = [];
  const exerciseIds = new Set(exercises.map((exercise) => exercise.id));
  const stagedIds = curriculumStages.flatMap((stage) => stage.exerciseIds);
  const stagedCounts = stagedIds.reduce((counts, id) => ({ ...counts, [id]: (counts[id] || 0) + 1 }), {});
  Object.entries(stagedCounts).forEach(([id, count]) => {
    if (!exerciseIds.has(id)) errors.push(`Ruta con ejercicio inexistente: ${id}`);
    if (count > 1) errors.push(`Ejercicio repetido en rutas: ${id}`);
    if (exercises.find((exercise) => exercise.id === id && !exercise.core)) errors.push(`Ejercicio tematico incluido en ruta troncal: ${id}`);
  });
  exercises.filter((exercise) => exercise.core).forEach((exercise) => {
    if (!stagedCounts[exercise.id]) errors.push(`Ejercicio troncal sin ruta: ${exercise.id}`);
  });
  if (errors.length) throw new Error(`Curriculo invalido: ${errors.join("; ")}`);
}

validateCurriculumIntegrity();

const defaultUserState = {
  settings: {
    renshuuApiKey: window.NIHONGO_LOCAL_CONFIG?.renshuuApiKey || "",
    mainGoal: "work",
    dailyMinutes: 10,
    showFurigana: false,
    targetJlpt: "N4",
    studyFocus: "balanced",
    themeFocus: "balanced"
  },
  progress: {
    vocab: 0,
    kanji: 0,
    grammar: 0,
    particles: 0,
    reading: 0,
    writing: 0,
    listening: 0,
    work: 0
  },
  renshuu: {
    profile: null,
    syncedAt: "",
    error: ""
  },
  currentExerciseId: "n5-01",
  dailyPlan: { date: "", exerciseIds: [], completedIds: [], skippedIds: [] },
  exerciseHistory: {},
  attemptLog: [],
  renshuuBridge: null,
  draftAnswers: {}
};

let appState = loadAppState();
let state = getActiveUserState();
let activeSkillId = "vocab";
let deferredInstallPrompt = null;
let cloudClient = null;
let cloudPushTimer = null;
let cloudHydrating = false;

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
  scheduleCloudPush();
}

function getCloudClient() {
  if (cloudClient) return cloudClient;
  const config = window.NIHONGO_CLOUD_CONFIG || {};
  if (!config.url || !config.publishableKey || !window.supabase?.createClient) return null;
  cloudClient = window.supabase.createClient(config.url, config.publishableKey);
  return cloudClient;
}

function getCloudSnapshot() {
  const snapshot = structuredClone(appState);
  Object.values(snapshot.users).forEach((user) => {
    if (user.settings) delete user.settings.renshuuApiKey;
  });
  return snapshot;
}

function restoreCloudSnapshot(snapshot) {
  if (!snapshot?.users || !snapshot.activeUserId || !snapshot.users[snapshot.activeUserId]) throw new Error("Copia remota no valida");
  const localKeys = Object.fromEntries(Object.entries(appState.users).map(([id, user]) => [id, user.settings?.renshuuApiKey || ""]));
  appState = structuredClone(snapshot);
  Object.values(appState.users).forEach((user) => {
    user.settings = { ...(user.settings || {}), renshuuApiKey: localKeys[user.id] || "" };
  });
  state = getActiveUserState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function setCloudStatus(message) {
  const element = document.querySelector("#cloudStatus");
  if (element) element.textContent = message;
}

function renderCloudAccount(session = null) {
  const configured = Boolean(getCloudClient());
  const account = document.querySelector("#cloudAccount");
  const email = document.querySelector("#cloudEmail");
  const password = document.querySelector("#cloudPassword");
  const signUp = document.querySelector("#cloudSignUpButton");
  const signIn = document.querySelector("#cloudSignInButton");
  const signOut = document.querySelector("#cloudSignOutButton");
  if (!account || !email || !password || !signUp || !signIn || !signOut) return;
  const user = session?.user;
  account.classList.toggle("hidden", !configured || Boolean(user));
  signOut.classList.toggle("hidden", !user);
  signOut.disabled = !user;
  email.disabled = !configured || Boolean(user);
  password.disabled = !configured || Boolean(user);
  signUp.disabled = !configured || Boolean(user);
  signIn.disabled = !configured || Boolean(user);
  if (!configured) {
    setCloudStatus("La sincronizacion aun no esta configurada para esta instalacion.");
  } else if (user) {
    setCloudStatus(`Sincronizacion activa para ${user.email}. Tu progreso se guarda al cambiar.`);
  } else {
    setCloudStatus("Inicia sesion para guardar este perfil y retomarlo desde otro dispositivo.");
  }
}

async function refreshCloudAccount() {
  const client = getCloudClient();
  if (!client) {
    renderCloudAccount();
    return null;
  }
  const { data } = await client.auth.getSession();
  renderCloudAccount(data.session);
  return data.session;
}

function scheduleCloudPush() {
  if (cloudHydrating || !getCloudClient()) return;
  window.clearTimeout(cloudPushTimer);
  cloudPushTimer = window.setTimeout(() => pushCloudState(), 800);
}

async function pushCloudState() {
  const client = getCloudClient();
  if (!client || cloudHydrating) return;
  try {
    const { data: { session } } = await client.auth.getSession();
    if (!session?.user) return;
    const { error } = await client.from(CLOUD_STATE_TABLE).upsert({
      user_id: session.user.id,
      state: getCloudSnapshot(),
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (error) setCloudStatus("No se pudo guardar en la nube. El progreso sigue seguro en este dispositivo.");
    else setCloudStatus(`Sincronizado hace un momento para ${session.user.email}.`);
  } catch {
    setCloudStatus("Sin conexion con la nube. El progreso seguira guardandose en este dispositivo.");
  }
}

async function pullCloudState() {
  const client = getCloudClient();
  if (!client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session?.user) return;
  const { data, error } = await client.from(CLOUD_STATE_TABLE).select("state").eq("user_id", session.user.id).maybeSingle();
  if (error) {
    setCloudStatus("No se pudo leer la copia en la nube.");
    return;
  }
  if (!data?.state) {
    await pushCloudState();
    return;
  }
  cloudHydrating = true;
  try {
    restoreCloudSnapshot(data.state);
    renderAll();
    setCloudStatus(`Progreso recuperado para ${session.user.email}.`);
  } finally {
    cloudHydrating = false;
  }
}

async function submitCloudAccount(mode) {
  const client = getCloudClient();
  if (!client) return;
  const email = document.querySelector("#cloudEmail").value.trim();
  const password = document.querySelector("#cloudPassword").value;
  if (!email || password.length < 8) {
    setCloudStatus("Escribe un email y una contrasena de al menos 8 caracteres.");
    return;
  }
  setCloudStatus(mode === "signup" ? "Creando cuenta..." : "Iniciando sesion...");
  const result = mode === "signup"
    ? await client.auth.signUp({ email, password })
    : await client.auth.signInWithPassword({ email, password });
  if (result.error) {
    setCloudStatus("No se pudo completar la cuenta. Revisa los datos o confirma tu email.");
    return;
  }
  document.querySelector("#cloudPassword").value = "";
  await refreshCloudAccount();
  if (result.data.session) await pullCloudState();
  else setCloudStatus("Revisa tu email para confirmar la cuenta y despues inicia sesion.");
}

async function signOutCloudAccount() {
  const client = getCloudClient();
  if (!client) return;
  await client.auth.signOut();
  renderCloudAccount();
}

function getActiveUserState() {
  return mergeUserState(appState.users[appState.activeUserId]);
}

function mergeUserState(userState) {
  const history = userState?.exerciseHistory || {};
  const storedProgress = userState?.progress || {};
  const isUntouchedPrototype = !Object.keys(history).length
    && skills.every((skill) => Number(storedProgress[skill.id]) === PROTOTYPE_PROGRESS_SEED[skill.id]);
  return {
    ...structuredClone(defaultUserState),
    ...userState,
    settings: { ...defaultUserState.settings, ...(userState?.settings || {}) },
    progress: isUntouchedPrototype ? structuredClone(defaultUserState.progress) : { ...defaultUserState.progress, ...storedProgress },
    renshuu: { ...defaultUserState.renshuu, ...(userState?.renshuu || {}) },
    dailyPlan: { ...defaultUserState.dailyPlan, ...(userState?.dailyPlan || {}) },
    exerciseHistory: history,
    attemptLog: userState?.attemptLog || [],
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

function exportActiveProfile() {
  const payload = {
    format: "nihongo-benkyo-profile",
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    profile: { ...appState.users[appState.activeUserId], ...state }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `nihongo-benkyo-${state.name || "perfil"}-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importProfile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (imported?.format !== "nihongo-benkyo-profile" || !imported.profile?.id) throw new Error("Formato no valido");
      const importedId = imported.profile.id;
      appState.users[importedId] = {
        ...imported.profile,
        ...mergeUserState(imported.profile),
        id: importedId,
        name: imported.profile.name || "Perfil importado"
      };
      appState.activeUserId = importedId;
      state = getActiveUserState();
      saveState();
      renderAll();
      switchView("today");
      window.alert("Copia importada en este dispositivo.");
    } catch {
      window.alert("No se pudo importar esta copia. Elige un archivo exportado por Nihongo Benkyo.");
    }
  };
  reader.readAsText(file);
}

function deleteActiveProfile() {
  const profiles = Object.keys(appState.users);
  if (profiles.length < 2) {
    window.alert("Crea otro perfil antes de eliminar el unico perfil local.");
    return;
  }
  if (!window.confirm(`Eliminar el perfil ${state.name || "activo"} y todo su progreso local? Esta accion no se puede deshacer.`)) return;
  const removedId = appState.activeUserId;
  delete appState.users[removedId];
  appState.activeUserId = Object.keys(appState.users)[0];
  state = getActiveUserState();
  saveState();
  renderAll();
  switchView("settings");
}

function getContentCoverage(skillId, level) {
  const content = exercises.filter((exercise) => exercise.tags.includes(skillId) && levelRank(exercise.level) <= levelRank(level));
  if (!content.length) return 0;
  const evidence = content.reduce((sum, exercise) => {
    const history = state.exerciseHistory[exercise.id] || {};
    if (history.status === "solid") return sum + 1;
    if (history.status === "review") return sum + 0.25;
    return sum;
  }, 0);
  return Math.round(evidence / content.length * 100);
}

function getReadiness(level) {
  const values = skills.map((skill) => getContentCoverage(skill.id, level));
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
  canvas.setAttribute("aria-label", "Radar de cobertura del contenido para el nivel JLPT. Toca una arista para abrir el detalle de esa habilidad.");
  canvas.title = "Toca una arista para ver el detalle de la habilidad";
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
  const renshuu = getRenshuuLevelProgress(level);
  const grid = document.querySelector("#skillGrid");
  grid.innerHTML = skills.map((skill) => {
    const percent = getContentCoverage(skill.id, level);
    const renshuuPercent = renshuu[skill.id];
    return `
      <button class="skill-pill" data-skill-detail="${skill.id}" data-tooltip="Abre contenidos, repasos, etiquetas y siguiente paso de ${skill.label}.">
        <strong>${skill.label} · ${percent}%</strong>
        <div class="meter"><span style="width: ${percent}%"></span></div>
        ${renshuuPercent === undefined ? "" : `<small>Renshuu: ${renshuuPercent}%</small>`}
      </button>
    `;
  }).join("");
  document.querySelectorAll("[data-skill-detail]").forEach((button) => {
    button.addEventListener("click", () => openSkillDetail(button.dataset.skillDetail));
  });
}

function openSkillDetail(skillId) {
  if (!skills.some((skill) => skill.id === skillId)) return;
  activeSkillId = skillId;
  renderSkillDetail();
  switchView("skill-detail");
}

function getSkillExerciseSchedule(exercise) {
  const history = state.exerciseHistory[exercise.id] || {};
  if (history.status === "review") return "Repaso pendiente: el plan lo prioriza desde manana.";
  if (isReviewDue(history)) return "Repaso vencido: vuelve a estar disponible hoy.";
  if (history.nextReviewAt) return `Proximo repaso: ${new Date(history.nextReviewAt).toLocaleDateString("es-ES")}.`;
  if (history.status === "solid") return "Confirmado; aun no tiene una fecha de repaso.";
  const current = getCurrentCurriculumStage();
  if (!exercise.core) {
    const unlockedLevel = current?.level || state.settings.targetJlpt || "N5";
    return levelRank(exercise.level) <= levelRank(unlockedLevel)
      ? "Disponible al elegir esta tematica en Ajustes."
      : `Se desbloquea al llegar al bloque ${exercise.level}.`;
  }
  const stageIndex = curriculumStages.findIndex((stage) => stage.exerciseIds.includes(exercise.id));
  const currentIndex = current ? curriculumStages.findIndex((stage) => stage.id === current.id) : curriculumStages.length;
  if (stageIndex === currentIndex) return "Disponible en el bloque actual.";
  if (stageIndex > currentIndex) return `Se desbloquea al completar ${curriculumStages[stageIndex - 1]?.label || "el bloque anterior"}.`;
  return "Disponible como repaso dentro de tu objetivo JLPT.";
}

function getSkillDetail(skillId) {
  const relatedExercises = exercises.filter((exercise) => exercise.tags.includes(skillId));
  const attempts = (state.attemptLog || []).filter((entry) => relatedExercises.some((exercise) => exercise.id === entry.exerciseId));
  const metrics = getMetricSummary(attempts);
  const terms = new Map();
  relatedExercises.forEach((exercise) => {
    exercise.help.forEach((term) => {
      const current = terms.get(term.text) || { ...term, themes: new Set(), levels: new Set(), exerciseIds: new Set() };
      current.themes.add(term.theme || exercise.theme);
      current.levels.add(term.level || exercise.level);
      current.exerciseIds.add(exercise.id);
      terms.set(term.text, current);
    });
  });
  const pending = relatedExercises.filter((exercise) => {
    const history = state.exerciseHistory[exercise.id];
    return history?.status === "review" || isReviewDue(history);
  });
  const newItems = relatedExercises.filter((exercise) => !state.exerciseHistory[exercise.id]?.status);
  const next = [...relatedExercises]
    .filter((exercise) => {
      const history = state.exerciseHistory[exercise.id];
      return history?.status !== "solid" || isReviewDue(history);
    })
    .sort((left, right) => scorePlanExercise(left, jlptTargets[state.settings.targetJlpt], state.settings.studyFocus) - scorePlanExercise(right, jlptTargets[state.settings.targetJlpt], state.settings.studyFocus))[0];
  const termList = [...terms.values()].map((term) => {
    const termAttempts = (state.attemptLog || []).filter((entry) => term.exerciseIds.has(entry.exerciseId));
    return { ...term, attempts: termAttempts.length, reviews: termAttempts.filter((entry) => entry.outcome === "review").length };
  });
  return { relatedExercises, attempts, metrics, terms: termList, pending, newItems, next };
}

function renderSkillDetail() {
  const skill = skills.find((item) => item.id === activeSkillId) || skills[0];
  const detail = getSkillDetail(skill.id);
  const level = state.settings.targetJlpt || "N4";
  const readiness = getContentCoverage(skill.id, level);
  document.querySelector("#skillDetailTitle").textContent = skill.label;
  document.querySelector("#skillDetailIntro").textContent = `Evidencia y contenido de ${skill.label.toLowerCase()} para tu objetivo ${level}. Las etiquetas muestran los contextos y niveles donde aparece cada termino.`;
  document.querySelector("#skillDetailSummary").innerHTML = [
    [readiness + "%", "contenido confirmado hasta " + level],
    [detail.attempts.length, "intentos en esta habilidad"],
    [detail.pending.length, "ejercicios para repasar"],
    [detail.newItems.length, "ejercicios aun no iniciados"]
  ].map(([value, label]) => `<div><strong>${value}</strong><small>${label}</small></div>`).join("");
  const next = detail.next;
  document.querySelector("#skillNextContent").innerHTML = next
    ? `<div class="skill-next-card"><strong>${next.type}</strong><span>${next.level} · ${themes[next.theme] || "Vida diaria"}</span><p>${getSkillExerciseSchedule(next)}</p></div>`
    : "<p>Has confirmado todo el contenido disponible de esta habilidad para tu objetivo actual.</p>";
  document.querySelector("#skillTermList").innerHTML = detail.terms.length
    ? detail.terms.map((term) => `<div class="skill-term-row"><strong>${term.text}</strong><span>${term.reading} · ${term.meaning} · ${term.attempts} intento${term.attempts === 1 ? "" : "s"}${term.reviews ? ` · ${term.reviews} repaso${term.reviews === 1 ? "" : "s"}` : ""}</span><div class="tag-row">${[...term.levels].map((item) => `<small>${item}</small>`).join("")}${[...term.themes].map((item) => `<small>${themes[item] || item}</small>`).join("")}</div></div>`).join("")
    : "<p>Este contenido aun no tiene terminos de ayuda asociados.</p>";
  document.querySelector("#skillExerciseList").innerHTML = detail.relatedExercises.length
    ? detail.relatedExercises.map((exercise) => {
      const history = state.exerciseHistory[exercise.id] || {};
      const count = history.attempts || 0;
      return `<div class="skill-exercise-row"><strong>${exercise.type}</strong><span>${exercise.level} · ${themes[exercise.theme] || "Vida diaria"} · ${count} intento${count === 1 ? "" : "s"}</span><p>${getSkillExerciseSchedule(exercise)}</p></div>`;
    }).join("")
    : "<p>Aun no hay ejercicios etiquetados para esta habilidad.</p>";
}

function getRadarSkillAtPosition(event) {
  const canvas = document.querySelector("#jlptRadar");
  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;
  const x = (event.clientX - rect.left) * scale;
  const y = (event.clientY - rect.top) * scale;
  const center = canvas.width / 2;
  const distance = Math.hypot(x - center, y - center);
  if (distance < 54 || distance > 156) return null;
  const angle = Math.atan2(y - center, x - center);
  const closest = skills.reduce((result, skill, index) => {
    const targetAngle = -Math.PI / 2 + (Math.PI * 2 * index / skills.length);
    const delta = Math.abs(Math.atan2(Math.sin(angle - targetAngle), Math.cos(angle - targetAngle)));
    return delta < result.delta ? { skill, delta } : result;
  }, { skill: null, delta: Infinity });
  return closest.delta <= Math.PI / skills.length / 1.5 ? closest.skill : null;
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
  const totalAttempts = Object.values(state.exerciseHistory).reduce((sum, item) => sum + (item.attempts || 0), 0);
  document.querySelector("#matrixStatus").textContent = totalAttempts
    ? `${totalAttempts} intento${totalAttempts === 1 ? "" : "s"} registrado${totalAttempts === 1 ? "" : "s"}. Estos puntos pertenecen solo a Nihongo Benkyo.`
    : "Aun no hay intentos registrados. La matriz empieza en cero.";
  matrix.innerHTML = skills.map((skill) => {
    const value = state.progress[skill.id];
    const max = jlptTargets.N1[skill.id];
    const percent = Math.min(100, Math.round(value / max * 100));
    return `
      <div class="matrix-row">
        <strong>${skill.label}</strong>
        <div class="meter"><span style="width: ${percent}%"></span></div>
        <span>${value} pts</span>
      </div>
    `;
  }).join("");
  renderLearningAnalytics();
}

function getExerciseDomains(exercise) {
  const [grammarFamily, lexicalFamily] = exerciseTaxonomy[exercise.id]
    || [exercise.tags.includes("particles") ? "Particulas" : exercise.tags.includes("grammar") ? "Estructuras basicas" : "Produccion y comprension", exercise.tags.includes("work") ? "Empresa" : "Vida diaria"];
  return {
    grammarFamily,
    lexicalFamily,
    terms: (exercise.help || []).map((item) => item.text).slice(0, 4)
  };
}

function getAttemptOutcome(result, confidence) {
  if (confidence === "review") return "review";
  if (result.objective === null) return "manual";
  return result.objective >= 80 ? "correct" : "partial";
}

function getMetricSummary(entries) {
  return entries.reduce((summary, entry) => {
    summary[entry.outcome] = (summary[entry.outcome] || 0) + 1;
    summary.total += 1;
    return summary;
  }, { total: 0, correct: 0, partial: 0, review: 0, manual: 0 });
}

function metricLabel(metric) {
  if (!metric.total) return "Sin intentos";
  const automatic = metric.correct + metric.partial;
  const accuracy = automatic ? Math.round(metric.correct / automatic * 100) : null;
  const accuracyText = accuracy === null ? "sin correccion automatica" : `${accuracy}% aciertos reconocidos`;
  return `${accuracyText} · ${metric.review} para repasar`;
}

function renderLearningAnalytics() {
  const summary = document.querySelector("#analyticsSummary");
  const cards = document.querySelector("#analyticsCards");
  const map = document.querySelector("#masteryMap");
  const entries = state.attemptLog || [];
  const totals = getMetricSummary(entries);
  if (!entries.length) {
    summary.textContent = "Cuando completes ejercicios, aqui veras aciertos reconocidos, respuestas parciales, repasos y dominios trabajados.";
    cards.innerHTML = "";
    map.innerHTML = '<p class="analytics-empty">Aun no hay evidencia suficiente para clasificar familias gramaticales o lexicas.</p>';
    return;
  }

  summary.textContent = `${totals.total} intentos registrados. Las coincidencias automaticas se separan de las respuestas abiertas confirmadas por ti.`;
  cards.innerHTML = [
    ["Aciertos", totals.correct, "Coincidencias automaticas de al menos el 80%."],
    ["Parciales", totals.partial, "Hay elementos reconocidos, pero no todos los esperados."],
    ["Confirmados", totals.manual, "Ejercicios abiertos que marcaste como entendidos."],
    ["A repasar", totals.review, "Contenidos que decidiste volver a trabajar."]
  ].map(([label, value, note]) => `<div class="analytics-card"><strong>${value}</strong><span>${label}</span><small>${note}</small></div>`).join("");

  const grouped = { grammar: new Map(), lexical: new Map() };
  entries.forEach((entry) => {
    [["grammar", entry.domains?.grammarFamily], ["lexical", entry.domains?.lexicalFamily]].forEach(([kind, name]) => {
      if (!name) return;
      const current = grouped[kind].get(name) || [];
      current.push(entry);
      grouped[kind].set(name, current);
    });
  });
  const renderFamily = (title, kind) => {
    const rows = [...grouped[kind].entries()]
      .map(([name, familyEntries]) => ({ name, metric: getMetricSummary(familyEntries), terms: [...new Set(familyEntries.flatMap((entry) => entry.domains?.terms || []))].slice(0, 6) }))
      .sort((left, right) => right.metric.review - left.metric.review || left.metric.correct - right.metric.correct);
    return `<section class="family-section"><h4>${title}</h4>${rows.map((row) => `<div class="family-row"><strong>${row.name}</strong><span>${metricLabel(row.metric)}</span><small>${row.terms.length ? `Terminos: ${row.terms.join(" · ")}` : "Sin terminos asociados."}</small></div>`).join("")}</section>`;
  };
  map.innerHTML = `<p class="analytics-note">Cada termino hereda la evidencia del ejercicio donde aparece: sirve para orientar el repaso, no para afirmar que una palabra aislada esta dominada.</p>${renderFamily("Familias gramaticales", "grammar")}${renderFamily("Familias lexicas", "lexical")}`;
}

function getCurrentExercise() {
  return (state.currentExerciseId === "renshuu-bridge" ? state.renshuuBridge : null)
    || exercises.find((exercise) => exercise.id === state.currentExerciseId)
    || exercises.find((exercise) => state.dailyPlan.exerciseIds.includes(exercise.id) && !(state.dailyPlan.skippedIds || []).includes(exercise.id))
    || exercises[0];
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function levelRank(level) {
  return ["N5", "N4", "N3", "N2", "N1"].indexOf(level);
}

function getAvailableCurriculumStages() {
  const targetLevel = state.settings.targetJlpt || "N4";
  return curriculumStages.filter((stage) => levelRank(stage.level) <= levelRank(targetLevel));
}

function isReviewDue(history) {
  return Boolean(history?.nextReviewAt && new Date(history.nextReviewAt).getTime() <= Date.now());
}

function getReviewSchedule(history, confidence, objective) {
  const now = new Date();
  if (confidence === "review") {
    now.setDate(now.getDate() + 1);
    return { nextReviewAt: now.toISOString(), reviewIntervalDays: 1 };
  }
  const previous = Number(history?.reviewIntervalDays) || 0;
  const factor = objective !== null && objective < 80 ? 1.5 : 2;
  const interval = previous ? Math.min(60, Math.max(1, Math.round(previous * factor))) : 1;
  now.setDate(now.getDate() + interval);
  return { nextReviewAt: now.toISOString(), reviewIntervalDays: interval };
}

function getStageEvidence(stage) {
  const confirmed = new Set((state.attemptLog || [])
    .filter((entry) => stage.exerciseIds.includes(entry.exerciseId) && entry.outcome !== "review")
    .map((entry) => entry.exerciseId));
  const pendingReviews = stage.exerciseIds.filter((id) => {
    const history = state.exerciseHistory[id];
    return history?.status === "review" || isReviewDue(history);
  });
  return { confirmedCount: confirmed.size, pendingReviews, complete: confirmed.size >= stage.exerciseIds.length };
}

function getCurrentCurriculumStage() {
  const stages = getAvailableCurriculumStages();
  return stages.find((stage) => !getStageEvidence(stage).complete) || null;
}

function getCurriculumCandidates(excludedIds = []) {
  const stages = getAvailableCurriculumStages();
  const current = getCurrentCurriculumStage();
  const reviewIds = stages.flatMap((stage) => getStageEvidence(stage).pendingReviews).filter((id) => !excludedIds.includes(id));
  const themeFocus = state.settings.themeFocus || "balanced";
  const unlockedLevel = current?.level || state.settings.targetJlpt || "N5";
  const isAvailableSupplement = (exercise) => {
    const history = state.exerciseHistory[exercise.id] || {};
    return history.status !== "solid" || isReviewDue(history);
  };
  const thematicIds = themeFocus === "balanced" ? [] : exercises
    .filter((exercise) => !exercise.core && exercise.theme === themeFocus && levelRank(exercise.level) <= levelRank(unlockedLevel))
    .filter((exercise) => !excludedIds.includes(exercise.id) && isAvailableSupplement(exercise))
    .map((exercise) => exercise.id);
  const supplementalIds = ["kanji", "listening"].includes(state.settings.studyFocus)
    ? exercises
      .filter((exercise) => !exercise.core && exercise.tags.includes(state.settings.studyFocus) && levelRank(exercise.level) <= levelRank(unlockedLevel))
      .filter((exercise) => !excludedIds.includes(exercise.id) && isAvailableSupplement(exercise))
      .map((exercise) => exercise.id)
    : [];
  const continuationIds = !current ? exercises
    .filter((exercise) => !exercise.core && levelRank(exercise.level) <= levelRank(unlockedLevel))
    .filter((exercise) => !excludedIds.includes(exercise.id) && isAvailableSupplement(exercise))
    .map((exercise) => exercise.id)
    : [];
  if (!current) {
    return [...new Set([...reviewIds, ...thematicIds, ...supplementalIds, ...continuationIds])].map((id) => exercises.find((exercise) => exercise.id === id)).filter(Boolean);
  }
  const newIds = current.exerciseIds.filter((id) => !excludedIds.includes(id) && state.exerciseHistory[id]?.status !== "solid");
  return [...new Set([...reviewIds, ...newIds, ...thematicIds, ...supplementalIds])]
    .map((id) => exercises.find((exercise) => exercise.id === id))
    .filter(Boolean);
}

function ensureDailyPlan() {
  if (!exercises.length) return;
  if (state.dailyPlan.date === todayKey() && state.dailyPlan.exerciseIds.length) {
    reconcileDailyPlan();
    return;
  }
  const count = state.settings.dailyMinutes <= 6 ? 2 : state.settings.dailyMinutes <= 15 ? 3 : 4;
  const ids = getRecommendedExercises(count).map((item) => item.id);
  state.dailyPlan = { date: todayKey(), exerciseIds: ids, completedIds: [], skippedIds: [] };
  state.currentExerciseId = ids[0];
  saveState();
}

function reconcileDailyPlan() {
  const plan = state.dailyPlan;
  const allowedIds = new Set(getCurriculumCandidates().map((exercise) => exercise.id));
  const seenIds = new Set();
  const stableIds = plan.exerciseIds.filter((id) => {
    if (seenIds.has(id)) return false;
    seenIds.add(id);
    return id === "renshuu-bridge" || plan.completedIds.includes(id) || plan.skippedIds.includes(id) || allowedIds.has(id);
  });
  if (stableIds.length === plan.exerciseIds.length) return;
  const desiredCount = state.settings.dailyMinutes <= 6 ? 2 : state.settings.dailyMinutes <= 15 ? 3 : 4;
  const replacementIds = getRecommendedExercises(Math.max(0, desiredCount - stableIds.length), stableIds).map((exercise) => exercise.id);
  plan.exerciseIds = [...stableIds, ...replacementIds.filter((id) => !stableIds.includes(id))];
  plan.completedIds = plan.completedIds.filter((id) => plan.exerciseIds.includes(id));
  plan.skippedIds = plan.skippedIds.filter((id) => plan.exerciseIds.includes(id));
  if (!plan.exerciseIds.includes(state.currentExerciseId) || plan.completedIds.includes(state.currentExerciseId) || plan.skippedIds.includes(state.currentExerciseId)) {
    state.currentExerciseId = plan.exerciseIds.find((id) => !plan.completedIds.includes(id) && !plan.skippedIds.includes(id)) || "";
  }
  saveState();
}

function getRecommendedExercises(count = 1, excludedIds = [], preferredTags = []) {
  const targetLevel = state.settings.targetJlpt || "N4";
  const target = jlptTargets[targetLevel];
  const focus = state.settings.studyFocus;
  const candidates = getCurriculumCandidates(excludedIds)
    .sort((left, right) => scorePlanExercise(left, target, focus, preferredTags) - scorePlanExercise(right, target, focus, preferredTags))
  const review = candidates.filter((item) => {
    const history = state.exerciseHistory[item.id];
    return history?.status === "review" || isReviewDue(history);
  }).slice(0, 1);
  const nextBlock = candidates.filter((item) => {
    const history = state.exerciseHistory[item.id];
    return history?.status !== "review" && !isReviewDue(history);
  });
  const core = nextBlock.filter((item) => item.core);
  const themed = nextBlock.filter((item) => !item.core);
  const ordered = state.settings.themeFocus !== "balanced" && themed.length
    ? [...core.slice(0, 1), ...themed, ...core.slice(1)]
    : nextBlock;
  return [...review, ...ordered].slice(0, count);
}

function scorePlanExercise(exercise, target, focus, preferredTags = []) {
  const history = state.exerciseHistory[exercise.id] || {};
  const weakness = exercise.tags.reduce((sum, tag) => sum + ((state.progress[tag] || 0) / (target[tag] || 1)), 0) / exercise.tags.length;
  const preferred = exercise.tags.some((tag) => preferredTags.includes(tag)) ? -1.2 : 0;
  const themeBoost = state.settings.themeFocus !== "balanced" && exercise.theme === state.settings.themeFocus ? -1.5 : 0;
  const focusBoost = focus === "daily"
    ? (dailyThemes.has(exercise.theme) ? -0.5 : 0)
    : (focus !== "balanced" && exercise.tags.includes(focus) ? -0.5 : 0);
  const mainGoalBoost = state.settings.mainGoal === "work"
    ? (exercise.tags.includes("work") ? -0.35 : 0)
    : state.settings.mainGoal === "daily" && dailyThemes.has(exercise.theme) ? -0.35 : 0;
  return weakness + preferred + themeBoost + focusBoost + mainGoalBoost + ((history.status === "review" || isReviewDue(history)) ? -1 : 0) + (history.attempts || 0) * 0.08;
}

function getPlanItem(id) {
  return id === "renshuu-bridge" ? state.renshuuBridge : exercises.find((exercise) => exercise.id === id);
}

function getNextActivePlanExerciseId(currentId) {
  const activeIds = state.dailyPlan.exerciseIds.filter((id) => !(state.dailyPlan.skippedIds || []).includes(id) && !state.dailyPlan.completedIds.includes(id));
  if (!activeIds.length) return "";
  const index = activeIds.indexOf(currentId);
  return activeIds[(index + 1 + activeIds.length) % activeIds.length];
}

function getPlanRecommendation(item) {
  const history = state.exerciseHistory[item.id] || {};
  if (history.status === "review" || isReviewDue(history)) return "Repaso vencido";
  if (state.settings.studyFocus === "daily" && dailyThemes.has(item.theme)) return "Tu foco de estudio";
  if (state.settings.studyFocus !== "balanced" && item.tags.includes(state.settings.studyFocus)) return "Tu foco de estudio";
  if (state.settings.mainGoal === "work" && item.tags.includes("work")) return "Tu objetivo profesional";
  if (state.settings.mainGoal === "daily" && dailyThemes.has(item.theme)) return "Tu objetivo de vida diaria";
  const weakestTag = [...item.tags].sort((left, right) => (state.progress[left] || 0) - (state.progress[right] || 0))[0];
  return `Refuerza ${skills.find((skill) => skill.id === weakestTag)?.label?.toLowerCase() || "una habilidad"}`;
}

function replacePlanExercise(id) {
  const plan = state.dailyPlan;
  if (plan.completedIds.includes(id)) return;
  const replacement = getRecommendedExercises(1, plan.exerciseIds.concat(plan.skippedIds || []));
  if (!replacement.length) return;
  plan.exerciseIds[plan.exerciseIds.indexOf(id)] = replacement[0].id;
  if (state.currentExerciseId === id) state.currentExerciseId = replacement[0].id;
  saveState();
  renderDailyPlan();
  renderExercise();
}

function skipPlanExercise(id) {
  const plan = state.dailyPlan;
  if (plan.completedIds.includes(id)) return;
  if (!plan.skippedIds.includes(id)) plan.skippedIds.push(id);
  if (state.currentExerciseId === id) {
    state.currentExerciseId = plan.exerciseIds.find((itemId) => !plan.skippedIds.includes(itemId) && !plan.completedIds.includes(itemId)) || "";
  }
  saveState();
  renderDailyPlan();
  if (state.currentExerciseId) renderExercise();
}

function addRecommendedPlanExercise(preferredTags = []) {
  const plan = state.dailyPlan;
  const extra = getRecommendedExercises(1, plan.exerciseIds.concat(plan.skippedIds || []), preferredTags);
  if (!extra.length) return;
  plan.exerciseIds.push(extra[0].id);
  saveState();
}

function renderDailyPlan() {
  ensureDailyPlan();
  const plan = state.dailyPlan;
  const activeIds = plan.exerciseIds.filter((id) => !(plan.skippedIds || []).includes(id));
  const completedCount = plan.completedIds.filter((id) => activeIds.includes(id)).length;
  document.querySelector("#planCount").textContent = completedCount + " / " + activeIds.length;
  const focusText = { balanced: "equilibrar tus habilidades", work: "situaciones de empresa", daily: "vida diaria", writing: "producción escrita", grammar: "gramática y partículas" }[state.settings.studyFocus] || "equilibrar tus habilidades";
  const themeText = themes[state.settings.themeFocus || "balanced"] || themes.balanced;
  document.querySelector("#planReason").textContent = "Plan para " + focusText + ", con temática " + themeText.toLowerCase() + " y ajustado a tu objetivo " + state.settings.targetJlpt + ".";
  const currentStage = getCurrentCurriculumStage();
  const stageEvidence = currentStage ? getStageEvidence(currentStage) : null;
  document.querySelector("#curriculumStatus").textContent = currentStage
    ? `Bloque actual: ${currentStage.label} (${stageEvidence.confirmedCount}/${currentStage.exerciseIds.length} confirmados). ${stageEvidence.pendingReviews.length ? `${stageEvidence.pendingReviews.length} repaso${stageEvidence.pendingReviews.length === 1 ? "" : "s"} pendiente${stageEvidence.pendingReviews.length === 1 ? "" : "s"}.` : "Al completar el bloque, se desbloquea el siguiente."}`
    : "Has terminado los bloques disponibles para tu objetivo. Sube el objetivo JLPT para continuar con el siguiente nivel o usa los repasos pendientes.";
  document.querySelector("#planSteps").innerHTML = activeIds.map((id, index) => {
    const item = getPlanItem(id);
    const done = plan.completedIds.includes(id);
    return '<button class="plan-step ' + (done ? "done" : "") + ' ' + (id === state.currentExerciseId ? "current" : "") + '" data-plan-exercise="' + id + '"><span>' + (done ? "✓" : index + 1) + "</span><strong>" + item.type + "</strong><small>" + item.level + "</small></button>";
  }).join("");
  document.querySelectorAll("[data-plan-exercise]").forEach((button) => {
    const id = button.dataset.planExercise;
    const item = getPlanItem(id);
    button.querySelector("small").textContent = `${getPlanRecommendation(item)} · ${item.level}`;
    button.querySelector("small").textContent += " · " + (themes[item.theme] || "Vida diaria");
    if (plan.completedIds.includes(id)) return;
    const row = document.createElement("div");
    row.className = "plan-step-row";
    const actions = document.createElement("div");
    actions.className = "plan-step-actions";
    actions.innerHTML = `<button class="plan-icon-button" data-replace-exercise="${id}" aria-label="Sustituir ejercicio" data-tooltip="Sustituye este ejercicio por otra recomendacion. No cambia tu progreso.">↻</button><button class="plan-icon-button" data-skip-exercise="${id}" aria-label="Saltar ejercicio" data-tooltip="Quita este ejercicio de la sesion de hoy. No cambia tu progreso.">↷</button>`;
    actions.querySelectorAll("[data-tooltip]").forEach((element) => element.addEventListener("touchstart", () => {
      element.classList.add("show-tooltip");
      window.setTimeout(() => element.classList.remove("show-tooltip"), 1800);
    }, { passive: true }));
    button.before(row);
    row.append(button, actions);
  });
  document.querySelectorAll("[data-plan-exercise]").forEach((button) => button.addEventListener("click", () => {
    state.currentExerciseId = button.dataset.planExercise;
    saveState();
    switchView("practice");
    renderExercise();
  }));
  document.querySelectorAll("[data-replace-exercise]").forEach((button) => button.addEventListener("click", () => replacePlanExercise(button.dataset.replaceExercise)));
  document.querySelectorAll("[data-skip-exercise]").forEach((button) => button.addEventListener("click", () => skipPlanExercise(button.dataset.skipExercise)));
}

function renderExercise() {
  ensureDailyPlan();
  const exercise = getCurrentExercise();
  if (!exercise) return;
  document.querySelector("#exerciseType").textContent = exercise.type;
  setJapaneseText(document.querySelector("#exercisePrompt"), exercise.audioText ? "Escucha y responde al enunciado." : exercise.prompt);
  document.querySelector("#listenPromptButton").classList.toggle("hidden", !exercise.audioText);
  document.querySelector("#answerInput").value = state.draftAnswers[exercise.id] || "";
  const themeLabel = themes[exercise.theme] || "Vida diaria";
  document.querySelector("#practiceMeta").textContent = [exercise.level, themeLabel, ...exercise.tags.map((tag) => skills.find((skill) => skill.id === tag)?.label || tag)].join(" · ");
  document.querySelector("#contextHelp").innerHTML = exercise.help.map((item) => '<button class="term-helper" data-dictionary-term="' + item.text + '"><strong>' + item.text + "</strong><span>" + item.reading + "</span><small>" + item.meaning + " · " + item.level + " · " + (themes[item.theme] || "Vida diaria") + "</small></button>").join("") + "<p>" + exercise.explanation + "</p>";
  document.querySelector("#contextHelp").classList.add("hidden");
  document.querySelector("#helpToggle").setAttribute("aria-expanded", "false");
  document.querySelector("#feedbackPanel").classList.add("hidden");
}

function speakJapanese(text) {
  if (!("speechSynthesis" in window)) {
    window.alert("Este navegador no permite reproducir la lectura japonesa.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
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
  const previousHistory = state.exerciseHistory[exercise.id] || {};
  const checkedScore = result.objective ?? 50;
  const gain = confidence === "solid" ? Math.max(2, Math.round(checkedScore / 25)) : 1;
  const domains = getExerciseDomains(exercise);
  const schedule = getReviewSchedule(previousHistory, confidence, result.objective);
  exercise.tags.forEach((tag) => {
    state.progress[tag] = (state.progress[tag] || 0) + gain;
  });
  state.exerciseHistory[exercise.id] = {
    attempts: (previousHistory.attempts || 0) + 1,
    status: confidence,
    lastAttempted: new Date().toISOString(),
    ...schedule
  };
  state.attemptLog.push({
    exerciseId: exercise.id,
    at: new Date().toISOString(),
    outcome: getAttemptOutcome(result, confidence),
    objective: result.objective,
    domains
  });
  const unfinishedCount = state.dailyPlan.exerciseIds.filter((id) => !(state.dailyPlan.skippedIds || []).includes(id) && !state.dailyPlan.completedIds.includes(id)).length;
  if (confidence === "review" && unfinishedCount < 4) {
    addRecommendedPlanExercise(exercise.tags);
  }
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
  document.querySelector("#backFromSkillDetailButton").addEventListener("click", () => switchView("today"));
  document.querySelector("#jlptLevelSelect").addEventListener("change", drawRadar);
  document.querySelector("#jlptRadar").addEventListener("click", (event) => {
    const skill = getRadarSkillAtPosition(event);
    if (skill) openSkillDetail(skill.id);
  });
  document.querySelector("#syncRenshuuButton").addEventListener("click", syncRenshuuProgress);
  document.querySelector("#startBridgeButton").addEventListener("click", startRenshuuBridge);
  document.querySelector("#addPlanExerciseButton").addEventListener("click", () => {
    addRecommendedPlanExercise();
    renderDailyPlan();
  });
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
    state.currentExerciseId = getNextActivePlanExerciseId(state.currentExerciseId);
    saveState();
    renderExercise();
  });

  document.querySelector("#helpToggle").addEventListener("click", () => {
    const help = document.querySelector("#contextHelp");
    const isHidden = help.classList.toggle("hidden");
    document.querySelector("#helpToggle").setAttribute("aria-expanded", String(!isHidden));
  });

  document.querySelector("#listenPromptButton").addEventListener("click", () => {
    const exercise = getCurrentExercise();
    if (exercise?.audioText) speakJapanese(exercise.audioText);
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
        state.currentExerciseId = getNextActivePlanExerciseId(exercise.id);
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
    state.settings.themeFocus = document.querySelector("#themeFocus").value;
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

  document.querySelector("#cloudSignInButton").addEventListener("click", () => submitCloudAccount("signin"));
  document.querySelector("#cloudSignUpButton").addEventListener("click", () => submitCloudAccount("signup"));
  document.querySelector("#cloudSignOutButton").addEventListener("click", signOutCloudAccount);

  document.querySelector("#exportProfileButton").addEventListener("click", exportActiveProfile);
  document.querySelector("#importProfileInput").addEventListener("change", (event) => {
    importProfile(event.target.files[0]);
    event.target.value = "";
  });
  document.querySelector("#deleteProfileButton").addEventListener("click", deleteActiveProfile);

  document.querySelector("#installAppButton").addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    document.querySelector("#installAppButton").classList.add("hidden");
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
  document.querySelector("#themeFocus").value = state.settings.themeFocus || "balanced";
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
  refreshCloudAccount().catch(() => setCloudStatus("No se pudo comprobar la cuenta ahora mismo."));
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.querySelector("#installAppButton")?.classList.remove("hidden");
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  document.querySelector("#installAppButton")?.classList.add("hidden");
});

function renderDictionary(query = "") {
  const normalized = normalizeAnswer(query);
  const matches = embeddedDictionary.filter((item) => !normalized || [item.text, item.reading, item.meaning].some((value) => normalizeAnswer(value).includes(normalized))).slice(0, 10);
  document.querySelector("#dictionaryResults").innerHTML = matches.map((item) => {
    const metadata = [item.jlptLevels?.join("/"), item.themes?.map((theme) => themes[theme]).join(", ")].filter(Boolean).join(" · ");
    return '<button class="dictionary-row" data-insert-dictionary="' + item.text + '"><strong>' + item.text + "</strong><span>" + item.reading + "</span><small>" + item.meaning + (metadata ? " · " + metadata : "") + (item.note ? " · " + item.note : "") + "</small></button>";
  }).join("") || '<p class="muted">No hay coincidencias aún.</p>';
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
    navigator.serviceWorker.register("service-worker.js?v=0.7.1").catch(() => {
      // La app sigue funcionando en navegadores que no permiten cache offline.
    });
  });
}
