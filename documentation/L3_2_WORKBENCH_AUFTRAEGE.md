# L3.2 Mehrtabellen-Auswertungen in Workbench

Lokaler Ausbau vom 3. Oktober 2026. Die Einheit enthält nun alle zehn
Fahrschulaufträge und sechzehn Fahrradvermietungsaufträge aus den beiden
lokalen Aufgabenblättern L3_2.1 und L3_2.2. Die Schüler bearbeiten SQL und
EER-Diagramme in MySQL Workbench; das Web-Arbeitsblatt speichert ihre
Ergebniskontrollen. Es gibt keine behauptete Fernprüfung der Workbench-Dateien.

## Materialbezug

- F1–F10 entsprechen den zehn Fahrschul-Auswertungsaufträgen.
- R1–R16 entsprechen den sechzehn Fahrradvermietungsaufträgen.
- Die fünf bzw. sieben Tabellen übernehmen die fachlichen Beziehungen und
  Attributnamen der Vorlagen. Geldwerte verwenden DECIMAL statt DOUBLE.
- Personen, Adressen, Fahrzeugdaten und alle Datensätze sind neue fiktive
  Übungsdaten. Kontaktdaten aus den Originalskripten werden nicht ausgeliefert.
- Die Vermietnummern 1, 100 und 133 bleiben als Bezugspunkte erhalten;
  Original-Ergebniszahlen sind keine Sollwerte für den neuen Testbestand.
- F4 und R14 werden ausdrücklich auf unbenutzte Fahrzeuge erweitert.
- F7 gruppiert nach Jahr und Monat. F8/F9 behalten das Bezugsjahr 2019 bei
  und berechnen das im Kalenderjahr erreichte Alter.
- R15/R16 mitteln über einzelne Fahrräder, einschließlich unvermieteter
  Exemplare. Arten ohne Fahrräder werden in diesen beiden Aufträgen nicht
  ausgegeben. Die Bezugsmenge wird ausdrücklich begründet.

## Workbench-Ablauf

Der einmalige Download `assets/sql/l3-2-mehrtabellen-testdaten.sql` erstellt
`workbenchlab_l3_2_fahrschule` und `workbenchlab_l3_2_fahrradvermietung`.
Er enthält kein DROP, TRUNCATE oder Abschalten von Schutzmechanismen.
CREATE TABLE ohne IF NOT EXISTS verhindert eine unbemerkte Wiederanlage
oder Änderung bereits vorhandener Tabellen. Bei wiederholter Ausführung
ist die Fehlermeldung zu prüfen, nicht die Schutzregel abzuschalten.

Nach SELECT DATABASE() werden die fünf bzw. sieben Tabellen über
Database > Reverse Engineer in getrennte Modelle gelesen, als
`L3_2_fahrschule.mwb` und `L3_2_fahrradvermietung.mwb` gespeichert und erneut
geöffnet. Die Abfragen werden als zwei entsprechende .sql-Dateien gesichert.
Reverse Engineering ist hier ein Lesevorgang; Forward Engineering und
Synchronize Model sind nicht Bestandteil dieses Auftrags.

Die Unterrichtszeit ist als 180 Minuten angegeben; alle 26 Aufträge können
auf mehrere Stunden verteilt werden. Das Arbeitsblatt enthält vier Gruppen,
von denen anfänglich nur die erste geöffnet ist.

## Prüfung und Grenzen

- `tests/multi-table-events.test.js` prüft die Zuordnung aller 26 Aufgaben,
  beide Testbestände, alle elf Fremdschlüssel und 26 konkrete Referenzabfragen.
- Für SQL.js werden nur die MySQL-Schemaanweisungen und ENGINE-Angaben in
  der Testkopie entfernt. YEAR, MONTH und DATEDIFF werden für die festen
  DATE-Testwerte nachgebildet. Das ist kein MySQL-Kompatibilitätsnachweis.
- `tools/verify-l3-2.cjs` prüft Darstellung, Download, Wiederladen gespeicherter
  Antworten und JSON-Export mit einem isolierten fiktiven Testprofil.
- Die tatsächliche Workbench 6.3.10, der Schulserver und das Öffnen der
  erzeugten Schüler-.mwb-Dateien müssen im Unterricht überprüft werden.

Grundlagen:
[Reverse Engineering](https://dev.mysql.com/doc/workbench/en/wb-reverse-engineer-live.html),
[Datumsfunktionen](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html).
