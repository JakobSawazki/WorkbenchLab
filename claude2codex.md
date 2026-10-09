# claude2codex.md – Übergabe von Claude an Codex

Stand: 2026-10-09 · Grundlage: Release 0.38.2 · Autor: Claude

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

Nicht angefasst: `codex2claude.md`, `documentation/RELEASE_*.md`,
`documentation/ABNAHME_*.md`, `Lehrbuch/`, `content.js`, die Inhalte der 21
Einheiten in `learning-path.js` (dort nur `content.version`).

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
| `styles.css` (ca. 4700 Zeilen) | Styling; Claudes Blöcke stehen am Dateiende und sind kommentiert | beide |
| `sql-check.js` | Ergebnisvergleich, Aufbauprüfung, nachgebildete Datumsfunktionen (aus `app.js` ausgelagert) | Code Codex, Datei Claude |
| `sql-feedback.js` | deutsche SQL-Meldungen, `SHOW TABLES`/`DESCRIBE` | Claude |
| `debug-exercises.js`, `predict-exercises.js`, `order-exercises.js` | drei Aufgabentypen | Claude |
| `review.js` | Auswahl der Wiederholungsrunde | Claude |
| `erm-editor.js` | Modell-Editor, Logik und Seitenanbindung | Claude |
| `lehrkraft.html`, `teacher-overview.js` | Klassenübersicht | Claude |
| `tools/build-site.cjs` | Liste der öffentlichen Dateien; neue Dateien dort eintragen | Codex |
| `tests/*.test.js` (29), `tests/*.browser.cjs` (30) | 161 Node-Tests, 31 Browsertests | je 20 von Codex, 9 bzw. 10 von Claude |

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
| OPT-09 | Lehrkraft-Bestätigung per Code | offen; seit NAGOLD an der Bestätigung hängen, neu zu bewerten |
| OPT-10 | Tests vor dem Deployment | erledigt (Codex, `c27998d`) |
| OPT-11 | Nur App-Dateien veröffentlichen | erledigt (Codex, `4c01fb4`) |
| OPT-12 | Musterlösungen im Quelltext | erledigt für die veröffentlichte Fassung (Claude, 0.38.0) |
| OPT-13 | Versionsgleichstand | erledigt als Test (Claude, 0.26.0) |
| OPT-14 | Dokumentation zusammenführen | weitgehend erledigt (Claude, 2026-10-09): `CHANGELOG.md`, `documentation/releases/`, README neu, Wegweiser in `documentation.md`; Auslagern der alten Abschnitte offen |
| OPT-15 | Offline-Betrieb und Schul-PC-Test | Checkliste erledigt (Claude, `documentation.md` 0.16); Test vor Ort und Offline-Betrieb offen |
| OPT-16 | `app.js` und `styles.css` aufteilen | Schritt 1 erledigt (Claude, 0.38.2): SQL-Prüflogik in `sql-check.js`; nächste Schritte Sicherung/Import und Lernstand offen |
| OPT-17 | `.tmp/` aus Google Drive heraushalten | `.tmp/` am 2026-10-09 geleert (991 MB, Freigabe Jakob); Claudes Tests schreiben nach `%TEMP%`; Codex' Tests schreiben weiter nach `.tmp/` |
| OPT-18 | Erstbesuch ohne Profildialog | verworfen (Jakob, 2026-10-09): Dialog bleibt |
| OPT-19 | Druckansicht | erledigt (Claude, 0.26.2) |
| OPT-20 | MySQL-Unterschiede sichtbar machen | erledigt (Claude, 0.36.0–0.37.0): freies Labor und „Ausführen“ in den Aufgaben |
| OPT-21 | Lernstand bei Ladefehler nicht verwerfen | erledigt (Claude, 0.26.1) |
| OPT-22 | Prüfergebnis-Banner sichtbar | erledigt (Claude, 0.28.0) |
| OPT-23 | Lösungen im Entwicklermodus sichtbar machen | offen (Idee Jakob, 2026-10-09) |
| OPT-24 | Fehlersuche nach Abiturmuster | erledigt (Claude, 0.38.1) |

### C2 Was noch bei Jakob liegt

1. **OPT-15:** Checkliste in `documentation.md` 0.16 schrittweise im Unterricht durchgehen.
2. **Durchsicht** der neuen Aufgaben, des Modell-Editors und der Klassenübersicht im Unterricht.
3. **OPT-09:** Soll die Lehrkraft-Bestätigung abgesichert werden, seit NAGOLD daran hängen?

### C3 Offene Punkte im Einzelnen

#### OPT-04 Modell-Editor, mögliche Erweiterungen

- **Stand:** Formular-Editor mit verschiebbarem Diagramm, Optionalität, drei
  geprüften Aufgaben, freiem Modell, SQL- und SVG-Export. Der Export ist an der
  MariaDB des Sticks geprüft.
- **Offen:** Entwürfe in die JSON-Sicherung aufnehmen (verlangt eine
  Formatänderung); XP für bestandene Modellaufgaben; Krähenfuß-Darstellung.
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
- **Zu klären:** Der Entwicklermodus läuft im Browser der Lernenden. Was dort
  sichtbar werden soll, muss ausgeliefert werden und wäre damit wieder für alle
  lesbar. Möglicher Weg: Die Lehrkraft lädt im Entwicklermodus eine lokale
  Lösungsdatei, die nicht veröffentlicht wird.

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

#### OPT-17 `.tmp/` aus Google Drive heraushalten

- **Befund:** `.tmp/` ist rund 1 GB groß und wird mitsynchronisiert. Auch
  Claudes Browsertests schreiben Bildschirmfotos dorthin.
- **Vorschlag:** Testartefakte nach `%TEMP%\WorkbenchLab` schreiben und
  `.tmp/` nach Freigabe leeren.

#### OPT-20 MySQL-Unterschiede, mögliche Erweiterungen

- **Stand:** Drei Unterschiede an der MariaDB 10.4.13 des Sticks gemessen
  (Ganzzahl-Division, Groß-/Kleinschreibung bei `=`, `||`). Hinweise im freien
  Labor und nach „Ausführen“ in Abfrage-Aufgaben. Messwerte in
  `documentation.md`, Abschnitt 0.32.
- **Offen:** weitere Fälle messen, etwa Datumsfunktionen und der `sql_mode`
  der Schul-PCs. Neue Aussagen erst nach Messung mit
  `tools/verify-claude-native.cjs` aufnehmen.

### C4 Bekannte Schwächen in Claudes Teilen

- Wiederholungsrunde, Modell-Entwürfe und Rettungskopie liegen außerhalb der
  JSON-Sicherung.
- Der Modell-Editor prüft Struktur und Schlüssel, keine Attributnamen.
- Vorhersage und Klauseln ordnen lassen sich durch Probieren lösen; sie sind
  als Übung gedacht, nicht als Nachweis.
- Die Klassenübersicht erkennt keine gezielt gefälschte Sicherung.
- An der MariaDB des Sticks geprüft: alle 15 neuen Aufgaben und der
  SQL-Export des Modell-Editors (Abschnitt 0.32 der Dokumentation).
- Nicht geprüft: Schul-PCs, die Workbench-Oberfläche selbst, echter Bildschirmleser,
  Touch auf einem echten Gerät, Tageswechsel der Wiederholungsrunde bei
  geöffnetem Fenster.
