(function () {
  "use strict";

  const content = window.WORKBENCH_CONTENT;
  if (!content) {
    return;
  }

  content.version = "0.41.0";
  content.updated = "2026-10-08";
  content.course = {
    title: "BPE6 Relationale Datenbanken",
    subtitle: "Vom Tabellenentwurf bis zur begründeten Datenbewertung",
    lessonHours: 30,
    workflow: ["Informieren", "Planen", "In Workbench arbeiten", "Abschließen"],
    sourceNote: "Eigenständig aufbereitet nach dem lokalen Materialpaket Relationale Datenbanken des Landesbildungsservers Baden-Württemberg, Stand 31.07.2025."
  };

  content.modules = [
    {
      id: "lernfortschritt-1",
      number: "01",
      code: "L1",
      title: "Eine Tabelle aufbauen und mit SQL nutzen",
      description: "Vom begründeten Tabellenentwurf über MySQL Workbench zu SELECT, Funktionen sowie INSERT, UPDATE und DELETE.",
      lessonIds: [
        "warum-datenbanken",
        "relation-und-schluessel",
        "eerm-grundlagen",
        "workbench-workflow",
        "select-projektion",
        "where-sortierung",
        "sql-muster",
        "funktionen-gruppierung",
        "datum-berechnungen",
        "daten-verwalten"
      ]
    },
    {
      id: "lernfortschritt-2",
      number: "02",
      code: "L2",
      title: "Mehrere Tabellen modellieren und verbinden",
      description: "Sachtexte in Modelle übersetzen, Kardinalitäten begründen, Fremdschlüssel setzen und Daten über JOIN auswerten.",
      lessonIds: [
        "erm-sachtext-analyse",
        "erm-kardinalitaeten",
        "fremdschluessel-integritaet",
        "joins"
      ]
    },
    {
      id: "lernfortschritt-3",
      number: "03",
      code: "L3",
      title: "M:N-Beziehungen und 3NF sicher beherrschen",
      description: "Beziehungsentitäten entwickeln, anspruchsvolle Mehrtabellenabfragen lösen und Modelle auf die Dritte Normalform prüfen.",
      lessonIds: [
        "erm-beziehungsentitaet",
        "mn-beziehungen",
        "redundanz-3nf"
      ]
    },
    {
      id: "lernfortschritt-4",
      number: "04",
      code: "L4",
      title: "Schrittweise normalisieren",
      description: "Unstrukturierte Daten nachvollziehbar in die Erste, Zweite und Dritte Normalform überführen.",
      lessonIds: ["normalisierung"]
    },
    {
      id: "lernfortschritt-5",
      number: "05",
      code: "L5",
      title: "Digitale Spuren und Big Data beurteilen",
      description: "Datenflüsse untersuchen, das 3V-Modell anwenden und Chancen, Risiken sowie Bedingungen begründet abwägen.",
      lessonIds: ["digitale-spuren", "big-data", "bigdata-fallanalyse"]
    }
  ];

  const lessonEnhancements = {
    "warum-datenbanken": {
      courseCode: "L1.1",
      module: "lernfortschritt-1",
      title: "Struktur einer Datenbanktabelle entwerfen",
      subtitle: "Aus uneinheitlichen Kontaktdaten entsteht eine klar benannte, atomare und durch einen Primärschlüssel eindeutig identifizierbare Relation.",
      duration: 55,
      xp: 40,
      workflow: ["Informieren", "Entwerfen und üben", "In Workbench arbeiten", "Abschließen"],
      workflowHints: ["Grundbegriffe lesen", "Entwurf und Kurzcheck", "Erste SQL-Tabelle untersuchen", "Lehrkraft bestätigt"],
      sourceMaterials: ["L1_1 Information Tabellenentwurf", "L1_1 Aufgabe Tabellenentwurf", "L1_1 Vorlage Tabellenentwurf"],
      objectives: [
        "Datensatz, Primärschlüssel, Attribut und Attributwert sicher unterscheiden",
        "Regeln für Tabellen- und Attributnamen anwenden",
        "atomare Attribute sowie passende MySQL-Datentypen auswählen",
        "einen vollständigen Tabellenentwurf für eine Fahrschule erstellen"
      ],
      sections: [
        {
          title: "Von Kontaktkarten zu einer einheitlichen Tabelle",
          body: [
            "Einzelne Kontakte lassen sich in einer Kartei oder auf dem Smartphone speichern. Für Verwaltung, Rechnungen und wiederholbare Auswertungen braucht die Fahrschule jedoch eine gemeinsame Struktur, in der jede Angabe immer an derselben Stelle steht.",
            "In einer relationalen Datenbank werden inhaltlich zusammengehörige Daten in Tabellen gespeichert. Eine solche Tabelle heißt auch Relation. Uneinheitliche Feldnamen und zusammengefasste Angaben werden vor dem Speichern vereinheitlicht und zerlegt."
          ],
          visual: "table-design-flow",
          tip: "Frage bei jedem Feld: Enthält es genau eine Bedeutung, und steht derselbe Wertetyp später in jeder Zeile?"
        },
        {
          title: "Die vier Grundbegriffe",
          body: [
            "Die Begriffe beschreiben unterschiedliche Ebenen einer Tabelle. Eine Zeile ist nicht dasselbe wie eine Spalte, und ein konkreter Zellinhalt ist nicht dasselbe wie die Eigenschaft, die über der Spalte steht."
          ],
          definitions: [
            { term: "Datensatz (Tupel)", definition: "Eine vollständige Tabellenzeile mit allen gespeicherten Angaben zu genau einem Objekt, zum Beispiel zu einem Fahrschüler." },
            { term: "Primärschlüssel", definition: "Ein Attribut, dessen Wert jeden Datensatz eindeutig und dauerhaft identifiziert. Häufig wird dafür eine künstliche ganze Zahl verwendet." },
            { term: "Attribut", definition: "Eine Eigenschaft aller Datensätze; in der Tabelle entspricht sie einer Spalte, zum Beispiel `nachname`." },
            { term: "Attributwert", definition: "Der konkrete Wert eines Attributs in einem Datensatz, zum Beispiel `Abele` in der Spalte `nachname`." }
          ]
        },
        {
          title: "Regeln für einen belastbaren Tabellenentwurf",
          body: [
            "Ein guter Entwurf verhindert Missverständnisse schon vor der Arbeit in MySQL Workbench. Besonders wichtig sind eindeutige Namen, atomare Werte und ein stabiler Primärschlüssel."
          ],
          rules: [
            "Tabellennamen werden klein, im Plural und ohne Leerzeichen, Umlaute oder Sonderzeichen geschrieben, zum Beispiel `fahrschueler`.",
            "Jede Spalte erhält einen eindeutigen Attributnamen.",
            "Jedes Attribut ist atomar und enthält genau einen Wert. Deshalb werden etwa `strasse` und `hausnummer` sowie `vorname` und `nachname` getrennt.",
            "Alle Datensätze besitzen dieselben Attribute, auch wenn einzelne Werte noch unbekannt sein können.",
            "Ein künstlicher ganzzahliger Primärschlüssel ist meist stabiler als Name, Telefonnummer oder E-Mail-Adresse."
          ],
          warning: "Telefonnummern und Postleitzahlen sind keine Rechenwerte. Sie werden trotz ihrer Ziffern in der Regel als Text modelliert."
        },
        {
          title: "Wichtige Datentypen in MySQL",
          body: [
            "Der Datentyp legt fest, welche Werte gespeichert und welche Operationen sinnvoll ausgeführt werden können. Die Speicherangaben sind vereinfachte Richtwerte; bei VARCHAR hängt der tatsächliche Bedarf auch von der Zeichencodierung ab."
          ],
          dataTypes: [
            { name: "INT", meaning: "Ganze Zahlen von -2.147.483.648 bis +2.147.483.647", storage: "4 Byte", example: "15" },
            { name: "DOUBLE", meaning: "Gleitkommazahlen; Dezimalstellen werden mit Punkt geschrieben", storage: "8 Byte", example: "17.99" },
            { name: "VARCHAR(n)", meaning: "Text variabler Länge mit höchstens n Zeichen", storage: "variabel", example: "Abele" },
            { name: "DATE", meaning: "Datum im Format Jahr-Monat-Tag", storage: "3 Byte", example: "1991-11-30" },
            { name: "TIME", meaning: "Uhrzeit im Format Stunde:Minute:Sekunde", storage: "3 Byte", example: "03:56:04" },
            { name: "BOOLEAN / TINYINT(1)", meaning: "Wahrheitswert; MySQL Workbench stellt BOOLEAN als TINYINT(1) dar", storage: "1 Byte", example: "TRUE / 1" }
          ]
        }
      ],
      webWorksheet: {
        title: "L1.1: Tabellenentwurf für die Fahrschule",
        intro: "Bearbeite zuerst die vier Begriffe. Entwirf danach die Kontaktdaten der Relation fahrschueler. Die letzten zwei Zeilen für geburtsdatum und fahrstundenzahl ergänzt du in L1.2.",
        definitionTerms: [
          { id: "datensatz", label: "Datensatz", prompt: "Erkläre den Begriff und nenne ein Beispiel aus der Fahrschule." },
          { id: "primaerschluessel", label: "Primärschlüssel", prompt: "Erkläre Eindeutigkeit und Stabilität." },
          { id: "attribut", label: "Attribut", prompt: "Ordne den Begriff einer Tabellenspalte zu." },
          { id: "attributwert", label: "Attributwert", prompt: "Nenne einen konkreten Wert zu einem Attribut." }
        ],
        columnCount: 11,
        dataTypes: ["INT", "DOUBLE", "VARCHAR", "DATE", "TIME", "BOOLEAN / TINYINT(1)"],
        hint: "Prüfe abschließend: genau ein Primärschlüssel, atomare Attribute, passende Datentypen und bei `VARCHAR` eine begründete maximale Zeichenanzahl."
      },
      notePrompts: [
        "Woran erkenne ich ein atomares Attribut?",
        "Warum ist eine künstliche Nummer häufig ein guter Primärschlüssel?",
        "Welche Datentypen würde ich für Telefonnummer, Geburtsdatum und Anzahl Fahrstunden wählen?"
      ],
      classroomTask: {
        tool: "MySQL Workbench · SQL",
        title: "Vom Tabellenentwurf zur ersten SQL-Tabelle",
        intro: "Prüfe deinen Entwurf. Untersuche danach die kleine Einstiegstabelle mit zwei fiktiven Personen in Workbench. Sie enthält nur drei Spalten, nicht die Lösung deines vollständigen Entwurfs.",
        steps: [
          "Vergleiche deine Definitionen mit den Fachbegriffen im Informationsteil und verbessere sie bei Bedarf.",
          "Kontrolliere Tabellenname, Attributnamen, Atomarität und Datentypen mit der Checkliste.",
          "Markiere deinen Primärschlüssel und begründe schriftlich, weshalb er jeden Fahrschüler eindeutig identifiziert.",
          "Starte den Informatik-Stick, dann unter Datenbank MariaDB MySQL starten. Warte auf ready for connections und lasse das Konsolenfenster geöffnet. Starte zuletzt Workbench 6.3.10. Unter Nachschlagen findest du den animierten Startablauf.",
          "Öffne die lokale Verbindung oder lege sie mit der Lehrkraft über das Plus bei MySQL Connections an: local, Standard (TCP/IP), Host 127.0.0.1, Port 3306, Benutzer root. Ein Passwort verwendest du nur nach Vorgabe für diesen lokalen Server; kein Windows- oder Schulpasswort.",
          "Lade das Einstiegsskript herunter und öffne es über File > Open SQL Script. Prüfe das getrennte Ziel workbenchlab_l1_1_einstieg und führe das Skript genau einmal mit dem Blitz aus. CREATE TABLE beschreibt Spalten, INSERT INTO fügt Daten hinzu und SELECT zeigt sie an. fahrschule wird nicht verändert.",
          "Ordne im Ergebnis eine Zeile einem Datensatz, eine Spalte einem Attribut und einen Zellinhalt einem Attributwert zu. Notiere die beiden Schlüsselwerte bei deinen Definitionen. Markiere und wiederhole danach nur die SELECT-Anweisung, nicht das gesamte Skript.",
          "Speichere dein SQL-Skript als L1_1_einstieg.sql. Öffne die Datei erneut, zeige das Ergebnis der Lehrkraft und dokumentiere eine Verbesserung deines Entwurfs."
        ],
        download: { href: "assets/sql/l1-1-workbench-einstieg.sql", label: "SQL-Einstieg herunterladen" },
        fileName: "L1_1_einstieg.sql",
        evidence: "Tabellenentwurf, eigene Definitionen mit Beobachtungen aus Workbench und erneut geöffnetes SQL-Skript"
      },
      completionChecks: [
        "Ich habe alle vier Fachbegriffe in eigenen Worten erklärt.",
        "Mein Tabellenentwurf enthält atomare Attribute, passende Datentypen und genau einen Primärschlüssel.",
        "Ich habe die Einstiegstabelle in Workbench angezeigt, die beiden Datensätze zugeordnet und mein SQL-Skript gespeichert.",
        "Ich habe eine eigene Zusammenfassung geschrieben und mindestens eine Verbesserung dokumentiert."
      ],
      quiz: {
        question: "Welcher Tabellenentwurf erfüllt die Regeln aus L1.1 am besten?",
        options: [
          "schuelernr INT als Primärschlüssel; vorname, nachname, strasse und hausnummer als getrennte Attribute",
          "name_und_adresse VARCHAR als Primärschlüssel, damit alle Angaben in einem Feld stehen",
          "nachname VARCHAR als Primärschlüssel, weil Nachnamen immer eindeutig sind"
        ],
        correct: 0,
        explanation: "Ein künstlicher Schlüssel identifiziert stabil; getrennte Attribute speichern jeweils genau einen atomaren Wert."
      }
    },
    "relation-und-schluessel": {
      courseCode: "L1.2",
      module: "lernfortschritt-1",
      title: "ER-Diagramm und Relationenschema",
      subtitle: "Aus dem Tabellenentwurf wird zuerst ein fachliches ER-Diagramm und danach ein technisch präzisiertes Relationenschema.",
      duration: 55,
      workflow: ["Informieren", "Skizzieren und üben", "In Workbench modellieren", "Abschließen"],
      workflowHints: ["ERD und Schema unterscheiden", "Entwurf und Kurzcheck", "Erstes EER-Modell speichern", "Lehrkraft bestätigt"],
      sourceMaterials: ["L1_2.1 Information Datenbank modellieren", "L1_2 Aufgabe Datenbank modellieren"],
      objectives: [
        "erklären, wozu ein ER-Diagramm bei der Verständigung über Daten dient",
        "Entitätstyp und konkrete Entität voneinander unterscheiden",
        "aus dem ER-Diagramm ein Relationenschema mit Datentypen und Schlüssel ableiten"
      ],
      sections: [
        {
          title: "Erst fachlich denken: das ER-Diagramm",
          body: [
            "Heiner möchte die Daten seiner Fahrschüler für Meldungen, Prüfungen und Rechnungen gemeinsam verwalten. Bevor Tabellen in MySQL angelegt werden, beschreibt ein Entity-Relationship-Diagramm (ERD), welche Arten von Dingen gespeichert werden sollen. Für den Einstieg gibt es nur den Entitätstyp `fahrschueler`.",
            "Eine Entität ist ein bestimmter Fahrschüler. Der Entitätstyp beschreibt alle Fahrschüler mit denselben Eigenschaften. Das ERD hilft Fachleuten und Entwicklern, sich über diese Datenstruktur zu verständigen. Beziehungen zwischen mehreren Entitätstypen kommen später hinzu."
          ],
          definitions: [
            { term: "Entität", definition: "Ein einzelnes fachliches Objekt, zum Beispiel ein bestimmter Fahrschüler." },
            { term: "Entitätstyp", definition: "Die Klasse gleichartiger Objekte, hier `fahrschueler`." },
            { term: "ER-Diagramm", definition: "Fachliche Skizze von Entitätstypen, ihren Attributen und später auch Beziehungen." }
          ]
        },
        {
          title: "Danach technisch präzisieren: das Relationenschema",
          body: [
            "Das ERD allein legt noch nicht fest, wie MySQL die Werte speichern soll. Im Relationenschema ergänzt du pro Attribut den Datentyp, bei Texten die maximale Länge und einen Primärschlüssel.",
            "Heiner benötigt gegenüber L1.1 zwei zusätzliche Angaben: `geburtsdatum` und `fahrstundenzahl`. Ein Geburtsdatum ist DATE; die Anzahl der Fahrstunden ist eine ganze Zahl und damit INT. Die Telefonnummer bleibt Text, obwohl sie Ziffern enthält.",
            "Für die folgenden Einheiten umfasst dein Relationenschema genau diese elf Attribute: `schuelernr`, `nachname`, `vorname`, `telefon`, `email`, `strasse`, `hausnr`, `plz`, `ort`, `geburtsdatum`, `fahrstundenzahl`. Prüfe, welche Textlängen sinnvoll sind und ob `hausnr` auch Buchstaben enthalten können muss."
          ],
          visual: "single-table-model",
          tip: "Folge dem Pfeil: fachliches Objekt → Relation mit Schlüssel und Datentypen. Noch keine zweite Tabelle und keine Kardinalität nötig."
        },
        {
          title: "ERD und Relationenschema nicht verwechseln",
          body: [
            "Im ERD steht `fahrschueler` für den Entitätstyp. Im Relationenschema steht derselbe Name für die spätere Tabelle. Dort sind die technischen Festlegungen genauer: `schuelernr` wird als Primärschlüssel gekennzeichnet und jedes Attribut erhält einen passenden Datentyp.",
            "Prüfe deinen Entwurf in beide Richtungen: Sind alle für Heiner wichtigen Eigenschaften im ERD enthalten? Kann aus dem Relationenschema tatsächlich eine Tabelle mit atomaren, typisierten Spalten entstehen?"
          ]
        }
      ],
      webWorksheet: {
        title: "L1.2: Fahrschüler fachlich und technisch modellieren",
        intro: "Bearbeite die vier Fragen des Aufgabenblatts in eigenen Worten. Zeichne das ERD zusätzlich ins Heft und halte hier dein Relationenschema fest.",
        definitionTerms: [
          { id: "erd-zweck", label: "1 · Aufgabe des ERD", prompt: "Wozu dient ein ER-Diagramm, bevor die Datenbank gebaut wird?" },
          { id: "erd-entwurf", label: "2 · ERD für die Fahrschule", prompt: "Nenne Entitätstyp und Attribute. Was ist eine konkrete Entität?" },
          { id: "schema-zweck", label: "3 · Aufgabe des Relationenschemas", prompt: "Welche technischen Festlegungen ergänzt es gegenüber dem ERD?" },
          { id: "relationenschema", label: "4 · Dein Relationenschema", prompt: "Schreibe fahrschueler(...) mit schuelernr als PK, Attributnamen und Datentypen auf. Ergänze geburtsdatum und fahrstundenzahl." }
        ],
        hint: "Kontrolliere alle elf Attribute aus dem Informationsteil: `geburtsdatum DATE`, `fahrstundenzahl INT`, Textfelder als `VARCHAR(n)` und genau ein Primärschlüssel."
      },
      notePrompts: [
        "Worin unterscheiden sich Entität, Entitätstyp und Relation?",
        "Welche zusätzlichen Festlegungen stehen im Relationenschema?",
        "Warum ist `fahrstundenzahl` INT, aber eine Telefonnummer VARCHAR?"
      ],
      classroomTask: {
        tool: "MySQL Workbench · EER-Modell",
        title: "Den eigenen Entwurf erstmals in Workbench modellieren",
        intro: "Erkläre und skizziere zuerst ERD und Relationenschema. Setze danach deinen eigenen Entwurf in Workbench um; eine Serverdatenbank erzeugst du hier noch nicht.",
        steps: [
          "Beschreibe den Zweck eines ER-Diagramms und zeichne den Entitätstyp fahrschueler mit seinen Attributen.",
          "Unterscheide eine konkrete Entität vom Entitätstyp und erläutere den Zweck des Relationenschemas.",
          "Übertrage den Entwurf in ein Relationenschema mit Schlüssel, Datentypen und maximalen Textlängen.",
          "Öffne Workbench 6.3.10 und lege über File > New Model ein Modell an. Benenne mydb über Edit Schema in fahrschule um und öffne mit Add Diagram die Zeichenfläche.",
          "Platziere eine Tabelle fahrschueler und übertrage die elf Attribute unter Column Name mit Datentypen unter Datatype und passenden Textlängen. Kennzeichne schuelernr als PK und NN (NOT NULL). Füge noch keine Beziehung hinzu. Das technische EER-Modell ersetzt nicht die fachliche Skizze im Heft.",
          "Speichere als L1_2_entwurf.mwb und öffne die Datei erneut. Vergleiche die Tabelle mit deinem Relationenschema und dokumentiere eine Abweichung oder bestätige, dass alle elf Attribute übereinstimmen. Nutze dieses Modell in L1.3 weiter."
        ],
        fileName: "L1_2_entwurf.mwb",
        evidence: "Fachliche ERD-Skizze, digitales Relationenschema und erneut geöffnetes erstes Workbench-Modell"
      },
      completionChecks: [
        "Ich habe die vier Aufgaben des digitalen Blatts beantwortet und ein ERD gezeichnet.",
        "Mein Relationenschema enthält schuelernr als PK sowie geburtsdatum DATE und fahrstundenzahl INT.",
        "Ich kann den Unterschied zwischen fachlichem ERD und technischem Relationenschema erklären.",
        "Ich habe mein erstes EER-Modell in Workbench gespeichert, erneut geöffnet und mit den elf Attributen des Entwurfs verglichen."
      ],
      quiz: {
        question: "Welche Angabe macht aus der fachlichen ERD-Skizze ein technisch genaueres Relationenschema?",
        options: [
          "Attributnamen mit Datentypen und Kennzeichnung des Primärschlüssels",
          "Nur ein größer gezeichneter Kasten für fahrschueler",
          "Eine Liste mit konkreten Namen aller Fahrschüler"
        ],
        correct: 0,
        explanation: "Das Relationenschema präzisiert Attribute, Datentypen, Längen und den Schlüssel der späteren Tabelle."
      }
    },
    "eerm-grundlagen": {
      courseCode: "L1.3",
      module: "lernfortschritt-1",
      title: "EER-Diagramm in MySQL Workbench erstellen",
      subtitle: "Das fachliche Modell aus L1.2 wird als eine Tabelle im EER-Diagramm der MySQL Workbench umgesetzt und als Modelldatei gesichert.",
      duration: 55,
      sourceMaterials: ["L1_2.2 Information Datenbank softwaregestützt modellieren", "L1_2 Aufgabe Datenbank modellieren"],
      objectives: [
        "Informatik-Stick, Datenbankdienst und MySQL Workbench in der richtigen Reihenfolge starten und eine lokale Verbindung prüfen",
        "Schema und EER-Diagramm in MySQL Workbench anlegen",
        "Tabellenname, Attributnamen, Datentypen, PK und NN bewusst festlegen",
        "das Modell als .mwb speichern und nach erneutem Öffnen prüfen"
      ],
      sections: [
        {
          title: "Vom Papiermodell zum Workbench-Modell",
          body: [
            "MySQL Workbench nennt ihre Zeichenfläche EER-Diagramm. Dort legst du den Entitätstyp aus L1.2 als Tabelle `fahrschueler` an. Diese erste Übung verwendet nur eine Tabelle. Beziehungen und Kardinalitäten werden erst bei mehreren Tabellen gebraucht.",
            "Öffne deinen ersten Entwurf `L1_2_entwurf.mwb` aus L1.2. Das EER-Modell kannst du als `.mwb` speichern, ohne schon eine Datenbank auf dem Server anzulegen. Die kleine Einstiegstabelle aus L1.1 liegt in einem getrennten Schema; die vollständige Datenbank `fahrschule` wird erst in L1.4 erzeugt."
          ],
          visual: "single-table-workbench",
          warning: "Ein gespeichertes `.mwb`-Modell ist noch keine erzeugte Datenbank. Prüfe den Unterschied, bevor du später Forward Engineering ausführst."
        },
        {
          title: "Stick starten und Verbindung prüfen",
          body: [
            "Öffne am Schul-PC das Play-Symbol `Start` des Informatik-Sticks. Unter `Datenbank MariaDB` doppelklickst du `MySQL starten`. Warte im Konsolenfenster auf `ready for connections`; schließe es während der Arbeit nicht, sondern minimiere es bei Bedarf.",
            "Starte danach `MySQL Workbench 6.3.10` aus demselben Stick. Zu Hause kann eine andere Stick-Version, etwa Workbench 8.0.21, angeboten werden. Öffne eine vorhandene lokale Verbindung oder richte über das Pluszeichen bei `MySQL Connections` eine neue ein. Die Unterrichtsverbindung und Zugangsdaten werden mit der Lehrkraft geprüft; dein Windows-/Microsoft-365-Passwort gehört hier nicht hinein.",
            "In der gezeigten lokalen Umgebung verwendet die Verbindung `127.0.0.1` und Port `3306`. Nach `Test Connection` und dem Öffnen der Verbindung prüfst du mit `SELECT VERSION();`, ob der Server antwortet. Wenn es nicht klappt, überprüfe zuerst das laufende Konsolenfenster und die Verbindungsdaten."
          ],
          code: "SELECT VERSION();",
          tip: "Unter `Nachschlagen` findest du den bebilderten Startablauf und den offiziellen Link zur Schultasche-BW-Seite. Eine Versionswarnung in Workbench 8 bei einem MariaDB-Server bedeutet nicht automatisch, dass die Verbindung fehlgeschlagen ist."
        },
        {
          title: "Schema, Diagramm und Tabelle anlegen",
          body: [
            "Prüfe im geöffneten Entwurf das Schema `fahrschule` und die Tabelle `fahrschueler`. Fehlt deine Entwurfsdatei, erstelle ein neues Modell, benenne `mydb` per `Edit Schema...` um und lege mit `Add Diagram` die Tabelle an.",
            "Trage alle elf Attribute aus L1.2 im Tabellendialog unter `Column Name` ein und wähle unter `Datatype` die Typen. Kontrolliere `schuelernr` als PK. `NN` bedeutet NOT NULL: Für diese Spalte muss später ein Wert vorliegen. Übernimm Pflichtfelder nur dort, wo sie fachlich sinnvoll sind."
          ],
          rules: [
            "`schuelernr`: INT, PK und NN; die Nummer identifiziert jeden Fahrschüler eindeutig.",
            "`geburtsdatum`: DATE; `fahrstundenzahl`: INT; Namen und Telefonnummern: VARCHAR mit begründeter Länge.",
            "Speichere das Modell als `.mwb`-Datei und öffne es noch einmal zur Kontrolle."
          ],
          tip: "Die Workbench kann das erste Attribut automatisch als PK markieren. Prüfe trotzdem ausdrücklich, ob das bei deinem Entwurf `schuelernr` ist."
        }
      ],
      webWorksheet: {
        title: "L1.3: Mein Workbench-Modell prüfen",
        intro: "Halte deine Modellentscheidungen hier fest. Die eigentliche `.mwb`-Datei speicherst du auf dem Schul-PC oder Stick.",
        definitionTerms: [
          { id: "start-verbindung", label: "Stick und Verbindung", prompt: "Welche Workbench-Version hast du verwendet? War das Konsolenfenster bereit und hat `SELECT VERSION();` eine Serverversion angezeigt?" },
          { id: "schema", label: "Schema", prompt: "Wie heißt dein Schema? Was musstest du gegenüber `mydb` ändern?" },
          { id: "tabelle", label: "Tabelle und Schlüssel", prompt: "Wie heißt die Tabelle? Welches Attribut ist PK und warum?" },
          { id: "datentypen", label: "Datentypen", prompt: "Notiere die Typen für Geburtsdatum, Fahrstundenzahl, Telefonnummer und Nachname." },
          { id: "pflichtfelder", label: "PK und NN", prompt: "Erkläre den Unterschied und nenne bewusst gewählte Pflichtfelder." },
          { id: "dateikontrolle", label: "Gespeichertes Modell", prompt: "Wo liegt deine `.mwb`-Datei? Welche drei Dinge hast du nach erneutem Öffnen kontrolliert?" }
        ],
        hint: "Prüfe vor dem Speichern Schema `fahrschule`, Tabelle `fahrschueler`, `schuelernr` als PK und alle Datentypen."
      },
      notePrompts: [
        "Was unterscheidet die `.mwb`-Modelldatei von der später erzeugten Datenbank?",
        "Was bedeuten PK und NN in der Workbench?",
        "Wie kann ich mein Modell nach dem Speichern zuverlässig kontrollieren?"
      ],
      classroomTask: {
        tool: "Informatik-Stick und MySQL Workbench",
        title: "Fahrschule als einteilige Datenbank modellieren",
        intro: "Setze dein Relationenschema aus L1.2 in der Workbench um. Die Originalaufgabe L1_2 fordert ein gespeichertes Modell der Tabelle fahrschueler.",
        steps: [
          "Öffne das Play-Symbol `Start`, doppelklicke `MySQL starten` und warte auf `ready for connections`. Lasse das Konsolenfenster geöffnet.",
          "Starte in der Schule MySQL Workbench 6.3.10. Öffne oder teste die lokale Verbindung und führe `SELECT VERSION();` aus.",
          "Öffne L1_2_entwurf.mwb aus L1.2 und prüfe Schema fahrschule und das EER-Diagramm. Fehlt die Datei, erstelle das Modell mit Add Diagram neu.",
          "Prüfe die vorhandene Tabelle fahrschueler aus L1.2 und ergänze nur fehlende Attribute. Lege die Tabelle nur an, wenn sie im Modell fehlt. Vergleiche alle elf Attribute, Datentypen, PK und fachlich passende NN-Markierungen mit deinem Relationenschema; keine zweite fahrschueler-Tabelle anlegen.",
          "Speichere als `L1_2 Lösung fahrschule.mwb`, öffne die Datei erneut und überprüfe Schema, Tabelle und Schlüssel mit der Lehrkraft."
        ],
        evidence: "Gespeicherte und erneut geöffnete `.mwb`-Modelldatei plus ausgefülltes digitales Prüfblatt",
        fileName: "L1_2 Lösung fahrschule.mwb"
      },
      completionChecks: [
        "Ich habe den Stick gestartet, das MySQL-Konsolenfenster geöffnet gelassen und die lokale Verbindung geprüft.",
        "Mein Schema heißt fahrschule und enthält das EER-Diagramm mit fahrschueler.",
        "schuelernr ist PK; Geburtsdatum, Fahrstundenzahl und Textlängen sind passend typisiert.",
        "Ich habe die `.mwb`-Datei erneut geöffnet und mein Modell kontrolliert."
      ],
      quiz: {
        question: "Was bedeutet eine gespeicherte `.mwb`-Datei nach L1.3?",
        options: [
          "Das Datenbankmodell ist gespeichert; eine echte MySQL-Datenbank wird erst später erzeugt.",
          "Die Tabelle wurde automatisch mit allen Fahrschülern auf dem Server angelegt.",
          "Das Modell kann nicht mehr geändert werden."
        ],
        correct: 0,
        explanation: "Workbench speichert das Modell als Datei. Erst ein späterer Umsetzungsschritt erzeugt das Schema auf dem Datenbankserver."
      }
    },
    "workbench-workflow": {
      courseCode: "L1.4",
      module: "lernfortschritt-1",
      title: "Datenbank erzeugen und Daten importieren",
      subtitle: "Aus dem gespeicherten Workbench-Modell wird ein Schema auf dem MySQL-Server; ein SQL-Skript füllt die Tabelle mit Übungsdaten.",
      duration: 55,
      workflow: ["Dienst und Modell", "Schema erzeugen", "Daten importieren", "Ergebnis prüfen"],
      workflowHints: ["MySQL vor Workbench starten", "Synchronize Model ausführen", "SQL-Skript einmal ausführen", "SELECT und Lehrkraftkontrolle"],
      sourceMaterials: ["L1_3 Information Datenbank generieren", "L1_3 Aufgabe Datenbank generieren", "L1_4 Information Daten importieren", "L1_4 Aufgabe Daten importieren"],
      objectives: [
        "Modelldatei und tatsächlich erzeugte Datenbank unterscheiden",
        "das Modell über eine Workbench-Verbindung in ein MySQL-Schema übertragen",
        "ein INSERT-Skript ausführen und die eingefügten Datensätze mit SELECT kontrollieren"
      ],
      sections: [
        {
          title: "Eine Modelldatei ist noch keine Datenbank",
          body: [
            "In L1.3 hast du ein EER-Modell als `.mwb` gespeichert. Diese Datei beschreibt nur die Struktur. Damit Datensätze gespeichert werden können, muss das Schema `fahrschule` mit der Tabelle `fahrschueler` auf dem laufenden MySQL-Server angelegt werden.",
            "Starte am Informatik-Stick zuerst `MySQL starten` und lass den Dienst geöffnet. Öffne anschließend MySQL Workbench und verbinde dich mit dem lokalen Server. Lade dein Modell über `File > Open Model...`."
          ],
          definitions: [
            { term: "Modell", definition: "Entwurf der Datenbankstruktur in der `.mwb`-Datei; noch keine Datenbank auf dem Server." },
            { term: "Schema", definition: "Benannter Bereich auf dem MySQL-Server, hier `fahrschule`, der die Tabelle enthält." },
            { term: "Synchronisieren", definition: "Die Workbench vergleicht Modell und Server und erzeugt die für die Übertragung nötigen SQL-Befehle." }
          ]
        },
        {
          title: "Schema aus dem Modell erzeugen",
          body: [
            "Wähle im geöffneten Modell `Database > Synchronize Model...`. Kontrolliere die ausgewählte lokale Verbindung und lies die angezeigten Änderungen, bevor du sie ausführst. In einer leeren Unterrichtsdatenbank entstehen daraus das Schema und die Tabelle.",
            "Öffne danach die Verbindung. Fehlt `fahrschule` links unter SCHEMAS, wähle `Refresh All`. Klappe das Schema und `Tables` auf und kontrolliere, ob `fahrschueler` mit `schuelernr` als Primärschlüssel vorhanden ist."
          ],
          code: "CREATE DATABASE IF NOT EXISTS fahrschule;\nUSE fahrschule;\n-- Workbench erzeugt die CREATE-TABLE-Anweisung aus deinem Modell.",
          warning: "Synchronisiere nur dein Unterrichtsschema. Prüfe Vorschau und Zielverbindung; bestätige keine DROP-Anweisungen für vorhandene Daten."
        },
        {
          title: "Beispieldaten einfügen und kontrollieren",
          body: [
            "Eine neu erzeugte Tabelle ist noch leer. Lade das verlinkte Übungsskript mit fiktiven Datensätzen herunter und öffne es in Workbench über `File > Open SQL Script...`. Prüfe vor dem Blitzsymbol das Ziel `fahrschule`, den Tabellennamen und die elf Spalten aus L1.2. Führe das INSERT-Skript nur einmal aus.",
            "Kontrolliere danach mit `SELECT * FROM fahrschueler;` die Zeilen. Das Sternchen bedeutet alle Spalten. `SELECT COUNT(*) FROM fahrschueler;` zeigt die Anzahl. Jeder SQL-Befehl endet mit einem Semikolon. Wenn die Tabelle noch nicht existiert oder eine Spalte anders heißt, korrigiere zuerst dein Modell statt die Daten blind zu importieren."
          ],
          code: "USE fahrschule;\nSELECT * FROM fahrschueler;\nSELECT COUNT(*) FROM fahrschueler;",
          tip: "Das Übungsskript ergänzt nur Daten und enthält absichtlich weder DROP noch CREATE TABLE. Die Originaldateien bleiben im lokalen Ressourcenordner."
        }
      ],
      webWorksheet: {
        title: "L1.4: Erzeugung und Import nachweisen",
        intro: "Notiere, was du am Schul-PC tatsächlich durchgeführt und geprüft hast. Die Antworten werden lokal gespeichert.",
        definitionTerms: [
          { id: "unterschied", label: "Modell und Server", prompt: "Was ist nach L1.3 vorhanden und was entsteht erst durch die Synchronisierung?" },
          { id: "verbindung", label: "Verbindung", prompt: "Welche Verbindung und welches Ziel-Schema hast du vor der Synchronisierung geprüft?" },
          { id: "struktur", label: "Strukturkontrolle", prompt: "Wo findest du in Workbench die erzeugte Tabelle und woran erkennst du den Primärschlüssel?" },
          { id: "import", label: "Import", prompt: "Welches Skript hast du ausgeführt und wie viele Übungsdatensätze wurden eingefügt?" },
          { id: "select", label: "SELECT-Kontrolle", prompt: "Notiere deine Kontrollabfrage und beschreibe das Ergebnis." }
        ],
        hint: "Sichere die `.mwb`-Datei getrennt vom Browser-Lernstand. Ein JSON-Export der Homepage enthält keine MySQL-Datenbank."
      },
      notePrompts: [
        "Worin unterscheiden sich `.mwb`-Modell und Datenbank auf dem Server?",
        "Was tun, wenn ein Schema nach der Synchronisierung nicht sichtbar ist?",
        "Wie prüfe ich, ob der Import tatsächlich geklappt hat?"
      ],
      classroomTask: {
        tool: "Informatik-Stick und MySQL Workbench",
        title: "Fahrschule auf dem Server anlegen und mit Testdaten füllen",
        intro: "Arbeite zuerst die Originalaufgabe L1_3 (Datenbank generieren), dann L1_4 (Daten importieren) ab. Das bereitgestellte Übungsskript enthält nur fiktive Datensätze.",
        steps: [
          "Starte am Informatik-Stick `MySQL starten`, öffne Workbench und verbinde dich mit dem lokalen Server.",
          "Öffne dein `.mwb`-Modell und übertrage es mit `Database > Synchronize Model...`; prüfe vorher die Vorschau auf unbeabsichtigte Löschungen.",
          "Aktualisiere SCHEMAS und kontrolliere `fahrschule > Tables > fahrschueler` samt Primärschlüssel.",
          "Öffne das Übungsskript über `File > Open SQL Script...` und führe es genau einmal aus.",
          "Prüfe mit `SELECT * FROM fahrschueler;` und `SELECT COUNT(*) FROM fahrschueler;` die importierten Zeilen."
        ],
        evidence: "Sichtbares Schema mit Tabelle, ausgefülltes digitales Prüfblatt und erfolgreiches SELECT-Ergebnis",
        download: { href: "assets/sql/l1-4-fahrschule-beispieldaten.sql", label: "Übungsskript herunterladen" }
      },
      completionChecks: [
        "Ich habe MySQL vor MySQL Workbench gestartet und die Zielverbindung kontrolliert.",
        "Schema und Tabelle wurden aus meinem Modell erzeugt; ich habe die Struktur in SCHEMAS überprüft.",
        "Ich habe das Übungsskript einmal ausgeführt und die importierten Daten mit SELECT kontrolliert."
      ],
      quiz: {
        question: "Was ist nach dem Speichern eines `.mwb`-Modells und vor dem Datenimport erforderlich?",
        options: [
          "Das Modell mit der richtigen Serververbindung synchronisieren und die erzeugte Tabelle prüfen.",
          "Nur die `.mwb`-Datei umbenennen; damit sind Schema und Daten bereits auf dem Server.",
          "Zuerst das INSERT-Skript ausführen und erst danach MySQL starten."
        ],
        correct: 0,
        explanation: "Erst die Übertragung des Modells erzeugt die Tabellenstruktur auf dem Server. Danach können INSERT-Anweisungen Daten einfügen."
      }
    },
    "select-projektion": {
      courseCode: "L1.5",
      module: "lernfortschritt-1",
      title: "SELECT, Projektion und Sortierung",
      subtitle: "Mit SELECT bestimmst du die Ausgabespalten; ORDER BY ordnet die Ergebnisse nach einem oder mehreren Kriterien.",
      duration: 55,
      workflow: ["Syntax verstehen", "Drei Abfragen", "Ergebnisse prüfen", "Abschließen"],
      workflowHints: ["SELECT, FROM, ORDER BY", "Aufgabenblatt ausfüllen", "Workbench und Browserlabor", "Lehrkraft bestätigt"],
      sourceMaterials: ["L1_5.1 Information Datenbankabfrage Projektion", "L1_5.1 Aufgabe Datenbankabfrage Projektion", "L1_5.2 Vertiefungsaufgabe Projektion"],
      objectives: [
        "Projektion als Auswahl von Attributen aus einer Tabelle erklären",
        "SELECT und FROM für exakt geforderte Ausgabespalten formulieren",
        "mit ORDER BY auf- und absteigend sowie nach zwei Kriterien sortieren"
      ],
      sections: [
        {
          title: "Nicht alle Spalten werden gebraucht",
          body: [
            "Eine Abfrage liest Daten, ohne die Tabelle zu verändern. Hinter `SELECT` stehen die Attributnamen der gewünschten Ausgabespalten, hinter `FROM` der Tabellenname. Diese Auswahl von Spalten heißt Projektion. `SELECT *` gibt dagegen alle Spalten aus.",
            "Schreibe SQL-Schlüsselwörter zur besseren Lesbarkeit groß. SQL unterscheidet bei diesen Schlüsselwörtern nicht zwischen Groß- und Kleinschreibung. Schließe den Befehl mit einem Semikolon ab."
          ],
          code: "SELECT schuelernr, vorname, nachname\nFROM fahrschueler;",
          definitions: [
            { term: "SELECT", definition: "Nennt die Attribute, die in der Ergebnistabelle erscheinen sollen." },
            { term: "FROM", definition: "Nennt die Tabelle, aus der die Werte gelesen werden." },
            { term: "Projektion", definition: "Auswahl der Ausgabespalten; sie filtert keine Datensätze nach einer Bedingung." }
          ]
        },
        {
          title: "Die Ausgabe gezielt ordnen",
          body: [
            "`ORDER BY nachname` sortiert standardmäßig aufsteigend (`ASC`). Mit `DESC` wird absteigend sortiert. Wenn du mehrere Sortierkriterien nennst, entscheidet das zweite bei gleichen Werten des ersten.",
            "Im Fahrschulbeispiel kann ein Nachname mehrfach vorkommen. `ORDER BY nachname, vorname` legt für solche Gleichstände eine sinnvolle Reihenfolge fest. Die Sortierung ändert nur das Abfrageergebnis, nicht die gespeicherten Datensätze."
          ],
          code: "SELECT schuelernr, vorname, nachname\nFROM fahrschueler\nORDER BY nachname ASC, vorname ASC;",
          rules: [
            "Die Reihenfolge hinter `SELECT` bestimmt die Spaltenreihenfolge im Ergebnis.",
            "Die Reihenfolge hinter `ORDER BY` bestimmt die Sortierpriorität.",
            "`ASC` ist aufsteigend und kann weggelassen werden; `DESC` ist absteigend."
          ]
        },
        {
          title: "Die drei Aufträge aus dem Material",
          body: [
            "Bearbeite zuerst die Schülerliste alphabetisch nach Nachname. Gib danach zusätzlich den Wohnort aus und sortiere absteigend nach Ort. Zum Schluss sortiere bei gleichen Nachnamen zusätzlich nach Vorname.",
            "Teste jede Abfrage im SQL-Editor der MySQL Workbench und in der passenden Browserübung. Die Browserübungen nutzen eine eigene kleine SQLite-Testdatenbank; sie greifen nicht auf deinen MySQL-Server zu. Ergebnisse können deshalb andere Namen und Zeilenzahlen enthalten."
          ],
          warning: "Für die zweite Aufgabe muss dein Workbench-Modell das Attribut `ort` enthalten. Wenn es fehlt, ergänze zunächst das Modell und synchronisiere die Änderung kontrolliert."
        }
      ],
      webWorksheet: {
        title: "L1.5: Projektion und Sortierung formulieren",
        intro: "Schreibe die Erklärung und drei SQL-Befehle selbst. Speichere deine Ergebnisse zusätzlich als SQL-Datei in MySQL Workbench.",
        definitionTerms: [
          { id: "projektion", label: "1 · Projektion", prompt: "Erkläre in eigenen Worten, was bei einer Projektion ausgewählt wird." },
          { id: "aufgabe-2", label: "2 · Schülerliste", prompt: "Schreibe SQL für schuelernr, vorname, nachname; alphabetisch nach Nachname." },
          { id: "aufgabe-3", label: "3 · Wohnort", prompt: "Schreibe SQL für schuelernr, vorname, nachname, ort; sortiere nach Ort absteigend." },
          { id: "aufgabe-4", label: "4 · Gleichstand", prompt: "Schreibe SQL für schuelernr, vorname, nachname; zuerst nach Nachname, dann nach Vorname." }
        ],
        hint: "Kontrolliere bei jeder Abfrage die Spaltenliste, `FROM fahrschueler`, die Reihenfolge in `ORDER BY` und das Semikolon."
      },
      notePrompts: [
        "Was ist der Unterschied zwischen Spaltenauswahl und Zeilenfilter?",
        "Wann brauche ich `DESC`?",
        "Warum kann ein zweites Sortierkriterium wichtig sein?"
      ],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Drei Fahrschülerlisten mit SELECT erstellen",
        intro: "Bearbeite die drei SQL-Aufträge aus L1_5.1. Nutze deine Tabelle aus L1.4 und prüfe jede Ausgabe in der Workbench.",
        steps: [
          "Erkläre Projektion in eigenen Worten und formuliere eine Schülerliste mit `schuelernr`, `vorname`, `nachname`, sortiert nach Nachname.",
          "Ergänze bei der zweiten Abfrage `ort` und sortiere nach `ort DESC`.",
          "Gib für die dritte Abfrage wieder Nummer und Namen aus. Sortiere nach `nachname`, bei Gleichstand nach `vorname`.",
          "Führe alle drei Abfragen aus, vergleiche die Ergebnistabellen und halte SQL und kurze Beobachtungen in deinem digitalen Aufgabenblatt fest."
        ],
        evidence: "Drei ausgeführte SQL-Abfragen, ausgefülltes digitales Blatt und geprüfte Ergebnistabellen",
        fileName: "L1_5_projektion.sql"
      },
      completionChecks: [
        "Ich kann Projektion in eigenen Worten erklären.",
        "Meine drei Abfragen wählen genau die geforderten Spalten und sortieren passend.",
        "Ich habe die Ergebnisse in Workbench und in den Browserübungen kontrolliert."
      ],
      quiz: {
        question: "Wie sortierst du bei gleichem Nachnamen zusätzlich nach Vorname?",
        options: [
          "ORDER BY nachname, vorname",
          "ORDER BY vorname, nachname",
          "WHERE nachname, vorname"
        ],
        correct: 0,
        explanation: "ORDER BY prüft die Kriterien von links nach rechts: zuerst Nachname, bei Gleichstand Vorname."
      }
    },
    "where-sortierung": {
      courseCode: "L1.6",
      module: "lernfortschritt-1",
      title: "Selektion mit WHERE",
      subtitle: "Mit Bedingungen wählst du passende Datensätze aus; Text-, Zahlen- und Datumsvergleiche erfordern unterschiedliche Schreibweisen.",
      duration: 90,
      workflow: ["WHERE verstehen", "Bedingungen formulieren", "Abfragen testen", "Abschließen"],
      workflowHints: ["Operatoren und Datentypen", "Originalaufgaben 2 bis 12", "Workbench und Browserlabor", "Lehrkraft bestätigt"],
      sourceMaterials: ["L1_5.3 Information Datenbankabfrage Selektion", "L1_5.3 Aufgabe Datenbankabfrage Selektion", "L1_5.4 Vertiefungsaufgabe Selektion"],
      objectives: [
        "Selektion als Auswahl von Datensätzen gegenüber Projektion abgrenzen",
        "Text-, Zahlen- und Datumswerte in WHERE-Bedingungen korrekt vergleichen",
        "LIKE, AND, OR, NOT und BETWEEN passend zu einem Arbeitsauftrag einsetzen"
      ],
      sections: [
        {
          title: "Welche Zeilen sollen erscheinen?",
          body: [
            "In L1.5 hast du mit SELECT die Ausgabespalten gewählt. `WHERE` entscheidet dagegen, welche Zeilen die Bedingung erfüllen. Diese Zeilenauswahl heißt Selektion. Beide können in derselben Abfrage vorkommen.",
            "Eine einfache Bedingung besteht aus Attributname, Vergleichsoperator und Vergleichswert. Text steht in einfachen Anführungszeichen; Zahlen stehen ohne Anführungszeichen. `SELECT *` ist passend, wenn ausdrücklich alle Informationen verlangt sind."
          ],
          code: "SELECT *\nFROM fahrschueler\nWHERE ort = 'Schorndorf';",
          definitions: [
            { term: "Selektion", definition: "Auswahl der Datensätze, deren Werte die WHERE-Bedingung erfüllen." },
            { term: "Vergleich", definition: "Attributname, Operator und Wert, zum Beispiel `nachname = 'Dressel'`." },
            { term: "Operatoren", definition: "`=`, `<>`, `<`, `>`, `<=` und `>=` vergleichen Werte; der Datentyp beeinflusst die Schreibweise." }
          ]
        },
        {
          title: "Zahl, Datum und Textmuster",
          body: [
            "`fahrstundenzahl > 20` vergleicht eine Zahl. Ein Datum wird als Textliteral im Format `'JJJJ-MM-TT'` geschrieben, zum Beispiel `geburtsdatum < '2001-01-01'`. `ORDER BY` folgt erst nach `WHERE` und ordnet nur das Ergebnis.",
            "Mit `LIKE 'D%'` findest du Text, der mit D beginnt. `%` steht für beliebig viele Zeichen, `_` für genau ein Zeichen. Ein Datumsbereich mit `BETWEEN` enthält beide angegebenen Grenzwerte."
          ],
          code: "SELECT *\nFROM fahrschueler\nWHERE geburtsdatum BETWEEN '2000-01-01' AND '2001-12-31'\nORDER BY geburtsdatum DESC;",
          warning: "Datumsliterale müssen gültige Kalenderdaten sein. In einer Vorlage steht ein fehlerhaftes Beispiel; verwende für deine Abfragen echte Daten wie `'2001-12-31'`."
        },
        {
          title: "Bedingungen verknüpfen",
          body: [
            "`AND` verlangt, dass beide Bedingungen stimmen. `OR` lässt Datensätze zu, wenn mindestens eine Bedingung stimmt. `NOT` kehrt eine Bedingung um. Setze Klammern, wenn du AND und OR mischst, damit die fachliche Aussage eindeutig bleibt.",
            "Das fiktive L1.4-Importscript enthält bewusst Beispiele für die Suchfälle aus dem Aufgabenblatt: Schorndorf, Dressel, Drosselweg, mehrere Geburtsjahre und mehr als 20 Fahrstunden. Die Browserübungen verwenden eine getrennte Testtabelle mit anderen Namen und Jahren."
          ],
          code: "SELECT *\nFROM fahrschueler\nWHERE ort = 'Schorndorf' AND strasse = 'Drosselweg';\n\nSELECT *\nFROM fahrschueler\nWHERE geburtsdatum < '2000-01-01'\n   OR geburtsdatum > '2001-12-31';",
          tip: "Lies eine Bedingung zuerst als deutschen Satz und prüfe danach an mindestens zwei Datensätzen, ob sie genau die gewünschten Zeilen liefert."
        }
      ],
      webWorksheet: {
        title: "L1.6: Auswahlbedingungen formulieren",
        intro: "Die Nummern entsprechen dem Originalaufgabenblatt L1_5.3. Schreibe jeweils einen vollständigen SQL-Befehl und teste ihn in MySQL Workbench.",
        definitionGroups: [
          { label: "Begriff und Namen · 1–4", open: true, ids: ["selektion", "ort", "dressel", "dressel-sortiert"] },
          { label: "Zahlen und Datum · 5–7", ids: ["stunden", "vor-2001", "vor-2001-sortiert"] },
          { label: "Bedingungen verbinden · 8–12", ids: ["anfang-d", "strasse", "zeitraum", "ausserhalb", "nicht-ort"] }
        ],
        definitionTerms: [
          { id: "selektion", label: "1 · Begriff", prompt: "Erkläre Selektion und den Unterschied zur Projektion." },
          { id: "ort", label: "2 · Ort", prompt: "Alle Informationen zu Fahrschülern aus Schorndorf." },
          { id: "dressel", label: "3 · Nachname", prompt: "Vorname, Nachname und Geburtsdatum für Nachname Dressel." },
          { id: "dressel-sortiert", label: "4 · Sortierter Name", prompt: "Wie 3, aber alphabetisch nach Vorname sortiert." },
          { id: "stunden", label: "5 · Mehr als 20", prompt: "Alle Informationen zu Fahrschülern mit mehr als 20 Fahrstunden." },
          { id: "vor-2001", label: "6 · Vor 2001", prompt: "Alle Informationen zu vor 2001 Geborenen." },
          { id: "vor-2001-sortiert", label: "7 · Datum absteigend", prompt: "Wie 6, aber nach Geburtsdatum absteigend sortiert." },
          { id: "anfang-d", label: "8 · Namensanfang", prompt: "Alle Informationen zu Nachnamen, die mit D beginnen." },
          { id: "strasse", label: "9 · Ort und Straße", prompt: "Alle Informationen zu Schorndorf und Drosselweg zugleich." },
          { id: "zeitraum", label: "10 · Zeitraum", prompt: "Alle Informationen zu Geburten vom 01.01.2000 bis 31.12.2001 einschließlich." },
          { id: "ausserhalb", label: "11 · Außerhalb", prompt: "Alle Informationen zu Geburten vor 01.01.2000 oder nach 31.12.2001." },
          { id: "nicht-ort", label: "12 · Nicht Schorndorf", prompt: "Alle Informationen zu Fahrschülern, die nicht in Schorndorf wohnen." }
        ],
        hint: "Kontrolliere bei jeder Antwort Spaltenauswahl, WHERE-Bedingung, Anführungszeichen, ORDER BY und Semikolon. Das fiktive L1.4-Skript liefert passende Testfälle."
      },
      notePrompts: [
        "Woran erkenne ich, ob Projektion oder Selektion gefragt ist?",
        "Wie unterscheiden sich Text-, Zahlen- und Datumsvergleiche?",
        "Wann benötige ich AND, OR, NOT oder BETWEEN?"
      ],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Elf Fahrschul-Abfragen mit WHERE prüfen",
        intro: "Bearbeite die Aufgaben 2 bis 12 aus L1_5.3 auf dem fiktiven Fahrschul-Datensatz. Nutze das digitale Blatt für deine Befehle und notiere auffällige Ergebnisse.",
        steps: [
          "Starte mit Gleichheit: Schorndorf und Dressel, anschließend Dressel nach Vorname sortiert.",
          "Prüfe Zahlen- und Datumsvergleiche: mehr als 20 Fahrstunden, vor 2001 geboren, dann nach Geburtsdatum absteigend.",
          "Verwende `LIKE 'D%'`, kombiniere Ort und Straße mit AND und prüfe den inklusiven Datumsbereich mit BETWEEN.",
          "Formuliere die zwei Negativfälle: außerhalb des Zeitraums mit OR und nicht Schorndorf mit NOT oder `<>`."
        ],
        evidence: "Elf ausgeführte SQL-Befehle, digitales Aufgabenblatt und begründete Ergebniskontrolle",
        fileName: "L1_5_selektion.sql"
      },
      completionChecks: [
        "Ich kann Selektion von Projektion unterscheiden und die drei Teile einer WHERE-Bedingung benennen.",
        "Ich habe die Aufgaben 2 bis 12 im digitalen Blatt formuliert und in Workbench geprüft.",
        "Ich habe AND, OR, NOT und BETWEEN an passenden Beispielen kontrolliert."
      ],
      quiz: {
        question: "Welche Bedingung findet Fahrschüler aus Schorndorf im Drosselweg?",
        options: [
          "WHERE ort = 'Schorndorf' AND strasse = 'Drosselweg'",
          "WHERE ort = 'Schorndorf' OR strasse = 'Drosselweg'",
          "ORDER BY ort, strasse"
        ],
        correct: 0,
        explanation: "AND verlangt, dass Ort und Straße bei demselben Datensatz passen."
      }
    },
    "sql-muster": {
      courseCode: "L1.7",
      module: "lernfortschritt-1",
      title: "Redundanzen im Abfrageergebnis vermeiden",
      subtitle: "Mit DISTINCT erscheint jeder ausgewählte Wert oder jede ausgewählte Wertekombination nur einmal.",
      duration: 45,
      workflow: ["Ergebnis vergleichen", "DISTINCT verstehen", "Vier Aufträge", "Abschließen"],
      workflowHints: ["Doppelte Zeilen erkennen", "Eine oder mehrere Spalten", "Workbench und Browserlabor", "Lehrkraft bestätigt"],
      sourceMaterials: ["L1_5.7 Information Redundanzen in Abfrageergebnissen", "L1_5.7 Aufgabe Redundanzen in Abfrageergebnissen"],
      objectives: [
        "Wiederholungen im Abfrageergebnis von doppelten gespeicherten Datensätzen unterscheiden",
        "DISTINCT unmittelbar nach SELECT einsetzen",
        "erklären, warum bei mehreren Spalten die gesamte Wertekombination zählt"
      ],
      sections: [
        {
          title: "Warum erscheinen Orte mehrfach?",
          body: [
            "Die Tabelle `fahrschueler` enthält für jeden Fahrschüler eine Zeile. Wohnen mehrere Personen am selben Ort, zeigt `SELECT ort, plz` diese Ortsangabe mehrfach. Das ist für eine Personenliste richtig, für eine Liste der vorkommenden Orte aber unnötig.",
            "Die Wiederholung entsteht hier im Abfrageergebnis. Sie bedeutet nicht automatisch, dass doppelte Fahrschüler gespeichert wurden. Formuliere deshalb zuerst, welche Ausgabe der Auftrag wirklich verlangt."
          ],
          code: "SELECT ort, plz\nFROM fahrschueler;",
          definitions: [
            { term: "Redundanz im Ergebnis", definition: "Dieselbe angezeigte Information kommt in mehreren Ergebniszeilen vor." },
            { term: "DISTINCT", definition: "Entfernt Wiederholungen aus dem Ergebnis einer SELECT-Abfrage; die Tabelle bleibt unverändert." }
          ]
        },
        {
          title: "Einmalige Werte und Wertekombinationen",
          body: [
            "Setze `DISTINCT` direkt hinter `SELECT`. Bei einer Spalte erscheint jeder Wert nur einmal. Bei `ort, plz` zählt die gesamte Kombination: Gleicher Ort mit unterschiedlicher PLZ kann weiterhin in zwei Zeilen stehen.",
            "`ORDER BY` ist optional und ordnet nur die Ausgabe. Vergleiche die Ergebnisse mit und ohne `DISTINCT` und nenne die Anzahl der Zeilen. Wenn in einem Datensatz keine Wiederholung vorkommt, bleibt die Zeilenzahl trotz korrekt eingesetztem `DISTINCT` gleich."
          ],
          code: "SELECT DISTINCT ort, plz\nFROM fahrschueler\nORDER BY ort, plz;",
          rules: [
            "`DISTINCT` steht einmal direkt nach `SELECT`, nicht vor jeder Spalte.",
            "Wähle nur die Spalten aus, deren Kombination einmalig sein soll.",
            "`DISTINCT` ändert keine Daten in der Ausgangstabelle."
          ]
        }
      ],
      webWorksheet: {
        title: "L1.7: Vier Listen ohne Wiederholung",
        intro: "Bearbeite die vier Aufträge aus L1_5.7. Schreibe vollständige SQL-Befehle und prüfe die Ausgaben in MySQL Workbench.",
        definitionTerms: [
          { id: "orte", label: "1 · Orte und PLZ", prompt: "Gib alle Kombinationen aus Ort und Postleitzahl der Fahrschüler aus. Gleiche Kombinationen sollen nur einmal erscheinen." },
          { id: "vornamen", label: "2 · Vornamen", prompt: "Gib jeden vorkommenden Vornamen nur einmal aus." },
          { id: "nachnamen", label: "3 · Nachnamen", prompt: "Gib jeden vorkommenden Nachnamen nur einmal aus." },
          { id: "fahrstunden", label: "4 · Fahrstundenzahlen", prompt: "Gib jede vorkommende Fahrstundenzahl nur einmal aus. Nutze im MySQL-Modell das Attribut `fahrstundenzahl`." }
        ],
        hint: "Für Aufgabe 1 zählt die Kombination `ort, plz`; für 2 bis 4 jeweils eine Spalte. Im Browserlabor heißt die letzte Spalte der separaten Testtabelle `fahrstunden`."
      },
      notePrompts: [
        "Warum kann ein Ort mehrfach im Ergebnis erscheinen, obwohl kein Datensatz doppelt ist?",
        "Was zählt bei DISTINCT mit zwei Spalten als Wiederholung?",
        "Wann wäre SELECT DISTINCT * hier keine gute Antwort?"
      ],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Vier einmalige Fahrschul-Listen erstellen",
        intro: "Bearbeite die vier Originalaufträge aus L1_5.7. Teste erst eine Liste ohne DISTINCT und anschließend mit DISTINCT.",
        steps: [
          "Erstelle die Liste aller Kombinationen aus Ort und Postleitzahl ohne Wiederholung.",
          "Gib jeden vorkommenden Vornamen genau einmal aus.",
          "Gib jeden vorkommenden Nachnamen genau einmal aus.",
          "Gib jede vorkommende Fahrstundenzahl genau einmal aus und notiere, was DISTINCT im Vergleich zur ursprünglichen Ausgabe geändert hat."
        ],
        evidence: "Vier ausgeführte DISTINCT-Abfragen, ausgefülltes Aufgabenblatt und Vergleich der Zeilenzahlen",
        fileName: "L1_5_7_distinct.sql"
      },
      completionChecks: [
        "Ich kann Wiederholungen im Abfrageergebnis erklären.",
        "Ich habe alle vier Originalaufträge mit DISTINCT in Workbench geprüft.",
        "Ich kann erklären, warum bei ort und plz die Kombination zählt."
      ],
      quiz: {
        question: "Welche Zeilen entfernt SELECT DISTINCT ort, plz aus dem Ergebnis?",
        options: [
          "Nur Zeilen, bei denen sowohl ort als auch plz gleich sind.",
          "Alle Zeilen mit gleichem ort, unabhängig von plz.",
          "Die entsprechenden Datensätze dauerhaft aus der Tabelle."
        ],
        correct: 0,
        explanation: "DISTINCT vergleicht die gesamte ausgewählte Kombination und verändert keine gespeicherten Datensätze."
      }
    },
    "funktionen-gruppierung": {
      courseCode: "L1.8",
      module: "lernfortschritt-1",
      duration: 90,
      subtitle: "Kennzahlen berechnen, Ergebniszeilen formatieren und Daten mit GROUP BY, WHERE und HAVING gezielt auswerten.",
      workflow: ["Funktionen verstehen", "Sechs Kennzahlen", "Acht Gruppenaufträge", "Abschließen"],
      workflowHints: ["Einzelzeile oder Zusammenfassung?", "Workbench und Plausibilität", "WHERE von HAVING trennen", "Lehrkraft bestätigt"],
      sourceMaterials: ["L1_5.5 Information Datenbankabfrage Funktionen", "L1_5.5 Aufgabe Datenbankabfrage Funktionen", "L1_5.8 Information Datenbankabfrage Gruppierung", "L1_5.8 Aufgabe Datenbankabfrage Gruppierung"],
      objectives: [
        "COUNT, MIN, MAX, AVG und SUM passend zur Frage auswählen",
        "Umsatz je Person von einer Gesamtsumme unterscheiden und Ausgaben formatieren",
        "Gruppen bilden und zwischen Zeilenfilter WHERE und Gruppenfilter HAVING unterscheiden",
        "Kennzahlen von Hand prüfen und Ergebnisreihenfolgen mit ORDER BY festlegen"
      ],
      sections: [
        {
          title: "Eine Kennzahl statt vieler Zeilen",
          body: [
            "Eine Aggregatfunktion fasst mehrere Werte zu einer Kennzahl zusammen. Ohne GROUP BY entsteht bei einer reinen Aggregatabfrage eine Ergebniszeile für die ausgewählten Datensätze. MIN und MAX liefern den kleinsten bzw. größten Wert, AVG den Durchschnitt und SUM die Summe.",
            "COUNT(*) zählt alle ausgewählten Zeilen. COUNT(attribut) zählt nur Zeilen mit einem Wert ungleich NULL in diesem Attribut. Eine gespeicherte 0 zählt mit; NULL steht für einen fehlenden Wert. COUNT(schuelernr) zählt hier wie COUNT(*), weil der Primärschlüssel nicht NULL sein darf."
          ],
          code: "SELECT MIN(fahrstundenzahl) AS minimum\nFROM fahrschueler;",
          definitions: [
            { term: "Aggregatfunktion", definition: "Verdichtet mehrere Eingabewerte zu einer Kennzahl pro ausgewählter Datenmenge oder Gruppe." },
            { term: "Alias mit AS", definition: "Ein verständlicher Name für eine Ergebnisspalte; die gespeicherte Tabelle wird dadurch nicht umbenannt." }
          ]
        },
        {
          title: "Rechnen und darstellen sind unterschiedliche Aufgaben",
          body: [
            "Eine Berechnung hinter SELECT erzeugt eine Ergebnisspalte, ohne gespeicherte Werte zu ändern. Ein Preis pro Fahrstunde führt bei der Multiplikation mit fahrstundenzahl zu einem Betrag je Fahrschüler. Für einen Gesamtbetrag muss dagegen über alle passenden Zeilen zusammengefasst werden.",
            "FORMAT(zahl, 2) stellt eine Zahl in MySQL mit zwei Dezimalstellen dar und liefert Text. ROUND(zahl, 2) rundet einen Zahlenwert; die Anzeige muss dabei keine abschließenden Nullen zeigen. Rechne und filtere möglichst mit Zahlen und formatiere erst die Ausgabe. In den Aufgaben gilt der vorgegebene Preis von 30 Euro je Fahrstunde."
          ],
          code: "SELECT FORMAT(17.896578, 2) AS anzeige;",
          tip: "Nutze in deinem Workbench-Modell fahrstundenzahl. Einige Originalbeispiele nennen fahrstundenanzahl; die separate Browser-Testtabelle verwendet fahrstunden. FORMAT wird hier in Workbench geprüft."
        },
        {
          title: "Eine Ergebniszeile je Gruppe",
          body: [
            "GROUP BY ort fasst Zeilen mit demselben Wohnort zusammen. Eine Aggregatfunktion wird dann für jede Gruppe getrennt berechnet. In dieser Einheit stehen neben den Aggregaten nur die Gruppierungsattribute im SELECT-Teil.",
            "Die Gruppierung garantiert keine sortierte Ausgabe. Ergänze ORDER BY, wenn eine bestimmte Reihenfolge benötigt wird. Das gilt unabhängig von der Workbench-Version; entscheidend ist der verbundene Datenbankserver."
          ],
          code: "SELECT ort, MIN(fahrstundenzahl) AS minimum\nFROM fahrschueler\nGROUP BY ort\nORDER BY ort;"
        },
        {
          title: "WHERE vor der Gruppierung, HAVING danach",
          body: [
            "WHERE entscheidet zuerst, welche einzelnen Datensätze berücksichtigt werden. Anschließend bildet GROUP BY Gruppen, und HAVING entscheidet, welche fertigen Gruppen im Ergebnis bleiben. Eine PLZ-Bedingung betrifft eine einzelne Zeile; eine Bedingung auf COUNT(*) oder SUM(...) betrifft die Gruppe.",
            "Die Reihenfolge der Klauseln im SQL-Befehl lautet SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY. Nicht jeder Befehl benötigt jede Klausel. Prüfe genau, ob eine Grenze inklusive ist: mehr als zwei bedeutet > 2, mindestens zwei bedeutet >= 2."
          ],
          code: "SELECT ort, MIN(fahrstundenzahl) AS minimum\nFROM fahrschueler\nWHERE fahrstundenzahl >= 0\nGROUP BY ort\nHAVING MIN(fahrstundenzahl) < 5\nORDER BY ort;",
          tip: "Eine leere Ausgabe kann richtig sein. Prüfe dann, ob deine Testdaten die verlangten Orte, PLZ oder Grenzwerte überhaupt enthalten."
        }
      ],
      webWorksheet: {
        title: "L1.8: Funktionen und Gruppierung",
        answerPlaceholder: "SQL-Befehl und kurze Ergebniskontrolle ...",
        intro: "Bearbeite die sechs Funktionsaufträge (F1–F6) und die acht Gruppierungsaufträge (G1–G8). Notiere jeweils den vollständigen SQL-Befehl und eine kurze Ergebniskontrolle. Verwende dein Workbench-Modell mit fahrstundenzahl.",
        definitionGroups: [
          { label: "Zählen und berechnen · F1–F4", open: true, ids: ["f1-anzahl", "f2-maximum", "f3-durchschnitt", "f4-summe"] },
          { label: "Umsatz berechnen · F5–F6", ids: ["f5-umsatz-person", "f6-umsatz-gesamt"] },
          { label: "Nach Ort gruppieren · G1–G4", ids: ["g1-anzahl-ort", "g2-summe-ort", "g3-zwei-orte", "g4-stunden-zwei-orte"] },
          { label: "Gruppen filtern · G5–G8", ids: ["g5-wenige-stunden", "g6-plz", "g7-mehr-als-zwei", "g8-mehr-als-zwanzig"] }
        ],
        definitionTerms: [
          { id: "f1-anzahl", label: "F1 · Anzahl", prompt: "Ermittle die Anzahl aller Fahrschüler." },
          { id: "f2-maximum", label: "F2 · Höchste Stundenzahl", prompt: "Ermittle die größte Fahrstundenzahl eines Fahrschülers." },
          { id: "f3-durchschnitt", label: "F3 · Durchschnitt", prompt: "Ermittle die durchschnittliche Fahrstundenzahl. Stelle das Ergebnis in MySQL mit zwei Dezimalstellen dar." },
          { id: "f4-summe", label: "F4 · Gesamtstunden", prompt: "Ermittle die insgesamt durchgeführten Fahrstunden." },
          { id: "f5-umsatz-person", label: "F5 · Umsatz je Person", prompt: "Berechne für jeden Fahrschüler den Betrag seiner Fahrstunden bei 30 Euro je Fahrstunde. Gib die Person eindeutig mit aus." },
          { id: "f6-umsatz-gesamt", label: "F6 · Gesamtumsatz", prompt: "Ermittle den Gesamtbetrag aller Fahrstunden bei 30 Euro je Fahrstunde." },
          { id: "g1-anzahl-ort", label: "G1 · Personen je Ort", prompt: "Ermittle die Anzahl der Fahrschüler je Wohnort." },
          { id: "g2-summe-ort", label: "G2 · Stunden je Ort", prompt: "Ermittle die insgesamt genommenen Fahrstunden je Wohnort." },
          { id: "g3-zwei-orte", label: "G3 · Zwei Wohnorte", prompt: "Zeige die Anzahl der Fahrschüler getrennt für Schorndorf und Welzheim." },
          { id: "g4-stunden-zwei-orte", label: "G4 · Zwei Stundensummen", prompt: "Zeige die Summe der Fahrstunden getrennt für Lorch und Plüderhausen." },
          { id: "g5-wenige-stunden", label: "G5 · Gleiche Stundenzahl", prompt: "Ermittle je Fahrstundenzahl, wie viele Fahrschüler diese Anzahl haben. Berücksichtige nur Fahrstundenzahlen unter vier." },
          { id: "g6-plz", label: "G6 · PLZ-Präfix", prompt: "Ermittle je Wohnort die Anzahl der Fahrschüler, deren PLZ mit 736 beginnt." },
          { id: "g7-mehr-als-zwei", label: "G7 · Große Ortsgruppen", prompt: "Ermittle die Anzahl je Wohnort. Zeige nur Orte mit mehr als zwei Fahrschülern." },
          { id: "g8-mehr-als-zwanzig", label: "G8 · Hohe Stundensummen", prompt: "Ermittle die Fahrstundensumme je Wohnort. Zeige nur Orte mit insgesamt mehr als 20 Fahrstunden." }
        ],
        hint: "Kontrolliere Spalten, Aliasnamen, Zeilen- oder Gruppenfilter und die genaue Grenze. Ordne Ausgaben bei Bedarf ausdrücklich mit ORDER BY. Die Browserübung mit mindestens zwei Personen hat eine andere Grenze als G7."
      },
      notePrompts: ["Wie unterscheiden sich COUNT(*) und COUNT(attribut) bei NULL?", "Wann erhalte ich einen Betrag je Person, wann eine Gesamtsumme?", "Warum stehen die PLZ-Bedingung in WHERE und die Bedingung auf COUNT(*) in HAVING?"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Vom einzelnen Datensatz zur Kennzahl",
        intro: "Bearbeite F1–F6 und G1–G8 in MySQL Workbench. Falls du mit den fünf fiktiven Datensätzen aus L1.4 arbeitest, ergänze die unten verlinkten Testfälle einmalig; sie ändern keine bestehenden Zeilen.",
        steps: [
          "Prüfe zuerst den Datenbestand und das Attribut fahrstundenzahl. Sichere deine SQL-Datei und ergänze bei Bedarf die fiktiven Testfälle genau einmal.",
          "Bearbeite die sechs Funktionsaufträge und unterscheide Einzelbeträge, Gesamtbetrag und formatierte Ausgabe.",
          "Bearbeite die acht Gruppenaufträge. Ordne jede Bedingung begründet WHERE oder HAVING zu.",
          "Prüfe eine Ortsgruppe von Hand und vergleiche beim HAVING-Filter auch Gruppen genau an der Grenze von zwei Personen bzw. 20 Stunden."
        ],
        evidence: "14 ausgeführte SQL-Abfragen, digitales Aufgabenblatt und eine nachvollziehbare Plausibilitätskontrolle",
        download: { href: "assets/sql/l1-8-fahrschule-testfaelle.sql", label: "Fiktive Testfälle ergänzen" },
        fileName: "L1_8_funktionen_gruppierung.sql"
      },
      completionChecks: [
        "Ich habe die sechs Funktionsaufträge formuliert und in Workbench geprüft.",
        "Ich habe die acht Gruppenaufträge geprüft; SELECT-Spalten und GROUP BY passen zusammen.",
        "Ich kann WHERE und HAVING unterscheiden und eine Kennzahl von Hand bestätigen."
      ]
    },
    "datum-berechnungen": {
      courseCode: "L1.9",
      module: "lernfortschritt-1",
      duration: 75,
      subtitle: "Datumsbestandteile auswerten und Kennzahlen auf eine Fahrradvermietung übertragen.",
      workflow: ["Datum verstehen", "Fahrschule auswerten", "Fahrradvermietung", "Abschließen"],
      workflowHints: ["YEAR, MONTH und NOW", "SQL und Ergebnis prüfen", "Acht Transferaufträge", "Lehrkraft bestätigt"],
      sourceMaterials: ["L1_5.6 Information Datenbankabfrage Datum_Funktionen", "L1_5.6 Vertiefungsaufgabe Funktionen"],
      objectives: [
        "YEAR und MONTH auf DATE-Werte anwenden und Ergebnisse benennen",
        "NOW als aktuellen Zeitpunkt des Datenbankservers erklären",
        "Kennzahlen, Abschreibung und gerundete Wochenpreise berechnen",
        "Kalenderjahresdifferenz, vollständige Jahre und Tagesdifferenz unterscheiden"
      ],
      sections: [
        {
          title: "Jahr und Monat aus einem Datum gewinnen",
          body: [
            "Speichere ein Geburts- oder Anschaffungsdatum als DATE. SQL-Datumsliterale stehen in einfachen Anführungszeichen im Format 'YYYY-MM-DD'. YEAR liefert die Jahreszahl, MONTH die Monatszahl. Ein Datum bleibt ein Datum; die Funktionen berechnen lediglich neue Ergebniswerte.",
            "Du kannst die Funktionen sowohl in SELECT als auch in WHERE verwenden. Benenne berechnete Spalten mit AS, und gib die Person oder das Fahrrad eindeutig mit aus. Für eine festgelegte Reihenfolge ergänzt du ORDER BY."
          ],
          code: "SELECT YEAR('2024-11-15') AS jahr,\n       MONTH('2024-11-15') AS monat;",
          tip: "Die Browserübung verwendet einen eigenen Fahrschul-Datenbestand mit Geburtsjahr 2008. In Workbench arbeitest du mit deinen Daten aus L1.4 und wählst ein dort vorhandenes Geburtsjahr."
        },
        {
          title: "Ein aktueller Zeitpunkt verändert sich",
          body: [
            "NOW() liefert Datum und Uhrzeit des Datenbankservers. Anders als ein festes Datum kann sich das Ergebnis beim nächsten Ausführen ändern. Die verwendete Sitzungszeitzone beeinflusst die Anzeige; Workbench zeigt die Antwort des verbundenen Servers.",
            "Die Differenz zweier Jahreszahlen beschreibt eine Kalenderjahresdifferenz. Sie ist nicht automatisch das Alter in vollständig vergangenen Jahren: Vor dem Jahrestag kann die reine Jahresdifferenz um eins zu hoch sein. Notiere bei der Fahrradaufgabe deshalb die verwendete Zählweise. Für vollständige Jahre bietet MySQL TIMESTAMPDIFF(YEAR, beginn, ende)."
          ],
          code: "SELECT NOW() AS serverzeit;",
          tip: "Notiere das Ausführungsdatum deiner Altersauswertung. Beim späteren Wiederholen darf ein dynamisches Ergebnis anders aussehen."
        },
        {
          title: "Transfer zur Fahrradvermietung",
          body: [
            "Das Vertiefungsblatt wechselt zur Fahrradvermietung Rent A Bike. Die acht Aufträge verbinden Aggregatfunktionen aus L1.8 mit berechneten Preisen und Anschaffungsdaten. Verwende die Unterrichtsdaten deiner Lehrkraft oder den getrennten fiktiven Übungsbestand unten.",
            "Unser Übungsbestand nutzt die Tabelle fahrraeder mit fahrradnr, typ, anschaffungspreis, tagessatz und anschaffungsdatum. Er liegt in der eigenen Datenbank workbenchlab_l1_9 und ist nicht die spätere Browser-Datenbank zu Mietverträgen. Bei anderen Unterrichtsdaten überträgst du die Attributnamen auf deren Modell.",
            "Eine lineare Abschreibung verteilt den Anschaffungspreis gleichmäßig auf die vorgegebenen Jahre; hier wird vereinfachend ohne Restwert gerechnet. Ein Wochenpreis gilt für sieben Tage. 30 Prozent Rabatt bedeutet, dass 70 Prozent des normalen Preises zu bezahlen sind. ROUND(zahl, 0) rundet numerisch auf eine ganze Zahl; FORMAT dient dagegen der Textdarstellung."
          ],
          code: "SELECT ROUND(12.6, 0) AS gerundet;",
          rules: ["Berechnete Spalten verändern keine gespeicherten Preise.", "Filtere Fahrradtypen vor der Berechnung, wenn nur bestimmte Typen verlangt sind.", "Prüfe einen Einzelpreis von Hand, bevor du die Gesamtauswertung beurteilst."]
        },
        {
          title: "Tagesdifferenz ist nicht die Zahl aller Kalendertage",
          body: [
            "DATEDIFF(ende, beginn) berechnet die Tagesdifferenz aus den Datumsanteilen; Uhrzeitanteile werden nicht mitgerechnet. Die Reihenfolge ist wichtig: Liegt ende vor beginn, wird die Differenz negativ.",
            "Bei demselben Datum beträgt die Differenz null. Soll eine Aufgabe stattdessen alle Kalendertage einschließlich Anfangs- und Endtag zählen, kommt bei einem gültigen Zeitraum ein Tag hinzu. Das ist eine fachliche Zählregel, kein automatischer Bestandteil von DATEDIFF."
          ],
          code: "SELECT DATEDIFF('2024-11-15', '2024-11-15') AS differenz;",
          tip: "Die Tagesdifferenz ist eine zusätzliche Brücke zu späteren Mietzeiträumen, kein weiterer Auftrag im Originalblatt L1_5.6."
        }
      ],
      webWorksheet: {
        title: "L1.9: Datum und berechnete Werte",
        answerPlaceholder: "SQL-Befehl und kurze Ergebniskontrolle ...",
        intro: "Bearbeite D1–D3 mit deiner Fahrschule und R1–R8 mit der Fahrradvermietung. Notiere SQL und Ergebniskontrolle. D4 ist ein zusätzlicher Transfer zur Tageszählung.",
        definitionGroups: [
          { label: "Datum · D1–D3", open: true, ids: ["d1-geburtsjahr", "d2-geburtsmonat", "d3-serverzeit"] },
          { label: "Fahrradbestand auswerten · R1–R4", ids: ["r1-mountainbikes", "r2-teuerstes", "r3-durchschnitt", "r4-gesamtwert"] },
          { label: "Preise und Alter berechnen · R5–R8", ids: ["r5-abschreibung", "r6-wochenpreis", "r7-anschaffungsjahr", "r8-alter"] },
          { label: "Zusatz · Tage zählen · D4", ids: ["d4-tageszaehlung"] }
        ],
        definitionTerms: [
          { id: "d1-geburtsjahr", label: "D1 · Geburtsjahre", prompt: "Gib Schülernummer, Nachname und Geburtsjahr aus. Benenne die berechnete Spalte jahr und sortiere nach Schülernummer." },
          { id: "d2-geburtsmonat", label: "D2 · Geburtsmonate", prompt: "Wähle ein in deiner Tabelle vorhandenes Geburtsjahr. Gib Schülernummer, Nachname und Geburtsmonat nur für dieses Jahr aus. Benenne die Monatsspalte monat." },
          { id: "d3-serverzeit", label: "D3 · Aktueller Zeitpunkt", prompt: "Gib den aktuellen Serverzeitpunkt aus. Notiere, weshalb dieser Wert nicht dauerhaft gleich bleibt." },
          { id: "r1-mountainbikes", label: "R1 · Mountainbikes zählen", prompt: "Ermittle die Anzahl der Fahrräder vom Typ Mountainbike." },
          { id: "r2-teuerstes", label: "R2 · Höchster Anschaffungspreis", prompt: "Ermittle den Anschaffungswert des teuersten Fahrrads." },
          { id: "r3-durchschnitt", label: "R3 · Durchschnittlicher Tagespreis", prompt: "Ermittle den durchschnittlichen Tagesmietpreis und stelle ihn mit zwei Dezimalstellen dar." },
          { id: "r4-gesamtwert", label: "R4 · Gesamter Anschaffungswert", prompt: "Ermittle den Anschaffungswert aller Fahrräder zusammen." },
          { id: "r5-abschreibung", label: "R5 · Jährliche Abschreibung", prompt: "Die Fahrräder werden über fünf Jahre linear ohne Restwert abgeschrieben. Ermittle die gesamte jährliche Abschreibungssumme." },
          { id: "r6-wochenpreis", label: "R6 · Gerundete Wochenpreise", prompt: "Berechne nur für Mountainbikes und Rennräder den Wochenpreis für sieben Tage mit 30 Prozent Rabatt. Runde auf ganze Zahlen und gib Fahrradnummer und Typ mit aus." },
          { id: "r7-anschaffungsjahr", label: "R7 · Anschaffungsjahre", prompt: "Gib für alle Fahrräder die Fahrradnummer, den Anschaffungspreis und das Jahr der Anschaffung aus." },
          { id: "r8-alter", label: "R8 · Alter und aktuelles Jahr", prompt: "Gib für Mountainbikes und Rennräder das aktuelle Jahr und ihr Alter als Kalenderjahresdifferenz aus. Notiere das Ausführungsdatum und erkläre die Abweichung zu vollständig vergangenen Jahren." },
          { id: "d4-tageszaehlung", label: "D4 · Zusatz: Tage zählen", prompt: "Berechne für den Zeitraum vom 1. bis 5. Oktober 2026 einmal die Tagesdifferenz und einmal die Zahl der Kalendertage einschließlich beider Grenzen. Begründe den Unterschied und prüfe auch einen Zeitraum mit identischem Beginn und Ende." }
        ],
        hint: "R1–R8 übertragen die acht Aufträge des Vertiefungsblatts auf die benannten Attribute. Bei R8 ist die Kalenderjahreszählung bewusst festgelegt. D4 ist zusätzlich. Prüfe FORMAT und TIMESTAMPDIFF in Workbench."
      },
      notePrompts: ["Wie unterscheiden sich ein DATE-Wert, YEAR und MONTH?", "Warum ist eine Jahreszahldifferenz nicht immer das vollständige Alter?", "Wann zähle ich Tagesabstände, wann beide Kalendertage mit?"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Von Geburtsdaten zu Fahrradpreisen",
        intro: "Beginne mit D1–D3 in deiner Fahrschule. Wechsle anschließend bewusst zur Fahrradvermietung für R1–R8. Der optionale Download erstellt einen eigenen Übungsbestand, ohne die Fahrschule zu verändern. Führe ihn nur einmal aus.",
        steps: [
          "Bearbeite die drei Datumsaufträge in fahrschule; wähle für D2 ein vorhandenes Jahr.",
          "Prüfe vor R1–R8 die aktive Datenbank und Attributnamen. Nutze die Unterrichtsdaten oder den fiktiven Download in workbenchlab_l1_9.",
          "Bearbeite die acht Transferaufträge. Kontrolliere einen gerundeten Wochenpreis und die Abschreibung von Hand.",
          "Dokumentiere bei R8 das Ausführungsdatum und die Kalenderjahreszählung. Bearbeite D4 als zusätzlichen Transfer."
        ],
        evidence: "D1–D3 und R1–R8 mit Ergebniskontrollen; D4 als Zusatz",
        download: { href: "assets/sql/l1-9-fahrradvermietung-testdaten.sql", label: "Fiktive Fahrrad-Testdaten" },
        fileName: "L1_9_datum_berechnung.sql"
      },
      completionChecks: [
        "Ich habe D1–D3 ausgeführt und kann YEAR, MONTH und NOW erklären.",
        "Ich habe R1–R8 geprüft und einen Preis oder eine Kennzahl von Hand kontrolliert.",
        "Ich habe das Ausführungsdatum notiert und kann die Kalenderjahreszählung von vollständigen Jahren unterscheiden."
      ]
    },
    "daten-verwalten": {
      courseCode: "L1.10",
      module: "lernfortschritt-1",
      duration: 90,
      subtitle: "Neue Datensätze erfassen, gezielt korrigieren und kontrolliert löschen, ausschließlich im eigenen Übungsbestand.",
      workflow: ["Übungsbestand prüfen", "Einfügen", "Ändern und löschen", "Abschließen"],
      workflowHints: ["Datenbank und Schlüssel", "Bekannt oder unbekannt?", "Vorher und nachher", "Lehrkraft bestätigt"],
      sourceMaterials: ["L1_6 Information Daten einfügen", "L1_6.1 Aufgabe Daten einfügen", "L1_6.2 Vertiefungsaufgabe Daten einfügen", "L1_7 Information Daten ändern", "L1_7.1 Aufgabe Daten ändern", "L1_7.2 Vertiefungsaufgabe Daten ändern", "L1_8 Information Daten löschen", "L1_8.1 Aufgabe Daten löschen", "L1_8.2 Vertiefungsaufgabe Daten löschen"],
      objectives: [
        "INSERT mit expliziter Spaltenliste und passenden Datentypen formulieren",
        "unbekannte Werte von leeren Texten und null Fahrstunden unterscheiden",
        "UPDATE mit SET und DELETE mit einer geprüften Zielmenge ausführen",
        "Vorher-Nachher-Kontrollen und Schutzfunktionen für Änderungen nutzen"
      ],
      sections: [
        {
          title: "Eine eigene Datenbank zum Verändern",
          body: [
            "In dieser Einheit veränderst du gespeicherte Daten. Nutze ausschließlich den fiktiven Bestand workbenchlab_l1_10 oder eine ausdrücklich freigegebene Unterrichtskopie. Deine Fahrschule aus L1.4 und die Fahrrad-Auswertungen aus L1.9 bleiben unberührt.",
            "Prüfe die aktive Datenbank und die Tabellenstruktur vor dem ersten Befehl. Der Download enthält eine Kontrollperson und zehn Fahrräder, aber noch nicht die neuen Personen 13–15 oder Fahrräder 20–22. Führe den Download nur einmal aus; eine bereits vorhandene Tabelle ist kein Anlass, sie zu löschen."
          ],
          code: "SELECT DATABASE() AS aktive_datenbank;\nDESCRIBE fahrschueler;\nDESCRIBE fahrraeder;",
          warning: "Die Browserübungen starten mit einem frischen eigenen Testbestand. Workbench setzt deine Übungsdaten nach einem Lauf nicht automatisch zurück. Führe Änderungen nicht mehrfach unkontrolliert aus."
        },
        {
          title: "INSERT: Spalten und Werte gehören zusammen",
          body: [
            "INSERT INTO nennt die Zieltabelle. Die Spaltenliste legt fest, in welcher Reihenfolge du die Werte angibst. Texte und Datumswerte stehen in einfachen Anführungszeichen, Zahlen nicht. Eine explizite Spaltenliste ist leichter zu prüfen als eine unbenannte Folge von Werten.",
            "Unbekannt bedeutet nicht 0 und nicht leerer Text. NULL steht für einen fehlenden Wert, sofern die Spalte NULL zulässt. Ein ausgelassenes Attribut erhält seinen definierten Standardwert; ohne passenden Standard kann der Befehl scheitern. Prüfe deshalb die Struktur und erfinde keine Angaben.",
            "Jeder neue Datensatz braucht einen freien Primärschlüssel. Zwei gelieferte Fahrräder desselben Modells sind zwei physische Gegenstände und erhalten unterschiedliche Fahrradnummern und Rahmennummern."
          ],
          code: "INSERT INTO beispieltabelle (nummer, bezeichnung)\nVALUES (101, 'Fiktives Beispiel');",
          tip: "Die Syntax zeigt eine andere Tabelle, keine fertige Aufgabenlösung. Prüfe nach INSERT den neuen Datensatz anhand seines Primärschlüssels."
        },
        {
          title: "UPDATE: Ziel prüfen, Werte ändern, Ergebnis prüfen",
          body: [
            "UPDATE verändert vorhandene Datensätze; SET legt die neuen Attributwerte fest. Mit WHERE wählst du die Zielzeilen aus. Mehrere Attribute lassen sich in einem Befehl ändern. Ein Primärschlüssel identifiziert eine bestimmte Person oder ein bestimmtes Fahrrad zuverlässig.",
            "Ein fester neuer Preis, ein Zuschlag in Euro und eine prozentuale Änderung sind unterschiedliche Aufträge. Beziehe eine relative Änderung auf den aktuellen gespeicherten Preis und runde Geldbeträge auf zwei Dezimalstellen. Beim erneuten Ausführen wird eine relative Änderung erneut angewandt.",
            "Bei Gruppenaufträgen prüfst du zuerst alle betroffenen Fahrradnummern mit SELECT. Nutze anschließend die bestätigten Primärschlüssel für die Änderung und kontrolliere danach dieselben Nummern, nicht nur erneut die möglicherweise veränderte Filterbedingung."
          ],
          rules: ["Vorher: Zielzeilen und alte Werte auswählen.", "Änderung: nur die bestätigten Schlüssel bearbeiten.", "Nachher: dieselben Schlüssel auswählen und neue Werte vergleichen."],
          tip: "Safe Updates kann UPDATE oder DELETE ohne geeigneten Schlüsselbezug blockieren. Lass die Schutzfunktion eingeschaltet und prüfe Datenbank, Schlüssel und Zielmenge mit deiner Lehrkraft."
        },
        {
          title: "DELETE entfernt den ganzen Datensatz",
          body: [
            "DELETE FROM entfernt Zeilen aus einer Tabelle. Es löscht nicht nur eine einzelne E-Mail-Adresse. Soll nur ein unbekannter Attributwert geleert werden, ist das eine UPDATE-Aufgabe, sofern NULL zulässig ist.",
            "Ohne WHERE betreffen UPDATE und DELETE grundsätzlich alle Zeilen. Auch eine WHERE-Bedingung kann fachlich falsch sein: Prüfe bei ODER-Verknüpfungen beide Teilmengen und die Grenzen. Unter 100 bedeutet < 100; genau 100 gehört nicht dazu.",
            "Die Alters-Löschaufgabe verwendet bewusst das feste Bezugsjahr 2018, nicht NOW(). Die Zählweise ist hier eine Kalenderjahresdifferenz. Lösche erst nach dokumentierter Vorschau und kontrolliere, ob andere Datensätze erhalten bleiben."
          ],
          warning: "Bei aktivem Autocommit sind erfolgreiche Änderungen unmittelbar bestätigt. ROLLBACK ist dann kein nachträglicher Rückgängig-Knopf. Transaktionen können nur unter passenden Voraussetzungen helfen; CREATE TABLE wird in MySQL nicht einfach durch ROLLBACK aufgehoben."
        }
      ],
      webWorksheet: {
        title: "L1.10: Daten kontrolliert verwalten",
        answerPlaceholder: "SQL, Zielschlüssel und Vorher-Nachher-Kontrolle ...",
        intro: "Arbeite die Aufträge in der angegebenen Reihenfolge im fiktiven Bestand workbenchlab_l1_10 ab. Notiere bei jeder Änderung SELECT-Vorschau, Zielschlüssel, SQL und Ergebniskontrolle. Die Aufgaben übertragen die Originalblätter auf fiktive Personen und Fahrräder.",
        definitionGroups: [
          { label: "Personen erfassen · I1–I3", open: true, ids: ["i1-vollstaendig", "i2-unbekannt", "i3-teilweise"] },
          { label: "Personen ändern und löschen · U1–D2", ids: ["u1-erganzen", "u2-umzug", "d1-person", "d2-person"] },
          { label: "Fahrräder erfassen und Preise ändern · BI1–BU3", ids: ["bi1-lieferung", "bu1-fester-preis", "bu2-zuschlag", "bu3-rabatt"] },
          { label: "Fahrräder filtern und löschen · BU4–BD2", ids: ["bu4-spezial", "bu5-ausnahmen", "bd1-preis-oder-typ", "bd2-alter"] },
          { label: "Abschluss · Sicherheitskontrolle · S1", ids: ["s1-sicherheit"] }
        ],
        definitionTerms: [
          { id: "i1-vollstaendig", label: "I1 · Vollständige Person", prompt: "Füge Person 13 ein: Demo, Sina; Testweg 8, 00013 Teststadt; Telefon 0000000013; sina@example.invalid; geboren 2002-02-18; eine Fahrstunde. Nutze eine explizite Spaltenliste." },
          { id: "i2-unbekannt", label: "I2 · Unbekannte Angaben", prompt: "Füge Person 14 ein: Probe, Hadi; Musterweg 19, 00014 Testdorf; Telefon 0000000014. E-Mail, Geburtsdatum und Fahrstundenzahl sind unbekannt. Prüfe, wie diese Spalten fehlende Werte zulassen." },
          { id: "i3-teilweise", label: "I3 · Weitere Person", prompt: "Füge Person 15 ein: Beispiel, Luca; Demoweg 33, 00015 Beispielort; zwei Fahrstunden. Telefon, E-Mail und Geburtsdatum sind unbekannt." },
          { id: "u1-erganzen", label: "U1 · Angaben ergänzen", prompt: "Person 14 meldet hadi@example.invalid und das Geburtsdatum 2002-05-21. Inzwischen wurden drei Fahrstunden absolviert. Aktualisiere die drei Angaben und kontrolliere Person 14 vorher und nachher." },
          { id: "u2-umzug", label: "U2 · Umzug", prompt: "Person 15 zieht in den Testpfad 19. Ändere Straße und Hausnummer gemeinsam; die übrigen Angaben bleiben gleich." },
          { id: "d1-person", label: "D1 · Eine Person löschen", prompt: "Person 15 verlässt die Übungsfahrschule. Prüfe den Datensatz, lösche genau diese Person und kontrolliere danach auch die übrigen Personen." },
          { id: "d2-person", label: "D2 · Weitere Person löschen", prompt: "Auch Person 13 soll aus dem Übungsbestand entfernt werden. Dokumentiere Vorschau und Nachkontrolle anhand des Primärschlüssels." },
          { id: "bi1-lieferung", label: "BI1 · Drei gelieferte Fahrräder", prompt: "Am 2026-05-21 werden drei Fahrräder geliefert: Nummern 20 und 21, Modell Test-Trail, Typ Mountainbike, je 2499 Euro, Rahmennummern TEST-20 und TEST-21; Nummer 22, Modell Test-Tour, Typ Trekkingrad, 889 Euro, Rahmen TEST-22. Tagespreise sind noch unbekannt. Erfasse jeden Gegenstand separat." },
          { id: "bu1-fester-preis", label: "BU1 · Fester Tagespreis", prompt: "Setze den Tagespreis von Fahrrad 5 auf 15 Euro. Prüfe den alten und neuen Wert." },
          { id: "bu2-zuschlag", label: "BU2 · Zuschlag in Euro", prompt: "Erhöhe den aktuellen Tagespreis von Fahrrad 1 um 2,85 Euro. Führe die Änderung genau einmal aus." },
          { id: "bu3-rabatt", label: "BU3 · Prozentuale Senkung", prompt: "Senke den aktuellen Tagespreis von Fahrrad 16 um zwölf Prozent. Runde den neuen Geldbetrag auf zwei Dezimalstellen." },
          { id: "bu4-spezial", label: "BU4 · Spezialräder", prompt: "Erhöhe die Tagespreise aller Spezialräder um 20 Prozent. Ermittle zuerst die Zielschlüssel; unbekannte Preise bleiben unbekannt. Runde auf zwei Dezimalstellen." },
          { id: "bu5-ausnahmen", label: "BU5 · Zwei Typen ausnehmen", prompt: "Senke die Tagespreise aller Fahrräder außer Trekkingrad und Mountainbike um fünf Prozent. Prüfe die Zielschlüssel und runde auf zwei Dezimalstellen. Unbekannte Preise bleiben unbekannt." },
          { id: "bd1-preis-oder-typ", label: "BD1 · Preis oder Fahrradtyp", prompt: "Lösche Fahrräder mit Anschaffungswert unter 100 Euro sowie alle Kinderfahrräder unabhängig vom Wert. Prüfe beide Teilmengen und den Grenzfall genau 100 Euro; ändere nur bestätigte Schlüssel." },
          { id: "bd2-alter", label: "BD2 · Festes Bezugsjahr", prompt: "Lösche Fahrräder, die im Bezugsjahr 2018 als Kalenderjahresdifferenz älter als vier Jahre sind. Verwende kein aktuelles Serverdatum. Dokumentiere Vorschau, Zielschlüssel und Nachkontrolle." },
          { id: "s1-sicherheit", label: "S1 · Sicherheitskontrolle", prompt: "Erkläre den Unterschied zwischen DELETE einer Zeile und UPDATE einer einzelnen Angabe. Weshalb reicht irgendeine WHERE-Bedingung nicht aus? Weshalb kann eine relative Preisänderung nicht beliebig wiederholt werden?" }
        ],
        hint: "Fiktive Namen, Kontakte und Lieferdaten ersetzen die Originalbeispiele. BI1 verwendet ausdrücklich drei physische Fahrräder. Die Gruppenaufträge können mehrere Zeilen betreffen; bestätigte Schlüssel und Nachkontrollen sind Teil der Bearbeitung."
      },
      notePrompts: ["Wann ist NULL fachlich korrekt und wann ist 0 ein bekannter Wert?", "Wie prüfe ich dieselben Datensätze vor und nach einer Änderung?", "Warum ist der Browser-Neustart der Testdaten kein Rückgängig in Workbench?"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Daten kontrolliert einfügen, ändern und löschen",
        intro: "Nutze ausschließlich workbenchlab_l1_10. Der Download legt den Anfangsbestand an, aber führt keine Aufgabenänderungen oder Löschungen aus. Jede Änderung folgt der Sicherheitsfolge: Zielmenge auswählen, ändern, dieselben Schlüssel kontrollieren.",
        steps: [
          "Lege den fiktiven Anfangsbestand einmal an und prüfe aktive Datenbank, Tabellenstruktur und freie Schlüssel.",
          "Bearbeite I1–I3, dann U1–U2 und D1–D2. Dokumentiere unbekannte Werte und jede Zielkontrolle.",
          "Bearbeite BI1, BU1–BU5 und anschließend BD1–BD2 in dieser Reihenfolge. Relative Änderungen nur einmal ausführen.",
          "Beantworte S1 und prüfe die Browserübungen CREATE, INSERT, UPDATE und DELETE mit ihrem getrennten Testbestand."
        ],
        evidence: "SQL-Skript und ausgefülltes Aufgabenblatt mit Zielschlüsseln und Vorher-Nachher-Kontrollen",
        download: { href: "assets/sql/l1-10-aenderungen-testdaten.sql", label: "Fiktiven Übungsbestand anlegen" },
        fileName: "L1_10_daten_verwalten.sql"
      },
      completionChecks: [
        "Ich habe die Personen- und Fahrradaufträge in der vorgegebenen Reihenfolge dokumentiert.",
        "UPDATE und DELETE betreffen nur die vorher geprüften Schlüssel; meine Nachkontrollen sind dokumentiert.",
        "Ich habe die Browserübungen CREATE, INSERT, UPDATE und DELETE geprüft und kann ihre Testdaten von Workbench unterscheiden."
      ]
    },
    "erm-sachtext-analyse": {
      courseCode: "L2.1",
      module: "lernfortschritt-2",
      title: "Redundanz erkennen und zwei Tabellen planen",
      subtitle: "Wiederholte Ortsangaben werden in einen eigenen Entitätstyp überführt; aus der fachlichen 1:N-Beziehung entsteht ein Fremdschlüssel.",
      duration: 80,
      practiceId: "erm-fahrschule-redundancy",
      workflow: ["Daten prüfen", "ERD und Relationen", "Workbench-Entwurf", "Datei prüfen"],
      workflowHints: ["Redundanz und Anomalie", "FK auf der N-Seite", "Zwei Tabellen ohne Serveränderung", "Speichern und erneut öffnen"],
      sourceMaterials: ["L2_1 Information Redundanzfreiheit", "L2_1 Aufgabe Redundanzfreiheit", "L2_1 Vorlage Tabellenentwurf", "L2_2.1 Information Datenbankmodell 2 Tabellen", "L2_2.1 Aufgabe Datenbankmodell 2 Tabellen"],
      objectives: [
        "wiederholte Speicherung von Orten von mehrfachen Werten in einem SELECT-Ergebnis unterscheiden",
        "eine Änderungsanomalie am Fahrschulbeispiel erläutern",
        "Fahrschüler und Orte als Entitätstypen mit einer 1:N-Beziehung modellieren",
        "Primär- und Fremdschlüssel im daraus folgenden Relationenschema begründen"
      ],
      sections: [
        {
          title: "Zwei Arten von Wiederholung unterscheiden",
          body: [
            "In L1.7 hat `DISTINCT` Wiederholungen nur aus dem Abfrageergebnis entfernt. Hier geht es um die gespeicherten Daten selbst: Wenn bei jedem Fahrschüler dieselben Orts- und Postleitzahlangaben erneut stehen, müssen Änderungen an mehreren Stellen erfolgen.",
            "Prüfe die Ein-Tabellen-Datenbank aus L1: `schuelernr` identifiziert eine Person eindeutig und die Felder sind atomar. Trotzdem können `plz` und `ort` bei vielen Fahrschülern immer wieder gespeichert sein."
          ],
          visual: "redundancy",
          definitions: [
            { term: "Speicher-Redundanz", definition: "Dieselbe fachliche Information wird in mehreren Datensätzen gespeichert." },
            { term: "Änderungsanomalie", definition: "Eine Information wird nicht überall gleich geändert; dadurch widersprechen sich die Daten." }
          ]
        },
        {
          title: "Aus zwei Objekttypen wird eine 1:N-Beziehung",
          body: [
            "Lege für jeden Ort einen eigenen Datensatz mit `ortnr` als Primärschlüssel an. Ein Ort kann mehreren Fahrschülern zugeordnet sein. Jeder Fahrschüler hat in diesem vereinfachten Modell genau einen Wohnort.",
            "Zeichne zuerst ein fachliches ERD ohne Datentypen: die Entitätstypen `orte` und `fahrschueler`, verbunden durch `wohnt in`. Lies die Regel in beiden Richtungen. Erst danach überführst du das ERD in zwei Relationen mit Attributen und Schlüsseln."
          ],
          visual: "two-table-concept",
          rules: [
            "Ein Ort kann 0 bis viele Fahrschüler haben; ein Fahrschüler gehört genau einem Ort.",
            "`ortnr` ist Primärschlüssel in `orte` und Fremdschlüssel in `fahrschueler`.",
            "`plz` und `ort` stehen nur in `orte`, nicht zusätzlich in `fahrschueler`."
          ]
        },
        {
          title: "Vom ERD zum Relationenschema",
          body: [
            "Ein Fremdschlüssel verweist von der Child-Tabelle auf den Primärschlüssel der Parent-Tabelle. Hier gehört er auf die N-Seite: Viele Fahrschüler können denselben `ortnr`-Wert speichern und damit auf denselben Ort verweisen.",
            "`ortnr` ist eine technische Kennung. Postleitzahl und Ortsname sind dafür kein verlässlicher Ersatz, weil Schreibweisen, Zustellgebiete und fachliche Regeln variieren können. Prüfe im eigenen Modell, welche Attribute aus L1 unverändert bei `fahrschueler` bleiben."
          ],
          code: "orte(ortnr PK, plz, ort)\nfahrschueler(schuelernr PK, nachname, vorname, ..., ortnr FK)"
        },
        {
          title: "Den Tabellenentwurf in Workbench vorbereiten",
          body: [
            "Nach dem fachlichen ERD und den Browserübungen setzt du deinen eigenen Entwurf als Modelldatei um. Öffne deine vollständige L1-Modelldatei und speichere über File > Save Model As eine Kopie L2_1_tabellenentwurf.mwb. Benenne nur in dieser Kopie das Schema fahrschule_l2. Die L1-Datei und die bestehende Datenbank bleiben unverändert.",
            "Öffne das EER-Diagramm oder ergänze über Add Diagram ein Diagramm und ziehe die bestehende Tabelle aus dem Catalog darauf. Lege mit dem Tabellenwerkzeug orte an: ortnr INT als PK, NN und AI, plz VARCHAR(5) sowie ort VARCHAR(50), beide NN. Ergänze in fahrschueler ortnr INT NN als vorgesehenen Verweis und entferne dort plz und ort nur aus der Modellkopie. Alle übrigen Attribute aus L1 bleiben erhalten.",
            "In L2.1 planst du die Beziehung fachlich, richtest aber noch keinen Foreign-Key-Constraint ein. Eine Spalte ortnr allein erzwingt keine Zuordnung und erzeugt keine Beziehungslinie. Die technische 1:N-Verbindung folgt in L2.2; notiere bis dahin beide Leserichtungen in einer Textnotiz im Diagramm. Speichere die Datei, schließe sie und öffne sie zur Kontrolle erneut."
          ],
          warning: "Dies ist ein Tabellenentwurf, noch kein fertiges relationales Modell. Kein Forward Engineer, keine Synchronisierung und keine Änderung am Server in L2.1. Die .mwb-Datei wird separat gespeichert; die JSON-Sicherung enthält sie nicht."
        }
      ],
      webWorksheet: {
        title: "L2.1: Redundanz und Zwei-Tabellen-Modell",
        intro: "Bearbeite zuerst die Fragen aus L2_1 und L2_2.1 und zeichne das fachliche ERD im Heft. Nach den Übungen folgt dein eigener Tabellenentwurf in Workbench.",
        definitionTerms: [
          { id: "pruefung", label: "1 · Bestehende Tabelle", prompt: "Sind Primärschlüssel und atomare Werte vorhanden? Welche Daten werden trotzdem mehrfach gespeichert?" },
          { id: "anomalie", label: "2 · Änderungsanomalie", prompt: "Beschreibe an zwei Fahrschülern desselben Ortes, wie durch eine nur teilweise Änderung widersprüchliche Daten entstehen." },
          { id: "beziehung", label: "3 · Fachliches ERD", prompt: "Nenne beide Entitätstypen, den Beziehungstyp und zwei vollständige Leserichtungssätze. Welche maximale Kardinalität entsteht?" },
          { id: "relationen", label: "4 · Relationenschema", prompt: "Schreibe beide Relationen mit PK, FK sowie plz und ort auf. Wo steht ortnr als Fremdschlüssel?" },
          { id: "begriffe", label: "5 · Begriffe", prompt: "Definiere Entität, Entitätstyp, Beziehungstyp, Kardinalität und Fremdschlüssel anhand des Beispiels." },
          { id: "modellkontrolle", label: "6 · Workbench-Entwurf", prompt: "Wie heißt deine gespeicherte Modelldatei? Welche beiden Tabellen und Schlüssel siehst du nach erneutem Öffnen? Prüfe, wo plz und ort stehen und welche L1-Attribute erhalten sind. Warum ist ortnr in fahrschueler noch kein technisch eingerichteter Fremdschlüssel?" }
        ],
        hint: "Ein Fremdschlüssel wiederholt nur die Ortsnummer als Verweis. Ortsname und PLZ werden in der neuen Ortstabelle gepflegt."
      },
      notePrompts: [
        "Warum löst DISTINCT keine Speicher-Redundanz?",
        "Wie lauten die beiden Leserichtungssätze für Orte und Fahrschüler?",
        "Weshalb steht der Fremdschlüssel auf der Fahrschüler-Seite?"
      ],
      classroomTask: {
        tool: "MySQL Workbench EER Diagram und fachlicher Entwurf",
        title: "Zwei Tabellen selbst entwerfen und in Workbench vorbereiten",
        intro: "Gehe von deiner vollständigen L1-Struktur aus. Begründe zunächst die Aufteilung auf Papier; übertrage danach deinen Entwurf in eine eigene Modelldatei. Server und L1-Datei bleiben unverändert.",
        steps: [
          "Prüfe die bestehende Tabelle auf Primärschlüssel, atomare Werte und mehrfach gespeicherte Ortsangaben.",
          "Beschreibe eine konkrete Änderungsanomalie und skizziere zwei Tabellen als Lösung.",
          "Zeichne ein fachliches ERD mit `orte`, `fahrschueler`, `wohnt in` und einer begründeten 1:N-Beziehung.",
          "Überführe das ERD in zwei Relationen; markiere `ortnr` als PK in `orte` und als vorgesehenen FK in `fahrschueler`.",
          "Öffne die vollständige L1-Modelldatei in Workbench 6.3.10 beziehungsweise 8.0.21. Sichere über File > Save Model As die Kopie L2_1_tabellenentwurf.mwb und benenne nur deren Schema fahrschule_l2. Wenn die L1-Datei fehlt, erstelle die vollständige L1-Struktur anhand deines gespeicherten Tabellenentwurfs neu, nicht nur eine gekürzte Namenstabelle.",
          "Öffne oder ergänze das EER-Diagramm. Lege orte mit ortnr INT PK NN AI, plz VARCHAR(5) NN und ort VARCHAR(50) NN an. Ergänze fahrschueler.ortnr INT NN und entferne plz und ort nur aus dieser Modellkopie. Prüfe, dass alle anderen L1-Attribute erhalten bleiben.",
          "Füge eine Textnotiz mit beiden Leserichtungen hinzu. Richte noch keine Beziehung ein: Die vorgesehene FK-Spalte allein erzwingt keine Zuordnung. Speichere, schließe und öffne die .mwb-Datei erneut; zeige der Lehrkraft die beiden Tabellen und die unveränderte L1-Datei. Kein Forward Engineer und keine Synchronisierung in dieser Einheit."
        ],
        evidence: "Begründete Redundanzprüfung, handgezeichnetes ERD, zwei Relationenschemata und erneut geöffnete eigene Workbench-Modelldatei",
        fileName: "L2_1_tabellenentwurf.mwb"
      },
      completionChecks: [
        "Ich kann eine Speicher-Redundanz und eine Änderungsanomalie am Beispiel erklären.",
        "Mein fachliches ERD enthält die beiden Entitätstypen und die 1:N-Beziehung.",
        "Mein Relationenschema speichert plz und ort nur in orte und plant ortnr als Fremdschlüssel.",
        "Ich habe meinen Zwei-Tabellen-Entwurf in Workbench gespeichert und erneut geöffnet; L1-Datei und Server sind unverändert. Ich kann die noch fehlende technische Beziehung benennen."
      ],
      quiz: {
        question: "Was ändert SELECT DISTINCT ort an der ursprünglichen Fahrschüler-Tabelle?",
        options: [
          "Nichts an den gespeicherten Daten; nur doppelte Ortswerte im Ergebnis verschwinden.",
          "Es legt automatisch eine Tabelle orte und einen Fremdschlüssel an.",
          "Es löscht Fahrschüler mit demselben Wohnort."
        ],
        correct: 0,
        explanation: "DISTINCT verändert nur das Abfrageergebnis. Gegen mehrfach gespeicherte Ortsdaten hilft eine begründete Modelländerung."
      }
    },
    "erm-kardinalitaeten": {
      courseCode: "L2.2",
      module: "lernfortschritt-2",
      title: "1:N-Beziehung in MySQL Workbench umsetzen",
      subtitle: "Aus dem ERD aus L2.1 entsteht ein EER-Diagramm mit zwei Tabellen, einem Fremdschlüssel und einer geprüften Modelldatei.",
      duration: 70,
      practiceId: "erm-fahrschule-1n-diagram",
      workflow: ["L2.1-Entwurf öffnen", "Ortstabelle prüfen", "1:N setzen", "Modell prüfen"],
      workflowHints: ["Eigenes L2-Schema", "ortnr PK und AI", "FK in fahrschueler", "Keine vorhandenen Daten löschen"],
      sourceMaterials: ["L2_2.2 Information softwaregestütztes Datenbankmodell 2 Tabellen", "L2_2.2 Aufgabe softwaregestütztes Datenbankmodell 2 Tabellen", "L2_2.2 Vorlage_fahrschule.mwb"],
      objectives: [
        "ein bestehendes Workbench-Modell als neue L2-Datei sichern",
        "die Tabelle orte mit ortnr als PK und Auto Increment ergänzen",
        "eine 1:N-Beziehung so setzen, dass ortnr als FK in fahrschueler liegt",
        "redundante Spalten im neuen Modell entfernen und die Änderung sicher prüfen"
      ],
      sections: [
        {
          title: "Eigenständige L2-Kopie anlegen",
          body: [
            "Öffne deinen Entwurf L2_1_tabellenentwurf.mwb und speichere eine neue Kopie L2_2_fahrschule_zwei_tabellen.mwb. Das Schema heißt fahrschule_l2. Die L2.1- und L1-Dateien bleiben erhalten. Falls du ohne diesen Entwurf beginnst, kopiere die vollständige L1-Datei oder die lokale Unterrichtsvorlage und benenne das Schema der Kopie fahrschule_l2.",
            "Prüfe im EER-Diagramm die beiden Tabellen aus L2.1: orte enthält ortnr INT PK NN AI, plz VARCHAR(5) NN und ort VARCHAR(50) NN. Fahrschueler enthält alle übrigen L1-Attribute sowie ortnr INT NN. Ergänze fehlende Spalten, aber lege vorhandene Tabellen und ortnr nicht doppelt an."
          ],
          visual: "foreign-key",
          warning: "Erzeuge aus der Modellkopie noch keine Datenbank. Besonders eine Option zum Löschen vorhandener Objekte darfst du nicht ungeprüft übernehmen."
        },
        {
          title: "Beziehung setzen und Fremdschlüssel prüfen",
          body: [
            "Wähle in Workbench das Werkzeug für eine nicht-identifizierende 1:N-Beziehung. Klicke zuerst auf die Child-Tabelle `fahrschueler`, die den Fremdschlüssel erhält, danach auf die Parent-Tabelle `orte`. Die Namen der Werkzeuge können in 6.3.10 und 8.0.21 leicht abweichen.",
            "Wenn das Beziehungswerkzeug eine zusätzliche Spalte orte_ortnr erzeugt, ordne im Tabelleneditor unter Foreign Keys die Beziehung der bereits geplanten Spalte ortnr zu. Prüfe zuerst die Zuordnung ortnr zu orte.ortnr; entferne erst danach die ungenutzte automatisch erzeugte Zusatzspalte. Wenn du von L1 ohne geplante Spalte beginnst, kannst du die neu erzeugte FK-Spalte in ortnr umbenennen. Am Ende gibt es genau eine Orts-Verweisspalte INT NN. Plz und ort stehen ausschließlich in orte. Speichere die .mwb-Kopie."
          ],
          code: "orte(ortnr INT PK AI, plz VARCHAR(5), ort VARCHAR(50))\nfahrschueler(..., ortnr INT FK)\n\norte.ortnr  1 ---- N  fahrschueler.ortnr",
          tip: "AI vergibt bei neuen Orten automatisch eine Nummer. Für die Beziehung zählt trotzdem der gleiche Datentyp von PK und FK."
        },
        {
          title: "Erst prüfen, dann getrennt erzeugen",
          body: [
            "Zeige der Lehrkraft das Diagramm und die beiden Leserichtungssätze. Prüfe, dass `plz` und `ort` nicht mehr bei `fahrschueler` stehen. Erst nach dieser Kontrolle darfst du das neue Modell in das getrennte Übungsschema `fahrschule_l2` übertragen.",
            "Lies die SQL-Vorschau von `Database > Forward Engineer...` vor dem Ausführen. Sie darf keine vorhandene L1-Tabelle löschen oder ändern. Importiere danach die eigens bereitgestellten fiktiven L2-Testdaten genau einmal und kontrolliere die Zuordnung mit dem JOIN-Beispiel."
          ],
          code: "SELECT f.schuelernr, f.nachname, o.plz, o.ort\nFROM fahrschueler AS f\nJOIN orte AS o ON f.ortnr = o.ortnr\nORDER BY f.schuelernr;",
          warning: "Nicht `DROP Objects Before Each CREATE Object` aktivieren. Wenn die Vorschau DROP- oder ALTER-Befehle gegen die L1-Datenbank enthält, abbrechen und erst mit der Lehrkraft klären."
        }
      ],
      webWorksheet: {
        title: "L2.2: Mein erstes Workbench-Diagramm mit 1:N",
        intro: "Halte Modellentscheidungen und Prüfergebnisse fest. Die eigentliche `.mwb`-Datei speicherst du separat.",
        definitionTerms: [
          { id: "kopie", label: "1 · Neue Modelldatei", prompt: "Wie heißt deine neue `.mwb`-Datei und welches Schema enthält sie? Warum bleibt die L1-Datei unverändert?" },
          { id: "ort", label: "2 · Ortstabelle", prompt: "Welche drei Attribute hat orte? Markiere PK, Datentyp und die Bedeutung von AI." },
          { id: "beziehung", label: "3 · 1:N", prompt: "Lies die Beziehung in beiden Richtungen. Welche Tabelle ist Parent, welche Child?" },
          { id: "fremdschluessel", label: "4 · Fremdschlüssel", prompt: "Wo liegt ortnr als FK? Welchen automatischen Namen musste Workbench gegebenenfalls geändert bekommen?" },
          { id: "kontrolle", label: "5 · Sichere Übertragung", prompt: "Welche drei Punkte prüfst du in der SQL-Vorschau, bevor du das neue Schema erzeugst?" }
        ],
        hint: "Die Unterrichtsdatei aus L1 bleibt erhalten. Die neue Datenbank heißt `fahrschule_l2`; ein JSON-Export der Homepage enthält weder Modelldatei noch MySQL-Daten."
      },
      notePrompts: [
        "Warum liegt der Fremdschlüssel auf der N-Seite?",
        "Was bedeutet Auto Increment beim Primärschlüssel?",
        "Woran erkenne ich eine unbeabsichtigte Löschung in der SQL-Vorschau?"
      ],
      classroomTask: {
        tool: "MySQL Workbench EER Diagram",
        title: "Fahrschule als Zwei-Tabellen-Modell umsetzen",
        intro: "Führe deinen L2.1-Entwurf als neue Modelldatei weiter und setze die Aufgabe L2_2.2 um. Prüfe den tatsächlichen Fremdschlüssel, bevor du das getrennte L2-Übungsschema erzeugst.",
        steps: [
          "Öffne L2_1_tabellenentwurf.mwb und sichere eine neue L2.2-Kopie. Ohne diesen Entwurf kopierst du die vollständige L1-Modelldatei. Das Schema der Kopie heißt fahrschule_l2; die bisherigen Dateien bleiben erhalten.",
          "Prüfe oder ergänze orte mit ortnr INT PK NN AI sowie plz VARCHAR(5) NN und ort VARCHAR(50) NN. Fahrschueler behält alle übrigen L1-Attribute und benötigt genau eine ortnr-Spalte INT NN.",
          "Setze die nicht-identifizierende 1:N-Beziehung: zuerst fahrschueler als Child, dann orte als Parent. Ordne unter Foreign Keys die bestehende Spalte ortnr der Parent-Spalte orte.ortnr zu. Entferne eine automatisch erzeugte Zusatzspalte erst nach dieser Kontrolle. Plz und ort dürfen nicht zusätzlich bei fahrschueler stehen.",
          "Speichere und öffne die `.mwb`-Datei erneut. Zeige der Lehrkraft Diagramm, PK/FK, Kardinalität und die unveränderte L1-Datei.",
          "Übertrage nur nach Freigabe in das neue Schema. Prüfe die SQL-Vorschau auf DROP/ALTER gegen L1, importiere das fiktive L2-Skript einmal und kontrolliere das JOIN-Ergebnis."
        ],
        evidence: "Neue `.mwb`-Datei mit zwei Tabellen und Beziehung, geprüftes L2-Schema, digitales Blatt und JOIN-Ergebnis",
        fileName: "L2_2_fahrschule_zwei_tabellen.mwb",
        download: { href: "assets/sql/l2-2-fahrschule-beispieldaten.sql", label: "Fiktive L2-Testdaten herunterladen" }
      },
      completionChecks: [
        "Meine L1-Modelldatei ist unverändert; die L2-Kopie enthält orte und fahrschueler.",
        "Die 1:N-Beziehung und ortnr als PK/FK sind im EER-Diagramm korrekt sichtbar.",
        "Ich habe die Übertragung mit der Lehrkraft geprüft und das getrennte L2-Schema kontrolliert."
      ],
      quiz: {
        question: "Welche Tabelle erhält bei orte 1:N fahrschueler den Fremdschlüssel ortnr?",
        options: [
          "fahrschueler, weil dort jeder Datensatz auf seinen Ort verweist.",
          "orte, weil dort die PLZ gespeichert wird.",
          "Beide Tabellen erhalten denselben Fremdschlüssel."
        ],
        correct: 0,
        explanation: "Die N-Seite verweist mit ortnr auf den Primärschlüssel der 1-Seite."
      }
    },
    "fremdschluessel-integritaet": {
      courseCode: "L2.3",
      module: "lernfortschritt-2",
      duration: 65,
      subtitle: "Gültige Verweise prüfen und blockierte Änderungen in einem Drei-Tabellen-Modell begründen.",
      workflow: ["Verweise prüfen", "Löschversuch", "Neue Datensätze", "Abschließen"],
      workflowHints: ["Parent und Child", "Fehler ist erwartbar", "Reihenfolge begründen", "Lehrkraft bestätigt"],
      sourceMaterials: ["L2_3 Information referentielle Integrität", "L2_3 Aufgabe referentielle Integrität"],
      objectives: [
        "Parent- und Child-Tabellen für jeden Fremdschlüssel benennen",
        "blockierte Änderungen auf konkrete Verweise zurückführen",
        "Parent-Datensätze vor abhängigen Child-Datensätzen erfassen",
        "Löschregeln unterscheiden und eine fachlich erlaubte Reihenfolge begründen"
      ],
      sections: [
        {
          title: "Ein Verweis braucht ein vorhandenes Ziel",
          body: [
            "Ein Fremdschlüssel verbindet eine Child-Tabelle mit einem Schlüssel der Parent-Tabelle. Im bisherigen Modell verweist fahrschueler.ortnr auf orte.ortnr. Referentielle Integrität verhindert, dass ein gespeicherter Verweis auf ein nicht vorhandenes Ziel zeigt.",
            "Sie garantiert nicht, dass jede gespeicherte Angabe fachlich richtig ist: Eine vorhandene, aber falsch zugeordnete Ortnummer verletzt den Fremdschlüssel nicht. Ob ein Verweis fehlen darf, ist eine weitere Modellregel. In unserem Testbestand sind die Fremdschlüssel NOT NULL."
          ],
          visual: "foreign-key",
          code: "FOREIGN KEY (ortnr) REFERENCES orte(ortnr)",
          definitions: [{ term: "Parent", definition: "Tabelle mit dem referenzierten Schlüssel." }, { term: "Child", definition: "Tabelle mit dem darauf verweisenden Fremdschlüssel." }]
        },
        {
          title: "Drei Tabellen, zwei Rollen für Fahrlehrer",
          body: [
            "Das Aufgabenblatt ergänzt Fahrlehrer zum Fahrschulmodell. Unser getrenntes Schema workbenchlab_l2_3 enthält orte, fahrlehrer und fahrschueler. Ein Fahrlehrer verweist mit ortnr auf seinen Wohnort; ein Fahrschüler verweist auf einen Wohnort und auf seinen Fahrlehrer.",
            "fahrlehrer ist damit Child gegenüber orte, aber Parent gegenüber fahrschueler. Parent und Child sind Rollen einer konkreten Beziehung, keine feste Eigenschaft einer Tabelle. Jede Schülerzeile hat im vereinfachten Übungsmodell genau einen Fahrlehrer.",
            "Die Schlüssel heißen ortnr, fahrlehrernr und schuelernr. Die Namen und Daten im Download sind fiktiv; bei einem anderen Unterrichtsmodell musst du die Attributnamen und Regeln dort prüfen. Die L2.2-Datenbank wird nicht verändert."
          ],
          code: "orte(ortnr PK, plz, ort)\nfahrlehrer(fahrlehrernr PK, ..., ortnr FK)\nfahrschueler(schuelernr PK, ..., ortnr FK, fahrlehrernr FK)",
          tip: "Prüfe nach dem Import die Fremdschlüssel mit SHOW CREATE TABLE und die Tabellen im Navigator. Eine gezeichnete Verbindung allein beweist nicht, dass der verbundene Server die Regel durchsetzt."
        },
        {
          title: "Eine blockierte Änderung schützt das Modell",
          body: [
            "Unser Testbestand verwendet ausdrücklich ON DELETE RESTRICT und ON UPDATE RESTRICT. Ein referenzierter Parent kann deshalb nicht einfach gelöscht oder sein Schlüssel verändert werden. Ein neuer Child mit nicht vorhandener Parent-ID wird ebenfalls abgelehnt.",
            "Andere Modelle können andere Regeln festlegen: CASCADE führt die entsprechende Parent-Änderung an abhängigen Child-Zeilen weiter, SET NULL setzt einen zulässigen Fremdschlüssel auf NULL. Solche Regeln müssen fachlich gewollt sein; sie sind kein Mittel, einen Fehler beliebig verschwinden zu lassen.",
            "Notiere den ausgeführten Befehl, die tatsächliche Fehlermeldung, den betroffenen Fremdschlüssel und das fehlende oder noch referenzierte Ziel. Prüfe nach dem Fehler, dass der Zustand unverändert blieb. Ein blockierter Löschversuch ist in dieser Aufgabe ein erwartetes Ergebnis."
          ],
          warning: "Lass Fremdschlüsselprüfungen und Safe Updates eingeschaltet. Lösche abhängige Schüler nicht nur, damit ein Fahrlehrer-Löschbefehl funktioniert. Die fachliche Entscheidung kommt vor der technischen Änderung."
        },
        {
          title: "Einfügen und Löschen brauchen eine begründete Reihenfolge",
          body: [
            "Prüfe beim Erfassen zuerst, welche Orte bereits existieren. Lege fehlende Parent-Datensätze an, bevor du auf sie verweist. Ein neuer Fahrlehrer braucht seinen vorhandenen Ort; der neue Schüler braucht sowohl seinen Ort als auch den neuen Fahrlehrer.",
            "Beim Entfernen gilt im RESTRICT-Modell die umgekehrte Abhängigkeitsrichtung. Wenn Schüler und Fahrlehrer laut Auftrag beide ausscheiden, prüfst und entfernst du zunächst den abhängigen Schüler. Erst wenn kein anderer Schüler mehr auf den Fahrlehrer verweist, darfst du ihn entfernen. Ein gemeinsam genutzter Ort bleibt bestehen.",
            "Ist nur der Fahrlehrer ausgeschieden, musst du zuerst fachlich klären, was mit seinen Schülern geschieht, etwa eine zulässige neue Zuordnung. In dieser Einheit wird die blockierte Löschung untersucht; bestehende Schüler werden dafür nicht automatisch entfernt."
          ],
          tip: "Prüfe vor jedem UPDATE oder DELETE die Zielschlüssel und nachher dieselben Zeilen. Der Download ist ein Anfangsbestand, keine Rücksetzfunktion und keine Aufgabenlösung."
        }
      ],
      webWorksheet: {
        title: "L2.3: Verweise und Integritätsfehler",
        answerPlaceholder: "SQL, Beobachtung und fachliche Begründung ...",
        intro: "Übertrage die Aufträge des Materials auf workbenchlab_l2_3. Arbeite in der angegebenen Reihenfolge und dokumentiere echte Beobachtungen. Die Personen und Kontakte sind ausschließlich fiktiv.",
        definitionGroups: [
          { label: "Regeln und blockierte Löschung · 1–2.3", open: true, ids: ["regel", "loeschen-plan", "loeschen-test", "fehler-erklaeren"] },
          { label: "Neue Personen geordnet erfassen · 3.1–3.3", ids: ["erfassen", "reihenfolge", "entfernen"] },
          { label: "Zusatz · Verweisfehler und Löschregeln", ids: ["ungueltiger-verweis", "loeschregeln"] }
        ],
        definitionTerms: [
          { id: "regel", label: "1 · Regeln und Beziehungen", prompt: "Benenne für alle drei Fremdschlüssel Parent, Child und Zielschlüssel. Erkläre, was referentielle Integrität schützt und was sie nicht garantiert." },
          { id: "loeschen-plan", label: "2.1 · Ausscheidenden Fahrlehrer prüfen", prompt: "Fahrlehrerin 201, Iris Demo, verlässt die Übungsfahrschule. Prüfe ihre Daten und alle auf sie verweisenden Schüler. Welche Änderung wäre fachlich nötig, welche technische Schwierigkeit erwartest du?" },
          { id: "loeschen-test", label: "2.2 · Blockierten Versuch dokumentieren", prompt: "Versuche im Testbestand genau Fahrlehrerin 201 zu löschen. Führe keinen weiteren Löschbefehl aus. Notiere SQL und die tatsächliche Servermeldung; kontrolliere danach, ob Fahrlehrerin und Schüler unverändert vorhanden sind." },
          { id: "fehler-erklaeren", label: "2.3 · Fehlermeldung erklären", prompt: "Erkläre anhand des konkreten Fremdschlüssels, warum die Löschung blockiert ist. Unterscheide den Integritätsschutz von einer möglichen Safe-Updates-Meldung. Nenne eine fachlich zulässige Vorgehensweise, ohne sie hier auszuführen." },
          { id: "erfassen", label: "3.1 · Neue Personen erfassen", prompt: "Erfasse Fahrlehrer 203, Tari Fiktiv, geboren 1990-05-02, Telefon 0000000203, tari@example.invalid, Testweg 23, Gehalt 2100 Euro, 40 Wochenstunden. Er wohnt im neuen Ort 103, PLZ 00103, Beispielheim. Schüler 2, Finn Fiktiv, geboren 2001-10-10, Telefon 0000000002, finn@example.invalid, Musterweg 22A, 0 Fahrstunden, wohnt im vorhandenen Ort 101 und wird von 203 unterrichtet. Plane zuerst freie Schlüssel und Reihenfolge." },
          { id: "reihenfolge", label: "3.2 · Reihenfolge begründen", prompt: "Begründe die Reihenfolge deiner INSERT-Befehle anhand der Fremdschlüssel. Erkläre, weshalb der vorhandene Schülerort nicht erneut eingefügt wird, und kontrolliere die neuen Verweise." },
          { id: "entfernen", label: "3.3 · Beide Personen entfernen", prompt: "Schüler 2 und Fahrlehrer 203 scheiden beide aus. Entferne ausschließlich diese beiden Personen in einer begründeten Reihenfolge. Prüfe vorher andere Verweise und nachher, dass die bisherigen Personen und Orte erhalten geblieben sind." },
          { id: "ungueltiger-verweis", label: "4 · Zusatz: Ungültigen Verweis testen", prompt: "Prüfe, dass Ort 999 nicht existiert. Versuche dann, bei Schüler 1 die Ortnummer auf 999 zu ändern. Dokumentiere Fehlermeldung und unveränderte Ortnummer. Schalte dafür keine Schutzfunktionen aus." },
          { id: "loeschregeln", label: "5 · Zusatz: Löschregeln vergleichen", prompt: "Vergleiche RESTRICT, CASCADE und SET NULL am Beispiel eines ausgeschiedenen Fahrlehrers. Weshalb wäre das automatische Löschen seiner Schüler fachlich problematisch? Welche Voraussetzung braucht SET NULL? Verändere die Modellregeln nicht." }
        ],
        hint: "Aufträge 1–3.3 übertragen das Originalblatt. 4 und 5 sind zusätzliche Kontrollen. Eine Fehlermeldung gehört hier zum Nachweis; notiere den tatsächlichen Text deines Servers, nicht einen erfundenen Fehlercode."
      },
      notePrompts: ["Wieso kann fahrlehrer gleichzeitig Parent und Child sein?", "Warum ist ein vorhandener Fremdschlüssel noch kein Beweis für eine fachlich richtige Zuordnung?", "Welche fachliche Entscheidung muss vor dem Löschen eines Fahrlehrers geklärt werden?"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Gültige und ungültige Fremdschlüssel gezielt testen",
        intro: "Nutze ausschließlich den fiktiven Drei-Tabellen-Bestand workbenchlab_l2_3. L2.2 bleibt unverändert. Der Download legt nur den Anfangsbestand an und wird einmal ausgeführt; blockierte Befehle dokumentierst du als erwartete Beobachtung.",
        steps: [
          "Prüfe Datenbank, drei Tabellen, NOT NULL und die RESTRICT-Regeln. Bearbeite Auftrag 1.",
          "Bearbeite 2.1–2.3: Ziel und Verweise auswählen, blockierten Versuch dokumentieren, unveränderte Daten prüfen.",
          "Bearbeite 3.1–3.2: fehlenden Ort, neuen Fahrlehrer und neuen Schüler in begründeter Reihenfolge erfassen.",
          "Bearbeite 3.3: nur die beiden neu erfassten Personen kontrolliert entfernen. Die Zusatzaufträge vertiefen Verweisfehler und Löschregeln."
        ],
        evidence: "Vorher-Nachher-Protokoll mit erklärter Fehlermeldung",
        download: { href: "assets/sql/l2-3-integritaet-testdaten.sql", label: "Fiktiven Integritäts-Testbestand" },
        fileName: "L2_3_referentielle_integritaet.sql"
      },
      completionChecks: [
        "Ich habe die drei Fremdschlüssel mit Parent und Child dokumentiert.",
        "Ich habe die blockierte Löschung beobachtet, erklärt und den unveränderten Bestand geprüft.",
        "Ich habe die neuen Personen in begründeter Reihenfolge erfasst und wieder entfernt; die bisherigen Daten bleiben erhalten."
      ]
    },
    "joins": {
      courseCode: "L2.4",
      module: "lernfortschritt-2",
      duration: 120,
      subtitle: "Zusammengehörige Daten über Schlüssel verbinden, Ergebniszeilen prüfen und Gruppen auswerten.",
      workflow: ["Verbindung verstehen", "Zwei Tabellen", "Mehrere Tabellen", "Abschließen"],
      workflowHints: ["ON statt Zufall", "Fünf Einstiegsaufträge", "Grundaufträge und Transfer", "Lehrkraft bestätigt"],
      sourceMaterials: ["L2_2.3 Information Datenbankabfrage 2 Tabellen", "L2_2.3 Aufgabe Datenbankabfragen 2 Tabellen", "L2_4 Aufgabe Datenbankabfragen n Tabellen"],
      objectives: [
        "einen Equi-Join über passende Primär- und Fremdschlüssel formulieren",
        "Verknüpfung mit ON von Ergebnisfilterung mit WHERE unterscheiden",
        "mehrdeutige Attribute und mehrere Rollen derselben Tabelle qualifizieren",
        "Zeilenzahlen, Gruppen und skalare Unterabfragen fachlich kontrollieren"
      ],
      sections: [
        {
          title: "Ohne passende Verknüpfung entstehen Kombinationen",
          body: [
            "Zwei Tabellen nebeneinander in FROM ohne passende Verknüpfung erzeugen alle Kombinationen ihrer Zeilen. Bei neun Schülern und fünf Orten sind das 45 Kombinationen, nicht neun richtige Adressen. Dieses kartesische Produkt ist keine Zuordnung über einen Fremdschlüssel.",
            "Ein Equi-Join vergleicht Werte auf Gleichheit. Hier passt die Ortnummer des Schülers zum Primärschlüssel des Ortes. Im geprüften 1:N-Modell mit einem verpflichtenden gültigen Wohnort erhält ein INNER JOIN ohne weiteren Filter genau eine Ergebniszeile je Schüler. Diese Zeilenzahl ist keine allgemeine Eigenschaft aller JOINs."
          ],
          code: "SELECT f.schuelernr, o.ortnr\nFROM fahrschueler AS f\nINNER JOIN orte AS o ON f.ortnr = o.ortnr;",
          tip: "Die Originalunterlagen zeigen den Equi-Join auch mit FROM tabelle1, tabelle2 und der Schlüsselbedingung in WHERE. Wir schreiben die Verknüpfung ausdrücklich als JOIN ... ON, damit sie vom fachlichen Filter getrennt bleibt."
        },
        {
          title: "Aliasnamen machen Herkunft und Rollen sichtbar",
          body: [
            "AS f, AS l und AS o sind kurze Tabellennamen innerhalb dieser Abfrage. f.nachname stammt vom Schüler, l.nachname vom Fahrlehrer. Gleiche Attributnamen müssen eindeutig zugeordnet werden; AS fahrlehrername kann zusätzlich eine Ergebnisspalte benennen.",
            "Lies jeden Verbindungsschritt im Modell: Schüler zu Fahrlehrer über fahrlehrernr, Schüler zu Schülerort über ortnr. Für den Wohnort des Fahrlehrers wird orte ein zweites Mal mit einem anderen Alias eingebunden. Zwei Rollen derselben Tabelle sind nicht zwei verschiedene gespeicherte Ortstabellen."
          ],
          code: "fahrschueler AS f\nfahrlehrer AS l\norte AS schuelerort\norte AS lehrerort",
          tip: "Verbinde nicht Schüler und Fahrlehrer nur deshalb, weil beide dieselbe ortnr haben. Sie können am selben Ort wohnen, ohne einander zugeordnet zu sein. Entscheidend ist fahrlehrernr."
        },
        {
          title: "INNER JOIN, LEFT JOIN und gezählter Schlüssel",
          body: [
            "INNER JOIN zeigt nur passende Paare. Ein Ort ohne Schüler und eine Lehrkraft ohne Schüler fehlen dann in einer gruppierten Personenliste. LEFT JOIN erhält dagegen auch die Zeile der linken Tabelle, wenn es keinen passenden Child gibt; dessen Spalten sind im Ergebnis NULL.",
            "Bei einem LEFT JOIN zählt COUNT(*) auch die erhaltene Parent-Zeile ohne Schüler. COUNT(f.schuelernr) zählt nur tatsächlich zugeordnete Schüler und ergibt für die leere Gruppe null Personen. Gruppiere Orte nach ortnr, plz und ort sowie Lehrkräfte nach ihrem Schlüssel und den ausgegebenen Namen, nicht allein nach einem möglicherweise gleichen Namen.",
            "WHERE filtert einzelne Ergebniszeilen, HAVING fertige Gruppen. Mehr als zwei bedeutet > 2. ORDER BY legt die Ausgabeordnung fest. DISTINCT entfernt doppelte Ergebniswerte, ersetzt aber keine fehlende oder falsche JOIN-Bedingung."
          ],
          tip: "In den Aufträgen T4 und M10 sollen auch Orte bzw. Lehrkräfte ohne Schüler sichtbar werden. Diese Präzisierung lässt sich mit unserem fiktiven Bestand ausdrücklich prüfen."
        },
        {
          title: "Durchschnittswerte sind Zahlen, nicht formatierter Text",
          body: [
            "Die Zusatzaufgaben vergleichen Einzelwerte mit einem Durchschnitt. Eine skalare Unterabfrage steht in runden Klammern und liefert genau einen Wert. Eine reine AVG-Abfrage ohne GROUP BY eignet sich dazu; ein gruppiertes Ergebnis mit mehreren Zeilen passt nicht an diese Stelle.",
            "Verwende für den Vergleich den ungerundeten Zahlenwert. FORMAT liefert eine Textdarstellung für die Anzeige; eine gerundete Anzeige kann einen Vergleich direkt an der Grenze verfälschen. Kontrolliere B zunächst mit dem notierten numerischen Durchschnitt und C anschließend mit einer Unterabfrage.",
            "Bei Altersaufgaben ist gemeint, wie alt die Person im aktuellen Kalenderjahr wird. Notiere das Bezugsjahr und berechne die Kalenderjahresdifferenz, nicht das heutige Alter in vollständig vergangenen Jahren. Die Unterlagen zeigen historische Beispieljahre; heutige Werte dürfen davon abweichen."
          ],
          tip: "Alle Abfragen dieser Einheit lesen Daten. Verändere nicht den Bestand aus L2.3, um Ergebnisse passend zu machen; der Download für L2.4 enthält einen eigenen festen Anfangsbestand."
        }
      ],
      webWorksheet: {
        title: "L2.4: JOIN und Mehrtabellen-Abfragen",
        intro: "Arbeite im fiktiven Schema workbenchlab_l2_4. Beginne mit T1–T5, bearbeite anschließend M1–M15. A–G sind Zusatzaufgaben. Notiere SQL und eine Ergebniskontrolle; verwende eindeutige Aliasnamen und eine nachvollziehbare Sortierung.",
        answerPlaceholder: "SQL-Befehl, erwartete Zeilenzahl und Ergebniskontrolle ...",
        definitionGroups: [
          { label: "Zwei Tabellen · T1–T5", open: true, ids: ["t1-adressen", "t2-ein-ort", "t3-zwei-orte", "t4-ortszahl", "t5-grosse-orte"] },
          { label: "Schüler und Lehrkräfte · M1–M5", ids: ["m1", "m2", "m3", "m4", "m5"] },
          { label: "Orte und Gruppen · M6–M10", ids: ["m6", "m7", "m8", "m9", "m10"] },
          { label: "Alter und Fahrstunden · M11–M15", ids: ["m11", "m12", "m13", "m14", "m15"] },
          { label: "Zusatz · Ausgabe und Unterabfragen · A–D", ids: ["a", "b", "c", "d"] },
          { label: "Zusatz · Durchschnitte und Rollen · E–G", ids: ["e", "f", "g"] }
        ],
        definitionTerms: [
          { id: "t1-adressen", label: "T1 · Schüleradressen", prompt: "Liste alle Schüler mit Vorname, Nachname, Straße, Hausnummer, PLZ und Ort auf. Prüfe die erwartete Zeilenzahl." },
          { id: "t2-ein-ort", label: "T2 · Ein Wohnort", prompt: "Liste Vorname, Nachname, PLZ und Ort der Schüler aus Musterstadt auf." },
          { id: "t3-zwei-orte", label: "T3 · Zwei Wohnorte", prompt: "Liste Vorname, Nachname, PLZ und Ort der Schüler aus Musterstadt oder Testdorf auf." },
          { id: "t4-ortszahl", label: "T4 · Schüler je Ort", prompt: "Ermittle für jeden gespeicherten Ort die Schülerzahl, ausdrücklich einschließlich Orten ohne Schüler." },
          { id: "t5-grosse-orte", label: "T5 · Mehr als zwei", prompt: "Liste die Orte mit mehr als zwei Schülern einschließlich ihrer Schülerzahl auf." },
          { id: "m1", label: "M1 · Lehreradressen", prompt: "Liste Vor- und Nachnamen sowie Straße, Hausnummer, PLZ und Wohnort aller Fahrlehrer auf." },
          { id: "m2", label: "M2 · Schüler und Lehrkraft", prompt: "Liste alle Schüler mit Vor- und Nachname und dem Nachnamen der zugeordneten Lehrkraft auf. Benenne gleichnamige Ergebnisspalten eindeutig." },
          { id: "m3", label: "M3 · Schüler von Demo", prompt: "Wie heißen die Schüler der Fahrlehrerin mit Nachname Demo?" },
          { id: "m4", label: "M4 · Mit Schülerwohnort", prompt: "Ergänze bei M3 die Wohnorte der Schüler. Prüfe, dass du nicht den Wohnort der Lehrkraft ausgibst." },
          { id: "m5", label: "M5 · Orte ohne Dopplungen", prompt: "Aus welchen Orten kommen die Schüler des Fahrlehrers Probe? Vermeide Doppelnennungen von Ortsnamen." },
          { id: "m6", label: "M6 · Buchstabe im Ortsnamen", prompt: "Wie M5, aber nur Ortsnamen, in denen der Buchstabe e vorkommt." },
          { id: "m7", label: "M7 · Bewohnte Orte zählen", prompt: "Wie viele Schüler wohnen in den jeweiligen Orten? Zeige hier nur Orte mit mindestens einem Schüler und vergleiche mit T4." },
          { id: "m8", label: "M8 · Gruppen filtern", prompt: "Wie M7, aber nur Orte mit mehr als zwei Schülern." },
          { id: "m9", label: "M9 · Schülerzahl von Fiktiv", prompt: "Wie viele Schüler betreut die Fahrlehrkraft mit Nachname Fiktiv?" },
          { id: "m10", label: "M10 · Alle Lehrkräfte zählen", prompt: "Ermittle je Fahrlehrer die Schülerzahl, ausdrücklich auch für Lehrkräfte ohne Schüler." },
          { id: "m11", label: "M11 · Alter im Kalenderjahr", prompt: "Wie alt werden die Schüler der Lehrkraft Fiktiv im aktuellen Jahr? Gib Schülernamen und Bezugsjahr mit aus." },
          { id: "m12", label: "M12 · Durchschnittsalter", prompt: "Wie hoch ist das durchschnittliche Alter, das die Schüler von Fiktiv im aktuellen Jahr erreichen?" },
          { id: "m13", label: "M13 · Durchschnitt je Lehrkraft", prompt: "Ermittle das durchschnittliche Kalenderjahresalter der Schüler je Lehrkraft mit Schülern. Notiere das Bezugsjahr." },
          { id: "m14", label: "M14 · Fahrstunden von Probe", prompt: "Ermittle die Summe der Schüler-Fahrstunden des Fahrlehrers Probe." },
          { id: "m15", label: "M15 · Durchschnitt aller Schüler", prompt: "Ermittle die durchschnittliche Fahrstundenzahl aller Schüler. Ist hierfür überhaupt ein JOIN nötig?" },
          { id: "a", label: "A · Formatierte Ausgabe", prompt: "Stelle den Durchschnitt aus M15 mit zwei Dezimalstellen dar. Bewahre den ungerundeten Zahlenwert für die nächsten Vergleiche auf." },
          { id: "b", label: "B · Mehr als der Durchschnitt", prompt: "Welche Schüler haben mehr Fahrstunden als der Durchschnitt? Verwende zunächst den notierten numerischen Durchschnitt und prüfe die Grenze." },
          { id: "c", label: "C · Skalare Unterabfrage", prompt: "Löse B erneut, jetzt mit einer Unterabfrage für den ungerundeten Durchschnitt. Vergleiche beide Ausgaben." },
          { id: "d", label: "D · Durchschnittsalter aller", prompt: "Ermittle das durchschnittliche Alter, das alle Schüler im aktuellen Kalenderjahr erreichen. Notiere das Bezugsjahr." },
          { id: "e", label: "E · Überdurchschnittliches Alter", prompt: "Welche Schüler werden im aktuellen Jahr älter als der Altersdurchschnitt? Verwende eine Unterabfrage." },
          { id: "f", label: "F · Zwei Durchschnittsgrenzen", prompt: "Welche Schüler werden im aktuellen Jahr überdurchschnittlich alt und haben gleichzeitig überdurchschnittlich viele Fahrstunden? Prüfe beide Bedingungen getrennt und gemeinsam." },
          { id: "g", label: "G · Zwei Rollen der Ortstabelle", prompt: "Welche Schüler aus Testdorf werden von Lehrkräften betreut, die in Beispielheim wohnen? Verwende unterschiedliche Aliasnamen für Schülerort und Lehrerort." }
        ],
        hint: "Die Orts- und Lehrernamen übertragen die Originalaufträge auf fiktive Daten. T4/M10 präzisieren die Behandlung leerer Gruppen. M11–M13 und D–F verwenden Kalenderjahresalter, nicht vollständig vergangene Jahre."
      },
      notePrompts: ["Wann kann ich eine Zeile je Schüler erwarten und wann nicht?", "Warum zählt COUNT(*) bei einem LEFT JOIN eine andere Menge als COUNT(f.schuelernr)?", "Wieso braucht orte in Aufgabe G zwei Aliasnamen?"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Den Verbindungspfad aus dem Modell ablesen",
        intro: "Nutze den getrennten fiktiven Bestand workbenchlab_l2_4. Er enthält neun Schüler, vier Lehrkräfte und fünf Orte. Der einmalige Download verändert die bisherigen Datenbanken nicht. Teile die Bearbeitung bei Bedarf auf mehrere Stunden auf.",
        steps: [
          "Prüfe Schema, Datenbestand und die drei Fremdschlüssel. Notiere den Verbindungspfad für Schüler, Lehrkraft und Ort.",
          "Bearbeite T1–T5 und vergleiche die leere Ortsgruppe bei INNER JOIN und LEFT JOIN.",
          "Bearbeite M1–M15. Kontrolliere nach jedem zusätzlichen JOIN Schlüssel, Spaltenherkunft und Zeilenzahl.",
          "Bearbeite Zusatzaufgaben nach Absprache. Verwende ungerundete Zahlen für Vergleiche und dokumentiere das Bezugsjahr."
        ],
        evidence: "T1–T5 und M1–M15 mit Ergebniskontrollen; A–G als Zusatz",
        download: { href: "assets/sql/l2-4-join-testdaten.sql", label: "Fiktiven JOIN-Testbestand" },
        fileName: "L2_4_joins.sql"
      },
      completionChecks: [
        "Ich habe T1–T5 mit richtigen Schlüsselbedingungen und geprüften Zeilenzahlen bearbeitet.",
        "Ich habe M1–M15 mit eindeutigen Aliasnamen und Ergebniskontrollen dokumentiert.",
        "Ich kann leere Gruppen, COUNT beim LEFT JOIN und die beiden Rollen der Ortstabelle erklären."
      ]
    },
    "erm-beziehungsentitaet": {
      courseCode: "L3.1",
      module: "lernfortschritt-3",
      duration: 120,
      sourceMaterials: ["L3_1 Information M-N-Beziehung", "L3_1.1 bis L3_1.6 Aufgaben Datenbankmodell"],
      objectives: [
        "eine M:N-Beziehung in beiden Leserichtungen beschreiben und relational auflösen",
        "Zuordnung und wiederholbaren Vorgang unterscheiden",
        "Primärschlüssel, Fremdschlüssel und Vorgangsattribute begründet festlegen",
        "Mindestbeteiligung und zusätzliche Geschäftsregeln getrennt prüfen"
      ],
      sections: [
        {
          title: "Eine Zeile für jede Zuordnung",
          body: [
            "Ein Teilnehmer kann mehrere Kurse belegen, ein Kurs hat mehrere Teilnehmer: M:N. Ein einzelner Fremdschlüssel in einer der beiden Tabellen würde nur eine Seite auf höchstens eine Zuordnung beschränken. kursnr_1, kursnr_2 und weitere Wiederholungsspalten setzen dagegen eine künstliche Grenze.",
            "Eine relationale Datenbank kann M:N-Beziehungen darstellen: Eine zusätzliche Relation speichert jede Zuordnung als eigene Zeile mit zwei Fremdschlüsseln. Dadurch entstehen zwei 1:N-Beziehungen. Die folgende Grafik überträgt dieses Prinzip auf Kunden und Fahrräder."
          ],
          visual: "mn-associative"
        },
        {
          title: "Zuordnung oder wiederholbarer Vorgang?",
          body: [
            "Eine Belegung verbindet einen Teilnehmer mit einem Kurs. Wenn diese Kombination nur einmal vorkommen darf, kann das Paar der beiden Fremdschlüssel gemeinsam Primärschlüssel sein. Bei einem künstlichen Primärschlüssel braucht dieselbe Einmaligkeitsregel zusätzlich eine UNIQUE-Bedingung auf dem Paar.",
            "Eine Vermietung beschreibt dagegen einen konkreten Vorgang: Derselbe Kunde kann dasselbe Fahrrad später erneut mieten. Das reine Fremdschlüsselpaar wäre dafür kein geeigneter Primärschlüssel. Eine eigene Vorgangsnummer unterscheidet die Verträge; ein zusammengesetzter Schlüssel wäre nur mit weiteren, nachweislich eindeutigen Merkmalen möglich.",
            "Mietbeginn und Mietende gehören zum Mietvertrag, nicht dauerhaft zum Kunden oder Fahrrad. Eine Vorgangsnummer verhindert aber nicht, dass sich zwei Vermietungen desselben Fahrrads zeitlich überschneiden. Solche Geschäftsregeln müssen zusätzlich geprüft werden."
          ],
          tip: "Erfinde keine Eindeutigkeit: Auch Nachname, Vorname und Geburtsdatum zusammen identifizieren Menschen nicht verlässlich. Natürliche, künstliche und zusammengesetzte Schlüssel brauchen jeweils eine fachliche Begründung."
        },
        {
          title: "Die Kardinalitäten präzise lesen",
          body: [
            "In unserem Mietmodell gehört jeder Mietvertrag zu genau einem Kunden und genau einem Fahrrad. Beide Fremdschlüssel sind deshalb verpflichtend (NOT NULL). Ein Kunde oder Fahrrad darf zunächst ohne Vertrag gespeichert sein und später viele Verträge haben: jeweils 0..N.",
            "M:N beschreibt die möglichen vielen Zuordnungen, legt aber die Mindestbeteiligung nicht fest. Ob mindestens eine Zuordnung verlangt wird, ergibt sich aus dem Sachtext. Ein Fremdschlüssel allein erzwingt keine Mindestanzahl von Vorgängen je Kunde."
          ]
        }
      ],
      webWorksheet: {
        title: "M:N modellieren und begründen",
        intro: "Bearbeite zuerst Fahrschule und Fahrradvermietung. Zeichne die Modelle in Workbench und halte hier deine Entscheidungen fest. Die vier weiteren Fälle sind Transferaufgaben nach Absprache.",
        answerPlaceholder: "Modellentscheidung, Schlüssel und Begründung ...",
        definitionGroups: [
          { label: "Fahrschule · F1–F4", open: true, ids: ["f1", "f2", "f3", "f4"] },
          { label: "Fahrradvermietung · R1–R2", ids: ["r1", "r2"] },
          { label: "Nach Absprache · Immobilien", ids: ["i1", "i2"] },
          { label: "Nach Absprache · Wartungen", ids: ["w1", "w2"] },
          { label: "Nach Absprache · Motorsport", ids: ["m1", "m2"] },
          { label: "Nach Absprache · Schulen", ids: ["s1", "s2"] },
          { label: "Modellprüfung · Gewählter Transferfall", ids: ["pruefung"] }
        ],
        definitionTerms: [
          { id: "f1", label: "F1 · Fahrlehrer und Fahrzeuge", prompt: "Ein Fahrlehrer nutzt im Lauf der Zeit verschiedene Fahrzeuge; ein Fahrzeug wird von mehreren Fahrlehrern genutzt. Beschreibe beide Leserichtungen und zeichne das konzeptionelle ER-Diagramm. Notiere Annahmen zur Mindestbeteiligung." },
          { id: "f2", label: "F2 · Die Grenze eines einzelnen Fremdschlüssels", prompt: "Warum reicht ein einzelner Fremdschlüssel in fahrlehrer oder kfz nicht für diese M:N-Beziehung? Erkläre auch, warum kfz_nr_1, kfz_nr_2 usw. keine tragfähige Lösung sind." },
          { id: "f3", label: "F3 · Den Unterrichtsvorgang modellieren", prompt: "Gesucht ist: Welche Lehrkraft hat an welchem Tag mit welchem Fahrzeug wie viele Unterrichtsstunden gegeben? Löse M:N auf. Begründe Primärschlüssel, beide Fremdschlüssel und deren Pflichtbeteiligung. Dasselbe Lehrer-Fahrzeug-Paar darf erneut vorkommen. Ein Schülerbezug ist in diesem Auftrag nicht verlangt." },
          { id: "f4", label: "F4 · Attribute und Relationenmodell", prompt: "Erfasse Kennzeichen, Anschaffungsdatum und Anschaffungspreis des Fahrzeugs sowie Datum und Dauer in Stunden des Unterrichtsvorgangs. Ordne jedes Attribut begründet zu und notiere die Relationen mit PK und FK. Prüfe, ob auch zwei Vorgänge desselben Paares am selben Tag unterscheidbar bleiben." },
          { id: "r1", label: "R1 · Kunden, Fahrräder und Mietverträge", prompt: "Für jedes vermietete einzelne Fahrrad wird erfasst, welcher Kunde es in welchem Zeitraum mietet. Kunden haben Vorname, Nachname und eine vollständige Anschrift. Erstelle ER-Diagramm und Relationenmodell mit atomaren Adressattributen." },
          { id: "r2", label: "R2 · Wiederholte Vermietungen", prompt: "Derselbe Kunde mietet dasselbe Fahrrad zweimal zu verschiedenen Zeitpunkten. Zeige zwei mögliche Vertragszeilen und begründe deinen Schlüssel. Welche zusätzliche Prüfung verhindert eine zeitlich überlappende Vermietung desselben Fahrrads?" },
          { id: "i1", label: "Immobilien · Häuser und Kategorien", prompt: "Häuser haben Grundmietpreis, Wohnfläche und vollständige Adresse. Kategorien haben eindeutige Kürzel EH, DHH oder RH und eine Bezeichnung. Modelliere Kategorien und Häuser ohne mehrfach gespeicherte Kategorienbezeichnungen." },
          { id: "i2", label: "Immobilien · Der Hauptmieter", prompt: "Jeder Mietvertrag wird mit genau einer Person als Hauptmieter abgeschlossen. Erfasse Vorname, Nachname, gemietetes Haus und Mietbeginn. Erstelle das Gesamtmodell und markiere eigene Annahmen; ein Mietende ist im Ausgangsauftrag nicht gefordert." },
          { id: "w1", label: "Wartungen · Mehrere Berufsabschlüsse", prompt: "Mitarbeiter haben Vorname, Nachname und Gehalt. Ein Mitarbeiter kann mehrere Ausbildungsberufe mit eindeutigem Kürzel und Bezeichnung abgeschlossen haben. Zu jedem Abschluss gehören Termin und Note. Modelliere diese Zuordnungen und begründe den Ort von Termin und Note." },
          { id: "w2", label: "Wartungen · Zeit je beteiligter Person", prompt: "An einer Wartung mit festem Datum arbeiten mehrere Monteure; Monteure nehmen an mehreren Wartungen teil. Die Arbeitszeit in Minuten wird für jeden beteiligten Monteur getrennt erfasst. Ergänze das Modell aus dem vorigen Auftrag und unterscheide beide M:N-Beziehungen." },
          { id: "m1", label: "Motorsport · Rennen und Platzierungen", prompt: "Rennstrecken haben Name und Länge. Jede eintägige Rennveranstaltung hat Name und Datum und findet auf genau einer Strecke statt; eine Strecke hat im Lauf der Zeit viele Veranstaltungen. Teams mit Teambezeichnung nehmen an mehreren Veranstaltungen teil. Erfasse die jeweilige Platzierung und begründe ihre Zuordnung." },
          { id: "m2", label: "Motorsport · Mitglieder und Teamleitung", prompt: "Fahrer haben eine vom Verband eindeutig vergebene Lizenznummer, Vorname und Nachname; Mechaniker Vorname, Nachname und Telefonnummer. Jede Person gehört genau einem Team an. Jedes Team hat genau eine Leitung; eine Leitung kann mehrere Teams leiten und hat Vorname, Nachname und E-Mail. Ergänze ER-Diagramm und Relationenmodell und begründe einen natürlichen Schlüssel." },
          { id: "s1", label: "Schulen · Bildungsgänge und Voraussetzungen", prompt: "Bildungsgänge haben Name, erforderlichen Notenschnitt und Dauer sowie einen vorausgesetzten Schulabschluss mit Bezeichnung und Kürzel. Mehrere Bildungsgänge können denselben Abschluss voraussetzen. Modelliere diese Daten und kennzeichne PK und FK." },
          { id: "s2", label: "Schulen · Angebote zuordnen", prompt: "Schulen haben Name, Straße, Postleitzahl und Ort. Jede Schule bietet mehrere Bildungsgänge an, ein Bildungsgang wird an mehreren Schulen angeboten. Ergänze das Gesamtmodell. Begründe einen Schlüssel für die Angebotszuordnung, wenn dasselbe Angebot je Schule nur einmal vorkommen darf." },
          { id: "pruefung", label: "Modellprüfung · Eigene Annahmen sichtbar machen", prompt: "Wähle einen Transferfall. Lies jede Beziehung in beiden Richtungen, prüfe Mindestbeteiligung und wiederholbare Vorgänge und trenne verlangte Angaben von eigenen Annahmen. Speichere dein Modell und öffne die .mwb-Datei zur Kontrolle erneut." }
        ],
        hint: "1:N allein beantwortet noch nicht, ob null Zuordnungen zulässig sind. Entscheide über Schlüssel anhand der Geschäftsregel, nicht anhand der momentan vorhandenen Beispieldaten."
      },
      notePrompts: ["Wann reicht das Fremdschlüsselpaar als Primärschlüssel?", "Welches Attribut beschreibt die Verbindung statt eine der beteiligten Personen oder Sachen?", "Welche Regel wird durch meine Schlüssel noch nicht abgesichert?"],
      classroomTask: {
        tool: "MySQL Workbench EER Diagram",
        title: "Eine M:N-Beziehung als fachlichen Vorgang modellieren",
        intro: "Bearbeite Fahrschule und Fahrradvermietung in getrennten Workbench-Modellen. Die weiteren Fälle dienen dem Transfer nach Absprache. Halte Schlüsselentscheidungen und Annahmen im Arbeitsblatt fest.",
        steps: [
          "Beschreibe die ursprüngliche M:N-Beziehung in beiden Leserichtungen und löse sie in zwei 1:N-Beziehungen auf.",
          "Begründe je Modell den Primärschlüssel und beide Fremdschlüssel. Berücksichtige wiederholte Vorgänge mit demselben Paar.",
          "Ordne Vorgangsattribute und Stammdaten getrennt zu und notiere Mindestbeteiligung sowie zusätzliche Geschäftsregeln.",
          "Speichere als L3_1_fahrschule.mwb und L3_1_fahrradvermietung.mwb. Öffne beide Dateien erneut und kontrolliere Tabellen und Beziehungen."
        ],
        evidence: "Zwei EER-Diagramme und Relationenmodelle mit begründeten Schlüsseln und Attributen; weitere Fälle als Transfer",
        fileName: "L3_1_fahrschule.mwb"
      },
      completionChecks: [
        "Ich habe die Modelle für Fahrschule und Fahrradvermietung gespeichert und erneut geöffnet.",
        "Ich kann beide Fremdschlüssel, meine Schlüsselwahl und wiederholte Vorgänge erklären.",
        "Ich habe Vorgangsattribute richtig zugeordnet und Mindestbeteiligung sowie zusätzliche Geschäftsregeln begründet."
      ]
    },
    "mn-beziehungen": {
      courseCode: "L3.2",
      module: "lernfortschritt-3",
      title: "Vorgänge über mehrere Tabellen auswerten",
      duration: 180,
      subtitle: "Vorgänge über mehrere Tabellen auswerten und Summen, Mietdauer und Gruppen fachlich kontrollieren.",
      workflow: ["Modell lesen", "Fahrschule", "Fahrradvermietung", "Abschließen"],
      workflowHints: ["Verbindungspfad prüfen", "F1–F10", "R1–R16", "Lehrkraft bestätigt"],
      sourceMaterials: ["L3_2.1 Aufgabe Datenbankabfragen Fahrschule", "L3_2.2 Aufgabe Datenbankabfragen Fahrradvermietung"],
      objectives: [
        "Vorgangstabellen mit den richtigen Stammdaten über Schlüssel verbinden",
        "Datensätze, unterschiedliche Tage und aufsummierte Stunden unterscheiden",
        "Mietdauer und Umsatz mit ausdrücklich festgelegten Einheiten berechnen",
        "Zeilenfilter, Gruppenfilter und die Bezugsmenge eines Durchschnitts begründen"
      ],
      sections: [
        {
          title: "Der Vorgang bestimmt den Verbindungspfad",
          body: [
            "In der Fahrschule verbindet fahrstunden jede Unterrichtszeile mit fahrlehrer, fahrschueler und kfz. Ein Schüler kann Unterricht bei verschiedenen Lehrkräften erhalten. Verbinde deshalb über den konkreten Vorgang, nicht über einen vermeintlich dauerhaft zugeordneten Fahrlehrer.",
            "In der Fahrradvermietung verbindet vermietungen Kunde und einzelnes Fahrrad. Die Modellbezeichnung und der Tagesmietpreis liegen dagegen in modelle; der Wohnort des Kunden liegt in orte. Schreibe vor der Abfrage auf, welche Tabellen du tatsächlich brauchst. Auch bei sieben gespeicherten Tabellen muss nicht jede Abfrage alle sieben verbinden."
          ],
          code: "-- Verbindungspfad zur Modellbezeichnung\nFROM vermietungen AS v\nJOIN fahrraeder AS f ON v.fahrradnr = f.fahrradnr\nJOIN modelle AS m ON f.modellnr = m.modellnr",
          tip: "Das Modell aus L3.1 beantwortet eine andere Frage und fordert keinen Schülerbezug. Der vorgegebene Auswertungsbestand ergänzt ihn ausdrücklich um schuelernr. Prüfe das tatsächlich verwendete Schema, bevor du SQL schreibst."
        },
        {
          title: "Zeilen, Stunden und verschiedene Tage sind nicht dasselbe",
          body: [
            "Eine Zeile in fahrstunden kann mehrere Stunden enthalten. COUNT(*) zählt Unterrichtszeilen; SUM(stundenzahl) zählt die erfassten Stunden. Wenn nach Tagen gefragt ist, können mehrere Unterrichtsvorgänge am selben Datum zu nur einem gewünschten Ausgabedatum gehören. Entscheide dann bewusst über DISTINCT.",
            "Gruppiere Fahrzeuge und Personen nach ihrem Schlüssel und den ausgegebenen Merkmalen. Zwei Personen mit gleichem Nachnamen sind keine gemeinsame Gruppe. WHERE wählt einzelne Vorgänge, HAVING beispielsweise Schüler mit mehr als zwei aufsummierten Stunden. Genau zwei gehören nicht zu > 2.",
            "F4 und R14 sollen ausdrücklich auch unbenutzte Fahrzeuge zeigen. Beginne dafür bei den Fahrzeugen mit LEFT JOIN. COUNT(v.vermietnr) zählt vorhandene Vermietungen; COUNT(*) zählt auch die erhaltene Zeile ohne Vermietung. Eine fehlende SUM kannst du mit COALESCE als null Stunden darstellen."
          ]
        },
        {
          title: "Mietdauer und Umsatz brauchen eine klare Vereinbarung",
          body: [
            "DATEDIFF(bis, von) liefert die Differenz der Kalendertage; Uhrzeiten spielen dabei keine Rolle. Für diese Übungsdaten gilt: von einschließlich, bis ausschließlich. Vom 1. bis 11. Januar sind das zehn Miettage. Für denselben Anfangs- und Endtag ergeben sich null Tage. Eine inklusive Tagesabrechnung wäre eine andere Geschäftsregel und müsste ausdrücklich + 1 vereinbaren.",
            "Der Übungsumsatz ist Miettage mal Tagesmietpreis des Modells, in Euro. SUM dieser Vorgangsbeträge bildet den Gesamtumsatz. Die Beispieldaten nehmen während aller Verträge unveränderte Modellpreise an. In einem echten System müsste der vereinbarte Preis am Vertrag gespeichert werden, sonst würden spätere Preisänderungen alte Umsätze verfälschen.",
            "Ein Durchschnitt je Vermietung gewichtet jeden Vertrag einmal. Ein Durchschnitt je Fahrradart in R15/R16 gewichtet jedes einzelne Fahrrad einmal, nicht jedes Modell oder jeden Mietvertrag. Ein JOIN mit Vermietungen würde häufig vermietete Fahrräder stärker gewichten und unvermietete ausschließen."
          ],
          code: "DATEDIFF(v.bis, v.von) AS miettage",
          tip: "vermietnr identifiziert den Vorgang. Die höchste Nummer ist nicht automatisch der zeitlich neueste Mietbeginn; R5 verlangt ausdrücklich Nummer 133."
        },
        {
          title: "Aus dem echten Schema ein EER-Diagramm erzeugen",
          body: [
            "Öffne in Workbench Database > Reverse Engineer. Wähle die Verbindung local und anschließend ausschließlich die Fahrschul-Übungsdatenbank dieser Einheit. Übernimm die fünf Tabellen und aktiviere Place imported objects on a diagram. Prüfe die Meldungen und beende den Assistenten mit Finish.",
            "Ordne die Tabellen im EER-Diagramm an und kontrolliere die fünf Fremdschlüssel. Speichere mit File > Save als L3_2_fahrschule.mwb. Erzeuge in einem getrennten Modell entsprechend L3_2_fahrradvermietung.mwb mit sieben Tabellen und sechs Fremdschlüsseln. Öffne beide Dateien zur Kontrolle erneut.",
            "Reverse Engineering liest die vorhandene Struktur in ein Modell; es importiert hier nicht die Datensätze als Schülerantworten. Forward Engineering wäre die umgekehrte Richtung und ist für diesen Auftrag nicht nötig. Verändere beim Zeichnen keine bestehenden Datenbanken über Synchronize Model."
          ]
        },
        {
          title: "Bestand, Bezugsjahr und Ergebnis prüfen",
          body: [
            "Der Download legt zwei voneinander getrennte Übungsdatenbanken mit ausschließlich fiktiven Daten an: workbenchlab_l3_2_fahrschule und workbenchlab_l3_2_fahrradvermietung. Die Tabellenstruktur orientiert sich an den fünf bzw. sieben Tabellen der Vorlagen; Namen und Ergebnismengen sind bewusst andere. Die Originaldatenbanken werden nicht verändert.",
            "F8/F9 verwenden wie die Vorlage das feste Jahr 2019. Gemeint ist das Alter, das die Schüler im Kalenderjahr erreichen: 2019 minus Geburtsjahr. Das ist nicht das Alter am heutigen Tag. Gruppiere diese Alterswerte und zähle die Personen je Altersgruppe.",
            "Kontrolliere jede Abfrage an mindestens einem einzelnen Vorgang und an einer passenden Grenzgruppe. Notiere SQL, Schema, Ergebniskontrolle und Einheit. Speichere deine Abfragen als .sql-Dateien; der Anfangsbestand wird nur einmal ausgeführt."
          ]
        }
      ],
      webWorksheet: {
        title: "L3.2: Vorgänge und Mehrtabellen-Auswertungen",
        intro: "Bearbeite F1–F10 in der Fahrschul-Datenbank, R1–R16 in der Fahrradvermietung. Teile die Arbeit auf mehrere Stunden auf. Fiktive Namen ersetzen die Namen aus den Originalaufträgen; Nummern 1, 100 und 133 sowie das Bezugsjahr 2019 bleiben erhalten.",
        answerPlaceholder: "SQL-Befehl, Schema, Ergebnis und Kontrolle ...",
        definitionGroups: [
          { label: "Fahrschule · F1–F5", open: true, ids: ["f1", "f2", "f3", "f4", "f5"] },
          { label: "Fahrschule · F6–F10", ids: ["f6", "f7", "f8", "f9", "f10"] },
          { label: "Verträge und Miettage · R1–R4", ids: ["r1", "r2", "r3", "r4"] },
          { label: "Umsatz und Mietdauer · R5–R8", ids: ["r5", "r6", "r7", "r8"] },
          { label: "Miettage und Vertragsgruppen · R9–R12", ids: ["r9", "r10", "r11", "r12"] },
          { label: "Orte, Häufigkeiten und Preise · R13–R16", ids: ["r13", "r14", "r15", "r16"] }
        ],
        definitionTerms: [
          { id: "f1", label: "F1 · Unterrichtstage", prompt: "An welchen unterschiedlichen Tagen hat die Fahrlehrkraft mit Nachname Probe Unterricht gegeben? Gib jeden Tag nur einmal aus und sortiere chronologisch." },
          { id: "f2", label: "F2 · Mit Kennzeichen", prompt: "Ergänze F1 um die Kennzeichen der verwendeten Fahrzeuge. Gib jede Kombination aus Tag und Kennzeichen einmal aus. Erkläre, warum die Zeilenzahl gegenüber F1 steigen kann." },
          { id: "f3", label: "F3 · Schüler, Lehrkraft und Stunden", prompt: "An welchen Tagen erhielt Andreas Probe wie viele Stunden bei welcher Lehrkraft? Gib die einzelnen Unterrichtsvorgänge mit Datum, stundenzahl und Lehrkraftnamen aus." },
          { id: "f4", label: "F4 · Stunden je Fahrzeug", prompt: "Wie viele Stunden wurden insgesamt mit jedem Fahrzeug gegeben? Zeige Kennzeichen und Stundensumme, ausdrücklich auch das bisher unbenutzte Fahrzeug mit null Stunden." },
          { id: "f5", label: "F5 · Mehr als zwei Stunden", prompt: "Welche Schüler haben insgesamt mehr als zwei Unterrichtsstunden erhalten? Zeige Schülernummer, Namen und Stundensumme. Prüfe den Schüler mit genau zwei Stunden." },
          { id: "f6", label: "F6 · Unterrichtskosten", prompt: "Berechne die bisherigen Unterrichtskosten von Hakan Fiktiv bei 35,00 Euro je Stunde. Kontrolliere zuerst seine Stunden und gib den Kostenbetrag in Euro aus." },
          { id: "f7", label: "F7 · Stunden je Monat", prompt: "Ermittle die Stundensumme je Kalenderjahr und Monat. Sortiere nach Jahr und Monat, damit derselbe Monatsname aus verschiedenen Jahren nicht zusammenfällt." },
          { id: "f8", label: "F8 · Geburtstagsalter 2019", prompt: "Welche Alterswerte erreichen die Schüler im Kalenderjahr 2019 und wie viele Schüler gehören jeweils dazu? Gruppiere die Kalenderjahresalter und sortiere aufsteigend." },
          { id: "f9", label: "F9 · Älter als 18", prompt: "Wie F8, aber nur Altersgruppen über 18. Erläutere, warum genau 18 nicht dazugehört und warum CURRENT_DATE hier nicht das Bezugsjahr ersetzt." },
          { id: "f10", label: "F10 · Durchschnittsgehalt", prompt: "Ermittle das durchschnittliche Gehalt aller Fahrlehrer. Brauchst du dafür überhaupt einen JOIN? Vergleiche eine Handrechnung mit deiner Ausgabe." },
          { id: "r1", label: "R1 · Vermietung 1", prompt: "Welches einzelne Fahrrad gehört zur Vermietung mit vermietnr 1? Zeige Vermietnummer, Fahrradnummer und Rahmennummer." },
          { id: "r2", label: "R2 · Mit Modell", prompt: "Ergänze R1 um die Modellbezeichnung. Notiere den Verbindungspfad und die beiden Schlüsselbedingungen." },
          { id: "r3", label: "R3 · Kunde und Wohnort", prompt: "Ergänze R2 um Kundennummer, Vorname, Nachname und Wohnort des Kunden. Qualifiziere mehrdeutige Spalten mit Aliasnamen." },
          { id: "r4", label: "R4 · Miettage der Nummer 100", prompt: "Für wie viele Tage wurde welches Fahrrad in Vermietung 100 vermietet? Gib von, bis und DATEDIFF(bis, von) mit aus. In dieser Einheit zählt der Endtag nicht mit." },
          { id: "r5", label: "R5 · Preis der Nummer 133", prompt: "Wie teuer war Vermietung 133? Berechne Miettage mal Tagesmietpreis des Modells. Zeige beide Faktoren und den Gesamtbetrag in Euro." },
          { id: "r6", label: "R6 · Gesamtumsatz", prompt: "Wie hoch ist die Summe der vereinbarten Übungsbeträge aller Vermietungen? Prüfe, ob dein JOIN genau eine Zeile je vermietnr erzeugt, bevor du summierst." },
          { id: "r7", label: "R7 · Mietdauer sortieren", prompt: "Liste für jede Vermietung die Vermietnummer, Fahrradnummer und Mietdauer in Tagen. Sortiere nach Mietdauer absteigend, bei Gleichstand nach Vermietnummer aufsteigend." },
          { id: "r8", label: "R8 · Durchschnittliche Mietdauer", prompt: "Ermittle die durchschnittliche Mietdauer je Vermietung. Notiere Anzahl und Summe als Gegenprobe. Runde erst die Anzeige, nicht die einzelnen Dauern." },
          { id: "r9", label: "R9 · Sämtliche Miettage", prompt: "Wie viele Miettage wurden über alle einzelnen Verträge insgesamt erfasst? Erläutere, warum gleichzeitig vermietete unterschiedliche Fahrräder ihre Tage jeweils beitragen." },
          { id: "r10", label: "R10 · Fahrräder über 40 Tage", prompt: "Welche Fahrräder haben insgesamt mehr als 40 Miettage? Gib Fahrradnummer, Rahmennummer und Tagessumme aus. Prüfe die Gruppe mit genau 40 Tagen." },
          { id: "r11", label: "R11 · Kunden über 30 Tage", prompt: "Welche Kunden haben insgesamt mehr als 30 Miettage? Zeige Kundennummer, Namen und Tagessumme, absteigend nach Tagessumme und bei Gleichstand nach Kundennummer." },
          { id: "r12", label: "R12 · Mehr als fünf Verträge", prompt: "Welche Kunden haben mehr als fünfmal Fahrräder gemietet? Sortiere nach Vertragsanzahl absteigend und bei Gleichstand nach Kundennummer aufsteigend. Genau fünf reichen nicht." },
          { id: "r13", label: "R13 · Freiburger Kunden", prompt: "Welche Kunden aus Freiburg haben mehr als fünf Vermietungen? Trenne den Wohnortfilter in WHERE vom Gruppenfilter in HAVING." },
          { id: "r14", label: "R14 · Häufigkeit je Fahrrad", prompt: "Wie oft wurde jedes einzelne Fahrrad vermietet? Zeige ausdrücklich auch unvermietete Fahrräder mit null Vermietungen und erkläre COUNT(vermietnr) gegenüber COUNT(*)." },
          { id: "r15", label: "R15 · Mietpreis je Fahrradart", prompt: "Ermittle für jede Fahrradart mit Fahrrädern den mittleren Tagesmietpreis über die einzelnen Fahrräder. Unvermietete Fahrräder zählen mit. Begründe, warum du nicht nach Vermietungen gewichtest und warum ein Mittelwert über Modelle anders ausfallen kann." },
          { id: "r16", label: "R16 · Anschaffungskosten je Art", prompt: "Ermittle die durchschnittlichen Anschaffungswerte der einzelnen Fahrräder je Fahrradart mit Fahrrädern. Gib Fahrradart und Durchschnitt in Euro aus und prüfe die Bezugsmenge." }
        ],
        hint: "Die Originalaufträge bleiben F1–F10 und R1–R16 zugeordnet. F4/R14 präzisieren leere Fahrzeuggruppen; R15/R16 beziehen sich auf einzelne Fahrräder. Verwende die fiktiven Daten, nicht die abgebildeten Original-Ergebniszahlen."
      },
      notePrompts: ["Was zählt eine Unterrichtszeile und was zählt eine Stundensumme?", "Welche Vereinbarung steckt in DATEDIFF(bis, von)?", "Über welche Menge bilde ich den Durchschnitt?"],
      quiz: {
        question: "Eine Unterrichtszeile enthält stundenzahl = 3. Wie zählen wir die insgesamt erteilten Stunden?",
        options: ["Mit SUM(stundenzahl)", "Mit COUNT(*) unabhängig vom Inhalt", "Mit DISTINCT auf dem Nachnamen"],
        correct: 0,
        explanation: "COUNT zählt Zeilen, SUM(stundenzahl) addiert die erfasste Dauer der einzelnen Vorgänge."
      },
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Fünf und sieben Tabellen in Workbench auswerten",
        intro: "Führe den Download einmal aus. Er erzeugt zwei eigene Übungsdatenbanken, ohne frühere Bestände zu überschreiben. Wähle jeweils das passende Schema. Bearbeite die Aufgaben im SQL-Editor und halte hier deine Ergebniskontrollen fest.",
        steps: [
          "Kontrolliere mit SELECT DATABASE() das Schema. Prüfe fünf Fahrschultabellen mit acht Unterrichtsvorgängen bzw. sieben Fahrradtabellen mit siebzehn Vermietungen.",
          "Erzeuge über Database > Reverse Engineer je ein EER-Diagramm des Übungsbestands. Markiere den Verbindungspfad für F3 und R3 und speichere beide Modelle als .mwb.",
          "Bearbeite F1–F10 in workbenchlab_l3_2_fahrschule. Speichere SQL und Kontrollen als L3_2_fahrschule.sql.",
          "Bearbeite R1–R16 in workbenchlab_l3_2_fahrradvermietung. Speichere als L3_2_fahrradvermietung.sql. Kontrolliere Miettage, Umsatz, Grenzgruppen und unvermietete Fahrräder."
        ],
        evidence: "Zwei SQL-Dateien mit 26 Auswertungen und zwei geprüfte EER-Diagramme",
        download: { href: "assets/sql/l3-2-mehrtabellen-testdaten.sql", label: "Übungsdaten Fahrschule und Fahrradvermietung" },
        fileName: "L3_2_fahrschule.sql"
      },
      completionChecks: [
        "Ich habe beide EER-Diagramme aus dem tatsächlichen Übungsbestand erzeugt, gespeichert und die Verbindungspfade erklärt.",
        "Ich habe F1–F10 und R1–R16 in getrennten SQL-Dateien mit Ergebniskontrollen dokumentiert.",
        "Ich kann Mietdauer, Umsatz, Durchschnittsmenge, Grenzgruppen und die Behandlung unbenutzter Fahrzeuge begründen."
      ]
    },
    "redundanz-3nf": {
      courseCode: "L3.3",
      module: "lernfortschritt-3",
      duration: 180,
      subtitle: "Abhängigkeiten begründen, Anomalien erklären und eigene normalisierte Modelle mit SQL prüfen.",
      workflow: ["Regeln prüfen", "Modell entwickeln", "Workbench prüfen", "Abschließen"],
      workflowHints: ["Schlüssel und Annahmen", "Händler plus Transfer", "EER und JOIN-Kontrolle", "Lehrkraft bestätigt"],
      sourceMaterials: ["L3_3 Information 3NF", "L3_3.1 Aufgabe 3. Normalform", "L3_3.2 Aufgabe Überführung 3NF Zusatzstoffe", "L3_3.3 Aufgabe Überführung 3NF Warenlieferungen", "L3_3.4 Aufgabe Überführung 3NF Projektverwaltung", "L3_3.5 Aufgabe Prüfen 3NF"],
      objectives: [
        "funktionale Abhängigkeiten aus Geschäftsregeln statt aus zufälligen Daten ableiten",
        "partielle und transitive Abhängigkeiten unterscheiden",
        "Stammdaten, Zuordnungen und historische Vorgangswerte begründet trennen",
        "eine Zerlegung mit Primärschlüsseln, Fremdschlüsseln und vollständiger Rekonstruktion prüfen"
      ],
      sections: [
        {
          title: "Eine Abhängigkeit ist eine fachliche Regel",
          body: [
            "X → Y bedeutet: Zu denselben X-Werten dürfen in jeder zulässigen Belegung nur dieselben Y-Werte gehören. haendlernr → firma kann eine solche Geschäftsregel sein. Dass im kleinen Testbestand jedes Fahrzeug zufällig einen anderen Kaufpreis hat, macht kaufpreis nicht zu einem verlässlichen Schlüssel.",
            "Ein Kandidatenschlüssel bestimmt alle Attribute und enthält keinen überflüssigen Teil. Aus den Kandidatenschlüsseln wählen wir einen Primärschlüssel. Namen, Modellbezeichnungen oder Postleitzahlen sind nicht allein deshalb eindeutig, weil sie im Ausschnitt einmal vorkommen.",
            "Zwei Modelle mit unterschiedlichen Annahmen können beide begründet sein. Notiere beispielsweise, ob ein Artikel in einer Lieferung mehrfach als eigene Position erscheinen darf oder ob die Kombination aus liefnr und artnr eindeutig sein soll."
          ],
          code: "haendlernr → firma, telefon\nmodellnr → modellbezeichnung, marke\nkfznr → kennzeichen, kaufdatum, kaufpreis, haendlernr, modellnr"
        },
        {
          title: "Von atomaren Werten zur Dritten Normalform",
          body: [
            "1NF: Für den betrachteten Zweck enthält ein Attribut genau einen Wert, keine Liste gleichartiger Werte. Werden Name und E-Mail getrennt gesucht oder verwaltet, gehören sie in getrennte Attribute. Atomarität hängt vom fachlichen Verwendungszweck ab; sie bedeutet nicht, jeden Text in einzelne Wörter zu zerlegen.",
            "2NF: Nichtschlüsselattribute hängen vollständig von jedem Kandidatenschlüssel ab, nicht nur von einem echten Teil. Bei (speisenr, stoffnr) wird der Speisepreis bereits durch speisenr bestimmt. Eine zusätzliche künstliche Zeilennummer beseitigt diesen Sachverhalt nicht einfach.",
            "3NF: Für jede nichttriviale Abhängigkeit X → A muss X ein Superschlüssel sein oder A zu einem Kandidatenschlüssel gehören. In unseren einfachen Modellen hilft die Schulregel: Nichtschlüsselattribute sollen nicht transitiv über andere Nichtschlüsselattribute vom Schlüssel abhängen. Der Merksatz ersetzt bei mehreren Kandidatenschlüsseln nicht die genaue Prüfung."
          ],
          visual: "normalform-flow",
          tip: "Fremdschlüssel sichern gültige Verweise. Auch eine nicht normalisierte Tabelle kann Fremdschlüssel haben; 3NF ist keine Voraussetzung für referentielle Integrität."
        },
        {
          title: "Anomalien und eine verlustfreie Zerlegung",
          body: [
            "Eine Händlertelefonnummer steht in mehreren Fahrzeugzeilen: Eine Änderung an nur einer Stelle kann widersprüchliche Nummern erzeugen. Ohne Fahrzeug lässt sich ein neuer Händler in dieser Ausgangstabelle nicht speichern. Beim Entfernen seines letzten Fahrzeugs verschwinden auch seine Kontaktdaten. Das sind Änderungs-, Einfüge- und Löschanomalien.",
            "Zerlege nach den begründeten Abhängigkeiten und behalte die benötigten Schlüssel in den beteiligten Relationen. Ein wiederholter Markenname ist nicht automatisch ein mehrfach gespeichertes Faktum: Verschiedene Modelle dürfen derselben Marke angehören. Eine eigene Markenrelation ist besonders sinnvoll, wenn weitere Angaben zur Marke gespeichert werden müssen.",
            "Verlustfrei heißt: Ein JOIN der Zerlegung liefert wieder genau die ursprünglichen Zuordnungen, ohne fehlende und ohne zusätzliche Kombinationen. Gleiche Zeilenzahlen allein beweisen das nicht. Vergleiche Schlüssel und alle fachlichen Attribute in beiden Richtungen. Ein passender Testbestand ergänzt die Begründung, ersetzt aber keinen allgemeinen Nachweis über die Abhängigkeiten."
          ],
          visual: "redundancy"
        },
        {
          title: "Preis, Telefon und Mitarbeiterzahl haben einen Bezug",
          body: [
            "In den Lieferaufträgen bekommt derselbe Artikel je Lieferung unterschiedliche Preise. Der vereinbarte Stückpreis gehört deshalb zur Lieferposition, nicht als unveränderlicher Wert zum Artikel. Die Menge hängt ebenfalls vom konkreten Vorgang ab.",
            "Die Vorlage zeigt denselben Lieferanten mit verschiedenen Telefonnummern. Das kann auf einen Fehler, mehrere Kontakte oder einen historischen Kontakt hinweisen. Im fiktiven Download gilt ausdrücklich: kontakttelefon ist die für diese Lieferung benutzte Nummer. Bewahre beide Werte auf; wähle nicht stillschweigend eine aktuelle Stammdatennummer aus.",
            "Die Projektvorlage enthält nur einen Mitarbeiterausschnitt, aber eine Gesamtzahl je Abteilung. Im Download ist dies eine separat vorgegebene Zahl für den betrachteten Stand. COUNT auf den drei enthaltenen Mitarbeitern ersetzt sie nicht. Wenn stattdessen der vollständige aktuelle Personalbestand vorliegt, wäre die tatsächliche Zahl daraus berechenbar."
          ]
        },
        {
          title: "Eigene Modelle in Workbench umsetzen und kontrollieren",
          body: [
            "Der Download legt ausschließlich workbenchlab_l3_3 an. Vier roh-Tabellen enthalten bereits entnestete, atomare Datensätze, aber noch nicht die fertigen Zerlegungen. Die zehn pizza_-Tabellen stellen die beiden Pizzeria-Prüfmodelle nach. Personen, Kontakte und Zusatzstoffcodes sind fiktiv; daraus folgt keine Aussage über tatsächliche Lebensmittelzusatzstoffe.",
            "Entwickle ein eigenes Modell über File > New Model und Add Diagram. Verwende ein neues Schema mit Präfix workbenchlab_l3_3_, etwa workbenchlab_l3_3_haendler. Trage passende Datentypen, Primärschlüssel, Pflichtattribute und Fremdschlüssel ein. Speichere die .mwb-Datei und öffne sie erneut.",
            "Exportiere über File > Export > Forward Engineer SQL CREATE Script zunächst nur eine Datei. Prüfe Zielschemanamen, Tabellen und Verweise vor dem Ausführen. Führe keine DROP- oder ALTER-Anweisungen gegen bestehende Unterrichtsdaten aus und schalte Fremdschlüsselprüfungen nicht zur Fehlerumgehung ab.",
            "Übertrage die Ausgangsdaten in dein getrenntes Zielschema. Nutze benannte Spalten und SELECT DISTINCT für echte Stammdaten, nicht zum Verdecken fehlerhafter JOINs. Prüfe anschließend jede Ausgangszeile über Schlüssel, teste eine ungültige Referenz und dokumentiere die erwartete Ablehnung."
          ],
          tip: "Für Händler und einen weiteren Fall sind Modell und SQL-Kontrolle Pflicht. Die übrigen Fälle werden nach Absprache vertieft. Bei Pizzeria Z1 kann ein bereits normalisiertes Modell auch ein begründetes positives Prüfergebnis erhalten."
        }
      ],
      webWorksheet: {
        title: "L3.3: 3NF analysieren und in Workbench prüfen",
        intro: "Beginne mit G1–G3 und H1–H4. Wähle anschließend einen Transferfall nach Absprache. Die Gruppen decken alle fünf Vorlagenfälle ab. Dokumentiere Annahmen, Abhängigkeiten, EER-Modell und SQL-Kontrolle.",
        answerPlaceholder: "Abhängigkeit, Modellentscheidung und Prüfergebnis ...",
        definitionGroups: [
          { label: "Grundlagen · G1–G3", open: true, ids: ["g1", "g2", "g3"] },
          { label: "Kfz-Händler · H1–H4", ids: ["h1", "h2", "h3", "h4"] },
          { label: "Speisen und Zusatzstoffe · S1–S3", ids: ["s1", "s2", "s3"] },
          { label: "Warenlieferungen · W1–W3", ids: ["w1", "w2", "w3"] },
          { label: "Projektverwaltung · P1–P3", ids: ["p1", "p2", "p3"] },
          { label: "Pizzeria prüfen · Z1–Z3", ids: ["z1", "z2", "z3"] },
          { label: "Gemeinsame Modellprüfung", ids: ["pruefung"] }
        ],
        definitionTerms: [
          { id: "g1", label: "G1 · Normalformregeln", prompt: "Erkläre 1NF, 2NF und 3NF in eigenen Worten. Unterscheide Teilschlüsselabhängigkeit und transitive Abhängigkeit. Beziehe die Prüfung auf begründete Kandidatenschlüssel." },
          { id: "g2", label: "G2 · Ziele und Anomalien", prompt: "Nenne die Ziele der Normalisierung und erläutere je eine Änderungs-, Einfüge- und Löschanomalie anhand der Kfz-Händlerdaten." },
          { id: "g3", label: "G3 · Regeln statt Zufall", prompt: "Warum belegt ein momentan einmaliger Name noch keinen Schlüssel? Warum beweisen Fremdschlüssel oder nur gleiche Zeilenzahlen nach einem JOIN noch keine 3NF bzw. verlustfreie Zerlegung?" },
          { id: "h1", label: "H1 · Händlerdaten lesen", prompt: "Untersuche haendler_roh. Ein Fahrzeug wird in diesem Übungsfall einmal gekauft, jeder Händler hat eine aktuelle Firma und Telefonnummer, jedes Modell eine Bezeichnung und Marke. Notiere Schlüssel und Abhängigkeiten. Kennzeichen werden im betrachteten Bestand eindeutig vergeben; ihre dauerhafte Eindeutigkeit außerhalb dieses Falls wird nicht angenommen." },
          { id: "h2", label: "H2 · Abhängigkeiten unterscheiden", prompt: "Welche Händler- und Modellangaben hängen transitiv von kfznr ab? Zeige, an welchen Zeilen eine Telefonnummer mehrfach korrigiert werden müsste. Erkläre, weshalb mehrere Modelle denselben Markennamen tragen dürfen." },
          { id: "h3", label: "H3 · Eigenes EER-Modell", prompt: "Entwickle in Workbench ein ER-/Relationenmodell in 3NF für Händler, Modelle und Fahrzeuge. Ordne Kaufdatum und individuellen Kaufpreis zu. Begründe jede Beziehung, ihre Mindestbeteiligung und die Schlüssel. Verlangt dieser Fall zwingend eine eigene Markenrelation?" },
          { id: "h4", label: "H4 · Händlerdaten rekonstruieren", prompt: "Erzeuge dein getrenntes Zielschema, übertrage alle vier Fahrzeugdatensätze und rekonstruiere haendler_roh mit JOIN. Vergleiche kfznr und sämtliche Attribute in beiden Richtungen, nicht nur COUNT(*). Speichere Modell und Prüfabfragen." },
          { id: "s1", label: "S1 · Speisen und Zuordnungen", prompt: "Untersuche speisen_roh mit Schlüssel (speisenr, stoffnr). Im Übungsfall hat jede Speise eine aktuelle Bezeichnung und einen Preis, jeder Stoff eine Bezeichnung und genau eine Kategorie, jedes Kategoriekürzel eine Kategoriebezeichnung. Welche Attribute werden bereits durch speisenr, welche durch stoffnr bestimmt? Ein Stoff kann zu mehreren Speisen gehören. Die Codes Z1 usw. sind reine fiktive Übungscodes." },
          { id: "s2", label: "S2 · Kategorien und Preis", prompt: "Begründe den Ort von Speisenpreis, Stoffbezeichnung, Kategoriekürzel und Kategoriebezeichnung. Zeige eine transitive Abhängigkeit und eine mögliche Einfügeanomalie für eine neue Speise ohne Zusatzstoffzuordnung." },
          { id: "s3", label: "S3 · Modell und Zuordnungsprüfung", prompt: "Erstelle das EER-/Relationenmodell mit Speisen, Stoffen, Kategorien und Zuordnungen. Dasselbe Paar darf in diesem Fall nur einmal vorkommen. Prüfe die fünf ursprünglichen Zuordnungen per JOIN, ohne neue Paare zu erzeugen." },
          { id: "w1", label: "W1 · Preis je Lieferposition", prompt: "Untersuche lieferungen_roh mit Schlüssel (liefnr, artnr). Im Übungsfall kommt ein Artikel pro Lieferung höchstens einmal vor. Zeige mit zwei Zeilen, weshalb artnr den vereinbarten Stückpreis nicht bestimmt. Welche Attribute gehören zum Artikel, zur Lieferung und zur Position?" },
          { id: "w2", label: "W2 · Unterschiedliche Telefonnummern", prompt: "Derselbe Lieferant hat verschiedene kontakttelefon-Werte. Diskutiere mögliche fachliche Ursachen. Für diesen Bestand gilt: Es ist der bei der jeweiligen Lieferung benutzte Kontakt. Wie erhält dein Modell beide Werte ohne stillschweigende Bereinigung?" },
          { id: "w3", label: "W3 · Lieferung modellieren", prompt: "Entwickle das Modell für Lieferanten, Lieferungen, Artikel und Positionen. Ordne Datum, Kontakt, Menge und historischen Stückpreis zu. Übertrage die vier Positionen und rekonstruiere alle Ausgangsattribute einschließlich beider Kontaktwerte." },
          { id: "p1", label: "P1 · Mitarbeit im Projekt", prompt: "Untersuche projekte_roh mit Schlüssel (mitarbeiternr, projektnr). Mitarbeiter können mehrere Projekte haben. Wem gehören Name, E-Mail, Projektstart und Anzahl der im Projekt geleisteten Arbeitstage? Begründe partielle Abhängigkeiten." },
          { id: "p2", label: "P2 · Abteilung und Gesamtzahl", prompt: "Jeder Mitarbeiter gehört im betrachteten Stand genau einer Abteilung an. Die Gesamtmitarbeiterzahl ist eine separate Vorgabe, nicht die Anzahl der hier sichtbaren Personen. Zeige die transitive Abhängigkeit über abteilungsnr und erkläre, wann COUNT stattdessen die richtige Quelle wäre." },
          { id: "p3", label: "P3 · Projekte verlustfrei zerlegen", prompt: "Entwickle das EER-/Relationenmodell und ordne Arbeitstage der konkreten Beteiligung zu. Rekonstruiere alle vier Beteiligungen. Prüfe besonders, dass die Person in zwei Projekten ihre beiden unterschiedlichen Arbeitstage behält." },
          { id: "z1", label: "Z1 · Pizzeria-Grundmodell", prompt: "Prüfe pizza_kunden, pizza_bestellungen, pizza_bestellpositionen, pizza_pizzen, pizza_zutaten und pizza_zuordnungen auf 3NF. Unterstelle pro Identifikationsnummer eindeutige Stammdaten. Unterscheide einen Normalformverstoß von der noch nicht abgesicherten Regel, dass dasselbe Pizza-Zutaten-Paar höchstens einmal vorkommen darf." },
          { id: "z2", label: "Z2 · Fahrzeuge und Händler", prompt: "Prüfe zusätzlich pizza_orte, pizza_fahrer, pizza_fahrzeuge und pizza_auslieferungen. Fahrzeuge enthalten haendlernr, Firma und Händleradresse. Welche Abhängigkeit verletzt bei diesen Annahmen 3NF? Verbessere das Workbench-Modell und erhalte jede Fahrzeug-Händler-Zuordnung." },
          { id: "z3", label: "Z3 · Lieferfahrt und Annahmen", prompt: "Im Ausgangsmodell gehört eine Auslieferung zu genau einer Bestellung; eine Bestellung hat höchstens eine Auslieferung. Fahrer können verschiedene Fahrzeuge benutzen. Erkläre den Ort von Lieferdatum, Fahrer und Fahrzeug sowie die UNIQUE-Regel auf best_nr. Wie müsste sich das Modell bei mehreren Teillieferungen ändern? Erkläre außerdem, weshalb PLZ allein keinen verlässlichen Wohnortschlüssel garantiert." },
          { id: "pruefung", label: "Prüfung · Modell und SQL-Nachweis", prompt: "Prüfe Händler und deinen gewählten Transferfall: Abhängigkeiten begründet, Kandidatenschlüssel berücksichtigt, Fremdschlüssel gesetzt, keine Ausgangszuordnung verloren oder ergänzt. Dokumentiere eine abgewiesene ungültige Referenz und öffne deine gespeicherten .mwb-Dateien erneut." }
        ],
        hint: "Fälle H, S, W, P und Z entsprechen den fünf Originalvorlagen. Die Testdaten sind entnestete Ausgangswerte, keine Musterzerlegung. Historische Kontakte und Preise dürfen bei der Normalisierung nicht verschwinden."
      },
      notePrompts: ["Welche Geschäftsregel rechtfertigt meine Abhängigkeit?", "Ist dieser Wert Stammdatum oder historischer Vorgangswert?", "Wie prüfe ich fehlende und zusätzliche Zuordnungen?"],
      quiz: {
        question: "Ein Händler hat eine aktuelle Telefonnummer. In fahrzeuge(kfznr, haendlernr, telefon) ist nur kfznr ein Kandidatenschlüssel. Welche Begründung passt zur 3NF-Prüfung?",
        options: [
          "haendlernr bestimmt telefon, ist aber kein Superschlüssel; telefon gehört zu keinem Kandidatenschlüssel. Die Händlerdaten werden getrennt modelliert.",
          "Jede wiederholte Zahl verletzt automatisch 3NF, auch ein Fremdschlüssel.",
          "Die Tabelle ist in 3NF, sobald sie irgendeinen Fremdschlüssel enthält."
        ],
        correct: 0,
        explanation: "Der Verstoß folgt aus der fachlichen Abhängigkeit und den Kandidatenschlüsseln, nicht allein aus ähnlichen Zellwerten. Ein Fremdschlüssel kann die Zuordnung nach der Zerlegung sichern."
      },
      classroomTask: {
        tool: "MySQL Workbench EER Diagram und SQL Editor",
        title: "Eigene 3NF-Modelle mit SQL überprüfen",
        intro: "Bearbeite Händler und einen Transferfall. Der einmalige Download erstellt nur den fiktiven Ausgangsbestand workbenchlab_l3_3. Entwickle deine Zielmodelle selbst in getrennten Schemas; andere Unterrichtsdaten bleiben unverändert.",
        steps: [
          "Lies die Ausgangstabellen im SQL-Editor und notiere Kandidatenschlüssel, Geschäftsregeln und funktionale Abhängigkeiten.",
          "Erstelle für Händler und einen Transferfall eigene EER-Diagramme mit PK/FK, Datentypen und Pflichtbeteiligung. Speichere als L3_3_haendler.mwb und L3_3_transfer.mwb.",
          "Exportiere die CREATE-Skripte und prüfe sie vor dem Ausführen in neuen Schemas mit Präfix workbenchlab_l3_3_. Übertrage die Ausgangsdaten, ohne die roh-Tabellen zu verändern.",
          "Rekonstruiere jede Ausgangszuordnung per JOIN. Vergleiche sämtliche Attribute in beiden Richtungen und teste eine ungültige Referenz. Speichere die Prüfungen als L3_3_pruefung.sql und öffne beide Modelle erneut."
        ],
        evidence: "Zwei begründete EER-Modelle, CREATE-Skripte und SQL-Rekonstruktionsprüfung",
        download: { href: "assets/sql/l3-3-normalisierung-ausgangsdaten.sql", label: "Fiktive 3NF-Ausgangsdaten" },
        fileName: "L3_3_haendler.mwb"
      },
      completionChecks: [
        "Ich habe Händler und einen Transferfall mit begründeten Schlüsseln, Abhängigkeiten und Annahmen modelliert.",
        "Ich habe eigene Zielschemata angelegt und alle Ausgangszuordnungen ohne Verlust oder zusätzliche Kombinationen geprüft.",
        "Ich habe die SQL-Kontrollen gespeichert, eine ungültige Referenz getestet und beide .mwb-Dateien erneut geöffnet."
      ]
    },
    "normalisierung": {
      courseCode: "L4.1",
      module: "lernfortschritt-4",
      duration: 150,
      subtitle: "Vom Listenfeld über nachvollziehbare Zwischenstufen zum eigenen EER-Modell und geprüften SQL-Ergebnis.",
      workflow: ["Informieren", "Stufen entwickeln", "In Workbench umsetzen", "Abschließen"],
      workflowHints: ["Anomalien und Regeln", "Filmstudio und Tanzschule", "Modelle und SQL-Nachweis", "Lehrkraft bestätigt"],
      sourceMaterials: ["L4_1 Aufgabe Normalisierung_Grundlagen", "L4_2.1 Aufgabe 1NF", "L4_2.2 Aufgabe 2NF", "L4_2.3 Aufgabe 3NF", "L4_3 Vertiefungsaufgabe Normalisierung", "L4_3 Information Übersicht Normalformen"],
      objectives: [
        "Wiederholungsgruppen auflösen, ohne Rollen oder Teilnehmer falsch zu kombinieren",
        "Kandidatenschlüssel, partielle und transitive Abhängigkeiten in jeder Stufe begründen",
        "Zwischenmodelle und das 3NF-Modell getrennt in Workbench speichern",
        "alle ursprünglichen Besetzungen und Kursanmeldungen mit SQL rekonstruieren"
      ],
      sections: [
        {
          title: "Ein nachvollziehbarer Weg statt nur einer Endlösung",
          body: [
            "Unnormalisierte Daten können Änderungs-, Einfüge- und Löschanomalien verursachen. In diesem Unterrichtsweg arbeiten wir drei Stufen durch: 1NF, 2NF und 3NF. Es gibt auch weitere Normalformen; drei ist hier der vereinbarte Zielumfang, nicht die Anzahl aller Normalformen.",
            "Notiere vor jeder Zerlegung die Geschäftsregeln und Kandidatenschlüssel. 1NF verlangt für den Zweck atomare Werte. 2NF prüft vollständige Abhängigkeit der Nichtschlüsselattribute von allen Kandidatenschlüsseln. 3NF prüft jede nichttriviale Abhängigkeit X → A: X muss ein Superschlüssel sein oder A zu einem Kandidatenschlüssel gehören. Die einfachen Fälle hier verwenden die transitive Abhängigkeit als anschaulichen Verstoß."
          ],
          visual: "normalform-flow",
          tip: "Jede Stufe erhält eigene Relationen, Schlüssel und eine kurze Begründung. Eine künstliche Zeilennummer beseitigt fachliche Abhängigkeiten nicht."
        },
        {
          title: "Filmstudio: Listen in zusammengehörige Zeilen überführen",
          body: [
            "filmstudio_unf enthält drei Personen. In ihren Listenfeldern gehören die jeweils ersten, zweiten usw. Einträge zusammen: Rolle, Filmnummer, Filmtitel, Kategorienummer und Kategoriename bilden eine gemeinsame Besetzung. Der Download trennt Listeneinträge mit |. Das ist absichtlich ein unnormalisierter Ausgangszustand, keine Empfehlung für eine echte Datenbank.",
            "Für diesen Fall spielt jede Person in einem Film höchstens eine Rolle. Schauspielernummer bestimmt Vor- und Nachname; Filmnummer bestimmt Titel und genau eine Kategorienummer; Kategorienummer bestimmt den Kategorienamen. Filmtitel und Namen gelten nicht als eindeutige Schlüssel.",
            "Erzeuge in 1NF genau fünf Besetzungszeilen mit getrennten Attributen für Vor- und Nachname. Verwende (schauspielernr, filmnr) als Kandidatenschlüssel. Uwe Demo spielt in zwei verschiedenen Filmen zwei verschiedene Rollen. Ein Kreuzprodukt seiner zwei Filme mit seinen zwei Rollen würde vier falsche Kombinationen erzeugen."
          ],
          code: "SELECT schauspielernr, name, rollen, filmnummern\nFROM workbenchlab_l4.filmstudio_unf\nORDER BY schauspielernr;",
          warning: "Die Vorlage verwendet für dieselbe Person in verschiedenen Stufen unterschiedliche Vornamen. Im fiktiven Bestand bleibt die Identität je schauspielernr unverändert. Bereinige Widersprüche nur mit einer ausdrücklich dokumentierten fachlichen Entscheidung."
        },
        {
          title: "Filmstudio: erst Teilschlüssel, dann Kategorie prüfen",
          body: [
            "In deiner 1NF hängt der Personenname nur von schauspielernr ab, die Filmangaben nur von filmnr. Die Rolle gehört zur gesamten Besetzung. Trenne für 2NF Personen, Filme und Besetzungen. Lasse in der Filmrelation zunächst Kategorienummer und Kategoriename zusammen stehen, damit der nächste Schritt sichtbar bleibt.",
            "filmnr → kategorienr → kategoriename ist eine transitive Abhängigkeit. Trenne diese Angabe für 3NF in eine eigene Kategorienrelation und verknüpfe über den Schlüssel. Bewahre die Rolle bei der Besetzung. Ein Film mit demselben Kategorienamen ist kein Duplikat eines anderen Films.",
            "Prüfe die Variante: Falls eine Person in einem Film mehrere Rollen spielen darf, reicht das Paar aus Person und Film nicht mehr als Schlüssel. Begründe dann einen zusätzlichen Rollen- oder Besetzungsschlüssel und passe die Eindeutigkeitsregel an."
          ]
        },
        {
          title: "Tanzschule: Kursname ist nicht Kursangebot",
          body: [
            "tanzschule_unf enthält sieben Kursangebote, drei Lehrkräfte und Listen mit insgesamt 28 Anmeldungen von 16 fiktiven Personen. Wiederkehrende Schülernummern beziehen sich auf dieselbe Person. In 1NF ordnest du die Schülernummern, Vornamen, Nachnamen und Telefone jeweils nach ihrer Listenposition zu und löst Kursbeschreibung, Preis sowie Beginn und Ende in eigene Attribute auf.",
            "Im Übungsfall hat jedes Angebot eine eigene kursnr, genau eine Lehrkraft, einen angebotsspezifischen Preis und feste Termine. Ein Schüler meldet sich je Angebot höchstens einmal an. Derselbe Tanzstil kann zu unterschiedlichen Zeiten, bei unterschiedlichen Lehrkräften und mit unterschiedlichen Preisen angeboten werden. Aus zufällig gleichen Preisen folgt keine Abhängigkeit tanzstil → preis.",
            "Verwende für eine Anmeldung (kursnr, schuelernr). Untersuche in 2NF Angaben, die nur vom Kurs oder nur von der Person abhängen. Prüfe in 3NF die Lehrkraftangaben über lehrernr. Modellvarianten mit einer eigenen Tanzstilrelation sind möglich, wenn du zusätzliche Stilinformationen oder entsprechende Regeln begründest."
          ],
          tip: "Zwei Foxtrott-Angebote müssen erhalten bleiben. Eine Person in mehreren Kursen ist ebenfalls keine doppelte Anmeldung, solange das Kurs-Person-Paar verschieden ist."
        },
        {
          title: "Zwischenstände in Workbench sichern und nachweisen",
          body: [
            "Lade den Ausgangsbestand herunter, prüfe das Schema workbenchlab_l4 und führe die Einrichtung einmal aus. Die beiden unf-Tabellen bleiben unverändert. Entwickle für Filmstudio und Tanzschule eigene Stufen in neuen Schemas mit Präfix workbenchlab_l4_.",
            "Erstelle die Tabellen und Beziehungen mit File > New Model und Add Diagram. Speichere je Fall eigene 1NF-, 2NF- und 3NF-Modelldateien. Markiere Primärschlüssel und passende Pflichtfelder; sichere Verweise durch Fremdschlüssel. Exportiere die CREATE-Skripte über File > Export > Forward Engineer SQL CREATE Script und prüfe vor dem Ausführen die Zielnamen. Bestätige keine Löschanweisungen gegen vorhandene Unterrichtsschemas.",
            "Übertrage die atomaren Ausgangszeilen mit benannten Spalten. Füge zuerst Stammdaten und danach Zuordnungen ein. Rekonstruiere die fünf Besetzungen beziehungsweise 28 Anmeldungen durch JOIN; vergleiche alle Schlüssel und Werte, nicht nur COUNT. Prüfe zusätzlich eine ungültige Referenz und eine doppelte Zuordnung. Beide müssen bei deinem gewählten Modell abgewiesen werden."
          ],
          tip: "Ein erfolgreicher Test belegt diesen Bestand. Der allgemeine Nachweis der Zerlegung benötigt weiterhin deine begründeten Abhängigkeiten. Speichere die SQL-Prüfungen und öffne die .mwb-Dateien erneut."
        }
      ],
      webWorksheet: {
        title: "L4.1: Filmstudio und Tanzschule schrittweise normalisieren",
        intro: "Bearbeite zuerst die Grundlagen und Filmstudio-Stufen, anschließend die Tanzschule als Transfer. Halte jede Zwischenstufe mit Attributen, Schlüsseln und Begründung fest. Die fertigen Modelle erstellst du selbst in Workbench.",
        answerPlaceholder: "Relationen, Schlüssel, Abhängigkeit und Prüfergebnis ...",
        definitionGroups: [
          { label: "Grundlagen · G1–G2", open: true, ids: ["g1", "g2"] },
          { label: "Filmstudio · 1NF", ids: ["f1", "f2"] },
          { label: "Filmstudio · 2NF und 3NF", ids: ["f3", "f4", "f5", "f6"] },
          { label: "Tanzschule · Transfer", ids: ["t1", "t2", "t3", "t4"] },
          { label: "Workbench-Nachweis", ids: ["pruefung"] }
        ],
        definitionTerms: [
          { id: "g1", label: "G1 · Nachteile erläutern", prompt: "Erkläre Änderungs-, Einfüge- und Löschanomalien anhand des Filmstudios. Welche Informationen würden beim Löschen der letzten Besetzung eines Films verloren gehen?" },
          { id: "g2", label: "G2 · Schritte begründen", prompt: "Welche drei Normalformen behandeln wir hier? Notiere die jeweilige Prüfregel und erkläre, weshalb es weitere Normalformen geben kann und eine zusätzliche Zeilennummer nicht automatisch alle Probleme löst." },
          { id: "f1", label: "F1 · Zusammengehörige Listen", prompt: "Lies filmstudio_unf in Workbench. Notiere die fünf korrekten Person-Film-Rollen-Zuordnungen. Warum dürfen die Listen einer Person nicht unabhängig miteinander kombiniert werden?" },
          { id: "f2", label: "F2 · Erste Normalform", prompt: "Schreibe die atomare Relation mit fünf Zeilen, getrennten Namen und Schlüssel (schauspielernr, filmnr). Begründe den Schlüssel mit der Regel höchstens eine Rolle pro Person und Film." },
          { id: "f3", label: "F3 · Zweite Normalform", prompt: "Notiere alle partiellen Abhängigkeiten und die Relationen der 2NF mit ihren Schlüsseln. Wem gehört die Rolle? Warum bleiben Kategorienummer und Kategoriename in dieser Zwischenstufe zunächst beim Film?" },
          { id: "f4", label: "F4 · Dritte Normalform", prompt: "Zeige filmnr → kategorienr → kategoriename. Notiere die 3NF-Relationen, Fremdschlüssel und die vermiedene Anomalie. Begründe, weshalb mehrere Filme dieselbe Kategorie haben dürfen." },
          { id: "f5", label: "F5 · Stufen in Workbench", prompt: "Erstelle und speichere getrennte EER-Modelle für 1NF, 2NF und 3NF. Erzeuge deine eigenen Schemas und rekonstruiere alle fünf Besetzungen per JOIN. Vergleiche sämtliche Attribute mit den atomaren Ausgangszeilen." },
          { id: "f6", label: "F6 · Andere Geschäftsregel", prompt: "Eine Person darf nun in einem Film mehrere Rollen spielen. Welche Schlüssel- und Eindeutigkeitsregel ändert sich? Erkläre, weshalb die ursprüngliche Paarregel nicht mehr passt." },
          { id: "t1", label: "T1 · Tanzschule in 1NF", prompt: "Löse Kursbeschreibung und Teilnehmerlisten in atomare Attribute auf. Notiere den Schlüssel jeder Anmeldung. Prüfe 28 Anmeldungen, sieben Angebote und 16 verschiedene Personen. Halte die Reihenfolge der zusammengehörigen Listeneinträge ein." },
          { id: "t2", label: "T2 · Tanzschule in 2NF", prompt: "Unterscheide Kurs-, Personen- und Anmeldungsangaben. Notiere die partiellen Abhängigkeiten und Zwischenrelationen. Warum dürfen zwei Foxtrott-Angebote mit unterschiedlichen Terminen und Preisen nicht zu einem Angebot verschmolzen werden?" },
          { id: "t3", label: "T3 · Tanzschule in 3NF", prompt: "Prüfe die transitive Abhängigkeit über lehrernr. Zeichne das eigene EER-Modell mit Kursen, Lehrkräften, Personen und Anmeldungen und begründe PK, FK und Pflichtbeteiligung. Ist tanzstil → preis wirklich eine Regel dieses Bestands?" },
          { id: "t4", label: "T4 · Tanzschule nachweisen", prompt: "Erzeuge dein 3NF-Schema und rekonstruiere alle 28 Anmeldungen samt Namen, Telefonen, Lehrkraft, Kursstil, Preis und Terminen. Prüfe auch eine Person mit mehreren Kursen, ein Angebot ohne Anmeldung und eine abgewiesene doppelte Anmeldung." },
          { id: "pruefung", label: "Prüfung · Stufen und Dateien", prompt: "Dokumentiere für beide Fälle gespeicherte 1NF-, 2NF- und 3NF-Modelle, die erneut geöffneten Dateien, CREATE- und Prüfscripte sowie die Ergebnisse ungültiger Verweise. Begründe die Verlustfreiheit über Abhängigkeiten und ergänze den Vergleich aller Ausgangsattribute." }
        ],
        hint: "Listenpositionen erhalten Zuordnungen. Nummern sind Identifikatoren; gleiche Namen, Stile oder Preise sind allein noch keine Abhängigkeiten."
      },
      notePrompts: ["Welcher konkrete Verstoß wird in dieser Stufe beseitigt?", "Welche Zuordnung muss unverändert erhalten bleiben?", "Welche Annahme bestimmt meinen Kandidatenschlüssel?"],
      classroomTask: {
        tool: "MySQL Workbench · EER und SQL",
        title: "Filmstudio und Tanzschule mit prüfbaren Zwischenstufen umsetzen",
        intro: "Erstelle eigene Stufenmodelle für beide Vorlagenfälle. Der Download enthält nur den fiktiven Listen-Ausgangsbestand, nicht die fertige Zerlegung.",
        steps: [
          "Öffne und prüfe den Download, richte workbenchlab_l4 einmal ein und lies die beiden Ausgangstabellen. Löse ihre Listen mit erhaltener Zuordnung zu atomaren Zeilen auf.",
          "Erstelle je Fall in Workbench getrennte 1NF-, 2NF- und 3NF-Modelle. Dokumentiere in jeder Stufe Kandidatenschlüssel, Abhängigkeiten und PK/FK. Speichere die sechs Modelldateien.",
          "Exportiere und kontrolliere CREATE-Skripte für eigene Zielschemata mit Präfix workbenchlab_l4_. Übertrage die atomaren Daten, zuerst Stammdaten und dann Zuordnungen. Verändere die Ausgangstabellen nicht.",
          "Prüfe fünf Besetzungen und 28 Anmeldungen auf alle Ausgangsattribute. Teste eine ungültige Referenz und doppelte Paare. Zeige bei der Tanzschule auch ein neu angelegtes Angebot ohne Anmeldung.",
          "Speichere deine Nachweise als L4_1_pruefung.sql. Öffne die Modelldateien erneut und erläutere der Lehrkraft für jede Stufe den beseitigten Verstoß."
        ],
        evidence: "Sechs Stufenmodelle, atomare Ausgangszeilen und gespeicherte CREATE-/SQL-Prüfscripte",
        download: { href: "assets/sql/l4-1-normalisierung-listendaten.sql", label: "Filmstudio und Tanzschule herunterladen" },
        fileName: "L4_1_film_1nf.mwb / L4_1_film_2nf.mwb / L4_1_film_3nf.mwb; entsprechend tanz"
      },
      completionChecks: [
        "Ich habe für Filmstudio und Tanzschule 1NF, 2NF und 3NF getrennt begründet und als Modelle gespeichert.",
        "Ich habe alle fünf Besetzungen und 28 Anmeldungen ohne veränderte oder zusätzliche Zuordnungen rekonstruiert.",
        "Meine Schlüsselregeln weisen ungültige Referenzen und doppelte Paare ab; die .mwb-Dateien lassen sich erneut öffnen."
      ],
      quiz: {
        question: "Warum darf die Rolle nicht allein bei schauspieler gespeichert werden?",
        options: ["Die Rolle hängt von der konkreten Person-Film-Besetzung ab; dieselbe Person spielt in verschiedenen Filmen verschiedene Rollen.", "Weil Textspalten grundsätzlich nicht erlaubt sind.", "Weil jede Tabelle genau drei Spalten benötigt."],
        correct: 0,
        explanation: "Die Geschäftsregel bestimmt den Bezug: Personenname gehört zur Person, Filmtitel zum Film und Rolle zur Besetzung."
      }
    },
    "big-data": {
      courseCode: "L5.2",
      module: "lernfortschritt-5",
      duration: 60,
      sourceMaterials: ["L5_2 Information Definition Big Data", "L5_2 Aufgabe Definition Big Data", "L5_3 und L5_5 Aufgaben zu Gefahren und Nutzen"],
      sections: [
        {
          title: "Drei Perspektiven auf Big Data",
          body: ["Volume bezeichnet den Umfang, Variety unterschiedliche Quellen und Formate, Velocity die Geschwindigkeit der Entstehung beziehungsweise nötigen Verarbeitung. Das 3V-Modell ist ein Einstieg; es gibt weitere Merkmale. Entscheidend ist auch, ob Speicherung und Analyse skalierbare Verfahren benötigen.", "Der Download enthält nur wenige Zeilen. Er ist kein echtes Big-Data-System und kein Beweis dafür, dass Workbench beliebige Massendaten ohne weiteres verarbeiten kann. Wir verwenden ihn, um Analysefragen im Kleinen nachvollziehbar zu prüfen."],
          tip: "Anzahlen von Zeilen sind nicht automatisch Datenvolumen in Byte. Zeitstempel messen nicht die Ausführungsleistung des Servers."
        },
        {
          title: "Datenrate und Vielfalt selbst untersuchen",
          body: ["Nutze workbenchlab_l5 aus L5.1 weiter. Zähle die Aktivitätsereignisse und gruppiere sie pro Kalenderminute. DATE_FORMAT(zeitpunkt, '%Y-%m-%d %H:%i') bildet einen Minutenschlüssel. Diese Abfrage misst die beobachtete Ereignisrate im Ausschnitt, nicht eine dauerhafte Echtzeitleistung.", "Vergleiche Aktivitäts-, Standort-, Miet- und Wetterdaten. Verschiedene Tabellen sind hier unterschiedliche fachliche Quellen, aber noch kein vollständiges Beispiel für Variety mit Bildern, Freitext und Sensordatenströmen. Erkläre, welche zusätzlichen Formate in einem realen Fall denkbar wären, ohne sie selbst zu sammeln."],
          code: "SELECT zeitpunkt, aktion\nFROM workbenchlab_l5.aktivitaeten\nORDER BY zeitpunkt, ereignisnr;"
        },
        {
          title: "Datenqualität verändert Kennzahlen",
          body: ["In mieten fehlt eine Dauer; eine weitere hat den Wert 0 und muss geprüft werden. Vergleiche COUNT(*), COUNT(dauer_min) und AVG(dauer_min). NULL wird bei den letzten beiden nicht als Messwert berücksichtigt; 0 ist hingegen ein numerischer Wert und wird mitgerechnet.", "Berechne zusätzlich den Mittelwert ausschließlich für positive Dauern. Dokumentiere, welche Fälle du ausschließt und weshalb. Ersetze fehlende Werte nicht ungeprüft durch 0. Ein bereinigter Wert ohne offengelegte Regel kann ebenfalls irreführend sein."],
          tip: "Drei Tage und zehn Mieten reichen nicht aus, um eine allgemeine Prognose oder einen Ursache-Wirkungs-Zusammenhang zu belegen."
        }
      ],
      webWorksheet: {
        title: "L5.2: 3V und Datenqualität mit SQL prüfen",
        intro: "Erkläre zuerst das 3V-Modell, prüfe anschließend den kleinen Bestand in Workbench und begrenze deine Aussagen auf diesen Ausschnitt.",
        definitionTerms: [
          { id: "begriffe", label: "1 · Big Data und 3V", prompt: "Erkläre Big Data, Volume, Variety und Velocity. Warum ist dieser kleine SQL-Download noch kein echter Big-Data-Betrieb?" },
          { id: "rate", label: "2 · Ereignisse pro Minute", prompt: "Zähle Aktivitätsereignisse insgesamt und gruppiere pro Kalenderminute. Notiere SQL und Ergebnis. Unterscheide Ereignisrate und Verarbeitungsgeschwindigkeit." },
          { id: "vielfalt", label: "3 · Quellen und Formate", prompt: "Vergleiche die vier fachlichen Datenquellen. Welche Formate fehlen im Beispiel? Leite einen möglichen Nutzen und eine Gefahr ihrer Verknüpfung ab." },
          { id: "qualitaet", label: "4 · Fehlende und fragliche Werte", prompt: "Vergleiche COUNT(*), COUNT(dauer_min), AVG(dauer_min) und den Mittelwert für dauer_min > 0. Dokumentiere die ausgeschlossenen Datensätze und erkläre den Unterschied zwischen NULL und 0." },
          { id: "grenze", label: "5 · Aussagegrenze", prompt: "Welche weitergehenden Daten und Qualitätsprüfungen wären für eine belastbare Mobilitätsprognose erforderlich? Formuliere eine Aussage, die diese zehn Mieten nicht belegen." }
        ],
        hint: "Nutze denselben Ausgangsbestand wie L5.1. Eine erneute Einrichtung ist nicht nötig; arbeite mit SELECT und ändere die Rohdaten nicht."
      },
      classroomTask: {
        tool: "MySQL Workbench · SQL-Analyse",
        title: "Datenrate und Datenqualität mit eigenen Abfragen prüfen",
        intro: "Verwende den fiktiven Bestand aus L5.1. Der Download ist derselbe und wird nicht erneut eingerichtet, wenn die Tabellen bereits vorhanden sind.",
        steps: [
          "Öffne workbenchlab_l5 in Workbench und führe eigene Zählungen sowie die Minutengruppierung der Aktivitätsereignisse aus.",
          "Untersuche die Mietdauern mit COUNT und AVG. Vergleiche alle numerischen Werte mit dem Teilbestand dauer_min > 0; dokumentiere beide Ergebnisse und den Ausschlussgrund.",
          "Ordne deine Beobachtungen dem 3V-Modell zu und beschreibe einen möglichen Nutzen, eine Gefahr und die Grenzen des Beispiels.",
          "Speichere die Abfragen als L5_2_datenqualitaet.sql und halte die Ergebnisse im Aufgabenblatt fest."
        ],
        download: { href: "assets/sql/l5-datenanalyse-testdaten.sql", label: "Fiktive L5-Testdaten" },
        fileName: "L5_2_datenqualitaet.sql",
        evidence: "Eigenes SQL-Skript, überprüfte Kennzahlen und begründete 3V-Analyse"
      },
      completionChecks: [
        "Ich kann Volume, Variety und Velocity am Fall erklären.",
        "Meine Analyse berücksichtigt mehrere betroffene Perspektiven.",
        "Ich habe Datenrate und Kennzahlen in Workbench geprüft und den Umgang mit NULL und 0 begründet.",
        "Mein Urteil nennt nachvollziehbare Bedingungen."
      ]
    }
  };

  const extraLessons = [
    {
      id: "digitale-spuren",
      module: "lernfortschritt-5",
      index: "20",
      courseCode: "L5.1",
      title: "Digitale Spuren und Datenflüsse",
      subtitle: "Online-Handlungen erzeugen Daten, die gespeichert, verknüpft und für weitere Zwecke ausgewertet werden können.",
      duration: 60,
      xp: 35,
      difficulty: "medium",
      practiceId: "digital-trace-choice",
      sourceMaterials: ["L5_1 Information Digitale Spuren im Netz", "L5_1 Aufgabe Digitale Spuren im Netz"],
      objectives: [
        "aktive und passive digitale Spuren unterscheiden",
        "einen Datenfluss von der Erhebung bis zur Nutzung beschreiben",
        "erklären, weshalb verknüpfte Daten neue Informationen ergeben können"
      ],
      sections: [
        {
          title: "Spuren entstehen nicht nur beim Veröffentlichen",
          body: [
            "Ein Kommentar ist eine aktive Spur. Gerätekennungen, Zeitpunkte, Suchanfragen, Standort- oder Nutzungsdaten können auch entstehen, während ein Dienst nur verwendet wird.",
            "Für die Bewertung reicht es nicht, eine einzelne Angabe zu betrachten. Entscheidend ist, wer sie mit welchen weiteren Daten verbinden und für welchen Zweck auswerten kann."
          ],
          visual: "database-need"
        },
        {
          title: "Datenfluss statt Konto-Selbstversuch",
          body: [
            "Im Unterricht analysieren wir fiktive oder bereitgestellte Fälle. Niemand muss private Konten öffnen, persönliche Standortverläufe zeigen oder echte Profildaten teilen.",
            "Ein Datenfluss nennt Erhebung, Übertragung, Speicherung, Verknüpfung, Auswertung und mögliche Entscheidung. An jeder Stelle können andere Chancen und Risiken entstehen."
          ],
          tip: "Frage immer: Welche Daten? Von wem? Für wen? Zu welchem Zweck? Wie lange?"
        },
        {
          title: "Verknüpfung in Workbench beobachten",
          body: ["Der Download erstellt workbenchlab_l5 mit sechs fiktiven Profilen, zwölf Aktivitäten und acht Standortmeldungen. Gerätearten und grobe Zonen sind erfunden. Profilnummern sind nur Zuordnungsschlüssel; in einem echten System wäre eine Nummer allein kein Beweis für Anonymität.", "Zähle zuerst Aktivitäten je Profil mit LEFT JOIN, damit auch ein Profil ohne Ereignisse sichtbar bleibt. Verknüpfe dann Aktivitäten und Standortmeldungen über profilnr. Diese Tabellen enthalten unabhängig mehrere Zeilen je Profil: Der JOIN bildet Kombinationen, nicht automatisch zeitlich passende Beobachtungen. Zähle daher keine Lernaktivität allein anhand dieser vervielfachten Zeilen.", "Erstelle über Database > Reverse Engineer ein EER-Modell des Ausgangsschemas. Prüfe besonders die beiden 1:N-Beziehungen am Profil. Ein EER-Diagramm zeigt Tabellenbeziehungen, nicht den gesamten organisatorischen Datenfluss; diesen zeichnest du zusätzlich."],
          code: "SELECT profilnr, geraeteart\nFROM workbenchlab_l5.profile\nORDER BY profilnr;",
          warning: "Keine echten Konten öffnen und keine privaten Standortverläufe importieren. Klickanzahl beweist weder Motivation noch Lernerfolg."
        }
      ],
      webWorksheet: {
        title: "L5.1: Digitale Spuren selbst untersuchen",
        intro: "Bearbeite die Fragen zunächst fachlich und ergänze danach deine eigenen Workbench-Abfragen und Beobachtungen.",
        definitionTerms: [
          { id: "spuren", label: "1 · Spuren und Zwecke", prompt: "Ordne Anmeldung, gelesene Seite, Aufgabenabgabe, Geräteart und Standortmeldung als aktiv/passiv oder begründet mehrdeutig ein. Beschreibe Erhebung, Speicherung, Verknüpfung und möglichen Zweck." },
          { id: "zaehlung", label: "2 · Alle Profile berücksichtigen", prompt: "Zähle Aktivitäten je Profil mit LEFT JOIN und COUNT der Ereignisnummer. Notiere SQL und Ergebnisse, einschließlich des Profils ohne Ereignis. Warum ist COUNT(*) beim LEFT JOIN hier ungeeignet?" },
          { id: "verknuepfung", label: "3 · Mehr Daten, neue Rückschlüsse", prompt: "Verbinde Aktivitäten und Standortmeldungen über profilnr. Vergleiche Zeilenzahl und COUNT(DISTINCT ereignisnr) mit den Einzelbeständen. Warum entstehen zusätzliche Kombinationen und keine belegten zeitgleichen Handlungen?" },
          { id: "modell", label: "4 · Modell und Datenfluss", prompt: "Erstelle und speichere das EER-Modell durch Reverse Engineering. Erläutere PK/FK und die 1:N-Beziehungen; zeichne zusätzlich den Datenfluss. Was zeigt das EER-Modell nicht?" },
          { id: "schutz", label: "5 · Nutzen und Grenzen", prompt: "Nenne zwei sinnvolle und zwei problematische Zwecke sowie drei Schutzregeln. Warum belegen Klickzahlen keinen Lernerfolg und Profilnummern allein keine Anonymität?" }
        ],
        hint: "Alle Profile sind erfunden. Standort- und Aktivitätsmeldungen sind keine 1:1-Paare; ein JOIN auf profilnr allein ordnet keine Zeitpunkte einander zu."
      },
      classroomTask: {
        tool: "MySQL Workbench · EER und SQL",
        title: "Fiktive Datenspuren modellieren und verknüpfen",
        intro: "Analysiere ausschließlich den bereitgestellten Bestand. Importiere keine realen Konten, Profile oder Standortdaten.",
        steps: [
          "Prüfe und führe den Download einmal in Workbench aus. Er legt ausschließlich workbenchlab_l5 an. In L5.2 und L5.3 verwendest du diese Tabellen weiter.",
          "Zähle Aktivitäten je Profil und prüfe den JOIN mit Standortmeldungen. Vergleiche Anzahl der Zeilen und eindeutigen Ereignisse; dokumentiere die zusätzliche Information und die Mehrfachzählung.",
          "Erstelle mit Database > Reverse Engineer das EER-Modell, kontrolliere Schlüssel und Beziehungen und speichere L5_1_datenspuren.mwb. Zeichne zusätzlich den organisatorischen Datenfluss.",
          "Speichere eigene Abfragen als L5_1_datenspuren.sql, öffne das Modell erneut und begründe drei Schutzregeln im Aufgabenblatt."
        ],
        download: { href: "assets/sql/l5-datenanalyse-testdaten.sql", label: "Fiktive L5-Testdaten" },
        fileName: "L5_1_datenspuren.mwb und L5_1_datenspuren.sql",
        evidence: "Gespeichertes EER-Modell, Datenflussdiagramm und SQL-Nachweis mit Schutzregeln"
      },
      completionChecks: [
        "Ich kann aktive und passive Spuren unterscheiden.",
        "Mein Datenfluss benennt Erhebung, Speicherung und Nutzung.",
        "Meine Schutzregeln sind am Fall konkret begründet.",
        "Ich habe Mehrfachzählungen mit SQL geprüft und das EER-Modell gespeichert und erneut geöffnet."
      ],
      quiz: {
        question: "Warum kann die Verknüpfung mehrerer scheinbar harmloser Angaben problematisch sein?",
        options: [
          "Aus den Kombinationen können neue Rückschlüsse über Verhalten oder Personen entstehen.",
          "Weil jede einzelne Angabe automatisch falsch wird.",
          "Weil Datenbanken grundsätzlich keine Verknüpfungen speichern dürfen."
        ],
        correct: 0,
        explanation: "Erst die Kombination kann Muster, Profile und sensible Rückschlüsse erzeugen."
      }
    },
    {
      id: "bigdata-fallanalyse",
      module: "lernfortschritt-5",
      index: "21",
      courseCode: "L5.3",
      title: "Big Data begründet beurteilen",
      subtitle: "Ein tragfähiges Urteil verbindet Behauptung, Kriterien, Fallbezug, Gegenargument und klare Bedingungen.",
      duration: 70,
      xp: 45,
      difficulty: "plus",
      practiceId: "bigdata-judgement-choice",
      sourceMaterials: ["L5_3 Aufgabe Gefahren von Big Data", "L5_4 Information und Aufgabe Cambridge Analytica", "L5_5 Aufgabe Nutzen von Big Data"],
      objectives: [
        "Interessen und Folgen für verschiedene Beteiligte vergleichen",
        "Aussagekraft, Korrelation und mögliche Fehlentscheidungen unterscheiden",
        "ein begründetes Urteil mit Gegenargument und Bedingungen formulieren"
      ],
      sections: [
        {
          title: "Ein Urteil braucht Kriterien",
          body: [
            "Eine Datenanalyse ist nicht allein deshalb gut oder schlecht, weil sie viele Daten verwendet. Prüfe Zweck, Rechtsgrundlage, Datenqualität, Transparenz, Einflussmöglichkeiten, mögliche Benachteiligung und den Umfang der Erhebung.",
            "Ein Muster kann bei einer Vorhersage helfen, beweist aber noch keine Ursache. Schlechte oder einseitige Ausgangsdaten können bestehende Nachteile verstärken."
          ],
          code: "Urteil = Position + Begründung + Fallbezug + Gegenargument + Bedingungen"
        },
        {
          title: "Vom Bauchgefühl zur abgewogenen Position",
          body: [
            "Nenne zunächst die Entscheidung, über die du urteilst. Formuliere dann, wem die Nutzung nützt, wer Risiken trägt und welche Schutzmaßnahmen die Bewertung verändern würden.",
            "Ein gutes Gegenargument schwächt deine Position nicht. Es zeigt, dass du den Zielkonflikt verstanden hast und deine Bedingungen bewusst setzt."
          ],
          warning: "Nutze für die Aufgabe keine realen Schülerprofile oder privaten Kontodaten."
        },
        {
          title: "Mobilitätsanalyse: nützlich, aber begrenzt",
          body: ["Nutze stationen, mieten und wetter aus workbenchlab_l5. Zähle Abfahrten je Station einschließlich der Station ohne Miete. Eine hohe Abfahrtszahl belegt allein keinen Engpass: Anfangsbestand, Rückgaben, Uhrzeiten und Kapazität müssten mitgeprüft werden.", "Gruppiere Mieten zunächst pro Tag und verknüpfe erst dieses Ergebnis mit dem einen Wetterwert je Datum. Drei Tage können weder eine stabile Prognose noch die Behauptung belegen, Temperatur verursache die Nachfrage. Benenne fehlende Einflussgrößen und einen möglichen Auswahlfehler.", "Vergleiche alle Stationszahlen mit einer Ausgabe, die nur Gruppen mit mindestens drei Mieten zeigt. Diese Schwelle ist eine didaktische Beispielregel, keine allgemeine Garantie für Anonymität. Die Tabellen enthalten absichtlich keinen Bezug zu den Portalprofilen. Eine persönliche Tarifentscheidung lässt sich aus diesen Daten nicht rechtfertigen."],
          tip: "Trenne beobachteten Wert, Vermutung und begründetes Urteil. Aggregierte Nachfrageplanung und persönliches Profiling sind verschiedene Zwecke."
        },
        {
          title: "Historische Fallberichte kritisch einordnen",
          body: ["Die ursprünglichen Vorlagen behandeln auch Überwachung, Cambridge Analytica und Nutzenprojekte. Achte auf das Erscheinungsjahr und unterscheide Bericht, behauptete Wirkung und belegten Befund; ältere Berichte sind keine ungeprüfte Beschreibung der heutigen Lage.", "Die FTC stellte 2019 im Fall Cambridge Analytica täuschende Praktiken bei der Beschaffung von Facebook-Daten für Profilbildung und gezielte Ansprache fest. Daraus folgt nicht, dass ein bestimmter Wahlausgang durch eine einzelne Analyse verursacht wurde. Vergleiche Zweck, Datenzugang und Schutzmöglichkeiten mit dem fiktiven Mobilitätsfall; entwickle selbst kein Persönlichkeitsprofil einzelner Personen."]
        }
      ],
      webWorksheet: {
        title: "L5.3: SQL-Befund und Urteil auseinanderhalten",
        intro: "Ermittle die Mobilitätskennzahlen und nutze sie für ein begründetes Urteil. Verwechsle einen kleinen Ausschnitt nicht mit einer validierten Prognose.",
        definitionTerms: [
          { id: "stationen", label: "1 · Nachfrage und Nullgruppe", prompt: "Zähle Abfahrten je Station, einschließlich Station D ohne Miete. Notiere SQL und Ergebnis. Welche zusätzlichen Angaben wären nötig, um einen tatsächlichen Engpass zu belegen?" },
          { id: "wetter", label: "2 · Muster ist keine Ursache", prompt: "Fasse Mieten pro Tag zusammen und verbinde die Tageswerte mit wetter. Notiere die drei Tagesbefunde. Welche Ursachen und Prognosen sind damit nicht belegt?" },
          { id: "gruppen", label: "3 · Kleine Gruppen", prompt: "Vergleiche alle Stationszahlen mit einer Ausgabe für COUNT(mietnr) >= 3. Welche Stationen verschwinden? Warum garantiert die Beispielschwelle allein keine Anonymität?" },
          { id: "fallbezug", label: "4 · Historischer Vergleich", prompt: "Vergleiche die FTC-Feststellung von 2019 zu Datenzugang und Profiling mit der fiktiven Nachfrageplanung. Unterscheide belegten Datenmissbrauch von einer nicht automatisch belegten Ursache eines Wahlausgangs. Nenne eine Aussage aus einem älteren Vorlagenbericht, die eine aktuelle Quellenprüfung bräuchte." },
          { id: "urteil", maxLength: 4000, label: "5 · Begründetes Urteil", prompt: "Schreibe 180 bis 250 Wörter zur Nachfrageplanung und zu persönlichen Tarifen. Beziehe mindestens zwei SQL-Befunde ein, berücksichtige ein Gegenargument und formuliere drei überprüfbare Bedingungen. Welche Entscheidung können unsere Daten nicht tragen?" }
        ],
        hint: "Der Bestand enthält keine Miet-Person-Zuordnung. Keine Profilnummer hinzufügen und keine private Identität ergänzen."
      },
      classroomTask: {
        tool: "MySQL Workbench · SQL und Fallbewertung",
        title: "Nachfrage auswerten und die Aussagekraft begründen",
        intro: "Die fiktive Verkehrs-App möchte Engpässe vorhersagen und persönliche Tarife anbieten. Prüfe, was der gemeinsame L5-Bestand tatsächlich hergibt.",
        steps: [
          "Öffne den vorhandenen Bestand workbenchlab_l5; richte den Download nicht erneut ein. Prüfe Abfahrtszahlen einschließlich Nullgruppen sowie Tageszahlen zusammen mit Wetterdaten.",
          "Vergleiche alle Stationsgruppen mit der Beispielschwelle von drei Mieten. Begründe die ausgelassenen Gruppen und Grenzen der Auswertung.",
          "Speichere L5_3_nachfrage.sql und nutze mindestens zwei überprüfte Ergebnisse für deine Stellungnahme. Unterscheide Nachfrageplanung von persönlichen Tarifentscheidungen.",
          "Vergleiche Nutzen und Risiken aus mehreren Perspektiven, ergänze ein Gegenargument und drei überprüfbare Bedingungen. Bewerte einen historischen Vorlagenfall quellenkritisch."
        ],
        download: { href: "assets/sql/l5-datenanalyse-testdaten.sql", label: "Fiktive L5-Testdaten" },
        fileName: "L5_3_nachfrage.sql",
        evidence: "Eigenes SQL-Skript und Stellungnahme mit 180 bis 250 Wörtern und zwei überprüften Befunden"
      },
      completionChecks: [
        "Mein Urteil bezieht sich auf eine klar benannte Entscheidung.",
        "Ich habe ein ernstzunehmendes Gegenargument berücksichtigt.",
        "Meine Bedingungen sind konkret und überprüfbar formuliert.",
        "Ich habe zwei SQL-Befunde geprüft und ihre Grenzen gegenüber Prognose, Ursache und persönlichen Tarifen erklärt."
      ],
      quiz: {
        question: "Welche Aussage ist für eine begründete Big-Data-Bewertung am stärksten?",
        options: [
          "Die Nutzung ist nur vertretbar, wenn Zweck, Datenumfang, Qualität, Transparenz und Schutzmaßnahmen am konkreten Fall geprüft werden.",
          "Viele Daten liefern immer objektive Entscheidungen.",
          "Jede Datenanalyse ist grundsätzlich unzulässig."
        ],
        correct: 0,
        explanation: "Eine Bewertung wägt am konkreten Fall ab und nennt prüfbare Bedingungen."
      }
    }
  ];

  Object.entries(lessonEnhancements).forEach(([id, enhancement]) => {
    const lesson = content.lessons.find((item) => item.id === id);
    if (lesson) {
      Object.assign(lesson, enhancement);
    }
  });
  extraLessons.forEach((lesson) => {
    if (!content.lessons.some((item) => item.id === lesson.id)) {
      content.lessons.push(lesson);
    }
  });

  content.modules.forEach((module) => {
    module.lessonIds.forEach((lessonId) => {
      const lesson = content.lessons.find((item) => item.id === lessonId);
      if (lesson) {
        lesson.module = module.id;
      }
    });
  });

  const taskStepTitles = {
    "L1.1": ["Fachbegriffe vergleichen", "Tabellenentwurf prüfen", "Primärschlüssel begründen", "MySQL starten und Fenster offen lassen", "Lokale Verbindung einrichten", "Zielschema prüfen, Skript einmal ausführen", "Ergebnis lesen und nur SELECT wiederholen", "SQL-Datei speichern und erneut öffnen"],
    "L1.2": ["Fachliches ER-Diagramm zeichnen", "Entität und Entitätstyp unterscheiden", "Relationenschema festlegen", "Neues Workbench-Modell anlegen", "Elf Attribute und Schlüssel eintragen", "Modell speichern und vergleichen"],
    "L1.3": ["MySQL starten und Fenster offen lassen", "Workbench-Verbindung testen", "Entwurf aus L1.2 öffnen", "Vorhandene Tabelle prüfen, nicht doppelt anlegen", "Modell speichern und erneut prüfen"],
    "L1.4": ["MySQL starten und verbinden", "SQL-Vorschau prüfen, dann Schema erzeugen", "Tabelle und Primärschlüssel kontrollieren", "Testdaten genau einmal importieren", "Zeilen und Anzahl mit SELECT prüfen"],
    "L1.5": ["Schülerliste nach Nachname sortieren", "Ort ergänzen und absteigend sortieren", "Gleiche Nachnamen nach Vorname ordnen", "Drei Ergebnisse vergleichen und speichern"],
    "L1.6": ["Ort und Nachname filtern", "Zahlen und Geburtsdaten vergleichen", "LIKE, AND und BETWEEN einsetzen", "Ausschlüsse mit OR und NOT formulieren"],
    "L1.7": ["Ort-PLZ-Paare ohne Wiederholung", "Vornamen ohne Wiederholung", "Nachnamen ohne Wiederholung", "Fahrstunden vergleichen und DISTINCT erklären"],
    "L1.8": ["Bestand prüfen, Testfälle einmal ergänzen", "Sechs Funktionsaufträge lösen", "Acht Gruppenaufträge lösen", "Grenzgruppen von Hand kontrollieren"],
    "L1.9": ["Drei Datumsaufträge bearbeiten", "Zielschema und Fahrradattribute prüfen", "Acht Transferaufträge lösen und nachrechnen", "Bezugsdatum dokumentieren; D4 als Zusatz"],
    "L1.10": ["Anfangsbestand einmal anlegen und prüfen", "Personen erfassen, ändern und löschen", "Fahrradaufträge in Reihenfolge ausführen", "Schutzregeln erklären und Browserübungen prüfen"],
    "L2.1": ["Wiederholte Ortsdaten erkennen", "Änderungsproblem beschreiben", "Fachliches ER-Diagramm zeichnen", "Zwei Relationen mit PK und geplantem FK", "L1-Modell als neue L2.1-Datei kopieren", "Ortstabelle anlegen, L1-Attribute erhalten", "Entwurf speichern; Server noch nicht ändern"],
    "L2.2": ["L2.1-Entwurf als neue Datei weiterführen", "Tabellen und genau eine Ortsnummer prüfen", "1:N-Beziehung und FK-Zuordnung einrichten", "Datei erneut öffnen und Modell zeigen", "Nach Freigabe übertragen und JOIN prüfen"],
    "L2.3": ["Schema und Fremdschlüssel prüfen", "Blockierte Änderungen untersuchen", "Ort, Lehrkraft und Schüler geordnet erfassen", "Nur die neu angelegten Personen entfernen"],
    "L2.4": ["Schema und Verbindungspfade prüfen", "T1–T5: zwei Tabellen verbinden", "M1–M15: weitere Tabellen auswerten", "Zusatzaufgaben nach Absprache bearbeiten"],
    "L3.1": ["M:N in zwei 1:N-Beziehungen auflösen", "Schlüssel für wiederholte Vorgänge begründen", "Attribute und Geschäftsregeln zuordnen", "Beide Modelle speichern und erneut öffnen"],
    "L3.2": ["Beide Ausgangsbestände kontrollieren", "Zwei EER-Diagramme aus den Daten erzeugen", "F1–F10: Fahrschule auswerten und speichern", "R1–R16: Vermietung auswerten und prüfen"],
    "L3.3": ["Schlüssel und Abhängigkeiten bestimmen", "Zwei eigene EER-Modelle erstellen", "CREATE-Skripte prüfen, neue Schemas nutzen", "Alle Ausgangsdaten per JOIN rekonstruieren"],
    "L4.1": ["Listen in atomare Zeilen überführen", "Sechs Modelle für 1NF, 2NF und 3NF", "Neue Zielschemata prüfen und befüllen", "Zuordnungen, Fremdschlüssel und Paare prüfen", "Nachweise speichern und Stufen erklären"],
    "L5.1": ["Fiktiven L5-Bestand genau einmal anlegen", "Aktivitäten zählen und JOIN-Fallen prüfen", "EER-Modell und Datenfluss zeichnen", "SQL sichern und drei Schutzregeln begründen"],
    "L5.2": ["Ereignisse zählen und nach Minuten gruppieren", "Fehlende Werte und Mietdauer 0 prüfen", "3V, Nutzen, Risiken und Grenzen einordnen", "SQL-Datei und Ergebnisse speichern"],
    "L5.3": ["Vorhandenen L5-Bestand nutzen und auswerten", "Kleine Gruppen und Aussagegrenzen prüfen", "Zwei SQL-Befunde für das Urteil sichern", "Gegenargument und Bedingungen formulieren"]
  };
  content.lessons.forEach((lesson) => {
    if (lesson.classroomTask && taskStepTitles[lesson.courseCode]) {
      lesson.classroomTask.stepTitles = taskStepTitles[lesson.courseCode];
      lesson.classroomTask.startupGuide = ["L1.1", "L1.2", "L1.3", "L1.4"].includes(lesson.courseCode);
    }
  });

  const extraPractices = [
    {
      id: "sql-create-table",
      lessonId: "daten-verwalten",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Übungstabelle anlegen",
      description: "Lege eine Tabelle pruefungen mit ganzzahligem Primärschlüssel pruefungsnr und dem Pflichtfeld datum an.",
      difficulty: "medium",
      xp: 35,
      starter: "CREATE TABLE pruefungen (\n  \n);",
      solution: "CREATE TABLE pruefungen (\n  pruefungsnr INTEGER PRIMARY KEY,\n  datum TEXT NOT NULL\n);",
      hints: [
        "Jede Spalte benötigt Name und Datentyp.",
        "PRIMARY KEY kennzeichnet die eindeutige Prüfungsnummer.",
        "NOT NULL macht das Datum zum Pflichtfeld."
      ],
      check: {
        type: "mutation",
        verifySql: "SELECT COUNT(*) AS anzahl FROM pragma_table_info('pruefungen') WHERE (name = 'pruefungsnr' AND pk = 1) OR (name = 'datum' AND [notnull] = 1);",
        expected: { columns: ["anzahl"], values: [[2]] },
        required: ["create\\s+table", "primary\\s+key", "not\\s+null"]
      }
    },
    {
      id: "sql-update-hours",
      lessonId: "daten-verwalten",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Fahrstunden gezielt ändern",
      description: "Setze die Fahrstunden der Schülerin mit schuelernr 5 von 3 auf 5. Andere Datensätze dürfen sich nicht ändern.",
      difficulty: "medium",
      xp: 35,
      starter: "UPDATE fahrschueler\nSET \nWHERE ;",
      solution: "UPDATE fahrschueler\nSET fahrstunden = 5\nWHERE schuelernr = 5;",
      hints: [
        "SET weist der Spalte den neuen Wert zu.",
        "Die eindeutige Schülernummer eignet sich für die WHERE-Bedingung.",
        "Prüfe in Workbench vor und nach UPDATE mit SELECT."
      ],
      check: {
        type: "mutation",
        verifySql: "SELECT fahrstunden FROM fahrschueler WHERE schuelernr = 5;",
        expected: { columns: ["fahrstunden"], values: [[5]] },
        required: ["update", "set", "where", "schuelernr\\s*=\\s*5"]
      }
    },
    {
      id: "sql-delete-student",
      lessonId: "daten-verwalten",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Einen Datensatz sicher löschen",
      description: "Lösche ausschließlich den Datensatz mit schuelernr 10.",
      difficulty: "medium",
      xp: 35,
      starter: "DELETE FROM fahrschueler\nWHERE ;",
      solution: "DELETE FROM fahrschueler\nWHERE schuelernr = 10;",
      hints: [
        "DELETE FROM nennt die Tabelle.",
        "Ohne WHERE wären alle Zeilen betroffen.",
        "Verwende den eindeutigen Primärschlüssel."
      ],
      check: {
        type: "mutation",
        verifySql: "SELECT COUNT(*) AS anzahl FROM fahrschueler WHERE schuelernr = 10;",
        expected: { columns: ["anzahl"], values: [[0]] },
        required: ["delete\\s+from", "where", "schuelernr\\s*=\\s*10"]
      }
    },
    {
      id: "digital-trace-choice",
      lessonId: "digitale-spuren",
      type: "choice",
      title: "Digitale Spuren einordnen",
      description: "Ordne Datenspuren und Schutzmaßnahmen an einem fiktiven Schulportal ein.",
      difficulty: "medium",
      xp: 30,
      questions: [
        {
          question: "Welche Angabe ist typischerweise eine passive Spur?",
          options: ["Zeitpunkt und Geräteart beim Seitenaufruf", "Ein freiwillig geschriebener Kommentar", "Eine bewusst hochgeladene Datei"],
          correct: 0,
          feedback: "Technische Nutzungsdaten können anfallen, ohne dass sie als eigener Beitrag veröffentlicht werden."
        },
        {
          question: "Welche Maßnahme entspricht Datensparsamkeit?",
          options: ["Nur die für den Lernzweck notwendigen Daten speichern", "Alle verfügbaren Daten vorsorglich unbegrenzt sammeln", "Daten ohne Zweckbeschreibung weitergeben"],
          correct: 0,
          feedback: "Datensparsamkeit begrenzt Erhebung und Speicherung auf den nachvollziehbaren Zweck."
        }
      ]
    },
    {
      id: "bigdata-judgement-choice",
      lessonId: "bigdata-fallanalyse",
      type: "choice",
      title: "Ein Urteil auf Tragfähigkeit prüfen",
      description: "Erkenne, welche Begründung Kriterien, Fallbezug und Bedingungen zusammenführt.",
      difficulty: "plus",
      xp: 35,
      questions: [
        {
          question: "Welche Aussage ist am besten begründet?",
          options: [
            "Die Verkehrsprognose ist vertretbar, wenn nur erforderliche Daten genutzt, Fehlerquoten offengelegt und Entscheidungen nicht allein automatisiert getroffen werden.",
            "Die Prognose ist gut, weil Computer viele Daten schnell verarbeiten.",
            "Die Prognose ist schlecht, weil Daten immer gefährlich sind."
          ],
          correct: 0,
          feedback: "Die Aussage nennt Zweck, konkrete Risiken und überprüfbare Bedingungen."
        }
      ]
    }
  ];

  extraPractices.forEach((practice) => {
    if (["sql-update-hours", "sql-delete-student"].includes(practice.id)) {
      practice.check.verifySql = "SELECT * FROM fahrschueler ORDER BY schuelernr;";
      practice.check.referenceSql = practice.solution;
    }
    if (!content.practices.some((item) => item.id === practice.id)) {
      content.practices.push(practice);
    }
  });
})();
