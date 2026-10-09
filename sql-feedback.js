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

  // Gültiges MySQL, das das Browser-Labor nicht ausführen kann. Jede Zeile ist an der MariaDB 10.4.13
  // des Informatik-Sticks gemessen (läuft dort, bricht im Browser ab): tools/verify-claude-native.cjs.
  const MYSQL_ONLY = [
    { test: /\bTIMESTAMPDIFF\s*\(/i, text: "TIMESTAMPDIFF ist gültiges MySQL. In den Übungsaufgaben kennt es das Browser-Labor nicht; im freien SQL-Labor und in MySQL Workbench funktioniert es. Für Tage geht überall DATEDIFF(spaeter, frueher)." },
    { test: /\b(?:DATE_ADD|DATE_SUB|ADDDATE|SUBDATE)\s*\(|\bINTERVAL\s+\S+\s+(?:SECOND|MINUTE|HOUR|DAY|WEEK|MONTH|YEAR)\b/i, text: "Datumsrechnung mit INTERVAL (zum Beispiel DATE_ADD) ist gültiges MySQL, das Browser-Labor kennt sie aber nicht. In MySQL Workbench funktioniert die Anweisung." },
    { test: /\bINSERT\s+INTO\s+\S+\s+SET\b/i, text: "INSERT … SET ist eine MySQL-Kurzform, die das Browser-Labor nicht kennt. Nimm die Standardform INSERT INTO tabelle (spalten) VALUES (werte); sie funktioniert überall." },
    { test: /\bALTER\s+TABLE\s+\S+\s+(?:MODIFY|CHANGE)\b/i, text: "ALTER TABLE … MODIFY und … CHANGE gibt es nur in MySQL. Im Browser-Labor kannst du Spalten hinzufügen (ADD), umbenennen (RENAME COLUMN) und löschen (DROP COLUMN)." },
    { test: /\bAUTO_INCREMENT\b/i, text: "AUTO_INCREMENT ist gültiges MySQL. Schreibe im Browser-Labor stattdessen spalte INTEGER PRIMARY KEY; die Nummer wird dann ebenfalls automatisch vergeben." },
    { test: /\bENGINE\s*=/i, text: "Tabellenoptionen wie ENGINE=InnoDB gibt es nur in MySQL. Lass sie im Browser-Labor weg." },
    { test: /\bDIV\b/i, text: "DIV (ganzzahlige Division) gibt es nur in MySQL. Im Browser-Labor liefert 5 / 2 bereits die ganze Zahl 2." }
  ];
  // MySQL-Funktionen, die das Browser-Labor nicht nachbildet (an MariaDB gemessen: dort vorhanden).
  const MYSQL_FUNCTIONS_ELSEWHERE = ["DATABASE", "USER", "MONTHNAME", "DAYNAME", "WEEKDAY", "DAYOFWEEK", "DAYOFYEAR", "WEEK", "QUARTER", "HOUR", "MINUTE", "SECOND", "CURTIME", "STR_TO_DATE", "LAST_DAY", "IF", "LPAD", "RPAD", "REPEAT", "LOCATE", "RAND"];
  // Funktionen, die im Browser-Labor funktionieren – für Vorschläge bei Tippfehlern.
  const KNOWN_FUNCTIONS = ["COUNT", "SUM", "AVG", "MIN", "MAX", "ROUND", "YEAR", "MONTH", "DAY", "NOW", "CURDATE", "DATEDIFF", "DATE_FORMAT", "CONCAT", "UPPER", "LOWER", "LENGTH", "CHAR_LENGTH", "LEFT", "RIGHT", "SUBSTRING", "REPLACE", "TRIM", "COALESCE", "IFNULL", "FORMAT", "MOD", "TRUNCATE", "CEILING", "FLOOR", "ABS", "POWER", "SQRT"];

  function mysqlOnlyHint(original, sql) {
    if (!sql || !/syntax error|no such function|no such column:\s*(?:SECOND|MINUTE|HOUR|DAY|WEEK|MONTH|QUARTER|YEAR)\b/i.test(original)) return "";
    const bare = withoutLiterals(sql);
    return MYSQL_ONLY.find((item) => item.test.test(bare))?.text || "";
  }

  function explain(error, schema, sql) {
    const original = String(error?.message || error || "").trim();
    const names = schemaNames(schema);
    let text = mysqlOnlyHint(original, sql);
    let suggestion = "";
    let match;
    if (text) {
      // Erklärung steht fest; die Originalmeldung bleibt sichtbar.
    } else if ((match = original.match(/no such table:\s*(\S+)/i))) {
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
      const name = bareName(match[1]).toUpperCase();
      if (MYSQL_FUNCTIONS_ELSEWHERE.includes(name)) {
        text = `Die Funktion ${name} gibt es in MySQL; das Browser-Labor bildet sie nicht nach. In MySQL Workbench funktioniert sie.`;
      } else {
        text = `Die Funktion ${name} kennt das Browser-Labor nicht. Prüfe die Schreibweise; manche MySQL-Funktionen stehen nur in MySQL Workbench zur Verfügung.`;
        suggestion = closest(name, KNOWN_FUNCTIONS);
      }
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
    // Ab hier Umschreibungen innerhalb gewöhnlicher Anweisungen (0.41.0), nie in Textwerten oder Kommentaren.
    const text = String(sql ?? "");
    const createsTable = /\bCREATE\s+TABLE\b/i.test(withoutLiterals(text));
    return text.split(/('(?:[^']|'')*'|"(?:[^"]|"")*"|--[^\n]*|\/\*[\s\S]*?\*\/)/).map((part, index) => {
      if (index % 2) return part;
      // TIMESTAMPDIFF(YEAR, a, b): Die Einheit ist in MySQL ein Schlüsselwort; die nachgebildete Funktion erwartet Text.
      let result = part.replace(/\bTIMESTAMPDIFF\s*\(\s*(SECOND|MINUTE|HOUR|DAY|WEEK|MONTH|QUARTER|YEAR)\s*,/gi, "TIMESTAMPDIFF('$1',");
      if (createsTable) {
        // AUTO_INCREMENT: In SQLite zählt eine INTEGER-Spalte mit Primärschlüssel von selbst hoch.
        result = result
          .replace(/(\b[A-Za-z_]\w*`?\s+)INT(?:EGER)?\b(?:\s*\(\s*\d+\s*\))?(?:\s+UNSIGNED\b)?((?:\s+(?:NOT\s+NULL|PRIMARY\s+KEY|UNIQUE)\b)*)\s+AUTO_INCREMENT\b/gi, "$1INTEGER$2")
          // Tabellenoptionen hinter der schließenden Klammer, etwa ENGINE=InnoDB DEFAULT CHARSET=utf8mb4.
          .replace(/\)\s*(?:(?:ENGINE|AUTO_INCREMENT|COLLATE|(?:DEFAULT\s+)?(?:CHARSET|CHARACTER\s+SET))\s*=?\s*\w+\s*)+(?=;|$)/gi, ")");
      }
      return result;
    }).join("");
  }

  // Unterschiede zwischen Browser-Labor (SQLite) und der MariaDB des Informatik-Sticks.
  // Jeder Eintrag wurde am 2026-10-09 mit tools/verify-claude-native.cjs an MariaDB 10.4.13
  // nachgemessen (OPT-20). Nur gemessene Unterschiede aufnehmen.
  const MYSQL_DIFFERENCES = [
    {
      id: "division",
      title: "Division ganzer Zahlen",
      text: "Im Browser-Labor ergibt 7 / 2 die ganze Zahl 3. MySQL Workbench rechnet 3.5000 aus. Schreibe 7 / 2.0, damit auch das Browser-Labor mit Nachkommastellen rechnet."
    },
    {
      id: "gross-klein",
      title: "Groß- und Kleinschreibung bei Textvergleichen",
      text: "Im Browser-Labor findet ort = 'stuttgart' nichts, weil in der Tabelle 'Stuttgart' steht. MySQL Workbench unterscheidet bei = in der Grundeinstellung nicht und findet die Datensätze. Schreibe Textwerte genau so wie in der Tabelle; dann stimmt das Ergebnis in beiden."
    },
    {
      id: "verkettung",
      title: "Texte verbinden",
      text: "Im Browser-Labor verbindet vorname || ' ' || nachname die Texte. In MySQL Workbench bedeutet || „oder“ und liefert 0 oder 1. Verwende CONCAT(vorname, ' ', nachname); das funktioniert in beiden."
    },
    {
      id: "alias-where",
      title: "Spaltenname aus AS in WHERE",
      text: "Im Browser-Labor darf WHERE einen mit AS vergebenen Namen benutzen. MySQL Workbench meldet dann „Unknown column“. Wiederhole in WHERE den ursprünglichen Ausdruck; nach GROUP BY kannst du den Namen in HAVING verwenden."
    },
    {
      id: "avg-stellen",
      title: "Nachkommastellen bei AVG",
      text: "Das Browser-Labor zeigt bei AVG viele Nachkommastellen, zum Beispiel 1.5833333333333333. MySQL Workbench zeigt 1.5833. Mit ROUND(AVG(spalte), 2) ist die Ausgabe überall gleich."
    },
    {
      id: "auto-increment",
      title: "AUTO_INCREMENT",
      // Nur als Hinweis nach dem Ausführen, nicht in der Liste der Unterschiede.
      listed: false,
      text: "Das Browser-Labor kennt AUTO_INCREMENT nicht und hat die Spalte als INTEGER mit Primärschlüssel angelegt. Sie zählt dort ebenfalls von selbst hoch. In MySQL Workbench ist deine Schreibweise richtig."
    }
  ];

  function withoutLiterals(sql) {
    return String(sql ?? "")
      .replace(/--[^\n]*/g, " ")
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/'(?:[^']|'')*'/g, "''")
      .replace(/"(?:[^"]|"")*"/g, '""');
  }

  // Liefert die Kennungen der Unterschiede, die auf diese Anweisung zutreffen können.
  function mysqlNotes(sql, rowCount) {
    const bare = withoutLiterals(sql);
    const notes = [];
    if (/[\w)\]]\s*\/\s*[\w(]/.test(bare) && !/\/\s*\d+\.\d/.test(bare) && !/\d+\.\d+\s*\//.test(bare)) notes.push("division");
    if (/\|\|/.test(bare)) notes.push("verkettung");
    if (rowCount === 0 && /(?:=|<>|!=)\s*''|''\s*(?:=|<>|!=)|\bin\s*\(\s*''/i.test(bare)) notes.push("gross-klein");
    // Name aus der SELECT-Liste (AS name), der in WHERE als Spalte auftaucht (nicht als Tabellenalias „name.“).
    const selectList = bare.match(/\bSELECT\b([\s\S]*?)\bFROM\b/i)?.[1] || "";
    const where = bare.match(/\bWHERE\b([\s\S]*?)(?:\bGROUP\s+BY\b|\bHAVING\b|\bORDER\s+BY\b|\bLIMIT\b|$)/i)?.[1] || "";
    const aliases = [...selectList.matchAll(/\bAS\s+([A-Za-z_]\w*)/gi)].map((match) => match[1]);
    if (aliases.some((alias) => new RegExp(`\\b${alias}\\b(?!\\s*[.(])`, "i").test(where))) notes.push("alias-where");
    if (/\bAVG\s*\(/i.test(bare) && !/\b(?:ROUND|FORMAT|TRUNCATE)\s*\(/i.test(bare)) notes.push("avg-stellen");
    if (/\bCREATE\s+TABLE\b/i.test(bare) && /\bAUTO_INCREMENT\b/i.test(bare)) notes.push("auto-increment");
    return notes;
  }

  window.WORKBENCH_SQL_FEEDBACK = { explain, closest, schemaNames, rewriteMysql, mysqlNotes, MYSQL_DIFFERENCES, MYSQL_FUNCTIONS_ELSEWHERE, KNOWN_FUNCTIONS };
})();
