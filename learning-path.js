(function () {
  "use strict";

  const content = window.WORKBENCH_CONTENT;
  if (!content) {
    return;
  }

  content.version = "0.20.0";
  content.updated = "2026-10-01";
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
      workflow: ["Informieren", "Tabellenentwurf", "Übung prüfen", "Abschließen"],
      workflowHints: ["Grundbegriffe lesen", "Digitales Blatt ausfüllen", "Entwurf besprechen", "Lehrkraft bestätigt"],
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
        tool: "Browser, Heft und Unterrichtsgespräch",
        title: "Den Tabellenentwurf prüfen und begründen",
        intro: "Heiner Blechle möchte seine Fahrschule verwalten, Daten für TÜV und Rechnungen nutzen und Informationsmails versenden. Prüfe, ob dein Entwurf diese Aufgaben zuverlässig vorbereitet.",
        steps: [
          "Vergleiche deine Definitionen mit den Fachbegriffen im Informationsteil und verbessere sie bei Bedarf.",
          "Kontrolliere Tabellenname, Attributnamen, Atomarität und Datentypen mit der Checkliste.",
          "Markiere deinen Primärschlüssel und begründe schriftlich, weshalb er jeden Fahrschüler eindeutig identifiziert.",
          "Besprich den Entwurf mit einer Mitschülerin, einem Mitschüler oder der Lehrkraft und dokumentiere eine Verbesserung."
        ],
        evidence: "Ausgefüllte digitale Vorlage, eigene Definitionen und begründete Schlüsselwahl"
      },
      completionChecks: [
        "Ich habe alle vier Fachbegriffe in eigenen Worten erklärt.",
        "Mein Tabellenentwurf enthält atomare Attribute, passende Datentypen und genau einen Primärschlüssel.",
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
      workflow: ["Informieren", "ERD zeichnen", "Relationenschema", "Abschließen"],
      workflowHints: ["Grundlagen lesen", "Fachliches Modell skizzieren", "Datentypen und PK festlegen", "Lehrkraft bestätigt"],
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
          tip: "Lies das Modell von links nach rechts: fachliches Objekt → Relation mit Schlüssel und Datentypen. Noch keine zweite Tabelle und keine Kardinalität nötig."
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
        tool: "Browser und Heft",
        title: "Vom Entwurf zum ERD und Relationenschema",
        intro: "Heiner ergänzt zu seinem bisherigen Entwurf Geburtsdatum und Fahrstundenzahl. Bearbeite die vier Aufgaben des digitalen Blatts und zeichne danach das ERD.",
        steps: [
          "Beschreibe den Zweck eines ER-Diagramms und zeichne den Entitätstyp fahrschueler mit seinen Attributen.",
          "Unterscheide eine konkrete Entität vom Entitätstyp und erläutere den Zweck des Relationenschemas.",
          "Übertrage den Entwurf in ein Relationenschema mit Schlüssel, Datentypen und maximalen Textlängen.",
          "Vergleiche ERD und Relationenschema mit einer Mitschülerin, einem Mitschüler oder der Lehrkraft."
        ],
        evidence: "ERD-Skizze im Heft und ausgefülltes digitales Relationenschema"
      },
      completionChecks: [
        "Ich habe die vier Aufgaben des digitalen Blatts beantwortet und ein ERD gezeichnet.",
        "Mein Relationenschema enthält schuelernr als PK sowie geburtsdatum DATE und fahrstundenzahl INT.",
        "Ich kann den Unterschied zwischen fachlichem ERD und technischem Relationenschema erklären."
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
            "Das EER-Modell kannst du als `.mwb` speichern, ohne schon eine Datenbank auf dem Server anzulegen. Für die erste gemeinsame Einrichtung prüfen wir trotzdem vorab den Informatik-Stick und die lokale Verbindung; die eigentliche Datenbank wird erst in L1.4 erzeugt."
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
            "Erstelle ein neues Modell. Benenne das Standardschema `mydb` per `Edit Schema...` in `fahrschule` um. Füge mit `Add Diagram` ein EER-Diagramm hinzu, platziere das Tabellensymbol und ändere `table1` in `fahrschueler`.",
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
          "Benenne das Schema in `fahrschule` um und lege mit `Add Diagram` ein EER-Diagramm an.",
          "Füge eine Tabelle `fahrschueler` ein; übernimm Attribute, Datentypen, PK und passende NN-Markierungen aus L1.2.",
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
      sourceMaterials: ["L1_5.5 Information Datenbankabfrage Funktionen", "L1_5.5 Aufgabe Datenbankabfrage Funktionen", "L1_5.8 Information Datenbankabfrage Gruppierung", "L1_5.8 Aufgabe Datenbankabfrage Gruppierung"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Vom einzelnen Datensatz zur Kennzahl",
        intro: "Berechne Kennzahlen zuerst für die gesamte Tabelle und danach je Gruppe. Prüfe jede Zahl auf Plausibilität.",
        steps: [
          "Bestimme Anzahl, Minimum, Maximum, Durchschnitt und Summe der Fahrstunden.",
          "Ermittle Anzahl und Fahrstundensumme je Ort.",
          "Filtere Gruppen mit HAVING und erkläre, weshalb WHERE dafür nicht genügt.",
          "Prüfe eine Kennzahl an einer kleinen Teilmenge von Hand."
        ],
        evidence: "Ergebnistabelle mit kurzer Plausibilitätskontrolle",
        fileName: "L1_8_funktionen_gruppierung.sql"
      },
      completionChecks: [
        "Ich kann COUNT, SUM, AVG, MIN und MAX passend auswählen.",
        "Meine SELECT-Spalten passen zu GROUP BY.",
        "Ich kann WHERE und HAVING unterscheiden."
      ]
    },
    "datum-berechnungen": {
      courseCode: "L1.9",
      module: "lernfortschritt-1",
      sourceMaterials: ["L1_5.6 Information Datenbankabfrage Datum_Funktionen", "L1_5.6 Vertiefungsaufgabe Funktionen"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Datumswerte und berechnete Spalten auswerten",
        intro: "Arbeite mit echten DATE-Werten und benenne berechnete Ausgabespalten verständlich.",
        steps: [
          "Gib Jahr und Monat eines Datums mit YEAR und MONTH getrennt aus.",
          "Filtere einen fachlich sinnvollen Zeitraum.",
          "Berechne eine Dauer mit DATEDIFF und notiere ausdrücklich, ob Anfangs- und Endtag mitgezählt werden sollen.",
          "Vergib für jede berechnete Spalte einen Alias."
        ],
        evidence: "Drei Abfragen mit dokumentierter Zählweise",
        fileName: "L1_9_datum_berechnung.sql"
      },
      completionChecks: [
        "Ich speichere Datumswerte im geeigneten Datentyp und Format.",
        "Ich kann YEAR, MONTH und DATEDIFF erklären.",
        "Die Zählweise meiner Dauer ist dokumentiert."
      ]
    },
    "daten-verwalten": {
      courseCode: "L1.10",
      module: "lernfortschritt-1",
      sourceMaterials: ["L1_6 Information Daten einfügen", "L1_7 Information Daten ändern", "L1_8 Information Daten löschen", "L1_6 bis L1_8 Aufgaben"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Daten kontrolliert einfügen, ändern und löschen",
        intro: "Jede Änderung folgt derselben Sicherheitsfolge: Zielmenge auswählen, Änderung ausführen, Ergebnis erneut auswählen.",
        steps: [
          "Lege eine kleine Übungstabelle per CREATE TABLE an.",
          "Füge einen vollständigen Datensatz mit expliziter Spaltenliste ein.",
          "Prüfe vor einem UPDATE mit SELECT genau die betroffene Zeile und führe danach dieselbe Kontrolle erneut aus.",
          "Wiederhole die Vorher-Nachher-Kontrolle für DELETE."
        ],
        evidence: "SQL-Skript mit CREATE, INSERT, UPDATE, DELETE und Kontrollabfragen",
        fileName: "L1_10_daten_verwalten.sql"
      },
      completionChecks: [
        "Mein SQL-Skript lässt sich von oben nach unten nachvollziehen.",
        "UPDATE und DELETE besitzen eine bewusst geprüfte WHERE-Bedingung.",
        "Ich habe die drei Browserübungen CREATE, UPDATE und DELETE geprüft."
      ]
    },
    "erm-sachtext-analyse": {
      courseCode: "L2.1",
      module: "lernfortschritt-2",
      title: "Redundanz erkennen und zwei Tabellen planen",
      subtitle: "Wiederholte Ortsangaben werden in einen eigenen Entitätstyp überführt; aus der fachlichen 1:N-Beziehung entsteht ein Fremdschlüssel.",
      duration: 65,
      practiceId: "erm-fahrschule-redundancy",
      workflow: ["Daten prüfen", "Änderungsproblem erklären", "ERD zeichnen", "Relationen planen"],
      workflowHints: ["PK und Atomarität", "Redundanz und Anomalie", "Zwei Leserichtungen", "FK auf der N-Seite"],
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
        }
      ],
      webWorksheet: {
        title: "L2.1: Redundanz und Zwei-Tabellen-Modell",
        intro: "Bearbeite die Fragen aus L2_1 und L2_2.1 in eigenen Worten. Zeichne dein ERD zusätzlich im Heft; die Software folgt erst in L2.2.",
        definitionTerms: [
          { id: "pruefung", label: "1 · Bestehende Tabelle", prompt: "Sind Primärschlüssel und atomare Werte vorhanden? Welche Daten werden trotzdem mehrfach gespeichert?" },
          { id: "anomalie", label: "2 · Änderungsanomalie", prompt: "Beschreibe an zwei Fahrschülern desselben Ortes, wie durch eine nur teilweise Änderung widersprüchliche Daten entstehen." },
          { id: "beziehung", label: "3 · Fachliches ERD", prompt: "Nenne beide Entitätstypen, den Beziehungstyp und zwei vollständige Leserichtungssätze. Welche maximale Kardinalität entsteht?" },
          { id: "relationen", label: "4 · Relationenschema", prompt: "Schreibe beide Relationen mit PK, FK sowie plz und ort auf. Wo steht ortnr als Fremdschlüssel?" },
          { id: "begriffe", label: "5 · Begriffe", prompt: "Definiere Entität, Entitätstyp, Beziehungstyp, Kardinalität und Fremdschlüssel anhand des Beispiels." }
        ],
        hint: "Ein Fremdschlüssel wiederholt nur die Ortsnummer als Verweis. Ortsname und PLZ werden in der neuen Ortstabelle gepflegt."
      },
      notePrompts: [
        "Warum löst DISTINCT keine Speicher-Redundanz?",
        "Wie lauten die beiden Leserichtungssätze für Orte und Fahrschüler?",
        "Weshalb steht der Fremdschlüssel auf der Fahrschüler-Seite?"
      ],
      classroomTask: {
        tool: "Heft und digitales Aufgabenblatt",
        title: "Fahrschule ohne mehrfach gespeicherte Ortsdaten planen",
        intro: "Gehe von der Ein-Tabellen-Struktur aus L1 aus. L2_1 fragt nach den Qualitätskriterien; L2_2.1 führt zum fachlichen ERD und Relationenschema.",
        steps: [
          "Prüfe die bestehende Tabelle auf Primärschlüssel, atomare Werte und mehrfach gespeicherte Ortsangaben.",
          "Beschreibe eine konkrete Änderungsanomalie und skizziere zwei Tabellen als Lösung.",
          "Zeichne ein fachliches ERD mit `orte`, `fahrschueler`, `wohnt in` und einer begründeten 1:N-Beziehung.",
          "Überführe das ERD in zwei Relationen; markiere `ortnr` als PK in `orte` und als FK in `fahrschueler`."
        ],
        evidence: "Begründete Redundanzprüfung, handgezeichnetes ERD, zwei Relationenschemata und digitales Blatt"
      },
      completionChecks: [
        "Ich kann eine Speicher-Redundanz und eine Änderungsanomalie am Beispiel erklären.",
        "Mein fachliches ERD enthält die beiden Entitätstypen und die 1:N-Beziehung.",
        "Mein Relationenschema speichert plz und ort nur in orte und verwendet ortnr als Fremdschlüssel."
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
      workflow: ["L1-Modell kopieren", "Ortstabelle anlegen", "1:N setzen", "Modell prüfen"],
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
            "Öffne deine `.mwb`-Datei aus L1 oder die lokale Unterrichtsvorlage. Speichere sofort eine neue Kopie für L2; die ursprüngliche L1-Datei bleibt erhalten. Benenne das Schema dieser Kopie `fahrschule_l2`, damit du nicht versehentlich die bestehende L1-Datenbank überschreibst.",
            "Im EER-Diagramm ist `fahrschueler` zunächst noch die einzige Tabelle. Ergänze `orte` mit `ortnr` als `INT`-Primärschlüssel und Auto Increment (`AI`), `plz` als Text und `ort` als Ortsname."
          ],
          visual: "foreign-key",
          warning: "Erzeuge aus der Modellkopie noch keine Datenbank. Besonders eine Option zum Löschen vorhandener Objekte darfst du nicht ungeprüft übernehmen."
        },
        {
          title: "Beziehung setzen und Fremdschlüssel prüfen",
          body: [
            "Wähle in Workbench das Werkzeug für eine nicht-identifizierende 1:N-Beziehung. Klicke zuerst auf die Child-Tabelle `fahrschueler`, die den Fremdschlüssel erhält, danach auf die Parent-Tabelle `orte`. Die Namen der Werkzeuge können in 6.3.10 und 8.0.21 leicht abweichen.",
            "Workbench kann den neuen Fremdschlüssel automatisch `orte_ortnr` nennen. Benenne ihn für unser Schema in `ortnr` um. Entferne danach `plz` und `ort` aus der Modell-Tabelle `fahrschueler`; beide Attribute gehören jetzt ausschließlich zu `orte`. Kontrolliere die Verbindung `orte.ortnr` zu `fahrschueler.ortnr` und speichere die `.mwb`-Kopie."
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
        intro: "Setze die Aufgabe L2_2.2 in Workbench um. Verwende eine Kopie deines L1-Modells und ein getrenntes L2-Übungsschema.",
        steps: [
          "Sichere die geöffnete L1-Modelldatei unter neuem L2-Namen und benenne das Schema der Kopie `fahrschule_l2`.",
          "Ergänze `orte` mit `ortnr` als PK und AI sowie `plz` und `ort`.",
          "Setze die 1:N-Beziehung: zuerst `fahrschueler` als Child, dann `orte` als Parent. Prüfe `ortnr` als FK und entferne die redundanten Ortsattribute aus `fahrschueler`.",
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
      sourceMaterials: ["L2_3 Information referentielle Integrität", "L2_3 Aufgabe referentielle Integrität"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Gültige und ungültige Fremdschlüssel gezielt testen",
        intro: "Erzeuge einen kontrollierten Regelverstoß und lies die Fehlermeldung als Hinweis auf das Datenmodell.",
        steps: [
          "Zeige den vorhandenen Parent-Datensatz und den dazugehörigen Child-Datensatz.",
          "Versuche einen Child-Datensatz mit nicht vorhandener Parent-ID einzufügen.",
          "Dokumentiere Fehlermeldung, verletzte Regel und eine fachlich korrekte Lösung.",
          "Prüfe die festgelegte Löschregel an einem referenzierten Parent-Datensatz."
        ],
        evidence: "Vorher-Nachher-Protokoll mit erklärter Fehlermeldung",
        fileName: "L2_3_referentielle_integritaet.sql"
      },
      completionChecks: [
        "Ich kann den Zielschlüssel eines Fremdschlüssels nennen.",
        "Ich habe einen Integritätsfehler erzeugt und fachlich erklärt.",
        "Ich kenne die im Modell festgelegte Löschregel."
      ]
    },
    "joins": {
      courseCode: "L2.4",
      module: "lernfortschritt-2",
      sourceMaterials: ["L2_2.3 Information Datenbankabfrage 2 Tabellen", "L2_2.3 Aufgabe Datenbankabfragen 2 Tabellen", "L2_4 Aufgabe Datenbankabfragen n Tabellen"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Den Verbindungspfad aus dem Modell ablesen",
        intro: "Entwickle JOIN-Abfragen schrittweise und prüfe nach jedem JOIN, ob die Zeilenzahl fachlich plausibel bleibt.",
        steps: [
          "Markiere im Relationenmodell Primär- und Fremdschlüssel des ersten Verbindungspaars.",
          "Formuliere FROM, JOIN und ON zunächst für zwei Tabellen.",
          "Ergänze gewünschte Ausgabespalten mit eindeutigen Tabellenaliasnamen.",
          "Erweitere die Abfrage um eine dritte Tabelle und dokumentiere die erwartete Zeilenzahl."
        ],
        evidence: "Kommentierte Zwei- und Drei-Tabellen-Abfrage",
        fileName: "L2_4_joins.sql"
      },
      completionChecks: [
        "Jede JOIN-Bedingung verbindet fachlich passende Schlüssel.",
        "Mehrdeutige Spalten sind mit Tabellenalias qualifiziert.",
        "Ich habe Zeilen- und Spaltenzahl mit meiner Erwartung verglichen."
      ]
    },
    "erm-beziehungsentitaet": {
      courseCode: "L3.1",
      module: "lernfortschritt-3",
      sourceMaterials: ["L3_1 Information M-N-Beziehung", "L3_1.1 bis L3_1.6 Aufgaben Datenbankmodell"],
      classroomTask: {
        tool: "MySQL Workbench EER Diagram",
        title: "Eine M:N-Beziehung als fachlichen Vorgang modellieren",
        intro: "Löse eine M:N-Beziehung über eine Beziehungsentität auf und ordne deren eigene Attribute begründet zu.",
        steps: [
          "Beschreibe die ursprüngliche M:N-Beziehung in beiden Leserichtungen.",
          "Führe eine Beziehungsentität mit eigenem Primärschlüssel ein.",
          "Übernimm die Schlüssel der beiden Parent-Tabellen als Fremdschlüssel.",
          "Ordne Beginn, Ende oder andere Vorgangsattribute der Beziehungsentität zu."
        ],
        evidence: "Aufgelöstes EER-Diagramm mit Begründung der Vorgangsattribute",
        fileName: "L3_1_mn_aufloesung.mwb"
      },
      completionChecks: [
        "Die direkte M:N-Beziehung wurde in zwei 1:N-Beziehungen aufgelöst.",
        "Die Beziehungsentität enthält beide notwendigen Fremdschlüssel.",
        "Eigene Attribute des Vorgangs liegen an der fachlich richtigen Stelle."
      ]
    },
    "mn-beziehungen": {
      courseCode: "L3.2",
      module: "lernfortschritt-3",
      sourceMaterials: ["L3_2.1 Aufgabe Datenbankabfragen Fahrschule", "L3_2.2 Aufgabe Datenbankabfragen Fahrradvermietung"],
      classroomTask: {
        tool: "MySQL Workbench SQL Editor",
        title: "Eine Beziehungsentität über drei Tabellen auswerten",
        intro: "Beantworte eine fachliche Frage über zwei Parent-Tabellen und die verbindende Vorgangstabelle.",
        steps: [
          "Zeichne den Verbindungspfad von der ersten Parent-Tabelle über die Beziehungsentität zur zweiten Parent-Tabelle.",
          "Formuliere die zwei JOIN-Bedingungen und ergänze die Ausgabespalten.",
          "Berechne eine Kennzahl des Vorgangs, beispielsweise Dauer oder Summe.",
          "Gruppiere nach einem Parent-Objekt und deute das Ergebnis in einem Satz."
        ],
        evidence: "Drei-Tabellen-Abfrage mit fachlicher Deutung",
        fileName: "L3_2_mn_auswertung.sql"
      },
      completionChecks: [
        "Ich kann den gesamten Verbindungspfad im Modell zeigen.",
        "Meine Abfrage enthält zwei vollständige JOIN-Bedingungen.",
        "Ich habe die Kennzahl fachlich und mit Einheit beschrieben."
      ]
    },
    "redundanz-3nf": {
      courseCode: "L3.3",
      module: "lernfortschritt-3",
      sourceMaterials: ["L3_3 Information 3NF", "L3_3.1 bis L3_3.5 Aufgaben zur Dritten Normalform"],
      classroomTask: {
        tool: "Heft und MySQL Workbench EER Diagram",
        title: "Abhängigkeiten prüfen und ein Modell verbessern",
        intro: "Begründe einen Modellfehler über funktionale Abhängigkeiten statt nur über sichtbar doppelte Werte.",
        steps: [
          "Notiere den Primärschlüssel der zu prüfenden Relation.",
          "Formuliere, welche Attribute durch den Schlüssel und welche durch andere Nichtschlüsselattribute bestimmt werden.",
          "Zeige je eine mögliche Änderungs-, Einfüge- oder Löschanomalie.",
          "Zerlege die Relation und verbinde die neuen Tabellen über passende Schlüssel."
        ],
        evidence: "Abhängigkeitsanalyse und verbessertes EER-/Relationenmodell",
        fileName: "L3_3_modell_3nf.mwb"
      },
      completionChecks: [
        "Ich habe die relevanten funktionalen Abhängigkeiten notiert.",
        "Ich kann mindestens eine konkrete Anomalie erklären.",
        "Meine Zerlegung bleibt über Schlüssel vollständig verbindbar."
      ]
    },
    "normalisierung": {
      courseCode: "L4.1",
      module: "lernfortschritt-4",
      sourceMaterials: ["L4_3 Information Übersicht Normalformen", "L4_1 bis L4_3 Aufgaben Normalisierung"],
      classroomTask: {
        tool: "Heft und MySQL Workbench EER Diagram",
        title: "Eine unstrukturierte Tabelle schrittweise bis 3NF zerlegen",
        intro: "Dokumentiere jeden Normalisierungsschritt. Eine fertige Endlösung ohne Begründung reicht nicht aus.",
        steps: [
          "1NF: Löse Wiederholungsgruppen und mehrwertige Zellen in atomare Werte auf.",
          "2NF: Prüfe bei zusammengesetzten Schlüsseln, ob Attribute nur von einem Schlüsselteil abhängen.",
          "3NF: Entferne transitive Abhängigkeiten zwischen Nichtschlüsselattributen.",
          "Lege Primär- und Fremdschlüssel fest und prüfe, ob sich die ursprünglichen Informationen wieder zusammensetzen lassen."
        ],
        evidence: "Ausgangstabelle, Zwischenschritte 1NF/2NF und Endmodell in 3NF",
        fileName: "L4_1_normalisierung_3nf.mwb"
      },
      completionChecks: [
        "Jeder Normalisierungsschritt ist getrennt dokumentiert.",
        "Primär- und Fremdschlüssel sind in jeder Stufe erkennbar.",
        "Ich kann begründen, welche Anomalie durch die Zerlegung vermieden wird."
      ]
    },
    "big-data": {
      courseCode: "L5.2",
      module: "lernfortschritt-5",
      sourceMaterials: ["L5_2 Information Definition Big Data", "L5_2 Aufgabe Definition Big Data", "L5_3 und L5_5 Aufgaben zu Gefahren und Nutzen"],
      classroomTask: {
        tool: "Browser und Heft",
        title: "Einen Big-Data-Fall mit dem 3V-Modell untersuchen",
        intro: "Untersuche einen fiktiven Mobilitätsdienst. Personenbezogene Daten werden nur beschrieben, nicht aus echten Konten oder Geräten erhoben.",
        steps: [
          "Ordne Datenmenge, Vielfalt und Entstehungsgeschwindigkeit den Begriffen Volume, Variety und Velocity zu.",
          "Benenne Beteiligte, möglichen Nutzen und mögliche Schäden.",
          "Prüfe Datenqualität, Zweckbindung, Transparenz und Datensparsamkeit.",
          "Formuliere ein vorläufiges Urteil mit mindestens einer Bedingung."
        ],
        evidence: "3V-Analyse und begründetes Kurzurteil"
      },
      completionChecks: [
        "Ich kann Volume, Variety und Velocity am Fall erklären.",
        "Meine Analyse berücksichtigt mehrere betroffene Perspektiven.",
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
      duration: 35,
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
        }
      ],
      classroomTask: {
        tool: "Browser und Heft",
        title: "Datenfluss eines fiktiven Schulportals analysieren",
        intro: "Ein fiktives Portal speichert Anmeldezeit, bearbeitete Aufgaben, Geräteart und Ergebnisse. Analysiere ausschließlich diese vorgegebenen Daten.",
        steps: [
          "Kennzeichne aktive und passive digitale Spuren.",
          "Zeichne den Datenfluss von der Erhebung bis zu einer möglichen Auswertung.",
          "Leite zwei sinnvolle und zwei problematische Nutzungsmöglichkeiten ab.",
          "Formuliere drei Regeln für einen datensparsamen Einsatz."
        ],
        evidence: "Datenflussdiagramm und drei Schutzregeln"
      },
      completionChecks: [
        "Ich kann aktive und passive Spuren unterscheiden.",
        "Mein Datenfluss benennt Erhebung, Speicherung und Nutzung.",
        "Meine Schutzregeln sind am Fall konkret begründet."
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
      duration: 45,
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
        }
      ],
      classroomTask: {
        tool: "Heft oder Textverarbeitung",
        title: "Über eine datenbasierte Prognose entscheiden",
        intro: "Eine fiktive Verkehrs-App möchte Bewegungs- und Mietdaten verwenden, um Engpässe vorherzusagen und personalisierte Tarife anzubieten.",
        steps: [
          "Formuliere die konkrete Entscheidung, über die du urteilst.",
          "Vergleiche Nutzen und Risiken aus Sicht von Nutzenden, Anbieter und Öffentlichkeit.",
          "Nenne mindestens ein Gegenargument zu deiner eigenen Position.",
          "Schreibe ein Urteil mit drei überprüfbaren Bedingungen."
        ],
        evidence: "Begründete Stellungnahme mit 180 bis 250 Wörtern"
      },
      completionChecks: [
        "Mein Urteil bezieht sich auf eine klar benannte Entscheidung.",
        "Ich habe ein ernstzunehmendes Gegenargument berücksichtigt.",
        "Meine Bedingungen sind konkret und überprüfbar formuliert."
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
    if (!content.practices.some((item) => item.id === practice.id)) {
      content.practices.push(practice);
    }
  });
})();
