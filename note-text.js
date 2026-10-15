(() => {
  "use strict";
  const colors = ["blue", "green", "red", "violet"];
  function normalize(entries, text) {
    const valid = (Array.isArray(entries) ? entries : []).slice(-1200).filter(item => item && colors.includes(item.color)
      && Number.isInteger(item.start) && Number.isInteger(item.end) && item.start >= 0 && item.end > item.start
      && item.end <= text.length).map(({ start, end, color }) => ({ start, end, color })).sort((a, b) => a.start - b.start);
    const result = [];
    for (const item of valid) {
      const previous = result.at(-1);
      if (previous?.color === item.color && previous.end >= item.start) previous.end = Math.max(previous.end, item.end);
      else result.push(item);
    }
    return result.slice(-400);
  }
  function replace(entries, start, end, color) {
    const kept = entries.flatMap(item => item.end <= start || item.start >= end ? [item] : [
      ...(item.start < start ? [{ ...item, end: start }] : []), ...(item.end > end ? [{ ...item, start: end }] : [])
    ]);
    if (colors.includes(color) && end > start) kept.push({ start, end, color });
    return kept.slice(-400).sort((a, b) => a.start - b.start);
  }
  function rebase(entries, before, after) {
    let start = 0, tail = 0;
    while (start < before.length && start < after.length && before[start] === after[start]) start++;
    while (tail < before.length - start && tail < after.length - start && before.at(-1 - tail) === after.at(-1 - tail)) tail++;
    const end = before.length - tail, added = after.length - tail - start, delta = after.length - before.length;
    const inherited = entries.find(item => item.start < start && item.end >= end)?.color;
    const result = entries.flatMap(item => [
      ...(item.start < start ? [{ ...item, end: Math.min(item.end, start) }] : []),
      ...(item.end > end ? [{ ...item, start: Math.max(item.start, end) + delta, end: item.end + delta }] : [])
    ]);
    if (inherited && added) result.push({ start, end: start + added, color: inherited });
    return normalize(result, after);
  }
  function attach(editor, initial, initialMarks, changed) {
    let text = initial, marks = normalize(initialMarks, text);
    const past = [], future = [];
    const remember = () => { past.push({ text, marks: marks.map(item => ({ ...item })) }); if (past.length > 50) past.shift(); future.length = 0; };
    function selection() {
      const selected = window.getSelection();
      if (!selected.rangeCount || !editor.contains(selected.anchorNode) || !editor.contains(selected.focusNode)) return [text.length, text.length];
      const range = selected.getRangeAt(0), prefix = range.cloneRange();
      prefix.selectNodeContents(editor); prefix.setEnd(range.startContainer, range.startOffset);
      return [prefix.toString().length, prefix.toString().length + range.toString().length];
    }
    function select(start, end) {
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let offset = 0, first = null, last = null;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!first && start <= offset + node.length) first = [node, Math.max(0, start - offset)];
        if (end <= offset + node.length) { last = [node, Math.max(0, end - offset)]; break; }
        offset += node.length;
      }
      const range = document.createRange();
      if (first && last) { range.setStart(...first); range.setEnd(...last); }
      else { range.selectNodeContents(editor); range.collapse(false); }
      window.getSelection().removeAllRanges(); window.getSelection().addRange(range);
    }
    function render() {
      const fragment = document.createDocumentFragment();
      const boundaries = [...new Set([0, text.length, ...marks.flatMap(item => [item.start, item.end])])].sort((a, b) => a - b);
      boundaries.slice(0, -1).forEach((start, index) => {
        const end = boundaries[index + 1], color = marks.findLast(item => item.start <= start && item.end >= end)?.color;
        const node = document.createTextNode(text.slice(start, end));
        if (color) { const span = document.createElement("span"); span.dataset.noteInk = color; span.append(node); fragment.append(span); }
        else fragment.append(node);
      });
      editor.replaceChildren(fragment);
    }
    function update(next, caret) {
      if (next.length > 12000) {
        render(); if (caret) select(Math.min(caret[0], text.length), Math.min(caret[1], text.length));
        return;
      }
      if (next !== text) remember();
      marks = rebase(marks, text, next); text = next;
      render(); if (caret) select(Math.min(caret[0], text.length), Math.min(caret[1], text.length));
      changed(marks);
    }
    Object.defineProperties(editor, {
      value: { get: () => text, set: next => update(String(next)) },
      selectionStart: { get: () => selection()[0] }, selectionEnd: { get: () => selection()[1] }
    });
    editor.setRangeText = (insert, start, end) => update(text.slice(0, start) + insert + text.slice(end), [start + insert.length, start + insert.length]);
    editor.select = () => select(0, text.length);
    editor.addEventListener("input", event => { if (!event.isComposing) update(editor.innerText.replace(/\r/g, ""), selection()); });
    editor.addEventListener("compositionend", () => { update(editor.innerText.replace(/\r/g, ""), selection()); editor.dispatchEvent(new Event("input", { bubbles: true })); });
    function insert(value) {
      const [start, end] = selection();
      editor.setRangeText(value, start, end);
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    }
    editor.addEventListener("beforeinput", event => {
      if (["insertParagraph", "insertLineBreak"].includes(event.inputType)) {
        event.preventDefault();
        const [start, end] = selection();
        const lineStart = text.lastIndexOf("\n", start - 1) + 1;
        const numbered = text.slice(lineStart, start).match(/^(\d{1,5})\. (.*)$/);
        const atLineEnd = start === end && (start === text.length || text[start] === "\n");
        if (event.inputType === "insertParagraph" && numbered && atLineEnd) {
          if (numbered[2].trim()) insert(`\n${Number(numbered[1]) + 1}. `);
          else {
            editor.setRangeText("", lineStart, start);
            editor.dispatchEvent(new Event("input", { bubbles: true }));
          }
        } else insert("\n");
      }
      else if (event.inputType.startsWith("format")) event.preventDefault();
    });
    editor.addEventListener("paste", event => { event.preventDefault(); insert(event.clipboardData.getData("text/plain")); });
    editor.addEventListener("drop", event => { event.preventDefault(); });
    editor.addEventListener("keydown", event => {
      if (!(event.ctrlKey || event.metaKey) || !["z", "y"].includes(event.key.toLowerCase())) return;
      event.preventDefault();
      const undo = event.key.toLowerCase() === "z" && !event.shiftKey;
      const from = undo ? past : future, to = undo ? future : past;
      if (!from.length) return;
      to.push({ text, marks: marks.map(item => ({ ...item })) });
      ({ text, marks } = from.pop()); render(); select(text.length, text.length); changed(marks);
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const panel = editor.closest("[role=tabpanel]");
    panel.querySelectorAll("[data-note-color]").forEach(button => {
      button.addEventListener("pointerdown", event => event.preventDefault());
      button.addEventListener("click", () => {
        const [start, end] = selection();
        if (start === end) { editor.focus(); return; }
        remember();
        marks = replace(marks, start, end, button.dataset.noteColor);
        render(); editor.focus(); select(start, end); changed(marks);
        editor.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
    render();
  }
  window.WORKBENCH_NOTE_TEXT = { colors, normalize, replace, rebase, attach };
})();
