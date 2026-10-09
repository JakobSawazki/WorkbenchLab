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
    db.create_function("NOW", () => new Date().toISOString().replace("T", " ").slice(0, 19));
    db.create_function("DATEDIFF", (a, b) => {
      const left = Date.parse(String(a));
      const right = Date.parse(String(b));
      if (Number.isNaN(left) || Number.isNaN(right)) {
        return null;
      }
      return Math.round((left - right) / 86400000);
    });
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

  window.WORKBENCH_SQL_CHECK = { parseDateParts, registerSqlFunctions, tableFromResult, normalizeCell, normalizedRows, sameTable, sqlCoachPatterns, sqlPatternInfo, checkSqlPatterns };
})();
