(() => {
  "use strict";
  const openings = {
    "warum-datenbanken": {
      image: "assets/images/lesson-l1-1-kontaktdaten.webp",
      alt: "Fiktiver Fahrschul-Schreibtisch mit Karteikarten, Anmeldeformular und Laptop; vor dem Fenster steht ein Schulungsauto.",
      title: "Eine Anmeldung, viele Angaben",
      scenario: "Fall: Die Fahrschule nimmt neue Anmeldungen auf. Auf einer Karte steht ein kompletter Name, auf einer anderen stehen Vorname und Nachname getrennt. Zwei Personen heißen Alex Weber. Ihre Telefonnummern können sich später ändern.",
      questions: [
        { question: "Welche Angaben würdest du für alle Personen in denselben Spalten speichern?", answer: "Zum Beispiel vorname, nachname und telefon. Jede Zeile beschreibt genau eine angemeldete Person. Getrennte Attribute erlauben etwa die Sortierung nach dem Nachnamen; eine unterschiedlich beschriftete Karte allein ist noch kein einheitlicher Tabellenentwurf." },
        { question: "Weshalb taugen Name und Telefonnummer hier nicht als Primärschlüssel?", answer: "Der Name ist nicht eindeutig: Im Fall gibt es zweimal Alex Weber. Telefonnummern können wechseln und von mehreren Personen genutzt werden. Eine eigene schuelernr identifiziert die Zeile unabhängig davon; ihr Wert muss eindeutig sein und darf nicht NULL sein." },
        { question: "Sollte eine Telefonnummer als INT oder als Text gespeichert werden?", answer: "Als Text, etwa VARCHAR: Eine führende Null, ein Pluszeichen und die internationale Vorwahl gehören zur Angabe. Telefonnummern werden nicht addiert. Auch eine Hausnummer wie 12a ist kein reiner Rechenwert." }
      ],
      takeaway: "Einheitliche Attribute ordnen die Angaben. Ein stabiler Schlüssel identifiziert die Person, auch wenn sich ihre Kontaktdaten ändern.",
      bridge: "Übertrage diese Überlegungen anschließend in deinen eigenen Tabellenentwurf. Die Einstiegstabelle in Workbench zeigt bewusst nur drei Spalten, nicht die vollständige Lösung."
    },
    "erm-sachtext-analyse": {
      image: "assets/images/lesson-l2-1-wohnorte.webp",
      alt: "Fiktive Fahrschule mit wartenden erwachsenen Fahrschülern, Schulungsauto und benachbarten Wohnhäusern.",
      title: "Viele Personen, derselbe Ort",
      scenario: "Fallannahme, nicht aus dem Bild ablesbar: In unserer vereinfachten Fahrschule hat jede Person genau einen Wohnort. Mehrere Personen können demselben Ort zugeordnet sein. Bei drei Fahrschülern mit demselben Wohnort ist dessen Name dreimal gespeichert; ein Schreibfehler wird nur in einer Zeile korrigiert.",
      questions: [
        { question: "Warum ist das mehr als nur ein doppelter Wert im SELECT-Ergebnis?", answer: "Die Information über denselben Ort ist mehrfach gespeichert. Nach der teilweisen Korrektur widersprechen sich die Ortsangaben: Das ist eine Änderungsanomalie. DISTINCT kann Wiederholungen im Ergebnis ausblenden, repariert aber keine gespeicherten Daten." },
        { question: "Welche Information sollte nur einmal gepflegt werden, und wo liegt der Verweis?", answer: "Die Ortsangaben stehen einmal pro modelliertem Ort in orte mit ortnr als Primärschlüssel. In fahrschueler bleibt ortnr als Verweis auf diesen Datensatz. Die wiederholte Nummer ist beabsichtigt: Mehrere Personen können auf denselben Ort zeigen. Der technische Foreign-Key-Constraint folgt erst in L2.2." },
        { question: "Wie liest du die Beziehung in beiden Richtungen?", answer: "Ein Ort kann null bis viele Fahrschüler haben. Ein Fahrschüler hat in diesem Fall genau einen Wohnort. Daraus entsteht 1:N mit dem Fremdschlüssel auf der Fahrschüler-Seite. Die Fallregel bestimmt diese Kardinalität, nicht die Anzahl der Personen auf dem Foto." }
      ],
      takeaway: "Nicht jeder wiederholte Wert ist ein Entwurfsfehler. Entscheidend ist, ob dieselbe fachliche Information an mehreren Stellen gepflegt werden muss.",
      bridge: "Prüfe danach deine vollständige L1-Tabelle. In L2.1 erstellst du nur eine Modellkopie mit zwei Tabellen; die Serverdaten bleiben unverändert."
    },
    "digitale-spuren": {
      image: "assets/images/lesson-l5-1-radverleih.webp",
      alt: "Fiktive erwachsene Person mit Smartphone an einer Fahrradverleihstation auf einem Stadtplatz.",
      title: "Ein Fahrrad ausleihen: Was bleibt gespeichert?",
      scenario: "Fiktiver Dienst: Beim Entsperren eines Leihrads speichert er mietnr, profilnr, radnr, stationsnr und startzeit. Eine spätere Rückgabe ergänzt zielstation und endzeit. Wir untersuchen nur diesen beschriebenen Fall, keine echten Konten oder Standortverläufe.",
      questions: [
        { question: "Welche Handlung wird bewusst ausgelöst, welche Angaben fallen dabei zusätzlich an?", answer: "Die Person löst die Ausleihe bewusst aus. Der Dienst protokolliert dabei nach der Fallbeschreibung auch Startzeit und Station. Aktive Handlung und zusätzliche technische Spur können also zusammen auftreten; bewusstes Klicken bedeutet nicht, dass jede einzelne gespeicherte Angabe bewusst veröffentlicht wird." },
        { question: "Beweisen Start- und Zielstation die genaue gefahrene Route?", answer: "Nein. Zwei Stationen und zwei Zeitpunkte belegen im Fall nur Anfang und Ende der Miete. Zwischenstationen und die genaue Route sind nicht enthalten. Auch eine vermutete Gewohnheit ist noch kein sicher belegter Wohnort oder Beweggrund." },
        { question: "Macht eine Profilnummer den Bestand automatisch anonym?", answer: "Nein. Eine Profilnummer kann über weitere Daten einer Person zugeordnet werden. Prüfe mögliche Verknüpfungen statt nur die fehlende Namensspalte. Für eine Stationsstatistik können zusammengefasste Mietzahlen statt einzelner Profile genügen; auch kleine Gruppen und weitere verfügbare Daten müssen dabei geprüft werden." }
      ],
      takeaway: "Trenne erfasste Daten von möglichen Rückschlüssen. Eine Verknüpfung liefert nicht automatisch den Beweis für eine Vermutung.",
      bridge: "Untersuche anschließend die fiktiven Schulportal-Daten in Workbench: Auch dort verbindet ein JOIN Tabellen, aber er belegt keine zeitgleiche Handlung."
    }
  };
  for (const [id, opening] of Object.entries(openings)) {
    const lesson = window.WORKBENCH_CONTENT.lessons.find(item => item.id === id);
    if (lesson) lesson.opening = opening;
  }
})();
