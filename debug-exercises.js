(() => {
  "use strict";
  // Aufgabentyp „Fehlersuche“ (Claude, OPT-03a): Der Startcode enthält genau einen
  // typischen Fehler. Die Aufgaben nutzen die vorhandene SQL-Prüfung unverändert.
  const content = window.WORKBENCH_CONTENT;
  const debugIntro = "Die Abfrage enthält genau einen Fehler. Führe sie zuerst aus, lies Meldung oder Ergebnis und korrigiere sie dann.";
  const exercises = [
    {
      id: "debug-fehlendes-komma",
      lessonId: "select-projektion",
      schema: "fahrschule-basic",
      title: "Fehlersuche: Eine Spalte fehlt",
      description: "Gewünscht sind drei Spalten: vorname, nachname und ort, sortiert nach nachname und dann nach vorname. Die Abfrage läuft, zeigt aber nur zwei Spalten.",
      difficulty: "easy",
      starter: "SELECT vorname nachname, ort\nFROM fahrschueler\nORDER BY nachname, vorname;",
      fixed: "SELECT vorname, nachname, ort\nFROM fahrschueler\nORDER BY nachname, vorname;",
      symptom: "wrong",
      hints: [
        "Zähle die Spalten im Ergebnis und vergleiche die Überschriften mit der Aufgabe.",
        "Stehen zwei Namen ohne Komma hintereinander, liest SQL den zweiten als neuen Namen (Alias) für die erste Spalte.",
        "Zwischen vorname und nachname fehlt ein Komma."
      ],
      required: ["select", "order\\s+by"]
    },
    {
      id: "debug-text-ohne-anfuehrungszeichen",
      lessonId: "where-sortierung",
      schema: "fahrschule-basic",
      title: "Fehlersuche: Esslingen wird nicht gefunden",
      description: "Gewünscht sind nachname und vorname aller Fahrschüler aus Esslingen, sortiert nach nachname. Die Abfrage bricht mit einer Meldung ab.",
      difficulty: "easy",
      starter: "SELECT nachname, vorname\nFROM fahrschueler\nWHERE ort = Esslingen\nORDER BY nachname;",
      fixed: "SELECT nachname, vorname\nFROM fahrschueler\nWHERE ort = 'Esslingen'\nORDER BY nachname;",
      symptom: "error",
      hints: [
        "Lies die Meldung: Wonach sucht die Datenbank, was sie nicht findet?",
        "Ohne Anführungszeichen hält SQL ein Wort für einen Spaltennamen.",
        "Textwerte stehen in einfachen Anführungszeichen: 'Esslingen'."
      ],
      required: ["where", "order\\s+by"]
    },
    {
      id: "debug-and-statt-or",
      lessonId: "where-sortierung",
      schema: "fahrschule-basic",
      title: "Fehlersuche: Leeres Ergebnis",
      description: "Gewünscht sind nachname, vorname und ort aller Fahrschüler, die in Stuttgart oder in Tuebingen wohnen, sortiert nach nachname und dann nach vorname. Die Abfrage läuft, liefert aber keine einzige Zeile.",
      difficulty: "medium",
      starter: "SELECT nachname, vorname, ort\nFROM fahrschueler\nWHERE ort = 'Stuttgart' AND ort = 'Tuebingen'\nORDER BY nachname, vorname;",
      fixed: "SELECT nachname, vorname, ort\nFROM fahrschueler\nWHERE ort = 'Stuttgart' OR ort = 'Tuebingen'\nORDER BY nachname, vorname;",
      symptom: "wrong",
      hints: [
        "Prüfe die Bedingung für einen einzelnen Datensatz: Kann sie jemals wahr sein?",
        "Ein Datensatz hat genau einen Ort. Er kann nicht gleichzeitig Stuttgart und Tuebingen sein.",
        "Verbinde die beiden Möglichkeiten mit OR oder verwende IN ('Stuttgart', 'Tuebingen')."
      ],
      required: ["where", "order\\s+by"]
    },
    {
      id: "debug-where-statt-having",
      lessonId: "funktionen-gruppierung",
      schema: "fahrschule-basic",
      title: "Fehlersuche: Gruppen filtern",
      description: "Gewünscht sind alle Orte mit mehr als einem Fahrschüler: ort und die Anzahl als anzahl, sortiert nach ort. Die Abfrage bricht mit einer Meldung ab.",
      difficulty: "medium",
      starter: "SELECT ort, COUNT(*) AS anzahl\nFROM fahrschueler\nWHERE COUNT(*) > 1\nGROUP BY ort\nORDER BY ort;",
      fixed: "SELECT ort, COUNT(*) AS anzahl\nFROM fahrschueler\nGROUP BY ort\nHAVING COUNT(*) > 1\nORDER BY ort;",
      symptom: "error",
      hints: [
        "WHERE prüft einzelne Datensätze, bevor gruppiert wird. Zu diesem Zeitpunkt gibt es noch keine Anzahl je Gruppe.",
        "Bedingungen mit COUNT, SUM oder AVG gehören in eine andere Klausel.",
        "Entferne die WHERE-Zeile und ergänze nach GROUP BY: HAVING COUNT(*) > 1."
      ],
      required: ["group\\s+by", "having"]
    },
    {
      id: "debug-klauselreihenfolge",
      lessonId: "funktionen-gruppierung",
      schema: "fahrschule-basic",
      title: "Fehlersuche: Reihenfolge der Klauseln",
      description: "Gewünscht ist je Ort die durchschnittliche Zahl der Fahrstunden als schnitt, sortiert nach ort. Die Abfrage bricht mit einer Meldung ab.",
      difficulty: "easy",
      starter: "SELECT ort, AVG(fahrstunden) AS schnitt\nFROM fahrschueler\nORDER BY ort\nGROUP BY ort;",
      fixed: "SELECT ort, AVG(fahrstunden) AS schnitt\nFROM fahrschueler\nGROUP BY ort\nORDER BY ort;",
      symptom: "error",
      hints: [
        "Die Meldung nennt das Wort, an dem die Datenbank nicht weiterkommt.",
        "Die Klauseln haben eine feste Reihenfolge: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY.",
        "Sortiert wird immer zuletzt: Tausche die beiden letzten Zeilen."
      ],
      required: ["group\\s+by", "order\\s+by"]
    },
    {
      id: "debug-join-ohne-bedingung",
      lessonId: "joins",
      schema: "fahrschule",
      title: "Fehlersuche: Viel zu viele Zeilen",
      description: "Gewünscht ist für jeden Fahrschüler nachname, vorname und der Name seines Wohnorts, sortiert nach nachname und dann nach vorname. Die Abfrage läuft, zeigt aber jeden Fahrschüler mehrfach mit verschiedenen Orten.",
      difficulty: "medium",
      starter: "SELECT f.nachname, f.vorname, o.ort\nFROM fahrschueler AS f\nJOIN orte AS o\nORDER BY f.nachname, f.vorname;",
      fixed: "SELECT f.nachname, f.vorname, o.ort\nFROM fahrschueler AS f\nJOIN orte AS o ON f.ortnr = o.ortnr\nORDER BY f.nachname, f.vorname;",
      symptom: "wrong",
      hints: [
        "Vergleiche die Zahl der Ergebniszeilen mit der Zahl der Fahrschüler.",
        "Ohne Bedingung kombiniert JOIN jeden Fahrschüler mit jedem Ort.",
        "Ergänze nach dem JOIN die Schlüsselzuordnung: ON f.ortnr = o.ortnr."
      ],
      required: ["join", "\\bon\\b", "order\\s+by"]
    }
  ];

  content.debugIntro = debugIntro;
  exercises.forEach((exercise) => {
    content.practices.push({
      id: exercise.id,
      lessonId: exercise.lessonId,
      type: "sql",
      variant: "debug",
      symptom: exercise.symptom,
      schema: exercise.schema,
      title: exercise.title,
      description: exercise.description,
      difficulty: exercise.difficulty,
      xp: 20,
      starter: exercise.starter,
      hints: exercise.hints,
      check: {
        type: "query",
        expectedSql: exercise.fixed,
        orderSensitive: true,
        required: exercise.required
      }
    });
  });
})();
