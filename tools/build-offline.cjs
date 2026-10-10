const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { createHash } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { buildSite } = require("./build-site.cjs");

function buildOffline({ root = path.resolve(__dirname, ".."), output = path.join(root, "dist"), python = process.env.PYTHON || "python" } = {}) {
  const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Ungültige Paketversion.");
  const files = buildSite(root);
  const site = path.join(root, "_site");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "workbenchlab-offline-"));
  try {
    // Copy the explicit public manifest, never the whole Drive-synchronized directory.
    for (const file of files) {
      const target = path.join(directory, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(site, file), target);
    }
    const context = vm.createContext({ window: {} });
    for (const file of ["content.js", "learning-path.js"]) {
      vm.runInContext(fs.readFileSync(path.join(directory, file), "utf8"), context, { filename: file });
    }
    const content = context.window.WORKBENCH_CONTENT;
    if (content.version !== version) throw new Error("Inhalts- und Paketversion stimmen nicht überein.");
    const scripts = {};
    for (const lesson of content.lessons) {
      const href = lesson.classroomTask?.download?.href;
      if (!href) continue;
      if (!/^assets\/sql\/[a-z0-9-]+\.sql$/.test(href) || !files.includes(href)) throw new Error("SQL-Datei fehlt im öffentlichen Paket.");
      scripts[href] = fs.readFileSync(path.join(directory, href), "utf8");
    }
    const wasm = fs.readFileSync(path.join(directory, "vendor/sql.js/sql-wasm.wasm")).toString("base64");
    const captions = fs.readFileSync(path.join(directory, "assets/tutorials/workbench-start.de.vtt"), "utf8");
    const payload = `(() => {\n  "use strict";\n  if (location.protocol !== "file:") return;\n  window.WORKBENCH_OFFLINE = Object.freeze({\n    version: ${JSON.stringify(version)},\n    wasmBinary: Uint8Array.from(atob(${JSON.stringify(wasm)}), character => character.charCodeAt(0)),\n    scripts: Object.freeze(${JSON.stringify(scripts)}),\n    captions: ${JSON.stringify(captions)}\n  });\n})();\n`;
    fs.writeFileSync(path.join(directory, "offline-data.js"), payload);
    const indexFile = path.join(directory, "index.html");
    const html = fs.readFileSync(indexFile, "utf8");
    const appScript = `<script src="app.js?v=${version}"></script>`;
    if (html.split(appScript).length !== 2) throw new Error("App-Skript fehlt oder ist mehrfach vorhanden.");
    fs.writeFileSync(indexFile, html.replace(appScript, `<script src="offline-data.js?v=${version}"></script>\n  ${appScript}`));
    fs.writeFileSync(path.join(directory, "OFFLINE-LESEN.txt"), `WorkbenchLab ${version} - Offline-Paket\n\n1. ZIP vollstaendig entpacken.\n2. index.html in Microsoft Edge oeffnen (Doppelklick).\n3. Fuer die Klassenuebersicht lehrkraft.html oeffnen.\n\nKeine zusaetzliche Installation und kein lokaler Server erforderlich.\nSQL-Labor, Einheitenskripte und die lokale Startanleitung sind enthalten.\nYouTube und externe Quellen brauchen weiterhin Internet.\n\nLernstand regelmaessig ueber das Disketten-Symbol als Datei sichern.\nVor einem Ordner-, Versions- oder PC-Wechsel sichern und danach laden.\nBrowserspeicher bei direkt geoeffneten Dateien ist browserabhaengig.\nEine ZIP-Datei enthaelt niemals deinen persoenlichen Lernstand.\nArbeitsdatenbanken im freien Labor bleiben nur bis zum Neuladen erhalten.\n\nGeprueft in Edge auf dem Entwicklungs-PC; Schul-PC-Test steht noch aus.\nEnthaelt keine Lehrkraft-Loesungsdatei oder privaten Originalmaterialien.\n`);
    const packaged = [...files, "offline-data.js", "OFFLINE-LESEN.txt"].sort();
    const manifest = { app: "WorkbenchLab", version, files: packaged.map(file => {
      const bytes = fs.readFileSync(path.join(directory, file));
      return { path: file, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
    }) };
    fs.writeFileSync(path.join(directory, "offline-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    fs.mkdirSync(output, { recursive: true });
    const zip = path.join(output, `WorkbenchLab-${version}-offline.zip`);
    execFileSync(python, ["-B", path.join(root, "tools/pack-offline.py"), directory, zip], {
      input: JSON.stringify([...packaged, "offline-manifest.json"]), encoding: "utf8"
    });
    console.log(`Offline-Paket ${version}: ${zip}`);
    return { directory, zip, manifest };
  } catch (error) {
    fs.rmSync(directory, { recursive: true, force: true });
    throw error;
  }
}

module.exports = { buildOffline };
if (require.main === module) {
  const result = buildOffline();
  fs.rmSync(result.directory, { recursive: true, force: true });
}
