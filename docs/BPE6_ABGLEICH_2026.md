# BPE6-Abgleich

Stand: 18. Juni 2026

## Bildungsplan

Quelle: [Bildungsplan Informatik Baden-Württemberg](https://bildungsplaene-bw.de/,Lde/In_OS_nichtTG)

Jahrgangsstufe 1 enthält BPE6 **Relationale Datenbanken** mit einem
Zeitrichtwert von 30 Stunden. Die Einheit verlangt, dass Schülerinnen und
Schüler aus realen Situationen Datenmodelle entwickeln, diese in ein
Datenbanksystem überführen und komplexe Datenbestände speichern, auswerten und
verändern.

## Abdeckung in WorkbenchLab

| Bildungsplanbereich | Umsetzung in WorkbenchLab |
| --- | --- |
| BPE6.1 Entity-Relationship-Modell | Lektionen zu eERM, Entitäten, Attributen, Beziehungen und Kardinalitäten; Workbench-Ablauf mit Forward Engineering und Synchronize Model; Slot-Übungen |
| BPE6.2 Relationenmodell | Relation, Datensatz, Attribut, Primärschlüssel, Fremdschlüssel, Redundanz, 3NF |
| BPE6.3 relationale Datenbank und SQL-Datenpflege | CREATE DATABASE/USE, CREATE/INSERT/UPDATE/DELETE-Karten, INSERT-Übung, Skriptimport und Ergebniskontrolle in MySQL Workbench |
| BPE6.4 SQL-Auswertung über mehrere Tabellen | SELECT, DISTINCT, WHERE, LIKE, IN, BETWEEN, ORDER BY, Datums- und Aggregatfunktionen, GROUP BY, HAVING und JOIN-Übungen |
| BPE6.5 Massendaten | Big-Data-Lektion und Bewertungsübung |

## Lokale Materialstruktur

Quelle: `resources\bpe-6-relationale-datenbanken`

Die lokalen Materialien enthalten:

- Lernfortschritt 1: eine Tabelle, Tabellenentwurf, Projektion, Selektion,
  Funktionen, Gruppierung, Datenpflege
- Lernfortschritt 2: Redundanzfreiheit, mehrere Tabellen, Fremdschlüssel,
  referentielle Integrität, Abfragen über mehrere Tabellen
- Lernfortschritt 3: M:N-Beziehungen, komplexere Modelle, SQL-Auswertungen,
  3NF
- Lernfortschritt 4: Zusatzthema Normalisierung 1NF bis 3NF
- Lernfortschritt 5: Big Data, digitale Spuren, Chancen und Risiken
- Kompetenzraster und Ich-kann-Listen

## Aktueller Umsetzungsgrad

Die Version 0.2.0 deckt die gesamte Breite von BPE6 ab, aber noch nicht die
Tiefe aller Originalaufgaben. Besonders SQL-Training, eERM-Interaktion und
Normalisierung können weiter ausgebaut werden.

Priorisierte Lücken:

1. Reverse Engineering und Workbench-Fehlerdiagnose
2. mehr SQL-Aufgaben über 5 bis 7 Tabellen
3. anspruchsvollere 3NF-Zerlegeaufgaben
4. Abiturähnliche kombinierte Aufgaben
5. Lehrkraftansicht oder Portfolioexport
