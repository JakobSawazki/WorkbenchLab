(() => {
  "use strict";

  const content = window.WORKBENCH_CONTENT;
  const storageKey = "workbenchlab-v1";
  const themeStorageKey = "workbenchlab-theme-v1";
  const backupAppId = "WorkbenchLab";
  const backupFormatVersion = 1;
  const sqlAssetBase = "vendor/sql.js/";

  const main = document.querySelector("#mainContent");
  const sidebar = document.querySelector("#sidebar");
  const backdrop = document.querySelector("#mobileBackdrop");
  const profileDialog = document.querySelector("#profileDialog");
  const profileForm = document.querySelector("#profileForm");
  const profileName = document.querySelector("#profileName");
  const backupDialog = document.querySelector("#backupDialog");
  const progressFileInput = document.querySelector("#progressFileInput");
  const runtimeChip = document.querySelector("#runtimeChip");
  const runtimeText = document.querySelector("#runtimeText");
  const themeToggleButton = document.querySelector("#themeToggleButton");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const defaultState = {
    name: "",
    completedLessons: [],
    completedPractices: [],
    completedCommands: [],
    drafts: {},
    slotDrafts: {},
    activityDates: [],
    lastLessonId: "warum-datenbanken"
  };

  const levels = [
    { min: 0, title: "Tabellenstarter" },
    { min: 120, title: "SELECT-Finder" },
    { min: 280, title: "Modellierer" },
    { min: 480, title: "Join-Profi" },
    { min: 720, title: "Normalform-Prüfer" },
    { min: 1000, title: "Datenbank-Architekt" }
  ];

  let state = loadState();
  let practiceFilter = "all";
  let SQLRuntime = null;
  let sqlReadyPromise = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function inlineCode(value) {
    return escapeHtml(value).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function uniqueAllowedStrings(values, allowedIds) {
    if (!Array.isArray(values)) {
      return [];
    }
    return [...new Set(values.filter((value) => typeof value === "string" && allowedIds.has(value)))];
  }

  function lessonById(id) {
    return content.lessons.find((lesson) => lesson.id === id);
  }

  function moduleById(id) {
    return content.modules.find((module) => module.id === id);
  }

  function practiceById(id) {
    return content.practices.find((practice) => practice.id === id);
  }

  function commandById(id) {
    return content.commands.find((command) => command.id === id);
  }

  function practiceKind(practice) {
    if (practice.type === "sql") {
      return "SQL";
    }
    if (practice.type === "slots") {
      return "Modell";
    }
    return "Check";
  }

  function difficultyLabel(value) {
    return { easy: "Grundlage", medium: "Vertiefung", plus: "Abitur-Plus" }[value] || value;
  }

  function normalizeState(candidate = {}) {
    const lessonIds = new Set(content.lessons.map((lesson) => lesson.id));
    const practiceIds = new Set(content.practices.map((practice) => practice.id));
    const commandIds = new Set(content.commands.map((command) => command.id));
    const completedLessons = uniqueAllowedStrings(candidate.completedLessons, lessonIds);
    const completedPractices = uniqueAllowedStrings(candidate.completedPractices, practiceIds);
    const completedCommands = uniqueAllowedStrings(candidate.completedCommands, commandIds);
    const drafts = {};
    const slotDrafts = {};

    Object.entries(candidate.drafts || {}).forEach(([id, value]) => {
      if (practiceIds.has(id) && typeof value === "string") {
        drafts[id] = value.slice(0, 100000);
      }
    });

    Object.entries(candidate.slotDrafts || {}).forEach(([id, value]) => {
      if (!practiceIds.has(id) || !value || typeof value !== "object") {
        return;
      }
      slotDrafts[id] = {};
      Object.entries(value).forEach(([slotId, answer]) => {
        if (typeof answer === "string") {
          slotDrafts[id][slotId] = answer.slice(0, 240);
        }
      });
    });

    return {
      ...defaultState,
      name: typeof candidate.name === "string" ? candidate.name.trim().slice(0, 18) : "",
      completedLessons,
      completedPractices,
      completedCommands,
      drafts,
      slotDrafts,
      activityDates: Array.isArray(candidate.activityDates)
        ? [...new Set(candidate.activityDates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)))].slice(-120)
        : [],
      lastLessonId: lessonIds.has(candidate.lastLessonId) ? candidate.lastLessonId : "warum-datenbanken"
    };
  }

  function stateXp(candidate = state) {
    const lessonXp = candidate.completedLessons.reduce((sum, id) => sum + (lessonById(id)?.xp || 0), 0);
    const practiceXp = candidate.completedPractices.reduce((sum, id) => sum + (practiceById(id)?.xp || 0), 0);
    const commandXp = candidate.completedCommands.reduce((sum, id) => sum + (commandById(id)?.xp || 0), 0);
    return lessonXp + practiceXp + commandXp;
  }

  function loadState() {
    try {
      const storedRaw = localStorage.getItem(storageKey);
      const stored = storedRaw ? JSON.parse(storedRaw) : null;
      return normalizeState(stored || {});
    } catch {
      return { ...defaultState };
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
    updateChrome();
  }

  function todayKey(date = new Date()) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function markActivity() {
    const today = todayKey();
    if (!state.activityDates.includes(today)) {
      state.activityDates.push(today);
      state.activityDates = state.activityDates.slice(-120);
    }
  }

  function streak() {
    const dates = new Set(state.activityDates);
    let count = 0;
    const cursor = new Date();
    while (dates.has(todayKey(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function currentLevel() {
    const xp = stateXp();
    let index = 0;
    levels.forEach((level, levelIndex) => {
      if (xp >= level.min) {
        index = levelIndex;
      }
    });
    const current = levels[index];
    const next = levels[index + 1];
    return {
      number: index + 1,
      title: current.title,
      currentMin: current.min,
      nextMin: next?.min ?? current.min,
      progress: next ? ((xp - current.min) / (next.min - current.min)) * 100 : 100
    };
  }

  function progressPercent(done, total) {
    return total ? Math.round((done / total) * 100) : 0;
  }

  function award(kind, id, xp) {
    const keyByKind = {
      lesson: "completedLessons",
      practice: "completedPractices",
      command: "completedCommands"
    };
    const key = keyByKind[kind];
    if (!key || state[key].includes(id)) {
      return false;
    }
    state[key].push(id);
    markActivity();
    saveState();
    toast(`+${xp} XP gesammelt`, "xp");
    return true;
  }

  function moduleProgress(module) {
    const done = module.lessonIds.filter((id) => state.completedLessons.includes(id)).length;
    return { done, total: module.lessonIds.length, percent: progressPercent(done, module.lessonIds.length) };
  }

  function nextLesson() {
    return content.lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) ||
      lessonById(state.lastLessonId) ||
      content.lessons.at(-1);
  }

  function nextPractice() {
    return content.practices.find((practice) => !state.completedPractices.includes(practice.id)) ||
      content.practices.at(-1);
  }

  function sqlPractices() {
    return content.practices.filter((practice) => practice.type === "sql");
  }

  function achievementUnlocked(achievement) {
    const condition = achievement.condition;
    if (condition.type === "lessons") {
      return state.completedLessons.length >= condition.value;
    }
    if (condition.type === "practices") {
      return state.completedPractices.length >= condition.value;
    }
    if (condition.type === "commands") {
      return state.completedCommands.length >= condition.value;
    }
    if (condition.type === "sqlPractices") {
      return sqlPractices().filter((practice) => state.completedPractices.includes(practice.id)).length >= condition.value;
    }
    if (condition.type === "practiceSet") {
      return condition.value.every((id) => state.completedPractices.includes(id));
    }
    if (condition.type === "allSqlPractices") {
      return sqlPractices().every((practice) => state.completedPractices.includes(practice.id));
    }
    if (condition.type === "xp") {
      return stateXp() >= condition.value;
    }
    if (condition.type === "all") {
      return state.completedLessons.length === content.lessons.length &&
        state.completedPractices.length === content.practices.length;
    }
    return false;
  }

  function readTheme() {
    try {
      return localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
    } catch {
      return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    }
  }

  function applyTheme(theme, persist = true) {
    const normalized = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = normalized;
    themeColorMeta?.setAttribute("content", normalized === "dark" ? "#111817" : "#123c40");
    if (themeToggleButton) {
      themeToggleButton.setAttribute("aria-pressed", String(normalized === "dark"));
      themeToggleButton.setAttribute("aria-label", normalized === "dark" ? "Light Mode aktivieren" : "Dark Mode aktivieren");
      themeToggleButton.title = normalized === "dark" ? "Light Mode aktivieren" : "Dark Mode aktivieren";
      themeToggleButton.innerHTML = `<i data-lucide="${normalized === "dark" ? "sun" : "moon"}"></i>`;
      renderIcons();
    }
    if (persist) {
      try {
        localStorage.setItem(themeStorageKey, normalized);
      } catch {}
    }
  }

  function toggleTheme() {
    applyTheme(readTheme() === "dark" ? "light" : "dark");
  }

  function setHeading(eyebrow, title) {
    document.querySelector("#viewEyebrow").textContent = eyebrow;
    document.querySelector("#viewTitle").textContent = title;
    document.title = `${title} · WorkbenchLab`;
  }

  function activateNav(route) {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.route === route);
    });
  }

  function closeMobileNav() {
    sidebar.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
  }

  function go(route) {
    window.location.hash = route;
    closeMobileNav();
  }

  function renderIcons() {
    window.lucide?.createIcons();
  }

  function updateChrome() {
    const xp = stateXp();
    const level = currentLevel();
    const displayName = state.name || "Gast";
    document.querySelector("#sidebarName").textContent = displayName;
    document.querySelector("#sidebarAvatar").textContent = displayName.slice(0, 1).toUpperCase();
    document.querySelector("#sidebarLevel").textContent = `Level ${level.number} · ${level.title}`;
    document.querySelector("#sidebarXpBar").style.width = `${Math.max(0, Math.min(100, level.progress))}%`;
    document.querySelector("#sidebarXpText").textContent = level.number === levels.length
      ? `${xp} XP · Höchstes Level`
      : `${xp} / ${level.nextMin} XP`;
    document.querySelector("#topXp").textContent = `${xp} XP`;
  }

  function lessonCard(lesson) {
    const completed = state.completedLessons.includes(lesson.id);
    return `
      <article class="lesson-card" tabindex="0" role="button" data-lesson="${lesson.id}" aria-label="${escapeHtml(lesson.title)} öffnen">
        <span class="lesson-state ${completed ? "is-done" : ""}">
          <i data-lucide="${completed ? "check" : "book-open"}"></i>
        </span>
        <span class="lesson-index">${escapeHtml(lesson.index)}</span>
        <h3>${escapeHtml(lesson.title)}</h3>
        <p>${escapeHtml(lesson.subtitle)}</p>
        <div class="lesson-meta">
          <span class="meta-pill"><i data-lucide="clock-3"></i>${lesson.duration} Min.</span>
          <span class="meta-pill difficulty-${lesson.difficulty}">${difficultyLabel(lesson.difficulty)}</span>
          <span class="meta-pill"><i data-lucide="sparkles"></i>${lesson.xp} XP</span>
        </div>
      </article>`;
  }

  function practiceCard(practice) {
    const completed = state.completedPractices.includes(practice.id);
    const lesson = lessonById(practice.lessonId);
    const icon = practice.type === "sql" ? "database" : practice.type === "slots" ? "network" : "circle-help";
    return `
      <article class="practice-card" tabindex="0" role="button" data-practice="${practice.id}" aria-label="${escapeHtml(practice.title)} öffnen">
        <span class="lesson-state ${completed ? "is-done" : ""}">
          <i data-lucide="${completed ? "check" : icon}"></i>
        </span>
        <span class="practice-kind"><i data-lucide="${icon}"></i>${practiceKind(practice)}</span>
        <h3>${escapeHtml(practice.title)}</h3>
        <p>${escapeHtml(practice.description)}</p>
        <div class="exercise-meta">
          <span class="meta-pill">${escapeHtml(lesson?.index || "")} · ${escapeHtml(lesson?.title || "BPE6")}</span>
          <span class="meta-pill difficulty-${practice.difficulty}">${difficultyLabel(practice.difficulty)}</span>
          <span class="meta-pill"><i data-lucide="sparkles"></i>${practice.xp} XP</span>
        </div>
      </article>`;
  }

  function commandCard(command) {
    const completed = state.completedCommands.includes(command.id);
    return `
      <article class="command-card" tabindex="0" role="button" data-command="${command.id}" aria-label="${escapeHtml(command.title)} öffnen">
        <span class="lesson-state ${completed ? "is-done" : ""}">
          <i data-lucide="${completed ? "check" : "square-terminal"}"></i>
        </span>
        <span class="command-category">${escapeHtml(command.category)}</span>
        <h3><code>${escapeHtml(command.title)}</code></h3>
        <p>${escapeHtml(command.short)}</p>
        <pre>${escapeHtml(command.syntax)}</pre>
        <div class="exercise-meta">
          <span class="meta-pill"><i data-lucide="sparkles"></i>${command.xp} XP</span>
        </div>
      </article>`;
  }

  function renderVisual(kind) {
    const visuals = {
      "database-need": `
        <div class="diagram-wrap">
          <div class="normalform-flow">
            <div class="normalform-step"><strong>Liste</strong><br><span class="tiny-note">schnell, aber schwer konsistent zu halten</span></div>
            <div class="normalform-step"><strong>Datenbank</strong><br><span class="tiny-note">Regeln, Beziehungen und wiederholbare Abfragen</span></div>
            <div class="normalform-step"><strong>Auswertung</strong><br><span class="tiny-note">SELECT, JOIN, GROUP BY, HAVING</span></div>
          </div>
        </div>`,
      "relation-table": `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr><th>schuelernr</th><th>nachname</th><th>vorname</th><th>ort</th></tr></thead>
            <tbody><tr><td>1</td><td>Keller</td><td>Mia</td><td>Stuttgart</td></tr><tr><td>2</td><td>Yilmaz</td><td>Cem</td><td>Esslingen</td></tr></tbody>
          </table>
        </div>`,
      "er-simple": `
        <div class="diagram-wrap er-diagram">
          <div class="entity-box"><strong>Fahrschüler</strong><span>schuelernr PK</span><span>nachname</span><span>vorname</span></div>
          <div class="relationship">wohnt in · 1:N</div>
          <div class="entity-box"><strong>Ort</strong><span>ortnr PK</span><span>plz</span><span>ort</span></div>
        </div>`,
      "workbench-flow": `
        <div class="diagram-wrap workflow-diagram" aria-label="Ablauf von MySQL bis zur Ergebniskontrolle">
          <div class="workflow-node"><i data-lucide="power"></i><strong>MySQL</strong><span>Dienst läuft</span></div>
          <i class="workflow-arrow" data-lucide="arrow-right"></i>
          <div class="workflow-node"><i data-lucide="panels-top-left"></i><strong>Workbench</strong><span>Verbindung offen</span></div>
          <i class="workflow-arrow" data-lucide="arrow-right"></i>
          <div class="workflow-node"><i data-lucide="network"></i><strong>Modell</strong><span>Forward Engineer</span></div>
          <i class="workflow-arrow" data-lucide="arrow-right"></i>
          <div class="workflow-node"><i data-lucide="badge-check"></i><strong>Prüfen</strong><span>SELECT ausführen</span></div>
        </div>`,
      "query-patterns": `
        <div class="diagram-wrap query-patterns" aria-label="SQL-Filtermuster">
          <div><code>LIKE 'K%'</code><span>Keller · Klein</span></div>
          <div><code>IN (...)</code><span>Stuttgart · Esslingen</span></div>
          <div><code>BETWEEN 5 AND 15</code><span>Grenzen eingeschlossen</span></div>
        </div>`,
      "date-functions": `
        <div class="diagram-wrap date-function-visual" aria-label="Datumsfunktionen">
          <div class="date-value"><span>2008</span><small>YEAR</small></div>
          <div class="date-separator">-</div>
          <div class="date-value"><span>03</span><small>MONTH</small></div>
          <div class="date-separator">-</div>
          <div class="date-value"><span>12</span><small>DAY</small></div>
        </div>`,
      "foreign-key": `
        <div class="diagram-wrap er-diagram">
          <div class="entity-box"><strong>fahrschueler</strong><span>schuelernr PK</span><span>ortnr FK</span></div>
          <div class="relationship">verweist auf</div>
          <div class="entity-box"><strong>orte</strong><span>ortnr PK</span><span>plz</span><span>ort</span></div>
        </div>`,
      "mn-resolution": `
        <div class="diagram-wrap er-diagram">
          <div class="entity-box"><strong>fahrschueler</strong><span>schuelernr PK</span></div>
          <div class="relationship">1:N</div>
          <div class="entity-box"><strong>fahrstunden</strong><span>fahrstundennr PK</span><span>schuelernr FK</span><span>fahrlehrernr FK</span></div>
          <div class="relationship">N:1</div>
          <div class="entity-box"><strong>fahrlehrer</strong><span>fahrlehrernr PK</span></div>
        </div>`,
      redundancy: `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr><th>nachname</th><th>plz</th><th>ort</th></tr></thead>
            <tbody><tr><td>Keller</td><td>70173</td><td>Stuttgart</td></tr><tr><td>Novak</td><td>70173</td><td>Stuttgart</td></tr><tr><td>Klein</td><td>70173</td><td>Stuttgart</td></tr></tbody>
          </table>
        </div>`,
      "normalform-flow": `
        <div class="diagram-wrap normalform-flow">
          <div class="normalform-step"><strong>1NF</strong><br><span class="tiny-note">atomare Werte, keine Listen in Zellen</span></div>
          <div class="normalform-step"><strong>2NF</strong><br><span class="tiny-note">abhängig vom ganzen zusammengesetzten Schlüssel</span></div>
          <div class="normalform-step"><strong>3NF</strong><br><span class="tiny-note">keine Abhängigkeit zwischen Nicht-Schlüsselattributen</span></div>
        </div>`,
      "big-data-balance": `
        <div class="diagram-wrap">
          <div class="card-grid two">
            <div class="definition-card"><h3>Chancen</h3><p>Planung, Medizin, Energie, Sicherheit, Forschung.</p></div>
            <div class="definition-card"><h3>Risiken</h3><p>Profile, Manipulation, Diskriminierung, Kontrollverlust.</p></div>
          </div>
        </div>`
    };
    return visuals[kind] || "";
  }

  function renderToolVisual(kind) {
    const visuals = {
      stick: `
        <div class="tool-illustration stick-art" role="img" aria-label="Illustration des Informatik-Stick-Startfensters">
          <div class="stick-device">
            <i data-lucide="usb"></i>
            <div><strong>Informatik-Stick</strong><span>Schultasche BW · 2025</span></div>
          </div>
          <div class="stick-launcher">
            <div class="play-disc"><i data-lucide="play"></i></div>
            <strong>Start</strong>
            <span>Programme öffnen</span>
          </div>
        </div>`,
      "mysql-service": `
        <div class="tool-illustration launcher-art" role="img" aria-label="Illustration des laufenden MySQL-Dienstes im Informatik-Stick">
          <div class="mock-window-bar"><span></span><span></span><span></span><strong>Informatik-Stick</strong></div>
          <div class="launcher-body">
            <div class="launcher-category"><i data-lucide="folder"></i><span>Datenbank</span><small>MariaDB</small></div>
            <div class="launcher-list">
              <div class="launcher-row is-active"><i data-lucide="power"></i><strong>MySQL starten</strong><span>Dienst aktiv</span></div>
              <div class="launcher-row"><i data-lucide="database"></i><strong>MySQL Workbench 8.0.21</strong><span>danach öffnen</span></div>
              <div class="service-status"><i data-lucide="check-circle-2"></i><span>Server bereit für Verbindungen</span></div>
            </div>
          </div>
        </div>`,
      workbench: `
        <div class="tool-illustration workbench-art" role="img" aria-label="Illustration eines eERM-Modells in MySQL Workbench">
          <div class="mock-window-bar"><span></span><span></span><span></span><strong>MySQL Workbench · EER Diagram</strong></div>
          <div class="workbench-toolbar"><i data-lucide="mouse-pointer-2"></i><i data-lucide="table-2"></i><i data-lucide="git-branch"></i><i data-lucide="play"></i><span>Forward Engineer</span></div>
          <div class="workbench-canvas">
            <div class="model-table table-parent"><strong><i data-lucide="table-2"></i> orte</strong><span><b>PK</b> ortnr</span><span>plz</span><span>ort</span></div>
            <div class="model-relation"><span>1</span><i data-lucide="move-right"></i><span>N</span></div>
            <div class="model-table table-child"><strong><i data-lucide="table-2"></i> fahrschueler</strong><span><b>PK</b> schuelernr</span><span>nachname</span><span><b>FK</b> ortnr</span></div>
          </div>
        </div>`
    };
    return visuals[kind] || "";
  }

  function renderHome() {
    setHeading("Deine Datenbankzentrale", "Übersicht");
    activateNav("home");
    const lesson = nextLesson();
    const practice = nextPractice();
    const lessonProgress = progressPercent(state.completedLessons.length, content.lessons.length);
    const practiceProgress = progressPercent(state.completedPractices.length, content.practices.length);
    const unlocked = content.achievements.filter(achievementUnlocked).length;
    main.innerHTML = `
      <section class="hero-band">
        <div class="hero-content">
          <p class="eyebrow">J1 · BPE6 · 30 Stunden</p>
          <h2>${state.name ? `Weiter geht's, ${escapeHtml(state.name)}.` : "Modellieren. Abfragen. Begründen."}</h2>
          <p>WorkbenchLab begleitet dich von der realen Situation über eERM und Relationenmodell bis zu SQL-Abfragen, Normalisierung und Big-Data-Bewertung. Jede Einheit endet mit einer prüfbaren Aufgabe und XP.</p>
          <div class="hero-actions">
            <button class="button button-primary" type="button" data-lesson="${lesson.id}">
              <i data-lucide="play"></i>
              ${state.completedLessons.length ? "Weiterlernen" : "Lernpfad starten"}
            </button>
            <button class="button button-secondary" type="button" data-practice="${practice.id}">
              <i data-lucide="database"></i>
              Nächste Übung
            </button>
            <button class="button button-ghost" type="button" data-route="reference">
              Quellen und Werkzeuge
            </button>
          </div>
        </div>
        <div class="hero-visual" aria-label="Datenbankmodell">
          <div class="db-board">
            <div class="db-table-mini">
              <strong><i data-lucide="table"></i> fahrschueler</strong>
              <span>schuelernr PK</span>
              <span>nachname</span>
              <span>ortnr FK</span>
            </div>
            <div class="relation-line">1 : N</div>
            <div class="db-table-mini">
              <strong><i data-lucide="table"></i> orte</strong>
              <span>ortnr PK</span>
              <span>plz</span>
              <span>ort</span>
            </div>
          </div>
        </div>
      </section>

      <section class="stat-strip" aria-label="Lernstand">
        <div class="stat-card"><strong>${stateXp()}</strong><small>XP gesammelt</small></div>
        <div class="stat-card"><strong>${lessonProgress}%</strong><small>Lektionen abgeschlossen</small></div>
        <div class="stat-card"><strong>${practiceProgress}%</strong><small>Übungen gelöst</small></div>
        <div class="stat-card"><strong>${unlocked}/${content.achievements.length}</strong><small>Erfolge freigeschaltet</small></div>
      </section>

      <div class="section-heading">
        <div>
          <p class="eyebrow">Dein nächster Schritt</p>
          <h2>${escapeHtml(lesson.title)}</h2>
          <p>${escapeHtml(lesson.subtitle)}</p>
        </div>
      </div>
      <div class="card-grid two">
        ${lessonCard(lesson)}
        ${practiceCard(practice)}
      </div>

      <div class="section-heading">
        <div>
          <p class="eyebrow">BPE6-Landkarte</p>
          <h2>Vom Modell zur Abfrage</h2>
          <p>Die Einheiten folgen den BPE6-Kompetenzen und den lokalen Lernfortschritt-Materialien.</p>
        </div>
      </div>
      <div class="card-grid">
        ${content.modules.map((module) => {
          const progress = moduleProgress(module);
          return `
            <article class="source-card">
              <span class="lesson-index">${module.number}</span>
              <h3>${escapeHtml(module.title)}</h3>
              <p>${escapeHtml(module.description)}</p>
              <div class="progress-line" aria-label="${progress.percent}% abgeschlossen"><span style="width:${progress.percent}%"></span></div>
            </article>`;
        }).join("")}
      </div>`;
  }

  function renderPath() {
    setHeading("BPE6 Schritt für Schritt", "Lernpfad");
    activateNav("path");
    main.innerHTML = content.modules.map((module) => {
      const progress = moduleProgress(module);
      return `
        <section class="module-block">
          <p class="eyebrow">Modul ${module.number} · ${progress.done}/${progress.total} erledigt</p>
          <h2>${escapeHtml(module.title)}</h2>
          <p>${escapeHtml(module.description)}</p>
          <div class="progress-line" aria-label="${progress.percent}% abgeschlossen"><span style="width:${progress.percent}%"></span></div>
          <div class="card-grid">
            ${module.lessonIds.map((id) => lessonCard(lessonById(id))).join("")}
          </div>
        </section>`;
    }).join("");
  }

  function renderLessonSection(section) {
    const aside = [
      section.code ? `<pre class="code-block"><code>${escapeHtml(section.code)}</code></pre>` : "",
      section.visual ? renderVisual(section.visual) : "",
      section.tip ? `<div class="callout"><i data-lucide="lightbulb"></i><p>${inlineCode(section.tip)}</p></div>` : "",
      section.warning ? `<div class="callout is-warning"><i data-lucide="triangle-alert"></i><p>${inlineCode(section.warning)}</p></div>` : ""
    ].filter(Boolean).join("");
    return `
      <section class="content-section ${aside ? "" : "is-full"}">
        <div>
          <h3>${escapeHtml(section.title)}</h3>
          ${(section.body || []).map((paragraph) => `<p>${inlineCode(paragraph)}</p>`).join("")}
        </div>
        ${aside ? `<div>${aside}</div>` : ""}
      </section>`;
  }

  function renderLesson(id) {
    const lesson = lessonById(id);
    if (!lesson) {
      go("path");
      return;
    }
    state.lastLessonId = lesson.id;
    saveState();
    setHeading(`Lektion ${lesson.index}`, lesson.title);
    activateNav("path");
    const completed = state.completedLessons.includes(lesson.id);
    const practice = practiceById(lesson.practiceId);
    main.innerHTML = `
      <article class="lesson-detail">
        <header class="lesson-head">
          <div>
            <p class="eyebrow">${escapeHtml(moduleById(lesson.module)?.title || "BPE6")}</p>
            <h2>${escapeHtml(lesson.title)}</h2>
            <p>${escapeHtml(lesson.subtitle)}</p>
            <div class="lesson-meta">
              <span class="meta-pill"><i data-lucide="clock-3"></i>${lesson.duration} Min.</span>
              <span class="meta-pill difficulty-${lesson.difficulty}">${difficultyLabel(lesson.difficulty)}</span>
              <span class="meta-pill"><i data-lucide="sparkles"></i>${lesson.xp} XP</span>
            </div>
          </div>
          <div class="detail-actions">
            <button class="button button-secondary" type="button" data-route="path">
              <i data-lucide="arrow-left"></i>
              Lernpfad
            </button>
            ${practice ? `<button class="button button-primary" type="button" data-practice="${practice.id}"><i data-lucide="pencil"></i>Übung</button>` : ""}
          </div>
        </header>
        <div class="lesson-body">
          <section class="content-section">
            <div>
              <h3>Das kannst du danach</h3>
              <ul class="objective-list">
                ${lesson.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}
              </ul>
            </div>
            <div class="callout ${completed ? "" : "is-warning"}">
              <i data-lucide="${completed ? "circle-check" : "info"}"></i>
              <p>${completed ? "Diese Lektion ist abgeschlossen. Du kannst Quiz und Übung jederzeit wiederholen." : "Schließe das kurze Quiz ab, um die Lektions-XP zu sammeln."}</p>
            </div>
          </section>
          ${lesson.sections.map(renderLessonSection).join("")}
          ${renderLessonQuiz(lesson)}
        </div>
      </article>`;
  }

  function renderLessonQuiz(lesson) {
    return `
      <section class="quiz-panel">
        <p class="eyebrow">Verständnischeck</p>
        <h3>${escapeHtml(lesson.quiz.question)}</h3>
        <form id="quizForm" data-lesson-id="${lesson.id}">
          <div class="choice-list">
            ${lesson.quiz.options.map((option, index) => `
              <label>
                <input type="radio" name="quizAnswer" value="${index}">
                <span>${escapeHtml(option)}</span>
              </label>`).join("")}
          </div>
          <button class="button button-primary" type="submit">
            <i data-lucide="check"></i>
            Antwort prüfen
          </button>
        </form>
        <div class="result-banner" id="quizResult"></div>
      </section>`;
  }

  function showBanner(id, success, title, detail) {
    const banner = document.querySelector(id);
    if (!banner) {
      return;
    }
    banner.className = `result-banner is-visible ${success ? "is-success" : "is-error"}`;
    banner.innerHTML = `
      <i data-lucide="${success ? "circle-check" : "circle-alert"}"></i>
      <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p></div>`;
    renderIcons();
  }

  function renderSql() {
    setHeading("Browser-Training und Workbench-Vorbereitung", "SQL-Labor");
    activateNav("sql");
    const filters = [
      { id: "all", label: "Alle" },
      { id: "easy", label: "Grundlage" },
      { id: "medium", label: "Vertiefung" },
      { id: "plus", label: "Abitur-Plus" }
    ];
    const practices = sqlPractices().filter((practice) => practiceFilter === "all" || practice.difficulty === practiceFilter);
    main.innerHTML = `
      <section class="section-band lesson-body">
        <div class="content-section">
          <div>
            <p class="eyebrow">SQL im Browser</p>
            <h2>Sofort testen, danach in MySQL Workbench übertragen</h2>
            <p>Das Labor nutzt eine lokale Übungsdatenbank im Browser. Es prüft typische BPE6-Abfragen, ersetzt aber nicht die Arbeit mit MySQL Workbench und den Unterrichtsskripten.</p>
          </div>
          <div class="callout">
            <i data-lucide="database"></i>
            <p>Die Datenbank wird für jeden Lauf neu aufgebaut. Du kannst also gefahrlos INSERT, UPDATE oder DELETE ausprobieren.</p>
          </div>
        </div>
      </section>
      <div class="section-heading">
        <div>
          <p class="eyebrow">Übungen</p>
          <h2>SQL-Aufgaben</h2>
        </div>
      </div>
      <div class="filter-row">
        ${filters.map((filter) => `<button class="button button-secondary ${practiceFilter === filter.id ? "is-active" : ""}" type="button" data-filter="${filter.id}">${filter.label}</button>`).join("")}
      </div>
      <div class="card-grid">
        ${practices.map(practiceCard).join("")}
      </div>`;
  }

  function renderModeling() {
    setHeading("eERM, Schlüssel und Normalisierung", "Modellieren");
    activateNav("modeling");
    const practices = content.practices.filter((practice) => practice.type !== "sql");
    main.innerHTML = `
      <section class="hero-band">
        <div class="hero-content">
          <p class="eyebrow">Modellierung</p>
          <h2>Erst verstehen, dann Tabellen bauen.</h2>
          <p>Relationale Datenbanken beginnen nicht mit SQL, sondern mit sauberer Analyse: Entitäten, Beziehungen, Kardinalitäten, Schlüssel und Abhängigkeiten.</p>
          <div class="hero-actions">
            <button class="button button-primary" type="button" data-practice="${practices[0].id}">
              <i data-lucide="network"></i>
              Erste Modellübung
            </button>
          </div>
        </div>
        <div class="hero-visual">${renderVisual("er-simple")}</div>
      </section>
      <div class="section-heading">
        <div>
          <p class="eyebrow">Prüfbare Aufgaben</p>
          <h2>Modellieren und begründen</h2>
          <p>Diese Übungen prüfen Begriffe, Kardinalitäten, Integrität, Normalformen und Big-Data-Bewertung.</p>
        </div>
      </div>
      <div class="card-grid">
        ${practices.map(practiceCard).join("")}
      </div>`;
  }

  function schemaHtml(schemaKey) {
    const schema = content.schemas[schemaKey];
    if (!schema) {
      return "";
    }
    return `
      <div class="schema-grid">
        <div>
          <h3>${escapeHtml(schema.title)}</h3>
          <p>${escapeHtml(schema.description)}</p>
        </div>
        ${schema.tables.map((table) => `
          <article class="schema-card">
            <h3><code>${escapeHtml(table.name)}</code></h3>
            <div class="schema-fields">
              ${table.fields.map((field) => `<code>${escapeHtml(field)}</code>`).join("")}
            </div>
          </article>`).join("")}
      </div>`;
  }

  function renderPractice(id) {
    const practice = practiceById(id);
    if (!practice) {
      go("sql");
      return;
    }
    const lesson = lessonById(practice.lessonId);
    setHeading(practiceKind(practice), practice.title);
    activateNav(practice.type === "sql" ? "sql" : "modeling");
    if (practice.type === "sql") {
      renderSqlPractice(practice, lesson);
    } else if (practice.type === "slots") {
      renderSlotPractice(practice, lesson);
    } else {
      renderChoicePractice(practice, lesson);
    }
  }

  function renderPracticeHeader(practice, lesson) {
    const completed = state.completedPractices.includes(practice.id);
    return `
      <header class="lesson-head">
        <div>
          <p class="eyebrow">${escapeHtml(lesson?.index || "")} · ${escapeHtml(lesson?.title || "BPE6")}</p>
          <h2>${escapeHtml(practice.title)}</h2>
          <p>${escapeHtml(practice.description)}</p>
          <div class="lesson-meta">
            <span class="meta-pill">${practiceKind(practice)}</span>
            <span class="meta-pill difficulty-${practice.difficulty}">${difficultyLabel(practice.difficulty)}</span>
            <span class="meta-pill"><i data-lucide="sparkles"></i>${practice.xp} XP</span>
            ${completed ? `<span class="meta-pill"><i data-lucide="check"></i>gelöst</span>` : ""}
          </div>
        </div>
        <div class="detail-actions">
          <button class="button button-secondary" type="button" data-lesson="${practice.lessonId}">
            <i data-lucide="book-open"></i>
            Lektion
          </button>
        </div>
      </header>`;
  }

  function renderSqlPractice(practice, lesson) {
    const draft = state.drafts[practice.id] ?? practice.starter;
    main.innerHTML = `
      <article class="sql-runner">
        <div class="runner-main">
          ${renderPracticeHeader(practice, lesson)}
          <div class="lesson-body">
            <label class="sr-only" for="sqlEditor">SQL-Code</label>
            <textarea class="code-editor" id="sqlEditor" spellcheck="false">${escapeHtml(draft)}</textarea>
            <div class="runner-actions">
              <button class="button button-secondary" type="button" id="runSqlButton">
                <i data-lucide="play"></i>
                Ausführen
              </button>
              <button class="button button-primary" type="button" id="checkSqlButton">
                <i data-lucide="check"></i>
                Lösung prüfen
              </button>
              <button class="button button-secondary" type="button" id="resetSqlButton">
                <i data-lucide="rotate-ccw"></i>
                Zurücksetzen
              </button>
            </div>
            <div class="runner-tabs">
              <button class="runner-tab is-active" type="button" data-runner-tab="result">Ergebnis</button>
              <button class="runner-tab" type="button" data-runner-tab="hint">Hinweise</button>
              <button class="runner-tab" type="button" data-runner-tab="solution">Muster</button>
            </div>
            <div class="runner-panel is-active" data-runner-panel="result">
              <div id="sqlOutput" class="console-output">Noch keine Abfrage ausgeführt.</div>
              <div class="result-banner" id="practiceResult"></div>
            </div>
            <div class="runner-panel" data-runner-panel="hint">
              <ul class="plain-list">
                ${(practice.hints || []).map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}
              </ul>
            </div>
            <div class="runner-panel" data-runner-panel="solution">
              <pre class="code-block"><code>${escapeHtml(practice.solution)}</code></pre>
            </div>
          </div>
        </div>
        <aside class="runner-side">
          ${schemaHtml(practice.schema)}
        </aside>
      </article>`;
  }

  function renderChoicePractice(practice, lesson) {
    const completed = state.completedPractices.includes(practice.id);
    main.innerHTML = `
      <article class="lesson-detail">
        ${renderPracticeHeader(practice, lesson)}
        <div class="lesson-body">
          <section class="practice-panel">
            <form id="choicePracticeForm" data-practice-id="${practice.id}">
              ${practice.questions.map((question, questionIndex) => `
                <div>
                  <h3>${escapeHtml(question.question)}</h3>
                  <div class="choice-list">
                    ${question.options.map((option, optionIndex) => `
                      <label>
                        <input type="radio" name="choice-${questionIndex}" value="${optionIndex}">
                        <span>${escapeHtml(option)}</span>
                      </label>`).join("")}
                  </div>
                </div>`).join("")}
              <button class="button button-primary" type="submit">
                <i data-lucide="check"></i>
                Prüfen
              </button>
            </form>
            <div class="result-banner ${completed ? "is-visible is-success" : ""}" id="practiceResult">
              ${completed ? `<i data-lucide="circle-check"></i><div><strong>Bereits gelöst</strong><p>Du kannst die Übung weiter wiederholen.</p></div>` : ""}
            </div>
          </section>
        </div>
      </article>`;
  }

  function renderSlotPractice(practice, lesson) {
    const answers = state.slotDrafts[practice.id] || {};
    const completed = state.completedPractices.includes(practice.id);
    main.innerHTML = `
      <article class="lesson-detail">
        ${renderPracticeHeader(practice, lesson)}
        <div class="lesson-body">
          <section class="practice-panel">
            <p>${escapeHtml(practice.prompt)}</p>
            <form id="slotPracticeForm" data-practice-id="${practice.id}">
              <div class="choice-list">
                ${practice.slots.map((slot) => `
                  <label class="model-option">
                    <span>
                      <strong>${escapeHtml(slot.label)}</strong>
                      <select data-slot-id="${slot.id}" name="${slot.id}" aria-label="${escapeHtml(slot.label)}">
                        <option value="">Bitte wählen ...</option>
                        ${slot.options.map((option) => `<option value="${escapeHtml(option)}" ${answers[slot.id] === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
                      </select>
                    </span>
                  </label>`).join("")}
              </div>
              <button class="button button-primary" type="submit">
                <i data-lucide="check"></i>
                Prüfen
              </button>
            </form>
            <div class="result-banner ${completed ? "is-visible is-success" : ""}" id="practiceResult">
              ${completed ? `<i data-lucide="circle-check"></i><div><strong>Bereits gelöst</strong><p>${escapeHtml(practice.explanation)}</p></div>` : ""}
            </div>
          </section>
        </div>
      </article>`;
  }

  function renderCommands() {
    setHeading("SQL-Befehle schnell nachschlagen", "Befehle");
    activateNav("commands");
    main.innerHTML = `
      <section class="section-band lesson-body">
        <div class="content-section">
          <div>
            <p class="eyebrow">Syntaxkarten</p>
            <h2>Die wichtigsten BPE6-Befehle</h2>
            <p>Jede Karte enthält Zweck, Syntax, Beispiel und eine kurze XP-Frage. So wächst aus Wiederholung echte Sicherheit.</p>
          </div>
          <div class="callout">
            <i data-lucide="square-terminal"></i>
            <p>Die Schreibweise ist nah an MySQL. Im Browser-Labor funktionieren die Kernbefehle mit SQLite-kompatibler Syntax.</p>
          </div>
        </div>
      </section>
      <div class="card-grid">
        ${content.commands.map(commandCard).join("")}
      </div>`;
  }

  function renderCommandDetail(id) {
    const command = commandById(id);
    if (!command) {
      go("commands");
      return;
    }
    setHeading(command.category, command.title);
    activateNav("commands");
    const completed = state.completedCommands.includes(command.id);
    main.innerHTML = `
      <article class="lesson-detail">
        <header class="lesson-head">
          <div>
            <p class="eyebrow">${escapeHtml(command.category)}</p>
            <h2><code>${escapeHtml(command.title)}</code></h2>
            <p>${escapeHtml(command.short)}</p>
            <div class="lesson-meta">
              <span class="meta-pill"><i data-lucide="sparkles"></i>${command.xp} XP</span>
              ${completed ? `<span class="meta-pill"><i data-lucide="check"></i>gelöst</span>` : ""}
            </div>
          </div>
          <button class="button button-secondary" type="button" data-route="commands">
            <i data-lucide="arrow-left"></i>
            Befehle
          </button>
        </header>
        <div class="lesson-body">
          <section class="content-section">
            <div>
              <h3>Wofür du es brauchst</h3>
              <ul class="objective-list">
                ${command.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
              </ul>
            </div>
            <pre class="code-block"><code>${escapeHtml(command.syntax)}</code></pre>
          </section>
          <section class="content-section">
            <div>
              <h3>Beispiel</h3>
              <p>Übertrage Beispiele in MySQL Workbench erst, wenn der passende Datenbestand importiert ist.</p>
            </div>
            <pre class="code-block"><code>${escapeHtml(command.example)}</code></pre>
          </section>
          <section class="quiz-panel">
            <form id="commandExerciseForm" data-command-id="${command.id}">
              <h3>${escapeHtml(command.exercise.question)}</h3>
              <div class="choice-list">
                ${command.exercise.options.map((option, index) => `
                  <label>
                    <input type="radio" name="commandAnswer" value="${index}">
                    <span>${escapeHtml(option)}</span>
                  </label>`).join("")}
              </div>
              <button class="button button-primary" type="submit">
                <i data-lucide="check"></i>
                Prüfen
              </button>
            </form>
            <div class="result-banner" id="commandResult"></div>
          </section>
        </div>
      </article>`;
  }

  function renderAchievements() {
    setHeading("Motivation und Leistungsnachweis", "Erfolge");
    activateNav("achievements");
    const unlocked = content.achievements.filter(achievementUnlocked).length;
    main.innerHTML = `
      <section class="section-band lesson-body">
        <div class="content-section">
          <div>
            <p class="eyebrow">Kontinuierliche Leistung</p>
            <h2>${unlocked} von ${content.achievements.length} Erfolgen</h2>
            <p>XP und Erfolge dokumentieren kontinuierlich erbrachte Übungsleistung. Der Lernstand bleibt lokal im Browser und kann als JSON-Datei gesichert werden.</p>
          </div>
          <div class="callout is-warning">
            <i data-lucide="shield-check"></i>
            <p>Das System ist motivierend und transparent, aber kein manipulationssicheres Prüfungssystem. Für die Notengebung zählt die pädagogische Einordnung durch die Lehrkraft.</p>
          </div>
        </div>
      </section>
      <div class="card-grid">
        ${content.achievements.map((achievement) => {
          const isUnlocked = achievementUnlocked(achievement);
          return `
            <article class="achievement-card ${isUnlocked ? "" : "is-locked"}">
              <div class="achievement-icon"><i data-lucide="${escapeHtml(achievement.icon)}"></i></div>
              <h3>${escapeHtml(achievement.title)}</h3>
              <p>${escapeHtml(achievement.description)}</p>
              <span class="meta-pill">${isUnlocked ? "freigeschaltet" : "noch offen"}</span>
            </article>`;
        }).join("")}
      </div>`;
  }

  function renderReference() {
    setHeading("Quellen, Werkzeuge und Kurzbegriffe", "Nachschlagen");
    activateNav("reference");
    main.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="eyebrow">Unterrichtswerkzeuge</p>
          <h2>Informatik-Stick und MySQL Workbench</h2>
          <p>Für echte Unterrichtsskripte: Informatik-Stick starten, MySQL starten und geöffnet lassen, danach MySQL Workbench öffnen.</p>
        </div>
      </div>
      <section class="start-sequence" aria-label="Startreihenfolge für den Unterricht">
        <div class="start-sequence-head">
          <i data-lucide="route"></i>
          <div><span>Sicherer Start</span><strong>Vom Stick zur ersten Abfrage</strong></div>
        </div>
        <ol>
          <li><span>01</span><i data-lucide="usb"></i><div><strong>Stick starten</strong><small>Startfenster offen lassen</small></div></li>
          <li><span>02</span><i data-lucide="power"></i><div><strong>MySQL starten</strong><small>Dienst muss laufen</small></div></li>
          <li><span>03</span><i data-lucide="panels-top-left"></i><div><strong>Workbench öffnen</strong><small>Verbindung herstellen</small></div></li>
          <li><span>04</span><i data-lucide="square-terminal"></i><div><strong>Modell oder SQL</strong><small>Ausführen und prüfen</small></div></li>
        </ol>
      </section>
      <div class="card-grid">
        ${content.tools.map((tool) => `
          <article class="tool-card">
            <div class="tool-icon"><i data-lucide="${escapeHtml(tool.icon)}"></i></div>
            <div>
              <h3>${escapeHtml(tool.title)}</h3>
              <p>${escapeHtml(tool.description)}</p>
              <p class="tiny-note">${escapeHtml(tool.note || "")}</p>
              ${tool.url ? `<a class="button button-secondary" href="${escapeHtml(tool.url)}" target="_blank" rel="noopener">${escapeHtml(tool.linkLabel || "Öffnen")}</a>` : ""}
              ${renderToolVisual(tool.visual)}
            </div>
          </article>`).join("")}
      </div>

      <div class="section-heading">
        <div>
          <p class="eyebrow">Transparenz</p>
          <h2>Fachliche Quellen</h2>
          <p>WorkbenchLab orientiert sich am Bildungsplan und an den BPE6-Materialien des Landesbildungsservers. Originaldateien bleiben lokal im Projektordner.</p>
        </div>
      </div>
      <div class="card-grid">
        ${content.sources.map((source) => `
          <article class="source-card">
            <h3>${escapeHtml(source.title)}</h3>
            <p>${escapeHtml(source.description)}</p>
            <a class="button button-secondary" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.linkLabel)}</a>
          </article>`).join("")}
      </div>

      <div class="section-heading">
        <div>
          <p class="eyebrow">Kurzreferenz</p>
          <h2>Begriffe und Muster</h2>
        </div>
      </div>
      <div class="definition-grid">
        ${content.reference.map((item) => `
          <article class="definition-card">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <pre>${escapeHtml(item.code)}</pre>
          </article>`).join("")}
      </div>`;
  }

  function setRuntime(status, text) {
    runtimeChip.classList.toggle("is-ready", status === "ready");
    runtimeChip.classList.toggle("is-error", status === "error");
    runtimeText.textContent = text;
  }

  function initSqlRuntime() {
    if (sqlReadyPromise) {
      return sqlReadyPromise;
    }
    setRuntime("loading", "SQL wird vorbereitet");
    if (!window.initSqlJs) {
      setRuntime("error", "SQL nicht verfügbar");
      sqlReadyPromise = Promise.reject(new Error("sql.js konnte nicht geladen werden."));
      return sqlReadyPromise;
    }
    sqlReadyPromise = window.initSqlJs({
      locateFile: (file) => `${sqlAssetBase}${file}`
    }).then((SQL) => {
      SQLRuntime = SQL;
      setRuntime("ready", "SQL ist bereit");
      return SQLRuntime;
    }).catch((error) => {
      setRuntime("error", "SQL nicht verfügbar");
      throw error;
    });
    return sqlReadyPromise;
  }

  function parseDateParts(value) {
    const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) } : null;
  }

  function registerSqlFunctions(db) {
    if (typeof db.create_function !== "function") {
      return;
    }
    db.create_function("YEAR", (value) => parseDateParts(value)?.year ?? null);
    db.create_function("MONTH", (value) => parseDateParts(value)?.month ?? null);
    db.create_function("NOW", () => new Date().toISOString().replace("T", " ").slice(0, 19));
    db.create_function("DATEDIFF", (a, b) => {
      const left = Date.parse(String(a));
      const right = Date.parse(String(b));
      if (Number.isNaN(left) || Number.isNaN(right)) {
        return null;
      }
      return Math.round((left - right) / 86400000);
    });
  }

  async function createDatabase(schemaKey) {
    const SQL = await initSqlRuntime();
    const schema = content.schemas[schemaKey];
    if (!schema) {
      throw new Error("Unbekanntes Übungsschema.");
    }
    const db = new SQL.Database();
    registerSqlFunctions(db);
    db.run(schema.seed);
    return db;
  }

  function tableFromResult(resultSets) {
    if (!Array.isArray(resultSets) || !resultSets.length) {
      return { columns: [], values: [] };
    }
    const last = resultSets[resultSets.length - 1];
    return {
      columns: last.columns || [],
      values: last.values || []
    };
  }

  function normalizeCell(value) {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === "number") {
      return Number.isInteger(value) ? value : Number(value.toFixed(6));
    }
    return String(value);
  }

  function normalizedRows(table, orderSensitive) {
    const rows = (table.values || []).map((row) => row.map(normalizeCell));
    if (!orderSensitive) {
      rows.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    }
    return rows;
  }

  function sameTable(actual, expected, orderSensitive) {
    return JSON.stringify(normalizedRows(actual, orderSensitive)) ===
      JSON.stringify(normalizedRows(expected, orderSensitive));
  }

  function checkSqlPatterns(sql, check) {
    const problems = [];
    (check.required || []).forEach((pattern) => {
      if (!new RegExp(pattern, "i").test(sql)) {
        problems.push(`Erwartet wird ein Bestandteil passend zu /${pattern}/.`);
      }
    });
    (check.forbidden || []).forEach((pattern) => {
      if (new RegExp(pattern, "i").test(sql)) {
        problems.push(`Dieser Bestandteil ist hier nicht erlaubt: /${pattern}/.`);
      }
    });
    return problems;
  }

  function renderDataTable(table) {
    if (!table.columns.length) {
      return `<div class="console-output">Befehl ausgeführt. Diese Anweisung liefert keine Ergebnistabelle.</div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>${table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
          <tbody>
            ${table.values.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell === null ? "NULL" : cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  }

  function setSqlOutput(html) {
    const output = document.querySelector("#sqlOutput");
    if (output) {
      output.className = "";
      output.innerHTML = html;
    }
    document.querySelectorAll("[data-runner-tab]").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.runnerTab === "result");
    });
    document.querySelectorAll("[data-runner-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.runnerPanel === "result");
    });
  }

  async function runSqlPractice(checkSolution) {
    const practice = practiceById(parseRoute().id);
    const editor = document.querySelector("#sqlEditor");
    const runButton = document.querySelector("#runSqlButton");
    const checkButton = document.querySelector("#checkSqlButton");
    if (!practice || !editor) {
      return;
    }
    runButton.disabled = true;
    checkButton.disabled = true;
    setSqlOutput(`<div class="console-output">SQL arbeitet ...</div>`);
    try {
      const sql = editor.value.trim();
      if (!sql) {
        throw new Error("Schreibe zuerst eine SQL-Anweisung.");
      }
      const patternProblems = checkSolution ? checkSqlPatterns(sql, practice.check) : [];
      let db = await createDatabase(practice.schema);
      let table;
      if (practice.check.type === "mutation") {
        db.run(sql);
        table = tableFromResult(db.exec(practice.check.verifySql));
      } else {
        table = tableFromResult(db.exec(sql));
      }
      setSqlOutput(renderDataTable(table));

      if (!checkSolution) {
        db.close();
        return;
      }

      let passed = patternProblems.length === 0;
      if (practice.check.type === "query") {
        const expectedDb = await createDatabase(practice.schema);
        const expected = tableFromResult(expectedDb.exec(practice.check.expectedSql));
        passed = passed && sameTable(table, expected, practice.check.orderSensitive);
        expectedDb.close();
      } else {
        const expected = practice.check.expected;
        passed = passed && sameTable(table, expected, true);
      }
      db.close();

      if (passed) {
        const firstCompletion = award("practice", practice.id, practice.xp);
        showBanner("#practiceResult", true, "Aufgabe gelöst", firstCompletion
          ? `${practice.xp} XP wurden gutgeschrieben.`
          : "Deine Lösung besteht die Prüfung weiterhin.");
      } else {
        showBanner("#practiceResult", false, "Noch nicht ganz", patternProblems[0] || "Das Ergebnis passt noch nicht zur erwarteten Ergebnismenge. Prüfe Spalten, Bedingungen, Gruppierung und Sortierung.");
      }
    } catch (error) {
      setSqlOutput(`<div class="console-output">${escapeHtml(error.message || "Die SQL-Anweisung konnte nicht ausgeführt werden.")}</div>`);
      if (checkSolution) {
        showBanner("#practiceResult", false, "SQL-Fehler", error.message || "Prüfe Syntax und Tabellennamen.");
      }
    } finally {
      runButton.disabled = false;
      checkButton.disabled = false;
    }
  }

  function checkChoicePractice(form) {
    const practice = practiceById(form.dataset.practiceId);
    if (!practice) {
      return;
    }
    const allCorrect = practice.questions.every((question, index) => {
      const selected = form.querySelector(`input[name="choice-${index}"]:checked`);
      return selected && Number(selected.value) === question.correct;
    });
    if (allCorrect) {
      const firstCompletion = award("practice", practice.id, practice.xp);
      showBanner("#practiceResult", true, "Übung gelöst", firstCompletion
        ? `${practice.xp} XP wurden gutgeschrieben. ${practice.questions.at(-1).feedback}`
        : practice.questions.at(-1).feedback);
    } else {
      showBanner("#practiceResult", false, "Noch nicht ganz", "Lies die Situation noch einmal und achte auf den fachlichen Begriff.");
    }
  }

  function checkSlotPractice(form) {
    const practice = practiceById(form.dataset.practiceId);
    if (!practice) {
      return;
    }
    const answers = {};
    practice.slots.forEach((slot) => {
      answers[slot.id] = form.elements[slot.id]?.value || "";
    });
    state.slotDrafts[practice.id] = answers;
    saveState();
    const incomplete = practice.slots.some((slot) => !answers[slot.id]);
    const passed = !incomplete && practice.slots.every((slot) => answers[slot.id] === slot.answer);
    if (passed) {
      const firstCompletion = award("practice", practice.id, practice.xp);
      showBanner("#practiceResult", true, "Übung gelöst", firstCompletion
        ? `${practice.xp} XP wurden gutgeschrieben. ${practice.explanation}`
        : practice.explanation);
    } else if (incomplete) {
      showBanner("#practiceResult", false, "Noch nicht vollständig", "Wähle zuerst für jedes Feld eine Antwort.");
    } else {
      showBanner("#practiceResult", false, "Prüfe die Zuordnung", "Achte auf die genaue Bedeutung der Fachbegriffe und Kardinalitäten.");
    }
  }

  function checkCommandExercise(form) {
    const command = commandById(form.dataset.commandId);
    const selected = form.querySelector('input[name="commandAnswer"]:checked');
    if (!command || !selected) {
      showBanner("#commandResult", false, "Noch keine Antwort", "Wähle zuerst eine Möglichkeit aus.");
      return;
    }
    if (Number(selected.value) === command.exercise.correct) {
      const firstCompletion = award("command", command.id, command.xp);
      showBanner("#commandResult", true, "Richtig", firstCompletion
        ? `${command.xp} XP wurden gutgeschrieben. ${command.exercise.feedback}`
        : command.exercise.feedback);
    } else {
      showBanner("#commandResult", false, "Noch nicht", command.exercise.feedback);
    }
  }

  function safeFilePart(value) {
    return String(value || "lernstand")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || "lernstand";
  }

  function exportFileName() {
    return `workbenchlab-${safeFilePart(state.name)}-${todayKey()}.json`;
  }

  function backupPayload() {
    return {
      app: backupAppId,
      formatVersion: backupFormatVersion,
      exportedAt: new Date().toISOString(),
      data: state
    };
  }

  function updateBackupSummary() {
    const summary = document.querySelector("#backupSummary");
    if (!summary) {
      return;
    }
    summary.innerHTML = `
      <div><strong>${stateXp()} XP</strong><small>Erfahrung</small></div>
      <div><strong>${state.completedLessons.length}</strong><small>Lektionen</small></div>
      <div><strong>${state.completedPractices.length + state.completedCommands.length}</strong><small>Aufgaben</small></div>`;
  }

  async function exportProgress() {
    const json = JSON.stringify(backupPayload(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const suggestedName = exportFileName();
    if ("showSaveFilePicker" in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName,
          types: [{
            description: "WorkbenchLab-Lernstand",
            accept: { "application/json": [".json"] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        toast("Lernstand gespeichert");
        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }
      }
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = suggestedName;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Lernstand heruntergeladen");
  }

  async function importProgressFile(file) {
    if (!file) {
      return;
    }
    if (file.size > 2_000_000) {
      toast("Die Datei ist zu groß", "error");
      progressFileInput.value = "";
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed?.app !== backupAppId || !parsed.data) {
        throw new Error("Keine WorkbenchLab-Datei");
      }
      if (!Number.isInteger(parsed.formatVersion) || parsed.formatVersion > backupFormatVersion) {
        throw new Error("Die Datei stammt aus einer neueren Version");
      }
      const importedState = normalizeState(parsed.data);
      const label = importedState.name || "Gast";
      const confirmed = window.confirm(
        `Lernstand von ${label} mit ${stateXp(importedState)} XP laden? Der aktuelle Browserstand wird ersetzt.`
      );
      if (!confirmed) {
        return;
      }
      state = importedState;
      saveState();
      backupDialog.close();
      renderRoute();
      toast("Lernstand erfolgreich geladen");
    } catch (error) {
      toast(error.message || "Die Datei konnte nicht geladen werden", "error");
    } finally {
      progressFileInput.value = "";
    }
  }

  function toast(message, type = "success") {
    const region = document.querySelector("#toastRegion");
    const element = document.createElement("div");
    element.className = `toast${type === "xp" ? " is-xp" : ""}${type === "error" ? " is-error" : ""}`;
    const icon = type === "xp" ? "sparkles" : type === "error" ? "circle-alert" : "circle-check";
    element.innerHTML = `<i data-lucide="${icon}"></i><strong>${escapeHtml(message)}</strong>`;
    region.append(element);
    renderIcons();
    window.setTimeout(() => element.remove(), 3200);
  }

  function parseRoute() {
    const hash = window.location.hash.replace(/^#\/?/, "") || "home";
    const [name, id] = hash.split("/");
    return { name, id };
  }

  function renderRoute() {
    const route = parseRoute();
    if (route.name === "home") {
      renderHome();
    } else if (route.name === "path") {
      renderPath();
    } else if (route.name === "sql") {
      renderSql();
    } else if (route.name === "modeling") {
      renderModeling();
    } else if (route.name === "commands") {
      renderCommands();
    } else if (route.name === "achievements") {
      renderAchievements();
    } else if (route.name === "reference") {
      renderReference();
    } else if (route.name === "lesson") {
      renderLesson(route.id);
    } else if (route.name === "practice") {
      renderPractice(route.id);
    } else if (route.name === "command") {
      renderCommandDetail(route.id);
    } else {
      go("home");
      return;
    }
    updateChrome();
    renderIcons();
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  document.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route]");
    const lessonButton = event.target.closest("[data-lesson]");
    const practiceButton = event.target.closest("[data-practice]");
    const commandButton = event.target.closest("[data-command]");
    const filterButton = event.target.closest("[data-filter]");
    const runnerTab = event.target.closest("[data-runner-tab]");

    if (routeButton) {
      event.preventDefault();
      go(routeButton.dataset.route);
    }
    if (lessonButton) {
      go(`lesson/${lessonButton.dataset.lesson}`);
    }
    if (practiceButton) {
      go(`practice/${practiceButton.dataset.practice}`);
    }
    if (commandButton) {
      go(`command/${commandButton.dataset.command}`);
    }
    if (filterButton) {
      practiceFilter = filterButton.dataset.filter;
      renderSql();
      renderIcons();
    }
    if (runnerTab) {
      document.querySelectorAll("[data-runner-tab]").forEach((tab) => {
        tab.classList.toggle("is-active", tab === runnerTab);
      });
      document.querySelectorAll("[data-runner-panel]").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.runnerPanel === runnerTab.dataset.runnerTab);
      });
    }
    if (event.target.closest("#runSqlButton")) {
      runSqlPractice(false);
    }
    if (event.target.closest("#checkSqlButton")) {
      runSqlPractice(true);
    }
    if (event.target.closest("#resetSqlButton")) {
      const practice = practiceById(parseRoute().id);
      const editor = document.querySelector("#sqlEditor");
      if (practice && editor && window.confirm("Deine SQL-Eingabe auf den Startzustand zurücksetzen?")) {
        editor.value = practice.starter;
        delete state.drafts[practice.id];
        saveState();
        setSqlOutput(`<div class="console-output">Die Aufgabe wurde zurückgesetzt.</div>`);
        document.querySelector("#practiceResult").className = "result-banner";
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    const card = event.target.closest("[data-lesson], [data-practice], [data-command]");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      if (card.dataset.lesson) {
        go(`lesson/${card.dataset.lesson}`);
      } else if (card.dataset.practice) {
        go(`practice/${card.dataset.practice}`);
      } else {
        go(`command/${card.dataset.command}`);
      }
    }
    if (event.target.id === "sqlEditor" && event.key === "Tab") {
      event.preventDefault();
      const editor = event.target;
      const start = editor.selectionStart;
      editor.setRangeText("  ", start, editor.selectionEnd, "end");
      editor.dispatchEvent(new Event("input"));
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "sqlEditor") {
      const practice = practiceById(parseRoute().id);
      if (practice) {
        state.drafts[practice.id] = event.target.value.slice(0, 100000);
        saveState();
      }
    }
  });

  document.addEventListener("change", (event) => {
    const slot = event.target.closest("[data-slot-id]");
    if (!slot) {
      return;
    }
    const practice = practiceById(parseRoute().id);
    if (!practice) {
      return;
    }
    state.slotDrafts[practice.id] = state.slotDrafts[practice.id] || {};
    state.slotDrafts[practice.id][slot.dataset.slotId] = slot.value;
    saveState();
    const banner = document.querySelector("#practiceResult");
    if (banner) {
      banner.className = "result-banner";
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "quizForm") {
      event.preventDefault();
      const form = event.target;
      const lesson = lessonById(form.dataset.lessonId);
      const selected = form.querySelector('input[name="quizAnswer"]:checked');
      if (!selected) {
        showBanner("#quizResult", false, "Noch keine Antwort", "Wähle zuerst eine Möglichkeit aus.");
        return;
      }
      if (Number(selected.value) === lesson.quiz.correct) {
        award("lesson", lesson.id, lesson.xp);
        showBanner("#quizResult", true, "Richtig", lesson.quiz.explanation);
      } else {
        showBanner("#quizResult", false, "Noch nicht", lesson.quiz.explanation);
      }
    }
    if (event.target.id === "choicePracticeForm") {
      event.preventDefault();
      checkChoicePractice(event.target);
    }
    if (event.target.id === "slotPracticeForm") {
      event.preventDefault();
      checkSlotPractice(event.target);
    }
    if (event.target.id === "commandExerciseForm") {
      event.preventDefault();
      checkCommandExercise(event.target);
    }
  });

  document.querySelector("#mobileMenuButton").addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
    backdrop.classList.toggle("is-visible");
  });
  backdrop.addEventListener("click", closeMobileNav);

  document.querySelector("#editProfileButton").addEventListener("click", () => {
    profileName.value = state.name;
    profileDialog.showModal();
    profileName.focus();
  });
  document.querySelector("#profileCancelButton").addEventListener("click", () => profileDialog.close());
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.name = profileName.value.trim().slice(0, 18);
    saveState();
    profileDialog.close();
    renderRoute();
    toast("Lernprofil gespeichert");
  });

  document.querySelector("#backupButton").addEventListener("click", () => {
    updateBackupSummary();
    backupDialog.showModal();
  });
  document.querySelector("#backupCloseButton").addEventListener("click", () => backupDialog.close());
  document.querySelector("#exportProgressButton").addEventListener("click", exportProgress);
  document.querySelector("#importProgressButton").addEventListener("click", () => progressFileInput.click());
  progressFileInput.addEventListener("change", () => importProgressFile(progressFileInput.files?.[0]));
  themeToggleButton?.addEventListener("click", toggleTheme);
  window.addEventListener("hashchange", renderRoute);

  applyTheme(readTheme(), false);
  initSqlRuntime().catch(() => {});
  renderRoute();
  const suppressProfilePrompt = new URLSearchParams(window.location.search).has("screenshot");
  if (!suppressProfilePrompt && !state.name && !sessionStorage.getItem("workbenchlab-profile-seen")) {
    sessionStorage.setItem("workbenchlab-profile-seen", "1");
    window.setTimeout(() => profileDialog.showModal(), 350);
  }
})();
