# claude2codex.md – Übergabe von Claude an Codex

Stand: 2026-10-09 · Grundlage: Release 0.41.2 · Autor: Claude

Diese Datei ist die **einzige** Übergabedatei von Claude. Sie wurde am
2026-10-09 vollständig neu gefasst, weil die erste Fassung vom 8. Oktober nach
zwölf Versionen veraltet war. Die OPT-IDs sind unverändert. Die Gegenrichtung
ist `codex2claude.md`. Claudes Arbeitsprotokoll mit allen Einzelschritten steht
in `documentation/documentation.md`, Abschnitt 0.

## Teil A – Das Wichtigste für Codex

### A1 Was sich seit deinem Stand 0.25.3 geändert hat

Dein letzter Stand ist als Tag `codex-stand-2026-10-08` (`4dedae1`) gesichert.
Jakob hat Claude am 9. Oktober beauftragt, eigenständig weiterzuarbeiten und zu
veröffentlichen.

| Version | Inhalt | Dateien |
| --- | --- | --- |
| 0.26.0 | freies SQL-Labor `#sql/frei`, deutsche SQL-Meldungen mit Vorschlag, Versionsgleichstand | `sql-feedback.js`, `app.js` |
| 0.26.1 | Rettungskopie bei unlesbarem Lernstand | `app.js` (`loadState`) |
| 0.26.2 | Druckansicht für Einheiten | `app.js`, `styles.css` |
| 0.27.0 | Klassenübersicht für Lehrkräfte | `lehrkraft.html`, `teacher-overview.js` |
| 0.28.0 | 6 Aufgaben „Fehlersuche“; Prüfergebnis-Banner über den Reitern | `debug-exercises.js`, `app.js` |
| 0.29.0 | 5 Aufgaben „Vorhersage“; Schul-PC-Checkliste | `predict-exercises.js`, `app.js` |
| 0.30.0 | 4 Aufgaben „Klauseln ordnen“ | `order-exercises.js`, `app.js` |
| 0.31.0 | Wiederholungsrunde `#sql/wiederholen` | `review.js`, `app.js` |
| 0.32.0–0.33.0 | Modell-Editor `#modeling/editor` mit SQL- und Bildexport | `erm-editor.js`, `app.js` |
| 0.34.0 | Klausurtraining `#sql/klausur` | `review.js`, `app.js` |
| 0.35.0 | Modell-Editor: Kästen verschieben, dritte Aufgabe | `erm-editor.js` |
| 0.36.0 | Prüfung an MariaDB; Hinweise auf drei gemessene MySQL-Unterschiede; „0 Ergebniszeilen“ im freien Labor | `tools/verify-claude-native.cjs`, `sql-feedback.js`, `app.js` |
| 0.37.0 | Modell-Editor: Optionalität; MySQL-Hinweise nach „Ausführen“ in Aufgaben; Claudes Testartefakte nach `%TEMP%` | `erm-editor.js`, `app.js`, `tests/*.browser.cjs` |
| 0.38.0 | Jakobs Entscheidungen: Übungen frei, NAGOLD, keine Lösungsanweisungen in der veröffentlichten Fassung, Schreibweise `1 : ∞` im Modell-Editor | `app.js`, `expected-results.js`, `tools/build-expected.cjs`, `tools/build-site.cjs`, `teacher-overview.js`, `erm-editor.js` |

Jede Version hat einen Tag `v0.xx.y`. Zurücksetzen: siehe
`documentation/documentation.md`, Abschnitt 0.1.

### A0 Jakobs Entscheidungen vom 9. Oktober 2026

Jakob hat neun Rückfragen beantwortet; die vollständige Tabelle steht in
`documentation/documentation.md`, Abschnitt 0.37. Kurz:

- Übungen sind frei zugänglich; die Lerneinheiten bleiben in fester Reihenfolge.
- Der Profildialog beim Erstbesuch bleibt.
- Je abgeschlossener Lerneinheit zählen einmalig 5 NAGOLD (Jakobs Punktesystem für
  die kontinuierlich erbrachte Leistung). Mehr als 100 im Jahr sind in Ordnung.
- Musterlösungen gehören nicht in die veröffentlichte Fassung.
- Eine Lerneinheit bleibt eine vollständige Seite.
- Dokumentation und Code sollen aufgeräumt werden.
- Kardinalitäten wie im Abitur (`1` und `∞` im Workbench-Diagramm); „1 : N“ ist in Ordnung.

**Neue Arbeitsregel für uns beide:** Nach jeder Änderung an einer SQL-Aufgabe
`node tools/build-expected.cjs` ausführen und `expected-results.js` mit committen.
Lösungsangaben (`solution`, `expectedSql`, `referenceSql`) immer einzeilig schreiben;
`tools/build-site.cjs` entfernt sie beim Veröffentlichen und bricht ab, wenn eine
übrig bleibt oder ein Sollergebnis fehlt.

### A2 Was Claude an deinen Teilen geändert hat

Bitte prüfen und bei Bedarf zurücknehmen:

1. **Prüfergebnis-Banner** (`#practiceResult` in `renderSqlPractice`) steht
   jetzt über den Reitern statt im Ergebnis-Panel, weil es nach „Lösung prüfen“
   hinter dem Coach-Reiter verdeckt war.
2. **`tests/xp.browser.cjs`**: an den Hilfedialog aus 0.25.3 angepasst
   (`#profileHelpDialog` statt `#profileHelp`) und Höhenvergleich mit
   Subpixel-Toleranz. Der Test schlug an deinem unveränderten Stand fehl.
3. **`loadState`** legt bei einem Lesefehler eine Rettungskopie an und zeigt
   eine Meldung, statt still einen leeren Lernstand zu liefern.
4. **Übungszahl** 43 → 58. Erfolge, die „alle Übungen“ verlangen, setzen mehr
   voraus. `sqlPractices()` zählt die 6 Fehlersuche-Aufgaben mit, Vorhersage
   und Klauseln ordnen nicht.
5. **`.git/refs/desktop.ini`**: Google Drive legt diese Dateien an und bricht
   damit `git fetch`. Claude hat sie gelöscht; sie können wiederkommen.
6. **Hinweis nach „Ausführen“ in Abfrage-Aufgaben**: in `runSqlPractice` der
   Block `if (practice.check.type === "query") { … mysqlNotesHtml … }` direkt
   nach `if (!useCoach) {`. Er zeigt gemessene MySQL-Unterschiede; Prüfung,
   Coach und XP sind unberührt.
7. **`isPracticeUnlocked`** liefert immer `true` (Entscheidung Jakob); neu ist
   `isPracticeAhead` für das Kennzeichen „Vorgriff“. `isLessonUnlocked` ist unverändert.
8. **`runSqlPractice`** nutzt `window.WORKBENCH_EXPECTED[practice.id]`, falls vorhanden.
9. **`award`** meldet beim Abschluss einer Einheit zusätzlich „+5 NAGOLD“;
   `backupPayload` nennt `summary.nagold`; im Profildialog steht `#nagoldTotal`.
10. **`tools/build-site.cjs`**: `stripSolutions` nach dem Kopieren.
11. **`tests/practical-exercises.browser.cjs`**: Die frühere Sperrprüfung erwartet jetzt,
    dass die Übung öffnet und die Einheit gesperrt bleibt.
12. **Kopfzeilen von `documentation/documentation.md`** (Stand, Release) und
   der Kopf der README.
13. **Aus `app.js` unverändert verschoben:** SQL-Prüflogik → `sql-check.js`
    (0.38.2), Prüfsumme der Sicherung → `backup.js` (0.39.1), Vorgabewerte,
    Kürzel/Klasse, Kennungen und `normalizeState` → `state.js` (0.39.2).
    `app.js` bindet sie je mit einer Zeile ein.
14. **`styles.css`** in sechs Dateien geschnitten (0.39.3), Reihenfolge der
    Regeln unverändert; beide HTML-Seiten laden alle sechs.
15. **`index.html`**: im Profildialog Knopf „Lösungsdatei laden“ (0.39.0),
    dazu die neuen Skript- und Style-Verweise.
16. **`backupPayload`** schreibt zusätzlich `extras.ermDrafts`;
    **`importProgressFile`** übernimmt den Block und nennt ihn in der
    Rückfrage (0.40.0). `backupFormatVersion` bleibt 6.
18. **MySQL-Nähe (0.41.0):** `registerSqlFunctions` ruft zusätzlich
    `registerMysqlFunctions` auf; `NOW()` liefert Ortszeit statt Weltzeit;
    `explainSqlError`, `translateSqlError` und `sqlErrorHtml` reichen die
    Anweisung durch. Sollergebnisse aller Aufgaben unverändert.
19. **`index.html`, `#progressFileInput`** hat ein `aria-label` (0.41.2); das
    Feld war für Bildschirmleser namenlos.
17. **Dokumentation umgeräumt:** Release- und Abnahmeberichte nach
    `documentation/releases/`, deine Abschnitte 1 bis 12 nach
    `documentation/archiv/` – Inhalt unverändert, nur Verweise angepasst.

Nicht angefasst: `codex2claude.md`, `content.js`, die Inhalte der 21
Einheiten in `learning-path.js` (dort nur `content.version`), `Lehrbuch/`
(außer einem Verweis in `QUELLEN.md`), deine Browsertests bis auf Punkt 2 und 11.

### A3 Übergabeprotokoll

- Claude schreibt in `claude2codex.md` und in Abschnitt 0 von
  `documentation/documentation.md`; Codex in `codex2claude.md` und im übrigen
  Teil der Dokumentation. Vor Arbeitsbeginn die Datei des anderen sowie
  `git status` und `git log -5` lesen.
- Jeder Punkt hat eine stabile ID (`OPT-xx`); Commits verweisen darauf.
- Ein Thema pro Commit. Fremde uncommittete Änderungen nicht überschreiben.
  Nie `--force`.
- Jeder Push auf `main` veröffentlicht nach bestandenem Testlauf.
- Claude testet auf Port 4199 und beendet nur selbst gestartete Prozesse.

## Teil B – Projektwissen

### B1 Dateikarte

| Datei | Inhalt | von |
| --- | --- | --- |
| `index.html` | App-Shell, Dialoge, Script-Reihenfolge | Codex |
| `content.js`, `learning-path.js`, `lesson-openings.js`, `practical-exercises.js` | Inhalte, 21 Einheiten, Übungen | Codex |
| `app.js` (ca. 4350 Zeilen) | Routing, Rendering, Freischaltung, XP, SQL-Prüfung, Export/Import | Codex, Ergänzungen Claude |
| `study-tools.js`, `drawing.js`, `appearance.js`, `command-search.js`, `reference-search.js` | Textmarker, Zeichnen, Darstellung, Suchen | Codex |
| `styles.css`, `styles-lesson.css`, `styles-practice.css`, `styles-visuals.css`, `styles-shared.css`, `styles-extensions.css` | Styling in sechs Teilen (seit 0.39.3), in dieser Reihenfolge geladen; Reihenfolge nicht ändern. Claudes Blöcke stehen in `styles-extensions.css` | Teile 1–5 Codex, Teil 6 Claude |
| `sql-check.js` | Ergebnisvergleich, Aufbauprüfung, nachgebildete Datumsfunktionen (aus `app.js` ausgelagert) | Code Codex, Datei Claude |
| `sql-feedback.js` | deutsche SQL-Meldungen, `SHOW TABLES`/`DESCRIBE` | Claude |
| `debug-exercises.js`, `predict-exercises.js`, `order-exercises.js` | drei Aufgabentypen | Claude |
| `review.js` | Auswahl der Wiederholungsrunde | Claude |
| `erm-editor.js` | Modell-Editor, Logik und Seitenanbindung | Claude |
| `lehrkraft.html`, `teacher-overview.js` | Klassenübersicht | Claude |
| `tools/build-site.cjs` | Liste der öffentlichen Dateien; neue Dateien dort eintragen | Codex |
| `backup.js` | Prüfsumme der JSON-Sicherung, gemeinsam für `app.js` und `teacher-overview.js` | Code von Codex, ausgelagert von Claude |
| `state.js` | Vorgabewerte, Kürzel/Klasse, Kennungen, `normalizeState`; neue Felder des Lernstands hier ergänzen. `loadState`/`saveState` bleiben in `app.js` | Code von Codex, ausgelagert von Claude |
| `tools/build-solutions.cjs` | erzeugt die Lösungsdatei der Lehrkraft unter `resources/` (nicht veröffentlicht) | Claude |
| `tests/*.test.js`, `tests/*.browser.cjs` | 190 Node-Tests, 35 Browsertests | Codex und Claude |

Neue Routen: `#sql/frei`, `#sql/wiederholen`, `#sql/klausur`, `#modeling/editor`.
Neue Speicher-Schlüssel außerhalb des Lernstands: `workbenchlab-v1-rettung`,
`workbenchlab-review-v1`, `workbenchlab-exam-v1`, `workbenchlab-erm-v1`. Sie sind nicht Teil der
JSON-Sicherung.

### B2 Befehle

```powershell
node tools/run-tests.cjs            # Node-Tests
python -B -m unittest discover -s tests -p "test_*.py"
python -m http.server 4199 --bind 127.0.0.1
$env:WORKBENCH_TEST_URL = "http://127.0.0.1:4199/"
node tools/run-browser-tests.cjs    # Browsertests, Edge
node tools/verify-claude-native.cjs # Claudes Aufgaben und Modell-Export gegen die MariaDB des Sticks, Port 33399
```

### B3 Regeln, die sich bewährt haben

1. Nichts aus `resources/` oder `references/` veröffentlichen.
2. Keine externen Laufzeitabhängigkeiten, kein API-Schlüssel im Frontend, kein
   Tracking, kein Backend für Schülerdaten.
3. Lernstand: `localStorage["workbenchlab-v1"]`, Export `formatVersion: 6`.
   Schemaänderungen brauchen Migration in `normalizeState`.
4. Inhalte nur über `escapeHtml`/`inlineCode` in `innerHTML` schreiben.
5. Browser-SQL ist SQLite; MySQL-Funktionen in `registerSqlFunctions`
   nachbilden.
6. Bei jedem Release alle `?v=`-Parameter in `index.html` und `lehrkraft.html`,
   `content.version` in `learning-path.js` und `version` in `package.json`
   gemeinsam anheben. Zwei Node-Tests erzwingen den Gleichstand.
7. Neue öffentliche Dateien in `tools/build-site.cjs` eintragen und vor
   `node tools/build-site.cjs` mit `git add` aufnehmen.
8. **Konstanten, die `normalizeState` liest, müssen in `app.js` vor
   `let state = loadState()` stehen.** Sonst greift `loadState` zu früh darauf
   zu. Claude ist am 9. Oktober hineingelaufen; der Browsertest hat es vor der
   Veröffentlichung gefunden.
9. Tests, die Werte aus dem `vm`-Kontext vergleichen, brauchen `Array.from`
   oder `JSON.parse(JSON.stringify(...))`; `deepEqual` scheitert sonst an
   fremden Prototypen.
10. Beide Farbmodi und die Breiten 1440 und 390 px prüfen.

## Teil C – Offene Punkte

### C1 Übersicht

| ID | Titel | Status |
| --- | --- | --- |
| OPT-01 | Freies SQL-Labor | erledigt (Claude, 0.26.0) |
| OPT-02 | Deutsche Fehlermeldungen bei „Ausführen“ | erledigt (Claude, 0.26.0) |
| OPT-03 | Neue Aufgabentypen | erledigt (Claude, 0.28.0–0.30.0) |
| OPT-04 | Modell-Editor | erledigt (Claude, 0.32.0–0.37.0); Optionalität in der Schreibweise der Lerneinheit (`0..1`, `1..N`) |
| OPT-05 | Einheiten in kürzere Schritte teilen | verworfen (Jakob, 2026-10-09): eine Einheit bleibt eine Seite |
| OPT-06 | Freischaltung lockern | erledigt (Claude, 0.38.0): Übungen frei, Einheiten in Reihenfolge |
| OPT-07 | Wiederholung und Klausurtraining | erledigt (Claude, 0.31.0 und 0.34.0) |
| OPT-08 | Klassenübersicht | erledigt (Claude, 0.27.0) |
| OPT-09 | Lehrkraft-Bestätigung absichern | offen; Vorschlag mit drei Wegen in C3, Entscheidung Jakob (a, b oder c) |
| OPT-10 | Tests vor dem Deployment | erledigt (Codex, `c27998d`) |
| OPT-11 | Nur App-Dateien veröffentlichen | erledigt (Codex, `4c01fb4`) |
| OPT-12 | Musterlösungen im Quelltext | erledigt für die veröffentlichte Fassung (Claude, 0.38.0) |
| OPT-13 | Versionsgleichstand | erledigt als Test (Claude, 0.26.0) |
| OPT-14 | Dokumentation zusammenführen | erledigt (Claude, 2026-10-09): `CHANGELOG.md`, `documentation/releases/`, `documentation/archiv/`, README neu, Wegweiser |
| OPT-15 | Offline-Betrieb und Schul-PC-Test | Checkliste erledigt (Claude, `documentation.md` 0.16); Test vor Ort und Offline-Betrieb offen |
| OPT-16 | `app.js` und `styles.css` aufteilen | Schritt 1 (0.38.2): SQL-Prüflogik in `sql-check.js`; Schritt 2 (0.39.1): Prüfsumme der Sicherung in `backup.js`; Schritt 3 (0.39.2): Lernstand-Bereinigung in `state.js`; Schritt 4 (0.39.3): `styles.css` in sechs Dateien. Erledigt (Claude) |
| OPT-17 | `.tmp/` aus Google Drive heraushalten | `.tmp/` am 2026-10-09 geleert (991 MB, Freigabe Jakob); Claudes Tests schreiben nach `%TEMP%`; Codex' Tests schreiben weiter nach `.tmp/` |
| OPT-18 | Erstbesuch ohne Profildialog | verworfen (Jakob, 2026-10-09): Dialog bleibt |
| OPT-19 | Druckansicht | erledigt (Claude, 0.26.2) |
| OPT-20 | MySQL-Unterschiede sichtbar machen | erledigt (Claude, 0.36.0–0.37.0): freies Labor und „Ausführen“ in den Aufgaben |
| OPT-21 | Lernstand bei Ladefehler nicht verwerfen | erledigt (Claude, 0.26.1) |
| OPT-22 | Prüfergebnis-Banner sichtbar | erledigt (Claude, 0.28.0) |
| OPT-25 | Skripte der Einheiten im Browser-Labor ausführen | Vorschlag in C3; Entscheidung Jakob |
| OPT-23 | Lösungen im Entwicklermodus sichtbar machen | erledigt (Claude, 0.39.0): lokale Lösungsdatei, siehe `documentation/documentation.md` 0.45 |
| OPT-24 | Fehlersuche nach Abiturmuster | erledigt (Claude, 0.38.1) |

### C2 Was noch bei Jakob liegt

1. **OPT-15:** Checkliste in `documentation.md` 0.16 schrittweise im Unterricht durchgehen.
2. **Durchsicht** der neuen Aufgaben, des Modell-Editors und der Klassenübersicht im Unterricht.
3. **OPT-09:** Lehrkraft-Bestätigung absichern – Weg a, b oder c? Vorschlag in C3.
4. **OPT-25:** Sollen die Skripte der Einheiten auch im Browser-Labor laufen (für Hausaufgaben ohne Workbench)? Vorschlag in C3.

### C3 Offene Punkte im Einzelnen

#### OPT-09 Lehrkraft-Bestätigung absichern (Vorschlag; Entscheidung Jakob)

- **Befund:** Den Haken „Die Lehrkraft hat mein Lernprodukt gesehen …“ können
  Lernende selbst setzen. Daran hängen Abschluss, XP, die nächste Einheit und
  5 NAGOLD. Die Prüfsumme der Sicherung schützt davor nicht; ihr Verfahren ist
  öffentlich.
- **Grenze:** Ohne Server kann die Lernseite kein Geheimnis prüfen. Alles, was
  im Quelltext steht, können Lernende lesen. Verlässlich wird die Bestätigung
  nur auf dem Gerät der Lehrkraft.

| | Weg | Aufwand im Unterricht | Schutz | Umsetzung |
| --- | --- | --- | --- | --- |
| a | Lassen; NAGOLD im Profil als „gemeldet“ kennzeichnen. Verbindlich ist Jakobs eigene Liste | keiner | keiner in der App; Kontrolle im Gespräch | klein (Text) |
| b | Bestätigen in der Klassenübersicht: Jakob lädt die Sicherungen und hakt je Schüler die gesehenen Einheiten ab. Die Liste bleibt auf seinem Gerät (eigene Sicherungsdatei) und liefert die NAGOLD als CSV | Sicherungen einsammeln wie bisher, Haken setzen | hoch; maßgeblich ist Jakobs Gerät | mittel; nur `lehrkraft.html` und `teacher-overview.js` |
| c | Code je Schüler und Einheit: Die Klassenübersicht erzeugt aus einem geheimen Schlüssel kurze Codes. Die Lernseite speichert den Code, die Klassenübersicht prüft ihn | je Schüler und Einheit ein Code (bis 21 × Klassenstärke) | hoch; Codes nicht übertragbar. Tippfehler fallen erst in der Übersicht auf | groß; Lernseite und Übersicht |

- **Empfehlung Claude:** b, dazu der Texthinweis aus a. Kein Mehraufwand für
  Lernende, keine Codes; die Bewertung liegt bei der Lehrkraft, die Lernseite
  bleibt Motivation und Selbstkontrolle.
- **Nicht empfohlen:** ein gemeinsamer Code oder dessen Hash im Quelltext. Er
  wäre nach der ersten Stunde bekannt oder auslesbar.
- **Frage an Jakob:** a, b oder c?

#### OPT-25 Skripte der Einheiten im Browser ausführen (Vorschlag; Entscheidung Jakob)

- **Befund (0.41.1):** Die SQL-Beispiele der Einheiten und die 12 Skripte unter
  `assets/sql/` gehören zur Datenbank, die die Lernenden in MySQL Workbench
  selbst anlegen. Im freien SQL-Labor laufen sie nicht: andere Spalten
  (`strasse`, `fahrstundenzahl`), und jedes Skript bricht an `USE` oder
  `CREATE DATABASE` ab.
- **Folge:** Wer zu Hause keine MySQL Workbench hat, kann die Beispiele der
  Einheiten nicht ausprobieren. Jakob will, dass vieles als Hausaufgabe läuft.
- **Möglicher Weg:** im freien SQL-Labor eine vierte Auswahl „Leere Datenbank
  (für die Skripte der Einheiten)“. `rewriteMysql` behandelt dafür `CREATE
  DATABASE`, `USE` und Namen der Form `datenbank.tabelle`. Aufwand mittel; nur
  `sql-feedback.js`, `state.js` (`playgroundSchemas`) und das freie Labor.
- **Zu bedenken:** Die Einheiten üben ausdrücklich die Bedienung von MySQL
  Workbench. Das Browser-Labor wäre ein Ersatz für zu Hause, kein Ersatz für
  die Workbench-Arbeit im Unterricht.
- **Frage an Jakob:** gewünscht oder nicht?

#### OPT-04 Modell-Editor, mögliche Erweiterungen

- **Stand:** Formular-Editor mit verschiebbarem Diagramm, Optionalität, drei
  geprüften Aufgaben, freiem Modell, SQL- und SVG-Export. Der Export ist an der
  MariaDB des Sticks geprüft.
- **Seit 0.40.0:** Entwürfe sind Teil der JSON-Sicherung (Zusatzblock
  `extras.ermDrafts`, Format weiter 6; ältere Sicherungen lassen vorhandene
  Entwürfe unberührt).
- **Offen:** XP für bestandene Modellaufgaben; Krähenfuß-Darstellung.
- **Bitte prüfen (Jakob):** Leserichtung der Optionalität. Der Editor schreibt
  `0..1` an den Entitätstyp, von dem höchstens ein Datensatz zugeordnet ist.

#### OPT-12 Lösungen, Rest

- **Stand:** Die veröffentlichte Fassung enthält keine Lösungsanweisungen mehr.
- **Offen:** Das Repository ist öffentlich und enthält sie weiterhin, weil die
  Tests sie brauchen. Wer das ändern will, muss die Lösungen in eine nicht
  veröffentlichte Quelle auslagern (privates Repository oder lokale Datei) und
  die Tests darauf umstellen.

#### OPT-23 Lösungen im Entwicklermodus

- **Idee (Jakob):** Im Entwicklermodus könnten die Musterlösungen sichtbar sein.
- **Umsetzung (0.39.0):** Die Lernseite liefert weiterhin keine Lösungen aus.
  Die Lehrkraft lädt im Entwicklermodus über „Lösungsdatei laden“ die Datei
  `resources/workbenchlab-loesungen.json` (erzeugt mit `node tools/build-solutions.cjs`).
  Die Lösungen liegen nur im Arbeitsspeicher und sind nach dem Neuladen weg.
- **Für Codex:** Nach Änderungen an Aufgaben die Datei neu erzeugen. In
  `app.js`: `teacherSolutions`, `loadSolutionFile`, `teacherSolutionHtml`.

#### OPT-24 Fehlersuche nach Abiturmuster

- **Befund:** Der Haupttermin 2025 gibt eine Abfrage mit `FROM a, b WHERE … AND
  … OR …` vor, die wegen fehlender Klammern falsch auswertet, und verlangt
  Erläuterung und Korrektur.
- **Vorschlag:** Eine siebte Fehlersuche-Aufgabe mit eigenem Beispiel zu L2.4.

#### OPT-14 Dokumentation zusammenführen

- **Befund:** `documentation.md` hat über 3200 Zeilen. Der Abschnitt
  „Aktueller Funktionsstand“ nennt noch 38 Übungen. Dateinamen der
  Release-Notizen sind uneinheitlich (`RELEASE_0.24.1.md` neben
  `RELEASE_0_24_0.md`). Die README enthält historische Stände 0.5.0 und 0.7.0.
- **Vorschlag:** `CHANGELOG.md` mit einem Absatz je Release; Release-Dateien
  nach `documentation/releases/`; `documentation.md` in „aktueller Stand“ und
  „Archiv“ trennen.
- **Warum Abstimmung:** verschiebt und kürzt Dateien, die du angelegt hast.

#### OPT-15 Offline-Betrieb

- **Stand:** Checkliste für den Schul-PC-Test steht in `documentation.md`,
  Abschnitt 0.16.
- **Offen:** Test vor Ort; danach Service Worker mit Versionsprüfung und ein
  ZIP-Paket für den Informatik-Stick.
- **Hinweis:** `sql-wasm.wasm` lädt nicht über `file://`; für den Stick ist
  ein kleiner lokaler Server oder eine eingebettete WASM-Variante nötig.

#### OPT-16 `app.js` und `styles.css` aufteilen

- **Befund:** `app.js` rund 4350 Zeilen in einer Funktion, `styles.css` rund
  4700 Zeilen mit späteren Überschreibungen früherer Regeln.
- **Vorschlag:** schrittweise nach dem Muster der kleinen Dateien auslagern:
  zuerst SQL-Laufzeit und -Prüfung, dann Export/Import, dann Lernstand. Reine
  Logik ohne DOM halten. Claudes neue Teile folgen diesem Muster bereits.
- **Abnahme:** alle Tests unverändert grün nach jedem Schritt.
- **Umsetzung (0.38.2 bis 0.39.3):** `sql-check.js`, `backup.js`, `state.js` und sechs
  Style-Dateien; Code jeweils unverändert verschoben, dazu direkte Tests. `app.js`
  hat noch rund 4300 Zeilen (Darstellung und Ereignisse); weiteres Aufteilen wäre
  ein Umbau, kein Verschieben, und ist nicht geplant.
- **Regel für neue Styles:** ans Ende der passenden Datei; was eine frühere Regel
  überschreiben soll, muss in derselben oder einer späteren Datei stehen.

#### OPT-17 `.tmp/` aus Google Drive heraushalten

- **Befund:** `.tmp/` ist rund 1 GB groß und wird mitsynchronisiert. Auch
  Claudes Browsertests schreiben Bildschirmfotos dorthin.
- **Vorschlag:** Testartefakte nach `%TEMP%\WorkbenchLab` schreiben und
  `.tmp/` nach Freigabe leeren.
- **Stand (0.40.1):** `.tmp/` ist geleert; Claudes Tests schreiben nach
  `%TEMP%\workbenchlab-tests`. Deine 20 Browsertests schreiben je Lauf rund
  46 MB Bilder nach `.tmp/` (Google Drive synchronisiert sie). Nicht geändert,
  weil unklar ist, ob deine Umgebung außerhalb des Projektordners schreiben darf.
- **Nebenbei:** `assets/bpe6-relief-map.png`, `assets/bpe6-settlement-map.png`
  und `assets/workbenchlab-titanium.png` (zusammen 8,8 MB) lädt keine Seite;
  sie werden trotzdem veröffentlicht.

#### OPT-20 MySQL-Unterschiede, mögliche Erweiterungen

- **Stand:** Drei Unterschiede an der MariaDB 10.4.13 des Sticks gemessen
  (Ganzzahl-Division, Groß-/Kleinschreibung bei `=`, `||`). Hinweise im freien
  Labor und nach „Ausführen“ in Abfrage-Aufgaben. Messwerte in
  `documentation.md`, Abschnitt 0.32.
- **Seit 0.41.0:** 80 Anweisungen gemessen. 22 MySQL-Funktionen sind in
  `sql-check.js` (`registerMysqlFunctions`) nachgebildet oder berichtigt und
  gelten in Labor und Aufgaben. `rewriteMysql` schreibt `TIMESTAMPDIFF`,
  `AUTO_INCREMENT` und Tabellenoptionen nur im freien Labor um. `explain`
  erkennt reines MySQL und vertippte Funktionen. Zwei weitere Unterschiede
  (Alias in `WHERE`, Stellen bei `AVG`). Einzelheiten: `documentation.md` 0.57.
- **Regel:** Neue Funktionen, Umschreibungen und Aussagen erst aufnehmen,
  wenn sie in `tools/verify-claude-native.cjs` (Abschnitt 7) gemessen sind;
  das Werkzeug prüft jetzt 151 Fälle.
- **Offen:** `sql_mode` der Schul-PCs; MySQL 8 ist nicht gemessen.

### C4 Bekannte Schwächen in Claudes Teilen

- Wiederholungsrunde, laufendes Klausurtraining und Rettungskopie liegen
  außerhalb der JSON-Sicherung (Modell-Entwürfe seit 0.40.0 enthalten).
- Der Modell-Editor prüft Struktur und Schlüssel, keine Attributnamen.
- Vorhersage und Klauseln ordnen lassen sich durch Probieren lösen; sie sind
  als Übung gedacht, nicht als Nachweis.
- Die Klassenübersicht erkennt keine gezielt gefälschte Sicherung. Ausnahme
  seit 0.40.1: Modellaufgaben prüft sie aus den Entwürfen selbst nach.
- An der MariaDB des Sticks geprüft: alle 15 neuen Aufgaben und der
  SQL-Export des Modell-Editors (Abschnitt 0.32 der Dokumentation).
- Nicht geprüft: Schul-PCs, die Workbench-Oberfläche selbst, echter Bildschirmleser
  (Namen und Struktur prüft `tests/a11y-names.browser.cjs` auf 242 Ansichten),
  echtes Tablet oder Telefon (Fingerziehen ist in Edge nachgebildet getestet),
  andere Browser als Edge, MySQL 8.
- Neue Bedienelemente brauchen einen vorlesbaren Namen und Überschriften dürfen
  keine Ebene überspringen; sonst schlägt `tests/a11y-names.browser.cjs` fehl.
