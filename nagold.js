(() => {
  "use strict";

  const maxManualEntries = 1000;
  const maxEntries = maxManualEntries + window.WORKBENCH_CONTENT.lessons.length;
  const maxPoints = 5;

  function validDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function validTime(value) { return typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value); }

  function normalizeEntries(value) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, maxEntries).flatMap(entry => {
      const time = entry?.time === undefined ? "" : entry.time;
      if (!entry || typeof entry.purpose !== "string" || !entry.purpose.trim()
        || !Number.isInteger(entry.points) || entry.points < 1 || entry.points > maxPoints
        || (entry.date !== "" && !validDate(entry.date)) || (time !== "" && !validTime(time))) return [];
      const normalized = { date: entry.date, time, purpose: entry.purpose.trim().slice(0, 160), points: entry.points };
      if (window.WORKBENCH_CONTENT.lessons.some(lesson => lesson.id === entry.lessonId)) normalized.lessonId = entry.lessonId;
      return [normalized];
    });
  }

  function entriesFor(candidate, content = window.WORKBENCH_CONTENT) {
    if (Object.hasOwn(candidate, "nagoldEntries")) return normalizeEntries(candidate.nagoldEntries);
    // Old progress stored only lesson completions; preserve its existing balance once.
    const completed = new Set(Array.isArray(candidate.completedLessons) ? candidate.completedLessons : []);
    return content.lessons.filter(lesson => completed.has(lesson.id)).map(lesson => ({
      date: "", time: "", purpose: `${lesson.courseCode || lesson.index} · ${lesson.title}`.slice(0, 160), points: maxPoints, lessonId: lesson.id
    }));
  }

  function total(candidate, content) {
    return entriesFor(candidate, content).reduce((sum, entry) => sum + entry.points, 0);
  }

  function addLessonEntry(candidate, lesson, date, time) {
    if (!lesson || !window.WORKBENCH_CONTENT.lessons.some(known => known.id === lesson.id) || !validDate(date) || !validTime(time)) return false;
    const entries = entriesFor(candidate);
    if (entries.some(entry => entry.lessonId === lesson.id) || entries.length >= maxEntries) return false;
    candidate.nagoldEntries = [...entries, { date, time, purpose: `${lesson.courseCode || lesson.index} · ${lesson.title}`.slice(0, 160), points: maxPoints, lessonId: lesson.id }];
    return true;
  }

  window.WORKBENCH_NAGOLD = Object.freeze({ maxEntries, maxManualEntries, maxPoints, validDate, validTime, normalizeEntries, entriesFor, total, addLessonEntry });
})();
