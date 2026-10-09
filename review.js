(() => {
  "use strict";
  // Wiederholungsrunde (Claude, OPT-07): reine Auswahl-Logik ohne DOM.
  // Aus den bereits gelösten Aufgaben werden je Tag und Profil dieselben Aufgaben gezogen.

  function hash(text) {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function generator(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state + 0x6D2B79F5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  // candidates: [{ id, lessonId }] in fachlicher Reihenfolge. Bevorzugt werden
  // verschiedene Einheiten, damit die Runde mehrere Themen mischt.
  function pick(candidates, seedText, count = 5) {
    const random = generator(hash(String(seedText)));
    const pool = [...candidates];
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [pool[index], pool[other]] = [pool[other], pool[index]];
    }
    const chosen = [];
    const usedLessons = new Set();
    for (const item of pool) {
      if (chosen.length < count && !usedLessons.has(item.lessonId)) {
        chosen.push(item);
        usedLessons.add(item.lessonId);
      }
    }
    for (const item of pool) {
      if (chosen.length < count && !chosen.includes(item)) chosen.push(item);
    }
    return chosen.map((item) => item.id);
  }

  // Klausurtraining (Claude, OPT-07): Auswertung je Einheit.
  // picks: [{ id, lessonId }], solved: { id: Zeitstempel in ms }, lessons: [{ id, courseCode, title }]
  function examSummary(picks, solved, lessons, startedAt, endsAt) {
    const inTime = (id) => Number.isFinite(solved[id]) && solved[id] >= startedAt && solved[id] <= endsAt;
    const late = (id) => Number.isFinite(solved[id]) && solved[id] > endsAt;
    const groups = [];
    picks.forEach((item) => {
      let group = groups.find((entry) => entry.lessonId === item.lessonId);
      if (!group) {
        const lesson = lessons.find((entry) => entry.id === item.lessonId);
        group = { lessonId: item.lessonId, code: lesson?.courseCode || "", title: lesson?.title || "", total: 0, solved: 0, late: 0 };
        groups.push(group);
      }
      group.total += 1;
      if (inTime(item.id)) group.solved += 1;
      if (late(item.id)) group.late += 1;
    });
    return {
      total: picks.length,
      solved: picks.filter((item) => inTime(item.id)).length,
      late: picks.filter((item) => late(item.id)).length,
      groups
    };
  }

  function clock(milliseconds) {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  window.WORKBENCH_REVIEW = { pick, examSummary, clock };
})();
