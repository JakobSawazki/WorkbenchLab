# claude2codex.md – Übergabe von Claude an Codex

Stand: 2026-10-09 · Grundlage: Release 0.33.0 · Autor: Claude

**Neu am 2026-10-09:** Jakob hat Claude beauftragt, eigenständig weiterzuarbeiten und geeignete Stände zu veröffentlichen. Claude protokolliert seine Abläufe in `documentation/documentation.md`, Abschnitt 0 (gekennzeichnet). Erledigt sind OPT-01, OPT-02, OPT-08, OPT-13, OPT-19 und OPT-21 (Claude) sowie OPT-10 und OPT-11 (Codex). Sicherung des Codex-Stands: Tag `codex-stand-2026-10-08`.

Diese Datei ist die **einzige** Übergabedatei von Claude. Sie enthält alle
Rückmeldungen, Vorschläge und Optimierungspunkte. Die Gegenrichtung ist
`codex2claude.md` im Projektstamm (legt Codex an).

## Teil A – Arbeitsauftrag

### A1 Übergabeprotokoll

- Claude schreibt nur in `claude2codex.md`, Codex nur in `codex2claude.md`.
  Jeder liest die Datei des anderen vor Arbeitsbeginn, zusammen mit
  `git status` und `git log -5`.
- Jeder Optimierungspunkt hat eine stabile ID (`OPT-xx`). Commits,
  Release-Notizen und `codex2claude.md` verweisen auf diese ID.
- Statusänderungen meldet Codex in `codex2claude.md` (ID, neuer Status, Commit,
  Datum, offene Fragen). Claude überträgt sie beim nächsten Einsatz in die
  Tabelle in Teil C.
- Fremde uncommittete Änderungen nicht überschreiben. Ein Thema pro Commit.
- Jeder Push auf `main` veröffentlicht nach bestandenem Testlauf. Vor dem Push
  `git fetch` und `git status`; nie `--force`. Claude testet auf Port 4199 und
  lässt Prozesse auf anderen Ports unberührt.

### A2 Was Claude geprüft hat und was nicht

Geprüft: Quelltext, Dokumentation, Git-Verlauf, Live-Seite als Gast und im
Entwicklermodus (Startseite, Lernpfad, L1.1, SQL-Labor, eine SQL-Aufgabe mit
fehlerhafter Eingabe, Modellieren). Keine Konsolenfehler auf der Live-Seite.

Nicht geprüft: Verhalten auf Schul-PCs, echte MySQL Workbench. Node- und
Browsertests führt Claude seit 2026-10-09 selbst aus.

### A3 Reihenfolge

Bitte in dieser Reihenfolge bearbeiten; Details je Punkt in Teil C.

| Schritt | ID | Kurzfassung | Voraussetzung |
| ---: | --- | --- | --- |
| 1 | OPT-10 | `package.json`, Tests als Bedingung fürs Deployment | – |
| 2 | OPT-02 | Deutsche Fehlermeldung direkt bei „Ausführen“ | – |
| 3 | OPT-06 | Freischaltung lockern | **Entscheidung Jakob (A4.1)** |
| 4 | OPT-01 | Freier SQL-Spielplatz | – |
| 5 | OPT-15 | Offline-Betrieb, Checkliste Schul-PC | – |
| 6 | OPT-05 | Einheiten in kürzere Schritte teilen | – |
| 7 | OPT-08 | Lehrkraft-Übersicht aus JSON-Exporten | – |
| 8 | OPT-03, OPT-04 | Neue Aufgabentypen, ERM-Editor | OPT-16 erleichtert beides |

Kleine Punkte, die sich jederzeit nebenbei erledigen lassen: OPT-11, OPT-13,
OPT-17, OPT-18, OPT-19, OPT-20.

### A4 Offene Entscheidungen (Jakob)

1. **OPT-06:** Strenge Reihenfolge mit Lehrkraft-Haken beibehalten oder
   Übungen frei zugänglich machen? Claudes Empfehlung: Übungen öffnen, nur
   den Abschluss der Einheit an die Reihenfolge binden.
2. **OPT-12:** Fließen XP in die Leistungsbewertung ein? Nur dann lohnt der
   Aufwand, Lösungen aus dem öffentlichen Quelltext zu entfernen.
3. **OPT-11:** Soll das Lehrbuch-Manuskript öffentlich bleiben, bis eine
   Leseausgabe eingebunden ist?
4. **OPT-17:** Darf `.tmp/` (rund 1 GB) geleert werden?

## Teil B – Projektwissen

### Projekt in drei Sätzen

Statische Lernplattform (Single-Page-App, kein Build, kein Backend) für BPE6
„Relationale Datenbanken“, J1 Informatik, berufliches Gymnasium BW. Themen: SQL,
ERM/eERM, Relationenmodell, Normalisierung, MySQL Workbench. Zielgruppe sind
Schülerinnen und Schüler; die Seite soll motivieren und praktisches Üben
ermöglichen.

- Live: <https://jakobsawazki.github.io/WorkbenchLab/>
- Deployment: **jeder Push auf `main` veröffentlicht sofort** (GitHub Pages,
  `.github/workflows/pages.yml`, lädt das gesamte Repo hoch, ohne Testlauf).

### Dateikarte

| Datei | Inhalt | Zeilen ca. |
| --- | --- | ---: |
| `index.html` | App-Shell, Dialoge, Script-Reihenfolge mit `?v=`-Cache-Parametern | 220 |
| `content.js` | `window.WORKBENCH_CONTENT`: Basistexte, Übungen, SQL-Schemata, Befehle | 2400 |
| `learning-path.js` | Lernpfad L1–L5 (21 Einheiten), setzt `content.version` | 2400 |
| `lesson-openings.js` | Bildeinstiege L1.1, L2.1, L5.1 | 150 |
| `practical-exercises.js` | Praxisübungen ab 0.23.0 | 250 |
| `app.js` | Routing, Rendering, Freischaltung, XP, SQL-Prüfung, Export/Import | 3800 |
| `study-tools.js`, `drawing.js`, `appearance.js` | Textmarker/Notizen, Zeichnen, Farben/Schrift | klein |
| `command-search.js`, `reference-search.js` | Suche in SQL-Befehlen und Nachschlagen | klein |
| `styles.css` | gesamtes Styling | 4500 |
| `tests/*.test.js` | Node-Tests (`node:test`, laden Inhalte per `vm`) | 21 Dateien |
| `tests/*.browser.cjs` | Playwright-Skripte (Edge, erwarten Server auf `127.0.0.1:4174`) | 20 Dateien |
| `tools/verify-*.cjs` | Prüfskripte je Lernfortschritt, native SQL-Prüfung | |
| `documentation/` | Release-Notizen, Abnahmen, Konzepte | |
| `Lehrbuch/` | Manuskriptentwurf (Markdown) | |
| `resources/`, `references/`, `.tmp/` | **nicht versioniert**; Originalmaterial bzw. Testartefakte | |

Wichtige Stellen in `app.js`: `normalizeState` (Lernstand-Schema),
`isLessonUnlocked`, `renderLesson`, `runSqlPractice`, `checkSqlPatterns`,
`sameTable`, `translateSqlError`, `backupPayload`/`importProgressFile`,
`renderRoute`.

### Befehle

```powershell
python -m http.server 4174                       # lokal starten
node tools/run-tests.cjs                         # Node-Tests (node --test tests/ scheitert mit Node 24)
node tests/<name>.browser.cjs                    # einzelner Browsertest (Server muss laufen)
python -B -m unittest discover -s tests -p 'test_*.py' -v
```

Browsertests lesen die Adresse aus `WORKBENCH_TEST_URL`; Claude nutzt
`http://127.0.0.1:4199/`.

### Harte Regeln

1. Nichts aus `resources/` oder `references/` veröffentlichen (Originalblätter,
   Lösungen). Öffentliche Texte und Daten sind eigenständig und fiktiv.
2. Keine externen Laufzeitabhängigkeiten (CDN, Fonts, APIs). Kein API-Schlüssel
   im Frontend. Kein Tracking, kein Backend für Schülerdaten.
3. Lernstand liegt in `localStorage["workbenchlab-v1"]`, Export als JSON
   (`formatVersion: 6`). Schemaänderungen brauchen Migration in
   `normalizeState` und einen Import-Test für ältere Formate.
4. Nutzereingaben und Inhalte nur über `escapeHtml`/`inlineCode` in
   `innerHTML` schreiben.
5. Browser-SQL ist SQLite (`sql.js`), der Unterricht nutzt MariaDB/MySQL
   Workbench 6.3.10. MySQL-spezifische Funktionen müssen in
   `registerSqlFunctions` nachgebildet oder in der Aufgabe benannt werden.
6. Bei jedem Release alle `?v=`-Parameter in `index.html`, `content.version`
   in `learning-path.js` und `version` in `package.json` gemeinsam anheben; ein
   Node-Test erzwingt den Gleichstand.
8. Neue Konstanten, die `normalizeState` liest, müssen in `app.js` **vor**
   `let state = loadState()` stehen (siehe OPT-21).
7. Beide Farbmodi und die Breiten 1440/1024/390/320 px prüfen.

### Bekannte Stolperstellen

- `documentation/documentation.md` nennt im Kopf noch Release 0.21.0; aktuell
  ist 0.25.0 laut `README.md` und `learning-path.js`.
- `content.js` trägt intern `version: "0.5.0"`; maßgeblich ist die
  Überschreibung in `learning-path.js`.
- Das Repo liegt in Google Drive. `.tmp/` ist rund 1 GB groß und wird
  mitsynchronisiert; Dateisystemzugriffe sind langsam.

## Teil C – Optimierungspunkte

**Status:** `offen` · `in Arbeit (Agent, Datum)` · `erledigt (Commit)` · `verworfen (Grund)`

**Aufwand:** S = unter 1 Stunde · M = halber Tag · L = mehrere Sitzungen

### Übersicht

| ID | Titel | Bereich | Nutzen | Aufwand | Status |
| --- | --- | --- | --- | --- | --- |
| OPT-01 | Freier SQL-Spielplatz | Üben | hoch | M | erledigt (Claude, 0.26.0) |
| OPT-02 | Fehlermeldungen schon bei „Ausführen“ übersetzen | Üben | hoch | S | erledigt (Claude, 0.26.0) |
| OPT-03 | Neue Aufgabentypen: Fehler finden, SQL-Puzzle, Ergebnis vorhersagen | Üben | hoch | L | erledigt (Claude): Fehlersuche 0.28.0, Vorhersage 0.29.0, Klauseln ordnen 0.30.0 |
| OPT-04 | ERM-Editor zum freien Zeichnen | Modellieren | hoch | L | erste Stufe erledigt (Claude, 0.32.0): Formular-Editor mit Diagramm, zwei geprüften Aufgaben, SQL-Export, Bildexport (0.33.0); freies Verschieben und Optionalität offen |
| OPT-05 | Einheiten in kürzere Schritte teilen | Motivation | hoch | M | offen |
| OPT-06 | Freischaltung lockern, Üben ohne Lehrkraft-Haken | Motivation | hoch | S | offen |
| OPT-07 | Wiederholung und Klausurtraining | Üben | mittel | M | teilweise: Wiederholungsrunde erledigt (Claude, 0.31.0); Klausurmodus offen |
| OPT-08 | Lehrkraft-Übersicht aus JSON-Exporten | Unterricht | hoch | M | erledigt (Claude, 0.27.0, `lehrkraft.html`) |
| OPT-09 | Lehrkraft-Bestätigung per Code | Unterricht | mittel | M | offen |
| OPT-10 | Tests vor dem Deployment, `package.json` | Technik | hoch | S | erledigt (Codex, c27998d) |
| OPT-11 | Nur App-Dateien veröffentlichen | Technik | mittel | S | erledigt (Codex, 4c01fb4) |
| OPT-12 | Musterlösungen aus dem öffentlichen Quelltext | Technik | mittel | M | offen |
| OPT-13 | Cache-Parameter automatisch setzen | Technik | mittel | S | erledigt als Gleichstand-Test (Claude, 0.26.0) |
| OPT-14 | Dokumentation zusammenführen | Doku | mittel | M | offen |
| OPT-15 | Offline-Betrieb und Schul-PC-Test | Unterricht | hoch | M | teilweise: Checkliste in `documentation.md` 0.16 (Claude); Test vor Ort und Offline-Betrieb offen |
| OPT-16 | `app.js` und `styles.css` aufteilen | Technik | mittel | L | offen |
| OPT-17 | `.tmp/` aus Google Drive heraushalten | Technik | niedrig | S | offen |
| OPT-18 | Erster Besuch ohne Profilzwang | Motivation | mittel | S | offen |
| OPT-19 | Druck- und PDF-Ansicht | Unterricht | niedrig | S | erledigt (Claude, 0.26.2) |
| OPT-20 | MySQL-Unterschiede sichtbar machen | Üben | mittel | S | teilweise (Hinweis und SHOW TABLES/DESCRIBE im freien Labor, 0.26.0) |
| OPT-21 | Lernstand bei Ladefehler nicht still verwerfen | Technik | hoch | S | erledigt (Claude, 0.26.1) |
| OPT-22 | Prüfergebnis-Banner oberhalb der Reiter anzeigen (liegt nach „Lösung prüfen“ im verdeckten Reiter „Ergebnis“) | Üben | mittel | S | erledigt (Claude, 0.28.0) |


### Üben und Motivation

#### OPT-01 Freier SQL-Spielplatz

- **Befund:** Das SQL-Labor zeigt nur Aufgabenkarten. Es gibt keinen Ort, an
  dem man ohne Aufgabe gegen die drei Übungsdatenbanken Abfragen ausprobiert.
- **Vorschlag:** Route `#sql/frei` mit Datenbankwahl, Editor, Ergebnis,
  Tabelleninhalt zum Aufklappen und „Zurücksetzen“. Keine XP.
- **Abnahme:** Jede der drei Datenbanken wählbar; `INSERT`/`UPDATE`/`DELETE`
  wirken bis zum Zurücksetzen; Entwurf wird lokal gespeichert.

#### OPT-02 Fehlermeldungen schon bei „Ausführen“ übersetzen

- **Befund:** `SELECT … nachnam FROM fahrschueler` → „Ausführen“ zeigt
  `no such column: nachnam` auf Englisch. Die deutsche Erklärung aus
  `translateSqlError` erscheint erst im Coach-Reiter.
- **Vorschlag:** Übersetzte Meldung direkt im Ergebnisbereich, Original
  kleiner darunter. Bei unbekannter Spalte/Tabelle den ähnlichsten vorhandenen
  Namen vorschlagen („Meintest du `nachname`?“).
- **Abnahme:** Test mit Tippfehler in Spalte und Tabelle, fehlendem `FROM`,
  fehlendem Anführungszeichen.

#### OPT-03 Neue Aufgabentypen

- **Befund:** Vorhanden sind SQL schreiben, Auswahl, Lückenfelder, Diagramm.
- **Vorschlag:** (a) fehlerhafte Abfrage reparieren, (b) SQL-Klauseln in die
  richtige Reihenfolge ziehen, (c) Ergebnis vor dem Ausführen vorhersagen,
  (d) Sachtext → Abfrage in zwei Stufen. (a) und (c) nutzen `runSqlPractice`
  und `sameTable` weiter.
- **Abnahme:** Je Typ mindestens drei Aufgaben in L1.5–L2.4, Tastaturbedienung,
  Lernstand im Export.

#### OPT-04 ERM-Editor zum freien Zeichnen

- **Befund:** Die Diagrammaufgaben sind Auswahlfelder in festen Diagrammen.
  Eigenes Modellieren findet nur in Workbench oder als Freihandskizze statt.
- **Vorschlag:** Einfacher Editor: Entitätstypen anlegen, Attribute und
  PK/FK markieren, Beziehungen mit Kardinalität ziehen. Prüfung gegen ein
  Sollmodell (Namen normalisiert, Kardinalitäten, FK-Seite) mit Rückmeldung
  je Abweichung. Export als PNG und als `CREATE TABLE`-Skript für Workbench.
- **Abnahme:** L2.1 (1:N) und L3.1 (M:N) als erste Aufgaben; Bedienung mit
  Maus, Touch und Tastatur.

#### OPT-05 Einheiten in kürzere Schritte teilen

- **Befund:** L1.1 hat 24 Abschnitte, 59 Eingabefelder und etwa 7600 px
  Seitenhöhe; XP gibt es erst am Ende.
- **Vorschlag:** Die vier Phasen (Informieren, Planen, Workbench, Abschließen)
  als Schritte mit Fortschrittsleiste; je Schritt eine Seite, kleine XP je
  Schritt, „Weiter“ unten. Inhalte bleiben unverändert.
- **Abnahme:** Position im Schritt bleibt nach Neuladen erhalten;
  bestehende Lernstände bleiben gültig.

#### OPT-06 Freischaltung lockern

- **Befund:** Bei einem neuen Lernstand sind alle Aufgaben im SQL-Labor gesperrt
  (die erste gehört zu L1.5). Jede
  Einheit verlangt den Haken „Lehrkraft hat bestätigt“. Wer zu Hause übt oder
  schneller ist, kommt nicht weiter.
- **Vorschlag:** Übungen im SQL-Labor und unter Modellieren frei zugänglich;
  nur der Abschluss der Einheit (und deren XP) bleibt an die Reihenfolge
  gebunden. Alternativ ein Schalter „Übungsmodus“ je Klasse.
- **Offene Entscheidung:** didaktisch gewollt streng oder offen? → Jakob.

#### OPT-07 Wiederholung und Klausurtraining

- **Vorschlag:** „Tagesaufgabe“ aus bereits gelösten Übungen (ältere zuerst),
  dazu ein Klausurmodus: 5 gemischte Aufgaben, Zeitanzeige, Auswertung nach
  Kompetenz (Projektion, Selektion, Gruppierung, Join, Modell, 3NF).
- **Abnahme:** Auswertung zeigt je Kompetenz gelöst/gesamt und verlinkt die
  passende Einheit.

#### OPT-18 Erster Besuch ohne Profilzwang

- **Befund:** Beim ersten Aufruf liegt der Profildialog über der Startseite.
- **Vorschlag:** Erst die Seite zeigen; Profil beim ersten XP-Gewinn oder
  Export abfragen.

#### OPT-20 MySQL-Unterschiede sichtbar machen

- **Befund:** Das Labor ist SQLite, der Unterricht MariaDB. Nachgebildet sind
  `YEAR`, `MONTH`, `NOW`, `DATEDIFF`.
- **Vorschlag:** Im Labor ein kurzer Hinweis „läuft in Workbench genauso“ bzw.
  „in Workbench anders: …“ bei bekannten Abweichungen (Anführungszeichen,
  `LIMIT`, Groß-/Kleinschreibung bei `LIKE`, Datumsfunktionen). Liste der
  nachgebildeten Funktionen an einer Stelle pflegen und testen.

### Unterricht und Lehrkraft

#### OPT-08 Lehrkraft-Übersicht aus JSON-Exporten

- **Befund:** Der Export ist je Person eine Datei; eine Klassenübersicht fehlt.
- **Vorschlag:** Seite `lehrkraft.html`, die mehrere Exportdateien lokal
  einliest (kein Upload) und eine Tabelle zeigt: Kürzel, Klasse, abgeschlossene
  Einheiten, gelöste Übungen, XP, letzte Aktivität, Prüfsumme gültig ja/nein.
  CSV-Export.
- **Abnahme:** 30 Dateien per Drag-and-drop; ungültige Dateien werden benannt
  statt still übersprungen.

#### OPT-09 Lehrkraft-Bestätigung per Code

- **Befund:** Die Bestätigung ist ein Haken, den jede Person selbst setzt.
- **Vorschlag:** Lehrkraft erzeugt in OPT-08 je Einheit und Klasse einen
  kurzen Code; die App prüft dessen Hash. Kein echter Schutz, aber eine
  bewusste Hürde. Nur sinnvoll, wenn OPT-06 den Haken nicht ohnehin entfernt.

#### OPT-15 Offline-Betrieb und Schul-PC-Test

- **Befund:** README nennt den Test an Schul-PCs und mit Workbench 6.3.10 als
  offen. Die App braucht bei jedem Start Netz.
- **Vorschlag:** Service Worker, der die App-Dateien zwischenspeichert; dazu
  ein ZIP-Paket für den Informatik-Stick. Checkliste für den Schul-PC-Test als
  eigene Datei mit Ergebnisfeldern.
- **Hinweis:** `sql-wasm.wasm` lädt nicht über `file://`; für den Stick ist
  ein kleiner lokaler Server oder eine eingebettete WASM-Variante nötig.

#### OPT-19 Druck- und PDF-Ansicht

- **Befund:** `styles.css` enthält kein `@media print`.
- **Vorschlag:** Druckansicht für ausgefüllte Aufgabenblätter und Notizen
  (helle Farben, Navigation ausgeblendet, alle Abschnitte aufgeklappt).

### Technik

#### OPT-10 Tests vor dem Deployment

- **Befund:** `pages.yml` veröffentlicht ohne Testlauf. Es gibt keine
  `package.json`; Playwright ist nirgends als Abhängigkeit festgehalten.
- **Vorschlag:** `package.json` mit `test`, `test:browser`, `serve`;
  Workflow-Job `test` (Node-Tests und Python-Test) als Voraussetzung für
  `deploy`. Browsertests zunächst nur lokal, später in CI mit Chromium statt
  `channel: "msedge"`.
- **Abnahme:** Ein absichtlich fehlschlagender Test verhindert das Deployment.

#### OPT-11 Nur App-Dateien veröffentlichen

- **Befund:** `upload-pages-artifact` nimmt `path: "."`. Damit liegen auch
  `tests/`, `tools/`, `documentation/`, `Lehrbuch/` (101 von 150 Dateien)
  öffentlich auf der Lernseite.
- **Vorschlag:** Im Workflow ein Verzeichnis `_site` mit `index.html`,
  JS, CSS, `assets/`, `vendor/` zusammenstellen und nur dieses hochladen.
  Das Lehrbuch nur, wenn es als Leseausgabe eingebunden ist.

#### OPT-12 Musterlösungen im öffentlichen Quelltext

- **Befund:** `content.js`, `learning-path.js` und `practical-exercises.js`
  enthalten 25 `solution:`-Einträge und `expectedSql` im Klartext. Die
  Oberfläche zeigt sie nicht, „Seitenquelltext anzeigen“ schon.
- **Vorschlag:** `solution` aus den ausgelieferten Dateien entfernen (wird in
  der Schüleransicht nicht gebraucht). Für `expectedSql` das erwartete
  Ergebnis vorab berechnen und nur dessen Hash ausliefern; das Soll-Ergebnis
  ist dann nicht mehr ablesbar.
- **Einordnung:** Kein Sicherheitsproblem, aber relevant, sobald XP in die
  Leistungsbewertung einfließen.

#### OPT-13 Cache-Parameter automatisch setzen

- **Befund:** `index.html` lädt `content.js?v=0.16.1`; die Datei wurde zuletzt
  mit 0.22.0 geändert. Die Parameter werden von Hand gepflegt (sechs
  verschiedene Stände).
- **Vorschlag:** Kleines Skript `tools/stamp-version.cjs`, das alle `?v=` auf
  die aktuelle Version oder einen Dateihash setzt; Test, der Abweichungen
  meldet.

#### OPT-16 `app.js` und `styles.css` aufteilen

- **Befund:** `app.js` 3839 Zeilen in einer Funktion, `styles.css` 4538 Zeilen
  mit späteren Überschreibungen früherer Regeln. Für Agenten teuer zu lesen
  und fehleranfällig bei parallelen Änderungen.
- **Vorschlag:** Schrittweise nach dem Muster der vorhandenen kleinen Dateien
  auslagern: zuerst SQL-Laufzeit und -Prüfung (`sql-runtime.js`), dann
  Export/Import (`backup.js`), dann Lernstand (`state.js`). Reine Logik dabei
  ohne DOM halten, damit Node-Tests sie direkt laden können. CSS nach
  Bereichen trennen und doppelte Regeln zusammenführen.
- **Abnahme:** Alle bestehenden Tests unverändert grün nach jedem Schritt.

#### OPT-17 `.tmp/` aus Google Drive heraushalten

- **Befund:** `.tmp/` ist rund 986 MB groß (Screenshots, Videorender, native
  SQL-Läufe) und liegt im synchronisierten Ordner.
- **Vorschlag:** Testartefakte nach `%TEMP%\WorkbenchLab` schreiben
  (Umgebungsvariable in den Testskripten) und `.tmp/` nach Rückfrage leeren.
- **Hinweis:** Ein Git-Repo in einem Sync-Ordner kann bei gleichzeitigem
  Zugriff beschädigt werden. GitHub ist die maßgebliche Kopie; regelmäßig
  pushen.

### Dokumentation

#### OPT-14 Dokumentation zusammenführen

- **Befund:** `documentation.md` (2103 Zeilen) nennt 0.21.0, README 0.25.0.
  README enthält historische Stände 0.5.0 und 0.7.0. Dateinamen uneinheitlich
  (`RELEASE_0.24.1.md` neben `RELEASE_0_24_0.md`). Zwölf Release-Dateien
  wiederholen Prüfumfänge.
- **Vorschlag:** `CHANGELOG.md` mit einem Absatz je Release; Release-Dateien
  nach `documentation/releases/`; README auf Zweck, Start, Architektur und
  Links kürzen; `documentation.md` in „aktueller Stand“ und „Archiv“ trennen.
  Ein Node-Test vergleicht die Versionsangabe in README, `learning-path.js`
  und `index.html`.

#### OPT-21 Lernstand bei Ladefehler nicht still verwerfen

- **Befund (2026-10-09):** `loadState()` fängt jeden Fehler aus
  `normalizeState` ab und liefert kommentarlos einen leeren Lernstand. Der
  nächste `saveState()` überschreibt dann den echten Stand dauerhaft. Claude
  ist bei OPT-01 selbst in diese Falle gelaufen (Konstante nach `loadState()`
  definiert); nur der Browsertest hat es vor der Veröffentlichung bemerkt.
- **Vorschlag:** Im Fehlerfall den Rohwert unter `workbenchlab-v1-rettung`
  sichern, nicht automatisch speichern und eine sichtbare Meldung mit Hinweis
  auf die JSON-Sicherung zeigen.
- **Abnahme:** Browsertest mit absichtlich defektem Lernstand: Rohwert bleibt
  erhalten, Meldung erscheint, kein stilles Überschreiben.
