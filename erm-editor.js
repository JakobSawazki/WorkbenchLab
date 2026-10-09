(() => {
  "use strict";
  // Modell-Editor (Claude, OPT-04): Entitätstypen, Attribute, Schlüssel und Beziehungen
  // selbst anlegen, als Diagramm sehen, gegen ein Sollmodell prüfen und als SQL exportieren.
  // Oben reine Logik (in Node testbar), unten die Seitenanbindung.

  const TYPES = ["INT", "VARCHAR(50)", "DATE", "DOUBLE", "BOOLEAN"];
  const CARDS = ["1:N", "N:1", "1:1", "M:N"];
  const LIMITS = { entities: 8, attributes: 12, relations: 12, name: 40 };
  const CANVAS = { minWidth: 700, minHeight: 340, maxX: 1400, maxY: 1000, step: 10 };

  function norm(value) {
    return String(value ?? "").toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]/g, "");
  }

  function identifier(value) {
    return String(value ?? "").trim().toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").replace(/^(\d)/, "_$1");
  }

  function emptyModel() {
    return { entities: [], relations: [], nextId: 1 };
  }

  function sanitize(candidate) {
    const model = emptyModel();
    const text = (value) => (typeof value === "string" ? value.slice(0, LIMITS.name) : "");
    const ids = new Set();
    const takeId = (value) => {
      const id = Number.isInteger(value) && value > 0 && !ids.has(value) ? value : null;
      if (id) ids.add(id);
      return id;
    };
    (Array.isArray(candidate?.entities) ? candidate.entities : []).slice(0, LIMITS.entities).forEach((entity) => {
      const id = takeId(entity?.id);
      if (!id) return;
      const attributes = [];
      (Array.isArray(entity.attributes) ? entity.attributes : []).slice(0, LIMITS.attributes).forEach((attribute) => {
        const attributeId = takeId(attribute?.id);
        if (!attributeId) return;
        attributes.push({ id: attributeId, name: text(attribute.name), type: TYPES.includes(attribute.type) ? attribute.type : "INT", pk: Boolean(attribute.pk), fk: Boolean(attribute.fk) });
      });
      const place = (value, max) => (Number.isFinite(value) ? Math.min(max, Math.max(0, Math.round(value))) : null);
      const x = place(entity.x, CANVAS.maxX);
      const y = place(entity.y, CANVAS.maxY);
      model.entities.push({ id, name: text(entity.name), attributes, ...(x !== null && y !== null ? { x, y } : {}) });
    });
    const entityIds = new Set(model.entities.map((entity) => entity.id));
    (Array.isArray(candidate?.relations) ? candidate.relations : []).slice(0, LIMITS.relations).forEach((relation) => {
      if (!relation || !entityIds.has(relation.from) || !entityIds.has(relation.to) || relation.from === relation.to || !CARDS.includes(relation.card)) return;
      const id = takeId(relation.id);
      if (!id) return;
      model.relations.push({ id, from: relation.from, to: relation.to, card: relation.card, ...(relation.fromOptional === true ? { fromOptional: true } : {}), ...(relation.toOptional === true ? { toOptional: true } : {}) });
    });
    model.nextId = Math.max(0, ...ids) + 1;
    return model;
  }

  // Beschriftung der beiden Enden. Ohne Optionalität die kurze Form (1, N, M); sobald eine
  // Seite optional ist, beide Enden in der Schreibweise der Lerneinheit: 0..1, 1..1, 0..N, 1..N.
  // Die Angabe an einem Entitätstyp sagt, wie viele seiner Datensätze zu einem der anderen Seite gehören.
  function ends(relation, notation = "n") {
    const [left, right] = relation.card.split(":");
    // Abitur und MySQL Workbench schreiben die Viele-Seite als ∞ (siehe Haupttermin 2025, Aufgabe 1.2).
    const many = (value) => (notation === "workbench" && value !== "1" ? "∞" : value);
    if (!relation.fromOptional && !relation.toOptional) return [many(left), many(right)];
    const full = (max, optional) => `${optional ? 0 : 1}..${max === "1" ? "1" : "N"}`;
    return [full(left, relation.fromOptional), full(right, relation.toOptional)];
  }

  // Liefert für jede Beziehung die Sicht „ein Datensatz von one gehört zu vielen von many“.
  function oneToMany(relation) {
    if (relation.card === "1:N") return { one: relation.from, many: relation.to, oneOptional: relation.fromOptional === true };
    if (relation.card === "N:1") return { one: relation.to, many: relation.from, oneOptional: relation.toOptional === true };
    return null;
  }

  function checkModel(model, target) {
    const items = [];
    const ok = (text) => items.push({ status: "success", text });
    const warn = (text) => items.push({ status: "warning", text });
    const found = new Map();
    target.entities.forEach((wanted) => {
      const match = model.entities.find((entity) => wanted.names.includes(norm(entity.name)));
      if (!match) {
        warn(`Der Entitätstyp „${wanted.label}“ fehlt noch.`);
        return;
      }
      found.set(wanted.key, match);
      const keys = match.attributes.filter((attribute) => attribute.pk);
      const foreign = match.attributes.filter((attribute) => attribute.fk);
      if (keys.length === 0) {
        warn(`„${match.name}“ braucht einen Primärschlüssel.`);
      } else if (keys.length > 1 && !wanted.compositeKey) {
        warn(`„${match.name}“ hat mehrere Primärschlüssel-Attribute. Hier genügt genau eines.`);
      } else if (foreign.length < wanted.foreignKeys) {
        warn(wanted.foreignKeys === 1
          ? `„${match.name}“ steht auf der N-Seite und braucht einen Fremdschlüssel.`
          : `„${match.name}“ verbindet ${wanted.foreignKeys} Entitätstypen und braucht ${wanted.foreignKeys} Fremdschlüssel.`);
      } else if (foreign.length > wanted.foreignKeys) {
        warn(wanted.foreignKeys === 0
          ? `„${match.name}“ steht auf der 1-Seite und braucht keinen Fremdschlüssel.`
          : `„${match.name}“ hat mehr Fremdschlüssel als nötig.`);
      } else if (match.attributes.some((attribute) => !attribute.name.trim())) {
        warn(`In „${match.name}“ hat ein Attribut noch keinen Namen.`);
      } else if (match.attributes.length < (wanted.minAttributes || 2)) {
        warn(`„${match.name}“ sollte neben dem Schlüssel mindestens ein beschreibendes Attribut haben.`);
      } else {
        ok(`„${match.name}“ ist mit Schlüssel${wanted.foreignKeys ? " und Fremdschlüssel" : ""} vollständig.`);
      }
    });
    const extra = model.entities.filter((entity) => ![...found.values()].includes(entity));
    if (extra.length && found.size === target.entities.length) {
      warn(`Zusätzlicher Entitätstyp: „${extra[0].name || "ohne Namen"}“. Prüfe, ob er für diese Aufgabe nötig ist.`);
    }
    const keyOf = (entity) => [...found.entries()].find(([, value]) => value === entity)?.[0];
    const direct = model.relations.find((relation) => relation.card === "M:N");
    if (direct) {
      const a = model.entities.find((entity) => entity.id === direct.from);
      const b = model.entities.find((entity) => entity.id === direct.to);
      warn(`Zwischen „${a?.name}“ und „${b?.name}“ steht noch M:N. Eine relationale Datenbank braucht dafür eine Beziehungsentität mit zwei 1:N-Beziehungen.`);
    }
    target.relations.forEach((wanted) => {
      const one = found.get(wanted.one);
      const many = found.get(wanted.many);
      if (!one || !many) return;
      const between = model.relations.filter((relation) => [relation.from, relation.to].includes(one.id) && [relation.from, relation.to].includes(many.id));
      const right = between.some((relation) => {
        const view = oneToMany(relation);
        return view && view.one === one.id && view.many === many.id;
      });
      if (right) {
        ok(`Beziehung stimmt: ein Datensatz in „${one.name}“ gehört zu vielen in „${many.name}“.`);
      } else if (between.length) {
        warn(`Die Kardinalität zwischen „${one.name}“ und „${many.name}“ passt noch nicht. Überlege: Wie viele Datensätze der einen Seite gehören zu einem der anderen?`);
      } else {
        warn(`Zwischen „${one.name}“ und „${many.name}“ fehlt die Beziehung.`);
      }
    });
    const wantedPairs = target.relations.map((wanted) => [found.get(wanted.one)?.id, found.get(wanted.many)?.id]);
    const surplus = model.relations.find((relation) => relation.card !== "M:N" && keyOf(model.entities.find((entity) => entity.id === relation.from)) && keyOf(model.entities.find((entity) => entity.id === relation.to))
      && !wantedPairs.some(([a, b]) => [relation.from, relation.to].includes(a) && [relation.from, relation.to].includes(b)));
    if (surplus) {
      warn("Eine Beziehung verbindet zwei Entitätstypen, die in dieser Aufgabe nicht direkt zusammenhängen.");
    }
    return { passed: items.length > 0 && items.every((item) => item.status === "success"), items };
  }

  function toSql(model) {
    const tables = model.entities.map((entity) => ({ entity, name: identifier(entity.name) })).filter((table) => table.name);
    const byId = new Map(tables.map((table) => [table.entity.id, table]));
    const references = new Map(tables.map((table) => [table.entity.id, []]));
    model.relations.forEach((relation) => {
      const view = oneToMany(relation);
      if (!view || !byId.has(view.one) || !byId.has(view.many)) return;
      const parent = byId.get(view.one);
      const parentKey = parent.entity.attributes.find((attribute) => attribute.pk && identifier(attribute.name));
      if (!parentKey) return;
      const used = references.get(view.many).map((reference) => reference.column);
      const candidates = byId.get(view.many).entity.attributes.filter((attribute) => attribute.fk && identifier(attribute.name) && !used.includes(identifier(attribute.name)));
      const column = candidates.find((attribute) => norm(attribute.name) === norm(parentKey.name)) || candidates[0];
      if (column) references.get(view.many).push({ column: identifier(column.name), table: parent.name, key: identifier(parentKey.name), parentId: view.one, optional: view.oneOptional });
    });
    const ordered = [];
    const visit = (table, trail = new Set()) => {
      if (ordered.includes(table) || trail.has(table)) return;
      trail.add(table);
      references.get(table.entity.id).forEach((reference) => visit(byId.get(reference.parentId), trail));
      ordered.push(table);
    };
    tables.forEach((table) => visit(table));
    const statements = ordered.map((table) => {
      const columns = table.entity.attributes.filter((attribute) => identifier(attribute.name));
      // Darf ein Datensatz ohne Zuordnung bleiben (0..1 an der 1-Seite), bleibt der Fremdschlüssel ohne NOT NULL.
      const nullable = new Set(references.get(table.entity.id).filter((reference) => reference.optional).map((reference) => reference.column));
      const lines = columns.map((attribute) => `  ${identifier(attribute.name)} ${attribute.type}${attribute.pk || (attribute.fk && !nullable.has(identifier(attribute.name))) ? " NOT NULL" : ""}`);
      const keys = columns.filter((attribute) => attribute.pk).map((attribute) => identifier(attribute.name));
      if (keys.length) lines.push(`  PRIMARY KEY (${keys.join(", ")})`);
      references.get(table.entity.id).forEach((reference) => lines.push(`  FOREIGN KEY (${reference.column}) REFERENCES ${reference.table}(${reference.key})`));
      return lines.length ? `CREATE TABLE ${table.name} (\n${lines.join(",\n")}\n);` : `-- ${table.name}: noch keine Attribute`;
    });
    return `-- Erzeugt im WorkbenchLab-Modell-Editor. Vor dem Ausführen in MySQL Workbench Zielschema prüfen.\n${statements.join("\n\n")}\n`;
  }

  // Automatische Anordnung im Raster; ein von Hand verschobener Kasten behält seinen Platz.
  function layout(model) {
    const columns = model.entities.length <= 4 ? Math.max(1, Math.min(model.entities.length, 2)) : 3;
    const width = 210;
    const gapX = 90;
    const gapY = 60;
    const rowHeights = [];
    const boxes = model.entities.map((entity, index) => {
      const height = 38 + Math.max(1, entity.attributes.length) * 20 + 8;
      const row = Math.floor(index / columns);
      rowHeights[row] = Math.max(rowHeights[row] || 0, height);
      return { id: entity.id, column: index % columns, row, width, height };
    });
    const rowTop = [];
    rowHeights.reduce((top, height, row) => { rowTop[row] = top; return top + height + gapY; }, 20);
    boxes.forEach((box, index) => {
      const entity = model.entities[index];
      const placed = Number.isFinite(entity.x) && Number.isFinite(entity.y);
      box.x = placed ? Math.max(0, entity.x) : 20 + box.column * (width + gapX);
      box.y = placed ? Math.max(0, entity.y) : rowTop[box.row];
      box.placed = placed;
    });
    return {
      boxes,
      width: Math.max(CANVAS.minWidth, ...boxes.map((box) => box.x + box.width + 20)),
      height: Math.max(CANVAS.minHeight, ...boxes.map((box) => box.y + box.height + 20))
    };
  }

  const TASKS = [
    {
      id: "frei",
      title: "Freies Modell",
      text: "Entwirf ein eigenes Modell, zum Beispiel für eine Bibliothek, einen Sportverein oder deinen Lieblingsverein. Hier wird nichts geprüft.",
      target: null
    },
    {
      id: "fahrschule-ort",
      title: "Fahrschüler und Wohnorte (1:N)",
      lesson: "L2.1",
      text: "Eine Fahrschule speichert zu jedem Fahrschüler Name und Wohnort. In einem Ort können viele Fahrschüler wohnen; jeder Fahrschüler wohnt in genau einem Ort. Modelliere zwei Entitätstypen mit Schlüsseln und der passenden Beziehung.",
      target: {
        entities: [
          { key: "ort", label: "Ort", names: ["ort", "orte", "wohnort", "wohnorte"], foreignKeys: 0 },
          { key: "schueler", label: "Fahrschüler", names: ["fahrschueler", "schueler", "fahrschuelerin", "fahrschuelerinnen"], foreignKeys: 1 }
        ],
        relations: [{ one: "ort", many: "schueler" }]
      }
    },
    {
      id: "fahrradvermietung",
      title: "Fahrradvermietung (M:N auflösen)",
      lesson: "L3.1",
      text: "Kunden mieten Fahrräder. Ein Kunde kann im Lauf der Zeit viele Fahrräder mieten, und ein Fahrrad wird von vielen Kunden gemietet. Zu jeder Vermietung gehören ein Beginn und ein Ende. Modelliere so, dass sich das in Tabellen umsetzen lässt.",
      target: {
        entities: [
          { key: "kunde", label: "Kunde", names: ["kunde", "kunden", "kundin"], foreignKeys: 0 },
          { key: "fahrrad", label: "Fahrrad", names: ["fahrrad", "fahrraeder", "rad", "raeder"], foreignKeys: 0 },
          { key: "vertrag", label: "Mietvertrag", names: ["mietvertrag", "mietvertraege", "vermietung", "vermietungen", "miete", "mieten", "ausleihe", "ausleihen", "vertrag", "vertraege"], foreignKeys: 2, minAttributes: 4 }
        ],
        relations: [{ one: "kunde", many: "vertrag" }, { one: "fahrrad", many: "vertrag" }]
      }
    }
  ];

  TASKS.push({
    id: "schulbibliothek",
    title: "Schulbibliothek (Transfer)",
    lesson: "L3.1",
    text: "Eine Schulbibliothek verwaltet Bücher. Jedes Buch stammt von genau einem Verlag; ein Verlag hat viele Bücher. Leserinnen und Leser leihen Bücher aus: Eine Person kann viele Bücher ausleihen, und ein Buch wird im Lauf der Zeit von vielen Personen ausgeliehen. Zu jeder Ausleihe gehören ein Ausleih- und ein Rückgabedatum. Modelliere vier Entitätstypen so, dass sich das in Tabellen umsetzen lässt.",
    target: {
      entities: [
        { key: "verlag", label: "Verlag", names: ["verlag", "verlage"], foreignKeys: 0 },
        { key: "buch", label: "Buch", names: ["buch", "buecher"], foreignKeys: 1 },
        { key: "leser", label: "Leser", names: ["leser", "leserin", "leserinnen", "person", "personen", "schueler", "mitglied", "mitglieder", "nutzer", "benutzer"], foreignKeys: 0 },
        { key: "ausleihe", label: "Ausleihe", names: ["ausleihe", "ausleihen", "leihe", "leihen", "ausleihvorgang", "ausleihvorgaenge", "verleih"], foreignKeys: 2, minAttributes: 4 }
      ],
      relations: [{ one: "verlag", many: "buch" }, { one: "buch", many: "ausleihe" }, { one: "leser", many: "ausleihe" }]
    }
  });

  // Alle Entwürfe (je Aufgabe ein Modell) samt gewählter Aufgabe und Schreibweise bereinigen.
  // Wird beim Laden aus dem Browserspeicher und beim Einlesen einer JSON-Sicherung benutzt.
  function sanitizeStore(candidate) {
    const clean = { task: "fahrschule-ort", notation: "n", models: {} };
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      if (TASKS.some((task) => task.id === candidate.task)) clean.task = candidate.task;
      if (candidate.notation === "workbench") clean.notation = "workbench";
      const models = candidate.models && typeof candidate.models === "object" ? candidate.models : {};
      TASKS.forEach((task) => { if (models[task.id]) clean.models[task.id] = sanitize(models[task.id]); });
    }
    return clean;
  }

  window.WORKBENCH_ERM = { TYPES, CARDS, TASKS, LIMITS, CANVAS, norm, identifier, emptyModel, sanitize, sanitizeStore, checkModel, toSql, layout, oneToMany, ends };

  if (typeof document === "undefined") return;

  // ---------- Seitenanbindung ----------
  const storageKey = "workbenchlab-erm-v1";
  let helpers = null;
  let store = { task: "fahrschule-ort", notation: "n", models: {} };
  let lastCheck = null;

  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (stored && typeof stored === "object") {
        store = sanitizeStore(stored);
      }
    } catch {}
  }

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(store)); } catch {}
  }

  const currentTask = () => TASKS.find((task) => task.id === store.task);
  function model() {
    if (!store.models[store.task]) store.models[store.task] = emptyModel();
    return store.models[store.task];
  }

  function diagramSvg(current, escapeHtml) {
    if (!current.entities.length) {
      return `<p class="erm-empty">Noch kein Entitätstyp. Lege links den ersten an.</p>`;
    }
    const plan = layout(current);
    const box = (id) => plan.boxes.find((item) => item.id === id);
    const lines = current.relations.map((relation) => {
      const a = box(relation.from);
      const b = box(relation.to);
      const ax = a.x + a.width / 2, ay = a.y + a.height / 2, bx = b.x + b.width / 2, by = b.y + b.height / 2;
      const edge = (rect, dx, dy) => {
        const scale = Math.min(Math.abs(dx) > 0.01 ? (rect.width / 2) / Math.abs(dx) : Infinity, Math.abs(dy) > 0.01 ? (rect.height / 2) / Math.abs(dy) : Infinity);
        return { x: rect.x + rect.width / 2 + dx * scale, y: rect.y + rect.height / 2 + dy * scale };
      };
      const start = edge(a, bx - ax, by - ay);
      const end = edge(b, ax - bx, ay - by);
      const [left, right] = ends(relation, store.notation);
      const label = (from, to, text) => `<text class="erm-card" x="${from.x + (to.x - from.x) * 0.18}" y="${from.y + (to.y - from.y) * 0.18 - 6}" text-anchor="middle">${text}</text>`;
      return `<line class="erm-line" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"></line>${label(start, end, left)}${label(end, start, right)}`;
    }).join("");
    const boxes = current.entities.map((entity) => {
      const rect = box(entity.id);
      const rows = entity.attributes.map((attribute, index) => `<text class="erm-attribute${attribute.pk ? " is-pk" : ""}" x="${rect.x + 12}" y="${rect.y + 56 + index * 20}">${escapeHtml(attribute.name || "…")}${attribute.pk ? " (PK)" : ""}${attribute.fk ? " (FK)" : ""}</text>`).join("");
      return `<g class="erm-entity-box" data-box="${entity.id}" tabindex="0" role="group" aria-label="Kasten ${escapeHtml(entity.name || "ohne Namen")}: mit der Maus ziehen oder mit den Pfeiltasten verschieben"><rect class="erm-box" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" rx="8"></rect><rect class="erm-box-head" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="32" rx="8"></rect><text class="erm-title" x="${rect.x + rect.width / 2}" y="${rect.y + 21}" text-anchor="middle">${escapeHtml(entity.name || "ohne Namen")}</text>${rows}</g>`;
    }).join("");
    const summary = `${current.entities.length} Entitätstyp${current.entities.length === 1 ? "" : "en"}, ${current.relations.length} Beziehung${current.relations.length === 1 ? "" : "en"}`;
    return `<svg class="erm-svg" viewBox="0 0 ${plan.width} ${plan.height}" role="img" aria-label="Diagramm: ${summary}" style="max-width:${plan.width}px">${lines}${boxes}</svg>`;
  }

  function render() {
    const container = document.querySelector("#ermEditor");
    if (!container || !helpers) return;
    const { escapeHtml, renderIcons } = helpers;
    const current = model();
    const task = currentTask();
    const entityOptions = (selected) => current.entities.map((entity) => `<option value="${entity.id}" ${entity.id === selected ? "selected" : ""}>${escapeHtml(entity.name || "ohne Namen")}</option>`).join("");
    container.innerHTML = `
      <section class="section-band erm-task">
        <div class="erm-task-pick">
          <label for="ermTask">Aufgabe</label>
          <select id="ermTask">${TASKS.map((item) => `<option value="${item.id}" ${item.id === task.id ? "selected" : ""}>${escapeHtml(item.lesson ? `${item.lesson} · ${item.title}` : item.title)}</option>`).join("")}</select>
        </div>
        <p>${escapeHtml(task.text)}</p>
      </section>
      <div class="erm-layout">
        <section class="erm-form" aria-label="Modell bearbeiten">
          <h3>Entitätstypen</h3>
          ${current.entities.map((entity, entityIndex) => `
            <fieldset class="erm-entity" data-entity="${entity.id}">
              <legend class="sr-only">Entitätstyp ${entityIndex + 1}</legend>
              <div class="erm-row">
                <label class="sr-only" for="ermEntity${entity.id}">Name des Entitätstyps ${entityIndex + 1}</label>
                <input id="ermEntity${entity.id}" data-erm-entity-name value="${escapeHtml(entity.name)}" maxlength="${LIMITS.name}" placeholder="Name, z. B. Ort" autocomplete="off" spellcheck="false">
                <button class="icon-button" type="button" data-erm-remove-entity title="Entitätstyp entfernen" aria-label="Entitätstyp ${escapeHtml(entity.name || String(entityIndex + 1))} entfernen"><i data-lucide="trash-2" aria-hidden="true"></i></button>
              </div>
              ${entity.attributes.map((attribute, attributeIndex) => `
                <div class="erm-attribute-row" data-attribute="${attribute.id}">
                  <label class="sr-only" for="ermAttr${attribute.id}">Attribut ${attributeIndex + 1} von ${escapeHtml(entity.name || "Entitätstyp")}</label>
                  <input id="ermAttr${attribute.id}" data-erm-attribute-name value="${escapeHtml(attribute.name)}" maxlength="${LIMITS.name}" placeholder="Attribut" autocomplete="off" spellcheck="false">
                  <label class="sr-only" for="ermType${attribute.id}">Datentyp</label>
                  <select id="ermType${attribute.id}" data-erm-attribute-type>${TYPES.map((type) => `<option ${type === attribute.type ? "selected" : ""}>${type}</option>`).join("")}</select>
                  <label class="erm-flag"><input type="checkbox" data-erm-pk ${attribute.pk ? "checked" : ""}> PK</label>
                  <label class="erm-flag"><input type="checkbox" data-erm-fk ${attribute.fk ? "checked" : ""}> FK</label>
                  <button class="icon-button" type="button" data-erm-remove-attribute title="Attribut entfernen" aria-label="Attribut ${escapeHtml(attribute.name || String(attributeIndex + 1))} entfernen"><i data-lucide="x" aria-hidden="true"></i></button>
                </div>`).join("")}
              <button class="button button-secondary erm-small" type="button" data-erm-add-attribute ${entity.attributes.length >= LIMITS.attributes ? "disabled" : ""}><i data-lucide="plus"></i>Attribut</button>
            </fieldset>`).join("")}
          <button class="button button-secondary" type="button" id="ermAddEntity" ${current.entities.length >= LIMITS.entities ? "disabled" : ""}><i data-lucide="plus"></i>Entitätstyp hinzufügen</button>

          <h3>Beziehungen</h3>
          ${current.relations.map((relation, relationIndex) => `
            <div class="erm-relation" data-relation="${relation.id}">
              <label class="sr-only" for="ermFrom${relation.id}">Beziehung ${relationIndex + 1}: erster Entitätstyp</label>
              <select id="ermFrom${relation.id}" data-erm-relation-from>${entityOptions(relation.from)}</select>
              <label class="sr-only" for="ermCard${relation.id}">Kardinalität</label>
              <select id="ermCard${relation.id}" data-erm-relation-card>${CARDS.map((card) => `<option ${card === relation.card ? "selected" : ""}>${card}</option>`).join("")}</select>
              <label class="sr-only" for="ermTo${relation.id}">zweiter Entitätstyp</label>
              <select id="ermTo${relation.id}" data-erm-relation-to>${entityOptions(relation.to)}</select>
              <button class="icon-button" type="button" data-erm-remove-relation title="Beziehung entfernen" aria-label="Beziehung ${relationIndex + 1} entfernen"><i data-lucide="x" aria-hidden="true"></i></button>
              <span class="erm-optional">
                <label class="erm-flag"><input type="checkbox" data-erm-optional="from" ${relation.fromOptional ? "checked" : ""}> linke Seite optional (0 erlaubt)</label>
                <label class="erm-flag"><input type="checkbox" data-erm-optional="to" ${relation.toOptional ? "checked" : ""}> rechte Seite optional (0 erlaubt)</label>
              </span>
            </div>`).join("")}
          <button class="button button-secondary" type="button" id="ermAddRelation" ${current.entities.length < 2 || current.relations.length >= LIMITS.relations ? "disabled" : ""}><i data-lucide="plus"></i>Beziehung hinzufügen</button>
          <p class="field-hint">Lies eine Beziehung von links nach rechts: „Ort 1:N Fahrschüler“ heißt, zu einem Ort gehören viele Fahrschüler. „Optional“ an einer Seite bedeutet: Ein Datensatz der anderen Seite darf auch ohne Zuordnung bleiben. Das Diagramm zeigt dann 0..1 oder 0..N.</p>
        </section>

        <section class="erm-preview" aria-label="Diagramm und Prüfung">
          <div class="erm-diagram-head">
            <h3>Diagramm</h3>
            <label for="ermNotation">Schreibweise</label>
            <select id="ermNotation">
              <option value="n" ${store.notation === "n" ? "selected" : ""}>1 : N</option>
              <option value="workbench" ${store.notation === "workbench" ? "selected" : ""}>1 : ∞ (wie in MySQL Workbench und im Abitur)</option>
            </select>
          </div>
          <div class="erm-diagram" id="ermDiagram">${diagramSvg(current, escapeHtml)}</div>
          <p class="field-hint erm-drag-hint">Kästen lassen sich ziehen. Mit der Tastatur: Kasten ansteuern, dann Pfeiltasten.</p>
          <div class="runner-actions">
            ${task.target ? `<button class="button button-primary" type="button" id="ermCheck"><i data-lucide="check"></i>Modell prüfen</button>` : ""}
            <button class="button button-secondary" type="button" id="ermSql"><i data-lucide="download"></i>SQL für Workbench</button>
            <button class="button button-secondary" type="button" id="ermImage"><i data-lucide="image-down"></i>Diagramm als Bild</button>
            <button class="button button-secondary" type="button" id="ermArrange"><i data-lucide="layout-grid"></i>Automatisch anordnen</button>
            <button class="button button-secondary" type="button" id="ermReset"><i data-lucide="rotate-ccw"></i>Leeren</button>
          </div>
          <div id="ermResult" role="status" aria-live="polite">${lastCheck ? resultHtml(lastCheck, escapeHtml) : ""}</div>
        </section>
      </div>`;
    renderIcons();
  }

  function resultHtml(result, escapeHtml) {
    return `<div class="result-banner is-visible ${result.passed ? "is-success" : "is-error"}"><i data-lucide="${result.passed ? "circle-check" : "circle-alert"}"></i><div><strong>${result.passed ? "Modell stimmt" : "Noch nicht ganz"}</strong><p>${result.passed ? "Alle geprüften Punkte passen. Exportiere das SQL und baue das Modell in MySQL Workbench nach." : "Arbeite die markierten Punkte der Reihe nach ab."}</p></div></div>
      <ul class="coach-checklist erm-checklist">${result.items.map((item) => `<li class="is-${item.status}"><i data-lucide="${item.status === "success" ? "circle-check" : "lightbulb"}"></i><div><span>${escapeHtml(item.text)}</span></div></li>`).join("")}</ul>`;
  }

  // Eigenständige SVG-Datei: Farben und Schriften werden fest eingetragen, weil die
  // Datei außerhalb der Seite keine Stilvorlagen und Farbvariablen kennt.
  function diagramFile() {
    const source = document.querySelector("#ermDiagram svg");
    if (!source) return "";
    const copy = source.cloneNode(true);
    const originals = [source, ...source.querySelectorAll("*")];
    [copy, ...copy.querySelectorAll("*")].forEach((element, index) => {
      const style = getComputedStyle(originals[index]);
      const keep = ["fill", "stroke", "stroke-width", "opacity", "font-family", "font-size", "font-weight", "text-decoration", "paint-order"];
      element.setAttribute("style", keep.map((name) => `${name}:${style.getPropertyValue(name)}`).join(";"));
      ["class", "tabindex", "role", "data-box", "aria-label"].forEach((name) => element.removeAttribute(name));
    });
    const [, , width, height] = source.getAttribute("viewBox").split(" ").map(Number);
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copy.setAttribute("width", width);
    copy.setAttribute("height", height);
    copy.setAttribute("style", "");
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", width);
    background.setAttribute("height", height);
    background.setAttribute("fill", getComputedStyle(document.querySelector("#ermDiagram")).backgroundColor);
    copy.insertBefore(background, copy.firstChild);
    return `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(copy)}
`;
  }

  function refreshDiagram() {
    const target = document.querySelector("#ermDiagram");
    if (target && helpers) target.innerHTML = diagramSvg(model(), helpers.escapeHtml);
  }

  function changed(full, focusSelector) {
    lastCheck = null;
    save();
    if (full) {
      render();
      if (focusSelector) document.querySelector(focusSelector)?.focus();
    } else {
      refreshDiagram();
      const result = document.querySelector("#ermResult");
      if (result) result.innerHTML = "";
    }
  }

  const entityOf = (element) => model().entities.find((entity) => entity.id === Number(element.closest("[data-entity]")?.dataset.entity));
  const attributeOf = (element) => entityOf(element)?.attributes.find((attribute) => attribute.id === Number(element.closest("[data-attribute]")?.dataset.attribute));
  const relationOf = (element) => model().relations.find((relation) => relation.id === Number(element.closest("[data-relation]")?.dataset.relation));

  document.addEventListener("input", (event) => {
    if (!event.target.closest?.("#ermEditor")) return;
    if (event.target.matches("[data-erm-entity-name]")) {
      const entity = entityOf(event.target);
      entity.name = event.target.value.slice(0, LIMITS.name);
      // Auswahllisten der Beziehungen an Ort und Stelle nachführen, ohne neu zu zeichnen
      // (ein Neuzeichnen würde den Fokus aus dem nächsten Feld zurückholen).
      document.querySelectorAll(`#ermEditor .erm-relation option[value="${entity.id}"]`).forEach((option) => {
        option.textContent = entity.name || "ohne Namen";
      });
      changed(false);
    } else if (event.target.matches("[data-erm-attribute-name]")) {
      attributeOf(event.target).name = event.target.value.slice(0, LIMITS.name);
      changed(false);
    }
  });

  document.addEventListener("change", (event) => {
    if (!event.target.closest?.("#ermEditor")) return;
    const target = event.target;
    if (target.id === "ermNotation") {
      store.notation = target.value === "workbench" ? "workbench" : "n";
      save();
      refreshDiagram();
    } else if (target.id === "ermTask") {
      store.task = TASKS.some((task) => task.id === target.value) ? target.value : store.task;
      changed(true, "#ermTask");
    } else if (target.matches("[data-erm-attribute-type]")) {
      attributeOf(target).type = TYPES.includes(target.value) ? target.value : "INT";
      changed(false);
    } else if (target.matches("[data-erm-pk]")) {
      attributeOf(target).pk = target.checked;
      changed(false);
    } else if (target.matches("[data-erm-fk]")) {
      attributeOf(target).fk = target.checked;
      changed(false);
    } else if (target.matches("[data-erm-optional]")) {
      const relation = relationOf(target);
      const key = target.dataset.ermOptional === "from" ? "fromOptional" : "toOptional";
      if (target.checked) relation[key] = true; else delete relation[key];
      changed(false);
    } else if (target.matches("[data-erm-relation-from], [data-erm-relation-to], [data-erm-relation-card]")) {
      const relation = relationOf(target);
      const row = target.closest("[data-relation]");
      const from = Number(row.querySelector("[data-erm-relation-from]").value);
      const to = Number(row.querySelector("[data-erm-relation-to]").value);
      if (from === to) {
        helpers.toast("Eine Beziehung verbindet zwei verschiedene Entitätstypen.", "error");
        changed(true, `#${target.id}`);
        return;
      }
      relation.from = from;
      relation.to = to;
      relation.card = CARDS.includes(row.querySelector("[data-erm-relation-card]").value) ? row.querySelector("[data-erm-relation-card]").value : relation.card;
      changed(false);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest?.("#ermEditor button");
    if (!target || !helpers) return;
    const current = model();
    if (target.id === "ermAddEntity" && current.entities.length < LIMITS.entities) {
      const id = current.nextId++;
      current.entities.push({ id, name: "", attributes: [{ id: current.nextId++, name: "", type: "INT", pk: true, fk: false }] });
      changed(true, `#ermEntity${id}`);
    } else if (target.matches("[data-erm-add-attribute]")) {
      const entity = entityOf(target);
      if (entity.attributes.length < LIMITS.attributes) {
        const id = current.nextId++;
        entity.attributes.push({ id, name: "", type: "VARCHAR(50)", pk: false, fk: false });
        changed(true, `#ermAttr${id}`);
      }
    } else if (target.matches("[data-erm-remove-attribute]")) {
      const entity = entityOf(target);
      entity.attributes = entity.attributes.filter((attribute) => attribute !== attributeOf(target));
      changed(true, `[data-entity="${entity.id}"] [data-erm-add-attribute]`);
    } else if (target.matches("[data-erm-remove-entity]")) {
      const entity = entityOf(target);
      current.entities = current.entities.filter((item) => item !== entity);
      current.relations = current.relations.filter((relation) => relation.from !== entity.id && relation.to !== entity.id);
      changed(true, "#ermAddEntity");
    } else if (target.id === "ermAddRelation" && current.entities.length >= 2 && current.relations.length < LIMITS.relations) {
      const id = current.nextId++;
      current.relations.push({ id, from: current.entities[0].id, to: current.entities[1].id, card: "1:N" });
      changed(true, `#ermFrom${id}`);
    } else if (target.matches("[data-erm-remove-relation]")) {
      current.relations = current.relations.filter((relation) => relation !== relationOf(target));
      changed(true, "#ermAddRelation");
    } else if (target.id === "ermCheck" && currentTask().target) {
      lastCheck = checkModel(current, currentTask().target);
      document.querySelector("#ermResult").innerHTML = resultHtml(lastCheck, helpers.escapeHtml);
      helpers.renderIcons();
    } else if (target.id === "ermSql") {
      if (!current.entities.some((entity) => identifier(entity.name))) {
        helpers.toast("Lege zuerst einen benannten Entitätstyp an.", "error");
      } else {
        helpers.downloadBlob(new Blob([toSql(current)], { type: "text/plain;charset=utf-8" }), `workbenchlab-modell-${store.task}.sql`);
      }
    } else if (target.id === "ermArrange") {
      current.entities.forEach((entity) => { delete entity.x; delete entity.y; });
      save();
      refreshDiagram();
      target.focus();
    } else if (target.id === "ermImage") {
      const file = diagramFile();
      if (!file) {
        helpers.toast("Lege zuerst einen Entitätstyp an.", "error");
      } else {
        helpers.downloadBlob(new Blob([file], { type: "image/svg+xml;charset=utf-8" }), `workbenchlab-modell-${store.task}.svg`);
      }
    } else if (target.id === "ermReset" && window.confirm("Das Modell dieser Aufgabe wirklich leeren?")) {
      store.models[store.task] = emptyModel();
      changed(true, "#ermAddEntity");
    }
  });

  // Kästen verschieben. Das Prüfergebnis bleibt stehen: Die Anordnung ändert das Modell nicht.
  let drag = null;

  function moveBox(entityId, x, y, bounds) {
    const entity = model().entities.find((item) => item.id === entityId);
    const box = layout(model()).boxes.find((item) => item.id === entityId);
    if (!entity || !box) return;
    const maxX = bounds ? bounds.width - box.width - 20 : CANVAS.maxX;
    const maxY = bounds ? bounds.height - box.height - 20 : CANVAS.maxY;
    entity.x = Math.min(Math.max(0, maxX), Math.max(0, Math.round(x)));
    entity.y = Math.min(Math.max(0, maxY), Math.max(0, Math.round(y)));
    refreshDiagram();
  }

  function svgPoint(svg, event) {
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(matrix.inverse());
  }

  document.addEventListener("pointerdown", (event) => {
    const group = event.target.closest?.("#ermDiagram .erm-entity-box");
    if (!group || event.button > 0) return;
    const svg = group.ownerSVGElement;
    const point = svgPoint(svg, event);
    const plan = layout(model());
    const box = plan.boxes.find((item) => item.id === Number(group.dataset.box));
    if (!point || !box) return;
    // Während des Ziehens bleibt die Zeichenfläche gleich groß, damit sich der Maßstab nicht ändert.
    drag = { id: box.id, dx: point.x - box.x, dy: point.y - box.y, bounds: { width: plan.width, height: plan.height }, moved: false };
    event.preventDefault();
  });

  document.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const svg = document.querySelector("#ermDiagram svg");
    const point = svg && svgPoint(svg, event);
    if (!point) return;
    drag.moved = true;
    moveBox(drag.id, point.x - drag.dx, point.y - drag.dy, drag.bounds);
  });

  const endDrag = () => {
    if (!drag) return;
    const { id, moved } = drag;
    drag = null;
    if (moved) save();
    document.querySelector(`#ermDiagram .erm-entity-box[data-box="${id}"]`)?.focus();
  };
  document.addEventListener("pointerup", endDrag);
  document.addEventListener("pointercancel", endDrag);

  document.addEventListener("keydown", (event) => {
    const group = event.target.closest?.("#ermDiagram .erm-entity-box");
    const steps = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!group || !steps) return;
    event.preventDefault();
    const id = Number(group.dataset.box);
    const box = layout(model()).boxes.find((item) => item.id === id);
    const distance = CANVAS.step * (event.shiftKey ? 5 : 1);
    moveBox(id, box.x + steps[0] * distance, box.y + steps[1] * distance, null);
    save();
    document.querySelector(`#ermDiagram .erm-entity-box[data-box="${id}"]`)?.focus();
  });

  window.WORKBENCH_ERM.mount = (container, pageHelpers) => {
    helpers = pageHelpers;
    lastCheck = null;
    load();
    container.innerHTML = `<div id="ermEditor" class="erm-editor"></div>`;
    // Fingerbedienung (0.41.2): Beginnt eine Berührung auf einem Kasten, darf die Seite nicht scrollen –
    // sonst bricht der Browser das Ziehen mit pointercancel ab. touch-action wirkt auf SVG-Gruppen nicht.
    // Neben den Kästen bleibt Wischen zum Scrollen möglich.
    if (!container.dataset.ermTouch) {
      container.dataset.ermTouch = "1";
      container.addEventListener("touchstart", (event) => {
        if (event.target.closest?.("#ermDiagram .erm-entity-box")) event.preventDefault();
      }, { passive: false });
    }
    render();
  };

  // Entwürfe für die JSON-Sicherung (0.40.0): app.js ruft beides beim Speichern und Laden auf.
  window.WORKBENCH_ERM.exportDrafts = () => {
    load();
    return sanitizeStore(store);
  };
  window.WORKBENCH_ERM.importDrafts = (candidate) => {
    store = sanitizeStore(candidate);
    lastCheck = null;
    save();
  };
})();
