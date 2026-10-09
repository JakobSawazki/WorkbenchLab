(() => {
  "use strict";
  // Reine SQL-Prüflogik ohne DOM und ohne Lernstand: Ergebnisvergleich, Aufbauprüfung und die
  // für MySQL nachgebildeten Datumsfunktionen. Am 2026-10-09 von Claude unverändert aus app.js
  // ausgelagert (OPT-16, Schritt 1); Verfasser des Codes ist Codex.

  function parseDateParts(value) {
    const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) } : null;
  }

  function registerSqlFunctions(db) {
    if (typeof db.create_function !== "function") {
      return;
    }
    db.create_function("YEAR", (value) => parseDateParts(value)?.year ?? null);
    db.create_function("MONTH", (value) => parseDateParts(value)?.month ?? null);
    // Ortszeit wie beim MySQL-Server; bis 0.40.1 lieferte NOW() Weltzeit und lag damit 1 bis 2 Stunden daneben (Claude).
    db.create_function("NOW", () => localDateTime());
    db.create_function("DATEDIFF", (a, b) => {
      const left = Date.parse(String(a));
      const right = Date.parse(String(b));
      if (Number.isNaN(left) || Number.isNaN(right)) {
        return null;
      }
      return Math.round((left - right) / 86400000);
    });
    registerMysqlFunctions(db);
  }

  // ---- MySQL-Nähe des Browser-Labors (Claude, 0.41.0) ----
  // Funktionen, die SQLite fehlen oder anders rechnen als MySQL. Jede ist an der MariaDB 10.4.13 des
  // Informatik-Sticks nachgemessen: tools/verify-claude-native.cjs, Abschnitt 6. Nur Gemessenes aufnehmen.
  const pad = (value, length = 2) => String(value).padStart(length, "0");
  const isNull = (value) => value === null || value === undefined;
  const characters = (value) => Array.from(String(value));
  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function localDate(now = new Date()) {
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  function localDateTime(now = new Date()) {
    return `${localDate(now)} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }

  // Datum mit optionaler Uhrzeit; ungültige Daten wie 2026-02-31 ergeben wie in MySQL NULL.
  function parseDateTime(value) {
    const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (!match) return null;
    const [year, month, day, hour, minute, second] = match.slice(1).map((part) => Number(part || 0));
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return { year, month, day, hour, minute, second, date };
  }

  function dateFormat(value, format) {
    const d = parseDateTime(value);
    if (!d || isNull(format)) return null;
    const hour12 = d.hour % 12 || 12;
    const parts = {
      Y: pad(d.year, 4), y: pad(d.year % 100), m: pad(d.month), c: String(d.month), d: pad(d.day), e: String(d.day),
      H: pad(d.hour), k: String(d.hour), h: pad(hour12), I: pad(hour12), l: String(hour12), i: pad(d.minute), s: pad(d.second), S: pad(d.second),
      p: d.hour < 12 ? "AM" : "PM", M: MONTH_NAMES[d.month - 1], b: MONTH_NAMES[d.month - 1].slice(0, 3),
      W: DAY_NAMES[d.date.getUTCDay()], a: DAY_NAMES[d.date.getUTCDay()].slice(0, 3),
      T: `${pad(d.hour)}:${pad(d.minute)}:${pad(d.second)}`, "%": "%"
    };
    return String(format).replace(/%(.)/g, (_, key) => (Object.prototype.hasOwnProperty.call(parts, key) ? parts[key] : key));
  }

  // Ganze Einheiten zwischen zwei Zeitpunkten (bis - von), wie TIMESTAMPDIFF in MySQL.
  function timestampDiff(unit, from, to) {
    const a = parseDateTime(from);
    const b = parseDateTime(to);
    if (!a || !b) return null;
    const name = String(unit ?? "").toUpperCase();
    const fixed = { SECOND: 1000, MINUTE: 60000, HOUR: 3600000, DAY: 86400000, WEEK: 604800000 }[name];
    if (fixed) return Math.trunc((b.date - a.date) / fixed);
    if (!["MONTH", "QUARTER", "YEAR"].includes(name)) return null;
    let months = (b.year - a.year) * 12 + (b.month - a.month);
    const rest = (d) => ((d.day * 24 + d.hour) * 60 + d.minute) * 60 + d.second;
    if (months > 0 && rest(b) < rest(a)) months -= 1;
    if (months < 0 && rest(b) > rest(a)) months += 1;
    return Math.trunc(months / { MONTH: 1, QUARTER: 3, YEAR: 12 }[name]);
  }

  function mysqlFormat(value, decimals) {
    if (isNull(value) || isNull(decimals)) return null;
    const number = Number(value);
    const places = Math.min(20, Math.max(0, Math.round(Number(decimals)) || 0));
    return Number.isFinite(number) ? number.toLocaleString("en-US", { minimumFractionDigits: places, maximumFractionDigits: places }) : null;
  }

  function truncate(value, decimals) {
    if (isNull(value) || isNull(decimals)) return null;
    const factor = 10 ** Math.trunc(Number(decimals));
    const result = Math.trunc(Number((Number(value) * factor).toPrecision(15))) / factor;
    return Number.isFinite(result) ? result : null;
  }

  // sql.js liest die Zahl der Argumente aus der Länge der Funktion; deshalb je eine feste Fassung.
  const finite = (result) => (Number.isFinite(result) ? result : null);
  const numeric1 = (fn) => (a) => (isNull(a) ? null : finite(fn(Number(a))));
  const numeric2 = (fn) => (a, b) => (isNull(a) || isNull(b) ? null : finite(fn(Number(a), Number(b))));

  const mysqlFunctions = {
    DAY: (value) => parseDateParts(value)?.day ?? null,
    DAYOFMONTH: (value) => parseDateParts(value)?.day ?? null,
    CURDATE: () => localDate(),
    DATE_FORMAT: dateFormat,
    // Erstes Argument ist in MySQL ein Schlüsselwort (YEAR, MONTH, DAY ...); rewriteMysql in
    // sql-feedback.js setzt es für das freie SQL-Labor in Anführungszeichen.
    TIMESTAMPDIFF: timestampDiff,
    CHAR_LENGTH: (value) => (isNull(value) ? null : characters(value).length),
    CHARACTER_LENGTH: (value) => (isNull(value) ? null : characters(value).length),
    LEFT: (value, count) => (isNull(value) || isNull(count) ? null : characters(value).slice(0, Math.max(0, Math.trunc(Number(count)) || 0)).join("")),
    RIGHT: (value, count) => {
      if (isNull(value) || isNull(count)) return null;
      const length = Math.max(0, Math.trunc(Number(count)) || 0);
      return length ? characters(value).slice(-length).join("") : "";
    },
    // Die eingebauten SQLite-Fassungen lassen Umlaute unverändert bzw. behandeln NULL und FORMAT anders.
    UPPER: (value) => (isNull(value) ? null : characters(value).map((char) => (char === "ß" ? char : char.toUpperCase())).join("")),
    LOWER: (value) => (isNull(value) ? null : String(value).toLowerCase()),
    FORMAT: mysqlFormat,
    MOD: numeric2((a, b) => (b === 0 ? NaN : a % b)),
    TRUNCATE: truncate,
    CEILING: numeric1(Math.ceil),
    CEIL: numeric1(Math.ceil),
    FLOOR: numeric1(Math.floor),
    POWER: numeric2(Math.pow),
    POW: numeric2(Math.pow),
    SQRT: numeric1(Math.sqrt)
  };

  function registerMysqlFunctions(db) {
    Object.entries(mysqlFunctions).forEach(([name, fn]) => db.create_function(name, fn));
    // CONCAT nimmt beliebig viele Werte; sql.js liest die Stelligkeit aus der Länge der Funktion (-1 = beliebig).
    const concat = (...parts) => (parts.some(isNull) ? null : parts.join(""));
    Object.defineProperty(concat, "length", { value: -1 });
    db.create_function("CONCAT", concat);
    let version = "";
    try { version = String(db.exec("SELECT sqlite_version();")[0].values[0][0]); } catch {}
    db.create_function("VERSION", () => `SQLite ${version} (Browser-Labor, nicht MySQL)`);
  }

  function tableFromResult(resultSets) {
    if (!Array.isArray(resultSets) || !resultSets.length) {
      return { columns: [], values: [] };
    }
    const last = resultSets[resultSets.length - 1];
    return {
      columns: last.columns || [],
      values: last.values || []
    };
  }

  function normalizeCell(value) {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === "number") {
      return Number.isInteger(value) ? value : Number(value.toFixed(6));
    }
    return String(value);
  }

  function normalizedRows(table, orderSensitive) {
    const rows = (table.values || []).map((row) => row.map(normalizeCell));
    if (!orderSensitive) {
      rows.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    }
    return rows;
  }

  function sameTable(actual, expected, orderSensitive) {
    return JSON.stringify(normalizedRows(actual, orderSensitive)) ===
      JSON.stringify(normalizedRows(expected, orderSensitive));
  }

  const sqlCoachPatterns = {
    select: ["SELECT verwenden", "Beginne die Abfrage mit SELECT und nenne danach die gewünschten Ausgabespalten."],
    from: ["Datenquelle nennen", "Mit FROM legst du fest, aus welcher Tabelle gelesen wird."],
    nachname: ["Spalte nachname", "Nimm die Spalte nachname in die Abfrage auf."],
    vorname: ["Spalte vorname", "Nimm die Spalte vorname in die Abfrage auf."],
    where: ["Datensätze filtern", "Formuliere die Auswahlbedingung nach WHERE."],
    "order\\s+by": ["Ergebnis sortieren", "Ergänze ORDER BY am Ende der Abfrage."],
    desc: ["Absteigend sortieren", "DESC steht direkt hinter der Sortierspalte."],
    "select\\s+distinct": ["Doppelte Ausgaben vermeiden", "DISTINCT steht direkt hinter SELECT."],
    like: ["Textmuster prüfen", "Nutze LIKE zusammen mit einem Muster in einfachen Anführungszeichen."],
    or: ["Alternativen verbinden", "Verbinde die beiden möglichen Namensanfänge mit OR."],
    "count\\s*\\(": ["Datensätze zählen", "COUNT(...) zählt die Datensätze jeder Gruppe."],
    "group\\s+by": ["Gruppen bilden", "GROUP BY steht nach WHERE und vor HAVING."],
    having: ["Gruppen filtern", "Eine Bedingung auf ein Aggregatergebnis gehört in HAVING."],
    "month\\s*\\(": ["Monat berechnen", "MONTH(geburtsdatum) liefert die Monatszahl."],
    "year\\s*\\(": ["Jahr prüfen", "YEAR(geburtsdatum) kann in der WHERE-Bedingung verglichen werden."],
    "insert\\s+into": ["Datensatz einfügen", "INSERT INTO nennt zuerst die Zieltabelle und ihre Spalten."],
    values: ["Werte angeben", "VALUES enthält die Werte in derselben Reihenfolge wie die Spaltenliste."],
    "create\\s+table": ["Tabelle anlegen", "CREATE TABLE nennt Tabellenname, Spalten und ihre Regeln."],
    "primary\\s+key": ["Primärschlüssel festlegen", "Kennzeichne die eindeutige Identifikation mit PRIMARY KEY."],
    "not\\s+null": ["Pflichtfeld festlegen", "NOT NULL verhindert einen fehlenden Wert in dieser Spalte."],
    update: ["Datensatz ändern", "UPDATE nennt die Tabelle, deren vorhandene Zeilen geändert werden."],
    set: ["Neuen Wert zuweisen", "SET weist einer Spalte den neuen Wert oder Ausdruck zu."],
    "delete\\s+from": ["Datensatz löschen", "DELETE FROM nennt die Tabelle; die WHERE-Bedingung begrenzt die Zielmenge."],
    "schuelernr\\s*=\\s*5": ["Änderung eingrenzen", "Begrenze das UPDATE mit der eindeutigen Schülernummer 5."],
    "schuelernr\\s*=\\s*10": ["Löschung eingrenzen", "Begrenze das DELETE mit der eindeutigen Schülernummer 10."],
    join: ["Tabellen verbinden", "JOIN ergänzt die zweite Tabelle; danach folgt die ON-Bedingung."],
    on: ["Schlüssel zuordnen", "ON verbindet passende Primär- und Fremdschlüssel."],
    "sum\\s*\\(": ["Werte summieren", "SUM(stundenzahl) berechnet die Summe innerhalb jeder Gruppe."],
    "join\\s+kunden": ["Kunden verbinden", "Verbinde mietvertraege über kundennr mit kunden."],
    "join\\s+fahrraeder": ["Fahrräder verbinden", "Verbinde mietvertraege über fahrradnr mit fahrraeder."],
    "datediff\\s*\\(": ["Mietdauer berechnen", "DATEDIFF erhält zuerst das Enddatum und danach das Startdatum."],
    "select\\s+\\*": ["Gezielte Spaltenauswahl", "Ersetze SELECT * durch die ausdrücklich geforderten Spalten."]
  };

  function sqlPatternInfo(pattern, forbidden = false) {
    const known = sqlCoachPatterns[pattern];
    if (known) {
      return { label: known[0], hint: known[1] };
    }
    return {
      label: forbidden ? "Unzulässigen Bestandteil entfernen" : "Aufgabenbestandteil ergänzen",
      hint: forbidden
        ? "Entferne einen Bestandteil, den die Aufgabe ausdrücklich ausschließt."
        : "Vergleiche deinen Aufbau mit der Aufgabenstellung und den Hinweisen."
    };
  }

  function checkSqlPatterns(sql, check) {
    const problems = [];
    (check.required || []).forEach((pattern) => {
      if (!new RegExp(pattern, "i").test(sql)) {
        problems.push({ pattern, ...sqlPatternInfo(pattern) });
      }
    });
    (check.forbidden || []).forEach((pattern) => {
      if (new RegExp(pattern, "i").test(sql)) {
        problems.push({ pattern, forbidden: true, ...sqlPatternInfo(pattern, true) });
      }
    });
    return problems;
  }

  window.WORKBENCH_SQL_CHECK = { parseDateParts, parseDateTime, localDate, localDateTime, dateFormat, timestampDiff, mysqlFunctions, registerSqlFunctions, tableFromResult, normalizeCell, normalizedRows, sameTable, sqlCoachPatterns, sqlPatternInfo, checkSqlPatterns };
})();
