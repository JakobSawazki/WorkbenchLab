(() => {
  "use strict";

  const content = window.WORKBENCH_CONTENT;
  const storageKey = "workbenchlab-v1";
  const themeStorageKey = "workbenchlab-theme-v1";
  const deviceStorageKey = "workbenchlab-device-v1";
  const developerStorageKey = "workbenchlab-developer-v1";
  const pendingModuleStorageKey = "workbenchlab-pending-module-v1";
  const backupAppId = "WorkbenchLab";
  const backupFormatVersion = 3;
  const studentCodePattern = /^[A-Z]{3}\.[A-Z]{3}$/;
  const classNamePattern = /^[A-ZÄÖÜ0-9][A-ZÄÖÜ0-9 ._\/-]{0,19}$/;
  const sqlAssetBase = "vendor/sql.js/";

  const main = document.querySelector("#mainContent");
  const sidebar = document.querySelector("#sidebar");
  const backdrop = document.querySelector("#mobileBackdrop");
  const profileDialog = document.querySelector("#profileDialog");
  const profileForm = document.querySelector("#profileForm");
  const profileName = document.querySelector("#profileName");
  const profileClass = document.querySelector("#profileClass");
  const profileNameError = document.querySelector("#profileNameError");
  const backupDialog = document.querySelector("#backupDialog");
  const progressFileInput = document.querySelector("#progressFileInput");
  const runtimeChip = document.querySelector("#runtimeChip");
  const runtimeText = document.querySelector("#runtimeText");
  const themeToggleButton = document.querySelector("#themeToggleButton");
  const developerModeButton = document.querySelector("#developerModeButton");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const defaultState = {
    name: "",
    className: "",
    profileId: "",
    profileDeviceId: "",
    profileCreatedAt: "",
    transferHistory: [],
    completedLessons: [],
    passedLessonQuizzes: [],
    lessonChecks: {},
    completedPractices: [],
    completedCommands: [],
    drafts: {},
    slotDrafts: {},
    lessonNotes: {},
    lessonWorksheets: {},
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
  const deviceIdentity = loadDeviceIdentity();
  if (state.name && !state.profileDeviceId) {
    state.profileDeviceId = deviceIdentity.id;
    state.profileCreatedAt = state.profileCreatedAt || new Date().toISOString();
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // The app still works for the current tab when browser storage is unavailable.
  }
  let practiceFilter = "all";
  let developerMode = false;
  let developerControlRevealed = false;
  let SQLRuntime = null;
  let sqlReadyPromise = null;

  try {
    developerMode = sessionStorage.getItem(developerStorageKey) === "active";
  } catch {}

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

  function normalizeStudentCode(value) {
    const cleaned = String(value || "")
      .trim()
      .toLocaleUpperCase("de-DE")
      .replaceAll("Ä", "AE")
      .replaceAll("Ö", "OE")
      .replaceAll("Ü", "UE")
      .replaceAll("ẞ", "SS")
      .replaceAll("ß", "SS")
      .replace(/[^A-Z.]/g, "");
    if (cleaned.includes(".")) {
      const [firstName = "", lastName = ""] = cleaned.split(".");
      return `${firstName.slice(0, 3)}.${lastName.slice(0, 3)}`;
    }
    return cleaned.length === 6 ? `${cleaned.slice(0, 3)}.${cleaned.slice(3)}` : cleaned.slice(0, 7);
  }

  function isValidStudentCode(value) {
    return studentCodePattern.test(value);
  }

  function normalizeClassName(value) {
    return String(value || "")
      .trim()
      .toLocaleUpperCase("de-DE")
      .replace(/\s+/g, " ")
      .replace(/[^A-ZÄÖÜ0-9 ._\/-]/g, "")
      .slice(0, 20);
  }

  function isValidClassName(value) {
    return classNamePattern.test(value);
  }

  function createOpaqueId(prefix) {
    const token = globalThis.crypto?.randomUUID?.()
      || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
    return `${prefix}_${token}`;
  }

  function isOpaqueId(value, prefix) {
    return typeof value === "string"
      && new RegExp(`^${prefix}_[A-Za-z0-9-]{12,80}$`).test(value);
  }

  function shortIdentity(value) {
    return String(value || "")
      .replace(/^[^_]*_/, "")
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(-8)
      .toUpperCase() || "UNBEKANNT";
  }

  function loadDeviceIdentity() {
    try {
      const storedRaw = localStorage.getItem(deviceStorageKey);
      const stored = storedRaw ? JSON.parse(storedRaw) : null;
      if (isOpaqueId(stored?.id, "device")) {
        return {
          id: stored.id,
          createdAt: typeof stored.createdAt === "string" ? stored.createdAt : ""
        };
      }
      const created = { id: createOpaqueId("device"), createdAt: new Date().toISOString() };
      localStorage.setItem(deviceStorageKey, JSON.stringify(created));
      return created;
    } catch {
      return { id: createOpaqueId("device"), createdAt: new Date().toISOString() };
    }
  }

  function deviceEnvironment() {
    const platform = navigator.userAgentData?.platform || navigator.platform || "unbekannt";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unbekannt";
    return {
      platform: String(platform).slice(0, 80),
      language: String(navigator.language || "unbekannt").slice(0, 24),
      timezone: String(timezone).slice(0, 80),
      screen: `${window.screen?.width || 0}x${window.screen?.height || 0}x${window.screen?.colorDepth || 0}`,
      origin: String(window.location.origin || "lokale-datei").slice(0, 160)
    };
  }

  function lessonById(id) {
    return content.lessons.find((lesson) => lesson.id === id);
  }

  function moduleById(id) {
    return content.modules.find((module) => module.id === id);
  }

  function orderedLessons() {
    return content.modules
      .flatMap((module) => module.lessonIds)
      .map(lessonById)
      .filter(Boolean);
  }

  function lessonPrerequisite(lesson) {
    const lessons = orderedLessons();
    const index = lessons.findIndex((item) => item.id === lesson?.id);
    return index > 0 ? lessons[index - 1] : null;
  }

  function isLessonUnlocked(lesson) {
    if (!lesson) {
      return false;
    }
    if (developerMode) {
      return true;
    }
    if (state.completedLessons.includes(lesson.id)) {
      return true;
    }
    const prerequisite = lessonPrerequisite(lesson);
    return !prerequisite || state.completedLessons.includes(prerequisite.id);
  }

  function isPracticeUnlocked(practice) {
    return Boolean(practice && isLessonUnlocked(lessonById(practice.lessonId)));
  }

  function practiceById(id) {
    return content.practices.find((practice) => practice.id === id);
  }

  function lessonProgressRecord(lesson) {
    const saved = state.lessonChecks?.[lesson.id] || {};
    const checkCount = lesson.completionChecks?.length || 0;
    return {
      checks: Array.from({ length: checkCount }, (_, index) => Boolean(saved.checks?.[index])),
      teacherChecked: Boolean(saved.teacherChecked),
      quizPassed: state.passedLessonQuizzes.includes(lesson.id)
    };
  }

  function commandById(id) {
    return content.commands.find((command) => command.id === id);
  }

  function practiceKind(practice) {
    if (practice.type === "sql") {
      return "SQL";
    }
    if (practice.type === "diagram") {
      return "eERM";
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
    const passedLessonQuizzes = uniqueAllowedStrings(candidate.passedLessonQuizzes, lessonIds);
    const completedPractices = uniqueAllowedStrings(candidate.completedPractices, practiceIds);
    const completedCommands = uniqueAllowedStrings(candidate.completedCommands, commandIds);
    const drafts = {};
    const slotDrafts = {};
    const lessonChecks = {};
    const lessonNotes = {};
    const lessonWorksheets = {};

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

    Object.entries(candidate.lessonChecks || {}).forEach(([id, value]) => {
      if (!lessonIds.has(id) || !value || typeof value !== "object") {
        return;
      }
      const checkCount = lessonById(id)?.completionChecks?.length || 0;
      lessonChecks[id] = {
        checks: Array.from({ length: checkCount }, (_, index) => Boolean(value.checks?.[index])),
        teacherChecked: Boolean(value.teacherChecked)
      };
    });

    Object.entries(candidate.lessonNotes || {}).forEach(([id, value]) => {
      if (lessonIds.has(id) && typeof value === "string") {
        lessonNotes[id] = value.slice(0, 12000);
      }
    });

    Object.entries(candidate.lessonWorksheets || {}).forEach(([id, value]) => {
      if (!lessonIds.has(id) || !value || typeof value !== "object") {
        return;
      }
      const definitions = {};
      Object.entries(value.definitions || {}).forEach(([term, answer]) => {
        if (/^[a-z0-9-]{1,40}$/.test(term) && typeof answer === "string") {
          definitions[term] = answer.slice(0, 1200);
        }
      });
      const rows = Array.isArray(value.rows)
        ? value.rows.slice(0, 12).map((row) => ({
          name: String(row?.name || "").slice(0, 40),
          type: String(row?.type || "").slice(0, 32),
          length: String(row?.length || "").replace(/[^0-9]/g, "").slice(0, 5),
          primary: Boolean(row?.primary)
        }))
        : [];
      const primaryIndex = rows.findIndex((row) => row.primary);
      rows.forEach((row, index) => {
        row.primary = index === primaryIndex;
      });
      lessonWorksheets[id] = {
        tableName: String(value.tableName || "").slice(0, 40),
        definitions,
        rows
      };
    });

    const name = normalizeStudentCode(candidate.name);
    const validName = isValidStudentCode(name) ? name : "";
    const className = normalizeClassName(candidate.className);
    const validClassName = isValidClassName(className) ? className : "";
    const transferHistory = Array.isArray(candidate.transferHistory)
      ? candidate.transferHistory.slice(-12).map((entry) => ({
        importedAt: typeof entry?.importedAt === "string" ? entry.importedAt.slice(0, 40) : "",
        sourceExportId: isOpaqueId(entry?.sourceExportId, "export") ? entry.sourceExportId : "",
        sourceDeviceId: isOpaqueId(entry?.sourceDeviceId, "device") ? entry.sourceDeviceId : "",
        destinationDeviceId: isOpaqueId(entry?.destinationDeviceId, "device") ? entry.destinationDeviceId : ""
      }))
      : [];
    return {
      ...defaultState,
      name: validName,
      className: validClassName,
      profileId: validName
        ? (isOpaqueId(candidate.profileId, "profile") ? candidate.profileId : createOpaqueId("profile"))
        : "",
      profileDeviceId: isOpaqueId(candidate.profileDeviceId, "device") ? candidate.profileDeviceId : "",
      profileCreatedAt: typeof candidate.profileCreatedAt === "string" ? candidate.profileCreatedAt.slice(0, 40) : "",
      transferHistory,
      completedLessons,
      passedLessonQuizzes: [...new Set([...passedLessonQuizzes, ...completedLessons])],
      lessonChecks,
      completedPractices,
      completedCommands,
      drafts,
      slotDrafts,
      lessonNotes,
      lessonWorksheets,
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
    const lessons = orderedLessons();
    return lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) ||
      lessonById(state.lastLessonId) ||
      lessons.at(-1);
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
      return localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark";
    } catch {
      return document.documentElement.dataset.theme === "light" ? "light" : "dark";
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

  function lessonBreadcrumb(module, lesson) {
    const moduleLabel = `Lernfortschritt ${Number(module?.number || 1)}`;
    const lessonLabel = lesson.courseCode || `Lektion ${lesson.index}`;
    return `<button type="button" class="breadcrumb-link" data-path-module="${escapeHtml(module.id)}" title="${escapeHtml(moduleLabel)} im Lernpfad öffnen">${escapeHtml(moduleLabel)}</button><span class="breadcrumb-separator" aria-hidden="true">›</span><span aria-current="page">${escapeHtml(lessonLabel)}</span>`;
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

  function renderPathQuickMenu() {
    const menu = document.querySelector("#pathQuickMenu");
    if (!menu) {
      return;
    }
    menu.innerHTML = `
      <div class="path-quick-heading">
        <strong>Lernpfad</strong>
        <small>${developerMode ? "Entwicklermodus · alles offen" : "Einheit für Einheit"}</small>
      </div>
      <div class="path-stage-list">
        ${content.modules.map((module) => {
          const firstLesson = lessonById(module.lessonIds[0]);
          const moduleUnlocked = isLessonUnlocked(firstLesson);
          const progress = moduleProgress(module);
          const label = `Lernfortschritt ${Number(module.number)}`;
          return `
            <div class="path-stage-item ${moduleUnlocked ? "" : "is-locked"}">
              <button type="button" data-path-module="${escapeHtml(module.id)}" title="${label}" ${moduleUnlocked ? "" : "aria-disabled=\"true\""}>
                <span>${escapeHtml(module.code)}</span>
                <span><strong>${escapeHtml(module.title)}</strong><small>${progress.done}/${progress.total} abgeschlossen</small></span>
                <span class="path-stage-status" aria-hidden="true">${moduleUnlocked ? "›" : "×"}</span>
              </button>
              <div class="path-lesson-submenu" aria-label="${label}">
                <strong>${label}</strong>
                ${module.lessonIds.map((lessonId) => {
                  const lesson = lessonById(lessonId);
                  const unlocked = isLessonUnlocked(lesson);
                  const completed = state.completedLessons.includes(lessonId);
                  const prerequisite = lessonPrerequisite(lesson);
                  const lockedTitle = prerequisite
                    ? `Zuerst ${prerequisite.courseCode || prerequisite.index} abschließen`
                    : "Noch gesperrt";
                  return `
                    <button type="button" data-lesson="${escapeHtml(lessonId)}" class="${completed ? "is-done" : ""} ${unlocked ? "" : "is-locked"}"
                      title="${escapeHtml(unlocked ? lesson.title : lockedTitle)}" ${unlocked ? "" : "aria-disabled=\"true\""}>
                      <span>${escapeHtml(lesson.courseCode || lesson.index)}</span>
                      <span>${escapeHtml(lesson.title)}</span>
                    </button>`;
                }).join("")}
              </div>
            </div>`;
        }).join("")}
      </div>`;
  }

  function updateDeveloperControl() {
    if (!developerModeButton) {
      return;
    }
    developerModeButton.hidden = !developerControlRevealed;
    developerModeButton.classList.toggle("is-active", developerMode);
    developerModeButton.setAttribute("aria-pressed", String(developerMode));
    developerModeButton.setAttribute("aria-label", developerMode ? "Entwicklermodus deaktivieren" : "Entwicklermodus aktivieren");
    developerModeButton.title = developerMode ? "Entwicklermodus deaktivieren" : "Entwicklermodus: alle Einheiten freischalten";
    document.querySelector("#developerModeLabel").textContent = developerMode ? "Entwicklermodus ausschalten" : "Entwicklermodus einschalten";
  }

  function setDeveloperMode(active) {
    developerMode = Boolean(active);
    try {
      sessionStorage.setItem(developerStorageKey, developerMode ? "active" : "inactive");
    } catch {}
    updateDeveloperControl();
    renderRoute();
    toast(developerMode ? "Entwicklermodus aktiv: alle Einheiten sind offen" : "Entwicklermodus beendet");
  }

  function updateChrome() {
    const xp = stateXp();
    const level = currentLevel();
    const displayName = state.name || "Gast";
    document.querySelector("#sidebarName").textContent = displayName;
    document.querySelector("#sidebarAvatar").textContent = displayName.slice(0, 1).toUpperCase();
    document.querySelector("#sidebarClass").textContent = state.className || "Klasse noch offen";
    document.querySelector("#sidebarLevel").textContent = `Level ${level.number} · ${level.title}`;
    document.querySelector("#sidebarXpBar").style.width = `${Math.max(0, Math.min(100, level.progress))}%`;
    document.querySelector("#sidebarXpText").textContent = level.number === levels.length
      ? `${xp} XP · Höchstes Level`
      : `${xp} / ${level.nextMin} XP`;
    document.querySelector("#topXp").textContent = `${xp} XP`;
    renderPathQuickMenu();
    updateDeveloperControl();
  }

  function lessonCard(lesson) {
    const completed = state.completedLessons.includes(lesson.id);
    const unlocked = isLessonUnlocked(lesson);
    const prerequisite = lessonPrerequisite(lesson);
    const lockedLabel = prerequisite
      ? `Gesperrt: zuerst ${prerequisite.courseCode || prerequisite.index} abschließen`
      : "Gesperrt";
    return `
      <article class="lesson-card ${unlocked ? "" : "is-locked"}" tabindex="0" role="button" data-lesson="${lesson.id}"
        aria-disabled="${String(!unlocked)}" aria-label="${escapeHtml(unlocked ? `${lesson.title} öffnen` : lockedLabel)}" title="${escapeHtml(unlocked ? lesson.title : lockedLabel)}">
        <span class="lesson-state ${completed ? "is-done" : ""} ${unlocked ? "" : "is-locked"}">
          <i data-lucide="${completed ? "check" : unlocked ? "book-open" : "lock-keyhole"}"></i>
        </span>
        <span class="lesson-index">${escapeHtml(lesson.courseCode || lesson.index)}</span>
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
    const unlocked = isPracticeUnlocked(practice);
    const icon = practice.type === "sql" ? "database" : practice.type === "slots" ? "network" : "circle-help";
    return `
      <article class="practice-card ${unlocked ? "" : "is-locked"}" tabindex="0" role="button" data-practice="${practice.id}"
        aria-disabled="${String(!unlocked)}" aria-label="${escapeHtml(unlocked ? `${practice.title} öffnen` : `Gesperrt: zuerst ${lesson?.courseCode || "die Lerneinheit"} freischalten`)}">
        <span class="lesson-state ${completed ? "is-done" : ""}">
          <i data-lucide="${completed ? "check" : unlocked ? icon : "lock-keyhole"}"></i>
        </span>
        <span class="practice-kind"><i data-lucide="${icon}"></i>${practiceKind(practice)}</span>
        <h3>${escapeHtml(practice.title)}</h3>
        <p>${escapeHtml(practice.description)}</p>
        <div class="exercise-meta">
          <span class="meta-pill">${escapeHtml(lesson?.courseCode || lesson?.index || "")} · ${escapeHtml(lesson?.title || "BPE6")}</span>
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
      "single-table-model": `
        <figure class="diagram-wrap opening-model" aria-label="Vom ER-Diagramm zum Relationenschema">
          <div class="opening-model-stage">
            <small>Fachliches ER-Diagramm</small>
            <div class="entity-box"><strong>fahrschueler</strong><span>schuelernr</span><span>vorname · nachname</span><span>geburtsdatum · fahrstundenzahl</span></div>
          </div>
          <i data-lucide="arrow-right" aria-hidden="true"></i>
          <div class="opening-model-stage">
            <small>Technisches Relationenschema</small>
            <div class="entity-box"><strong>fahrschueler</strong><span><b>PK</b> schuelernr INT</span><span>vorname VARCHAR(45)</span><span>geburtsdatum DATE</span><span>fahrstundenzahl INT</span></div>
          </div>
          <figcaption>Eine Tabelle genügt hier. Beziehungen zwischen Tabellen folgen im zweiten Lernfortschritt.</figcaption>
        </figure>`,
      "single-table-workbench": `
        <figure class="diagram-wrap opening-workbench" aria-label="Schritte für ein EER-Diagramm mit einer Tabelle in MySQL Workbench">
          <div class="mock-window-bar"><span></span><span></span><span></span><strong>MySQL Workbench · Model</strong></div>
          <div class="opening-workbench-body">
            <div><small>SCHEMA</small><strong>fahrschule</strong><span>Add Diagram</span><span>Table Name: fahrschueler</span></div>
            <div class="entity-box"><strong>fahrschueler</strong><span><b>PK · NN</b> schuelernr INT</span><span>nachname VARCHAR(45)</span><span>geburtsdatum DATE</span><span>fahrstundenzahl INT</span></div>
          </div>
          <figcaption>Die Modelldatei (.mwb) speichert diesen Entwurf. Die Datenbank wird erst in L1.4 erzeugt.</figcaption>
        </figure>`,
      "er-simple": `
        <div class="diagram-wrap er-diagram">
          <div class="entity-box"><strong>Fahrschüler</strong><span>schuelernr PK</span><span>nachname</span><span>vorname</span></div>
          <div class="relationship">wohnt in · 1:N</div>
          <div class="entity-box"><strong>Ort</strong><span>ortnr PK</span><span>plz</span><span>ort</span></div>
        </div>`,
      "two-table-concept": `
        <figure class="diagram-wrap er-diagram" aria-label="Fachliches ERD mit Orte, wohnt in und Fahrschüler als 1-zu-N-Beziehung">
          <div class="entity-box"><strong>Orte</strong><span>Entitätstyp</span></div>
          <div class="relationship">wohnt in · 1:N</div>
          <div class="entity-box"><strong>Fahrschüler</strong><span>Entitätstyp</span></div>
        </figure>`,
      "erm-analysis": `
        <div class="diagram-wrap erm-analysis-board" aria-label="Vom Sachtext zum Entity-Relationship-Modell">
          <div class="analysis-source"><span>Ein</span><strong>Kunde</strong><span>mietet</span><strong>ein Fahrrad</strong><span>von</span><em>Montag bis Mittwoch</em></div>
          <i data-lucide="arrow-down"></i>
          <div class="analysis-result">
            <div><small>Entitätstyp</small><strong>kunden</strong></div>
            <div><small>Beziehungsentität</small><strong>mietvertraege</strong></div>
            <div><small>Entitätstyp</small><strong>fahrraeder</strong></div>
          </div>
        </div>`,
      "cardinality-atlas": `
        <div class="diagram-wrap cardinality-atlas" aria-label="Übersicht typischer Kardinalitäten">
          <div><strong>1 : 1</strong><span>Person — Ausweis</span><small>höchstens ein Gegenstück</small></div>
          <div><strong>1 : N</strong><span>Team — Fahrer</span><small>Fremdschlüssel auf der N-Seite</small></div>
          <div><strong>M : N</strong><span>Team — Rennen</span><small>Beziehungsentität nötig</small></div>
          <div><strong>0 .. N</strong><span>optional beteiligt</span><small>kein oder viele Exemplare</small></div>
        </div>`,
      "mn-associative": `
        <div class="diagram-wrap mn-comparison" aria-label="Auflösung einer M-zu-N-Beziehung">
          <div class="mn-state is-problem">
            <span class="diagram-label">vorher</span>
            <div class="mn-row"><strong>kunden</strong><b>M : N</b><strong>fahrraeder</strong></div>
            <small>Wo liegen Zeitraum und Fremdschlüssel?</small>
          </div>
          <i data-lucide="arrow-down"></i>
          <div class="mn-state is-solved">
            <span class="diagram-label">aufgelöst</span>
            <div class="mn-row"><strong>kunden</strong><b>1 : N</b><strong>mietvertraege</strong><b>N : 1</b><strong>fahrraeder</strong></div>
            <small>Der Mietvertrag trägt beide Fremdschlüssel und den Zeitraum.</small>
          </div>
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
        </div>`,
      "table-design-flow": `
        <div class="diagram-wrap table-design-flow" role="img" aria-label="Mehrere unterschiedlich aufgebaute Kontaktkarten werden in eine einheitliche Datenbanktabelle überführt">
          <div class="contact-card-stack" aria-hidden="true">
            <div class="contact-card"><strong>Kontakt A</strong><span>Name: Abele, Andreas</span><span>Telefon: 0159...</span><span>Adresse: Ahornweg 3</span></div>
            <div class="contact-card"><strong>Kontakt B</strong><span>Name: Barbara Beutel</span><span>Mobil: 016...</span><span>Anschrift: Bahnhofstr. 52</span></div>
            <div class="contact-card"><strong>Kontakt C</strong><span>Conrad Cramer</span><span>Tel.: 0178...</span><span>Ort: Schorndorf</span></div>
          </div>
          <div class="design-flow-arrow"><i data-lucide="arrow-right"></i><span>vereinheitlichen</span></div>
          <div class="designed-table" aria-hidden="true">
            <strong>fahrschueler</strong>
            <div><b>schuelernr</b><b>nachname</b><b>vorname</b><b>ort</b></div>
            <div><span>1</span><span>Abele</span><span>Andreas</span><span>Schorndorf</span></div>
            <div><span>2</span><span>Beutel</span><span>Barbara</span><span>Stuttgart</span></div>
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
              <div class="launcher-row"><i data-lucide="database"></i><strong>MySQL Workbench 6.3.10</strong><span>Schulversion · danach öffnen</span></div>
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
        <figure class="hero-visual learning-photo">
          <img src="assets/images/learning-database-classroom.jpg" alt="Zwei Schüler vergleichen ein Datenbankmodell mit ihrer Arbeit am Laptop">
          <figcaption><i data-lucide="network"></i> Reale Situation → eERM → SQL</figcaption>
        </figure>
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
    const totalMinutes = content.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    main.innerHTML = `
      <section class="learning-path-intro">
        <div>
          <p class="eyebrow">J1 · BPE6 · ${content.course?.lessonHours || 30} Unterrichtsstunden</p>
          <h2>Dein Weg durch relationale Datenbanken</h2>
          <p>Die fünf Lernfortschritte verbinden die Inhalte und Aufgaben aus dem Unterrichtsmaterial mit konkreter Arbeit in MySQL Workbench. Jede Einheit folgt derselben Reihenfolge: verstehen, planen, umsetzen und gemeinsam prüfen.</p>
        </div>
        <div class="path-facts" aria-label="Umfang des Lernpfads">
          <span><strong>${content.modules.length}</strong><small>Lernfortschritte</small></span>
          <span><strong>${content.lessons.length}</strong><small>Lerneinheiten</small></span>
          <span><strong>${content.practices.length}</strong><small>Übungen</small></span>
          <span><strong>${Math.round(totalMinutes / 60)}</strong><small>Stunden Selbstlernzeit</small></span>
        </div>
      </section>
      <ol class="path-workflow" aria-label="Arbeitsreihenfolge">
        ${(content.course?.workflow || []).map((step, index) => `<li><span>${index + 1}</span><strong>${escapeHtml(step)}</strong></li>`).join("")}
      </ol>
      ${content.modules.map((module) => {
        const progress = moduleProgress(module);
        const moduleUnlocked = isLessonUnlocked(lessonById(module.lessonIds[0]));
        return `
          <section class="module-block ${moduleUnlocked ? "" : "is-locked"}" id="${escapeHtml(module.id)}">
            <header class="module-heading">
              <span class="module-number">${escapeHtml(module.code || module.number)}</span>
              <div>
                <p class="eyebrow">Lernfortschritt ${Number(module.number)} · ${progress.done}/${progress.total} abgeschlossen${moduleUnlocked ? "" : " · noch gesperrt"}</p>
                <h2>${escapeHtml(module.title)}</h2>
                <p>${escapeHtml(module.description)}</p>
              </div>
              <strong class="module-percent">${progress.percent}%</strong>
            </header>
            <div class="progress-line" aria-label="${progress.percent}% abgeschlossen"><span style="width:${progress.percent}%"></span></div>
            <div class="card-grid">
              ${module.lessonIds.map((id) => lessonCard(lessonById(id))).join("")}
            </div>
          </section>`;
      }).join("")}`;
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
          ${section.rules?.length ? `<ul class="rule-list">${section.rules.map((rule) => `<li>${inlineCode(rule)}</li>`).join("")}</ul>` : ""}
          ${section.definitions?.length ? `
            <dl class="lesson-definition-grid">
              ${section.definitions.map((definition) => `<div><dt>${escapeHtml(definition.term)}</dt><dd>${inlineCode(definition.definition)}</dd></div>`).join("")}
            </dl>` : ""}
          ${section.dataTypes?.length ? `
            <div class="data-table-wrap lesson-data-types">
              <table class="data-table">
                <thead><tr><th>Datentyp</th><th>Bedeutung</th><th>Speicher</th><th>Beispiel</th></tr></thead>
                <tbody>${section.dataTypes.map((type) => `<tr><th scope="row"><code>${escapeHtml(type.name)}</code></th><td>${inlineCode(type.meaning)}</td><td>${escapeHtml(type.storage)}</td><td><code>${escapeHtml(type.example)}</code></td></tr>`).join("")}</tbody>
              </table>
            </div>` : ""}
        </div>
        ${aside ? `<div>${aside}</div>` : ""}
      </section>`;
  }

  function lessonWorksheetRecord(lesson) {
    const saved = state.lessonWorksheets?.[lesson.id] || {};
    const rowCount = lesson.webWorksheet?.columnCount || 0;
    return {
      tableName: saved.tableName || "",
      definitions: { ...(saved.definitions || {}) },
      rows: Array.from({ length: rowCount }, (_, index) => ({
        name: saved.rows?.[index]?.name || "",
        type: saved.rows?.[index]?.type || "",
        length: saved.rows?.[index]?.length || "",
        primary: Boolean(saved.rows?.[index]?.primary)
      }))
    };
  }

  function renderLessonWorksheet(lesson) {
    const worksheet = lesson.webWorksheet;
    if (!worksheet) {
      return "";
    }
    const record = lessonWorksheetRecord(lesson);
    return `
      <section class="lesson-worksheet" id="arbeitsblatt">
        <header class="worksheet-heading">
          <div>
            <p class="eyebrow">Digitales Aufgabenblatt · lokal gespeichert</p>
            <h3>${escapeHtml(worksheet.title)}</h3>
            <p>${escapeHtml(worksheet.intro)}</p>
          </div>
          <i data-lucide="file-pen-line" aria-hidden="true"></i>
        </header>
        <div class="definition-answer-grid">
          ${(worksheet.definitionTerms || []).map((item) => `
            <label>
              <span>${escapeHtml(item.label)}</span>
              <small>${escapeHtml(item.prompt)}</small>
              <textarea rows="3" maxlength="1200" data-worksheet-definition="${escapeHtml(item.id)}" placeholder="In eigenen Worten ...">${escapeHtml(record.definitions[item.id] || "")}</textarea>
            </label>`).join("")}
        </div>
        ${record.rows.length ? `<div class="worksheet-table-name">
          <label for="worksheetTableName">Tabellenname</label>
          <input id="worksheetTableName" data-worksheet-table-name maxlength="40" value="${escapeHtml(record.tableName)}" placeholder="z. B. fahrschueler">
          <small>Kleinbuchstaben, Plural, keine Leerzeichen, Umlaute oder Sonderzeichen.</small>
        </div>
        <div class="data-table-wrap worksheet-table-wrap">
          <table class="data-table worksheet-table">
            <thead><tr><th>Nr.</th><th>Attributname</th><th>Datentyp</th><th>max. Zeichenanzahl</th><th>Primärschlüssel</th></tr></thead>
            <tbody>
              ${record.rows.map((row, index) => `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td><input data-worksheet-row="${index}" data-worksheet-field="name" maxlength="40" value="${escapeHtml(row.name)}" aria-label="Attributname ${index + 1}"></td>
                  <td>
                    <select data-worksheet-row="${index}" data-worksheet-field="type" aria-label="Datentyp ${index + 1}">
                      <option value="">auswählen</option>
                      ${(worksheet.dataTypes || []).map((type) => `<option value="${escapeHtml(type)}" ${row.type === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}
                    </select>
                  </td>
                  <td><input inputmode="numeric" data-worksheet-row="${index}" data-worksheet-field="length" maxlength="5" value="${escapeHtml(row.length)}" aria-label="Maximale Zeichenanzahl ${index + 1}"></td>
                  <td><input type="radio" name="worksheet-primary-${escapeHtml(lesson.id)}" data-worksheet-row="${index}" data-worksheet-field="primary" ${row.primary ? "checked" : ""} aria-label="Attribut ${index + 1} als Primärschlüssel"></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>` : ""}
        <div class="callout worksheet-hint"><i data-lucide="circle-help"></i><p>${inlineCode(worksheet.hint)}</p></div>
      </section>`;
  }

  function renderLessonNotes(lesson) {
    return `
      <section class="lesson-notes" id="notizen">
        <div>
          <p class="eyebrow">Eigene Zusammenfassung</p>
          <h3>Was nehme ich aus ${escapeHtml(lesson.courseCode || `Lektion ${lesson.index}`)} mit?</h3>
          <p>Formuliere die wichtigsten Zusammenhänge in deinen eigenen Worten. Deine Notizen werden lokal gespeichert und in die JSON-Sicherung aufgenommen.</p>
          ${lesson.notePrompts?.length ? `<ul>${lesson.notePrompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}</ul>` : ""}
        </div>
        <label class="sr-only" for="lessonNotes">Eigene Zusammenfassung</label>
        <textarea id="lessonNotes" data-lesson-note="${escapeHtml(lesson.id)}" rows="8" maxlength="12000" placeholder="Meine wichtigsten Erkenntnisse ...">${escapeHtml(state.lessonNotes?.[lesson.id] || "")}</textarea>
      </section>`;
  }

  function renderClassroomTask(lesson) {
    const task = lesson.classroomTask;
    if (!task) {
      return "";
    }
    const relatedPractices = content.practices.filter((practice) => practice.lessonId === lesson.id);
    return `
      <section class="classroom-task" id="praxisauftrag">
        <div class="classroom-task-heading">
          <div>
            <p class="eyebrow">Praxisauftrag · ${escapeHtml(task.tool || "Unterricht")}</p>
            <h3>${escapeHtml(task.title)}</h3>
            <p>${escapeHtml(task.intro)}</p>
          </div>
          <i data-lucide="monitor-cog" aria-hidden="true"></i>
        </div>
        <ol class="classroom-task-steps">
          ${(task.steps || []).map((step, index) => `<li><span>${index + 1}</span><p>${inlineCode(step)}</p></li>`).join("")}
        </ol>
        <dl class="task-deliverable">
          <div><dt>Lernprodukt</dt><dd>${escapeHtml(task.evidence)}</dd></div>
          ${task.fileName ? `<div><dt>Dateiname</dt><dd><code>${escapeHtml(task.fileName)}</code></dd></div>` : ""}
        </dl>
        ${task.download ? `<a class="button button-secondary task-download" href="${escapeHtml(task.download.href)}" download><i data-lucide="download" aria-hidden="true"></i>${escapeHtml(task.download.label)}</a>` : ""}
        ${relatedPractices.length ? `
          <div class="task-practice-links" aria-label="Passende Browserübungen">
            ${relatedPractices.map((practice) => `<button class="button button-secondary" type="button" data-practice="${escapeHtml(practice.id)}"><i data-lucide="flask-conical"></i>${escapeHtml(practice.title)}</button>`).join("")}
          </div>` : ""}
      </section>`;
  }

  function renderLessonSources(lesson) {
    if (!lesson.sourceMaterials?.length) {
      return "";
    }
    return `
      <details class="source-disclosure">
        <summary><span><i data-lucide="library"></i>Materialbezug dieser Einheit</span><i data-lucide="chevron-down"></i></summary>
        <div>
          <p>Die Einheit wurde eigenständig und webgerecht aus folgenden lokalen BPE6-Unterlagen abgeleitet. Originaldateien und Lösungen bleiben außerhalb der veröffentlichten Homepage.</p>
          <ul>${lesson.sourceMaterials.map((source) => `<li>${escapeHtml(source)}</li>`).join("")}</ul>
        </div>
      </details>`;
  }

  function renderLessonCompletion(lesson) {
    const completed = state.completedLessons.includes(lesson.id);
    const record = lessonProgressRecord(lesson);
    const checks = completed ? lesson.completionChecks.map(() => true) : record.checks;
    const teacherChecked = completed || record.teacherChecked;
    const quizPassed = completed || record.quizPassed;
    return `
      <section class="lesson-completion" id="abschluss">
        <div class="lesson-completion-head">
          <div>
            <p class="eyebrow">Abschluss und Punkte</p>
            <h3>${escapeHtml(lesson.courseCode || `Lektion ${lesson.index}`)} abschließen</h3>
            <p>Die Lektions-XP werden erst nach fachlicher Selbstkontrolle, bestandenem Kurzcheck und Bestätigung durch die Lehrkraft gutgeschrieben.</p>
          </div>
          <span class="completion-xp"><i data-lucide="sparkles"></i>${lesson.xp} XP</span>
        </div>
        <div class="completion-checks">
          ${(lesson.completionChecks || []).map((label, index) => `
            <label>
              <input type="checkbox" data-lesson-check="${index}" ${checks[index] ? "checked" : ""} ${completed ? "disabled" : ""}>
              <span>${escapeHtml(label)}</span>
            </label>`).join("")}
          <label class="quiz-check ${quizPassed ? "is-ready" : ""}">
            <input type="checkbox" ${quizPassed ? "checked" : ""} disabled>
            <span>Der Verständnischeck auf dieser Seite ist richtig beantwortet.</span>
          </label>
          <label class="teacher-check">
            <input type="checkbox" data-lesson-teacher ${teacherChecked ? "checked" : ""} ${completed ? "disabled" : ""}>
            <span>Die Lehrkraft hat mein Lernprodukt gesehen, mit mir besprochen und als fachlich passend bestätigt.</span>
          </label>
        </div>
        <button class="button ${completed ? "button-secondary" : "button-primary"} button-complete-lesson" type="button" data-complete-lesson="${lesson.id}" ${completed ? "disabled" : ""}>
          <i data-lucide="${completed ? "badge-check" : "check"}"></i>
          ${completed ? "Einheit abgeschlossen" : "Einheit abschließen"}
        </button>
        <p class="completion-note">${state.name ? `Lernprofil ${escapeHtml(state.name)} · lokal auf diesem Browser gespeichert` : "Lege zuerst dein anonymisiertes Lernprofil im Seitenmenü an."}</p>
      </section>`;
  }

  function renderLesson(id) {
    const lesson = lessonById(id);
    if (!lesson) {
      go("path");
      return;
    }
    if (!isLessonUnlocked(lesson)) {
      const prerequisite = lessonPrerequisite(lesson);
      go("path");
      window.setTimeout(() => toast(`Zuerst ${prerequisite?.courseCode || "die vorherige Einheit"} abschließen.`, "error"), 0);
      return;
    }
    const module = moduleById(lesson.module);
    const breadcrumb = `Lernfortschritt ${Number(module?.number || 1)} > ${lesson.courseCode || `Lektion ${lesson.index}`}`;
    state.lastLessonId = lesson.id;
    saveState();
    setHeading(breadcrumb, lesson.title);
    document.querySelector("#viewEyebrow").innerHTML = lessonBreadcrumb(module, lesson);
    activateNav("path");
    const completed = state.completedLessons.includes(lesson.id);
    const practice = practiceById(lesson.practiceId);
    main.innerHTML = `
      <article class="lesson-detail">
        <header class="lesson-head">
          <div>
            <p class="eyebrow">${lessonBreadcrumb(module, lesson)} · ${escapeHtml(module?.title || "BPE6")}</p>
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
        <ol class="lesson-workflow" aria-label="Arbeitsreihenfolge der Einheit">
          ${(lesson.workflow || content.course?.workflow || []).map((step, index) => `
            <li class="${completed || (index === 0) ? "is-active" : ""}">
              <span>${index + 1}</span><div><strong>${escapeHtml(step)}</strong><small>${(lesson.workflowHints || ["Grundlagen lesen", "Vorgehen festlegen", "Auftrag umsetzen", "Lehrkraft bestätigt"])[index] || ""}</small></div>
            </li>`).join("")}
        </ol>
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
              <p>${completed ? "Diese Einheit ist abgeschlossen. Quiz und Übung kannst du jederzeit wiederholen." : "Lies die Erklärung, bearbeite den Praxisauftrag und schließe die Einheit nach der Besprechung mit deiner Lehrkraft ab."}</p>
            </div>
          </section>
          ${lesson.sections.map(renderLessonSection).join("")}
          ${renderLessonWorksheet(lesson)}
          ${renderClassroomTask(lesson)}
          ${renderLessonNotes(lesson)}
          ${renderLessonQuiz(lesson)}
          ${renderLessonSources(lesson)}
          ${renderLessonCompletion(lesson)}
        </div>
      </article>`;
  }

  function renderLessonQuiz(lesson) {
    const passed = state.passedLessonQuizzes.includes(lesson.id) || state.completedLessons.includes(lesson.id);
    return `
      <section class="quiz-panel">
        <p class="eyebrow">Verständnischeck ${passed ? "· bestanden" : ""}</p>
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
            ${passed ? "Erneut prüfen" : "Antwort prüfen"}
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
      <section class="section-band sql-intro-band">
        <div class="sql-intro-copy">
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
        <figure class="learning-photo sql-learning-photo">
          <img src="assets/images/sql-lab.jpg" alt="Ein Schüler testet eine Abfrage und kontrolliert die Ergebnistabelle am Laptop">
          <figcaption><i data-lucide="scan-search"></i> Code und Ergebnis gemeinsam prüfen</figcaption>
        </figure>
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
    const modelingLessonIds = [
      "eerm-grundlagen",
      "erm-sachtext-analyse",
      "erm-kardinalitaeten",
      "erm-beziehungsentitaet",
      "fremdschluessel-integritaet",
      "mn-beziehungen",
      "redundanz-3nf",
      "normalisierung"
    ];
    const ermLessons = modelingLessonIds.map(lessonById).filter(Boolean);
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
        <figure class="hero-visual learning-photo modeling-photo">
          <img src="assets/images/eerm-workshop.jpg" alt="Eine Lerngruppe ordnet Entitäten und Beziehungen für eine Fahrradvermietung">
          <figcaption><i data-lucide="boxes"></i> Gemeinsam vom Sachtext zum Modell</figcaption>
        </figure>
      </section>
      <div class="section-heading">
        <div>
          <p class="eyebrow">Geführter Schwerpunkt</p>
          <h2>eERM-Werkstatt</h2>
          <p>Vom Sachtext über Kardinalitäten und Beziehungsentitäten bis zum ausführbaren Workbench-Modell.</p>
        </div>
      </div>
      <div class="card-grid two">
        ${ermLessons.map(lessonCard).join("")}
      </div>
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
    if (!isPracticeUnlocked(practice)) {
      const prerequisite = lessonPrerequisite(lesson);
      go("path");
      window.setTimeout(() => toast(`Zuerst ${prerequisite?.courseCode || "die vorherige Einheit"} abschließen.`, "error"), 0);
      return;
    }
    setHeading(practiceKind(practice), practice.title);
    activateNav(practice.type === "sql" ? "sql" : "modeling");
    if (practice.type === "sql") {
      renderSqlPractice(practice, lesson);
    } else if (practice.type === "diagram") {
      renderDiagramPractice(practice, lesson);
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
          <p class="eyebrow">${escapeHtml(lesson?.courseCode || lesson?.index || "")} · ${escapeHtml(lesson?.title || "BPE6")}</p>
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
              <button class="button button-secondary coach-button" type="button" id="coachSqlButton">
                <i data-lucide="message-circle-question"></i>
                Coach-Tipp
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
              <button class="runner-tab" type="button" data-runner-tab="coach">SQL-Coach</button>
              <button class="runner-tab" type="button" data-runner-tab="hint">Hinweise</button>
            </div>
            <div class="runner-panel is-active" data-runner-panel="result">
              <div id="sqlOutput" class="console-output">Noch keine Abfrage ausgeführt.</div>
              <div class="result-banner" id="practiceResult"></div>
            </div>
            <div class="runner-panel" data-runner-panel="coach">
              <div class="sql-coach is-idle" id="sqlCoach">
                <div class="sql-coach-head">
                  <div><i data-lucide="scan-search"></i><span><small>Lokale Analyse</small><strong>SQL-Coach</strong></span></div>
                  <span class="local-badge"><i data-lucide="shield-check"></i>ohne Cloud</span>
                </div>
                <p>Führe deinen Entwurf aus oder fordere einen Coach-Tipp an. Dein SQL-Code bleibt auf diesem Gerät.</p>
              </div>
            </div>
            <div class="runner-panel" data-runner-panel="hint">
              <ul class="plain-list">
                ${(practice.hints || []).map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}
              </ul>
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

  function diagramSlotSelect(practice, slotId, answers) {
    const slot = practice.slots.find((item) => item.id === slotId);
    if (!slot) {
      return "";
    }
    return `
      <label class="diagram-select-wrap">
        <span>${escapeHtml(slot.label)}</span>
        <select data-slot-id="${escapeHtml(slot.id)}" name="${escapeHtml(slot.id)}" aria-label="${escapeHtml(slot.label)}">
          <option value="">Bitte wählen ...</option>
          ${slot.options.map((option) => `<option value="${escapeHtml(option)}" ${answers[slot.id] === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>`;
  }

  function renderDiagramPractice(practice, lesson) {
    const answers = state.slotDrafts[practice.id] || {};
    const completed = state.completedPractices.includes(practice.id);
    main.innerHTML = `
      <article class="lesson-detail">
        ${renderPracticeHeader(practice, lesson)}
        <div class="lesson-body">
          <section class="practice-panel diagram-practice-panel">
            <p>${escapeHtml(practice.prompt)}</p>
            <form id="diagramPracticeForm" data-practice-id="${practice.id}">
              <figure class="diagram-practice-canvas">
                <figcaption>${escapeHtml(practice.diagram.caption)}</figcaption>
                <div class="diagram-chain">
                  ${practice.diagram.chain.map((item) => {
                    if (item.type === "relation") {
                      return `
                        <div class="diagram-relation-control">
                          <span>${escapeHtml(item.label)}</span>
                          ${diagramSlotSelect(practice, item.slotId, answers)}
                        </div>`;
                    }
                    return `
                      <div class="diagram-entity-box">
                        <header><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.role || "Entitätstyp")}</small></header>
                        <div>
                          ${item.attributes.map((attribute) => typeof attribute === "string"
                            ? `<span>${escapeHtml(attribute)}</span>`
                            : diagramSlotSelect(practice, attribute.slotId, answers)).join("")}
                        </div>
                      </div>`;
                  }).join("")}
                </div>
              </figure>
              <button class="button button-primary" type="submit">
                <i data-lucide="check"></i>
                Diagramm prüfen
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
          <p>In der Schule arbeiten wir mit MySQL Workbench 6.3.10. Zu Hause kann der Informatikstick eine andere Workbench-Version anbieten; die Schritte bleiben grundsätzlich gleich.</p>
        </div>
      </div>
      <section class="start-sequence" aria-label="Startreihenfolge für den Unterricht">
        <div class="start-sequence-head">
          <i data-lucide="route"></i>
          <div><span>Sicherer Start</span><strong>Vom Stick zur ersten Abfrage</strong></div>
        </div>
        <ol>
          <li><span>01</span><i data-lucide="play"></i><div><strong>Stick starten</strong><small>Play-Symbol „Start“ öffnen</small></div></li>
          <li><span>02</span><i data-lucide="power"></i><div><strong>MySQL starten</strong><small>Doppelklick; CMD offen lassen</small></div></li>
          <li><span>03</span><i data-lucide="panels-top-left"></i><div><strong>Workbench öffnen</strong><small>In der Schule: 6.3.10</small></div></li>
          <li><span>04</span><i data-lucide="plug-zap"></i><div><strong>Verbindung testen</strong><small>Dann Modell oder SQL bearbeiten</small></div></li>
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

      <section class="connection-guide" aria-labelledby="connection-guide-title">
        <div>
          <p class="eyebrow">Erste Sitzung in MySQL Workbench</p>
          <h2 id="connection-guide-title">Lokale Verbindung einrichten</h2>
          <p>Warte im Konsolenfenster des Sticks auf „ready for connections“. Das Fenster bleibt geöffnet. In Workbench kannst du eine vorhandene Verbindung <strong>local</strong> öffnen oder über das Pluszeichen bei <strong>MySQL Connections</strong> eine neue anlegen.</p>
          <ol>
            <li>Wähle <strong>Standard (TCP/IP)</strong>. Für die gezeigte lokale Stick-Umgebung sind <code>127.0.0.1</code> und Port <code>3306</code> die Ausgangswerte; prüfe sie am Schul-PC mit der Lehrkraft.</li>
            <li>Trage den für die lokale Datenbank vorgesehenen Benutzernamen ein. Auf dem Beispielbild ist das <code>root</code>. Verwende hierfür <strong>nicht</strong> dein Windows- oder Microsoft-365-Passwort.</li>
            <li>Klicke <strong>Test Connection</strong>, speichere eine funktionierende Verbindung und öffne sie. Prüfe im SQL-Editor mit <code>SELECT VERSION();</code>, ob der Server antwortet.</li>
          </ol>
          <p class="connection-guide-note"><i data-lucide="info"></i><span>Der Stick kann intern MariaDB starten, obwohl der Menüpunkt „MySQL starten“ heißt. Eine Versions- oder Kompatibilitätswarnung in Workbench 8 ist nicht dasselbe wie eine fehlgeschlagene Verbindung. Bei Fehlern zuerst Dienst, Adresse, Port und Zugangsdaten mit der Lehrkraft prüfen.</span></p>
        </div>
        <div class="connection-guide-example" aria-label="Beispiel einer lokalen Workbench-Verbindung">
          <div class="connection-example-head"><i data-lucide="database-zap"></i><strong>MySQL Connections</strong><span>local</span></div>
          <dl>
            <div><dt>Verfahren</dt><dd>Standard (TCP/IP)</dd></div>
            <div><dt>Hostname</dt><dd><code>127.0.0.1</code></dd></div>
            <div><dt>Port</dt><dd><code>3306</code></dd></div>
            <div><dt>Benutzer</dt><dd><code>root</code> <small>nur Beispiel</small></dd></div>
          </dl>
          <div class="connection-example-query"><i data-lucide="square-terminal"></i><code>SELECT VERSION();</code><i data-lucide="check-circle-2"></i></div>
        </div>
      </section>

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

  const sqlCoachPatterns = {
    select: ["SELECT verwenden", "Beginne die Abfrage mit SELECT und nenne danach die gewünschten Ausgabespalten."],
    from: ["Datenquelle nennen", "Mit FROM legst du fest, aus welcher Tabelle gelesen wird."],
    nachname: ["Spalte nachname", "Nimm die Spalte nachname in die Abfrage auf."],
    vorname: ["Spalte vorname", "Nimm die Spalte vorname in die Abfrage auf."],
    where: ["Datensätze filtern", "Formuliere die Auswahlbedingung nach WHERE."],
    "order\\s+by": ["Ergebnis sortieren", "Ergänze ORDER BY am Ende der Abfrage."],
    desc: ["Absteigend sortieren", "DESC steht direkt hinter der Sortierspalte."],
    "select\\s+distinct": ["Doppelte Ausgaben vermeiden", "DISTINCT steht direkt hinter SELECT."],
    like: ["Textmuster prüfen", "Nutze LIKE zusammen mit einem Muster in einfachen Anführungszeichen."],
    or: ["Alternativen verbinden", "Verbinde die beiden möglichen Namensanfänge mit OR."],
    "count\\s*\\(": ["Datensätze zählen", "COUNT(...) zählt die Datensätze jeder Gruppe."],
    "group\\s+by": ["Gruppen bilden", "GROUP BY steht nach WHERE und vor HAVING."],
    having: ["Gruppen filtern", "Eine Bedingung auf ein Aggregatergebnis gehört in HAVING."],
    "month\\s*\\(": ["Monat berechnen", "MONTH(geburtsdatum) liefert die Monatszahl."],
    "year\\s*\\(": ["Jahr prüfen", "YEAR(geburtsdatum) kann in der WHERE-Bedingung verglichen werden."],
    "insert\\s+into": ["Datensatz einfügen", "INSERT INTO nennt zuerst die Zieltabelle und ihre Spalten."],
    values: ["Werte angeben", "VALUES enthält die Werte in derselben Reihenfolge wie die Spaltenliste."],
    "create\\s+table": ["Tabelle anlegen", "CREATE TABLE nennt Tabellenname, Spalten und ihre Regeln."],
    "primary\\s+key": ["Primärschlüssel festlegen", "Kennzeichne die eindeutige Identifikation mit PRIMARY KEY."],
    "not\\s+null": ["Pflichtfeld festlegen", "NOT NULL verhindert einen fehlenden Wert in dieser Spalte."],
    update: ["Datensatz ändern", "UPDATE nennt die Tabelle, deren vorhandene Zeilen geändert werden."],
    set: ["Neuen Wert zuweisen", "SET weist einer Spalte den neuen Wert oder Ausdruck zu."],
    "delete\\s+from": ["Datensatz löschen", "DELETE FROM nennt die Tabelle; die WHERE-Bedingung begrenzt die Zielmenge."],
    "schuelernr\\s*=\\s*5": ["Änderung eingrenzen", "Begrenze das UPDATE mit der eindeutigen Schülernummer 5."],
    "schuelernr\\s*=\\s*10": ["Löschung eingrenzen", "Begrenze das DELETE mit der eindeutigen Schülernummer 10."],
    join: ["Tabellen verbinden", "JOIN ergänzt die zweite Tabelle; danach folgt die ON-Bedingung."],
    on: ["Schlüssel zuordnen", "ON verbindet passende Primär- und Fremdschlüssel."],
    "sum\\s*\\(": ["Werte summieren", "SUM(stundenzahl) berechnet die Summe innerhalb jeder Gruppe."],
    "join\\s+kunden": ["Kunden verbinden", "Verbinde mietvertraege über kundennr mit kunden."],
    "join\\s+fahrraeder": ["Fahrräder verbinden", "Verbinde mietvertraege über fahrradnr mit fahrraeder."],
    "datediff\\s*\\(": ["Mietdauer berechnen", "DATEDIFF erhält zuerst das Enddatum und danach das Startdatum."],
    "select\\s+\\*": ["Gezielte Spaltenauswahl", "Ersetze SELECT * durch die ausdrücklich geforderten Spalten."]
  };

  function sqlPatternInfo(pattern, forbidden = false) {
    const known = sqlCoachPatterns[pattern];
    if (known) {
      return { label: known[0], hint: known[1] };
    }
    return {
      label: forbidden ? "Unzulässigen Bestandteil entfernen" : "Aufgabenbestandteil ergänzen",
      hint: forbidden
        ? "Entferne einen Bestandteil, den die Aufgabe ausdrücklich ausschließt."
        : "Vergleiche deinen Aufbau mit der Aufgabenstellung und den Hinweisen."
    };
  }

  function checkSqlPatterns(sql, check) {
    const problems = [];
    (check.required || []).forEach((pattern) => {
      if (!new RegExp(pattern, "i").test(sql)) {
        problems.push({ pattern, ...sqlPatternInfo(pattern) });
      }
    });
    (check.forbidden || []).forEach((pattern) => {
      if (new RegExp(pattern, "i").test(sql)) {
        problems.push({ pattern, forbidden: true, ...sqlPatternInfo(pattern, true) });
      }
    });
    return problems;
  }

  function translateSqlError(error) {
    const message = String(error?.message || error || "");
    let match = message.match(/no such table:\s*([^\s]+)/i);
    if (match) {
      return `Die Tabelle ${match[1]} gehört nicht zum Übungsschema. Prüfe FROM und JOIN rechts neben dem Editor.`;
    }
    match = message.match(/no such column:\s*([^\s]+)/i);
    if (match) {
      return `Die Spalte ${match[1]} wurde nicht gefunden. Prüfe Schreibweise, Tabellenalias und Schema.`;
    }
    match = message.match(/ambiguous column name:\s*([^\s]+)/i);
    if (match) {
      return `Die Spalte ${match[1]} kommt in mehreren Tabellen vor. Setze den passenden Alias davor, zum Beispiel f.${match[1]}.`;
    }
    match = message.match(/near\s+"([^"]+)":\s*syntax error/i);
    if (match) {
      return `In der Nähe von „${match[1]}“ stimmt der Satzbau noch nicht. Prüfe die Klausel direkt davor und fehlende Kommas oder Ausdrücke.`;
    }
    if (/incomplete input/i.test(message)) {
      return "Die Anweisung ist noch unvollständig. Prüfe offene Klammern und Klauseln wie WHERE, ON oder HAVING ohne Bedingung.";
    }
    if (/unique constraint failed/i.test(message)) {
      return "Ein Primär- oder eindeutiger Schlüssel ist bereits vergeben. Verwende einen noch nicht vorhandenen Wert.";
    }
    if (/foreign key constraint failed/i.test(message)) {
      return "Ein Fremdschlüssel verweist auf keinen vorhandenen Datensatz der Parent-Tabelle.";
    }
    return message || "Die SQL-Anweisung konnte nicht ausgeführt werden. Prüfe Syntax, Tabellen und Spalten.";
  }

  function coachItem(status, title, detail) {
    return { status, title, detail };
  }

  function buildSqlCoachItems(practice, sql, actual, expected, patternProblems) {
    const items = [coachItem("success", "SQL ist ausführbar", `Die Datenbank hat die Anweisung verarbeitet und ${actual.values.length} Ergebniszeile${actual.values.length === 1 ? "" : "n"} geliefert.`)];
    if (patternProblems.length) {
      items.push(coachItem("warning", patternProblems[0].label, patternProblems[0].hint));
    } else {
      items.push(coachItem("success", "Aufbau passt zur Aufgabe", "Alle geforderten SQL-Bestandteile sind erkennbar und ausgeschlossene Abkürzungen wurden vermieden."));
    }

    const exactRows = sameTable(actual, expected, practice.check.orderSensitive);
    const sameRowsWithoutOrder = sameTable(actual, expected, false);
    if (exactRows) {
      items.push(coachItem("success", "Ergebnismenge stimmt", "Zeilen, Werte und die geforderte Reihenfolge passen zur Aufgabenprüfung."));
    } else if (practice.check.orderSensitive && sameRowsWithoutOrder) {
      items.push(coachItem("warning", "Werte stimmen, Reihenfolge noch nicht", "Prüfe ORDER BY, die Sortierspalte und gegebenenfalls ASC oder DESC."));
    } else if (actual.columns.length !== expected.columns.length) {
      items.push(coachItem("warning", "Anzahl der Spalten weicht ab", `Dein Ergebnis hat ${actual.columns.length}, erwartet werden ${expected.columns.length} Ausgabespalten.`));
    } else if (actual.values.length > expected.values.length) {
      items.push(coachItem("warning", "Zu viele Ergebniszeilen", "Schärfe die WHERE-, HAVING- oder JOIN-Bedingung. Prüfe bei JOIN besonders die Schlüsselzuordnung in ON."));
    } else if (actual.values.length < expected.values.length) {
      items.push(coachItem("warning", "Zu wenige Ergebniszeilen", "Eine Bedingung filtert zu stark oder eine JOIN-Bedingung verliert passende Datensätze."));
    } else {
      items.push(coachItem("warning", "Werte noch vergleichen", "Die Zeilenanzahl passt, aber mindestens ein Wert weicht ab. Prüfe ausgewählte Spalten, Berechnungen und Bedingungen."));
    }

    const actualColumns = actual.columns.map((column) => String(column).toLowerCase());
    const expectedColumns = expected.columns.map((column) => String(column).toLowerCase());
    if (JSON.stringify(actualColumns) !== JSON.stringify(expectedColumns)) {
      items.push(coachItem("info", "Spaltenüberschriften prüfen", "Die Daten können stimmen, aber Reihenfolge oder Aliasnamen der Ausgabespalten unterscheiden sich noch."));
    }
    return items;
  }

  function activateRunnerPanel(name) {
    document.querySelectorAll("[data-runner-tab]").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.runnerTab === name);
    });
    document.querySelectorAll("[data-runner-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.runnerPanel === name);
    });
  }

  function setSqlCoach(items, summary, activate = false) {
    const coach = document.querySelector("#sqlCoach");
    if (!coach) {
      return;
    }
    coach.className = "sql-coach";
    coach.innerHTML = `
      <div class="sql-coach-head">
        <div><i data-lucide="scan-search"></i><span><small>Lokale Analyse</small><strong>SQL-Coach</strong></span></div>
        <span class="local-badge"><i data-lucide="shield-check"></i>ohne Cloud</span>
      </div>
      <p>${escapeHtml(summary)}</p>
      <ul class="coach-checklist">
        ${items.map((item) => `
          <li class="is-${item.status}">
            <i data-lucide="${item.status === "success" ? "circle-check" : item.status === "info" ? "info" : "lightbulb"}"></i>
            <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></div>
          </li>`).join("")}
      </ul>`;
    if (activate) {
      activateRunnerPanel("coach");
    }
    renderIcons();
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
    activateRunnerPanel("result");
  }

  async function runSqlPractice(mode = "run") {
    const practice = practiceById(parseRoute().id);
    const editor = document.querySelector("#sqlEditor");
    const runButton = document.querySelector("#runSqlButton");
    const coachButton = document.querySelector("#coachSqlButton");
    const checkButton = document.querySelector("#checkSqlButton");
    if (!practice || !editor) {
      return;
    }
    const checkSolution = mode === "check";
    const useCoach = mode === "coach" || checkSolution;
    runButton.disabled = true;
    coachButton.disabled = true;
    checkButton.disabled = true;
    setSqlOutput(`<div class="console-output">SQL arbeitet ...</div>`);
    let db;
    let expectedDb;
    try {
      const sql = editor.value.trim();
      if (!sql) {
        throw new Error("Schreibe zuerst eine SQL-Anweisung.");
      }
      const patternProblems = useCoach ? checkSqlPatterns(sql, practice.check) : [];
      db = await createDatabase(practice.schema);
      let table;
      if (practice.check.type === "mutation") {
        db.run(sql);
        table = tableFromResult(db.exec(practice.check.verifySql));
      } else {
        table = tableFromResult(db.exec(sql));
      }
      setSqlOutput(renderDataTable(table));

      if (!useCoach) {
        setSqlCoach(
          [coachItem("success", "SQL ist ausführbar", `Die Anweisung liefert ${table.values.length} Ergebniszeile${table.values.length === 1 ? "" : "n"}.`) ],
          "Die Ausführung war technisch erfolgreich. Fordere einen Coach-Tipp an, um Aufbau und Ergebnismenge mit der Aufgabe abzugleichen."
        );
        return;
      }

      let passed = patternProblems.length === 0;
      let expected;
      if (practice.check.type === "query") {
        expectedDb = await createDatabase(practice.schema);
        expected = tableFromResult(expectedDb.exec(practice.check.expectedSql));
        passed = passed && sameTable(table, expected, practice.check.orderSensitive);
      } else {
        expected = practice.check.expected;
        passed = passed && sameTable(table, expected, true);
      }

      const coachItems = buildSqlCoachItems(practice, sql, table, expected, patternProblems);
      setSqlCoach(
        coachItems,
        passed
          ? "Dein Entwurf erfüllt die fachlichen und technischen Kriterien dieser Aufgabe."
          : "Der Coach zeigt dir den nächsten sinnvollen Prüfschritt, ohne die Musterlösung einzusetzen.",
        true
      );

      if (passed) {
        if (checkSolution) {
          const firstCompletion = award("practice", practice.id, practice.xp);
          showBanner("#practiceResult", true, "Aufgabe gelöst", firstCompletion
            ? `${practice.xp} XP wurden gutgeschrieben.`
            : "Deine Lösung besteht die Prüfung weiterhin.");
        }
      } else if (checkSolution) {
        showBanner("#practiceResult", false, "Noch nicht ganz", patternProblems[0]?.hint || "Öffne den SQL-Coach für den nächsten gezielten Prüfschritt.");
      }
    } catch (error) {
      const translated = translateSqlError(error);
      setSqlOutput(`<div class="console-output"><strong>SQL-Meldung</strong><br>${escapeHtml(error.message || "Die SQL-Anweisung konnte nicht ausgeführt werden.")}</div>`);
      if (useCoach) {
        const sql = editor.value.trim();
        const patternProblems = sql ? checkSqlPatterns(sql, practice.check) : [];
        const items = [coachItem("warning", "Noch nicht ausführbar", translated)];
        if (patternProblems.length) {
          items.push(coachItem("info", patternProblems[0].label, patternProblems[0].hint));
        }
        setSqlCoach(items, "Der Fehler wurde lokal in einen konkreten nächsten Prüfschritt übersetzt.", true);
      }
      if (checkSolution) {
        showBanner("#practiceResult", false, "SQL-Fehler", translated);
      }
    } finally {
      expectedDb?.close();
      db?.close();
      runButton.disabled = false;
      coachButton.disabled = false;
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

  function stableStringify(value) {
    if (Array.isArray(value)) {
      return `[${value.map(stableStringify).join(",")}]`;
    }
    if (value && typeof value === "object") {
      return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
  }

  async function sha256Hex(value) {
    if (!globalThis.crypto?.subtle || !globalThis.TextEncoder) {
      throw new Error("Dieser Browser unterstützt die SHA-256-Prüfsumme nicht");
    }
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function exportFileName() {
    return `workbenchlab-${safeFilePart(state.className)}-${safeFilePart(state.name)}-geraet-${shortIdentity(deviceIdentity.id)}-${todayKey()}.json`;
  }

  async function backupPayload() {
    const exportedAt = new Date().toISOString();
    const payload = {
      app: backupAppId,
      formatVersion: backupFormatVersion,
      appVersion: content.version,
      exportedAt,
      exportId: createOpaqueId("export"),
      identity: {
        studentCode: state.name,
        studentClass: state.className,
        profileId: state.profileId,
        profileCode: shortIdentity(state.profileId),
        profileCreatedAt: state.profileCreatedAt,
        profileOriginDeviceId: state.profileDeviceId,
        profileOriginDeviceCode: shortIdentity(state.profileDeviceId),
        deviceId: deviceIdentity.id,
        deviceCode: shortIdentity(deviceIdentity.id),
        deviceCreatedAt: deviceIdentity.createdAt,
        environment: deviceEnvironment(),
        networkIdentifiers: {
          macAddress: null,
          ipAddress: null,
          status: "Vom Browser einer statischen Website nicht zuverlässig und datenschutzgerecht ermittelbar."
        }
      },
      summary: {
        xp: stateXp(),
        completedLessons: state.completedLessons.length,
        completedTasks: state.completedPractices.length + state.completedCommands.length
      },
      data: state
    };
    return {
      ...payload,
      integrity: {
        algorithm: "SHA-256",
        scope: "vollständiger Export ohne integrity-Block",
        digest: await sha256Hex(stableStringify(payload))
      }
    };
  }

  async function verifyBackupIntegrity(parsed) {
    if (parsed.formatVersion < 3) {
      return { verified: false, legacy: true };
    }
    if (parsed.integrity?.algorithm !== "SHA-256" || !/^[a-f0-9]{64}$/.test(parsed.integrity?.digest || "")) {
      throw new Error("Die Sicherung enthält keine gültige SHA-256-Prüfsumme");
    }
    const { integrity, ...payload } = parsed;
    const expected = await sha256Hex(stableStringify(payload));
    if (expected !== integrity.digest) {
      throw new Error("Die Prüfsumme stimmt nicht. Die Sicherung wurde verändert oder beschädigt");
    }
    return { verified: true, legacy: false };
  }

  function updateBackupSummary() {
    const summary = document.querySelector("#backupSummary");
    if (!summary) {
      return;
    }
    summary.innerHTML = `
      <div><strong>${escapeHtml(state.name || "Noch offen")}</strong><small>Schülerkürzel</small></div>
      <div><strong>${escapeHtml(state.className || "Noch offen")}</strong><small>Klasse</small></div>
      <div><strong>${escapeHtml(shortIdentity(deviceIdentity.id))}</strong><small>Gerätecode</small></div>
      <div><strong>${escapeHtml(shortIdentity(state.profileDeviceId))}</strong><small>Profil-Herkunft</small></div>
      <div><strong>${stateXp()} XP</strong><small>Erfahrung</small></div>
      <div><strong>${state.completedPractices.length + state.completedCommands.length}</strong><small>Aufgaben</small></div>`;
  }

  async function exportProgress() {
    if (!isValidStudentCode(state.name) || !isValidClassName(state.className)) {
      backupDialog.close();
      openProfileDialog("Lege vor dem Export Schülerkürzel und Klasse vollständig fest.");
      return;
    }
    const json = JSON.stringify(await backupPayload(), null, 2);
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
      const integrity = await verifyBackupIntegrity(parsed);
      const importedState = normalizeState(parsed.data);
      if (parsed.formatVersion >= 2) {
        if (!isValidStudentCode(importedState.name)) {
          throw new Error("Die Sicherung enthält kein gültiges Schülerkürzel");
        }
        if (parsed.identity?.studentCode !== importedState.name
          || parsed.identity?.profileId !== importedState.profileId) {
          throw new Error("Die Identitätsdaten der Sicherung sind widersprüchlich");
        }
      }
      if (parsed.formatVersion >= 3) {
        if (!isValidClassName(importedState.className)
          || parsed.identity?.studentClass !== importedState.className
          || parsed.identity?.profileOriginDeviceId !== importedState.profileDeviceId) {
          throw new Error("Klasse oder Profilherkunft der Sicherung sind widersprüchlich");
        }
      }
      const profileCode = shortIdentity(importedState.profileId);
      const sourceDeviceCode = parsed.identity?.deviceCode || "älteres Format";
      const legacyLabel = importedState.name || String(parsed.data.name || "älterer Lernstand").slice(0, 30);
      const confirmed = window.confirm(
        `Lernstand ${legacyLabel} · Klasse ${importedState.className || "noch offen"} · Profil ${profileCode} · Exportgerät ${sourceDeviceCode} · ${integrity.verified ? "Prüfsumme gültig" : "älteres Format ohne Prüfsumme"} mit ${stateXp(importedState)} XP laden? Der aktuelle Browserstand wird ersetzt.`
      );
      if (!confirmed) {
        return;
      }
      importedState.transferHistory = [...importedState.transferHistory, {
        importedAt: new Date().toISOString(),
        sourceExportId: isOpaqueId(parsed.exportId, "export") ? parsed.exportId : "",
        sourceDeviceId: isOpaqueId(parsed.identity?.deviceId, "device") ? parsed.identity.deviceId : "",
        destinationDeviceId: deviceIdentity.id
      }].slice(-12);
      state = importedState;
      saveState();
      backupDialog.close();
      renderRoute();
      toast("Lernstand erfolgreich geladen");
      if (!importedState.name || !importedState.className) {
        openProfileDialog("Diese ältere Sicherung braucht einmalig Schülerkürzel und Klasse.");
      }
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
    if (!profileDialog.open) {
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    if (route.name === "path") {
      let pendingModule = "";
      try {
        pendingModule = sessionStorage.getItem(pendingModuleStorageKey) || "";
        sessionStorage.removeItem(pendingModuleStorageKey);
      } catch {}
      if (pendingModule) {
        window.requestAnimationFrame(() => document.getElementById(pendingModule)?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }
  }

  function saveWorksheetControl(control) {
    const lesson = lessonById(parseRoute().id);
    if (!lesson?.webWorksheet) {
      return false;
    }
    const record = lessonWorksheetRecord(lesson);
    if (control.matches("[data-worksheet-table-name]")) {
      record.tableName = control.value.slice(0, 40);
    } else if (control.matches("[data-worksheet-definition]")) {
      record.definitions[control.dataset.worksheetDefinition] = control.value.slice(0, 1200);
    } else if (control.matches("[data-worksheet-field]")) {
      const rowIndex = Number(control.dataset.worksheetRow);
      const field = control.dataset.worksheetField;
      if (!Number.isInteger(rowIndex) || !record.rows[rowIndex]) {
        return false;
      }
      if (field === "primary") {
        record.rows.forEach((row, index) => {
          row.primary = index === rowIndex;
        });
      } else if (field === "length") {
        record.rows[rowIndex].length = control.value.replace(/[^0-9]/g, "").slice(0, 5);
        control.value = record.rows[rowIndex].length;
      } else if (field === "name" || field === "type") {
        record.rows[rowIndex][field] = control.value.slice(0, field === "name" ? 40 : 32);
      }
    } else {
      return false;
    }
    state.lessonWorksheets[lesson.id] = record;
    saveState();
    return true;
  }

  document.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route]");
    const lessonButton = event.target.closest("[data-lesson]");
    const practiceButton = event.target.closest("[data-practice]");
    const commandButton = event.target.closest("[data-command]");
    const filterButton = event.target.closest("[data-filter]");
    const runnerTab = event.target.closest("[data-runner-tab]");
    const completeLessonButton = event.target.closest("[data-complete-lesson]");
    const moduleButton = event.target.closest("[data-path-module]");

    if (routeButton) {
      event.preventDefault();
      go(routeButton.dataset.route);
    }
    if (lessonButton) {
      const lesson = lessonById(lessonButton.dataset.lesson);
      if (!isLessonUnlocked(lesson)) {
        const prerequisite = lessonPrerequisite(lesson);
        toast(`Zuerst ${prerequisite?.courseCode || "die vorherige Einheit"} abschließen.`, "error");
      } else {
        go(`lesson/${lessonButton.dataset.lesson}`);
      }
    }
    if (practiceButton) {
      const practice = practiceById(practiceButton.dataset.practice);
      if (!isPracticeUnlocked(practice)) {
        toast("Diese Übung wird mit ihrer Lerneinheit freigeschaltet.", "error");
      } else {
        go(`practice/${practiceButton.dataset.practice}`);
      }
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
    if (moduleButton) {
      const module = moduleById(moduleButton.dataset.pathModule);
      if (!module || !isLessonUnlocked(lessonById(module.lessonIds[0]))) {
        toast("Dieser Lernfortschritt ist noch gesperrt.", "error");
      } else if (parseRoute().name === "path") {
        document.getElementById(module.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        try {
          sessionStorage.setItem(pendingModuleStorageKey, module.id);
        } catch {}
        go("path");
      }
    }
    if (completeLessonButton) {
      const lesson = lessonById(completeLessonButton.dataset.completeLesson);
      if (!lesson || state.completedLessons.includes(lesson.id)) {
        return;
      }
      if (!state.name || !state.className) {
        openProfileDialog("Lege vor dem Abschluss Schülerkürzel und Klasse vollständig an.");
        return;
      }
      const record = lessonProgressRecord(lesson);
      if (record.checks.some((checked) => !checked)) {
        toast("Hake zuerst alle eigenen Arbeitsschritte ab.", "error");
        return;
      }
      if (!record.quizPassed) {
        toast("Der Verständnischeck ist noch nicht bestanden.", "error");
        return;
      }
      if (!record.teacherChecked) {
        toast("Die Bestätigung durch die Lehrkraft fehlt noch.", "error");
        return;
      }
      award("lesson", lesson.id, lesson.xp);
      renderLesson(lesson.id);
      renderIcons();
    }
    if (event.target.closest("#runSqlButton")) {
      runSqlPractice("run");
    }
    if (event.target.closest("#coachSqlButton")) {
      runSqlPractice("coach");
    }
    if (event.target.closest("#checkSqlButton")) {
      runSqlPractice("check");
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
    const altGraph = event.getModifierState?.("AltGraph") || (event.ctrlKey && event.altKey);
    if (profileDialog.open && altGraph && (event.code === "KeyS" || event.key.toLocaleLowerCase("de-DE") === "s")) {
      event.preventDefault();
      developerControlRevealed = !developerControlRevealed;
      updateDeveloperControl();
      (developerControlRevealed ? developerModeButton : profileName)?.focus();
      return;
    }
    const card = event.target.closest("[data-lesson], [data-practice], [data-command]");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      if (card.dataset.lesson) {
        const lesson = lessonById(card.dataset.lesson);
        if (isLessonUnlocked(lesson)) {
          go(`lesson/${card.dataset.lesson}`);
        } else {
          toast(`Zuerst ${lessonPrerequisite(lesson)?.courseCode || "die vorherige Einheit"} abschließen.`, "error");
        }
      } else if (card.dataset.practice) {
        const practice = practiceById(card.dataset.practice);
        if (isPracticeUnlocked(practice)) {
          go(`practice/${card.dataset.practice}`);
        } else {
          toast("Diese Übung ist noch gesperrt.", "error");
        }
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
    if (event.target.matches("[data-lesson-note]")) {
      const lessonId = event.target.dataset.lessonNote;
      if (lessonById(lessonId)) {
        state.lessonNotes[lessonId] = event.target.value.slice(0, 12000);
        saveState();
      }
    }
    saveWorksheetControl(event.target);
  });

  document.addEventListener("change", (event) => {
    if (saveWorksheetControl(event.target)) {
      return;
    }
    const lessonCheck = event.target.closest("[data-lesson-check], [data-lesson-teacher]");
    if (lessonCheck) {
      const lesson = lessonById(parseRoute().id);
      if (!lesson || state.completedLessons.includes(lesson.id)) {
        return;
      }
      const current = lessonProgressRecord(lesson);
      if (lessonCheck.matches("[data-lesson-check]")) {
        current.checks[Number(lessonCheck.dataset.lessonCheck)] = lessonCheck.checked;
      } else {
        current.teacherChecked = lessonCheck.checked;
      }
      state.lessonChecks[lesson.id] = {
        checks: current.checks,
        teacherChecked: current.teacherChecked
      };
      saveState();
      return;
    }
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
        if (!state.passedLessonQuizzes.includes(lesson.id)) {
          state.passedLessonQuizzes.push(lesson.id);
          markActivity();
          saveState();
        }
        const quizCheck = document.querySelector(".quiz-check");
        quizCheck?.classList.add("is-ready");
        const quizInput = quizCheck?.querySelector("input");
        if (quizInput) {
          quizInput.checked = true;
        }
        showBanner("#quizResult", true, "Richtig", `${lesson.quiz.explanation} Schließe jetzt die Arbeitsschritte unten ab.`);
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
    if (event.target.id === "diagramPracticeForm") {
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

  function openProfileDialog(message = "") {
    profileName.value = state.name;
    profileClass.value = state.className;
    profileNameError.textContent = message;
    profileName.toggleAttribute("aria-invalid", Boolean(message));
    profileClass.toggleAttribute("aria-invalid", Boolean(message));
    if (!profileDialog.open) {
      profileDialog.showModal();
    }
    window.requestAnimationFrame(() => {
      const target = isValidStudentCode(profileName.value) ? profileClass : profileName;
      target.focus();
      target.select();
    });
  }

  document.querySelector("#editProfileButton").addEventListener("click", () => {
    openProfileDialog();
  });
  document.querySelector("#profileCancelButton").addEventListener("click", () => profileDialog.close());
  profileDialog.addEventListener("close", () => {
    developerControlRevealed = false;
    updateDeveloperControl();
  });
  [profileName, profileClass].forEach((field) => field.addEventListener("input", () => {
    profileName.removeAttribute("aria-invalid");
    profileClass.removeAttribute("aria-invalid");
    profileNameError.textContent = "";
  }));
  profileName.addEventListener("blur", () => {
    profileName.value = normalizeStudentCode(profileName.value);
  });
  profileClass.addEventListener("blur", () => {
    profileClass.value = normalizeClassName(profileClass.value);
  });
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const studentCode = normalizeStudentCode(profileName.value);
    const className = normalizeClassName(profileClass.value);
    profileName.value = studentCode;
    profileClass.value = className;
    if (!isValidStudentCode(studentCode)) {
      profileName.setAttribute("aria-invalid", "true");
      profileNameError.textContent = "Bitte genau drei Buchstaben, einen Punkt und drei Buchstaben eingeben, zum Beispiel MIA.MUE.";
      profileName.focus();
      return;
    }
    if (!isValidClassName(className)) {
      profileClass.setAttribute("aria-invalid", "true");
      profileNameError.textContent = "Bitte die offizielle Klassenkurzform eingeben, zum Beispiel J1-1 oder WGJ1/1.";
      profileClass.focus();
      return;
    }
    state.name = studentCode;
    state.className = className;
    state.profileId = isOpaqueId(state.profileId, "profile") ? state.profileId : createOpaqueId("profile");
    state.profileDeviceId = isOpaqueId(state.profileDeviceId, "device") ? state.profileDeviceId : deviceIdentity.id;
    state.profileCreatedAt = state.profileCreatedAt || new Date().toISOString();
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
  developerModeButton?.addEventListener("click", () => setDeveloperMode(!developerMode));
  window.addEventListener("hashchange", renderRoute);

  applyTheme(readTheme(), false);
  initSqlRuntime().catch(() => {});
  renderRoute();
  const suppressProfilePrompt = new URLSearchParams(window.location.search).has("screenshot");
  if (!suppressProfilePrompt && (!state.name || !state.className) && !sessionStorage.getItem("workbenchlab-profile-seen")) {
    sessionStorage.setItem("workbenchlab-profile-seen", "1");
    window.setTimeout(() => openProfileDialog(), 350);
  }
})();
