(() => {
  "use strict";
  // Aufgabentyp „Vorhersage“ (Claude, OPT-03c): Erst das Ergebnis einer Abfrage im
  // Kopf bestimmen, dann prüfen. Nach richtiger Antwort zeigt die App das echte Ergebnis.
  const content = window.WORKBENCH_CONTENT;
  content.predictIntro = "Führe die Abfrage im Kopf aus, bevor du antwortest. Die Tabelle kannst du unten ansehen. Nach der richtigen Antwort siehst du das tatsächliche Ergebnis.";
  content.predictRetry = "Geh die Abfrage Klausel für Klausel durch: zuerst FROM, dann WHERE, dann GROUP BY und HAVING, zuletzt SELECT und ORDER BY.";
  const exercises = [
    {
      id: "predict-sortierung",
      lessonId: "select-projektion",
      schema: "fahrschule-basic",
      title: "Vorhersage: Wer steht oben?",
      description: "Bestimme ohne Ausführen, was die Abfrage liefert.",
      difficulty: "easy",
      sql: "SELECT vorname, fahrstunden\nFROM fahrschueler\nORDER BY fahrstunden DESC;",
      preview: ["fahrschueler"],
      questions: [
        {
          question: "Welcher Vorname steht in der ersten Zeile?",
          options: ["Nele", "Amir", "Jonas"],
          correct: 1,
          verifySql: "SELECT vorname FROM fahrschueler ORDER BY fahrstunden DESC LIMIT 1;"
        },
        {
          question: "Wie viele Zeilen hat das Ergebnis?",
          options: ["1", "10", "11"],
          correct: 2,
          verifySql: "SELECT COUNT(*) FROM fahrschueler;",
          feedback: "DESC sortiert absteigend, also steht die größte Fahrstundenzahl oben. ORDER BY ändert nur die Reihenfolge, nicht die Anzahl der Zeilen."
        }
      ]
    },
    {
      id: "predict-where-and",
      lessonId: "where-sortierung",
      schema: "fahrschule-basic",
      title: "Vorhersage: Zwei Bedingungen",
      description: "Bestimme ohne Ausführen, wie viele Datensätze beide Bedingungen erfüllen.",
      difficulty: "easy",
      sql: "SELECT nachname, fahrstunden\nFROM fahrschueler\nWHERE ort = 'Stuttgart' AND fahrstunden > 7;",
      preview: ["fahrschueler"],
      questions: [
        {
          question: "Wie viele Zeilen hat das Ergebnis?",
          options: ["2", "3", "4", "7"],
          correct: 1,
          verifySql: "SELECT COUNT(*) FROM fahrschueler WHERE ort = 'Stuttgart' AND fahrstunden > 7;",
          feedback: "Vier Fahrschüler wohnen in Stuttgart, aber nur drei davon haben mehr als 7 Fahrstunden. Bei AND müssen beide Bedingungen zugleich gelten."
        }
      ]
    },
    {
      id: "predict-distinct",
      lessonId: "sql-muster",
      schema: "fahrschule-basic",
      title: "Vorhersage: DISTINCT",
      description: "Bestimme ohne Ausführen, was DISTINCT aus der Ortsliste macht.",
      difficulty: "easy",
      sql: "SELECT DISTINCT ort\nFROM fahrschueler;",
      preview: ["fahrschueler"],
      questions: [
        {
          question: "Wie viele Zeilen hat das Ergebnis?",
          options: ["4", "5", "11"],
          correct: 1,
          verifySql: "SELECT COUNT(*) FROM (SELECT DISTINCT ort FROM fahrschueler);"
        },
        {
          question: "Wie oft erscheint Stuttgart im Ergebnis?",
          options: ["1", "3", "4"],
          correct: 0,
          verifySql: "SELECT COUNT(*) FROM (SELECT DISTINCT ort FROM fahrschueler) WHERE ort = 'Stuttgart';",
          feedback: "DISTINCT gibt jeden vorkommenden Wert genau einmal aus. In der Tabelle bleiben alle elf Datensätze unverändert gespeichert."
        }
      ]
    },
    {
      id: "predict-group-having",
      lessonId: "funktionen-gruppierung",
      schema: "fahrschule-basic",
      title: "Vorhersage: Gruppen und HAVING",
      description: "Bestimme ohne Ausführen, welche Gruppen übrig bleiben.",
      difficulty: "medium",
      sql: "SELECT ort, COUNT(*) AS anzahl\nFROM fahrschueler\nGROUP BY ort\nHAVING COUNT(*) >= 2\nORDER BY anzahl DESC;",
      preview: ["fahrschueler"],
      questions: [
        {
          question: "Wie viele Zeilen hat das Ergebnis?",
          options: ["4", "5", "11"],
          correct: 0,
          verifySql: "SELECT COUNT(*) FROM (SELECT ort FROM fahrschueler GROUP BY ort HAVING COUNT(*) >= 2);"
        },
        {
          question: "Welcher Ort steht in der ersten Zeile?",
          options: ["Esslingen", "Ludwigsburg", "Stuttgart"],
          correct: 2,
          verifySql: "SELECT ort FROM fahrschueler GROUP BY ort HAVING COUNT(*) >= 2 ORDER BY COUNT(*) DESC LIMIT 1;",
          feedback: "GROUP BY bildet fünf Gruppen. HAVING entfernt Ludwigsburg, weil dort nur ein Fahrschüler wohnt. Stuttgart hat mit vier die größte Gruppe."
        }
      ]
    },
    {
      id: "predict-join",
      lessonId: "joins",
      schema: "fahrschule",
      title: "Vorhersage: JOIN mit und ohne ON",
      description: "Bestimme ohne Ausführen, wie viele Zeilen der JOIN liefert.",
      difficulty: "medium",
      sql: "SELECT f.nachname, o.ort\nFROM fahrschueler AS f\nJOIN orte AS o ON f.ortnr = o.ortnr\nWHERE o.ort = 'Esslingen';",
      preview: ["fahrschueler", "orte"],
      questions: [
        {
          question: "Wie viele Zeilen hat das Ergebnis?",
          options: ["1", "2", "5", "10"],
          correct: 1,
          verifySql: "SELECT COUNT(*) FROM fahrschueler AS f JOIN orte AS o ON f.ortnr = o.ortnr WHERE o.ort = 'Esslingen';"
        },
        {
          question: "Angenommen, die Bedingung ON … und die WHERE-Zeile fehlen. Wie viele Zeilen entstehen dann?",
          options: ["10", "15", "50"],
          correct: 2,
          verifySql: "SELECT COUNT(*) FROM fahrschueler JOIN orte;",
          feedback: "Mit ON gehört zu jedem Fahrschüler genau ein Ort; zwei davon wohnen in Esslingen. Ohne ON wird jeder der 10 Fahrschüler mit jedem der 5 Orte kombiniert: 10 · 5 = 50 Zeilen."
        }
      ]
    }
  ];

  exercises.forEach((exercise) => {
    content.practices.push({ ...exercise, type: "choice", variant: "predict", xp: 15 });
  });
})();
