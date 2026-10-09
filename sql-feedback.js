(() => {
  "use strict";
  // Reine Logik ohne DOM: deutsche Erklärungen zu SQLite-Meldungen und
  // MySQL-Komfortbefehle für das freie SQL-Labor. (Claude, OPT-01/OPT-02)

  function distance(a, b) {
    let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      const current = [i];
      for (let j = 1; j <= b.length; j += 1) {
        current[j] = Math.min(
          previous[j] + 1,
          current[j - 1] + 1,
          previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
      previous = current;
    }
    return previous[b.length];
  }

  function closest(name, candidates) {
    const wanted = String(name ?? "").toLowerCase();
    if (wanted.length < 3) return "";
    const limit = wanted.length <= 5 ? 1 : 2;
    let best = "";
    let bestDistance = limit + 1;
    for (const candidate of candidates || []) {
      const value = distance(wanted, String(candidate).toLowerCase());
      if (value > 0 && value < bestDistance) {
        best = String(candidate);
        bestDistance = value;
      }
    }
    return best;
  }

  function schemaNames(schema) {
    const tables = (schema?.tables || []).map((table) => table.name);
    const columns = [...new Set((schema?.tables || []).flatMap((table) =>
      (table.fields || []).map((field) => String(field).split(/\s+/)[0])))];
    return { tables, columns };
  }

  function bareName(value) {
    return String(value ?? "").replace(/["'`\[\]]/g, "").split(".").pop();
  }

  function explain(error, schema) {
    const original = String(error?.message || error || "").trim();
    const names = schemaNames(schema);
    let text = "";
    let suggestion = "";
    let match;
    if ((match = original.match(/no such table:\s*(\S+)/i))) {
      const name = bareName(match[1]);
      text = `Die Tabelle ${name} gehört nicht zum Übungsschema. Prüfe FROM und JOIN und vergleiche mit den Tabellennamen neben dem Editor.`;
      suggestion = closest(name, names.tables);
    } else if ((match = original.match(/no such column:\s*(\S+)/i))) {
      const name = bareName(match[1]);
      text = `Die Spalte ${name} wurde nicht gefunden. Prüfe Schreibweise, Tabellenalias und Schema. Textwerte brauchen einfache Anführungszeichen, sonst werden sie als Spaltenname gelesen.`;
      suggestion = closest(name, names.columns);
    } else if ((match = original.match(/ambiguous column name:\s*(\S+)/i))) {
      const name = bareName(match[1]);
      text = `Die Spalte ${name} kommt in mehreren Tabellen vor. Setze den Tabellennamen oder Alias davor, zum Beispiel f.${name}.`;
    } else if ((match = original.match(/no such function:\s*(\S+)/i))) {
      text = `Die Funktion ${match[1]} kennt das Browser-Labor nicht. Prüfe die Schreibweise; manche MySQL-Funktionen stehen nur in MySQL Workbench zur Verfügung.`;
    } else if ((match = original.match(/near\s+"([^"]+)":\s*syntax error/i))) {
      text = `In der Nähe von „${match[1]}“ stimmt der Satzbau noch nicht. Prüfe die Klausel direkt davor sowie fehlende Kommas, Klammern oder Anführungszeichen.`;
    } else if (/incomplete input/i.test(original)) {
      text = "Die Anweisung ist noch unvollständig. Prüfe offene Klammern und Klauseln wie WHERE, ON oder HAVING ohne Bedingung.";
    } else if ((match = original.match(/unrecognized token:\s*"?([^"]*)"?/i))) {
      text = `Das Zeichen oder Wort „${match[1]}“ kann die Datenbank nicht lesen. Häufige Ursache: ein Textwert, dessen schließendes einfaches Anführungszeichen fehlt.`;
    } else if ((match = original.match(/table\s+(\S+)\s+already exists/i))) {
      text = `Die Tabelle ${bareName(match[1])} gibt es bereits. Wähle einen anderen Namen oder setze die Datenbank zurück.`;
    } else if ((match = original.match(/table\s+(\S+)\s+has\s+(\d+)\s+columns?\s+but\s+(\d+)\s+values?\s+were\s+supplied/i))) {
      text = `Die Tabelle ${bareName(match[1])} hat ${match[2]} Spalten, du lieferst aber ${match[3]} Werte. Nenne die Zielspalten ausdrücklich oder ergänze die fehlenden Werte.`;
    } else if ((match = original.match(/(\d+)\s+values?\s+for\s+(\d+)\s+columns?/i))) {
      text = `Du nennst ${match[2]} Spalten, lieferst aber ${match[1]} Werte. Beide Listen müssen gleich lang sein.`;
    } else if ((match = original.match(/table\s+(\S+)\s+has no column named\s+(\S+)/i))) {
      const name = bareName(match[2]);
      text = `Die Tabelle ${bareName(match[1])} hat keine Spalte ${name}.`;
      suggestion = closest(name, names.columns);
    } else if ((match = original.match(/NOT NULL constraint failed:\s*(\S+)/i))) {
      text = `Das Pflichtfeld ${bareName(match[1])} darf nicht leer bleiben. Gib dafür einen Wert an.`;
    } else if (/unique constraint failed/i.test(original)) {
      text = "Ein Primär- oder eindeutiger Schlüssel ist bereits vergeben. Verwende einen noch nicht vorhandenen Wert.";
    } else if (/foreign key constraint failed/i.test(original)) {
      text = "Die referentielle Integrität wäre verletzt: Ein Fremdschlüssel verweist auf keinen vorhandenen Datensatz, oder ein Datensatz wird noch von einer anderen Tabelle gebraucht.";
    } else if (/misuse of aggregate/i.test(original)) {
      text = "Eine Aggregatfunktion wie COUNT, SUM oder AVG steht an einer unzulässigen Stelle. In WHERE sind sie nicht erlaubt; filtere Gruppen mit HAVING.";
    } else if (/SELECTs to the left and right of UNION do not have the same number/i.test(original)) {
      text = "Die mit UNION verbundenen Abfragen müssen gleich viele Spalten liefern.";
    }
    if (suggestion) text += ` Meintest du ${suggestion}?`;
    return {
      text: text || original || "Die SQL-Anweisung konnte nicht ausgeführt werden. Prüfe Syntax, Tabellen und Spalten.",
      original: text ? original : "",
      suggestion
    };
  }

  // MySQL-Befehle, die SQLite nicht kennt, aber in Workbench alltäglich sind.
  function rewriteMysql(sql) {
    const statement = String(sql ?? "").trim().replace(/;\s*$/, "");
    if (/^show\s+tables$/i.test(statement)) {
      return "SELECT name AS Tabelle FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;";
    }
    const describe = statement.match(/^(?:describe|desc|show\s+columns\s+from)\s+[`"]?([A-Za-z_][A-Za-z0-9_]*)[`"]?$/i);
    if (describe) {
      return `SELECT name AS Feld, type AS Typ, CASE WHEN "notnull" = 1 OR pk > 0 THEN 'NO' ELSE 'YES' END AS "Null", CASE WHEN pk > 0 THEN 'PRI' ELSE '' END AS Schluessel FROM pragma_table_info('${describe[1]}');`;
    }
    return String(sql ?? "");
  }

  window.WORKBENCH_SQL_FEEDBACK = { explain, closest, schemaNames, rewriteMysql };
})();
