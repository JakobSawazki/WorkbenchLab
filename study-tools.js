(function () {
  "use strict";

  const colors = new Set(["yellow", "mint", "coral"]);

  function normalizeHighlights(candidate, allowedLessons) {
    const result = {};
    if (!candidate || typeof candidate !== "object") return result;
    for (const [id, entries] of Object.entries(candidate)) {
      if (!allowedLessons.has(id) || !Array.isArray(entries)) continue;
      result[id] = entries.slice(0, 400).filter((item) => item
        && typeof item.block === "string"
        && /^(section-\d+-(heading|paragraph-\d+|rule-\d+|definition-\d+|term-\d+|datatype-\d+-\d+|code|tip|warning)|objective-\d+)$/.test(item.block)
        && Number.isInteger(item.start) && Number.isInteger(item.end)
        && item.start >= 0 && item.end > item.start && item.end <= 20000
        && typeof item.quote === "string" && item.quote.length === item.end - item.start
        && colors.has(item.color)).map(({ block, start, end, quote, color }) => ({ block, start, end, quote, color }));
    }
    return result;
  }

  function updateHighlights(entries, selection, color) {
    let result = entries.slice();
    for (const anchor of selection) {
      const kept = [];
      for (const item of result) {
        if (item.block !== anchor.block || item.end <= anchor.start || item.start >= anchor.end) {
          kept.push(item);
          continue;
        }
        if (item.start < anchor.start) kept.push({ ...item, end: anchor.start, quote: item.quote.slice(0, anchor.start - item.start) });
        if (item.end > anchor.end) kept.push({ ...item, start: anchor.end, quote: item.quote.slice(anchor.end - item.start) });
      }
      if (colors.has(color)) kept.push({ ...anchor, color });
      result = kept;
    }
    return result.slice(-400);
  }

  function selectionAnchors(root, selection) {
    if (!root || !selection?.rangeCount || selection.isCollapsed) return [];
    const selected = selection.getRangeAt(0);
    if (!root.contains(selected.startContainer) || !root.contains(selected.endContainer)) return [];
    const anchors = [];
    for (const block of root.querySelectorAll("[data-highlight-block]")) {
      if (!selected.intersectsNode(block)) continue;
      const clipped = document.createRange();
      clipped.selectNodeContents(block);
      if (selected.compareBoundaryPoints(Range.START_TO_START, clipped) > 0) clipped.setStart(selected.startContainer, selected.startOffset);
      if (selected.compareBoundaryPoints(Range.END_TO_END, clipped) < 0) clipped.setEnd(selected.endContainer, selected.endOffset);
      if (clipped.collapsed) continue;
      const prefix = document.createRange();
      prefix.selectNodeContents(block);
      prefix.setEnd(clipped.startContainer, clipped.startOffset);
      const start = prefix.toString().length;
      const quote = clipped.toString();
      if (quote.trim()) anchors.push({ block: block.dataset.highlightBlock, start, end: start + quote.length, quote });
    }
    return anchors;
  }

  function applyHighlights(root, entries) {
    if (!root) return;
    for (const mark of root.querySelectorAll("mark[data-study-mark]")) mark.replaceWith(...mark.childNodes);
    root.normalize();
    for (const block of root.querySelectorAll("[data-highlight-block]")) {
      const text = block.textContent;
      const matches = entries.filter((item) => item.block === block.dataset.highlightBlock
        && text.slice(item.start, item.end) === item.quote).sort((a, b) => b.start - a.start);
      for (const item of matches) {
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        const segments = [];
        let offset = 0;
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const end = offset + node.length;
          if (offset < item.end && end > item.start) segments.push({ node, start: Math.max(0, item.start - offset), end: Math.min(node.length, item.end - offset) });
          offset = end;
        }
        // Wrap text-node fragments separately to preserve inline code and semantic elements.
        for (const segment of segments.reverse()) {
          const range = document.createRange();
          range.setStart(segment.node, segment.start);
          range.setEnd(segment.node, segment.end);
          const mark = document.createElement("mark");
          mark.dataset.studyMark = item.color;
          range.surroundContents(mark);
        }
      }
    }
  }

  function worksheetLength(type, value) {
    const text = String(value || "").slice(0, 32);
    return type === "VARCHAR" ? text.replace(/[^0-9]/g, "").slice(0, 5) : text;
  }

  function fixedStorage(type) {
    return ({ INT: "4 Byte", DOUBLE: "8 Byte", DATE: "3 Byte", TIME: "3 Byte", "BOOLEAN / TINYINT(1)": "1 Byte" })[type] || "";
  }

  window.WORKBENCH_STUDY = { normalizeHighlights, updateHighlights, selectionAnchors, applyHighlights, worksheetLength, fixedStorage };
})();
