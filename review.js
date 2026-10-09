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

  window.WORKBENCH_REVIEW = { pick };
})();
