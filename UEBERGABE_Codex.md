# Übergabe WorkbenchLab

Stand: 18. Juni 2026

Version: 0.1.0

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

## Didaktische Struktur

Die Struktur folgt den lokalen Ich-kann-Listen:

1. Datenbanknotwendigkeit, eine Tabelle, Primärschlüssel
2. eERM und Relationenmodell
3. SQL über eine Tabelle
4. Datenpflege mit INSERT/UPDATE/DELETE-Grundlogik
5. mehrere Tabellen, Fremdschlüssel, referentielle Integrität
6. JOIN und M:N-Auflösung
7. Redundanz, 3NF, Normalisierung
8. Big Data

## Technische Hinweise

- Browser-SQL nutzt `sql.js` von CDNJS.
- Die SQL-Schemata stehen in `content.js`.
- MySQL-Funktionen `YEAR`, `MONTH` und `DATEDIFF` werden im Browser nachgebildet.
- Für Unterrichtsskripte bleibt MySQL Workbench verbindlich.
- `resources/` ist per `.gitignore` ausgeschlossen.

## Nächste sinnvolle Schritte

1. Lokalen Server starten und UI in Desktop/Mobil prüfen.
2. SQL-Aufgaben real durchklicken.
3. Git initialisieren, committen und GitHub-Remote ergänzen.
4. Repository nach GitHub pushen.
5. GitHub Pages über Actions aktivieren.
6. Live-Link in README eintragen.
7. Weitere Aufgaben aus den lokalen Lernfortschritten didaktisch übertragen.
