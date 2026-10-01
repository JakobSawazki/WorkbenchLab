(() => {
  "use strict";
  const colors = ["#17212b", "#175fa4", "#167454", "#a63d37", "#6b4386", "#a06512"];
  const widths = [2, 5, 10, 20];
  const eraserWidths = [24, 48, 96];
  const maxPoints = 8000;
  const maxStrokes = 120;
  function normalize(candidate, allowedIds) {
    const result = {};
    let total = 0;
    if (!candidate || typeof candidate !== "object") return result;
    for (const [id, entries] of Object.entries(candidate)) {
      if (!allowedIds.has(id) || !Array.isArray(entries)) continue;
      let count = 0;
      const strokes = [];
      for (const entry of entries.slice(0, maxStrokes)) {
        if (!entry || !["pen", "erase"].includes(entry.tool) || !colors.includes(entry.color)
          || !(entry.tool === "erase" ? [...widths, ...eraserWidths] : widths).includes(entry.width) || !Array.isArray(entry.points)
          || !entry.points.length || entry.points.length > 1000) continue;
        if (entry.points.some((point) => !Array.isArray(point) || point.length !== 2
          || point.some((n) => typeof n !== "number" || !Number.isFinite(n) || n < 0 || n > 1))) continue;
        if (count + entry.points.length > maxPoints || total + entry.points.length > 60000) break;
        strokes.push({ tool: entry.tool, color: entry.color, width: entry.width,
          points: entry.points.map((point) => point.map((n) => Math.round(n * 10000) / 10000)) });
        count += entry.points.length;
        total += entry.points.length;
      }
      result[id] = strokes;
    }
    return result;
  }
  function paint(context, strokes) {
    context.clearRect(0, 0, 1200, 720);
    for (const stroke of strokes) {
      context.globalCompositeOperation = stroke.tool === "erase" ? "destination-out" : "source-over";
      context.strokeStyle = context.fillStyle = stroke.color;
      context.lineWidth = stroke.width;
      context.lineCap = context.lineJoin = "round";
      context.beginPath();
      stroke.points.forEach(([x, y], i) => {
        if (!i) context.moveTo(x * 1200, y * 720);
        else context.lineTo(x * 1200, y * 720);
      });
      if (stroke.points.length === 1) {
        context.arc(stroke.points[0][0] * 1200, stroke.points[0][1] * 720, stroke.width / 2, 0, Math.PI * 2);
        context.fill();
      } else context.stroke();
    }
    context.globalCompositeOperation = "source-over";
  }
  function attach(canvas, initial, onChange, onLimit, budget = maxPoints) {
    const context = canvas.getContext("2d");
    canvas.width = 1200;
    canvas.height = 720;
    let strokes = structuredClone(initial || []);
    let redo = [];
    let current = null;
    let pointer = null;
    let warned = false;
    const settings = { tool: "pen", color: colors[0], width: 5, eraserWidth: 48 };
    const count = () => strokes.reduce((sum, stroke) => sum + stroke.points.length, 0);
    const redraw = () => paint(context, current ? [...strokes, current] : strokes);
    const publish = () => { redraw(); onChange(structuredClone(strokes), { undo: Boolean(strokes.length), redo: Boolean(redo.length) }); };
    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height]
        .map((n) => Math.round(Math.max(0, Math.min(1, n)) * 10000) / 10000);
    }
    function add(event) {
      if (!current || pointer !== event.pointerId) return;
      if (current.points.length >= 1000 || count() + current.points.length >= Math.min(maxPoints, budget)) {
        if (!warned) { onLimit(); warned = true; }
        return;
      }
      const next = point(event);
      const previous = current.points.at(-1);
      if (previous && Math.hypot(next[0] - previous[0], next[1] - previous[1]) < 0.001) return;
      current.points.push(next);
      redraw();
    }
    function finish() {
      if (!current) return;
      if (current.points.length) { strokes.push(current); redo = []; }
      current = null;
      const oldPointer = pointer;
      pointer = null;
      if (canvas.hasPointerCapture(oldPointer)) canvas.releasePointerCapture(oldPointer);
      publish();
    }
    canvas.addEventListener("pointerdown", (event) => {
      if (current || event.button !== 0) return;
      if (strokes.length >= maxStrokes || count() >= Math.min(maxPoints, budget)) { onLimit(); return; }
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      pointer = event.pointerId;
      warned = false;
      current = { tool: settings.tool, color: settings.color, width: settings.tool === "erase" ? settings.eraserWidth : settings.width, points: [] };
      canvas.setPointerCapture(pointer);
      add(event);
    });
    canvas.addEventListener("pointermove", add);
    canvas.addEventListener("pointerup", (event) => { if (pointer === event.pointerId) { add(event); finish(); } });
    canvas.addEventListener("pointercancel", (event) => { if (pointer === event.pointerId) finish(); });
    canvas.addEventListener("lostpointercapture", finish);
    redraw();
    return {
      settings, finish,
      undo() { finish(); if (strokes.length) { redo.push(strokes.pop()); publish(); } },
      redo() { finish(); if (redo.length) { strokes.push(redo.pop()); publish(); } },
      clear() { finish(); strokes = []; redo = []; publish(); },
      png() {
        finish();
        const image = document.createElement("canvas");
        image.width = 1200; image.height = 720;
        const target = image.getContext("2d");
        target.fillStyle = "#ffffff"; target.fillRect(0, 0, 1200, 720);
        target.drawImage(canvas, 0, 0);
        return new Promise((resolve) => image.toBlob(resolve, "image/png"));
      }
    };
  }
  window.WORKBENCH_DRAWING = { colors, widths, eraserWidths, normalize, paint, attach };
})();
