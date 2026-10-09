(() => {
  "use strict";
  // Aufbau und Bereinigung des Lernstands ohne DOM und ohne Speicherzugriff: Vorgabewerte,
  // Schülerkürzel, Klasse, Kennungen und normalizeState. Am 2026-10-09 von Claude unverändert aus
  // app.js ausgelagert (OPT-16, Schritt 3); Verfasser des Codes ist Codex (playgroundSchemas: Claude).
  // Laden und Speichern (loadState, saveState) bleiben in app.js.
  // Muss nach content.js, den Aufgabendateien, study-tools.js und drawing.js geladen werden.

  const content = window.WORKBENCH_CONTENT;
  const study = window.WORKBENCH_STUDY;
  const drawing = window.WORKBENCH_DRAWING;

  function lessonById(id) {
    return content.lessons.find((lesson) => lesson.id === id);
  }

  const studentCodePattern = /^[A-Z]{3}\.[A-Z]{3}$/;
  const classNamePattern = /^[A-ZÄÖÜ0-9][A-ZÄÖÜ0-9 ._\/-]{0,19}$/;
  const defaultState = {
    name: "",
    className: "",
    profileId: "",
    profileDeviceId: "",
    profileCreatedAt: "",
    transferHistory: [],
    completedLessons: [],
    nagoldEntries: [],
    passedLessonQuizzes: [],
    lessonChecks: {},
    completedPractices: [],
    completedCommands: [],
    drafts: {},
    slotDrafts: {},
    lessonNotes: {},
    generalNotes: "",
    noteDrawings: {},
    lessonHighlights: {},
    lessonWorksheets: {},
    activityDates: [],
    lastLessonId: "warum-datenbanken"
  };

  // Muss vor loadState() stehen: normalizeState() liest diese Liste (Claude, OPT-01).
  const playgroundSchemas = ["fahrschule-basic", "fahrschule", "fahrradvermietung"];
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

  function worksheetAnswerLimit(lesson, term) {
    const item = lesson?.webWorksheet?.definitionTerms?.find((entry) => entry.id === term);
    return Number.isInteger(item?.maxLength) ? Math.min(12000, Math.max(1200, item.maxLength)) : 1200;
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
      if ((practiceIds.has(id) || playgroundSchemas.some((key) => id === `frei-${key}`)) && typeof value === "string") {
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
          definitions[term] = answer.slice(0, worksheetAnswerLimit(lessonById(id), term));
        }
      });
      const rows = Array.isArray(value.rows)
        ? value.rows.slice(0, 12).map((row) => ({
          name: String(row?.name || "").slice(0, 40),
          type: String(row?.type || "").slice(0, 32),
          length: study.worksheetLength(row?.type, row?.length),
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
      nagoldEntries: window.WORKBENCH_NAGOLD.entriesFor(candidate),
      passedLessonQuizzes: [...new Set([...passedLessonQuizzes, ...completedLessons])],
      lessonChecks,
      completedPractices,
      completedCommands,
      drafts,
      slotDrafts,
      lessonNotes,
      generalNotes: typeof candidate.generalNotes === "string" ? candidate.generalNotes.slice(0, 12000) : "",
      noteDrawings: drawing.normalize(candidate.noteDrawings, new Set(["general", ...lessonIds])),
      lessonHighlights: study.normalizeHighlights(candidate.lessonHighlights, lessonIds),
      lessonWorksheets,
      activityDates: Array.isArray(candidate.activityDates)
        ? [...new Set(candidate.activityDates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)))].slice(-120)
        : [],
      lastLessonId: lessonIds.has(candidate.lastLessonId) ? candidate.lastLessonId : "warum-datenbanken"
    };
  }

  window.WORKBENCH_STATE = {
    defaultState, playgroundSchemas, studentCodePattern, classNamePattern, uniqueAllowedStrings,
    normalizeStudentCode, isValidStudentCode, normalizeClassName, isValidClassName,
    createOpaqueId, isOpaqueId, shortIdentity, worksheetAnswerLimit, normalizeState
  };
})();
