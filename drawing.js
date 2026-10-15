(() => {
  "use strict";
  const colors = ["#17212b", "#175fa4", "#167454", "#a63d37", "#6b4386", "#a06512"];
  const widths = [2, 5, 10, 20];
  const eraserWidths = [24, 48, 96];
  const maxPoints = 8000;
  const maxStrokes = 120;
  const maxTotalPoints = 200000;
  const maxImageLength = 1500000;
  const isImage = entry => entry?.tool === "image" && typeof entry.image === "string"
    && entry.image.length <= maxImageLength
    && /^data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAALQ[A-Za-z0-9+/]*={0,2}$/.test(entry.image);
  function normalize(candidate, allowedIds) {
    const result = {};
    let total = 0;
    if (!candidate || typeof candidate !== "object") return result;
    for (const [id, entries] of Object.entries(candidate)) {
      if (!allowedIds.has(id) || !Array.isArray(entries)) continue;
      let count = 0;
      const strokes = [];
      for (const entry of entries.slice(0, maxStrokes)) {
        if (!strokes.length && isImage(entry)) {
          strokes.push({ tool: "image", image: entry.image, points: [] });
          continue;
        }
        if (!entry || !["pen", "erase"].includes(entry.tool) || !colors.includes(entry.color)
          || !(entry.tool === "erase" ? [...widths, ...eraserWidths] : widths).includes(entry.width) || !Array.isArray(entry.points)
          || !entry.points.length || entry.points.length > 1000) continue;
        if (entry.points.some((point) => !Array.isArray(point) || point.length !== 2
          || point.some((n) => typeof n !== "number" || !Number.isFinite(n) || n < 0 || n > 1))) continue;
        if (count + entry.points.length > maxPoints || total + entry.points.length > maxTotalPoints) break;
        strokes.push({ tool: entry.tool, color: entry.color, width: entry.width,
          points: entry.points.map((point) => point.map((n) => Math.round(n * 10000) / 10000)) });
        count += entry.points.length;
        total += entry.points.length;
      }
      result[id] = strokes;
    }
    return result;
  }
  function paint(context, strokes, images = new Map()) {
    context.clearRect(0, 0, 1200, 720);
    for (const stroke of strokes) {
      if (stroke.tool === "image") {
        context.globalCompositeOperation = "source-over";
        if (images.has(stroke.image)) context.drawImage(images.get(stroke.image), 0, 0, 1200, 720);
        continue;
      }
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
    let busy = false;
    const images = new Map();
    const settings = { tool: "pen", color: colors[0], width: 5, eraserWidth: 48 };
    const count = () => strokes.reduce((sum, stroke) => sum + stroke.points.length, 0);
    const redraw = () => paint(context, current ? [...strokes, current] : strokes, images);
    const publish = () => { redraw(); onChange(structuredClone(strokes), { undo: Boolean(strokes.length), redo: Boolean(redo.length) }); };
    function compact() {
      redraw();
      const image = canvas.toDataURL("image/png");
      if (!isImage({ tool: "image", image })) { onLimit(); return false; }
      const snapshot = document.createElement("canvas");
      snapshot.width = 1200; snapshot.height = 720;
      snapshot.getContext("2d").drawImage(canvas, 0, 0);
      images.clear();
      images.set(image, snapshot);
      strokes = [{ tool: "image", image, points: [] }];
      redo = [];
      return true;
    }
    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height]
        .map((n) => Math.round(Math.max(0, Math.min(1, n)) * 10000) / 10000);
    }
    function add(event) {
      if (!current || pointer !== event.pointerId) return;
      if (current.points.length >= 1000 || count() + current.points.length >= Math.min(maxPoints, budget)) {
        const last = current.points.at(-1);
        if (!compact()) return;
        current.points = last ? [last] : [];
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
      if (busy || current || event.button !== 0) return;
      if (strokes.length >= maxStrokes || count() >= Math.min(maxPoints, budget)) {
        if (!compact()) return;
      }
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      pointer = event.pointerId;
      current = { tool: settings.tool, color: settings.color, width: settings.tool === "erase" ? settings.eraserWidth : settings.width, points: [] };
      canvas.setPointerCapture(pointer);
      add(event);
    });
    canvas.addEventListener("pointermove", add);
    canvas.addEventListener("pointerup", (event) => { if (pointer === event.pointerId) { add(event); finish(); } });
    canvas.addEventListener("pointercancel", (event) => { if (pointer === event.pointerId) finish(); });
    canvas.addEventListener("lostpointercapture", finish);
    const firstImage = strokes.find(stroke => stroke.tool === "image");
    let ready = Promise.resolve();
    if (firstImage) {
      busy = true;
      ready = new Promise(resolve => {
        const image = new Image();
        image.onload = () => {
          if (image.naturalWidth === 1200 && image.naturalHeight === 720) images.set(firstImage.image, image);
          busy = false; redraw(); resolve();
        };
        image.onerror = () => { busy = false; onLimit(); resolve(); };
        image.src = firstImage.image;
      });
    }
    redraw();
    return {
      settings, finish, ready,
      undo() { finish(); if (strokes.length) { redo.push(strokes.pop()); publish(); } },
      redo() { finish(); if (redo.length) { strokes.push(redo.pop()); publish(); } },
      clear() { finish(); strokes = []; redo = []; publish(); },
      async png() {
        await ready;
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
  window.WORKBENCH_DRAWING = { colors, widths, eraserWidths, maxTotalPoints, normalize, paint, attach };
})();
