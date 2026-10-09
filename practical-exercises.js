(() => {
  "use strict";
  const content = window.WORKBENCH_CONTENT;
  content.schemas["kurs-entwurf"] = {
    title: "Eigener Tabellenentwurf",
    description: "Leerer Übungsbestand für die neue Tabelle kurse.",
    tables: [],
    seed: "PRAGMA foreign_keys = ON;"
  };
  content.schemas["fahrschule-outer-join"] = {
    ...content.schemas.fahrschule,
    seed: content.schemas.fahrschule.seed + "\nINSERT INTO fahrschueler VALUES (11, 'Muster', 'Alex', '2008-01-01', 1);"
  };
  content.schemas["vermietung-wiederholung"] = {
    ...content.schemas.fahrradvermietung,
    seed: content.schemas.fahrradvermietung.seed + "\nINSERT INTO mietvertraege VALUES (7, '2026-07-01', '2026-07-03', 2, 1);"
  };
  const insert = content.practices.find((exercise) => exercise.id === "sql-insert");
  insert.check.verifySql = "SELECT * FROM orte ORDER BY ortnr;";
  insert.check.referenceSql = insert.solution;
  const exercises = [
    {
      id: "sql-create-course",
      lessonId: "workbench-workflow",
      type: "sql",
      schema: "kurs-entwurf",
      title: "Einen Kurs als Tabelle umsetzen",
      description: "Lege genau drei Spalten in kurse an: kursnr INT als Pflichtfeld und Primärschlüssel, titel VARCHAR(60) als Pflichtfeld und startdatum DATE als Pflichtfeld. Speichere anschließend denselben Tabellenentwurf in deinem Workbench-Modell.",
      difficulty: "medium",
      xp: 35,
      starter: "CREATE TABLE kurse (\n  \n);",
      solution: "CREATE TABLE kurse (kursnr INT NOT NULL PRIMARY KEY, titel VARCHAR(60) NOT NULL, startdatum DATE NOT NULL);",
      hints: [
        "Verwende die in der Aufgabe vorgegebenen Spaltennamen und Datentypen.",
        "Trenne die Spaltendefinitionen durch Kommas. PRIMARY KEY identifiziert jeden Kurs; NOT NULL verlangt einen Wert.",
        "Die Browserprüfung untersucht deine Tabellenstruktur. In Workbench ergänzt du denselben Entwurf im EER-Modell und speicherst ihn separat als .mwb-Datei."
      ],
      check: {
        type: "mutation",
        // Leerzeichen im Datentyp und Groß-/Kleinschreibung der Spaltennamen zählen nicht, wie in MySQL (Claude, 0.41.4).
        verifySql: "SELECT LOWER(name) AS name, REPLACE(UPPER(type), ' ', '') AS datentyp, [notnull] AS pflicht, pk FROM pragma_table_info('kurse') ORDER BY cid;",
        expected: { columns: ["name", "datentyp", "pflicht", "pk"], values: [["kursnr", "INT", 1, 1], ["titel", "VARCHAR(60)", 1, 0], ["startdatum", "DATE", 1, 0]] },
        required: ["create\\s+table", "primary\\s+key", "not\\s+null"]
      }
    },
    {
      id: "sql-students-without-hours",
      lessonId: "joins",
      type: "sql",
      schema: "fahrschule-outer-join",
      title: "Auch Schüler ohne Fahrstunden anzeigen",
      description: "Gib schuelernr, nachname und die Summe der stundenzahl als stunden für jeden Schüler aus. Auch Schüler ohne Fahrstunden sollen erscheinen, mit 0. Sortiere nach schuelernr.",
      difficulty: "plus",
      xp: 40,
      starter: "SELECT \nFROM fahrschueler AS f\nLEFT JOIN fahrstunden AS s ON \nGROUP BY \nORDER BY ;",
      solution: "SELECT f.schuelernr, f.nachname, COALESCE(SUM(s.stundenzahl), 0) AS stunden FROM fahrschueler AS f LEFT JOIN fahrstunden AS s ON f.schuelernr = s.schuelernr GROUP BY f.schuelernr, f.nachname ORDER BY f.schuelernr;",
      hints: [
        "Ein INNER JOIN würde Schüler ohne passenden Fahrstundendatensatz verlieren.",
        "Verbinde über schuelernr. Gruppiere alle ausgewählten nicht aggregierten Spalten.",
        "SUM liefert bei einer leeren Gruppe NULL. COALESCE kann daraus 0 machen."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT f.schuelernr, f.nachname, COALESCE(SUM(s.stundenzahl), 0) AS stunden FROM fahrschueler AS f LEFT JOIN fahrstunden AS s ON f.schuelernr = s.schuelernr GROUP BY f.schuelernr, f.nachname ORDER BY f.schuelernr;",
        orderSensitive: true,
        required: ["left\\s+(?:outer\\s+)?join", "sum\\s*\\(", "group\\s+by", "order\\s+by"]
      }
    },
    {
      id: "sql-repeat-rentals",
      lessonId: "mn-beziehungen",
      type: "sql",
      schema: "vermietung-wiederholung",
      title: "Wiederkehrende Kunden ermitteln",
      description: "Gib kundennr, nachname und die Anzahl ihrer Mietverträge als vertraege aus. Zeige nur Kunden mit mindestens zwei Verträgen und sortiere nach kundennr. Zwei Mietvorgänge mit demselben Fahrrad zählen als zwei Verträge.",
      difficulty: "plus",
      xp: 40,
      starter: "SELECT \nFROM kunden AS k\nJOIN mietvertraege AS m ON \nGROUP BY \nHAVING \nORDER BY ;",
      solution: "SELECT k.kundennr, k.nachname, COUNT(m.vertragnr) AS vertraege FROM kunden AS k JOIN mietvertraege AS m ON k.kundennr = m.kundennr GROUP BY k.kundennr, k.nachname HAVING COUNT(m.vertragnr) >= 2 ORDER BY k.kundennr;",
      hints: [
        "Verbinde Kunden mit den Mietverträgen über kundennr.",
        "Zähle Verträge, nicht unterschiedliche Fahrradnummern.",
        "HAVING filtert nach der Gruppierung. Wähle >= 2, damit genau zwei Verträge genügen."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT k.kundennr, k.nachname, COUNT(m.vertragnr) AS vertraege FROM kunden AS k JOIN mietvertraege AS m ON k.kundennr = m.kundennr GROUP BY k.kundennr, k.nachname HAVING COUNT(m.vertragnr) >= 2 ORDER BY k.kundennr;",
        orderSensitive: true,
        required: ["join", "count\\s*\\(", "group\\s+by", "having", "order\\s+by"]
      }
    },
    {
      id: "erm-course-table",
      lessonId: "relation-und-schluessel",
      type: "diagram",
      title: "Vom Kurs zum Tabellenmodell",
      description: "Ordne Schlüssel und Datentypen im Diagramm zu. Übertrage danach den Entwurf als eigene Tabelle in MySQL Workbench.",
      difficulty: "easy",
      xp: 30,
      prompt: "Jeder Kurs erhält eine dauerhaft eindeutige Nummer. Ein Titel kann bei mehreren Kursen gleich sein und umfasst höchstens 60 Zeichen. Für jeden Kurs speichern wir außerdem ein Startdatum. Alle drei Angaben sind verpflichtend.",
      diagram: {
        caption: "Entitätstyp Kurs mit drei atomaren Attributen",
        chain: [{ type: "entity", title: "kurse", attributes: [{ slotId: "key" }, { slotId: "title" }, { slotId: "date" }] }]
      },
      slots: [
        { id: "key", label: "Eindeutige Kursnummer", options: ["kursnr INT · PK · NN", "titel VARCHAR(60) · PK", "startdatum DATE · PK"], answer: "kursnr INT · PK · NN" },
        { id: "title", label: "Kurstitel", options: ["titel VARCHAR(60) · NN", "titel INT · NN", "titel DATE · NN"], answer: "titel VARCHAR(60) · NN" },
        { id: "date", label: "Startdatum", options: ["startdatum INT · NN", "startdatum VARCHAR(60)", "startdatum DATE · NN"], answer: "startdatum DATE · NN" }
      ],
      explanation: "Die Kursnummer ist ein stabiler Schlüssel. Titel sind nicht eindeutig. VARCHAR(60) speichert den Text; DATE speichert das Datum. NN bedeutet NOT NULL. Setze diesen Entwurf in Workbench als eigene Tabelle um."
    },
    {
      id: "erm-recurring-assignments",
      lessonId: "erm-beziehungsentitaet",
      type: "diagram",
      title: "Wiederholte Fahrzeugeinsätze modellieren",
      description: "Löse M:N mit einer Beziehungsentität auf. Derselbe Fahrlehrer darf dasselbe Fahrzeug an mehreren Terminen nutzen.",
      difficulty: "plus",
      xp: 45,
      prompt: "Ein Fahrlehrer kann mehrere Fahrzeuge nutzen; ein Fahrzeug kann von mehreren Fahrlehrern genutzt werden. Jeder einzelne Einsatz erhält eine eindeutige einsatznr und speichert einen Beginn mit Datum und Uhrzeit. Jeder Einsatz gehört genau einem Fahrlehrer und genau einem Fahrzeug. Fahrlehrer und Fahrzeuge ohne Einsatz bleiben im Modell möglich.",
      diagram: {
        caption: "M:N-Auflösung mit eigenem Schlüssel für wiederholte Einsätze",
        chain: [
          { type: "entity", title: "fahrlehrer", attributes: ["fahrlehrernr PK", "nachname"] },
          { type: "relation", label: "übernimmt", slotId: "teacherRelation" },
          { type: "entity", title: "einsaetze", role: "Beziehungsentität", attributes: [{ slotId: "key" }, { slotId: "teacher" }, { slotId: "vehicle" }, { slotId: "begin" }] },
          { type: "relation", label: "verwendet", slotId: "vehicleRelation" },
          { type: "entity", title: "kfz", attributes: ["kfznr PK", "kennzeichen"] }
        ]
      },
      slots: [
        { id: "teacherRelation", label: "fahrlehrer zu einsaetze (Maximum)", options: ["1:1", "1:N", "M:N"], answer: "1:N" },
        { id: "vehicleRelation", label: "einsaetze zu kfz (Maximum)", options: ["1:N", "M:N", "N:1"], answer: "N:1" },
        { id: "key", label: "Schlüssel eines Einsatzes", options: ["einsatznr INT · PK · NN", "fahrlehrernr + kfznr · PK", "beginn DATE · PK"], answer: "einsatznr INT · PK · NN" },
        { id: "teacher", label: "Verweis auf Fahrlehrer", options: ["nachname VARCHAR(45) · FK", "fahrlehrernr INT · FK · NN", "einsatznr INT · FK"], answer: "fahrlehrernr INT · FK · NN" },
        { id: "vehicle", label: "Verweis auf Fahrzeug", options: ["kfznr INT · FK · NN", "kennzeichen VARCHAR(20) · PK", "einsatznr INT · FK"], answer: "kfznr INT · FK · NN" },
        { id: "begin", label: "Datum und Uhrzeit des Einsatzes", options: ["beginn DATE · NN", "beginn DATETIME · NN", "beginn INT · NN"], answer: "beginn DATETIME · NN" }
      ],
      explanation: "Jeder Einsatz verweist auf genau einen Fahrlehrer und ein Fahrzeug; beide Eltern dürfen 0 bis viele Einsätze haben. Ein Schlüssel nur aus den beiden Fremdschlüsseln würde wiederholte Einsätze desselben Paares verhindern. Die eigene einsatznr unterscheidet sie. DATETIME erhält Datum und Uhrzeit. Zeichne die beiden 1:N-Beziehungen nun in Workbench."
    }
  ];
  exercises.forEach((exercise) => content.practices.push(exercise));
})();
