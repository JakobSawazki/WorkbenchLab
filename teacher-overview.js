(() => {
  "use strict";
  // Klassenübersicht für Lehrkräfte (Claude, OPT-08). Liest JSON-Sicherungen
  // ausschließlich lokal im Browser; es findet keine Übertragung statt.

  const MAX_FILE_BYTES = 12 * 1024 * 1024;
  const NAGOLD_PER_LESSON = 5; // wie nagoldPerLesson in app.js

  // Dieselbe Prüfsumme wie die Lernplattform (backup.js).
  const { stableStringify, sha256Hex } = window.WORKBENCH_BACKUP;

  // Ergebnis: "gueltig" | "veraendert" | "alt" | "unpruefbar"
  async function integrityStatus(parsed) {
    if (!(Number(parsed?.formatVersion) >= 3)) return "alt";
    const digest = parsed.integrity?.digest;
    if (parsed.integrity?.algorithm !== "SHA-256" || !/^[a-f0-9]{64}$/.test(digest || "")) return "veraendert";
    if (!globalThis.crypto?.subtle || !globalThis.TextEncoder) return "unpruefbar";
    const { integrity, ...payload } = parsed;
    return (await sha256Hex(stableStringify(payload))) === digest ? "gueltig" : "veraendert";
  }

  const strings = (value) => (Array.isArray(value) ? [...new Set(value.filter((item) => typeof item === "string"))] : []);

  function summarize(parsed, content) {
    if (!parsed || typeof parsed !== "object" || parsed.app !== "WorkbenchLab" || !parsed.data || typeof parsed.data !== "object") {
      throw new Error("Keine WorkbenchLab-Sicherung");
    }
    const data = parsed.data;
    const lessonIds = content.modules.flatMap((module) => module.lessonIds);
    const known = (list, items) => strings(list).filter((id) => items.some((item) => item.id === id));
    const lessons = known(data.completedLessons, content.lessons).filter((id) => lessonIds.includes(id));
    const practices = known(data.completedPractices, content.practices);
    const commands = known(data.completedCommands, content.commands);
    const xpOf = (ids, items) => ids.reduce((sum, id) => sum + (items.find((item) => item.id === id)?.xp || 0), 0);
    const xp = xpOf(lessons, content.lessons) + xpOf(practices, content.practices) + xpOf(commands, content.commands);
    const days = strings(data.activityDates).filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day)).sort();
    const text = (value, limit) => (typeof value === "string" ? value.trim().slice(0, limit) : "");
    const statedXp = Number(parsed.summary?.xp);
    return {
      studentCode: text(parsed.identity?.studentCode ?? data.name, 20) || "ohne Kürzel",
      className: text(parsed.identity?.studentClass ?? data.className, 20) || "ohne Klasse",
      profileId: text(parsed.identity?.profileId ?? data.profileId, 80),
      deviceCode: text(parsed.identity?.deviceCode, 20),
      exportedAt: /^\d{4}-\d{2}-\d{2}T/.test(parsed.exportedAt || "") ? parsed.exportedAt : "",
      appVersion: text(parsed.appVersion, 20),
      formatVersion: Number(parsed.formatVersion) || 0,
      xp,
      xpMismatch: Number.isFinite(statedXp) && statedXp !== xp,
      lessons,
      lessonsDone: lessons.length,
      nagold: lessons.length * NAGOLD_PER_LESSON,
      lessonsTotal: lessonIds.length,
      practicesDone: practices.length,
      practicesTotal: content.practices.length,
      commandsDone: commands.length,
      modules: content.modules.map((module) => ({
        code: module.code,
        done: module.lessonIds.filter((id) => lessons.includes(id)).length,
        total: module.lessonIds.length
      })),
      activeDays: days.length,
      lastActivity: days.at(-1) || ""
    };
  }

  // Kennzeichnet ältere Sicherungen desselben Profils.
  function markSuperseded(rows) {
    const newest = new Map();
    rows.forEach((row) => {
      const key = row.profileId || `${row.className}|${row.studentCode}`;
      const current = newest.get(key);
      if (!current || (row.exportedAt || "") > (current.exportedAt || "")) newest.set(key, row);
    });
    rows.forEach((row) => {
      const key = row.profileId || `${row.className}|${row.studentCode}`;
      row.superseded = newest.get(key) !== row;
    });
    return rows;
  }

  function sortRows(rows) {
    return [...rows].sort((a, b) =>
      a.className.localeCompare(b.className, "de") ||
      a.studentCode.localeCompare(b.studentCode, "de") ||
      (b.exportedAt || "").localeCompare(a.exportedAt || ""));
  }

  const integrityLabels = {
    gueltig: "gültig",
    veraendert: "verändert oder beschädigt",
    alt: "altes Format ohne Prüfsumme",
    unpruefbar: "in diesem Browser nicht prüfbar"
  };

  function csvCell(value) {
    let cell = String(value ?? "");
    // Schutz vor Formelausführung in Tabellenprogrammen.
    if (/^[=+\-@\t\r]/.test(cell)) cell = `'${cell}`;
    return `"${cell.replace(/"/g, '""')}"`;
  }

  function toCsv(rows, content) {
    const lessons = content.modules.flatMap((module) => module.lessonIds)
      .map((id) => content.lessons.find((lesson) => lesson.id === id)).filter(Boolean);
    const head = ["Klasse", "Kürzel", "NAGOLD", "XP", "Einheiten", "von", "Übungen", "von", "Befehlsaufgaben",
      ...content.modules.map((module) => module.code), "Aktive Tage", "Letzte Aktivität", "Sicherung vom",
      "Prüfsumme", "Ältere Sicherung", "App-Version", "Gerät", "Datei", ...lessons.map((lesson) => lesson.courseCode)];
    const lines = rows.map((row) => [row.className, row.studentCode, row.nagold, row.xp, row.lessonsDone, row.lessonsTotal,
      row.practicesDone, row.practicesTotal, row.commandsDone, ...row.modules.map((module) => `${module.done}/${module.total}`),
      row.activeDays, row.lastActivity, row.exportedAt.slice(0, 16).replace("T", " "), integrityLabels[row.integrity] || "",
      row.superseded ? "ja" : "nein", row.appVersion, row.deviceCode, row.fileName,
      ...lessons.map((lesson) => (row.lessons.includes(lesson.id) ? "x" : ""))]);
    return `﻿${[head, ...lines].map((line) => line.map(csvCell).join(";")).join("\r\n")}\r\n`;
  }

  async function readFile(file, content) {
    if (file.size > MAX_FILE_BYTES) throw new Error("Datei ist größer als 12 MB");
    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      throw new Error("Keine lesbare JSON-Datei");
    }
    const row = summarize(parsed, content);
    row.integrity = await integrityStatus(parsed);
    row.fileName = String(file.name || "").slice(0, 160);
    return row;
  }

  window.WORKBENCH_TEACHER = { stableStringify, integrityStatus, summarize, markSuperseded, sortRows, toCsv, readFile, integrityLabels, NAGOLD_PER_LESSON };

  if (typeof document === "undefined" || !document.querySelector("#teacherApp")) return;

  const content = window.WORKBENCH_CONTENT;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const lessons = content.modules.flatMap((module) => module.lessonIds)
    .map((id) => content.lessons.find((lesson) => lesson.id === id)).filter(Boolean);
  let rows = [];
  let rejected = [];
  let classFilter = "";
  let hideSuperseded = true;

  const fileInput = document.querySelector("#teacherFiles");
  const dropZone = document.querySelector("#teacherDrop");
  const status = document.querySelector("#teacherStatus");
  const result = document.querySelector("#teacherResult");

  function visibleRows() {
    return sortRows(rows).filter((row) => (!classFilter || row.className === classFilter) && (!hideSuperseded || !row.superseded));
  }

  function render() {
    const classes = [...new Set(rows.map((row) => row.className))].sort((a, b) => a.localeCompare(b, "de"));
    if (classFilter && !classes.includes(classFilter)) classFilter = "";
    const shown = visibleRows();
    const average = (pick) => (shown.length ? Math.round(shown.reduce((sum, row) => sum + pick(row), 0) / shown.length) : 0);
    const problems = shown.filter((row) => row.integrity === "veraendert").length;
    status.textContent = rows.length || rejected.length
      ? `${rows.length} Sicherung${rows.length === 1 ? "" : "en"} eingelesen${rejected.length ? `, ${rejected.length} Datei${rejected.length === 1 ? "" : "en"} abgelehnt` : ""}.`
      : "";
    if (!rows.length && !rejected.length) {
      result.innerHTML = "";
      return;
    }
    result.innerHTML = `
      ${rejected.length ? `<section class="teacher-rejected" aria-label="Abgelehnte Dateien"><h2>Nicht eingelesen</h2><ul>${rejected.map((item) => `<li><strong>${escapeHtml(item.name)}</strong>: ${escapeHtml(item.reason)}</li>`).join("")}</ul></section>` : ""}
      ${rows.length ? `
      <div class="teacher-controls">
        <label>Klasse <select id="teacherClass"><option value="">Alle (${rows.length})</option>${classes.map((name) => `<option value="${escapeHtml(name)}" ${name === classFilter ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}</select></label>
        <label class="teacher-check"><input type="checkbox" id="teacherNewest" ${hideSuperseded ? "checked" : ""}> Nur neueste Sicherung je Person</label>
        <button class="button button-secondary" type="button" id="teacherCsv">CSV herunterladen</button>
        <button class="button button-secondary" type="button" id="teacherPrint">Drucken</button>
        <button class="button button-secondary" type="button" id="teacherClear">Liste leeren</button>
      </div>
      <div class="teacher-stats">
        <div><strong>${shown.length}</strong><span>angezeigt</span></div>
        <div><strong>${average((row) => row.lessonsDone)} / ${lessons.length}</strong><span>Einheiten im Mittel</span></div>
        <div><strong>${average((row) => row.practicesDone)}</strong><span>Übungen im Mittel</span></div>
        <div><strong>${average((row) => row.nagold)}</strong><span>NAGOLD im Mittel</span></div>
        <div><strong>${average((row) => row.xp)}</strong><span>XP im Mittel</span></div>
        <div class="${problems ? "is-warning" : ""}"><strong>${problems}</strong><span>mit ungültiger Prüfsumme</span></div>
      </div>
      <div class="teacher-table-wrap" tabindex="0" role="region" aria-label="Klassenübersicht">
        <table class="teacher-table">
          <thead><tr>
            <th scope="col">Klasse</th><th scope="col">Kürzel</th><th scope="col">NAGOLD</th><th scope="col">XP</th><th scope="col">Einheiten</th><th scope="col">Übungen</th>
            ${content.modules.map((module) => `<th scope="col">${escapeHtml(module.code)}</th>`).join("")}
            <th scope="col">Letzte Aktivität</th><th scope="col">Sicherung vom</th><th scope="col">Prüfsumme</th>
          </tr></thead>
          <tbody>${shown.map((row) => `
            <tr class="${row.superseded ? "is-old" : ""}">
              <td>${escapeHtml(row.className)}</td>
              <th scope="row">${escapeHtml(row.studentCode)}${row.superseded ? ' <small>(ältere Sicherung)</small>' : ""}</th>
              <td><strong>${row.nagold}</strong></td>
              <td>${row.xp}${row.xpMismatch ? ' <small title="Die Datei nennt einen anderen XP-Wert als die Nachrechnung.">⚠</small>' : ""}</td>
              <td>${row.lessonsDone} / ${row.lessonsTotal}</td>
              <td>${row.practicesDone} / ${row.practicesTotal}</td>
              ${row.modules.map((module) => `<td class="${module.done === module.total ? "is-done" : ""}">${module.done}/${module.total}</td>`).join("")}
              <td>${escapeHtml(row.lastActivity || "–")}</td>
              <td>${escapeHtml(row.exportedAt ? new Date(row.exportedAt).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" }) : "–")}</td>
              <td class="integrity-${row.integrity}">${escapeHtml(integrityLabels[row.integrity])}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <h2>Abgeschlossene Einheiten</h2>
      <div class="teacher-table-wrap" tabindex="0" role="region" aria-label="Abgeschlossene Einheiten je Person">
        <table class="teacher-table teacher-matrix">
          <thead><tr><th scope="col">Kürzel</th>${lessons.map((lesson) => `<th scope="col" title="${escapeHtml(lesson.title)}">${escapeHtml(lesson.courseCode)}</th>`).join("")}</tr></thead>
          <tbody>${shown.map((row) => `<tr><th scope="row">${escapeHtml(row.studentCode)}</th>${lessons.map((lesson) => (row.lessons.includes(lesson.id) ? '<td class="is-done" aria-label="abgeschlossen">✓</td>' : '<td aria-label="offen">·</td>')).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>` : ""}`;
  }

  async function addFiles(fileList) {
    const files = [...fileList];
    if (!files.length) return;
    status.textContent = "Dateien werden gelesen …";
    for (const file of files) {
      try {
        const row = await readFile(file, content);
        if (rows.some((item) => item.fileName === row.fileName && item.exportedAt === row.exportedAt && item.profileId === row.profileId)) {
          rejected.push({ name: row.fileName, reason: "bereits eingelesen" });
        } else {
          rows.push(row);
        }
      } catch (error) {
        rejected.push({ name: String(file.name || "Datei").slice(0, 160), reason: error.message || "nicht lesbar" });
      }
    }
    markSuperseded(rows);
    render();
  }

  fileInput.addEventListener("change", () => {
    addFiles(fileInput.files).finally(() => { fileInput.value = ""; });
  });
  ["dragenter", "dragover"].forEach((type) => dropZone.addEventListener(type, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-over");
  }));
  ["dragleave", "drop"].forEach((type) => dropZone.addEventListener(type, () => dropZone.classList.remove("is-over")));
  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    addFiles(event.dataTransfer?.files || []);
  });
  document.addEventListener("change", (event) => {
    if (event.target.id === "teacherClass") {
      classFilter = event.target.value;
      render();
      document.querySelector("#teacherClass")?.focus();
    }
    if (event.target.id === "teacherNewest") {
      hideSuperseded = event.target.checked;
      render();
      document.querySelector("#teacherNewest")?.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("#teacherCsv")) {
      const blob = new Blob([toCsv(visibleRows(), content)], { type: "text/csv;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `workbenchlab-klassenuebersicht-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }
    if (event.target.closest("#teacherPrint")) window.print();
    if (event.target.closest("#teacherClear")) {
      rows = [];
      rejected = [];
      classFilter = "";
      render();
      fileInput.focus();
    }
  });
})();
