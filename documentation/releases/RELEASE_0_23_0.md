# WorkbenchLab 0.23.0

Stand: 3. Oktober 2026

## Praktische Uebungen

| Einheit | Neue Aufgabe | Lernhandlung |
| --- | --- | --- |
| L1.2 | Vom Kurs zum Tabellenmodell | PK, Pflichtfelder und INT/VARCHAR/DATE im Diagramm zuordnen, danach in Workbench umsetzen |
| L1.4 | Einen Kurs als Tabelle umsetzen | Eigene CREATE-TABLE-Anweisung schreiben; echte Strukturpruefung von Namen, Typen, Laenge, Pflichtfeldern und Schluessel |
| L2.4 | Auch Schueler ohne Fahrstunden anzeigen | LEFT JOIN, SUM, COALESCE, GROUP BY und Sortierung schreiben |
| L3.1 | Wiederholte Fahrzeugeinsaetze modellieren | M:N mit eigener Beziehungsentitaet, Ereignisschluessel, zwei FKs und DATETIME aufloesen |
| L3.2 | Wiederkehrende Kunden ermitteln | Vertraege statt verschiedener Fahrraeder zaehlen; GROUP BY/HAVING mit exakter Grenze |

Alle Aufgaben sind aus der jeweiligen Einheit und den Uebungsbereichen
erreichbar. Bestehende Freischaltung, Entwuerfe, Diagrammantworten und
einmalige XP-Vergabe bleiben erhalten. Der Coach vergibt keine XP.

Die beiden Abfrageaufgaben haben getrennte Uebungsschemata mit einem Schueler
ohne Fahrstunden beziehungsweise zwei Vertraegen desselben Kunden fuer
dasselbe Fahrrad. Bestehende Uebungsbestaende bleiben unveraendert.

## Sicher schreiben und nach Workbench uebertragen

Das Downloadsymbol im SQL-Editor sichert ausschliesslich den selbst
geschriebenen Text als .sql-Datei. Es setzt keine Musterloesung ein.
Die Datei laesst sich ueber File > Open SQL Script in Workbench oeffnen.
Das passende Schema muss in Workbench vorhanden sein; der Download
exportiert weder die Browserdatenbank noch externe .mwb-Dateien.

Die bestehenden INSERT-, UPDATE- und DELETE-Uebungen pruefen nicht mehr nur
die Zielzeile. Ihr vollstaendiger Tabellenbestand wird mit dem erlaubten
Endzustand verglichen. Zusaetzliche Aenderungen an anderen Zeilen scheitern.
Die Pruefung bleibt lokal im Browser.

## Nachweise

- 98 Node-Tests ohne Fehler, darunter falsche Datentypen, fehlende PKs,
  zusaetzliche Spalten, verlorene Leergruppen, falsche Mietzaehlungen und
  unerlaubte Aenderungen an unbeteiligten Zeilen.
- Browserpruefung aller fuenf neuen Aufgaben und drei bisherigen
  Schreibaufgaben: falsche/richtige Loesungen, Neuladen, Coach ohne XP,
  keine doppelten XP, eigene SQL-Dateien und vollstaendiger JSON-Roundtrip.
- 24 Desktop-/Mobilansichten, Diagramme in beiden Modi, keine JavaScript-
  Fehler und keine horizontalen Ueberlaeufe; Vorschaltbedingung geprueft.
- Die drei neuen SQL-Loesungen auf isolierter MariaDB 10.4.13 ausgefuehrt;
  zusaetzlich alle zwoelf bisherigen SQL-Downloads importiert. Der
  Testserver wurde danach beendet.
- Alle 21 Einheiten, Uebungsrueckwege und SQL-Links geprueft; 168
  kompakte/ausgeklappte Desktop-/Mobilansichten ohne Fehler.
- Alle 21 Lektionsabschluesse, Freischaltungen und Modulwechsel erneut
  geprueft, ohne doppelte XP.

Browserpruefung: tests/practical-exercises.browser.cjs.
Inhaltspruefung: tests/practical-exercises.test.js.
Native Pruefung: tools/verify-native-sql.cjs.

Die Diagrammaufgaben sind gefuehrte Vervollstaendigungsaufgaben, kein freier
Diagrammeditor. Eigene Modelle werden anschliessend in Workbench erstellt.
Eine native GUI-Abnahme der Workbench-Versionen an Schul-PCs bleibt separat.
