(() => {
  "use strict";
  // Aufgabentyp „Klauseln ordnen“ (Claude, OPT-03b): Die Zeilen einer Abfrage stehen
  // durcheinander und werden mit Pfeiltasten in die richtige Reihenfolge gebracht.
  const content = window.WORKBENCH_CONTENT;
  content.orderIntro = "Bringe die Zeilen mit den Pfeilen in die Reihenfolge, in der SQL sie verlangt. Nach der richtigen Lösung wird die Abfrage ausgeführt.";
  content.orderRetry = "Die Klauseln haben eine feste Reihenfolge: SELECT, FROM, JOIN … ON, WHERE, GROUP BY, HAVING, ORDER BY.";
  const exercises = [
    {
      id: "order-where-sortierung",
      lessonId: "where-sortierung",
      schema: "fahrschule-basic",
      title: "Klauseln ordnen: Filtern und sortieren",
      description: "Gesucht sind Nachname und Vorname aller Fahrschüler aus Stuttgart, sortiert nach Nachname.",
      difficulty: "easy",
      lines: ["SELECT nachname, vorname", "FROM fahrschueler", "WHERE ort = 'Stuttgart'", "ORDER BY nachname, vorname;"],
      start: [2, 3, 0, 1],
      feedback: "WHERE wählt zuerst die passenden Datensätze aus. Sortiert wird immer zuletzt."
    },
    {
      id: "order-group-having",
      lessonId: "funktionen-gruppierung",
      schema: "fahrschule-basic",
      title: "Klauseln ordnen: Gruppieren und Gruppen filtern",
      description: "Gesucht sind alle Orte mit mindestens zwei Fahrschülern und deren Anzahl, die größte Gruppe zuerst.",
      difficulty: "medium",
      lines: ["SELECT ort, COUNT(*) AS anzahl", "FROM fahrschueler", "GROUP BY ort", "HAVING COUNT(*) >= 2", "ORDER BY anzahl DESC, ort;"],
      start: [3, 4, 0, 2, 1],
      feedback: "GROUP BY bildet die Gruppen, HAVING filtert danach ganze Gruppen. HAVING steht deshalb immer hinter GROUP BY."
    },
    {
      id: "order-where-group",
      lessonId: "funktionen-gruppierung",
      schema: "fahrschule-basic",
      title: "Klauseln ordnen: Erst filtern, dann gruppieren",
      description: "Gesucht ist je Ort die durchschnittliche Fahrstundenzahl. Berücksichtigt werden nur Fahrschüler mit mehr als 5 Fahrstunden.",
      difficulty: "medium",
      lines: ["SELECT ort, AVG(fahrstunden) AS schnitt", "FROM fahrschueler", "WHERE fahrstunden > 5", "GROUP BY ort", "ORDER BY ort;"],
      start: [4, 2, 0, 1, 3],
      feedback: "WHERE entfernt einzelne Datensätze, bevor gruppiert wird. Deshalb steht WHERE vor GROUP BY."
    },
    {
      id: "order-join",
      lessonId: "joins",
      schema: "fahrschule",
      title: "Klauseln ordnen: JOIN einbauen",
      description: "Gesucht sind Nachname und Wohnort aller Fahrschüler aus Stuttgart, sortiert nach Nachname.",
      difficulty: "medium",
      lines: ["SELECT f.nachname, o.ort", "FROM fahrschueler AS f", "JOIN orte AS o ON f.ortnr = o.ortnr", "WHERE o.ort = 'Stuttgart'", "ORDER BY f.nachname;"],
      start: [2, 4, 1, 0, 3],
      feedback: "JOIN gehört zur Datenquelle und steht direkt hinter FROM. Erst danach folgen WHERE und ORDER BY."
    }
  ];

  exercises.forEach((exercise) => {
    content.practices.push({ ...exercise, type: "order", variant: "order", xp: 15, sql: exercise.lines.join("\n") });
  });
})();
