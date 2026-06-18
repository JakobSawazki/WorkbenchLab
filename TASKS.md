# WorkbenchLab Tasks und Projektstand

Stand: 18. Juni 2026

Aktuelle Version: 0.1.0

## Leitentscheidung

WorkbenchLab wird als eigenes öffentliches Lernportal aufgebaut. Die lokalen
BPE6-Originalmaterialien dienen als fachliche Referenz, werden aber nicht
ungeprüft veröffentlicht. Öffentliche Inhalte werden eigenständig formuliert
und als interaktive Lernmodule umgesetzt.

## Erledigt

- 2026-06-18: PythonLab-Struktur analysiert und passende Architektur für
  WorkbenchLab übernommen.
- 2026-06-18: Bildungsplan BPE6 online und lokal abgeglichen.
- 2026-06-18: Kompetenzraster und Ich-kann-Listen der Lernfortschritte 1 bis 5
  ausgewertet.
- 2026-06-18: Statische Single-Page-App mit Navigation, Lernpfad, Profil,
  XP-System, Erfolgen, Light-/Dark-Mode und Sicherungsdialog erstellt.
- 2026-06-18: 13 BPE6-Lektionen erstellt.
- 2026-06-18: 13 prüfbare Übungen erstellt.
- 2026-06-18: Browser-SQL-Labor mit `sql.js` integriert.
- 2026-06-18: Zwei eigene Fahrschul-Übungsdatenbanken für Browser-Training
  erstellt.
- 2026-06-18: SQL-Prüfungen für SELECT, WHERE, ORDER BY, GROUP BY, HAVING,
  INSERT und JOIN umgesetzt.
- 2026-06-18: Modellierungsübungen zu Kardinalitäten, Fremdschlüsseln,
  Normalformen und Big Data erstellt.
- 2026-06-18: Befehlsbereich mit 12 SQL-Syntaxkarten und Miniaufgaben erstellt.
- 2026-06-18: Nachschlagebereich mit Bildungsplan, Landesbildungsserver,
  Informatik-Stick und MySQL-Workbench-Hinweisen erstellt.
- 2026-06-18: `resources/` per `.gitignore` vom öffentlichen Repository
  ausgeschlossen.
- 2026-06-18: GitHub-Pages-Workflow vorbereitet.
- 2026-06-18: Lucide und `sql.js` lokal unter `vendor/` eingebunden, damit die
  App ohne externe CDN-Laufzeitabhängigkeit startet.

## Offen Priorisiert

1. Live-Repository auf GitHub anlegen, Remote eintragen, pushen und Pages
   aktivieren.
2. Browserprüfung mit echten Schüler-Workflows im Unterricht durchführen.
3. Weitere SQL-Aufgaben aus den lokalen Lernfortschritten übertragen, ohne
   Originalaufgaben oder Lösungen ungeprüft zu veröffentlichen.
4. Workbench-spezifische Schritt-für-Schritt-Seiten ergänzen:
   Reverse/Forward Engineering, Modell speichern, SQL-Skript ausführen.
5. eERM-Übungsmodus ausbauen: Tabellenkarten, Beziehungslinien,
   Kardinalitätsauswahl und automatische Plausibilitätsprüfung.
6. Normalisierung mit mehrstufigen Zerlege-Aufgaben erweitern.
7. Abitur-Training mit gemischten Modellierungs- und SQL-Aufgaben ergänzen.
8. Lehrkraftansicht planen: Export mehrerer Lernstände, Rubrik und Hinweise für
   mündliche/KE-Leistung.
9. Screenshots der finalen Oberfläche in `docs/screenshots/` ablegen.
10. Nach erstem Push Live-Seite testen und README-Live-Link aktualisieren.

## Ideen

- Aufgabenserien nach BPE6.1 bis BPE6.5 filterbar machen.
- Freies SQL-Labor mit auswählbarem Schema und Aufgaben-Historie ergänzen.
- JSON-Portfolio für Schülerinnen und Schüler mit Reflexionsfeldern.
- Kleine Diagnosetests vor jeder Unterrichtsstunde.
- SQL-Fehlermeldungen didaktisch übersetzen.
- MySQL-spezifische Unterschiede zu SQLite als Warnkarten anzeigen.
- Druckbares Kompetenzraster aus dem aktuellen Lernstand erzeugen.
- Optionales Backend nur datenschutzkonform und nicht mit offenem API-Key im
  Browser.

## Arbeitsregeln

- `resources/` bleibt lokal und wird nicht veröffentlicht.
- Lösungen aus den Originalmaterialien nicht direkt in öffentliche Dateien
  kopieren.
- Neue öffentliche Inhalte eigenständig formulieren.
- Inhaltliche Daten bevorzugt in `content.js` pflegen.
- Lernstandsänderungen immer in Normalisierung, Export/Import und README
  nachziehen.
- Vor Veröffentlichung mindestens ausführen:
  - `node --check app.js`
  - `node --check content.js`
  - `git diff --check`
  - Desktop- und Mobilansicht im Browser prüfen
  - SQL-Labor mit mindestens einer SELECT-, GROUP-BY-, INSERT- und JOIN-Aufgabe
    testen
