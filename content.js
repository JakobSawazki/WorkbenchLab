window.WORKBENCH_CONTENT = {
  version: "0.2.0",
  updated: "2026-06-18",

  modules: [
    {
      id: "fundament",
      number: "01",
      title: "Daten verstehen",
      description: "Warum Datenbanken nötig sind und wie aus einer Situation Tabellen, Schlüssel und erste ER-Modelle entstehen.",
      lessonIds: ["warum-datenbanken", "relation-und-schluessel", "eerm-grundlagen", "workbench-workflow"]
    },
    {
      id: "sql-einstieg",
      number: "02",
      title: "SQL lesen und schreiben",
      description: "SELECT, Projektion, Filtermuster, Datumsfunktionen, Gruppierung und Datenpflege.",
      lessonIds: ["select-projektion", "where-sortierung", "sql-muster", "funktionen-gruppierung", "datum-berechnungen", "daten-verwalten"]
    },
    {
      id: "mehrere-tabellen",
      number: "03",
      title: "Mehrere Tabellen sicher verbinden",
      description: "Fremdschlüssel, referentielle Integrität, Joins und M:N-Beziehungen.",
      lessonIds: ["fremdschluessel-integritaet", "joins", "mn-beziehungen"]
    },
    {
      id: "qualitaet",
      number: "04",
      title: "Datenmodelle verbessern",
      description: "Redundanz erkennen, 3NF prüfen und Normalisierung als Werkzeug nutzen.",
      lessonIds: ["redundanz-3nf", "normalisierung"]
    },
    {
      id: "gesellschaft",
      number: "05",
      title: "Daten bewerten",
      description: "Big Data, digitale Spuren, Chancen und Risiken begründet diskutieren.",
      lessonIds: ["big-data"]
    }
  ],

  schemas: {
    "fahrschule-basic": {
      title: "Fahrschule: eine Tabelle",
      description: "Eine bewusst einfache Tabelle für Projektion, Selektion, Sortierung, Funktionen und Gruppierung.",
      tables: [
        {
          name: "fahrschueler",
          fields: ["schuelernr PK", "nachname", "vorname", "ort", "plz", "geburtsdatum", "fahrstunden"]
        }
      ],
      seed: `
CREATE TABLE fahrschueler (
  schuelernr INTEGER PRIMARY KEY,
  nachname TEXT NOT NULL,
  vorname TEXT NOT NULL,
  ort TEXT NOT NULL,
  plz TEXT NOT NULL,
  geburtsdatum TEXT NOT NULL,
  fahrstunden INTEGER NOT NULL
);

INSERT INTO fahrschueler VALUES
(1, 'Keller', 'Mia', 'Stuttgart', '70173', '2008-03-12', 8),
(2, 'Yilmaz', 'Cem', 'Esslingen', '73728', '2007-11-20', 14),
(3, 'Novak', 'Lea', 'Stuttgart', '70173', '2008-07-05', 6),
(4, 'Fischer', 'Jonas', 'Waiblingen', '71332', '2007-01-31', 18),
(5, 'Bauer', 'Nele', 'Ludwigsburg', '71634', '2008-09-14', 3),
(6, 'Schmid', 'Amir', 'Esslingen', '73728', '2006-12-02', 20),
(7, 'Roth', 'Emma', 'Tuebingen', '72070', '2007-05-28', 11),
(8, 'Weber', 'Noah', 'Waiblingen', '71332', '2008-02-18', 4),
(9, 'Klein', 'Sara', 'Stuttgart', '70173', '2007-08-09', 16),
(10, 'Wagner', 'Ben', 'Tuebingen', '72070', '2006-10-21', 9);
`
    },
    fahrschule: {
      title: "Fahrschule: mehrere Tabellen",
      description: "Ein normalisiertes Übungsschema mit Orten, Fahrschülern, Lehrkräften, Fahrzeugen und Fahrstunden.",
      tables: [
        { name: "orte", fields: ["ortnr PK", "plz", "ort"] },
        { name: "fahrschueler", fields: ["schuelernr PK", "nachname", "vorname", "geburtsdatum", "ortnr FK"] },
        { name: "fahrlehrer", fields: ["fahrlehrernr PK", "nachname", "vorname", "ortnr FK"] },
        { name: "kfz", fields: ["kfznr PK", "kennzeichen", "anschaffungspreis"] },
        { name: "fahrstunden", fields: ["fahrstundennr PK", "datum", "stundenzahl", "schuelernr FK", "fahrlehrernr FK", "kfznr FK"] }
      ],
      seed: `
PRAGMA foreign_keys = ON;

CREATE TABLE orte (
  ortnr INTEGER PRIMARY KEY,
  plz TEXT NOT NULL,
  ort TEXT NOT NULL
);

CREATE TABLE fahrschueler (
  schuelernr INTEGER PRIMARY KEY,
  nachname TEXT NOT NULL,
  vorname TEXT NOT NULL,
  geburtsdatum TEXT NOT NULL,
  ortnr INTEGER NOT NULL,
  FOREIGN KEY (ortnr) REFERENCES orte(ortnr)
);

CREATE TABLE fahrlehrer (
  fahrlehrernr INTEGER PRIMARY KEY,
  nachname TEXT NOT NULL,
  vorname TEXT NOT NULL,
  ortnr INTEGER NOT NULL,
  FOREIGN KEY (ortnr) REFERENCES orte(ortnr)
);

CREATE TABLE kfz (
  kfznr INTEGER PRIMARY KEY,
  kennzeichen TEXT NOT NULL,
  anschaffungspreis REAL NOT NULL
);

CREATE TABLE fahrstunden (
  fahrstundennr INTEGER PRIMARY KEY,
  datum TEXT NOT NULL,
  stundenzahl INTEGER NOT NULL,
  schuelernr INTEGER NOT NULL,
  fahrlehrernr INTEGER NOT NULL,
  kfznr INTEGER NOT NULL,
  FOREIGN KEY (schuelernr) REFERENCES fahrschueler(schuelernr),
  FOREIGN KEY (fahrlehrernr) REFERENCES fahrlehrer(fahrlehrernr),
  FOREIGN KEY (kfznr) REFERENCES kfz(kfznr)
);

INSERT INTO orte VALUES
(1, '70173', 'Stuttgart'),
(2, '73728', 'Esslingen'),
(3, '71332', 'Waiblingen'),
(4, '71634', 'Ludwigsburg'),
(5, '72070', 'Tuebingen');

INSERT INTO fahrschueler VALUES
(1, 'Keller', 'Mia', '2008-03-12', 1),
(2, 'Yilmaz', 'Cem', '2007-11-20', 2),
(3, 'Novak', 'Lea', '2008-07-05', 1),
(4, 'Fischer', 'Jonas', '2007-01-31', 3),
(5, 'Bauer', 'Nele', '2008-09-14', 4),
(6, 'Schmid', 'Amir', '2006-12-02', 2),
(7, 'Roth', 'Emma', '2007-05-28', 5),
(8, 'Weber', 'Noah', '2008-02-18', 3),
(9, 'Klein', 'Sara', '2007-08-09', 1),
(10, 'Wagner', 'Ben', '2006-10-21', 5);

INSERT INTO fahrlehrer VALUES
(1, 'Brandt', 'Heike', 1),
(2, 'Aydin', 'Mehmet', 2),
(3, 'Schuster', 'Lena', 3);

INSERT INTO kfz VALUES
(1, 'S-WB 101', 24800),
(2, 'ES-LA 22', 22150),
(3, 'WN-SQL 7', 31900);

INSERT INTO fahrstunden VALUES
(1, '2026-03-04', 2, 1, 1, 1),
(2, '2026-03-05', 1, 3, 1, 1),
(3, '2026-03-08', 2, 2, 2, 2),
(4, '2026-03-11', 2, 4, 3, 3),
(5, '2026-03-12', 1, 5, 1, 1),
(6, '2026-03-17', 2, 6, 2, 2),
(7, '2026-03-21', 1, 8, 3, 3),
(8, '2026-04-02', 2, 9, 1, 1),
(9, '2026-04-04', 1, 10, 2, 2),
(10, '2026-04-08', 2, 7, 3, 3),
(11, '2026-04-12', 1, 1, 2, 2),
(12, '2026-04-19', 2, 6, 1, 1);
`
    }
  },

  lessons: [
    {
      id: "warum-datenbanken",
      module: "fundament",
      index: "01",
      title: "Warum Datenbanken?",
      subtitle: "Datenbanken werden nötig, wenn Daten dauerhaft, widerspruchsarm und auswertbar verwaltet werden sollen.",
      duration: 18,
      xp: 25,
      difficulty: "easy",
      practiceId: "db-benefit-choice",
      objectives: [
        "typische Grenzen von Listen und Tabellenkalkulationen erklären",
        "Datenbestand, Datenbank und Datenbankmanagementsystem unterscheiden",
        "eine reale Situation nach Daten, Regeln und Auswertungsfragen zerlegen"
      ],
      sections: [
        {
          title: "Vom Zettel zur Datenbank",
          body: [
            "Eine einzelne Tabelle reicht, solange wenige Personen an wenigen Daten arbeiten. Sobald mehrere Tabellen zusammenhängen, mehrere Personen Daten ändern oder Auswertungen zuverlässig wiederholbar sein müssen, braucht man eine Datenbank.",
            "Ein Datenbankmanagementsystem, kurz DBMS, speichert nicht nur Werte. Es erzwingt Regeln, schützt Beziehungen und beantwortet Abfragen in einer formalen Sprache."
          ],
          visual: "database-need"
        },
        {
          title: "Der rote Faden in BPE6",
          body: [
            "Du gehst immer denselben Weg: Situation analysieren, Entity-Relationship-Modell entwerfen, Relationenmodell ableiten, Tabellen erzeugen, Daten einfügen und mit SQL auswerten.",
            "Dieser Weg ist prüfungsrelevant, weil er Modellierung und konkrete SQL-Arbeit verbindet."
          ],
          code: `Situation -> eERM -> Relationenmodell -> CREATE TABLE -> INSERT -> SELECT`
        }
      ],
      quiz: {
        question: "Was leistet ein DBMS zusätzlich zu einer einfachen Datei?",
        options: [
          "Es kann Regeln wie Schlüssel, Beziehungen und konsistente Änderungen verwalten.",
          "Es macht jede Tabelle automatisch fehlerfrei.",
          "Es ersetzt die fachliche Analyse der Situation."
        ],
        correct: 0,
        explanation: "Ein DBMS hilft beim Speichern, Prüfen und Auswerten. Das fachliche Modell muss trotzdem sauber entwickelt werden."
      }
    },
    {
      id: "relation-und-schluessel",
      module: "fundament",
      index: "02",
      title: "Relation, Attribut, Primärschlüssel",
      subtitle: "Eine Tabelle wird fachlich zur Relation, wenn Zeilen, Attribute und Schlüssel eindeutig gedacht werden.",
      duration: 20,
      xp: 30,
      difficulty: "easy",
      practiceId: "relation-key-choice",
      objectives: [
        "Relation, Datensatz, Attribut und Attributwert unterscheiden",
        "Primärschlüssel als eindeutige Identifikation erklären",
        "passende Datentypen für Text, Zahl, Datum und Wahrheitswert wählen"
      ],
      sections: [
        {
          title: "Die Fachsprache",
          body: [
            "Ein Datensatz ist eine Zeile, ein Attribut ist eine Spalte. Ein Attributwert ist der konkrete Wert in einer Zelle.",
            "Der Primärschlüssel identifiziert jeden Datensatz eindeutig. Namen sind dafür selten geeignet, weil mehrere Personen gleich heißen können."
          ],
          visual: "relation-table"
        },
        {
          title: "Datentypen sind Regeln",
          body: [
            "Ein Datentyp beschreibt, welche Werte erlaubt und welche Operationen sinnvoll sind. Mit einem Datum kann man Zeitabstände berechnen, mit einer Telefonnummer normalerweise nicht rechnen.",
            "In MySQL Workbench begegnen dir zum Beispiel VARCHAR, INT, DOUBLE, DATE und BOOLEAN."
          ],
          code: `schuelernr INT PRIMARY KEY\nnachname VARCHAR(45)\ngeburtsdatum DATE\nfahrstunden INT`
        }
      ],
      quiz: {
        question: "Warum eignet sich eine künstliche Nummer oft gut als Primärschlüssel?",
        options: [
          "Weil sie kurz, stabil und eindeutig vergeben werden kann.",
          "Weil sie automatisch alle Daten sortiert.",
          "Weil sie Fremdschlüssel überflüssig macht."
        ],
        correct: 0,
        explanation: "Ein Primärschlüssel muss eindeutig und stabil sein. Eine Nummer erfüllt das meist besser als ein Name."
      }
    },
    {
      id: "eerm-grundlagen",
      module: "fundament",
      index: "03",
      title: "eERM: Entitäten und Beziehungen",
      subtitle: "Das erweiterte Entity-Relationship-Modell macht fachliche Objekte, Attribute und Kardinalitäten sichtbar.",
      duration: 25,
      xp: 35,
      difficulty: "medium",
      practiceId: "eerm-cardinality",
      objectives: [
        "Entität, Entitätstyp, Attribut und Beziehungstyp unterscheiden",
        "Kardinalitäten fachlich begründen",
        "ein kleines eERM für MySQL Workbench vorbereiten"
      ],
      sections: [
        {
          title: "Denke in Dingen und Beziehungen",
          body: [
            "Eine Entität ist ein konkretes Objekt der realen Welt, zum Beispiel Mia Keller. Ein Entitätstyp beschreibt die Klasse solcher Objekte, zum Beispiel Fahrschüler.",
            "Eine Beziehung verbindet Entitätstypen. Kardinalitäten beschreiben, wie viele Objekte auf jeder Seite beteiligt sein dürfen oder müssen."
          ],
          visual: "er-simple"
        },
        {
          title: "Kardinalitäten lesen",
          body: [
            "Eine 1:N-Beziehung bedeutet: Ein Ort kann zu vielen Fahrschülern gehören, ein Fahrschüler wohnt aber genau an einem Ort.",
            "M:N-Beziehungen werden später durch eine eigene Zwischentabelle aufgelöst, weil eine relationale Datenbank keine Mehrfachliste in einer Zelle speichern sollte."
          ],
          tip: "Formuliere Kardinalitäten immer als zwei Sätze: Ein A kann wie viele B haben? Ein B gehört zu wie vielen A?"
        }
      ],
      quiz: {
        question: "Welche Frage hilft beim Bestimmen einer Kardinalität?",
        options: [
          "Wie viele Objekte der einen Seite dürfen zu einem Objekt der anderen Seite gehören?",
          "Welche Tabelle steht im SQL-Befehl zuerst?",
          "Wie breit wird die Tabelle in der Workbench angezeigt?"
        ],
        correct: 0,
        explanation: "Kardinalitäten entstehen aus fachlichen Regeln, nicht aus der späteren Bildschirmdarstellung."
      }
    },
    {
      id: "workbench-workflow",
      module: "fundament",
      index: "04",
      title: "Vom Modell zur Datenbank",
      subtitle: "In MySQL Workbench wird aus dem eERM eine echte Datenbank, die du mit Skripten füllst und mit SQL überprüfst.",
      duration: 28,
      xp: 40,
      difficulty: "medium",
      practiceId: "workbench-flow-slots",
      objectives: [
        "MySQL-Dienst, Workbench und Verbindung in der richtigen Reihenfolge starten",
        "ein Modell per Forward Engineering oder Synchronize Model übertragen",
        "SQL-Skripte ausführen und das Ergebnis im Schema prüfen"
      ],
      sections: [
        {
          title: "Sicher starten",
          body: [
            "Starte zuerst den Informatik-Stick und darin den MySQL-Dienst. Lass das Startfenster geöffnet. Erst danach öffnest du MySQL Workbench und stellst die vorbereitete Verbindung her.",
            "Wenn keine Verbindung möglich ist, prüfe zuerst den laufenden Dienst. Das spart mehr Zeit als Änderungen am Modell oder SQL-Skript."
          ],
          visual: "workbench-flow"
        },
        {
          title: "Modell übertragen",
          body: [
            "Öffne das Workbench-Modell und kontrolliere Tabellen, Datentypen, Primärschlüssel und Beziehungen. Über Database > Forward Engineer erzeugst du eine neue Datenbank; Synchronize Model gleicht ein bestehendes Schema mit dem Modell ab.",
            "Lies das erzeugte SQL vor dem Ausführen: CREATE DATABASE, CREATE TABLE und FOREIGN KEY machen sichtbar, wie Workbench dein Modell umsetzt. Aktualisiere anschließend die Schema-Ansicht mit Refresh All."
          ],
          code: `Modell (.mwb) -> Forward Engineer -> SQL prüfen -> ausführen -> Refresh All`
        },
        {
          title: "Daten importieren und prüfen",
          body: [
            "Öffne ein bereitgestelltes Skript über File > Open SQL Script und führe es mit dem Blitzsymbol aus. Wähle das richtige Schema als Standard und kontrolliere die Daten anschließend mit SELECT.",
            "Optionen wie DROP Objects löschen vorhandene Strukturen. Nutze sie nur, wenn die Aufgabe ausdrücklich einen vollständigen Neuaufbau verlangt."
          ],
          code: `USE fahrschule;\nSELECT * FROM fahrschueler;`,
          warning: "Prüfe vor jedem Ausführen, mit welchem Schema die Workbench verbunden ist und ob das Skript DROP-Anweisungen enthält."
        }
      ],
      quiz: {
        question: "Welche Reihenfolge ist für die Unterrichtsumgebung richtig?",
        options: [
          "MySQL-Dienst starten, Workbench öffnen, Verbindung herstellen, Modell oder Skript ausführen.",
          "Workbench öffnen, Tabellen löschen, danach den Informatik-Stick starten.",
          "Zuerst SELECT ausführen und anschließend den Datenbankdienst starten."
        ],
        correct: 0,
        explanation: "Workbench kann erst auf die Datenbank zugreifen, wenn der MySQL-Dienst läuft und die Verbindung geöffnet ist."
      }
    },
    {
      id: "select-projektion",
      module: "sql-einstieg",
      index: "05",
      title: "SELECT und Projektion",
      subtitle: "Mit SELECT wählst du aus, welche Attribute in der Ergebnismenge erscheinen.",
      duration: 22,
      xp: 35,
      difficulty: "easy",
      practiceId: "sql-projection",
      objectives: [
        "SELECT und FROM sicher einsetzen",
        "Projektion als Auswahl von Attributen erklären",
        "Spaltenreihenfolge und Aliasnamen bewusst nutzen"
      ],
      sections: [
        {
          title: "Die kleinste Abfrage",
          body: [
            "Eine SELECT-Abfrage fragt Daten ab, ohne die Tabelle zu verändern. Die Projektion entscheidet, welche Spalten im Ergebnis stehen.",
            "SELECT * ist beim Erkunden erlaubt, in Aufgaben aber oft zu ungenau. Schreibe die benötigten Attribute bewusst hin."
          ],
          code: `SELECT nachname, vorname\nFROM fahrschueler;`
        },
        {
          title: "Lesbare Ergebnisse",
          body: [
            "Mit AS kannst du Ergebnisspalten benennen. Das ändert nicht die Tabelle, sondern nur die Anzeige des Abfrageergebnisses.",
            "Eine gute Abfrage zeigt genau die Informationen, die zur Frage passen."
          ],
          code: `SELECT nachname AS Name, fahrstunden AS Stunden\nFROM fahrschueler;`
        }
      ],
      quiz: {
        question: "Was bedeutet Projektion in einer SQL-Abfrage?",
        options: [
          "Die Auswahl der Spalten, die im Ergebnis erscheinen.",
          "Die Auswahl der Zeilen, die eine Bedingung erfüllen.",
          "Das Speichern neuer Datensätze."
        ],
        correct: 0,
        explanation: "Projektion bezieht sich auf Attribute bzw. Spalten."
      }
    },
    {
      id: "where-sortierung",
      module: "sql-einstieg",
      index: "06",
      title: "Selektion, Bedingungen und Sortierung",
      subtitle: "WHERE filtert Datensätze, ORDER BY bringt das Ergebnis in eine nachvollziehbare Reihenfolge.",
      duration: 26,
      xp: 40,
      difficulty: "medium",
      practiceId: "sql-selection-order",
      objectives: [
        "WHERE-Bedingungen mit Vergleichsoperatoren formulieren",
        "AND, OR und NOT gezielt einsetzen",
        "Ergebnisse mit ORDER BY auf- oder absteigend sortieren"
      ],
      sections: [
        {
          title: "Zeilen auswählen",
          body: [
            "Die Selektion entscheidet, welche Datensätze im Ergebnis bleiben. Bedingungen prüfen jeden Datensatz einzeln.",
            "Textwerte stehen in einfachen Anführungszeichen. Zahlen werden ohne Anführungszeichen verglichen."
          ],
          code: `SELECT nachname, vorname, ort\nFROM fahrschueler\nWHERE ort = 'Stuttgart';`
        },
        {
          title: "Mehrere Bedingungen",
          body: [
            "AND verlangt, dass beide Bedingungen wahr sind. OR lässt Datensätze zu, bei denen mindestens eine Bedingung wahr ist.",
            "ORDER BY steht am Ende der Abfrage. DESC sortiert absteigend."
          ],
          code: `SELECT nachname, vorname, fahrstunden\nFROM fahrschueler\nWHERE ort = 'Stuttgart' OR fahrstunden >= 15\nORDER BY fahrstunden DESC;`
        }
      ],
      quiz: {
        question: "Welche Klausel filtert Zeilen?",
        options: ["WHERE", "ORDER BY", "AS"],
        correct: 0,
        explanation: "WHERE formuliert Bedingungen für Datensätze."
      }
    },
    {
      id: "sql-muster",
      module: "sql-einstieg",
      index: "07",
      title: "DISTINCT und flexible Filter",
      subtitle: "Mit DISTINCT, LIKE, IN und BETWEEN formulierst du präzise Abfragen für typische Suchsituationen.",
      duration: 28,
      xp: 40,
      difficulty: "medium",
      practiceId: "sql-distinct",
      objectives: [
        "doppelte Ergebniszeilen mit DISTINCT entfernen",
        "Textmuster mit LIKE, Prozentzeichen und Unterstrich beschreiben",
        "Wertelisten mit IN und Bereiche mit BETWEEN filtern"
      ],
      sections: [
        {
          title: "Einmalige Ergebnisse",
          body: [
            "DISTINCT steht direkt nach SELECT und entfernt doppelte Zeilen aus der Ergebnismenge. Es verändert die gespeicherten Daten nicht.",
            "Bei mehreren ausgewählten Spalten zählt die gesamte Kombination. DISTINCT ort, plz liefert jede vorkommende Kombination aus Ort und Postleitzahl einmal."
          ],
          code: `SELECT DISTINCT ort, plz\nFROM fahrschueler\nORDER BY ort;`
        },
        {
          title: "Muster, Listen und Bereiche",
          body: [
            "LIKE vergleicht Textmuster: % steht für beliebig viele Zeichen, _ für genau ein Zeichen. IN prüft, ob ein Wert in einer Liste vorkommt.",
            "BETWEEN beschreibt einen geschlossenen Bereich. Die beiden Grenzwerte gehören also zum Ergebnis."
          ],
          code: `WHERE nachname LIKE 'K%'\nWHERE ort IN ('Stuttgart', 'Esslingen')\nWHERE fahrstunden BETWEEN 5 AND 15`,
          visual: "query-patterns"
        }
      ],
      quiz: {
        question: "Wo steht DISTINCT in einer SELECT-Abfrage?",
        options: [
          "Direkt nach SELECT.",
          "Zwischen FROM und WHERE.",
          "Erst nach ORDER BY."
        ],
        correct: 0,
        explanation: "Die korrekte Form lautet SELECT DISTINCT spalte FROM tabelle."
      }
    },
    {
      id: "funktionen-gruppierung",
      module: "sql-einstieg",
      index: "08",
      title: "Funktionen, Gruppierung und HAVING",
      subtitle: "Aggregatfunktionen verdichten viele Datensätze zu aussagekräftigen Kennzahlen.",
      duration: 30,
      xp: 45,
      difficulty: "medium",
      practiceId: "sql-group-having",
      objectives: [
        "COUNT, SUM, AVG, MIN und MAX erklären",
        "GROUP BY passend zu Aggregatfunktionen einsetzen",
        "HAVING als Bedingung für Gruppen unterscheiden"
      ],
      sections: [
        {
          title: "Von Zeilen zu Kennzahlen",
          body: [
            "COUNT zählt Datensätze, SUM summiert Werte, AVG berechnet den Durchschnitt. MIN und MAX finden kleinste und größte Werte.",
            "GROUP BY bildet Gruppen. Jede Gruppe liefert dann eine eigene Kennzahl."
          ],
          code: `SELECT ort, COUNT(*) AS anzahl\nFROM fahrschueler\nGROUP BY ort;`
        },
        {
          title: "WHERE oder HAVING?",
          body: [
            "WHERE filtert einzelne Datensätze vor der Gruppierung. HAVING filtert fertige Gruppen nach der Aggregatfunktion.",
            "Wenn die Bedingung COUNT, SUM oder AVG enthält, brauchst du in der Regel HAVING."
          ],
          code: `SELECT ort, COUNT(*) AS anzahl\nFROM fahrschueler\nGROUP BY ort\nHAVING COUNT(*) >= 2;`
        }
      ],
      quiz: {
        question: "Wann brauchst du HAVING?",
        options: [
          "Wenn eine Bedingung auf eine Gruppe oder Aggregatfunktion angewendet wird.",
          "Immer direkt nach SELECT.",
          "Nur beim Einfügen neuer Daten."
        ],
        correct: 0,
        explanation: "HAVING filtert Gruppen, WHERE filtert einzelne Datensätze."
      }
    },
    {
      id: "datum-berechnungen",
      module: "sql-einstieg",
      index: "09",
      title: "Datum und Berechnungen",
      subtitle: "Datumsfunktionen und berechnete Spalten machen aus gespeicherten Werten neue Informationen.",
      duration: 26,
      xp: 40,
      difficulty: "medium",
      practiceId: "sql-date-functions",
      objectives: [
        "Datumswerte im Format JJJJ-MM-TT sicher verwenden",
        "Jahr und Monat mit YEAR und MONTH auswerten",
        "berechnete Ergebnisspalten mit aussagekräftigen Aliasnamen ausgeben"
      ],
      sections: [
        {
          title: "Ein Datum gezielt auswerten",
          body: [
            "DATE-Werte werden in SQL üblicherweise als 'JJJJ-MM-TT' geschrieben. YEAR(datum) liefert das Jahr, MONTH(datum) den Monat und NOW() den aktuellen Zeitpunkt.",
            "Funktionen können im SELECT-Teil angezeigt oder in einer WHERE-Bedingung zum Filtern genutzt werden."
          ],
          code: `SELECT nachname, MONTH(geburtsdatum) AS geburtsmonat\nFROM fahrschueler\nWHERE YEAR(geburtsdatum) = 2008;`,
          visual: "date-functions"
        },
        {
          title: "Werte berechnen",
          body: [
            "SQL kann Zahlen direkt in der Ergebnismenge berechnen. Ein Alias beschreibt, was der berechnete Wert bedeutet.",
            "DATEDIFF(datum1, datum2) liefert in MySQL die Anzahl der Tage zwischen zwei Datumswerten."
          ],
          code: `SELECT nachname, fahrstunden * 45 AS minuten\nFROM fahrschueler;`
        }
      ],
      quiz: {
        question: "Welche Bedingung findet Datensätze aus dem Jahr 2008?",
        options: [
          "WHERE YEAR(geburtsdatum) = 2008",
          "WHERE MONTH(geburtsdatum) = 2008",
          "WHERE geburtsdatum = YEAR"
        ],
        correct: 0,
        explanation: "YEAR extrahiert den Jahresanteil eines Datums und kann anschließend verglichen werden."
      }
    },
    {
      id: "daten-verwalten",
      module: "sql-einstieg",
      index: "10",
      title: "CREATE, INSERT, UPDATE, DELETE",
      subtitle: "Datenbanken werden nicht nur gelesen, sondern auch aufgebaut und gepflegt.",
      duration: 28,
      xp: 40,
      difficulty: "medium",
      practiceId: "sql-insert",
      objectives: [
        "CREATE TABLE als Strukturdefinition lesen",
        "INSERT zum Erfassen neuer Datensätze nutzen",
        "UPDATE und DELETE nur mit sicherer WHERE-Bedingung einsetzen"
      ],
      sections: [
        {
          title: "Struktur und Daten trennen",
          body: [
            "CREATE TABLE legt fest, welche Attribute eine Tabelle besitzt und welche Regeln gelten. INSERT fügt konkrete Datensätze ein.",
            "In MySQL Workbench erzeugst du Tabellen häufig aus einem eERM-Modell. SQL macht sichtbar, was im Hintergrund passiert."
          ],
          code: `CREATE TABLE orte (\n  ortnr INT PRIMARY KEY,\n  plz VARCHAR(5),\n  ort VARCHAR(45)\n);\n\nINSERT INTO orte VALUES (6, '71638', 'Ludwigsburg');`
        },
        {
          title: "Ändern und Löschen",
          body: [
            "UPDATE und DELETE sind mächtig. Ohne WHERE betreffen sie alle Datensätze der Tabelle.",
            "Prüfe vor Änderungen oft zuerst mit SELECT, welche Datensätze deine Bedingung trifft."
          ],
          code: `SELECT * FROM orte WHERE ortnr = 6;\n\nUPDATE orte SET plz = '71634' WHERE ortnr = 6;\nDELETE FROM orte WHERE ortnr = 6;`,
          warning: "Im Browser-Labor wird die Datenbank bei jedem Lauf neu aufgebaut. In MySQL Workbench sind Änderungen dauerhaft, bis du sie zurücksetzt."
        }
      ],
      quiz: {
        question: "Warum ist DELETE ohne WHERE gefährlich?",
        options: [
          "Weil alle Datensätze der Tabelle gelöscht werden können.",
          "Weil dadurch automatisch alle Datenbanken gelöscht werden.",
          "Weil DELETE nur in SELECT-Abfragen erlaubt ist."
        ],
        correct: 0,
        explanation: "Ohne WHERE gibt es keine Einschränkung auf bestimmte Datensätze."
      }
    },
    {
      id: "fremdschluessel-integritaet",
      module: "mehrere-tabellen",
      index: "11",
      title: "Fremdschlüssel und referentielle Integrität",
      subtitle: "Fremdschlüssel verbinden Tabellen und verhindern verwaiste Datensätze.",
      duration: 24,
      xp: 40,
      difficulty: "medium",
      practiceId: "fk-integrity-choice",
      objectives: [
        "Primärschlüssel und Fremdschlüssel unterscheiden",
        "referentielle Integrität an Beispielen erklären",
        "1:N-Beziehungen ins Relationenmodell überführen"
      ],
      sections: [
        {
          title: "Der Verweis",
          body: [
            "Ein Fremdschlüssel ist ein Attribut, das auf den Primärschlüssel einer anderen Tabelle verweist. Dadurch muss der Ort nicht in jedem Fahrschüler-Datensatz wiederholt werden.",
            "Referentielle Integrität bedeutet: Ein Verweis darf nur auf einen vorhandenen Datensatz zeigen."
          ],
          visual: "foreign-key"
        },
        {
          title: "Warum das wichtig ist",
          body: [
            "Wenn ein Fahrschüler die ortnr 3 besitzt, muss es in der Tabelle orte auch einen Datensatz mit ortnr 3 geben.",
            "So kann eine Datenbank verhindern, dass ein Datensatz auf einen Ort zeigt, der gar nicht existiert."
          ],
          code: `FOREIGN KEY (ortnr) REFERENCES orte(ortnr)`
        }
      ],
      quiz: {
        question: "Was schützt referentielle Integrität?",
        options: [
          "Dass Fremdschlüssel auf existierende Primärschlüssel verweisen.",
          "Dass alle Nachnamen alphabetisch sortiert sind.",
          "Dass jede Tabelle genau eine Spalte hat."
        ],
        correct: 0,
        explanation: "Referentielle Integrität sichert gültige Beziehungen zwischen Tabellen."
      }
    },
    {
      id: "joins",
      module: "mehrere-tabellen",
      index: "12",
      title: "Joins über mehrere Tabellen",
      subtitle: "Mit JOIN setzt du fachlich zusammengehörige Informationen aus mehreren Relationen wieder zusammen.",
      duration: 32,
      xp: 50,
      difficulty: "plus",
      practiceId: "sql-join-places",
      objectives: [
        "INNER JOIN mit ON-Bedingung formulieren",
        "Tabellennamen und Aliase zur Lesbarkeit nutzen",
        "Abfragen über mehrere Tabellen systematisch aufbauen"
      ],
      sections: [
        {
          title: "Warum Join?",
          body: [
            "Normalisierung verteilt Daten auf mehrere Tabellen. Ein JOIN führt sie für eine konkrete Auswertung wieder zusammen.",
            "Die ON-Bedingung beschreibt, welche Schlüssel zusammenpassen."
          ],
          code: `SELECT f.nachname, f.vorname, o.ort\nFROM fahrschueler AS f\nJOIN orte AS o ON f.ortnr = o.ortnr;`
        },
        {
          title: "Schrittweise erweitern",
          body: [
            "Starte mit zwei Tabellen und einer klaren ON-Bedingung. Füge danach weitere Tabellen hinzu.",
            "Wenn zu viele oder zu wenige Zeilen erscheinen, prüfe zuerst die Join-Bedingungen."
          ],
          code: `SELECT f.nachname, l.nachname AS fahrlehrer, s.datum\nFROM fahrstunden AS s\nJOIN fahrschueler AS f ON s.schuelernr = f.schuelernr\nJOIN fahrlehrer AS l ON s.fahrlehrernr = l.fahrlehrernr;`
        }
      ],
      quiz: {
        question: "Welche Aufgabe hat die ON-Bedingung?",
        options: [
          "Sie legt fest, welche Datensätze aus den Tabellen zusammengehören.",
          "Sie sortiert das Ergebnis alphabetisch.",
          "Sie löscht doppelte Tabellen."
        ],
        correct: 0,
        explanation: "ON verbindet passende Schlüsselwerte aus den beteiligten Tabellen."
      }
    },
    {
      id: "mn-beziehungen",
      module: "mehrere-tabellen",
      index: "13",
      title: "M:N-Beziehungen auflösen",
      subtitle: "Viele-zu-viele-Beziehungen brauchen in relationalen Datenbanken eine eigene Zwischentabelle.",
      duration: 26,
      xp: 45,
      difficulty: "plus",
      practiceId: "sql-join-hours",
      objectives: [
        "begründen, warum M:N nicht als Mehrfachwert in einer Zelle gespeichert wird",
        "eine Zwischentabelle mit zwei Fremdschlüsseln modellieren",
        "Auswertungen über eine Zwischentabelle lesen"
      ],
      sections: [
        {
          title: "Das typische Muster",
          body: [
            "Ein Fahrschüler kann viele Fahrstunden haben. Eine Fahrstunde gehört zu genau einem Fahrschüler, einem Fahrlehrer und einem Fahrzeug.",
            "Bei echten M:N-Fällen, zum Beispiel Schüler und Kurse, entsteht eine Zwischentabelle wie belegung mit den Fremdschlüsseln schuelernr und kursnr."
          ],
          visual: "mn-resolution"
        },
        {
          title: "Zwischentabellen sind fachlich wertvoll",
          body: [
            "Eine Zwischentabelle enthält oft eigene Attribute, zum Beispiel Datum, Note, Rolle oder Anzahl.",
            "Dadurch wird aus einer scheinbaren Verbindung ein eigener fachlicher Vorgang."
          ],
          code: `fahrstunden(fahrstundennr PK, datum, stundenzahl,\n             schuelernr FK, fahrlehrernr FK, kfznr FK)`
        }
      ],
      quiz: {
        question: "Warum löst man M:N-Beziehungen über eine Zwischentabelle auf?",
        options: [
          "Weil jede Tabellenzelle atomare Werte enthalten soll und Beziehungen über Schlüssel laufen.",
          "Weil SQL keine SELECT-Abfragen über zwei Tabellen erlaubt.",
          "Weil Primärschlüssel dann nicht mehr nötig sind."
        ],
        correct: 0,
        explanation: "Eine Zwischentabelle macht Mehrfachbeziehungen sauber relational modellierbar."
      }
    },
    {
      id: "redundanz-3nf",
      module: "qualitaet",
      index: "14",
      title: "Redundanz und Dritte Normalform",
      subtitle: "Gute Datenmodelle speichern Fakten möglichst einmal und vermeiden Änderungsanomalien.",
      duration: 30,
      xp: 50,
      difficulty: "plus",
      practiceId: "normalform-choice",
      objectives: [
        "Redundanz und Anomalien an Beispielen erkennen",
        "funktionale Abhängigkeiten in einfacher Form lesen",
        "die Idee der Dritten Normalform erklären"
      ],
      sections: [
        {
          title: "Redundanz ist mehr als doppelte Werte",
          body: [
            "Redundanz bedeutet, dass dasselbe fachliche Faktum mehrfach gespeichert wird. Dadurch können Einfüge-, Änderungs- und Löschanomalien entstehen.",
            "Wenn die PLZ eines Orts in vielen Fahrschüler-Zeilen steht, muss eine Korrektur an vielen Stellen erfolgen."
          ],
          visual: "redundancy"
        },
        {
          title: "Die Idee der 3NF",
          body: [
            "In der Dritten Normalform hängt jedes Nicht-Schlüsselattribut vom Schlüssel, vom ganzen Schlüssel und von nichts anderem als dem Schlüssel ab.",
            "Praktisch heißt das: Informationen über Orte gehören in die Tabelle orte, nicht wiederholt in jeden Fahrschüler-Datensatz."
          ],
          code: `fahrschueler(schuelernr, nachname, vorname, ortnr)\norte(ortnr, plz, ort)`
        }
      ],
      quiz: {
        question: "Welche Tabelle ist eher redundant?",
        options: [
          "fahrschueler mit wiederholten Spalten plz und ort in jeder Zeile.",
          "orte mit je einer Zeile pro Ort.",
          "fahrschueler mit einem Fremdschlüssel ortnr."
        ],
        correct: 0,
        explanation: "Wenn Ortsdaten immer wieder in Fahrschüler-Zeilen stehen, wird ein Faktum mehrfach gespeichert."
      }
    },
    {
      id: "normalisierung",
      module: "qualitaet",
      index: "15",
      title: "Normalisierung 1NF bis 3NF",
      subtitle: "Normalisierung ist ein Prüfverfahren, mit dem du Tabellen schrittweise in robuste Relationen zerlegst.",
      duration: 28,
      xp: 45,
      difficulty: "plus",
      practiceId: "normalform-slots",
      objectives: [
        "1NF, 2NF und 3NF voneinander abgrenzen",
        "Verstöße gegen Normalformen begründet benennen",
        "eine unübersichtliche Tabelle in kleinere Relationen überführen"
      ],
      sections: [
        {
          title: "Drei Stufen",
          body: [
            "1NF fordert atomare Attributwerte: keine Listen in einer Zelle. 2NF betrifft zusammengesetzte Schlüssel: Nicht-Schlüsselattribute hängen vom ganzen Schlüssel ab.",
            "3NF entfernt transitive Abhängigkeiten: Ein Nicht-Schlüsselattribut hängt nicht von einem anderen Nicht-Schlüsselattribut ab."
          ],
          visual: "normalform-flow"
        },
        {
          title: "Nicht mechanisch, sondern begründet",
          body: [
            "Normalisierung ist kein Selbstzweck. Du begründest immer fachlich, welches Faktum wohin gehört.",
            "In Prüfungen zählt besonders, dass du den Verstoß benennst und eine saubere Zerlegung mit Schlüsseln angeben kannst."
          ],
          tip: "Prüfe zuerst: Gibt es Listen in Zellen? Danach: Gibt es Teilschlüsselabhängigkeiten? Danach: Gibt es Abhängigkeiten zwischen Nicht-Schlüsselattributen?"
        }
      ],
      quiz: {
        question: "Welcher Satz passt zur 1NF?",
        options: [
          "Jede Zelle enthält einen atomaren Wert.",
          "Jede Tabelle hat genau drei Spalten.",
          "Jede Abfrage braucht GROUP BY."
        ],
        correct: 0,
        explanation: "Die 1NF verlangt atomare Werte statt Listen oder wiederholter Gruppen in einer Zelle."
      }
    },
    {
      id: "big-data",
      module: "gesellschaft",
      index: "16",
      title: "Big Data: Chancen und Risiken",
      subtitle: "Massendaten können Zusammenhänge sichtbar machen, aber auch Menschen transparent und beeinflussbar machen.",
      duration: 24,
      xp: 35,
      difficulty: "medium",
      practiceId: "bigdata-choice",
      objectives: [
        "Big Data anhand von Menge, Vielfalt, Geschwindigkeit und Auswertbarkeit beschreiben",
        "Chancen datenbasierter Analysen benennen",
        "Risiken für Individuum und Gesellschaft begründet beurteilen"
      ],
      sections: [
        {
          title: "Nicht nur viele Daten",
          body: [
            "Big Data meint nicht einfach eine große Datei. Typisch sind sehr viele, vielfältige und schnell entstehende Daten, die automatisiert ausgewertet werden.",
            "Relationale Datenbanken sind dafür eine Grundlage, aber Big-Data-Systeme gehen technisch oft darüber hinaus."
          ],
          code: `digitale Spuren -> Sammlung -> Verknüpfung -> Mustererkennung -> Entscheidung oder Empfehlung`
        },
        {
          title: "Bewerten lernen",
          body: [
            "Chancen liegen zum Beispiel in Verkehrsplanung, Medizin, Energieeffizienz oder Betrugserkennung.",
            "Risiken entstehen durch Profilbildung, Diskriminierung, Manipulation, fehlende Transparenz und Datenmissbrauch."
          ],
          visual: "big-data-balance"
        }
      ],
      quiz: {
        question: "Was ist eine zentrale Big-Data-Risikoüberlegung?",
        options: [
          "Aus vielen einzelnen Spuren können aussagekräftige Persönlichkeitsprofile entstehen.",
          "Datenbanken können grundsätzlich keine Daten speichern.",
          "SQL-Abfragen sind immer anonym."
        ],
        correct: 0,
        explanation: "Die Verknüpfung vieler Spuren kann neue, sensible Informationen erzeugen."
      }
    }
  ],

  practices: [
    {
      id: "db-benefit-choice",
      lessonId: "warum-datenbanken",
      type: "choice",
      title: "Situation prüfen",
      description: "Entscheide, ob eine Datenbank gegenüber einer einfachen Liste fachlich begründet ist.",
      difficulty: "easy",
      xp: 25,
      questions: [
        {
          question: "Eine Fahrschule speichert Schüler, Fahrlehrer, Fahrzeuge und Fahrstunden. Mehrere Personen ändern Daten. Was spricht am stärksten für eine Datenbank?",
          options: [
            "Die Daten hängen zusammen und müssen konsistent geändert und ausgewertet werden.",
            "Eine Datenbank hat immer schönere Farben.",
            "Eine einzelne Textdatei ist für Joins besser geeignet."
          ],
          correct: 0,
          feedback: "Genau: Beziehungen, Mehrbenutzerarbeit und wiederholbare Auswertungen sind starke Datenbankgründe."
        }
      ]
    },
    {
      id: "relation-key-choice",
      lessonId: "relation-und-schluessel",
      type: "choice",
      title: "Primärschlüssel wählen",
      description: "Wähle den stabilsten Primärschlüssel für eine Fahrschüler-Tabelle.",
      difficulty: "easy",
      xp: 25,
      questions: [
        {
          question: "Welche Spalte eignet sich am besten als Primärschlüssel?",
          options: ["schuelernr", "nachname", "ort"],
          correct: 0,
          feedback: "Die schuelernr kann eindeutig vergeben werden. Nachname und Ort sind nicht eindeutig."
        }
      ]
    },
    {
      id: "eerm-cardinality",
      lessonId: "eerm-grundlagen",
      type: "slots",
      title: "Kardinalitäten setzen",
      description: "Vervollständige ein kleines eERM für Fahrschüler und Orte.",
      difficulty: "medium",
      xp: 35,
      prompt: "Ein Fahrschüler wohnt genau an einem Ort. Ein Ort kann in der Datenbank zu keinem, einem oder vielen Fahrschülern gehören.",
      slots: [
        {
          id: "left",
          label: "Fahrschüler zu Ort",
          options: ["genau 1", "0 bis n", "genau n"],
          answer: "genau 1"
        },
        {
          id: "right",
          label: "Ort zu Fahrschüler",
          options: ["genau 1", "0 bis n", "höchstens 1"],
          answer: "0 bis n"
        },
        {
          id: "relation",
          label: "Beziehungstyp",
          options: ["1:N", "M:N", "1:1"],
          answer: "1:N"
        }
      ],
      explanation: "Ein Fahrschüler verweist auf einen Ort. Ein Ort kann bei vielen Fahrschülern vorkommen."
    },
    {
      id: "workbench-flow-slots",
      lessonId: "workbench-workflow",
      type: "slots",
      title: "Workbench-Ablauf ordnen",
      description: "Bringe den Weg vom Start des Datenbankdienstes bis zur geprüften Datenbank in die richtige Reihenfolge.",
      difficulty: "medium",
      xp: 40,
      prompt: "Du erhältst ein Workbench-Modell und ein SQL-Skript mit Beispieldaten. Ordne die fünf Arbeitsschritte.",
      slots: [
        {
          id: "step1",
          label: "Schritt 1",
          options: ["MySQL-Dienst starten", "Modell öffnen oder erstellen", "SQL-Skript ausführen"],
          answer: "MySQL-Dienst starten"
        },
        {
          id: "step2",
          label: "Schritt 2",
          options: ["Verbindung in MySQL Workbench öffnen", "Refresh All ausführen", "Forward Engineer starten"],
          answer: "Verbindung in MySQL Workbench öffnen"
        },
        {
          id: "step3",
          label: "Schritt 3",
          options: ["Modell öffnen oder erstellen", "MySQL-Dienst stoppen", "Ergebnistabelle exportieren"],
          answer: "Modell öffnen oder erstellen"
        },
        {
          id: "step4",
          label: "Schritt 4",
          options: ["Forward Engineer oder Synchronize Model ausführen", "Workbench schließen", "Nur einen Screenshot erstellen"],
          answer: "Forward Engineer oder Synchronize Model ausführen"
        },
        {
          id: "step5",
          label: "Schritt 5",
          options: ["SQL-Skript ausführen und Ergebnis mit SELECT prüfen", "Den Dienst vor der Prüfung stoppen", "Alle Fremdschlüssel entfernen"],
          answer: "SQL-Skript ausführen und Ergebnis mit SELECT prüfen"
        }
      ],
      explanation: "Dienst und Verbindung bilden die technische Grundlage. Danach folgen Modellübertragung, Datenimport und eine sichtbare Ergebniskontrolle."
    },
    {
      id: "sql-projection",
      lessonId: "select-projektion",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Nur Namen ausgeben",
      description: "Gib Nachname und Vorname aller Fahrschüler aus. Verwende kein SELECT *.",
      difficulty: "easy",
      xp: 35,
      starter: "SELECT \nFROM fahrschueler;",
      solution: "SELECT nachname, vorname\nFROM fahrschueler;",
      hints: [
        "Nach SELECT stehen die Spalten, die du sehen möchtest.",
        "Trenne mehrere Spalten mit Komma.",
        "FROM nennt die Tabelle."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT nachname, vorname FROM fahrschueler;",
        orderSensitive: true,
        required: ["select", "from", "nachname", "vorname"],
        forbidden: ["select\\s+\\*"]
      }
    },
    {
      id: "sql-selection-order",
      lessonId: "where-sortierung",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Stuttgart sortieren",
      description: "Zeige Nachname, Vorname und Fahrstunden aller Fahrschüler aus Stuttgart. Sortiere absteigend nach Fahrstunden.",
      difficulty: "medium",
      xp: 40,
      starter: "SELECT nachname, vorname, fahrstunden\nFROM fahrschueler\nWHERE \nORDER BY ;",
      solution: "SELECT nachname, vorname, fahrstunden\nFROM fahrschueler\nWHERE ort = 'Stuttgart'\nORDER BY fahrstunden DESC;",
      hints: [
        "Textwerte stehen in einfachen Anführungszeichen.",
        "DESC sortiert absteigend.",
        "ORDER BY steht nach WHERE."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT nachname, vorname, fahrstunden FROM fahrschueler WHERE ort = 'Stuttgart' ORDER BY fahrstunden DESC;",
        orderSensitive: true,
        required: ["where", "order\\s+by", "desc"]
      }
    },
    {
      id: "sql-distinct",
      lessonId: "sql-muster",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Wohnorte ohne Wiederholungen",
      description: "Gib jede Kombination aus Ort und Postleitzahl genau einmal aus und sortiere nach Ort.",
      difficulty: "medium",
      xp: 40,
      starter: "SELECT \nFROM fahrschueler\nORDER BY ort;",
      solution: "SELECT DISTINCT ort, plz\nFROM fahrschueler\nORDER BY ort;",
      hints: [
        "DISTINCT steht direkt hinter SELECT.",
        "Wähle ort und plz aus.",
        "ORDER BY ort steht am Ende."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT DISTINCT ort, plz FROM fahrschueler ORDER BY ort;",
        orderSensitive: true,
        required: ["select\\s+distinct", "order\\s+by"]
      }
    },
    {
      id: "sql-filter-patterns",
      lessonId: "sql-muster",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Namensmuster kombinieren",
      description: "Zeige Nachname und Vorname aller Personen, deren Nachname mit K oder W beginnt. Sortiere nach Nachname.",
      difficulty: "medium",
      xp: 40,
      starter: "SELECT nachname, vorname\nFROM fahrschueler\nWHERE \nORDER BY nachname;",
      solution: "SELECT nachname, vorname\nFROM fahrschueler\nWHERE nachname LIKE 'K%' OR nachname LIKE 'W%'\nORDER BY nachname;",
      hints: [
        "LIKE 'K%' findet Texte, die mit K beginnen.",
        "Verbinde die beiden Muster mit OR.",
        "Sortiere erst nach der WHERE-Bedingung."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT nachname, vorname FROM fahrschueler WHERE nachname LIKE 'K%' OR nachname LIKE 'W%' ORDER BY nachname;",
        orderSensitive: true,
        required: ["like", "or", "order\\s+by"]
      }
    },
    {
      id: "sql-group-having",
      lessonId: "funktionen-gruppierung",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Orte mit mindestens zwei Fahrschülern",
      description: "Gib pro Ort die Anzahl der Fahrschüler aus. Zeige nur Orte mit mindestens zwei Fahrschülern.",
      difficulty: "medium",
      xp: 45,
      starter: "SELECT ort, COUNT(*) AS anzahl\nFROM fahrschueler\nGROUP BY ort\nHAVING ;",
      solution: "SELECT ort, COUNT(*) AS anzahl\nFROM fahrschueler\nGROUP BY ort\nHAVING COUNT(*) >= 2;",
      hints: [
        "COUNT(*) zählt die Datensätze einer Gruppe.",
        "GROUP BY ort bildet eine Gruppe pro Ort.",
        "Die Bedingung auf COUNT(*) gehört in HAVING."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT ort, COUNT(*) AS anzahl FROM fahrschueler GROUP BY ort HAVING COUNT(*) >= 2;",
        orderSensitive: false,
        required: ["count\\s*\\(", "group\\s+by", "having"]
      }
    },
    {
      id: "sql-date-functions",
      lessonId: "datum-berechnungen",
      type: "sql",
      schema: "fahrschule-basic",
      title: "Geburtsmonate im Jahr 2008",
      description: "Gib Nachname und Geburtsmonat aller im Jahr 2008 geborenen Fahrschüler aus. Nenne die Monatsspalte monat und sortiere nach Nachname.",
      difficulty: "medium",
      xp: 40,
      starter: "SELECT nachname,  AS monat\nFROM fahrschueler\nWHERE \nORDER BY nachname;",
      solution: "SELECT nachname, MONTH(geburtsdatum) AS monat\nFROM fahrschueler\nWHERE YEAR(geburtsdatum) = 2008\nORDER BY nachname;",
      hints: [
        "MONTH(geburtsdatum) liefert die Monatszahl.",
        "YEAR(geburtsdatum) kann in WHERE mit 2008 verglichen werden.",
        "AS monat benennt die berechnete Spalte."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT nachname, MONTH(geburtsdatum) AS monat FROM fahrschueler WHERE YEAR(geburtsdatum) = 2008 ORDER BY nachname;",
        orderSensitive: true,
        required: ["month\\s*\\(", "year\\s*\\(", "where", "order\\s+by"]
      }
    },
    {
      id: "sql-insert",
      lessonId: "daten-verwalten",
      type: "sql",
      schema: "fahrschule",
      title: "Neuen Ort einfügen",
      description: "Füge den Ort Ludwigsburg mit ortnr 6 und PLZ 71638 in die Tabelle orte ein.",
      difficulty: "medium",
      xp: 35,
      starter: "INSERT INTO orte (ortnr, plz, ort)\nVALUES ();",
      solution: "INSERT INTO orte (ortnr, plz, ort)\nVALUES (6, '71638', 'Ludwigsburg');",
      hints: [
        "Die Reihenfolge in der Spaltenliste muss zur Reihenfolge der VALUES passen.",
        "Textwerte stehen in einfachen Anführungszeichen.",
        "Die Datenbank wird im Browser nach jedem Lauf neu aufgebaut."
      ],
      check: {
        type: "mutation",
        verifySql: "SELECT COUNT(*) AS anzahl FROM orte WHERE ortnr = 6 AND plz = '71638' AND ort = 'Ludwigsburg';",
        expected: { columns: ["anzahl"], values: [[1]] },
        required: ["insert\\s+into", "values"]
      }
    },
    {
      id: "fk-integrity-choice",
      lessonId: "fremdschluessel-integritaet",
      type: "choice",
      title: "Fremdschlüssel prüfen",
      description: "Erkenne, welcher Datensatz die referentielle Integrität verletzt.",
      difficulty: "medium",
      xp: 30,
      questions: [
        {
          question: "In orte existieren nur ortnr 1 bis 5. Welcher Fahrschüler-Datensatz wäre ungültig?",
          options: [
            "(11, 'Mertens', 'Luca', '2008-06-01', 9)",
            "(11, 'Mertens', 'Luca', '2008-06-01', 2)",
            "(11, 'Mertens', 'Luca', '2008-06-01', 5)"
          ],
          correct: 0,
          feedback: "ortnr 9 verweist auf keinen vorhandenen Ort. Genau das verhindert referentielle Integrität."
        }
      ]
    },
    {
      id: "sql-join-places",
      lessonId: "joins",
      type: "sql",
      schema: "fahrschule",
      title: "Fahrschüler mit Wohnort",
      description: "Gib Nachname, Vorname und Ort aller Fahrschüler aus. Verbinde fahrschueler und orte über ortnr und sortiere nach Nachname.",
      difficulty: "plus",
      xp: 50,
      starter: "SELECT f.nachname, f.vorname, o.ort\nFROM fahrschueler AS f\nJOIN orte AS o ON \nORDER BY f.nachname;",
      solution: "SELECT f.nachname, f.vorname, o.ort\nFROM fahrschueler AS f\nJOIN orte AS o ON f.ortnr = o.ortnr\nORDER BY f.nachname;",
      hints: [
        "Beide Tabellen besitzen die Spalte ortnr.",
        "Aliase machen die Abfrage lesbarer: f für fahrschueler, o für orte.",
        "Sortiere erst ganz am Ende."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT f.nachname, f.vorname, o.ort FROM fahrschueler AS f JOIN orte AS o ON f.ortnr = o.ortnr ORDER BY f.nachname;",
        orderSensitive: true,
        required: ["join", "on", "order\\s+by"]
      }
    },
    {
      id: "sql-join-hours",
      lessonId: "mn-beziehungen",
      type: "sql",
      schema: "fahrschule",
      title: "Fahrstunden je Fahrschüler",
      description: "Gib Nachname, Vorname und die Summe der gebuchten Fahrstunden aus. Zeige nur Personen mit mindestens drei Stunden.",
      difficulty: "plus",
      xp: 55,
      starter: "SELECT f.nachname, f.vorname, SUM(s.stundenzahl) AS stunden\nFROM fahrstunden AS s\nJOIN fahrschueler AS f ON \nGROUP BY f.schuelernr\nHAVING ;",
      solution: "SELECT f.nachname, f.vorname, SUM(s.stundenzahl) AS stunden\nFROM fahrstunden AS s\nJOIN fahrschueler AS f ON s.schuelernr = f.schuelernr\nGROUP BY f.schuelernr\nHAVING SUM(s.stundenzahl) >= 3;",
      hints: [
        "fahrstunden enthält die Fremdschlüssel.",
        "Gruppiere pro Fahrschüler, am robustesten über die schuelernr.",
        "Die Bedingung auf SUM gehört in HAVING."
      ],
      check: {
        type: "query",
        expectedSql: "SELECT f.nachname, f.vorname, SUM(s.stundenzahl) AS stunden FROM fahrstunden AS s JOIN fahrschueler AS f ON s.schuelernr = f.schuelernr GROUP BY f.schuelernr HAVING SUM(s.stundenzahl) >= 3;",
        orderSensitive: false,
        required: ["join", "sum\\s*\\(", "group\\s+by", "having"]
      }
    },
    {
      id: "normalform-choice",
      lessonId: "redundanz-3nf",
      type: "choice",
      title: "Redundanz erkennen",
      description: "Erkenne die Modellierungsentscheidung, die Redundanz vermeidet.",
      difficulty: "plus",
      xp: 35,
      questions: [
        {
          question: "In vielen Fahrschüler-Zeilen stehen dieselbe PLZ und derselbe Ort. Welche Zerlegung ist sinnvoll?",
          options: [
            "Eine eigene Tabelle orte und in fahrschueler nur den Fremdschlüssel ortnr speichern.",
            "Die Spalten plz und ort zusätzlich noch zweimal kopieren.",
            "Alle Werte in eine einzige Textspalte schreiben."
          ],
          correct: 0,
          feedback: "So wird das Faktum Ort nur einmal gespeichert und über einen Fremdschlüssel referenziert."
        }
      ]
    },
    {
      id: "normalform-slots",
      lessonId: "normalisierung",
      type: "slots",
      title: "Normalform-Verstöße zuordnen",
      description: "Ordne die typischen Verstöße der passenden Normalform zu.",
      difficulty: "plus",
      xp: 40,
      prompt: "Eine Tabelle enthält mehrere Telefonnummern in einer Zelle, eine Bestellposition hängt nur teilweise vom zusammengesetzten Schlüssel ab und eine PLZ bestimmt den Ort.",
      slots: [
        {
          id: "nf1",
          label: "Mehrere Telefonnummern in einer Zelle",
          options: ["Verstoß gegen 1NF", "Verstoß gegen 2NF", "Verstoß gegen 3NF"],
          answer: "Verstoß gegen 1NF"
        },
        {
          id: "nf2",
          label: "Attribut hängt nur von einem Teil eines zusammengesetzten Schlüssels ab",
          options: ["Verstoß gegen 1NF", "Verstoß gegen 2NF", "Verstoß gegen 3NF"],
          answer: "Verstoß gegen 2NF"
        },
        {
          id: "nf3",
          label: "PLZ bestimmt Ort, obwohl beide Nicht-Schlüsselattribute sind",
          options: ["Verstoß gegen 1NF", "Verstoß gegen 2NF", "Verstoß gegen 3NF"],
          answer: "Verstoß gegen 3NF"
        }
      ],
      explanation: "1NF prüft atomare Werte, 2NF Teilschlüsselabhängigkeiten, 3NF transitive Abhängigkeiten."
    },
    {
      id: "bigdata-choice",
      lessonId: "big-data",
      type: "choice",
      title: "Chancen und Risiken abwägen",
      description: "Bewerte ein Big-Data-Szenario fachlich ausgewogen.",
      difficulty: "medium",
      xp: 30,
      questions: [
        {
          question: "Eine App verknüpft Standortdaten, Suchanfragen und Kaufhistorie für personalisierte Empfehlungen. Welche Bewertung ist am besten?",
          options: [
            "Nützlich für passende Empfehlungen, aber riskant wegen Profilbildung und fehlender Transparenz.",
            "Unproblematisch, solange die App schnell läuft.",
            "Immer verboten, weil Daten nie ausgewertet werden dürfen."
          ],
          correct: 0,
          feedback: "Eine gute Bewertung benennt Chance und Risiko und begründet beide."
        }
      ]
    }
  ],

  commands: [
    {
      id: "cmd-select",
      title: "SELECT",
      category: "Abfragen",
      syntax: "SELECT spalte1, spalte2 FROM tabelle;",
      short: "Wählt Spalten für die Ergebnismenge aus.",
      details: [
        "SELECT verändert keine Daten.",
        "Die Reihenfolge der Spalten im SELECT bestimmt die Anzeige.",
        "SELECT * ist zum Erkunden praktisch, in Lösungen aber oft zu ungenau."
      ],
      example: "SELECT nachname, vorname FROM fahrschueler;",
      xp: 12,
      exercise: {
        question: "Was wählt SELECT nachname, vorname aus?",
        options: ["Spalten", "Tabellen", "Datenbanken"],
        correct: 0,
        feedback: "SELECT legt die sichtbaren Ergebnisspalten fest."
      }
    },
    {
      id: "cmd-distinct",
      title: "SELECT DISTINCT",
      category: "Abfragen",
      syntax: "SELECT DISTINCT spalte1, spalte2 FROM tabelle;",
      short: "Entfernt doppelte Zeilen aus der Ergebnismenge.",
      details: [
        "DISTINCT steht direkt nach SELECT.",
        "Bei mehreren Spalten zählt die gesamte Wertekombination.",
        "Die gespeicherten Datensätze werden nicht verändert."
      ],
      example: "SELECT DISTINCT ort, plz FROM fahrschueler ORDER BY ort;",
      xp: 12,
      exercise: {
        question: "Was entfernt DISTINCT?",
        options: ["Doppelte Ergebniszeilen", "Datenbanktabellen", "Fremdschlüssel"],
        correct: 0,
        feedback: "DISTINCT wirkt nur auf die Ausgabe einer SELECT-Abfrage."
      }
    },
    {
      id: "cmd-where",
      title: "WHERE",
      category: "Abfragen",
      syntax: "WHERE bedingung",
      short: "Filtert Datensätze vor der Ausgabe.",
      details: [
        "WHERE steht nach FROM bzw. nach JOIN-Blöcken.",
        "Textwerte stehen in einfachen Anführungszeichen.",
        "Mehrere Bedingungen werden mit AND, OR und NOT verknüpft."
      ],
      example: "SELECT * FROM fahrschueler WHERE ort = 'Stuttgart';",
      xp: 12,
      exercise: {
        question: "Was filtert WHERE?",
        options: ["Zeilen", "Datenbanken", "Passwörter"],
        correct: 0,
        feedback: "WHERE entscheidet für jeden Datensatz, ob er im Ergebnis bleibt."
      }
    },
    {
      id: "cmd-order",
      title: "ORDER BY",
      category: "Abfragen",
      syntax: "ORDER BY spalte ASC|DESC",
      short: "Sortiert die Ergebnismenge.",
      details: [
        "ASC sortiert aufsteigend und ist meist Standard.",
        "DESC sortiert absteigend.",
        "ORDER BY steht am Ende der Abfrage."
      ],
      example: "SELECT nachname, fahrstunden FROM fahrschueler ORDER BY fahrstunden DESC;",
      xp: 12,
      exercise: {
        question: "Welche Richtung bedeutet DESC?",
        options: ["absteigend", "aufsteigend", "zufällig"],
        correct: 0,
        feedback: "DESC steht für descending, also absteigend."
      }
    },
    {
      id: "cmd-filter-patterns",
      title: "LIKE, IN, BETWEEN",
      category: "Abfragen",
      syntax: "WHERE text LIKE 'A%' | wert IN (...) | zahl BETWEEN a AND b",
      short: "Filtert mit Textmustern, Wertelisten und Bereichen.",
      details: [
        "% steht bei LIKE für beliebig viele Zeichen, _ für genau ein Zeichen.",
        "IN ersetzt mehrere Gleichheitsvergleiche mit OR.",
        "BETWEEN schließt beide Grenzwerte ein."
      ],
      example: "SELECT * FROM fahrschueler WHERE ort IN ('Stuttgart', 'Esslingen');",
      xp: 14,
      exercise: {
        question: "Welches Muster findet alle Nachnamen, die mit K beginnen?",
        options: ["LIKE 'K%'", "LIKE '%K'", "BETWEEN 'K'"],
        correct: 0,
        feedback: "K steht fest am Anfang, % erlaubt danach beliebig viele Zeichen."
      }
    },
    {
      id: "cmd-group",
      title: "GROUP BY",
      category: "Auswerten",
      syntax: "GROUP BY gruppenspalte",
      short: "Bildet Gruppen für Aggregatfunktionen.",
      details: [
        "GROUP BY fasst Datensätze mit gleichem Gruppenwert zusammen.",
        "Typische Partner sind COUNT, SUM, AVG, MIN und MAX.",
        "Nicht gruppierte Spalten müssen fachlich zur Gruppe passen."
      ],
      example: "SELECT ort, COUNT(*) FROM fahrschueler GROUP BY ort;",
      xp: 14,
      exercise: {
        question: "Welche Funktion passt häufig zu GROUP BY?",
        options: ["COUNT()", "DELETE", "CREATE DATABASE"],
        correct: 0,
        feedback: "COUNT() zählt Datensätze pro Gruppe."
      }
    },
    {
      id: "cmd-having",
      title: "HAVING",
      category: "Auswerten",
      syntax: "HAVING aggregatbedingung",
      short: "Filtert Gruppen nach der Gruppierung.",
      details: [
        "HAVING wird nach GROUP BY ausgewertet.",
        "Bedingungen mit COUNT, SUM oder AVG gehören oft in HAVING.",
        "WHERE filtert einzelne Zeilen vor der Gruppierung."
      ],
      example: "SELECT ort, COUNT(*) FROM fahrschueler GROUP BY ort HAVING COUNT(*) >= 2;",
      xp: 14,
      exercise: {
        question: "Was filtert HAVING?",
        options: ["Gruppen", "Spaltennamen", "Datenbankserver"],
        correct: 0,
        feedback: "HAVING prüft fertige Gruppen."
      }
    },
    {
      id: "cmd-join",
      title: "JOIN ... ON",
      category: "Mehrere Tabellen",
      syntax: "JOIN andere_tabelle ON t1.fk = t2.pk",
      short: "Verbindet passende Datensätze aus mehreren Tabellen.",
      details: [
        "JOIN benötigt eine passende ON-Bedingung.",
        "Aliase wie f und o halten längere Abfragen lesbar.",
        "Bei falschen Join-Bedingungen entstehen schnell zu viele Zeilen."
      ],
      example: "SELECT f.nachname, o.ort FROM fahrschueler f JOIN orte o ON f.ortnr = o.ortnr;",
      xp: 16,
      exercise: {
        question: "Welche Klausel beschreibt die Schlüsselverbindung?",
        options: ["ON", "DESC", "VALUES"],
        correct: 0,
        feedback: "ON sagt, welche Werte aus beiden Tabellen zusammenpassen."
      }
    },
    {
      id: "cmd-database",
      title: "CREATE DATABASE und USE",
      category: "Datenbankstruktur",
      syntax: "CREATE DATABASE name; USE name;",
      short: "Erzeugt eine Datenbank und wählt sie als aktuelles Schema.",
      details: [
        "CREATE DATABASE erzeugt den Schema-Container für Tabellen.",
        "USE legt fest, auf welche Datenbank nachfolgende Befehle wirken.",
        "MySQL Workbench kann beide Befehle beim Forward Engineering erzeugen."
      ],
      example: "CREATE DATABASE fahrschule; USE fahrschule;",
      xp: 14,
      exercise: {
        question: "Welcher Befehl wählt eine vorhandene Datenbank als aktuelles Schema?",
        options: ["USE", "ORDER BY", "HAVING"],
        correct: 0,
        feedback: "USE name legt die Datenbank für nachfolgende Anweisungen fest."
      }
    },
    {
      id: "cmd-create",
      title: "CREATE TABLE",
      category: "Datenbankstruktur",
      syntax: "CREATE TABLE name (spalte DATENTYP, ...);",
      short: "Erzeugt eine neue Tabellenstruktur.",
      details: [
        "CREATE TABLE definiert Attribute, Datentypen und Schlüssel.",
        "Die fachliche Modellierung sollte vorher geklärt sein.",
        "MySQL Workbench kann CREATE-Anweisungen aus einem Modell erzeugen."
      ],
      example: "CREATE TABLE orte (ortnr INT PRIMARY KEY, ort VARCHAR(45));",
      xp: 14,
      exercise: {
        question: "Was legt CREATE TABLE fest?",
        options: ["Tabellenstruktur", "nur Sortierreihenfolge", "nur Ergebnisanzeige"],
        correct: 0,
        feedback: "CREATE TABLE beschreibt die Struktur einer Tabelle."
      }
    },
    {
      id: "cmd-insert",
      title: "INSERT INTO",
      category: "Datenpflege",
      syntax: "INSERT INTO tabelle (spalten) VALUES (werte);",
      short: "Fügt neue Datensätze ein.",
      details: [
        "Spaltenliste und VALUES-Reihenfolge müssen zusammenpassen.",
        "Textwerte stehen in einfachen Anführungszeichen.",
        "Primärschlüssel dürfen nicht doppelt vergeben werden."
      ],
      example: "INSERT INTO orte (ortnr, plz, ort) VALUES (6, '71638', 'Ludwigsburg');",
      xp: 12,
      exercise: {
        question: "Welche Klausel enthält die einzufügenden Werte?",
        options: ["VALUES", "HAVING", "ORDER BY"],
        correct: 0,
        feedback: "VALUES enthält die konkreten Werte des neuen Datensatzes."
      }
    },
    {
      id: "cmd-update",
      title: "UPDATE",
      category: "Datenpflege",
      syntax: "UPDATE tabelle SET spalte = wert WHERE bedingung;",
      short: "Ändert vorhandene Datensätze.",
      details: [
        "SET beschreibt die Änderung.",
        "WHERE begrenzt, welche Datensätze geändert werden.",
        "Vor einem UPDATE ist ein SELECT mit derselben WHERE-Bedingung oft sinnvoll."
      ],
      example: "UPDATE orte SET plz = '71634' WHERE ortnr = 6;",
      xp: 12,
      exercise: {
        question: "Warum ist WHERE bei UPDATE wichtig?",
        options: ["Damit nicht versehentlich alle Zeilen geändert werden.", "Damit die Schrift größer wird.", "Damit SELECT schneller lädt."],
        correct: 0,
        feedback: "Ohne WHERE betrifft UPDATE alle Datensätze der Tabelle."
      }
    },
    {
      id: "cmd-delete",
      title: "DELETE",
      category: "Datenpflege",
      syntax: "DELETE FROM tabelle WHERE bedingung;",
      short: "Löscht vorhandene Datensätze.",
      details: [
        "DELETE entfernt ganze Datensätze, nicht einzelne Spaltenwerte.",
        "Ohne WHERE können alle Datensätze betroffen sein.",
        "Fremdschlüssel können das Löschen abhängiger Daten verhindern."
      ],
      example: "DELETE FROM orte WHERE ortnr = 6;",
      xp: 12,
      exercise: {
        question: "Was löscht DELETE?",
        options: ["Datensätze", "nur Spaltenüberschriften", "nur die Sortierung"],
        correct: 0,
        feedback: "DELETE entfernt Datensätze aus einer Tabelle."
      }
    },
    {
      id: "cmd-functions",
      title: "COUNT, SUM, AVG, MIN, MAX",
      category: "Auswerten",
      syntax: "COUNT(*) · SUM(spalte) · AVG(spalte)",
      short: "Verdichten viele Werte zu Kennzahlen.",
      details: [
        "COUNT zählt, SUM summiert, AVG bildet den Durchschnitt.",
        "MIN und MAX liefern kleinsten bzw. größten Wert.",
        "Mit GROUP BY erhält jede Gruppe eigene Kennzahlen."
      ],
      example: "SELECT AVG(fahrstunden) FROM fahrschueler;",
      xp: 14,
      exercise: {
        question: "Welche Funktion bildet den Durchschnitt?",
        options: ["AVG()", "SUM()", "MAX()"],
        correct: 0,
        feedback: "AVG() berechnet den Durchschnitt."
      }
    },
    {
      id: "cmd-date",
      title: "YEAR, MONTH, DATEDIFF",
      category: "Datum",
      syntax: "YEAR(datum) · MONTH(datum) · DATEDIFF(d1, d2)",
      short: "Wertet Datumswerte aus.",
      details: [
        "YEAR und MONTH extrahieren Jahr bzw. Monat.",
        "DATEDIFF berechnet eine Tagesdifferenz.",
        "Im Browser-Labor sind diese MySQL-Funktionen als Übungshilfe nachgebildet."
      ],
      example: "SELECT nachname FROM fahrschueler WHERE YEAR(geburtsdatum) = 2008;",
      xp: 14,
      exercise: {
        question: "Welche Funktion liefert den Monat eines Datums?",
        options: ["MONTH()", "COUNT()", "ORDER BY"],
        correct: 0,
        feedback: "MONTH(datum) liefert den Monatsanteil."
      }
    }
  ],

  achievements: [
    { id: "first-lesson", title: "Erster Datensatz", description: "Schließe deine erste Lektion ab.", icon: "database", condition: { type: "lessons", value: 1 } },
    { id: "first-practice", title: "Abfrage läuft", description: "Löse deine erste Übung.", icon: "play", condition: { type: "practices", value: 1 } },
    { id: "sql-starter", title: "SELECT sicher", description: "Löse drei SQL-Übungen.", icon: "square-terminal", condition: { type: "sqlPractices", value: 3 } },
    { id: "workbench-pilot", title: "Workbench-Pilot", description: "Beherrsche den vollständigen Workbench-Ablauf.", icon: "panels-top-left", condition: { type: "practiceSet", value: ["workbench-flow-slots"] } },
    { id: "query-toolbox", title: "SQL-Werkzeugkiste", description: "Löse die Übungen zu DISTINCT, Filtermustern und Datumsfunktionen.", icon: "wrench", condition: { type: "practiceSet", value: ["sql-distinct", "sql-filter-patterns", "sql-date-functions"] } },
    { id: "modeler", title: "Modellierer", description: "Löse alle Modellierungs- und Normalisierungsübungen.", icon: "network", condition: { type: "practiceSet", value: ["eerm-cardinality", "fk-integrity-choice", "normalform-choice", "normalform-slots"] } },
    { id: "joiner", title: "Tabellenverbinder", description: "Löse beide Join-Übungen.", icon: "git-merge", condition: { type: "practiceSet", value: ["sql-join-places", "sql-join-hours"] } },
    { id: "command-reader", title: "Befehlskenner", description: "Löse fünf Befehls-Miniaufgaben.", icon: "library", condition: { type: "commands", value: 5 } },
    { id: "bpe6-core", title: "BPE6-Kern geschafft", description: "Schließe die ersten zehn Lektionen ab.", icon: "badge-check", condition: { type: "lessons", value: 10 } },
    { id: "sql-master", title: "SQL-Werkbank", description: "Löse alle SQL-Übungen.", icon: "hammer", condition: { type: "allSqlPractices" } },
    { id: "portfolio", title: "Kontinuierliche Leistung", description: "Erreiche mindestens 500 XP.", icon: "sparkles", condition: { type: "xp", value: 500 } },
    { id: "workbench-master", title: "WorkbenchLab komplett", description: "Schließe alle Lektionen und Übungen ab.", icon: "award", condition: { type: "all" } }
  ],

  tools: [
    {
      title: "Informatik-Stick",
      description: "Offizielle Schultasche-BW-Umgebung für schulisch bereitgestellte Programme. Starte zuerst den Stick, dann MySQL und anschließend MySQL Workbench.",
      note: "Der Link führt zur offiziellen Download- und Informationsseite.",
      icon: "usb",
      url: "https://schultasche-bw.de/",
      visual: "stick",
      linkLabel: "Schultasche-BW öffnen"
    },
    {
      title: "MySQL starten",
      description: "Vor der MySQL Workbench muss auf dem Informatik-Stick der Datenbankdienst gestartet und geöffnet gelassen werden.",
      note: "Erst danach die passende MySQL-Workbench-Version öffnen, im Unterricht z. B. 8.0.21.",
      icon: "power",
      visual: "mysql-service"
    },
    {
      title: "MySQL Workbench",
      description: "Unterrichtswerkzeug für eERM-Modellierung, Forward Engineering, SQL-Skripte und Abfragen gegen die lokale MySQL/MariaDB-Umgebung.",
      note: "Das Browser-SQL-Labor dient zum schnellen Üben. Verbindliche Arbeit mit den Unterrichtsskripten erfolgt in MySQL Workbench.",
      icon: "database",
      visual: "workbench"
    }
  ],

  sources: [
    {
      title: "Bildungsplan Baden-Württemberg: Informatik, Jahrgangsstufe 1",
      description: "BPE6 Relationale Datenbanken mit 30 Stunden: ER-Modell, Relationenmodell, SQL, Integrität, Gruppierung und Big Data.",
      url: "https://bildungsplaene-bw.de/,Lde/In_OS_nichtTG",
      linkLabel: "Bildungsplan öffnen"
    },
    {
      title: "Landesbildungsserver: Materialien Relationale Datenbanken",
      description: "Materialpaket Relationale Datenbanken, Stand 31.07.2025. Die lokalen Originaldateien liegen im resources-Ordner und werden nicht ungeprüft veröffentlicht.",
      url: "https://www.schule-bw.de/faecher-und-schularten/mathematisch-naturwissenschaftliche-faecher/informatik/material/materialien-zum-neuen-bildungsplan-informatik-an-den-nichtgewerblichen-beruflichen-gymnasien",
      linkLabel: "Materialübersicht öffnen"
    },
    {
      title: "Schultasche-BW",
      description: "Startpunkt für den Informatik-Stick und die schulisch bereitgestellten Programme.",
      url: "https://schultasche-bw.de/",
      linkLabel: "Schultasche öffnen"
    }
  ],

  reference: [
    { title: "Relation", description: "Fachlich gedachte Tabelle mit eindeutigen Datensätzen und Attributen.", code: "fahrschueler(schuelernr, nachname, vorname, ortnr)" },
    { title: "Primärschlüssel", description: "Attribut oder Attributkombination, die jeden Datensatz eindeutig identifiziert.", code: "PRIMARY KEY (schuelernr)" },
    { title: "Fremdschlüssel", description: "Attribut, das auf den Primärschlüssel einer anderen Tabelle verweist.", code: "FOREIGN KEY (ortnr) REFERENCES orte(ortnr)" },
    { title: "Projektion", description: "Auswahl der Spalten im SELECT-Teil.", code: "SELECT nachname, vorname FROM fahrschueler;" },
    { title: "Selektion", description: "Auswahl der Zeilen über Bedingungen.", code: "WHERE ort = 'Stuttgart' AND fahrstunden >= 10" },
    { title: "DISTINCT", description: "Entfernt doppelte Zeilen aus einer Ergebnismenge.", code: "SELECT DISTINCT ort, plz FROM fahrschueler;" },
    { title: "LIKE, IN, BETWEEN", description: "Filtermuster für Texte, Wertelisten und geschlossene Bereiche.", code: "WHERE nachname LIKE 'K%' OR ort IN ('Stuttgart', 'Esslingen')" },
    { title: "Join", description: "Verknüpfung passender Datensätze aus mehreren Tabellen.", code: "JOIN orte ON fahrschueler.ortnr = orte.ortnr" },
    { title: "Parent und Child", description: "Die Parent-Tabelle liefert den Primärschlüssel, die Child-Tabelle speichert ihn als Fremdschlüssel.", code: "orte (Parent) 1 -> N fahrschueler (Child)" },
    { title: "Auto Increment", description: "Lässt MySQL fortlaufende numerische Primärschlüssel automatisch vergeben.", code: "id INT AUTO_INCREMENT PRIMARY KEY" },
    { title: "3NF", description: "Nicht-Schlüsselattribute hängen nur vom Schlüssel ab, nicht voneinander.", code: "ortnr -> plz, ort gehoert in orte" },
    { title: "HAVING", description: "Bedingung auf Gruppen nach GROUP BY.", code: "GROUP BY ort HAVING COUNT(*) >= 2" },
    { title: "Big Data", description: "Massendaten werden gesammelt, verknüpft und automatisiert ausgewertet.", code: "Spuren -> Profile -> Entscheidungen" }
  ]
};
