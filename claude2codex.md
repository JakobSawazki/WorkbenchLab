# claude2codex.md – Übergabe von Claude an Codex

Stand: 2026-10-09 · Grundlage: Release 0.34.0 · Autor: Claude

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

Jede Version hat einen Tag `v0.xx.y`. Zurücksetzen: siehe
`documentation/documentation.md`, Abschnitt 0.1.

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
6. **Kopfzeilen von `documentation/documentation.md`** (Stand, Release) und
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
| `sql-feedback.js` | deutsche SQL-Meldungen, `SHOW TABLES`/`DESCRIBE` | Claude |
| `debug-exercises.js`, `predict-exercises.js`, `order-exercises.js` | drei Aufgabentypen | Claude |
| `review.js` | Auswahl der Wiederholungsrunde | Claude |
| `erm-editor.js` | Modell-Editor, Logik und Seitenanbindung | Claude |
| `lehrkraft.html`, `teacher-overview.js` | Klassenübersicht | Claude |
| `tools/build-site.cjs` | Liste der öffentlichen Dateien; neue Dateien dort eintragen | Codex |
| `tests/*.test.js` (29), `tests/*.browser.cjs` (30) | 147 Node-Tests, 30 Browsertests | je 20 von Codex, 9 bzw. 10 von Claude |

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
| OPT-04 | Modell-Editor | erste Stufe erledigt (Claude, 0.32.0–0.33.0); freies Verschieben und Optionalität offen |
| OPT-05 | Einheiten in kürzere Schritte teilen | offen, Abstimmung nötig |
| OPT-06 | Freischaltung lockern | offen, Entscheidung Jakob |
| OPT-07 | Wiederholung und Klausurtraining | erledigt (Claude, 0.31.0 und 0.34.0) |
| OPT-08 | Klassenübersicht | erledigt (Claude, 0.27.0) |
| OPT-09 | Lehrkraft-Bestätigung per Code | offen, Entscheidung Jakob; Codex rät ab |
| OPT-10 | Tests vor dem Deployment | erledigt (Codex, `c27998d`) |
| OPT-11 | Nur App-Dateien veröffentlichen | erledigt (Codex, `4c01fb4`) |
| OPT-12 | Musterlösungen im Quelltext | offen, Entscheidung Jakob |
| OPT-13 | Versionsgleichstand | erledigt als Test (Claude, 0.26.0) |
| OPT-14 | Dokumentation zusammenführen | offen, Abstimmung nötig |
| OPT-15 | Offline-Betrieb und Schul-PC-Test | Checkliste erledigt (Claude, `documentation.md` 0.16); Test vor Ort und Offline-Betrieb offen |
| OPT-16 | `app.js` und `styles.css` aufteilen | offen, Abstimmung nötig |
| OPT-17 | `.tmp/` aus Google Drive heraushalten | offen, Freigabe Jakob |
| OPT-18 | Erstbesuch ohne Profildialog | offen, Entscheidung Jakob |
| OPT-19 | Druckansicht | erledigt (Claude, 0.26.2) |
| OPT-20 | MySQL-Unterschiede sichtbar machen | teilweise (Hinweis und `SHOW TABLES`/`DESCRIBE` im freien Labor) |
| OPT-21 | Lernstand bei Ladefehler nicht verwerfen | erledigt (Claude, 0.26.1) |
| OPT-22 | Prüfergebnis-Banner sichtbar | erledigt (Claude, 0.28.0) |

### C2 Entscheidungen, die bei Jakob liegen

1. **OPT-06:** Strenge Reihenfolge mit Lehrkraft-Haken beibehalten oder
   Übungen frei zugänglich machen? Claudes Empfehlung: Übungen öffnen, nur den
   Abschluss der Einheit an die Reihenfolge binden. Seit 0.26.0 gibt es mit
   freiem SQL-Labor und Modell-Editor bereits zwei Bereiche ohne Sperre.
2. **OPT-12 und OPT-09:** Fließen XP in die Leistungsbewertung ein? Nur dann
   lohnt es, Lösungen aus dem Quelltext zu entfernen oder die Bestätigung
   abzusichern.
3. **OPT-18:** Soll der Profildialog beim ersten Besuch sofort erscheinen oder
   erst beim ersten XP-Gewinn?
4. **OPT-17:** Darf `.tmp/` (rund 1 GB) geleert werden?
5. **OPT-15:** Checkliste in `documentation.md` 0.16 vor Ort durchgehen.

### C3 Offene Punkte im Einzelnen

#### OPT-04 Modell-Editor, zweite Stufe

- **Stand:** Formular-Editor mit automatischem Diagramm, zwei geprüften
  Aufgaben (1:N, M:N auflösen), freiem Modell, SQL- und SVG-Export.
- **Offen:** Kästen frei verschieben; Optionalität (0 oder 1); weitere
  Aufgaben, etwa zu L2.3 und L3.3; Entwürfe in die JSON-Sicherung aufnehmen
  (verlangt eine Formatänderung); XP für bestandene Modellaufgaben.
- **Nicht geprüft:** Import des exportierten SQL in eine echte MySQL
  Workbench.

#### OPT-05 Einheiten in kürzere Schritte teilen

- **Befund:** L1.1 hat 24 Abschnitte, 59 Eingabefelder und etwa 7600 px
  Seitenhöhe; XP gibt es erst am Ende.
- **Vorschlag:** Die vier Phasen (Informieren, Planen, Workbench, Abschließen)
  als Schritte mit Fortschrittsleiste; je Schritt eine Seite, „Weiter“ unten.
  Inhalte bleiben unverändert.
- **Warum Abstimmung:** Viele deiner Browsertests prüfen die Einheitenansicht
  (Phasenreihenfolge, Aufgabengruppen, Abschluss aller 21 Einheiten,
  Scrollposition bei der Startanleitung). Ein Umbau ändert ihre Grundlage.
- **Abnahme:** Position im Schritt bleibt nach Neuladen erhalten; bestehende
  Lernstände bleiben gültig.

#### OPT-12 Musterlösungen im öffentlichen Quelltext

- **Befund:** `content.js`, `learning-path.js` und `practical-exercises.js`
  enthalten 25 `solution:`-Einträge und `expectedSql` im Klartext. Die
  Oberfläche zeigt sie nicht, „Seitenquelltext anzeigen“ schon. Claudes neue
  Aufgaben haben kein Feld `solution`, aber ebenfalls `expectedSql`, `fixed`
  und `verifySql`.
- **Vorschlag:** `solution` aus den ausgelieferten Dateien entfernen; für
  `expectedSql` das erwartete Ergebnis vorab berechnen und nur dessen Hash
  ausliefern.
- **Einordnung:** Kein Manipulationsschutz. `tests/practical-exercises.*`
  lesen `item.solution`; die Tests müssten mitziehen.

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

#### OPT-18 Erstbesuch ohne Profildialog

- **Befund:** Beim ersten Aufruf liegt der Profildialog über der Startseite.
- **Vorschlag:** Erst die Seite zeigen; Profil beim ersten XP-Gewinn oder
  Export abfragen.
- **Warum Entscheidung:** Du hast den Dialog am 8. Oktober auf Jakobs Wunsch
  mehrfach überarbeitet; ob er sofort erscheinen soll, ist eine bewusste
  Festlegung. `tests/xp.browser.cjs` prüft den Erstbesuch.

#### OPT-20 MySQL-Unterschiede sichtbar machen

- **Stand:** Hinweis im freien Labor; `SHOW TABLES` und `DESCRIBE` laufen.
- **Offen:** Hinweise bei bekannten Abweichungen (Anführungszeichen,
  Groß-/Kleinschreibung bei `LIKE`, Datumsfunktionen); Liste der nachgebildeten
  Funktionen an einer Stelle pflegen und testen.

### C4 Bekannte Schwächen in Claudes Teilen

- Wiederholungsrunde, Modell-Entwürfe und Rettungskopie liegen außerhalb der
  JSON-Sicherung.
- Der Modell-Editor prüft Struktur und Schlüssel, keine Attributnamen.
- Vorhersage und Klauseln ordnen lassen sich durch Probieren lösen; sie sind
  als Übung gedacht, nicht als Nachweis.
- Die Klassenübersicht erkennt keine gezielt gefälschte Sicherung.
- Nicht geprüft: Schul-PCs, echte MySQL Workbench, echter Bildschirmleser,
  Touch auf einem echten Gerät, Tageswechsel der Wiederholungsrunde bei
  geöffnetem Fenster.
