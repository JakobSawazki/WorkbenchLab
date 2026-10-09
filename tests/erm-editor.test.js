// Claude, OPT-04: Logik des Modell-Editors.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "erm-editor.js"), "utf8"), context, { filename: "erm-editor.js" });
const erm = context.window.WORKBENCH_ERM;
const plain = (value) => JSON.parse(JSON.stringify(value));
const task = (id) => erm.TASKS.find((item) => item.id === id);

let nextId = 1;
const attribute = (name, flags = {}) => ({ id: nextId++, name, type: flags.type || "INT", pk: Boolean(flags.pk), fk: Boolean(flags.fk) });
const entity = (name, attributes) => ({ id: nextId++, name, attributes });
const relation = (from, to, card) => ({ id: nextId++, from: from.id, to: to.id, card });

function fahrschule(card = "1:N", swap = false) {
  const ort = entity("Ort", [attribute("ortnr", { pk: true }), attribute("plz", { type: "VARCHAR(50)" }), attribute("ort", { type: "VARCHAR(50)" })]);
  const schueler = entity("Fahrschüler", [attribute("schuelernr", { pk: true }), attribute("nachname", { type: "VARCHAR(50)" }), attribute("ortnr", { fk: true })]);
  return { ort, schueler, model: { entities: [ort, schueler], relations: [swap ? relation(schueler, ort, card) : relation(ort, schueler, card)] } };
}

function vermietung() {
  const kunde = entity("Kunden", [attribute("kundennr", { pk: true }), attribute("nachname", { type: "VARCHAR(50)" })]);
  const rad = entity("Fahrräder", [attribute("fahrradnr", { pk: true }), attribute("modell", { type: "VARCHAR(50)" })]);
  const vertrag = entity("Mietvertrag", [attribute("vertragnr", { pk: true }), attribute("von_datum", { type: "DATE" }), attribute("bis_datum", { type: "DATE" }), attribute("kundennr", { fk: true }), attribute("fahrradnr", { fk: true })]);
  return { kunde, rad, vertrag, model: { entities: [kunde, rad, vertrag], relations: [relation(kunde, vertrag, "1:N"), relation(vertrag, rad, "N:1")] } };
}

const messages = (result) => plain(result.items).filter((item) => item.status === "warning").map((item) => item.text).join(" | ");

test("1:N-Aufgabe: richtiges Modell besteht in beiden Schreibrichtungen", () => {
  assert.equal(erm.checkModel(fahrschule("1:N").model, task("fahrschule-ort").target).passed, true);
  assert.equal(erm.checkModel(fahrschule("N:1", true).model, task("fahrschule-ort").target).passed, true);
});

test("1:N-Aufgabe: typische Fehler werden einzeln benannt", () => {
  const target = task("fahrschule-ort").target;
  assert.match(messages(erm.checkModel({ entities: [], relations: [] }, target)), /„Ort“ fehlt noch.*„Fahrschüler“ fehlt noch/);
  assert.equal(erm.checkModel({ entities: [], relations: [] }, target).passed, false);

  const reversed = fahrschule("N:1");
  assert.match(messages(erm.checkModel(reversed.model, target)), /Kardinalität zwischen/);

  const noRelation = fahrschule();
  noRelation.model.relations = [];
  assert.match(messages(erm.checkModel(noRelation.model, target)), /fehlt die Beziehung/);

  const noKey = fahrschule();
  noKey.ort.attributes[0].pk = false;
  assert.match(messages(erm.checkModel(noKey.model, target)), /braucht einen Primärschlüssel/);

  const noForeign = fahrschule();
  noForeign.schueler.attributes[2].fk = false;
  assert.match(messages(erm.checkModel(noForeign.model, target)), /N-Seite und braucht einen Fremdschlüssel/);

  const wrongSide = fahrschule();
  wrongSide.ort.attributes[1].fk = true;
  assert.match(messages(erm.checkModel(wrongSide.model, target)), /1-Seite und braucht keinen Fremdschlüssel/);

  const direct = fahrschule("M:N");
  assert.match(messages(erm.checkModel(direct.model, target)), /Beziehungsentität/);
});

test("M:N-Aufgabe: Beziehungsentität mit zwei Fremdschlüsseln besteht, direkte M:N-Beziehung nicht", () => {
  const target = task("fahrradvermietung").target;
  assert.equal(erm.checkModel(vermietung().model, target).passed, true);

  const direct = vermietung();
  direct.model.entities = [direct.kunde, direct.rad];
  direct.model.relations = [relation(direct.kunde, direct.rad, "M:N")];
  const result = erm.checkModel(direct.model, target);
  assert.equal(result.passed, false);
  assert.match(messages(result), /„Mietvertrag“ fehlt noch/);
  assert.match(messages(result), /Beziehungsentität mit zwei 1:N-Beziehungen/);

  const oneKey = vermietung();
  oneKey.vertrag.attributes[4].fk = false;
  assert.match(messages(erm.checkModel(oneKey.model, target)), /braucht 2 Fremdschlüssel/);

  const shortcut = vermietung();
  shortcut.model.relations.push(relation(shortcut.kunde, shortcut.rad, "1:N"));
  assert.match(messages(erm.checkModel(shortcut.model, target)), /nicht direkt zusammenhängen/);
});

test("das exportierte SQL läuft und setzt Schlüssel und Verweise in gültiger Reihenfolge", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  for (const build of [() => fahrschule().model, () => vermietung().model, () => {
    const data = fahrschule();
    data.model.entities.reverse();
    return data.model;
  }]) {
    const sql = erm.toSql(build());
    const db = new SQL.Database();
    try {
      db.run("PRAGMA foreign_keys = ON;");
      db.run(sql.replace(/DOUBLE|BOOLEAN/g, "INT"));
      const tables = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")[0].values.flat();
      assert.ok(tables.length >= 2);
      for (const name of tables) {
        assert.equal(db.exec(`SELECT COUNT(*) FROM pragma_table_info('${name}') WHERE pk > 0`)[0].values[0][0], 1, name);
      }
    } finally {
      db.close();
    }
  }
  const sql = erm.toSql(vermietung().model);
  assert.match(sql, /CREATE TABLE fahrraeder/);
  assert.match(sql, /FOREIGN KEY \(kundennr\) REFERENCES kunden\(kundennr\)/);
  assert.match(sql, /FOREIGN KEY \(fahrradnr\) REFERENCES fahrraeder\(fahrradnr\)/);
  assert.ok(sql.indexOf("CREATE TABLE mietvertrag") > sql.indexOf("CREATE TABLE kunden"));
  assert.ok(sql.indexOf("CREATE TABLE mietvertrag") > sql.indexOf("CREATE TABLE fahrraeder"));
});

test("Bezeichner und gespeicherte Modelle werden bereinigt", () => {
  assert.equal(erm.identifier(" Fahrschüler-Liste 2 "), "fahrschueler_liste_2");
  assert.equal(erm.identifier("1a"), "_1a");
  assert.equal(erm.identifier("x'); DROP TABLE y; --"), "x_drop_table_y");
  assert.equal(erm.norm("Wohn-Orte"), "wohnorte");

  const dirty = {
    entities: [
      { id: 1, name: "A".repeat(200), attributes: [{ id: 2, name: "a", type: "TEXT<script>", pk: 1, fk: 0 }, { id: 2, name: "doppelt" }, "kaputt"] },
      { id: 1, name: "doppelte Nummer" }, { id: -5, name: "negativ" }, null,
      { id: 3, name: "B", attributes: "kein Array" }
    ],
    relations: [{ id: 4, from: 1, to: 3, card: "1:N" }, { id: 5, from: 1, to: 1, card: "1:N" }, { id: 6, from: 1, to: 99, card: "1:N" }, { id: 7, from: 1, to: 3, card: "9:9" }]
  };
  const clean = plain(erm.sanitize(dirty));
  assert.equal(clean.entities.length, 2);
  assert.equal(clean.entities[0].name.length, erm.LIMITS.name);
  assert.deepEqual(clean.entities[0].attributes, [{ id: 2, name: "a", type: "INT", pk: true, fk: false }]);
  assert.deepEqual(clean.relations, [{ id: 4, from: 1, to: 3, card: "1:N" }]);
  assert.equal(clean.nextId, 5);
  assert.deepEqual(plain(erm.sanitize(null)), { entities: [], relations: [], nextId: 1 });
  assert.equal(plain(erm.sanitize({ entities: Array.from({ length: 30 }, (_, index) => ({ id: index + 1, name: "x" })) })).entities.length, erm.LIMITS.entities);
});

test("das Diagramm ordnet Kästen ohne Überlappung an", () => {
  for (const count of [1, 2, 3, 5, 8]) {
    const entities = Array.from({ length: count }, (_, index) => entity(`e${index}`, Array.from({ length: (index % 4) + 1 }, (_, n) => attribute(`a${n}`))));
    const plan = plain(erm.layout({ entities, relations: [] }));
    assert.equal(plan.boxes.length, count);
    for (const a of plan.boxes) {
      assert.ok(a.x >= 0 && a.y >= 0 && a.x + a.width <= plan.width && a.y + a.height <= plan.height);
      for (const b of plan.boxes) {
        if (a === b) continue;
        assert.ok(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y, `Überlappung bei ${count}`);
      }
    }
  }
});

test("der Editor wird vor der App geladen und veröffentlicht; Aufgaben sind vollständig", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.ok(html.indexOf('src="erm-editor.js') < html.indexOf('src="app.js'));
  assert.equal(require("../tools/build-site.cjs").isPublicFile("erm-editor.js"), true);
  assert.equal(erm.TASKS.length, 4);
  assert.equal(task("frei").target, null);
  for (const item of erm.TASKS.filter((entry) => entry.target)) {
    for (const wanted of item.target.entities) {
      assert.ok(wanted.names.every((name) => name === erm.norm(name)), `${item.id}: Namen müssen normalisiert sein`);
    }
    for (const wanted of item.target.relations) {
      assert.ok(item.target.entities.some((entry) => entry.key === wanted.one) && item.target.entities.some((entry) => entry.key === wanted.many));
    }
  }
});

test("Transferaufgabe Schulbibliothek: vier Entitätstypen mit drei 1:N-Beziehungen bestehen", () => {
  const target = task("schulbibliothek").target;
  const verlag = entity("Verlag", [attribute("verlagnr", { pk: true }), attribute("name", { type: "VARCHAR(50)" })]);
  const buch = entity("Bücher", [attribute("buchnr", { pk: true }), attribute("titel", { type: "VARCHAR(50)" }), attribute("verlagnr", { fk: true })]);
  const leser = entity("Leser", [attribute("lesernr", { pk: true }), attribute("nachname", { type: "VARCHAR(50)" })]);
  const ausleihe = entity("Ausleihe", [attribute("ausleihnr", { pk: true }), attribute("von", { type: "DATE" }), attribute("bis", { type: "DATE" }), attribute("buchnr", { fk: true }), attribute("lesernr", { fk: true })]);
  const model = { entities: [verlag, buch, leser, ausleihe], relations: [relation(verlag, buch, "1:N"), relation(ausleihe, buch, "N:1"), relation(leser, ausleihe, "1:N")] };
  assert.equal(erm.checkModel(model, target).passed, true);

  const direct = { entities: [verlag, buch, leser], relations: [relation(verlag, buch, "1:N"), relation(leser, buch, "M:N")] };
  const result = erm.checkModel(direct, target);
  assert.equal(result.passed, false);
  assert.match(messages(result), /„Ausleihe“ fehlt noch/);
  assert.match(messages(result), /Beziehungsentität/);

  buch.attributes[2].fk = false;
  assert.match(messages(erm.checkModel(model, target)), /„Bücher“ steht auf der N-Seite und braucht einen Fremdschlüssel/);
});

test("von Hand verschobene Kästen behalten ihren Platz; Positionen werden begrenzt gespeichert", () => {
  const a = entity("A", [attribute("id", { pk: true })]);
  const b = entity("B", [attribute("id", { pk: true })]);
  b.x = 900;
  b.y = 500;
  const plan = plain(erm.layout({ entities: [a, b], relations: [] }));
  assert.equal(plan.boxes[0].placed, false);
  assert.deepEqual([plan.boxes[1].x, plan.boxes[1].y, plan.boxes[1].placed], [900, 500, true]);
  assert.ok(plan.width >= 900 + plan.boxes[1].width && plan.height >= 500 + plan.boxes[1].height);
  const empty = plain(erm.layout({ entities: [], relations: [] }));
  assert.deepEqual([empty.width, empty.height], [erm.CANVAS.minWidth, erm.CANVAS.minHeight]);

  const stored = plain(erm.sanitize({ entities: [
    { id: 1, name: "ok", x: 120.6, y: 80.2 }, { id: 2, name: "zu weit", x: 99999, y: -50 },
    { id: 3, name: "nur x", x: 10 }, { id: 4, name: "kaputt", x: "12", y: null }
  ] })).entities;
  assert.deepEqual([stored[0].x, stored[0].y], [121, 80]);
  assert.deepEqual([stored[1].x, stored[1].y], [erm.CANVAS.maxX, 0]);
  assert.ok(!("x" in stored[2]) && !("y" in stored[2]) && !("x" in stored[3]));
});

test("Optionalität: Schreibweise 0..1/1..N wie in der Lerneinheit, optionaler Fremdschlüssel ohne NOT NULL", () => {
  assert.deepEqual(Array.from(erm.ends({ card: "1:N" })), ["1", "N"]);
  assert.deepEqual(Array.from(erm.ends({ card: "M:N" })), ["M", "N"]);
  assert.deepEqual(Array.from(erm.ends({ card: "1:N", fromOptional: true })), ["0..1", "1..N"]);
  assert.deepEqual(Array.from(erm.ends({ card: "1:N", toOptional: true })), ["1..1", "0..N"]);
  assert.deepEqual(Array.from(erm.ends({ card: "N:1", fromOptional: true, toOptional: true })), ["0..N", "0..1"]);
  assert.deepEqual(Array.from(erm.ends({ card: "M:N", fromOptional: true })), ["0..N", "1..N"]);

  const required = fahrschule("1:N");
  assert.match(erm.toSql(required.model), /ortnr INT NOT NULL,\n {2}PRIMARY KEY \(schuelernr\)/);
  const optional = fahrschule("1:N");
  optional.model.relations[0].fromOptional = true;
  const sql = erm.toSql(optional.model);
  assert.match(sql, /\n {2}ortnr INT,\n {2}PRIMARY KEY \(schuelernr\)/);
  assert.match(sql, /schuelernr INT NOT NULL/);
  assert.match(sql, /FOREIGN KEY \(ortnr\) REFERENCES ort\(ortnr\)/);
  // Optional an der N-Seite ändert die Tabellen nicht: Ein Ort darf ohne Fahrschüler bestehen.
  const manySide = fahrschule("1:N");
  manySide.model.relations[0].toOptional = true;
  assert.equal(erm.toSql(manySide.model), erm.toSql(fahrschule("1:N").model).replace(/x/g, "x"));
  const swapped = fahrschule("N:1", true);
  swapped.model.relations[0].toOptional = true;
  assert.match(erm.toSql(swapped.model), /\n {2}ortnr INT,\n/);

  // Die Prüfung der Aufgaben hängt nicht an der Optionalität; gespeichert wird nur ein echtes true.
  assert.equal(erm.checkModel(optional.model, task("fahrschule-ort").target).passed, true);
  const stored = plain(erm.sanitize({ entities: [{ id: 1, name: "a" }, { id: 2, name: "b" }], relations: [
    { id: 3, from: 1, to: 2, card: "1:N", fromOptional: true, toOptional: "ja" }, { id: 4, from: 2, to: 1, card: "1:N", fromOptional: false }
  ] })).relations;
  assert.deepEqual(stored, [{ id: 3, from: 1, to: 2, card: "1:N", fromOptional: true }, { id: 4, from: 2, to: 1, card: "1:N" }]);
});

test("sanitizeStore: Entwürfe für Browserspeicher und JSON-Sicherung werden bereinigt (0.40.0)", () => {
  const empty = { task: "fahrschule-ort", notation: "n", models: {} };
  for (const junk of [null, undefined, 5, "text", [], {}]) {
    assert.deepEqual(plain(erm.sanitizeStore(junk)), empty);
  }
  const model = { entities: [{ id: 1, name: "Ort", attributes: [{ id: 2, name: "ortnr", type: "INT", pk: true, fk: false }] }], relations: [], nextId: 3 };
  const store = plain(erm.sanitizeStore({
    task: "schulbibliothek", notation: "workbench", fremd: "x",
    models: { schulbibliothek: model, "gibt-es-nicht": model, frei: "kein Modell", "fahrschule-ort": { entities: "x" } }
  }));
  assert.equal(store.task, "schulbibliothek");
  assert.equal(store.notation, "workbench");
  assert.deepEqual(Object.keys(store), ["task", "notation", "models"]);
  assert.deepEqual(Object.keys(store.models).sort(), ["fahrschule-ort", "frei", "schulbibliothek"]);
  assert.deepEqual(store.models.schulbibliothek, model);
  assert.deepEqual(store.models.frei, { entities: [], relations: [], nextId: 1 });
  assert.equal(plain(erm.sanitizeStore({ task: "unbekannt", notation: "x", models: [] })).task, "fahrschule-ort");
  // Zweimal bereinigen ändert nichts mehr; das Ergebnis teilt keine Objekte mit der Eingabe.
  assert.deepEqual(plain(erm.sanitizeStore(store)), store);
  const input = { task: "frei", models: { frei: model } };
  const copy = erm.sanitizeStore(input);
  copy.models.frei.entities[0].name = "geändert";
  assert.equal(input.models.frei.entities[0].name, "Ort");
});
