# Praxis ab dem Einstieg

Die sichtbare Reihenfolge aller Lerneinheiten ist jetzt Information,
Aufgabenblatt (falls vorhanden), Verstaendnischeck und Uebungslinks,
Praxisauftrag, Notizen und Abschluss. Uebungslinks stehen nicht mehr erst
innerhalb des Praxisauftrags. Bestehende Freischaltungen bleiben unveraendert.

## Fruehe Workbench-Aufgaben

- L1.1: Nach dem eigenen Tabellenentwurf eine kleine Drei-Spalten-Tabelle mit
  zwei frei erfundenen Personen in Workbench untersuchen. Die vier Fachbegriffe
  werden am echten SQL-Ergebnis zugeordnet. Skript speichern und erneut oeffnen.
- L1.2: Nach fachlichem ERD und Relationenschema ein eigenes EER-Modell mit elf
  Attributen erstellen, als `L1_2_entwurf.mwb` speichern und erneut vergleichen.
- L1.3: Den vorhandenen Entwurf wiederverwenden, Datentypen und Pflichtfelder
  pruefen und die kontrollierte Modelldatei fuer L1.4 sichern.
- L1.4: Unveraendert das vollstaendige Modell in `fahrschule` umsetzen und
  Unterrichtsdaten importieren.

Der SQL-Einstieg ist eine zusaetzliche eigene Lernaufgabe, keine uebernommene
Musterloesung. Sein Schema `workbenchlab_l1_1_einstieg` ist getrennt von
`fahrschule`. Die Einrichtung wird nur einmal ausgefuehrt; Wiederholungen nutzen
nur SELECT. Vorhandene Tabellen werden nicht ersetzt, geloescht oder geleert.

## Verifikation

`tests/early-workbench.test.js` prueft Lernauftraege und die SQL-Testdaten mit
SQL.js. Die Portierung entfernt ausschliesslich MySQL-Schema- und Engine-Syntax.
Die Daten bleiben bei wiederholtem SELECT erhalten; doppelte Schluessel werden
abgelehnt und eine erneute Einrichtung ersetzt keine vorhandene Tabelle.

`tests/lesson-phase-order.browser.cjs` prueft die tatsaechliche DOM-Reihenfolge
aller Lerneinheiten, die Navigation zur Uebung und zurueck, den SQL-Download
und die Darstellung bei Desktop- und Smartphone-Breite.

Eine Ausfuehrung in der nativen Schul-Workbench 6.3.10 ist damit nicht bewiesen.
Die neuen Aufgaben bleiben lokal, bis eine Veroeffentlichung beauftragt wird.
