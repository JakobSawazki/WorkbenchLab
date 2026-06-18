# Übergabe WorkbenchLab

Stand: 18. Juni 2026

Version: 0.3.0

Live: `https://jakobsawazki.github.io/WorkbenchLab/`

Repository: `https://github.com/JakobSawazki/WorkbenchLab`

## Projektziel

WorkbenchLab ist die Datenbank-Schwester von PythonLab. Es soll Schülerinnen
und Schüler in J1 durch BPE6 Relationale Datenbanken führen und kontinuierliche
Übungsleistung sichtbar machen.

## Wichtige Pfade

- Projekt: `G:\Meine Ablage\Codex\WorkbenchLab`
- Lokale BPE6-Materialien:
  `G:\Meine Ablage\Codex\WorkbenchLab\resources\bpe-6-relationale-datenbanken`
- Bildungsplan-PDF:
  `G:\Meine Ablage\Codex\WorkbenchLab\resources\29-TB02-Inhalt-Band 2a-AG-3 Informatik.pdf`

## Aktueller Stand

Die erste lauffähige Version ist als statische App umgesetzt:

- `index.html`
- `styles.css`
- `content.js`
- `app.js`

Die App enthält Lernpfad, SQL-Labor, Modellierungsübungen, Befehle,
Nachschlagen, Erfolge, lokale Lernstandsicherung und Theme-Schalter.

Version 0.3.0 umfasst 19 Lektionen, 22 Übungen und 17 SQL-Befehlskarten. Das
eigene Modul `eERM modellieren` führt vom Sachtext über Kardinalitäten zur
M:N-Auflösung. Zwei interaktive Diagrammaufgaben prüfen Kardinalitäten und
Fremdschlüssel direkt im Modell. Eine dritte Übungsdatenbank verbindet die
Fahrradvermietungs-Modellierung mit einer Drei-Tabellen-SQL-Abfrage.

## Didaktische Struktur

Die Struktur folgt den lokalen Ich-kann-Listen:

1. Datenbanknotwendigkeit, eine Tabelle, Primärschlüssel
2. eERM und Relationenmodell einschließlich Sachtextanalyse, Optionalität,
   Parent/Child und Beziehungsentitäten
3. SQL über eine Tabelle einschließlich `DISTINCT`, `LIKE`, `IN`, `BETWEEN`
   und Datumsfunktionen
4. Datenpflege mit INSERT/UPDATE/DELETE-Grundlogik
5. mehrere Tabellen, Fremdschlüssel, referentielle Integrität
6. JOIN und M:N-Auflösung
7. Redundanz, 3NF, Normalisierung
8. Big Data

## Technische Hinweise

- Browser-SQL nutzt die lokal unter `vendor/` eingebundene `sql.js`-Version.
- Die SQL-Schemata stehen in `content.js`.
- MySQL-Funktionen `YEAR`, `MONTH`, `NOW` und `DATEDIFF` werden im Browser nachgebildet.
- Für Unterrichtsskripte bleibt MySQL Workbench verbindlich.
- `resources/` ist per `.gitignore` ausgeschlossen.

## Nächste sinnvolle Schritte

1. Schülerfeedback aus dem ersten Unterrichtseinsatz dokumentieren.
2. Weitere Aufgaben aus den lokalen Lernfortschritten didaktisch übertragen.
3. eERM-Interaktion zu freien Drag-and-Drop-Modellen erweitern.
4. Workbench-Pfad um Reverse Engineering und typische Fehlerdiagnosen erweitern.
5. Abiturähnliche kombinierte Modellierungs-/SQL-Aufgaben entwickeln.
