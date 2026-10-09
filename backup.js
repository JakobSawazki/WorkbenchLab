(() => {
  "use strict";
  // Prüfsumme der JSON-Sicherung ohne DOM und ohne Lernstand. Am 2026-10-09 von Claude unverändert
  // aus app.js ausgelagert (OPT-16, Schritt 2); Verfasser des Codes ist Codex. Lernplattform und
  // Klassenübersicht benutzen jetzt dieselben Funktionen statt zweier Kopien.

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

  window.WORKBENCH_BACKUP = { stableStringify, sha256Hex, verifyBackupIntegrity };
})();
