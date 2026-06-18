# WorkbenchLab Tasks und Projektstand

Stand: 18. Juni 2026

Aktuelle Version: 0.2.0

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
- 2026-06-18: Öffentliches Repository
  `https://github.com/JakobSawazki/WorkbenchLab` erstellt und `main` gepusht.
- 2026-06-18: GitHub Pages über Actions aktiviert und erfolgreich unter
  `https://jakobsawazki.github.io/WorkbenchLab/` veröffentlicht.
- 2026-06-18: Alle 13 Übungen, 13 Lektionsquizze und 12 Befehls-Miniaufgaben
  automatisiert im Browser erfolgreich geprüft.
- 2026-06-18: Desktop- und Mobilansicht geprüft; kein horizontales Überlaufen
  bei 390 Pixeln und keine Browser-Konsolenfehler.
- 2026-06-18: Live-SQL-Aufgabe direkt auf GitHub Pages erfolgreich ausgeführt.
- 2026-06-18: Version 0.2.0 mit drei neuen Lektionen zu Workbench-Ablauf,
  flexiblen SQL-Filtern und Datumsfunktionen ausgebaut.
- 2026-06-18: Vier neue Übungen für Workbench-Reihenfolge, `DISTINCT`,
  `LIKE`-Muster und `YEAR`/`MONTH` ergänzt und im Browser erfolgreich geprüft.
- 2026-06-18: Befehlsbibliothek auf 15 Karten erweitert: `SELECT DISTINCT`,
  `LIKE`/`IN`/`BETWEEN` sowie `CREATE DATABASE`/`USE`.
- 2026-06-18: Screenshots im Nachschlagebereich durch drei eigenständige,
  responsive Illustrationen und eine Vier-Schritt-Startstrecke ersetzt.
- 2026-06-18: Kurzreferenz um Parent/Child, Auto Increment, `DISTINCT` und
  flexible Filtermuster ergänzt.
- 2026-06-18: Inhaltsbeziehungen für 16 Lektionen, 17 Übungen, 15 Befehle und
  12 Erfolge maschinell auf Vollständigkeit geprüft.
- 2026-06-18: Vollständiger Browser-Regressionstest für 16 Lektionsquizze,
  17 Übungen und 15 Befehls-Miniaufgaben erfolgreich; keine Konsolenfehler.
- 2026-06-18: Neue Nachschlagen-Seite bei 1440 und 390 Pixeln geprüft und
  dokumentiert; kein horizontaler Überlauf, keine abgeschnittenen Grafiken.

## Offen Priorisiert

1. Browserprüfung mit echten Schüler-Workflows im Unterricht durchführen.
2. Weitere SQL-Aufgaben aus den lokalen Lernfortschritten übertragen, ohne
   Originalaufgaben oder Lösungen ungeprüft zu veröffentlichen.
3. Workbench-Pfad um Reverse Engineering, Modellversionen und typische
   Fehlermeldungen beim Verbindungsaufbau erweitern.
4. eERM-Übungsmodus ausbauen: Tabellenkarten, Beziehungslinien,
   Kardinalitätsauswahl und automatische Plausibilitätsprüfung.
5. Normalisierung mit mehrstufigen Zerlege-Aufgaben erweitern.
6. Abitur-Training mit gemischten Modellierungs- und SQL-Aufgaben ergänzen.
7. Lehrkraftansicht planen: Export mehrerer Lernstände, Rubrik und Hinweise für
   mündliche/KE-Leistung.
8. Versions- und Release-Prozess für künftige Unterrichtsstände festlegen.

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
