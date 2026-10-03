# Lehrbuchaufbau: Relationale Datenbanken verstehen und anwenden

**Version 0.1 · 6. September 2026 · Planungsentwurf**

Zielgruppe: Jahrgangsstufe 1, Informatik an nichtgewerblichen beruflichen Gymnasien in Baden-Württemberg. Vorkenntnisse: Umgang mit Dateien und einfachen Tabellen; SQL wird nicht vorausgesetzt.

Das Buch folgt der Kette **Situation → Modell → Tabellen → Datenbank → Auswertung → begründete Bewertung**. Der Bildungsplan ist die fachliche Grundlage; die Kapitelreihenfolge und Zeitaufteilung sind ein didaktischer Vorschlag. Die Zuordnung steht im [Bildungsplanabgleich](BPE6_ABGLEICH.md).

## Inhaltsverzeichnis und Zeitplanung

Die folgenden 30 Unterrichtsstunden umfassen Einführung, ausgewählte Übungen und Sicherung. Zusätzliche Vertiefungen, eine gesonderte Klassenarbeit und deren Besprechung sind nicht in diesem Vorschlag enthalten. Tempo und Übungsumfang müssen an die Lerngruppe angepasst werden.

| Nr. | Kapitel | Schwerpunkt | Stunden | Manuskriptstand |
| --- | --- | --- | ---: | --- |
| 01 | Warum Datenbanken? | Problem verstehen, Begriffe unterscheiden | 1 | [Entwurf vorhanden](kapitel/01-warum-datenbanken.md) |
| 02 | Von der Situation zum Datenmodell | Entitäten, Typen, Attribute | 2 | geplant |
| 03 | Beziehungen und Kardinalitäten | Geschäftsregeln, Optionalität, Vorgänge | 3 | geplant |
| 04 | Vom Modell zu Tabellen | Relationen, Schlüssel, Datentypen, M:N | 3 | geplant |
| 05 | Datenmodelle auf Qualität prüfen | Redundanz, Abhängigkeiten, 3NF | 2 | geplant |
| 06 | Eine Datenbank praktisch aufbauen | DBMS, Workbench, Tabellendefinition | 3 | geplant |
| 07 | Daten einfügen, ändern und löschen | Datenpflege und Konsistenz | 2 | geplant |
| 08 | Daten mit SQL auswählen | Projektion, Selektion, Sortierung | 3 | geplant |
| 09 | Daten berechnen und zusammenfassen | Funktionen und Gruppierung | 3 | geplant |
| 10 | Mehrere Tabellen gemeinsam auswerten | JOIN und mehrstufige Abfragen | 3 | geplant |
| 11 | Big Data und digitale Spuren beurteilen | Nutzen, Risiken, begründetes Urteil | 3 | geplant |
| 12 | Abschlussprojekt und Lernstandscheck | Zusammenhängender Transfer | 2 | geplant |
| | **Gesamt** | | **30** | |

## Teil I: Daten verstehen und modellieren

### Kapitel 01 · Warum Datenbanken?

**Leitfrage:** Wie behalten wir den Überblick, wenn immer mehr Personen und Vorgänge zusammenkommen?

**Danach kann ich:** Grenzen einer gemeinsam geführten Liste an Beispielen erläutern, Datenbank und Datenbankmanagementsystem unterscheiden und Fragen an einen Datenbestand formulieren.

**Inhalte:**

- Eine unübersichtliche Verleihliste als Einstieg.
- Wiederholungen, widersprüchliche Angaben und fehlende Eindeutigkeit.
- Daten, Datenbestand, Datenbank und DBMS.
- Ausblick auf Modellierung und SQL.

**Lernprodukt:** Eine kommentierte Problemliste und drei sinnvolle Auswertungsfragen. Die Aufgaben und der Text stehen im [Kapitelentwurf](kapitel/01-warum-datenbanken.md).

### Kapitel 02 · Von der Situation zum Datenmodell

**Leitfrage:** Welche Objekte und Eigenschaften müssen wir überhaupt speichern?

**Danach kann ich:** Einen kurzen Sachtext auswerten, einzelne Entitäten von Entitätstypen unterscheiden und passende Attribute auswählen.

**Inhalte:**

- Auftrag, Systemgrenze und ausdrücklich genannte Annahmen.
- Entität und Entitätstyp an konkreten Beispielen.
- Attribute und Attributwerte; relevante und unnötige Daten.
- Erkennungsmerkmale für Personen, Gegenstände und Vorgänge.
- Ein erstes ER-Modell mit klar erläuterten Symbolen.

**Beispiel:** Kundschaft und einzelne Fahrräder des Verleihs beschreiben. Zwei Fahrräder desselben Modells sind zwei unterschiedliche Objekte.

**Aufgaben:** Begriffe zuordnen; aus einem neuen Sachtext ein Modell entwickeln; zwei Modelle hinsichtlich des Auftrags vergleichen.

**Lernprodukt:** Ein begründeter Modellvorschlag mit einer Liste offener Geschäftsregeln.

### Kapitel 03 · Beziehungen und Kardinalitäten

**Leitfrage:** Wie hängen unsere Objekte zusammen, und was darf dabei vorkommen?

**Danach kann ich:** Beziehungen in beiden Richtungen beschreiben, Mindest- und Höchstbeteiligung begründen und einen Vorgang mit eigenen Merkmalen erkennen.

**Inhalte:**

- Beziehungstyp und konkrete Beziehung.
- 1:1, 1:N und M:N; fachliche Regeln statt bloßem Abzählen in Beispieldaten.
- Optionalität mit Aussagen wie „kein, ein oder mehrere“.
- Die Zwei-Satz-Methode für beide Leserichtungen.
- Mietvorgang als eigenes modelliertes Ereignis mit Beginn und Ende.
- Unterschied zwischen einer Beziehung über die gesamte Zeit und einer Regel für einen bestimmten Zeitpunkt.

**Beispiel:** Eine Person kann wiederholt Fahrräder mieten. In unserem vereinfachten Fall gehört zu jedem Mietvertrag genau eine Person und genau ein Fahrrad. Größere Verträge mit mehreren Fahrrädern bilden eine spätere Transferaufgabe.

**Aufgaben:** Aussagen in Kardinalitäten übersetzen; unvollständige Regeln erkennen; ein Modell bei geänderten Geschäftsregeln überarbeiten.

**Lernprodukt:** Ein lesbares ER-Modell mit schriftlich begründeten Kardinalitäten. Eine Legende erklärt die gewählte Notation.

### Kapitel 04 · Vom Modell zu Tabellen

**Leitfrage:** Wie wird aus dem fachlichen Modell eine eindeutig strukturierte Datenhaltung?

**Danach kann ich:** Tabellen aus einem Modell ableiten, Primär- und Fremdschlüssel festlegen, geeignete Datentypen auswählen und M:N-Zusammenhänge relational umsetzen.

**Inhalte:**

- Relation, Attribut, Datensatz und Schema.
- Eindeutigkeit und Identifikation; einfache und zusammengesetzte Schlüssel.
- Text, Ganzzahl, Fließkommazahl, Datum und Wahrheitswert.
- Datentypwahl nach Bedeutung: beispielsweise Telefonnummern als Text.
- Übertragung von 1:N und M:N; 1:1 als kleines Vergleichsbeispiel.
- Fremdschlüsselwerte und Zielschlüssel nachvollziehen.
- Wiederholte Mietvorgänge: weshalb Person und Fahrrad allein einen Mietvertrag nicht eindeutig bestimmen.

**Beispiel:** Tabellen `kunden`, `fahrraeder` und `mietvertraege`; jede Beziehung lässt sich anhand konkreter Zeilen verfolgen. Buchdaten und vorhandene Labordaten werden ausdrücklich unterschieden.

**Aufgaben:** Schlüssel bewerten; passende Datentypen begründen; ein vollständiges Relationenmodell aus einem neuen Sachtext ableiten.

**Lernprodukt:** Relationenmodell mit Schlüsselkennzeichnung und einer Datentypentabelle.

### Kapitel 05 · Datenmodelle auf Qualität prüfen

**Leitfrage:** Wo entstehen Widersprüche, wenn dieselbe Information mehrfach gespeichert wird?

**Danach kann ich:** Problematische Redundanz erläutern, Änderungs-, Einfüge- und Löschanomalien an Beispielen zeigen und ein einfaches Modell anhand seiner Abhängigkeiten verbessern.

**Inhalte:**

- Wiederholte Werte sind noch kein hinreichender Beweis für einen Modellfehler.
- Funktionale Abhängigkeiten aus Geschäftsregeln ableiten.
- Den gleichen Sachverhalt unnötig mehrfach speichern: typische Anomalien.
- Einfacher 3NF-Check an Beispielen mit eindeutig festgelegten Schlüsseln.
- Zerlegung mit nachvollziehbarer Verbindung über Schlüssel.
- **Vertiefung:** systematischer Weg von 1NF über 2NF zur 3NF.

**Beispiel:** Eine fest vergebene `stationsnr` bestimmt in unserem Modell den Namen und die Anschrift einer Verleihstation. Diese Stammdaten gehören nicht in jeden Mietvertrag. Abhängigkeiten werden ausdrücklich festgelegt; eine reale Postleitzahl wird nicht pauschal als eindeutiger Bestimmer eines Ortsnamens behandelt.

**Aufgaben:** Anomalien erklären; eine Zerlegung begründen; eine vorgeschlagene Übernormalisierung kritisch prüfen.

**Lernprodukt:** Vergleich eines fehleranfälligen und eines verbesserten Modells. Die zwei Kernstunden enthalten keine vollständige vertiefte Normalisierungsreihe.

## Teil II: Datenbanken aufbauen und nutzen

### Kapitel 06 · Eine Datenbank praktisch aufbauen

**Leitfrage:** Wie wird unser Modell zu einer Datenbank, mit der wir arbeiten können?

**Danach kann ich:** Oberfläche und Datenbankdienst unterscheiden, eine Verbindung nutzen, Tabellen erzeugen und deren Struktur kontrollieren.

**Inhalte:**

- MySQL Workbench als Werkzeug und Datenbankserver als DBMS.
- Unterrichtsumgebung starten; tatsächliche Serverversion festhalten.
- Schema auswählen beziehungsweise eine Übungsdatenbank anlegen.
- `CREATE TABLE`, Primärschlüssel und Fremdschlüssel.
- Passende Datentypen und notwendige Pflichtfelder.
- Ein Modell in die Datenbank übertragen und die erzeugte Struktur kontrollieren.
- Kurze Diagnosehilfe für Dienst-, Verbindungs- und Schemafehler.

**Beispiel:** Die drei Tabellen des Fahrradverleihs im Unterrichtssystem aufbauen. Das fertige SQL-Skript wird bei der Kapitelausarbeitung erstellt und dort getestet.

**Aufgaben:** Eine Startreihenfolge erläutern; Tabellen erzeugen; einen gezielt eingebauten Strukturfehler finden.

**Lernprodukt:** Funktionsfähige Übungsdatenbank und ein nachvollziehbar gespeichertes Aufbauskript.

### Kapitel 07 · Daten einfügen, ändern und löschen

**Leitfrage:** Wie pflegen wir Daten, ohne ihre Zusammenhänge zu beschädigen?

**Danach kann ich:** Datensätze ergänzen und gezielt bearbeiten sowie erklären, warum ein DBMS bestimmte Änderungen an Beziehungen zurückweist.

**Inhalte:**

- `INSERT` als ausdrücklich genannter Bildungsplaninhalt; `UPDATE` und `DELETE` als ergänzende Werkzeuge zur Datenpflege.
- Kurze Einführung in `SELECT` und `WHERE`, damit die folgenden Änderungen gezielt vorbereitet werden können; die systematische Vertiefung folgt in Kapitel 8.
- Vor einer Änderung die betroffenen Datensätze auswählen und danach das Ergebnis prüfen.
- Pflichtfelder, gültige Werte und Eindeutigkeit.
- Referentielle Integrität bei zusammenhängenden Tabellen.
- Konsequenzen beim Löschen referenzierter Datensätze; konkrete Regel im Beispiel angeben.
- Fehlermeldungen als Hinweise auf verletzte Datenregeln lesen.

**Beispiel:** Kundschaft aufnehmen, eine Ortsangabe berichtigen und einen irrtümlichen Mietvertrag entfernen. Die Übungsdatenbank lässt sich für den nächsten Versuch wiederherstellen.

**Aufgaben:** Fehlende Daten ergänzen; Änderungen eingrenzen; die Ablehnung eines ungültigen Fremdschlüssels erklären.

**Lernprodukt:** Kommentierte SQL-Anweisungen mit dokumentierter Vorher-/Nachher-Kontrolle.

### Kapitel 08 · Daten mit SQL auswählen

**Leitfrage:** Wie formulieren wir eine genaue Frage an eine Tabelle?

**Danach kann ich:** Gewünschte Spalten auswählen, Zeilen nach Bedingungen filtern und eine nachvollziehbar sortierte Ausgabe erzeugen.

**Inhalte:**

- `SELECT` und `FROM`; Ergebnis statt Veränderung der gespeicherten Daten.
- Projektion und Selektion.
- `WHERE`, Vergleiche, `AND`, `OR`, `NOT` und Klammern.
- `ORDER BY`, mehrere Sortierspalten und Gleichstände.
- `DISTINCT`, `LIKE`, `IN` und `BETWEEN` als praktische Ergänzungen.
- Fehlende Werte mit `IS NULL` an einem bewusst dafür angelegten Beispiel.

**Beispiel:** Bestimmte Fahrradtypen innerhalb eines Preisbereichs finden. Die Aufgaben geben Ausgabespalten und Sortierreihenfolge ausdrücklich an.

**Aufgaben:** Eine Abfrage in Alltagssprache erklären; eine Frage in SQL umsetzen; eine fast richtige Abfrage mit Gegenbeispielen widerlegen.

**Lernprodukt:** Kleine Abfragesammlung mit erwarteten Ergebnistabellen.

### Kapitel 09 · Daten berechnen und zusammenfassen

**Leitfrage:** Wie werden aus einzelnen Datensätzen aussagekräftige Kennzahlen?

**Danach kann ich:** Berechnungen und geeignete Funktionen verwenden, Datensätze gruppieren und Ergebnisse fachlich interpretieren.

**Inhalte:**

- Berechnete Spalten und verständliche Spaltenaliasnamen.
- Datumsfunktionen `MONTH` und `YEAR` mit ausdrücklich genanntem SQL-Dialekt; weitere Funktionen bei Bedarf ergänzen.
- `COUNT`, `SUM`, `AVG`, `MIN` und `MAX`.
- `GROUP BY`; Einzelzeilen und Gruppen unterscheiden.
- `COUNT(*)` und `COUNT(spalte)` bei fehlenden Werten vergleichen.
- `HAVING` als ergänzende Fortführung des Gruppierens.
- Plausibilität: Einheiten, Rundung, Zeiträume und Zählweise prüfen.

**Beispiel:** Mietdauern und Anzahl der Mietvorgänge auswerten. Ob Anfangs- und Endtag mitgezählt werden, steht in jeder Aufgabenstellung. Umsatzberechnungen benötigen einen ausdrücklich modellierten vereinbarten Mietpreis oder eine klar benannte Vereinfachung.

**Aufgaben:** Kennzahlen von Hand prüfen; Gruppenabfragen entwickeln; eine irreführende Auswertung korrigieren.

**Lernprodukt:** Eine Ergebnistabelle mit einer verständlichen Deutung der Kennzahlen.

### Kapitel 10 · Mehrere Tabellen gemeinsam auswerten

**Leitfrage:** Wie verbinden wir Daten, die aus guten Gründen getrennt gespeichert sind?

**Danach kann ich:** Verbindungen über Schlüssel erklären, passende JOIN-Bedingungen formulieren und eine Abfrage über mehrere Tabellen schrittweise entwickeln.

**Inhalte:**

- Verbindungspfad aus dem Relationenmodell ablesen.
- `INNER JOIN`, `ON` und Tabellenaliasnamen.
- Mehrere Tabellen verbinden; gleiche Spaltennamen eindeutig zuordnen.
- JOIN mit Filtern, Sortierung und Gruppierung kombinieren.
- Fehlerdiagnose bei fehlenden Verbindungsbedingungen und vervielfachten Zeilen.
- **Vertiefung:** `LEFT JOIN` für Objekte ohne zugeordneten Vorgang; Unterabfragen erst bei Bedarf.

**Beispiel:** Wer hat welches Fahrrad in welchem Zeitraum gemietet? Anschließend Anzahl der Mietvorgänge je Person ermitteln und erklären, welche Personen das Ergebnis einschließt.

**Aufgaben:** Einen JOIN zeichnerisch oder tabellarisch nachvollziehen; eine Drei-Tabellen-Abfrage entwickeln; ein fehlerhaftes Ergebnis anhand des Modells erklären.

**Lernprodukt:** Mehrstufige Abfrage mit Erwartung an Zeilen, Spalten und fachliche Aussage.

## Teil III: Daten beurteilen und Wissen übertragen

### Kapitel 11 · Big Data und digitale Spuren beurteilen

**Leitfrage:** Was wird möglich, wenn viele Daten gesammelt und miteinander verknüpft werden?

**Danach kann ich:** Massendaten an einem Fall beschreiben, Nutzen und Risiken für verschiedene Beteiligte abwägen und ein begründetes Urteil formulieren.

**Inhalte:**

- Datenmenge, Vielfalt und Geschwindigkeit als Orientierung.
- Digitale Spuren, Verknüpfung und Profilbildung.
- Aussagekraft und Grenzen von Mustern; Korrelation begründet noch keine Ursache.
- Ein Anwendungsfall mit möglichen Vorteilen und möglichen Schäden.
- Transparenz, Datenqualität und sparsame Datenerhebung als Beurteilungskriterien.
- Ein Urteil mit Behauptung, Begründung, Fallbezug und Gegenargument.

**Beispiel:** Eine fiktive Mobilitätsplattform möchte Miet- und Bewegungsdaten für ihre Planung auswerten. Es werden keine realen Schülerdaten erhoben. Für die spätere Textausarbeitung werden aktuelle belegte Beispiele ergänzt.

**Aufgaben:** Datenflüsse benennen; Perspektiven vergleichen; eine konkrete Nutzung unter selbst begründeten Bedingungen beurteilen.

**Lernprodukt:** Kurze Stellungnahme, die Nutzen, Betroffene, Risiken und Bedingungen miteinander verbindet.

### Kapitel 12 · Abschlussprojekt und Lernstandscheck

**Leitfrage:** Kann ich eine neue Situation selbstständig bis zur begründeten Auswertung bearbeiten?

**Danach kann ich:** Modellierung, Datenbankarbeit, SQL und Bewertung an einem begrenzten neuen Fall zusammenführen.

**Inhalte und Ablauf:**

- Neuer Sachtext: ein schulischer Geräteverleih mit klaren Geschäftsregeln.
- In einer begrenzten Modellierungsaufgabe Entitäten, Beziehungen und Schlüssel begründen.
- Auf einem bereitgestellten, passenden Grundschema eine Struktur- oder Datenänderung durchführen.
- Eine einfache und eine tabellenübergreifende Abfrage bearbeiten.
- Eine vorgeschlagene zusätzliche Datenerhebung bewerten.
- Den eigenen Lernstand mit den Kapitelzielen vergleichen.

**Lernprodukt:** Kurzes Portfolio aus Modell, SQL und Begründungen. Für ein vollständig frei entwickeltes Datenbankprojekt ist zusätzliche Zeit vorzusehen; zwei Stunden reichen für diesen vorbereiteten Transferfall.

## Geplanter Anhang

Die folgenden Teile werden beim Schreiben aus den tatsächlich verwendeten Kapiteln aufgebaut, damit Definitionen und Beispiele konsistent bleiben:

- Glossar mit kurzen Definitionen und Kapitelverweisen.
- SQL-Kurzreferenz mit jeweils genanntem Dialekt.
- Legende für ER-Diagramme und Schlüsselnotation.
- Hilfe zur Unterrichtsumgebung und zu häufigen Fehlermeldungen.
- Eigenständige Übungsdatensätze und geprüfte SQL-Skripte.
- Ich-kann-Übersicht als Lernstandscheck.

## Gemeinsamer Kapitelstandard

Jedes Kapitel folgt der [Kapitelvorlage](KAPITELVORLAGE.md). Erklärungen sprechen die Lernenden mit „du“ an. Fachbegriffe werden eingeführt, bevor sie für eine Aufgabe vorausgesetzt werden. Beispiele nennen Annahmen und Datenbasis. Aufgaben verlangen schrittweise **verstehen**, **anwenden** und **begründen/übertragen**.

Vor einer Veröffentlichung erhält jedes ausgearbeitete Kapitel eine fachliche Prüfung, einen Abgleich mit dem Bildungsplan und eine Kontrolle der Beispiele. Die bisher vorhandenen Labormodule sind Anschlusspunkte; ihre Existenz ersetzt diese Prüfung nicht.
