# WorkbenchLab Projektdokumentation

Stand: 9. Oktober 2026 (Europe/Berlin) [Claude, 2026-10-09: Kopfzeilen aktualisiert]

Aktueller Release-Stand: **0.39.3** [Claude, 2026-10-09; zuvor stand hier 0.21.0, tatsächlich war 0.25.3 veröffentlicht]

Veröffentlichter Stand: siehe Abschnitt 0.4.

Mitwirkende: Jakob Sawazki, Codex, seit 8. Oktober 2026 zusätzlich Claude. Claudes Einträge stehen in Abschnitt 0 und sind dort sowie an jeder anderen Stelle mit `[Claude, Datum]` gekennzeichnet.

Repository: `https://github.com/JakobSawazki/WorkbenchLab`

Live-Seite: `https://jakobsawazki.github.io/WorkbenchLab/`

Abschlussprüfung der bisherigen konkreten Änderungswünsche:
[Abnahme vom 3. Oktober 2026](releases/ABNAHME_2026-10-03.md).

Auf erneuten ausdrücklichen Auftrag werden nun auch die sieben eigenständigen
Lehrbuch-Manuskriptdateien und vier ergänzenden Projekttexte veröffentlicht.
Das Lehrbuch bleibt ein gekennzeichneter Entwurf; Originalmaterialien und
lokale Testexporte bleiben ausgeschlossen. Die Abnahme dokumentiert den
vorherigen Veröffentlichungsstand; dieser Nachtrag erweitert den Dateiumfang,
nicht die Funktionen der App.

<!-- CLAUDE-WEGWEISER:BEGIN – von Claude angelegt am 2026-10-09 (OPT-14); bei jedem Release mitpflegen. -->
## Wegweiser und aktueller Stand [Claude, 2026-10-09]

**Diese Datei enthält den Wegweiser und Claudes Arbeitsprotokoll. Das Archiv bis
Release 0.21.0 liegt in einer eigenen Datei.**

| Ich suche … | Ort |
| --- | --- |
| Was hat sich wann geändert? | [`CHANGELOG.md`](../CHANGELOG.md) – eine Zeile je Version |
| Was ist gerade der Stand? | Tabelle unten |
| Was hat Claude getan, geprüft, nicht geprüft? | Abschnitt 0 dieser Datei (nummerierte Einträge, neuester am Ende) |
| Was hat Codex bis 0.21.0 getan? | [`archiv/PROJEKTDOKUMENTATION_BIS_0_21.md`](archiv/PROJEKTDOKUMENTATION_BIS_0_21.md) (Abschnitte 1 bis 12 und Anhänge, Stand 3. Oktober 2026) |
| Was hat Codex von 0.22.0 bis 0.25.3 getan? | Einzelberichte unter [`releases/`](releases/) |
| Was ist offen, wer ist dran? | [`claude2codex.md`](../claude2codex.md), Teil C; [`codex2claude.md`](../codex2claude.md) |
| Jakobs Entscheidungen vom 9. Oktober 2026 | Abschnitt 0.37 dieser Datei |
| Checkliste für den Schul-PC-Test | Abschnitt 0.16 dieser Datei |
| Stand vor Claudes Mitarbeit wiederherstellen | Abschnitt 0.1 dieser Datei |

**Aktueller Stand (Release 0.39.3)**

| Thema | Stand |
| --- | --- |
| Lerneinheiten | 21 in fünf Lernfortschritten; in fester Reihenfolge freigeschaltet; Abschluss nach Selbstkontrolle, Verständnischeck und Bestätigung durch die Lehrkraft |
| Übungen | 59, alle frei zugänglich: 25 SQL-Schreibaufgaben, 7 Fehlersuche, 5 Vorhersage, 4 Klauseln ordnen, 18 Modell-, Begriffs- und Diagrammaufgaben |
| Zusätzliche Übungsformen | freies SQL-Labor, Wiederholungsrunde, Klausurtraining, Modell-Editor |
| Bewertung | XP als Motivation; 5 NAGOLD je abgeschlossener Einheit für die kontinuierlich erbrachte Leistung |
| Lehrkraft | Klassenübersicht `lehrkraft.html`; Entwicklermodus im Profil mit `AltGr + S`, dort „Lösungsdatei laden“ (Abschnitt 0.45) |
| Lösungen | nicht in der veröffentlichten Lernseite; im Repository vorhanden; für die Lehrkraft als lokale Datei `resources/workbenchlab-loesungen.json` (`node tools/build-solutions.cjs`) |
| Tests | 180 Node-Tests, 2 Python-Tests, 32 Browsertests; zusätzlich von Hand 49 Prüfungen gegen die MariaDB des Informatik-Sticks |
| Nicht geprüft | Schul-PCs, Bedienoberfläche von MySQL Workbench, echter Bildschirmleser, Touch auf einem echten Gerät |

**Weitere Dokumente in diesem Ordner** (alle von Codex, Stand jeweils im Dokument)

| Datei | Inhalt |
| --- | --- |
| `TECHNIK_UND_DIDAKTIK.md` | didaktisches Modell, SQL im Browser, Lernstand, Bewertung |
| `BPE6_ABGLEICH_2026.md` | Abgleich der Inhalte mit dem Bildungsplan |
| `SQL_FEEDBACK_UND_KI.md` | SQL-Coach und Überlegungen zu einer optionalen KI-Anbindung |
| `BILDSPRACHE_UND_ASSETS.md`, `ALPINE_LEARNING_MAP.md`, `SETTLEMENT_MAP_PROMPT.md` | Herkunft und Prompts der Bilder und Landkarten |
| `WORKBENCH_START_VIDEO.md` | animierte Startanleitung |
| `EARLY_WORKBENCH_PHASES.md`, `L2_1_WORKBENCH_ENTWURF.md`, `L3_2_…`, `L3_3_…`, `L4_1_WORKBENCH_AUFTRAEGE.md`, `L5_WORKBENCH_ANALYSEN.md` | Konzepte der Praxisaufträge je Lernfortschritt |
| `OPT_10_TEST_GATE.md`, `OPT_11_PUBLIC_ARTIFACT.md` | Codex' Berichte zu Testschranke und Veröffentlichungspaket |
| `releases/` | Release- und Abnahmeberichte 0.22.0 bis 0.25.3; archivierte frühere README-Abschnitte |
| `screenshots/` | Bildschirmfotos früherer Stände |

<!-- CLAUDE-WEGWEISER:END -->

<!-- CLAUDE:BEGIN – Alle Einträge zwischen BEGIN und END stammen von Claude (Claude Code). -->
## 0. Arbeitsprotokoll Claude

> **Kennzeichnung:** Dieser Abschnitt wird ausschließlich von **Claude** gepflegt.
> Einträge von Claude an anderer Stelle dieser Datei tragen den Vermerk
> `[Claude, Datum]`. Alles Übrige stammt von Codex. Die Einträge sind
> fortlaufend nummeriert; der neueste steht am Ende des Abschnitts.

### 0.1 Sicherung der Codex-Stände und Wiederherstellung [Claude, 2026-10-09]

Vor Claudes erster Codeänderung wurde der letzte reine Codex-Stand gesichert:

| Sicherung | Ort | Inhalt |
| --- | --- | --- |
| Git-Tag `codex-stand-2026-10-08` | GitHub und lokal | Commit `4dedae1` (Release 0.25.3 mit OPT-10 und OPT-11) |
| Git-Bündel | `C:\Users\PC\WorkbenchLab-Sicherungen\WorkbenchLab_codex-stand-2026-10-08.bundle` | vollständiger Verlauf aller Zweige und Tags, außerhalb von Google Drive |
| GitHub-Verlauf | `origin/main` | jeder frühere Commit bleibt einzeln abrufbar |

Wiederherstellen im Notfall:

```powershell
# Stand nur ansehen (ändert nichts):
git checkout codex-stand-2026-10-08

# Live-Seite auf den Codex-Stand zurücksetzen, ohne Verlauf zu löschen:
git checkout main
git revert --no-edit codex-stand-2026-10-08..HEAD
git push origin main

# Komplettes Repository aus dem Bündel neu anlegen (falls der Drive-Ordner beschädigt ist):
git clone "C:\Users\PC\WorkbenchLab-Sicherungen\WorkbenchLab_codex-stand-2026-10-08.bundle" WorkbenchLab-Wiederherstellung
```

Regel für Claude: Vor jedem größeren Arbeitsblock wird ein neuer Tag
`sicherung-JJJJ-MM-TT` gesetzt und zu GitHub übertragen. Es wird nie mit
`--force` gepusht und kein Verlauf umgeschrieben.

### 0.2 Reparatur des Git-Verzeichnisses [Claude, 2026-10-09]

`git fetch` brach mit `fatal: bad object refs/desktop.ini` ab. Ursache: Google
Drive legt in jedem Ordner eine `desktop.ini` an, auch unter `.git/refs/`, und
Git liest diese Dateien als Verweise. Claude hat die sieben `desktop.ini` unter
`.git/refs/` gelöscht; `git fsck` meldet sonst keine Fehler, lokaler und
entfernter Stand waren identisch. Drive kann die Dateien erneut anlegen. Abhilfe
dann: `Get-ChildItem .git\refs -Recurse -Force -Filter desktop.ini | Remove-Item -Force`.

### 0.3 Testumgebung und Ports [Claude, 2026-10-09]

- Node.js 24 LTS ist seit 8. Oktober systemweit installiert. Playwright liegt
  außerhalb von Google Drive unter `C:\Users\PC\.workbenchlab-tools`.
- Claude testet auf **Port 4199**, damit Codex-Vorschauen (4174, 4177, 4325)
  unberührt bleiben:

```powershell
python -m http.server 4199 --bind 127.0.0.1
$env:NODE_PATH = "$env:USERPROFILE\.workbenchlab-tools\node_modules"
$env:WORKBENCH_TEST_URL = "http://127.0.0.1:4199/"
node tools/run-tests.cjs
node tools/run-browser-tests.cjs
```

- Am 8. Oktober hat Claude versehentlich einen fremden Server auf Port 4174
  beendet. Seitdem beendet Claude nur noch selbst gestartete Prozesse.

### 0.4 Release 0.26.0: freies SQL-Labor und deutsche SQL-Meldungen [Claude, 2026-10-09]

Bezug: OPT-01, OPT-02 und OPT-13 aus `claude2codex.md`.

**Neu für Schülerinnen und Schüler**

- **Freies SQL-Labor** unter `#sql/frei`, erreichbar über den neuen Abschnitt
  oben im SQL-Labor. Ohne Freischaltung, ohne XP, ohne Bewertung. Wählbar sind
  die drei Übungsdatenbanken (eine Tabelle, Fahrschule mit fünf Tabellen,
  Fahrradvermietung). Änderungen durch `INSERT`, `UPDATE`, `DELETE` bleiben
  erhalten, bis „Datenbank zurücksetzen“ gewählt oder die Datenbank gewechselt
  wird. „Inhalt anzeigen“ zeigt je Tabelle alle Datensätze. Der SQL-Text wird
  je Datenbank im Lernstand gespeichert und ist Teil der JSON-Sicherung.
- **Deutsche Fehlermeldungen direkt bei „Ausführen“**, in den Aufgaben und im
  freien Labor. Beispiel: `SELECT nachnam FROM fahrschueler;` ergibt „Die Spalte
  nachnam wurde nicht gefunden … Meintest du nachname?“. Die englische
  Originalmeldung steht klein darunter. Abgedeckt sind unbekannte Tabelle,
  Spalte und Funktion, Mehrdeutigkeit, Satzbau, unvollständige Eingabe, fehlende
  Anführungszeichen, Spalten-/Werteanzahl, Pflichtfeld, Schlüssel,
  referentielle Integrität und Aggregatfunktion in `WHERE`.
- `SHOW TABLES;` und `DESCRIBE tabelle;` funktionieren im freien Labor wie in
  MySQL Workbench.
- `Strg + Enter` führt die Anweisung im Editor aus (Aufgaben und freies Labor).

**Technik**

| Datei | Änderung |
| --- | --- |
| `sql-feedback.js` (neu) | reine Logik ohne DOM: `explain`, `closest`, `schemaNames`, `rewriteMysql` |
| `app.js` | `explainSqlError`, `sqlErrorHtml`, `renderSqlPlayground`, `runPlayground`, Route `sql/frei`, Entwurfsschlüssel `frei-<schema>` in `normalizeState` |
| `styles.css` | Block am Dateiende, mit Kommentar gekennzeichnet |
| `index.html` | bindet `sql-feedback.js` ein; alle `?v=`-Parameter einheitlich `0.26.0` |
| `tools/build-site.cjs` | `sql-feedback.js` in die Liste öffentlicher Dateien aufgenommen |
| `learning-path.js`, `package.json` | Version `0.26.0` |
| `tests/sql-feedback.test.js` (neu) | 7 Node-Tests, darunter ein Versionsgleichstand-Test |
| `tests/sql-playground.browser.cjs` (neu) | Browsertest bei 1440 und 390 px |

**Versionsgleichstand (OPT-13):** `index.html` lud `content.js?v=0.16.1`,
obwohl die Datei zuletzt mit 0.22.0 geändert wurde; insgesamt gab es sechs
verschiedene Stände. Jetzt prüft ein Node-Test, dass alle `?v=`-Parameter,
`content.version` und `package.json` dieselbe Version nennen. Bei jedem Release
sind diese drei Stellen gemeinsam anzuheben; der Test schlägt sonst fehl und
verhindert das Deployment.

**Gefundener und behobener Fehler vor Veröffentlichung:** Claudes erste Fassung
definierte die Liste `playgroundSchemas` in `app.js` nach `let state =
loadState()`. `normalizeState` griff dadurch zu früh darauf zu; `loadState`
fing den Fehler stillschweigend ab und lieferte einen **leeren Lernstand**. Der
Browsertest hat das beim Neuladen bemerkt. Die Liste steht jetzt vor
`loadState()`, und der Browsertest prüft ausdrücklich, dass Kürzel und XP ein
Neuladen überstehen. Der Fehler war nie veröffentlicht.

**Hinweis an Codex:** `loadState()` verwirft bei jedem Fehler in
`normalizeState` kommentarlos den gesamten Lernstand; der nächste
`saveState()` überschreibt ihn dann dauerhaft. Vorschlag (neu, OPT-21): Im
Fehlerfall den Rohwert unter `workbenchlab-v1-rettung` ablegen und eine
sichtbare Meldung zeigen, statt still mit leerem Stand weiterzuarbeiten.

**Prüfung**

- 115 Node-Tests und 2 Python-Tests bestanden (zuvor 108 Node-Tests; 7 neu).
- Alle 21 Browsertests bestanden, ausgeführt mit Edge gegen Port 4199,
  darunter der neue `sql-playground.browser.cjs` bei 1440 und 390 px.
- `tests/xp.browser.cjs` schlug bereits am unveränderten Codex-Stand
  `codex-stand-2026-10-08` fehl (in einem getrennten Arbeitsverzeichnis auf Port
  4198 nachgeprüft): Der Test erwartete noch den früheren eingebetteten
  Profilhinweis `#profileHelp`, den Release 0.25.3 durch den Dialog
  `#profileHelpDialog` ersetzt hat. Claude hat nur den Test angepasst
  (Dialog öffnen, schließen, Fokusrückkehr; Subpixel-Toleranz bei der
  Höhenprüfung). Am Profilverhalten wurde nichts geändert.
- Manuell im Browser geprüft: Aufgabe L1.5 „Schülerliste alphabetisch“ zeigt bei
  Tippfehlern in Tabelle und Spalte die deutsche Meldung mit Vorschlag, sowohl
  bei „Ausführen“ als auch bei „Lösung prüfen“.
- Heller und dunkler Farbmodus des neuen Bereichs bei 1280 bzw. 1440 px
  visuell kontrolliert.
- Nicht geprüft: Schul-PCs und echte MySQL Workbench.
- Veröffentlichung: Push auf `main` am 9. Oktober 2026; das Ergebnis des
  Deployments steht in Abschnitt 0.5.

### 0.5 Veröffentlichung 0.26.0 geprüft [Claude, 2026-10-09]

- Commit `8ed27fc`, Tag `v0.26.0`. GitHub-Actions-Lauf 37887121711: Job `test`
  und Job `deploy` erfolgreich.
- Live-Seite geprüft: alle Skripte mit `?v=0.26.0`, `sql-feedback.js` wird
  geladen, `#sql/frei` öffnet das freie SQL-Labor, der Tippfehler `nachnam`
  liefert die deutsche Meldung mit Vorschlag. Keine Konsolenfehler.

### 0.6 Release 0.26.1: Rettungskopie bei unlesbarem Lernstand [Claude, 2026-10-09]

Bezug: OPT-21 aus `claude2codex.md`.

Bisher lieferte `loadState()` bei jedem Lese- oder Prüffehler kommentarlos einen
leeren Lernstand; die nächste Speicherung überschrieb den echten Stand. Jetzt
gilt:

- Kann der gespeicherte Lernstand nicht gelesen werden, legt die App die
  unveränderten Rohdaten unter `workbenchlab-v1-rettung` ab (mit Zeitstempel).
- Eine Meldung bleibt sichtbar, bis sie geschlossen wird. Sie bietet
  „Rettungskopie herunterladen“ (`workbenchlab-rettungskopie.json`) und verweist
  auf die JSON-Sicherung und die Lehrkraft.
- Der Profildialog des Erstbesuchs erscheint in diesem Fall nicht, damit er die
  Meldung nicht überdeckt.
- Ein gültiger Lernstand erzeugt weder Meldung noch Rettungskopie.

Die Rettungskopie enthält die Rohdaten, kein geprüftes Exportformat. Sie lässt
sich nicht über „Laden“ einspielen, sondern dient der Lehrkraft oder einem
Agenten zur manuellen Wiederherstellung.

Geänderte Dateien: `app.js` (`loadState`, `showLoadFailureNotice`, zwei
Klick-Behandlungen), `styles.css` (Block am Dateiende),
`tests/state-rescue.browser.cjs` (neu), Versionsangaben auf `0.26.1`.

**Prüfung**

- 115 Node-Tests und 2 Python-Tests bestanden.
- Alle 22 Browsertests bestanden (Edge, Port 4199), darunter der neue
  `state-rescue.browser.cjs`: absichtlich defekter Lernstand bei 1440 und
  390 px, Rohdaten unverändert in der Rettungskopie, Meldung bleibt stehen,
  Download, kein Überschreiben beim Weiterarbeiten, Gegenprobe mit gültigem
  Lernstand.
- Nicht geprüft: Schul-PCs und echte MySQL Workbench.
- Veröffentlichung: Ergebnis des Deployments steht im nächsten Eintrag.

### 0.7 Veröffentlichung 0.26.1 geprüft und Stand der Übergabe [Claude, 2026-10-09]

- Commit `b8c9b01`, Tag `v0.26.1`. GitHub-Actions-Lauf 37887595622: Job `test`
  und Job `deploy` erfolgreich. Die Live-Seite liefert alle Dateien mit
  `?v=0.26.1`; `app.js` enthält die Rettungskopie-Logik.
- Vorhandene Sicherungspunkte: `codex-stand-2026-10-08` (vor Claude),
  `v0.26.0`, `v0.26.1`. Zurücksetzen auf einen davon wie in Abschnitt 0.1.
- Claudes Testserver auf Port 4199 wurde nach Abschluss beendet; fremde
  Prozesse blieben unberührt.
- Offene Punkte und Reihenfolge stehen in `claude2codex.md`, Teil A und C.
  Als Nächstes sinnvoll: OPT-15 (Offline-Betrieb und Schul-PC-Checkliste),
  OPT-05 (Einheiten in kürzere Schritte teilen), OPT-08 (Lehrkraft-Übersicht).
  OPT-06 (Freischaltung lockern) wartet auf Jakobs Entscheidung.

### 0.8 Lückenloses Ablaufprotokoll 8. und 9. Oktober 2026 [Claude, 2026-10-09]

Dieser Eintrag führt **alle** Handlungen von Claude auf, auch solche außerhalb
des Repositorys. Künftige Einträge folgen demselben Muster: je Arbeitsblock ein
Eintrag mit Auftrag, Handlungen, geänderten Dateien, Prüfung, Veröffentlichung.

**8. Oktober 2026 – Einstieg und Übergabe**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 1 | Repository, README, `documentation/`, Tests und Git-Verlauf gelesen | nur lesend |
| 2 | Live-Seite als Gast und im Entwicklermodus (AltGr + S) angesehen: Start, Lernpfad, L1.1, SQL-Labor, eine SQL-Aufgabe, Modellieren | nur lesend, keine Konsolenfehler |
| 3 | `AGENTS.md` und `documentation/OPTIMIERUNG_BACKLOG.md` angelegt | auf Jakobs Wunsch wieder entfernt und in **eine** Datei überführt |
| 4 | `claude2codex.md` im Projektstamm angelegt (Auftrag, Projektwissen, OPT-01 bis OPT-20) | von Codex committet |
| 5 | Prompt für Codex formuliert | nur im Chat, keine Datei |
| 6 | Node.js 24.20.0 LTS per `winget install OpenJS.NodeJS.LTS` installiert | `C:\Program Files\nodejs` (systemweit, außerhalb des Repos) |
| 7 | Playwright 1.64.0 per `npm install` installiert, ohne Browser-Download | `C:\Users\PC\.workbenchlab-tools` (außerhalb von Google Drive) |
| 8 | 106 Node-Tests und drei Browsertests ausgeführt | bestanden |
| 9 | **Versehen:** beim Aufräumen den Prozess auf Port 4174 beendet; das war ein fremder `node`-Server, nicht Claudes eigener | Jakob gemeldet; seitdem eigener Port und Prüfung der Befehlszeile vor jedem Beenden |

**9. Oktober 2026 – eigenständige Arbeit im Auftrag von Jakob**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 10 | `codex2claude.md` und Codex-Commits OPT-10/OPT-11 gelesen | Stand 0.25.3 als Grundlage |
| 11 | Sieben `desktop.ini` unter `.git/refs/` gelöscht, `git fsck` und `git fetch` geprüft | Abschnitt 0.2 |
| 12 | Tag `codex-stand-2026-10-08` gesetzt und gepusht; Git-Bündel erzeugt und mit `git bundle verify` geprüft | Abschnitt 0.1 |
| 13 | `sql-feedback.js`, Änderungen in `app.js`, `styles.css`, `index.html`, `tools/build-site.cjs`, Versionsangaben | Release 0.26.0, Abschnitt 0.4 |
| 14 | `tests/sql-feedback.test.js` und `tests/sql-playground.browser.cjs` angelegt | 7 Node-Tests, 1 Browsertest |
| 15 | Testserver `python -m http.server 4199` gestartet; alle Tests gegen Port 4199 | Abschnitt 0.3 |
| 16 | Eigenen Initialisierungsfehler (leerer Lernstand nach Neuladen) im Browsertest gefunden und behoben | Abschnitt 0.4, nie veröffentlicht |
| 17 | Temporäres Arbeitsverzeichnis `C:\Users\PC\wbl-codex-check` vom Tag `codex-stand-2026-10-08` angelegt, auf Port 4198 ausgeliefert, `xp.browser.cjs` dagegen ausgeführt | Fehlschlag bestand schon vor Claude; Verzeichnis und Server danach entfernt |
| 18 | `tests/xp.browser.cjs` an den Hilfedialog aus 0.25.3 angepasst | nur Test geändert |
| 19 | Hellen Farbmodus per Einmal-Skript fotografiert und gesichtet | Skript und Bilder nur im temporären Sitzungsordner |
| 20 | Commit `8ed27fc`, Push, Actions-Lauf 37887121711, Live-Prüfung, Tag `v0.26.0` | Abschnitt 0.5 |
| 21 | Rettungskopie bei unlesbarem Lernstand, `tests/state-rescue.browser.cjs` | Release 0.26.1, Abschnitt 0.6 |
| 22 | Commit `b8c9b01`, Push, Actions-Lauf 37887595622, Live-Prüfung, Tag `v0.26.1` | Abschnitt 0.7 |
| 23 | Commit `700e6c6` (nur Protokoll), Actions-Lauf erfolgreich | keine Änderung an der App |
| 24 | README (Release-Zeile, zwei Absätze) und `claude2codex.md` (Status, Regeln, OPT-21) aktualisiert | in den Commits 20 bis 22 enthalten |
| 25 | Eigene Server auf 4198 und 4199 beendet, nach Prüfung der Befehlszeile | fremde Prozesse unberührt |

**Dateien außerhalb des Repositorys, die Claude angelegt hat**

- `C:\Program Files\nodejs` (Node.js) und `C:\Users\PC\.workbenchlab-tools` (Playwright).
- `C:\Users\PC\WorkbenchLab-Sicherungen\` (Git-Bündel).
- `C:\Users\PC\.claude\projects\G--Meine-Ablage-Codex-WorkbenchLab\memory\`:
  Claudes eigene Merkzettel für spätere Sitzungen (`MEMORY.md`,
  `codex-zusammenarbeit.md`, `testumgebung-node-playwright.md`). Inhalt:
  Zusammenarbeitsregeln, Testbefehle, Port 4199, Hinweis auf dieses Protokoll.
  Keine Schüler- oder Zugangsdaten.
- Testartefakte unter `.tmp/` im Projektordner (Screenshots der neuen Tests,
  nicht versioniert).

**Was Claude nicht getan hat:** kein `--force`-Push, kein Umschreiben des
Verlaufs, keine Änderung an `resources/`, `references/`, `Lehrbuch/` oder an
Codex' Dateien `codex2claude.md` und `documentation/RELEASE_*.md`, kein Zugriff
auf das Projekt „Sawazki Electronics“.

### 0.9 Release 0.26.2: Druckansicht für Einheiten [Claude, 2026-10-09]

Bezug: OPT-19 aus `claude2codex.md`. Auftrag: eigenständige Optimierung.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 26 | Commit `4ab90bd` (Eintrag 0.8, nur Protokoll) gepusht | keine Änderung an der App |
| 27 | Testserver erneut auf Port 4199 gestartet | eigener Prozess |
| 28 | Druckansicht umgesetzt (siehe unten) | `app.js`, `styles.css` |
| 29 | `tests/print-view.browser.cjs` angelegt | 1 neuer Browsertest |
| 30 | Druckansicht per Einmal-Skript bei A4-Breite fotografiert und gesichtet; das Test-PDF liegt unter `.tmp/print-view-l1-1.pdf` | Bilder nur im temporären Sitzungsordner; PDF nicht versioniert |
| 31 | Alle Node-, Python- und Browsertests gegen Port 4199 ausgeführt | siehe Prüfung |

**Neu für Schülerinnen und Schüler**

- In jeder Einheit steht oben rechts ein Druckersymbol „Einheit drucken oder als
  PDF speichern“. `Strg + P` wirkt genauso.
- Beim Drucken wechselt die Seite vorübergehend auf helle Farben, öffnet alle
  eingeklappten Abschnitte und zeigt jedes Antwortfeld in voller Höhe.
  Navigation, Werkzeugleisten, Schaltflächen und Dialoge werden nicht gedruckt.
  Externe Links erhalten ihre Adresse in Klammern.
- Nach dem Drucken ist alles wie vorher: Farbmodus, eingeklappte Abschnitte,
  Feldhöhen. Die gespeicherte Farbmodus-Einstellung wird nicht verändert.

**Technik:** `preparePrint()` und die Ereignisse `beforeprint`/`afterprint` in
`app.js`; Block `@media print` am Ende von `styles.css`. Versionsangaben auf
`0.26.2`.

**Prüfung**

- 115 Node-Tests und 2 Python-Tests bestanden.
- Alle 23 Browsertests bestanden (Edge, Port 4199), darunter der neue
  `print-view.browser.cjs`: heller Modus während des Drucks, kein
  eingeklappter Abschnitt, 14-zeilige Antwort vollständig sichtbar,
  Navigation und Werkzeuge ausgeblendet, PDF erzeugt, Zustand danach
  unverändert.
- Druckbild von L1.1 bei A4-Breite gesichtet: Tabelle, Aufgabenblatt und
  Antwortfelder sauber lesbar.
- Nicht geprüft: Ausdruck auf einem echten Drucker, andere Browser als Edge,
  Druck der Seiten „Meine Notizen“ und „SQL-Labor“ (dort greift nur das
  allgemeine Druck-CSS, ohne eigenen Test).
- Veröffentlichung: Ergebnis des Deployments steht im nächsten Eintrag.

### 0.10 Veröffentlichung 0.26.2 geprüft, Abschluss des Arbeitsblocks [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 32 | Commit `40566ec` gepusht; GitHub-Actions-Lauf 37888224086 | Job `test` und Job `deploy` erfolgreich |
| 33 | Live-Seite geprüft | alle Dateien mit `?v=0.26.2`; `app.js` enthält den Druckknopf, `styles.css` den Block `@media print` |
| 34 | Tag `v0.26.2` gesetzt und gepusht | Sicherungspunkt |
| 35 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 36 | Claudes Merkzettel außerhalb des Repos ergänzt (`codex-zusammenarbeit.md`: eigenständiges Arbeiten, Protokollpflicht in dieser Datei, Sicherungs-Tags, Port 4199, `desktop.ini`-Abhilfe) | `C:\Users\PC\.claude\projects\G--Meine-Ablage-Codex-WorkbenchLab\memory\` |
| 37 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | löst ein Deployment ohne App-Änderung aus |

**Stand nach diesem Arbeitsblock**

| Sicherungspunkt | Commit | Inhalt |
| --- | --- | --- |
| `codex-stand-2026-10-08` | `4dedae1` | letzter reiner Codex-Stand (0.25.3) |
| `v0.26.0` | `8ed27fc` | freies SQL-Labor, deutsche SQL-Meldungen, Versionsgleichstand |
| `v0.26.1` | `b8c9b01` | Rettungskopie bei unlesbarem Lernstand |
| `v0.26.2` | `40566ec` | Druckansicht |

Testumfang jetzt: 115 Node-Tests, 2 Python-Tests, 23 Browsertests.

**Regel für alle künftigen Einträge von Claude:** Jeder Arbeitsblock erhält
einen nummerierten Eintrag in diesem Abschnitt, bevor er veröffentlicht wird.
Die Handlungsnummern laufen fort (nächste: 38). Auch Handlungen außerhalb des
Repositorys, Fehlgriffe und nicht geprüfte Punkte werden aufgeführt.

**Offen, in dieser Reihenfolge empfohlen:** OPT-15 (Offline-Betrieb und
Schul-PC-Checkliste), OPT-05 (Einheiten in kürzere Schritte teilen), OPT-08
(Lehrkraft-Übersicht aus JSON-Exporten), OPT-03 und OPT-04 (neue Aufgabentypen,
ERM-Editor). OPT-06 (Freischaltung lockern) wartet auf Jakobs Entscheidung.

### 0.11 Release 0.27.0: Klassenübersicht für Lehrkräfte [Claude, 2026-10-09]

Bezug: OPT-08 aus `claude2codex.md`. Auftrag: eigenständige Weiterarbeit.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 38 | Commit `a28b013` (Eintrag 0.10, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 39 | `git fetch`, `git status`: lokaler und entfernter Stand identisch, keine fremden Änderungen | vor Arbeitsbeginn |
| 40 | Exportformat, Prüfsummenverfahren und XP-Berechnung in `app.js` gelesen | nur lesend |
| 41 | `teacher-overview.js` und `lehrkraft.html` angelegt | neue Dateien im Projektstamm |
| 42 | `tools/build-site.cjs` um beide Dateien ergänzt; Versionsangaben auf `0.27.0`; README-Absatz | |
| 43 | `tests/teacher-overview.test.js` (7 Node-Tests) und `tests/teacher-overview.browser.cjs` angelegt | |
| 44 | Testserver auf Port 4199 gestartet, alle Tests ausgeführt, Bildschirmfoto gesichtet | siehe Prüfung |
| 45 | Zwei Fehlversuche im Browsertest behoben: Dateiname mit `<` und `>` ist unter Windows nicht anlegbar; Playwright erlaubt keine Mischung aus Pfaden und Speicherdateien | nur Testcode betroffen |

**Neu für die Lehrkraft**

Adresse: <https://jakobsawazki.github.io/WorkbenchLab/lehrkraft.html>
(lokal: `lehrkraft.html`). Die Seite ist bewusst nicht in der Navigation der
Lernplattform verlinkt und für Suchmaschinen als `noindex` markiert. Sie ist
nicht geheim und braucht es nicht zu sein: Sie zeigt nur, was man ihr selbst
an Dateien gibt.

- Mehrere JSON-Sicherungen auf einmal auswählen oder hineinziehen.
- Tabelle je Person: Klasse, Kürzel, XP, Einheiten, Übungen, Fortschritt je
  Lernfortschritt L1 bis L5, letzte Aktivität, Zeitpunkt der Sicherung,
  Prüfsummenstatus.
- Zweite Tabelle: abgeschlossene Einheiten L1.1 bis L5.3 je Person.
- Filter nach Klasse; „nur neueste Sicherung je Person“ blendet ältere
  Sicherungen desselben Profils aus.
- Kennzahlen: Anzahl, Mittelwerte, Anzahl ungültiger Prüfsummen.
- CSV-Download (Semikolon, UTF-8 mit BOM, für Excel) und Druck.
- Abgelehnte Dateien werden mit Grund aufgeführt, nicht still übersprungen.

**Datenschutz und Grenzen**

- Die Dateien werden nur im Browserfenster gelesen. Die Seite schreibt nichts in
  den Browserspeicher und lädt nichts nach außen; ein Test prüft beides.
- XP werden aus den abgeschlossenen Einheiten und Aufgaben **neu berechnet**.
  Weicht der in der Datei genannte Wert ab, erscheint ein Warnzeichen.
- „verändert oder beschädigt“ bedeutet: Der Dateiinhalt passt nicht zur
  Prüfsumme. Das Verfahren ist öffentlich; wer die Datei gezielt fälscht und
  die Prüfsumme neu berechnet, wird nicht erkannt. Die Übersicht ersetzt die
  pädagogische Einordnung nicht (so auch Codex in `codex2claude.md`).
- CSV-Zellen, die mit `=`, `+`, `-` oder `@` beginnen, werden entschärft.

**Technik:** `teacher-overview.js` enthält die reine Logik (`summarize`,
`integrityStatus`, `markSuperseded`, `sortRows`, `toCsv`) und darunter die
Seitenanbindung. Die Seite lädt `content.js`, `learning-path.js` und
`practical-exercises.js`, um Einheiten und XP-Werte zu kennen; `app.js` wird
nicht geladen. Ein Test stellt sicher, dass `stableStringify` in beiden Dateien
gleich bleibt, sonst würden gültige Sicherungen als verändert gelten.

**Prüfung**

- 122 Node-Tests (7 neu) und 2 Python-Tests bestanden.
- Alle 24 Browsertests bestanden (Edge, Port 4199). Der neue
  `teacher-overview.browser.cjs` erzeugt über die Lernplattform eine echte
  Sicherung, stellt eine veränderte Kopie, eine fremde und eine defekte Datei
  daneben und prüft bei 1440 und 390 px: Zählung, Prüfsummenstatus, Matrix,
  Schutz vor doppeltem Einlesen, CSV, Dateiname mit HTML-Zeichen nur als Text,
  kein Browserspeicher, keine Anfragen an fremde Adressen, kein Überlauf.
- Nach dem Gesamtlauf wurde nur noch die Anzeige des Sicherungszeitpunkts auf
  deutsches Ortszeitformat umgestellt; `teacher-overview.browser.cjs` und die
  Node-Tests liefen danach erneut erfolgreich.
- Bildschirmfoto bei 1440 px im dunklen Modus gesichtet.
- Nicht geprüft: heller Modus der Lehrkraftseite, Ausdruck auf Papier, sehr
  große Klassen (über 40 Dateien), Sicherungen aus App-Versionen vor 0.20,
  Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im nächsten Eintrag.

### 0.12 Veröffentlichung 0.27.0 geprüft, Abschluss des Arbeitsblocks [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 46 | Commit `16b1508` gepusht; GitHub-Actions-Lauf 37889000050 | Job `test` und Job `deploy` erfolgreich |
| 47 | Live geprüft: `lehrkraft.html` antwortet mit 200, alle fünf Einbindungen tragen `?v=0.27.0`, `teacher-overview.js` wird ausgeliefert | per Abruf, ohne Dateien einzulesen |
| 48 | Tag `v0.27.0` gesetzt und gepusht | Sicherungspunkt |
| 49 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 50 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`), `v0.26.0`
(`8ed27fc`), `v0.26.1` (`b8c9b01`), `v0.26.2` (`40566ec`), `v0.27.0`
(`16b1508`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 122 Node-Tests, 2 Python-Tests, 24 Browsertests.

**Erledigt aus `claude2codex.md`:** OPT-01, OPT-02, OPT-08, OPT-13, OPT-19,
OPT-21 (Claude); OPT-10, OPT-11 (Codex); OPT-20 teilweise.

**Offen und warum Claude hier anhält**

| ID | Grund |
| --- | --- |
| OPT-06 Freischaltung lockern | didaktische Entscheidung von Jakob nötig |
| OPT-09 Bestätigung per Code | hängt von OPT-06 ab; Codex rät ab |
| OPT-12 Lösungen aus dem Quelltext | nur sinnvoll, wenn XP in die Bewertung einfließen (Entscheidung Jakob) |
| OPT-18 Erstbesuch ohne Profildialog | Codex hat den Profildialog am 8. Oktober gezielt überarbeitet; Änderung nur nach Absprache |
| OPT-15 Offline-Betrieb | ein Service Worker kann veraltete Stände ausliefern; braucht den Test an einem Schul-PC, den nur Jakob durchführen kann |
| OPT-05 Einheiten in Schritte teilen | greift in alle 21 Einheiten und in Codex' Abnahmetests ein; vorher Abstimmung mit Jakob und Codex |
| OPT-03, OPT-04, OPT-07 | neue Aufgabentypen, ERM-Editor, Klausurtraining: jeweils mehrere Sitzungen, Inhalte brauchen fachliche Freigabe |
| OPT-14, OPT-16, OPT-17 | Aufräumen von Dokumentation, `app.js`/`styles.css` und `.tmp/`: betrifft Codex' Dateien bzw. erfordert Löschfreigabe |

Nächste Handlungsnummer: 51.

### 0.13 Release 0.28.0: Aufgabentyp „Fehlersuche“ [Claude, 2026-10-09]

Bezug: OPT-03, Teil (a), aus `claude2codex.md`. Auftrag: eigenständige
Weiterarbeit. Die in Abschnitt 0.12 genannte Zurückhaltung bei OPT-03 hat
Claude für diesen Teil aufgegeben, weil er ohne Eingriff in vorhandene
Einheiten, Lernstand-Format oder Abnahmetests auskommt.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 51 | Commit `308c9f7` (Eintrag 0.12, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 52 | Claudes Merkzettel `codex-zusammenarbeit.md` um den Sicherungspunkt `v0.27.0` ergänzt | außerhalb des Repos, `C:\Users\PC\.claude\projects\G--Meine-Ablage-Codex-WorkbenchLab\memory\` |
| 53 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 54 | `practical-exercises.js`, `practiceKind`, `practiceCard`, `renderLessonExercises` und Zähl-Annahmen in den Tests gelesen | nur lesend |
| 55 | `debug-exercises.js` angelegt; `app.js`, `styles.css`, `index.html`, `lehrkraft.html`, `tools/build-site.cjs`, Versionsangaben, README angepasst | siehe unten |
| 56 | `tests/debug-exercises.test.js` (5 Node-Tests) und `tests/debug-exercises.browser.cjs` angelegt; in `tests/teacher-overview.test.js` die Zahl der Einbindungen von 5 auf 6 erhöht | |
| 57 | Testserver auf Port 4199 gestartet; alle Tests ausgeführt | siehe Prüfung |
| 58 | Ein Fehlversuch im Browsertest: Die Rückmeldung „Aufgabe gelöst“ steht im Reiter „Ergebnis“, nach „Lösung prüfen“ ist aber der Coach-Reiter aktiv; der Test wartet jetzt auf den Text statt auf die Sichtbarkeit | nur Testcode; Beobachtung siehe unten |

**Neu für Schülerinnen und Schüler**

Sechs Aufgaben, in denen eine vorgegebene Abfrage genau einen typischen Fehler
enthält. Erst ausführen, Meldung oder Ergebnis lesen, dann korrigieren.

| Aufgabe | Einheit | Fehler | Symptom |
| --- | --- | --- | --- |
| Eine Spalte fehlt | L1.5 | Komma zwischen zwei Spalten fehlt | läuft, aber nur zwei Spalten |
| Esslingen wird nicht gefunden | L1.6 | Textwert ohne Anführungszeichen | Meldung |
| Leeres Ergebnis | L1.6 | `AND` statt `OR` | läuft, aber keine Zeile |
| Gruppen filtern | L1.8 | `WHERE` statt `HAVING` | Meldung |
| Reihenfolge der Klauseln | L1.8 | `ORDER BY` vor `GROUP BY` | Meldung |
| Viel zu viele Zeilen | L2.4 | `JOIN` ohne `ON` | läuft, aber Kreuzprodukt |

- Je Aufgabe 20 XP, drei gestufte Hinweise, Coach und deutsche Meldungen wie
  bei den übrigen SQL-Aufgaben.
- Die Aufgaben erscheinen in den Übungslisten ihrer Einheiten und im SQL-Labor;
  dort gibt es den neuen Filter „Fehlersuche“. Sie tragen das Kennzeichen
  „Fehlersuche“ und ein eigenes Symbol.
- Freischaltung wie bei allen Übungen der jeweiligen Einheit.
- „Zurücksetzen“ stellt die fehlerhafte Ausgangsabfrage wieder her.

**Auswirkungen auf Bestehendes**

- Die Zahl der Übungen steigt von 43 auf 49. Erfolge, die „alle SQL-Aufgaben“
  oder „alle Übungen“ verlangen, setzen damit sechs Aufgaben mehr voraus. Wer
  einen solchen Erfolg bereits freigeschaltet hatte, sieht ihn wieder als
  offen, bis die neuen Aufgaben gelöst sind.
- Die erreichbaren XP steigen um 120.
- Das Lernstand-Format bleibt unverändert; ältere Sicherungen laden wie bisher.
- Die Aufgabenobjekte enthalten kein Feld `solution` (vgl. OPT-12). Das
  Sollergebnis wird wie bei allen Abfrageaufgaben aus `expectedSql` berechnet
  und steht damit weiterhin im Quelltext.

**Sichtbare Rückmeldung nach „Lösung prüfen“ (OPT-22, betrifft alle SQL-Aufgaben):**
Nach „Lösung prüfen“ wechselt die Ansicht auf den Coach-Reiter. Das Banner
„Aufgabe gelöst“ bzw. „Noch nicht ganz“ lag im Reiter „Ergebnis“ und war dann
verdeckt. Claude hat das Banner `#practiceResult` in `renderSqlPractice` über
die Reiter gesetzt und mit `role="status"` versehen. Texte, Farben und Logik
sind unverändert. Das ist eine Änderung an einem von Codex gebauten Bereich;
Rückbau bei Bedarf: die eine Zeile wieder in das Ergebnis-Panel verschieben.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 59 | Banner in `app.js` über die Reiter verschoben; Browsertest prüft jetzt Sichtbarkeit bei aktivem Coach-Reiter | alle Tests danach erneut ausgeführt |

**Technik:** `debug-exercises.js` hängt die Aufgaben mit `variant: "debug"` an
`content.practices` an; Prüfung, Speicherung und Export nutzen die vorhandenen
Wege für SQL-Aufgaben. In `app.js` vier kleine Stellen: `practiceKind`,
Symbol in `practiceCard`, Filter in `renderSql`, Hinweiskasten in
`renderSqlPractice`. Versionsangaben auf `0.28.0`.

**Prüfung**

- 127 Node-Tests (5 neu) und 2 Python-Tests bestanden. Die Node-Tests prüfen je
  Aufgabe, dass der Startcode das beschriebene Symptom zeigt, die Korrektur
  das Sollergebnis liefert und eine gleichwertige Lösung (`IN` statt `OR`)
  ebenfalls besteht.
- Alle 25 Browsertests bestanden (Edge, Port 4199), zweimal: vor und nach dem
  Verschieben des Banners. Der neue `debug-exercises.browser.cjs` prüft bei
  1440 und 390 px Filter, Kennzeichnung, beide Symptomarten, einmalige XP,
  Zurücksetzen, unveränderte Sperrlogik und das sichtbare Banner.
- Nicht geprüft: heller Modus der neuen Elemente (Hinweiskasten, Filter),
  Wirkung im Unterricht, Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im nächsten Eintrag.

### 0.14 Veröffentlichung 0.28.0 geprüft, Abschluss des Arbeitsblocks [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 60 | Commit `63aedc6` gepusht; GitHub-Actions-Lauf 37890098432 | Job `test` und Job `deploy` erfolgreich |
| 61 | Live-Seite im Browser geprüft: Version `0.28.0`, 49 Übungen, Filter „Fehlersuche“ zeigt sechs Karten mit Kennzeichnung, keine Konsolenfehler | nur lesend, kein Lernstand verändert |
| 62 | Tag `v0.28.0` gesetzt und gepusht | Sicherungspunkt |
| 63 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 64 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.28.0` und die Regel ergänzt, Merkzettel-Änderungen vor dem Abschlusseintrag vorzunehmen | außerhalb des Repos |
| 65 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`), `v0.26.0`
(`8ed27fc`), `v0.26.1` (`b8c9b01`), `v0.26.2` (`40566ec`), `v0.27.0`
(`16b1508`), `v0.28.0` (`63aedc6`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 127 Node-Tests, 2 Python-Tests, 25 Browsertests.

**Erledigt aus `claude2codex.md`:** OPT-01, OPT-02, OPT-08, OPT-13, OPT-19,
OPT-21, OPT-22 (Claude); OPT-10, OPT-11 (Codex); OPT-03 und OPT-20 teilweise.

**Als Nächstes vorgesehen (Claude arbeitet daran weiter, sofern Jakob nichts
anderes vorgibt):**

1. OPT-03 (c) „Ergebnis vorhersagen“ und (b) „Klauseln ordnen“ als weitere
   Aufgabentypen nach dem Muster der Fehlersuche.
2. OPT-07 Wiederholungsrunde aus bereits gelösten Aufgaben.
3. OPT-15 Checkliste für den Schul-PC-Test als Abschnitt in dieser Datei;
   der Offline-Betrieb selbst erst nach diesem Test.

Weiterhin auf Jakobs Entscheidung warten OPT-06, OPT-09 und OPT-12.

Nächste Handlungsnummer: 66.

### 0.15 Release 0.29.0: Aufgabentyp „Vorhersage“ [Claude, 2026-10-09]

Bezug: OPT-03, Teil (c), aus `claude2codex.md`. Auftrag: eigenständige
Weiterarbeit.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 66 | Commit `cdedc28` (Eintrag 0.14, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 67 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 68 | `renderChoicePractice`, `checkChoicePractice` und die Übungsdaten gelesen; Daten der Übungsdatenbanken per Einmal-Skript abgefragt, um die Antworten festzulegen | Skript nur im temporären Sitzungsordner |
| 69 | `predict-exercises.js` angelegt; `app.js`, `styles.css`, `index.html`, `lehrkraft.html`, `tools/build-site.cjs`, Versionsangaben, README angepasst | siehe unten |
| 70 | `tests/predict-exercises.test.js` (4 Node-Tests) und `tests/predict-exercises.browser.cjs` angelegt; in `tests/teacher-overview.test.js` die Zahl der Einbindungen von 6 auf 7 erhöht | |
| 71 | Testserver auf Port 4199 gestartet; alle Tests ausgeführt; Bildschirmfoto gesichtet | siehe Prüfung |
| 72 | Ein Fehlversuch im Browsertest: Die Überschriftenzeile wird per CSS in Großbuchstaben gezeigt; der Test vergleicht jetzt den Text statt der Darstellung | nur Testcode |
| 73 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.29.0` ergänzt | außerhalb des Repos, vor diesem Eintrag |
| 74 | Checkliste für den Schul-PC-Test geschrieben | Abschnitt 0.16 |

**Neu für Schülerinnen und Schüler**

Fünf Aufgaben, in denen eine fertige Abfrage gezeigt wird. Die Lernenden
bestimmen das Ergebnis im Kopf und wählen eine Antwort. Es gibt keinen Editor.

| Aufgabe | Einheit | Fragen |
| --- | --- | --- |
| Wer steht oben? | L1.5 | erste Zeile bei `ORDER BY … DESC`; Zeilenzahl |
| Zwei Bedingungen | L1.6 | Zeilenzahl bei `WHERE … AND …` |
| DISTINCT | L1.7 | Zeilenzahl; wie oft erscheint ein Wert |
| Gruppen und HAVING | L1.8 | Zeilenzahl nach `HAVING`; erste Zeile |
| JOIN mit und ohne ON | L2.4 | Zeilenzahl mit `ON`; Zeilenzahl des Kreuzprodukts |

- Der Tabelleninhalt lässt sich aufklappen.
- Bei falscher Antwort erscheint eine Denkhilfe („Klausel für Klausel“), das
  Ergebnis bleibt verborgen.
- Bei richtiger Antwort erscheinen eine fachliche Erklärung und das
  tatsächliche Ergebnis der Abfrage als Tabelle.
- Je Aufgabe 15 XP. Freischaltung wie bei allen Übungen der Einheit.
- Die Aufgaben stehen im SQL-Labor (neuer Filter „Vorhersage“) und in den
  Übungslisten ihrer Einheiten, nicht unter „Modellieren“.

**Auswirkungen auf Bestehendes**

- Die Zahl der Übungen steigt von 49 auf 54, die erreichbaren XP um 75.
- Der Erfolg „alle Übungen“ setzt fünf Aufgaben mehr voraus. Erfolge, die
  SQL-Aufgaben zählen, sind nicht betroffen: Vorhersagen sind technisch
  Auswahlaufgaben und zählen dort nicht mit.
- Im SQL-Labor stehen jetzt neben Schreibaufgaben auch Auswahlaufgaben; die
  Seite „Modellieren“ listet weiterhin nur Modell- und Begriffsaufgaben.
- Lernstand-Format unverändert.

**Technik:** `predict-exercises.js` hängt Auswahlaufgaben mit
`variant: "predict"` und den Zusatzfeldern `sql`, `schema`, `preview` an.
Jede Frage trägt ein `verifySql`; ein Node-Test führt es aus und vergleicht das
Ergebnis mit der als richtig markierten Antwort, sodass sich Daten und
Antworten nicht unbemerkt auseinanderentwickeln. In `app.js`: `isSqlTopic`,
`loadPredictTables`, `showPredictResult` sowie Ergänzungen in `practiceKind`,
`practiceCard`, `renderSql`, `renderModeling`, `renderPractice`,
`renderChoicePractice` und `checkChoicePractice`. Versionsangaben auf `0.29.0`.

**Prüfung**

- 131 Node-Tests (4 neu) und 2 Python-Tests bestanden. Ein Node-Test führt zu
  jeder Frage das zugehörige `verifySql` aus und vergleicht es mit der als
  richtig markierten Antwort.
- Alle 26 Browsertests bestanden (Edge, Port 4199). Der neue
  `predict-exercises.browser.cjs` prüft bei 1440 und 390 px: Filter, Einordnung
  im SQL-Labor statt unter „Modellieren“, Tabellenvorschau, Denkhilfe bei
  falscher Antwort ohne Ergebnis, Erklärung und echtes Ergebnis bei richtiger
  Antwort, einmalige XP, Aufgabe mit zwei Fragen, unveränderte Sperrlogik.
- Bildschirmfoto bei 1440 px im dunklen Modus gesichtet.
- Nicht geprüft: heller Modus der neuen Elemente, Wirkung im Unterricht,
  Schul-PCs. Die Checkliste in 0.16 ist ungetestet geschrieben; Menünamen und
  Port stammen aus den vorhandenen Texten der Lernplattform.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.17.

### 0.16 Checkliste für den Test an einem Schul-PC [Claude, 2026-10-09]

Bezug: OPT-15, erster Teil. Diese Prüfung kann nur vor Ort erfolgen; sie ist
seit Release 0.22.0 als offen vermerkt. Ergebnisse bitte hier eintragen
(Jakob oder Codex), dann kann der Offline-Betrieb gezielt umgesetzt werden.

Geprüft am: ________ · Raum/PC: ________ · Browser und Version: ________

**A. Lernplattform im Schulnetz**

| Nr. | Schritt | Erwartung | Ergebnis |
| ---: | --- | --- | --- |
| A1 | <https://jakobsawazki.github.io/WorkbenchLab/> öffnen | Seite lädt ohne Filter- oder Zertifikatsmeldung | |
| A2 | Datenbanksymbol oben rechts ansehen | grüner Punkt, „SQL ist bereit“ (sonst blockiert das Netz `.wasm`-Dateien) | |
| A3 | SQL-Labor → „Frei ausprobieren“ → „Ausführen“ | Tabelle mit 11 Zeilen | |
| A4 | Kürzel und Klasse eintragen, Seite neu laden | Angaben bleiben erhalten (sonst löscht der PC den Browserspeicher) | |
| A5 | PC ab- und wieder anmelden, Seite öffnen | Angaben noch vorhanden? Wenn nein: JSON-Sicherung ist Pflicht am Stundenende | |
| A6 | Diskettensymbol → „Speichern“ | JSON-Datei landet in einem für Lernende erreichbaren Ordner | |
| A7 | Diskettensymbol → „Laden“ mit dieser Datei | Lernstand wird übernommen | |
| A8 | In einer Einheit das Druckersymbol wählen | Druckvorschau hell, alle Abschnitte geöffnet | |
| A9 | Video der Startanleitung unter „Nachschlagen“ starten | spielt mit Untertiteln | |
| A10 | Seite bei getrennter Netzverbindung neu laden | derzeit erwartet: lädt nicht (Grundlage für die Entscheidung über den Offline-Betrieb) | |

**B. Informatik-Stick und MySQL Workbench**

| Nr. | Schritt | Erwartung | Ergebnis |
| ---: | --- | --- | --- |
| B1 | Stick starten, „MySQL starten“ | Konsole zeigt `ready for connections` | |
| B2 | Workbench öffnen; Version notieren | Schule: 6.3.10 erwartet | |
| B3 | Verbindung `127.0.0.1`, Port laut Startanleitung (üblich 3306), Benutzer `root` testen | Verbindung erfolgreich | |
| B4 | `SELECT VERSION();` ausführen | MariaDB-Version wird angezeigt; notieren | |
| B5 | `assets/sql/l1-1-workbench-einstieg.sql` über die Lernplattform laden und in Workbench ausführen | läuft ohne Fehler | |
| B6 | Ein EER-Modell anlegen, als `.mwb` speichern, schließen, wieder öffnen | Modell unverändert | |
| B7 | Forward Engineering bzw. Synchronisierung aus L1.4 durchführen | Schema entsteht | |
| B8 | Eine Abfrage aus dem freien SQL-Labor unverändert in Workbench ausführen | gleiches Ergebnis; Abweichungen notieren | |

**C. Klassenübersicht**

| Nr. | Schritt | Erwartung | Ergebnis |
| ---: | --- | --- | --- |
| C1 | <https://jakobsawazki.github.io/WorkbenchLab/lehrkraft.html> öffnen | Seite lädt | |
| C2 | Zwei bis drei echte Sicherungen einlesen | Zeilen erscheinen, Prüfsumme „gültig“ | |
| C3 | CSV herunterladen und in Excel öffnen | Umlaute korrekt, Spalten getrennt | |

**Auswertung für den Offline-Betrieb:** Scheitert A2, braucht die Schule eine
Freigabe für `.wasm`. Scheitert A4 oder A5, muss die JSON-Sicherung im
Unterrichtsablauf fest verankert werden. Zeigt A10, dass Netzausfälle im
Unterricht realistisch sind, lohnt ein Zwischenspeicher (Service Worker); er
wird dann mit Versionsprüfung umgesetzt, damit keine veralteten Stände
ausgeliefert werden.

### 0.17 Veröffentlichung 0.29.0 geprüft, Stand der Arbeit [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 75 | Commit `509b65a` gepusht; GitHub-Actions-Lauf 37890833643 | Job `test` und Job `deploy` erfolgreich |
| 76 | Live-Seite im Browser geprüft: Version `0.29.0`, 54 Übungen, Filter „Vorhersage“ zeigt fünf Karten, keine Konsolenfehler | nur lesend, kein Lernstand verändert |
| 77 | Tag `v0.29.0` gesetzt und gepusht | Sicherungspunkt |
| 78 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 79 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`), `v0.26.0`
(`8ed27fc`), `v0.26.1` (`b8c9b01`), `v0.26.2` (`40566ec`), `v0.27.0`
(`16b1508`), `v0.28.0` (`63aedc6`), `v0.29.0` (`509b65a`). Wiederherstellung
wie in Abschnitt 0.1.

**Testumfang:** 131 Node-Tests, 2 Python-Tests, 26 Browsertests.

**Stand der Punkte aus `claude2codex.md`**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-08, OPT-13, OPT-19, OPT-21, OPT-22 |
| erledigt (Codex) | OPT-10, OPT-11 |
| teilweise | OPT-03 (Fehlersuche und Vorhersage fertig; „Klauseln ordnen“ offen), OPT-15 (Checkliste fertig; Test vor Ort und Offline-Betrieb offen), OPT-20 |
| wartet auf Jakob | OPT-06, OPT-09, OPT-12, Durchführung der Checkliste 0.16, Freigabe zum Leeren von `.tmp/` (OPT-17) |
| offen, ohne Hindernis | OPT-04, OPT-05, OPT-07, OPT-14, OPT-16, OPT-18 |

Nächste Handlungsnummer: 80.

### 0.18 Release 0.30.0: Aufgabentyp „Klauseln ordnen“ [Claude, 2026-10-09]

Bezug: OPT-03, Teil (b), aus `claude2codex.md`. Damit ist OPT-03 vollständig.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 80 | Commit `ff11cf5` (Eintrag 0.17, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 81 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 82 | Verteilung der Aufgabentypen in `renderPractice` und die Formularbehandlung gelesen | nur lesend |
| 83 | `order-exercises.js` angelegt; `app.js`, `styles.css`, `index.html`, `lehrkraft.html`, `tools/build-site.cjs`, Versionsangaben, README angepasst | siehe unten |
| 84 | `tests/order-exercises.test.js` (3 Node-Tests) und `tests/order-exercises.browser.cjs` angelegt; in `tests/teacher-overview.test.js` die Zahl der Einbindungen von 7 auf 8 erhöht | |
| 85 | Der eigene Node-Test fand einen Inhaltsfehler: In drei der vier Aufgaben stand je eine Zeile schon zu Beginn an der richtigen Stelle. Startreihenfolgen korrigiert | vor Veröffentlichung behoben |
| 86 | Testserver auf Port 4199 gestartet; alle Tests ausgeführt; Bildschirmfoto bei 390 px gesichtet | siehe Prüfung |
| 87 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.30.0` ergänzt | außerhalb des Repos, vor diesem Eintrag |

**Neu für Schülerinnen und Schüler**

Vier Aufgaben, in denen die Zeilen einer Abfrage durcheinanderstehen und mit
Pfeilschaltflächen in die richtige Reihenfolge gebracht werden.

| Aufgabe | Einheit | Klauseln |
| --- | --- | --- |
| Filtern und sortieren | L1.6 | `SELECT`, `FROM`, `WHERE`, `ORDER BY` |
| Gruppieren und Gruppen filtern | L1.8 | zusätzlich `GROUP BY`, `HAVING` |
| Erst filtern, dann gruppieren | L1.8 | `WHERE` vor `GROUP BY` |
| JOIN einbauen | L2.4 | `JOIN … ON` hinter `FROM` |

- Bedienung mit Maus, Touch und Tastatur. Es gibt bewusst kein Ziehen mit der
  Maus: Schaltflächen funktionieren auf allen Geräten gleich und sind für
  Bildschirmleser ansagbar. Jede Verschiebung wird angesagt, der Fokus bleibt
  auf der verschobenen Zeile.
- Bei falscher Reihenfolge erscheint die feste Klauselreihenfolge als Hinweis.
- Bei richtiger Reihenfolge erscheinen eine Erklärung und das Ergebnis der
  ausgeführten Abfrage.
- Je Aufgabe 15 XP. Freischaltung wie bei allen Übungen der Einheit.
- Die Aufgaben stehen im SQL-Labor (neuer Filter „Klauseln ordnen“) und in den
  Übungslisten ihrer Einheiten.
- Die Anordnung wird nicht gespeichert: Beim erneuten Öffnen beginnt die
  Aufgabe wieder durcheinander. Der Abschluss selbst bleibt gespeichert.

**Auswirkungen auf Bestehendes**

- Die Zahl der Übungen steigt von 54 auf 58, die erreichbaren XP um 60.
- Der Erfolg „alle Übungen“ setzt vier Aufgaben mehr voraus. Erfolge, die
  SQL-Aufgaben zählen, sind nicht betroffen.
- Neuer Aufgabentyp `type: "order"`. Ältere App-Versionen kennen ihn nicht;
  beim Laden einer neueren Sicherung in einer älteren Version würden die
  Abschlüsse dieser Aufgaben verworfen. Das Sicherungsformat selbst ist
  unverändert.

**Technik:** `order-exercises.js` liefert je Aufgabe `lines` (richtige
Reihenfolge) und `start` (Anfangsreihenfolge). Ein Node-Test probiert je
Aufgabe alle Anordnungen aus und stellt sicher, dass nur die vorgesehene
ausführbar ist und dass anfangs keine Zeile richtig steht. In `app.js`:
`renderOrderPractice`, `updateOrderControls`, `moveOrderLine`,
`checkOrderPractice` sowie Ergänzungen in `isSqlTopic`, `practiceKind`,
`practiceCard`, `renderSql` und `renderPractice`. Die Ergebnisanzeige nutzt
`showPredictResult` aus 0.29.0. Versionsangaben auf `0.30.0`.

**Prüfung**

- 134 Node-Tests (3 neu) und 2 Python-Tests bestanden.
- Alle 27 Browsertests bestanden (Edge, Port 4199). Der neue
  `order-exercises.browser.cjs` prüft bei 1440 und 390 px: Filter, gesperrte
  Randschaltflächen, Verschieben per Tastatur mit Fokus und Ansage, Hinweis bei
  falscher Reihenfolge, Erklärung und ausgeführtes Ergebnis bei richtiger,
  einmalige XP, Neustart nach Neuladen, unveränderte Sperrlogik.
- Bildschirmfoto bei 390 px im dunklen Modus gesichtet.
- Nicht geprüft: heller Modus, echter Bildschirmleser (nur die ARIA-Angaben
  wurden geprüft), Touch-Bedienung auf einem echten Gerät, Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.19.

### 0.19 Veröffentlichung 0.30.0 geprüft, Stand der Arbeit [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 88 | Commit `cd35469` gepusht; GitHub-Actions-Lauf 37891597396 | Job `test` und Job `deploy` erfolgreich |
| 89 | Live-Seite im Browser geprüft: Version `0.30.0`, 58 Übungen, Filter „Klauseln ordnen“ zeigt vier Karten, keine Konsolenfehler | nur lesend, kein Lernstand verändert |
| 90 | Tag `v0.30.0` gesetzt und gepusht | Sicherungspunkt |
| 91 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 92 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`), `v0.26.0`
(`8ed27fc`), `v0.26.1` (`b8c9b01`), `v0.26.2` (`40566ec`), `v0.27.0`
(`16b1508`), `v0.28.0` (`63aedc6`), `v0.29.0` (`509b65a`), `v0.30.0`
(`cd35469`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 134 Node-Tests, 2 Python-Tests, 27 Browsertests.

**Stand der Punkte aus `claude2codex.md`**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-03, OPT-08, OPT-13, OPT-19, OPT-21, OPT-22 |
| erledigt (Codex) | OPT-10, OPT-11 |
| teilweise | OPT-15 (Checkliste fertig; Test vor Ort und Offline-Betrieb offen), OPT-20 |
| wartet auf Jakob | OPT-06, OPT-09, OPT-12, Durchführung der Checkliste 0.16, Freigabe zum Leeren von `.tmp/` (OPT-17) |
| offen | OPT-04, OPT-05, OPT-07, OPT-14, OPT-16, OPT-18 |

Nächste Handlungsnummer: 93.

### 0.20 Release 0.31.0: Wiederholungsrunde [Claude, 2026-10-09]

Bezug: OPT-07 aus `claude2codex.md`, erster Teil (tägliche Wiederholung). Der
dort ebenfalls genannte Klausurmodus mit Zeitanzeige ist nicht umgesetzt.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 93 | Commit `1670774` (Eintrag 0.19, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 94 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 95 | `award`, `todayKey`, `markActivity` und den Einstiegsbereich des SQL-Labors gelesen | nur lesend |
| 96 | `review.js` angelegt; `app.js`, `styles.css`, `index.html`, `tools/build-site.cjs`, Versionsangaben, README angepasst | siehe unten |
| 97 | Entwurfsfehler vor dem ersten Test bemerkt und behoben: Die Tagesauswahl hing von der Menge der gelösten Aufgaben ab und hätte sich geändert, sobald am selben Tag eine neue Aufgabe gelöst wird. Die Auswahl wird jetzt beim ersten Aufruf des Tages festgehalten | `readReviewDay`, `writeReviewDay`, `reviewPicks` |
| 98 | `tests/review.test.js` (5 Node-Tests) und `tests/review.browser.cjs` angelegt | |
| 99 | Ein Fehlversuch im Browsertest: Der Test fügte selbst eine gelöste Aufgabe ein und verglich danach mit dem alten XP-Stand; Vergleichswert wird jetzt danach gelesen | nur Testcode |
| 100 | Testserver auf Port 4199 gestartet; alle Tests ausgeführt; Bildschirmfoto bei 1440 px gesichtet | siehe Prüfung |
| 101 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.31.0` ergänzt | außerhalb des Repos, vor diesem Eintrag |

**Neu für Schülerinnen und Schüler**

- Im SQL-Labor erscheint unter dem freien Labor der Abschnitt
  „Wiederholungsrunde“, sobald mindestens eine SQL-Aufgabe gelöst ist.
- Die Runde stellt je Tag bis zu fünf **bereits gelöste** Aufgaben zusammen,
  bevorzugt aus verschiedenen Einheiten. Die Auswahl ist für den Tag fest und
  wechselt am nächsten Tag.
- Wer eine Aufgabe der Runde erneut besteht, sieht sie als „heute wiederholt“.
  Aus der Aufgabe führt eine Schaltfläche zurück in die Runde.
- Es gibt keine XP. Jede Wiederholung zählt als Aktivität für den Tag und
  erhält damit die Aktivitätsserie.
- Sind alle Aufgaben wiederholt, erscheint „Runde geschafft“.
- In die Runde kommen Schreibaufgaben, Fehlersuche, Vorhersage und Klauseln
  ordnen. Modell- und Begriffsaufgaben sind nicht enthalten.

**Speicherung und Grenzen**

- Tagesauswahl und Tagesfortschritt liegen unter dem eigenen Schlüssel
  `workbenchlab-review-v1` im Browserspeicher. Sie sind **nicht** Teil des
  Lernstands und der JSON-Sicherung; nach einem Gerätewechsel beginnt die Runde
  des Tages neu. Die Aktivitätstage selbst stehen im Lernstand.
- Die Runde merkt sich nicht, wann eine Aufgabe zuletzt wiederholt wurde. Die
  Auswahl ist zufällig je Tag, nicht nach Vergessenskurve gewichtet.
- Bei Aufgaben ohne Editor (Vorhersage, Klauseln ordnen) lässt sich die
  Wiederholung durch erneutes Anklicken der bekannten Antwort schnell
  erledigen; das ist als Auffrischung gedacht, nicht als Leistungsnachweis.

**Technik:** `review.js` enthält nur `pick(candidates, seedText, count)`:
Zufall aus einem festen Startwert (Tag und Profil-ID), ohne `Math.random` und
ohne Uhrzeit, damit die Auswahl prüfbar ist. In `app.js`: `readReviewDay`,
`writeReviewDay`, `reviewPicks`, `reviewedToday`, `markReviewed`,
`reviewTeaserHtml`, `renderReview`, Route `sql/wiederholen`, ein Aufruf in
`award` (nur bei bereits gelösten Aufgaben) und die Rücksprung-Schaltfläche in
`renderPracticeHeader`. Versionsangaben auf `0.31.0`. `lehrkraft.html` lädt
`review.js` nicht.

**Prüfung**

- 139 Node-Tests (5 neu) und 2 Python-Tests bestanden. Die Node-Tests prüfen:
  gleiche Auswahl für gleichen Tag und gleiches Profil, wechselnde Auswahl an
  14 Folgetagen, Bevorzugung verschiedener Einheiten, kleine und leere Mengen,
  und dass über 40 Tage jede Aufgabe einmal vorkommt.
- Alle 28 Browsertests bestanden (Edge, Port 4199). Der neue
  `review.browser.cjs` prüft bei 1440 und 390 px: Einstieg, fünf feste
  Tagesaufgaben auch nach Neuladen und neu gelöster Aufgabe, Rückweg, Zählung je
  wiederholter Aufgabe für alle vier SQL-Aufgabentypen, keine XP,
  Aktivitätstag, Bestand nach Neuladen, kein Eintrag im Lernstand, Leerzustand.
- Bildschirmfoto bei 1440 px im dunklen Modus gesichtet.
- Nicht geprüft: Tageswechsel um Mitternacht in einem geöffneten Fenster (die
  Logik liest das Datum bei jedem Aufruf neu, ein Test dazu fehlt), heller
  Modus, Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.21.

### 0.21 Veröffentlichung 0.31.0 geprüft, Stand der Arbeit [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 102 | Commit `1a1e2c0` gepusht; GitHub-Actions-Lauf 37892402735 | Job `test` und Job `deploy` erfolgreich |
| 103 | Live-Seite im Browser geprüft: Version `0.31.0`, `#sql/wiederholen` öffnet die Wiederholungsrunde und zeigt ohne gelöste Aufgaben den Leerzustand, keine Konsolenfehler | nur lesend, kein Lernstand verändert |
| 104 | Tag `v0.31.0` gesetzt und gepusht | Sicherungspunkt |
| 105 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 106 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`), `v0.26.0`
(`8ed27fc`), `v0.26.1` (`b8c9b01`), `v0.26.2` (`40566ec`), `v0.27.0`
(`16b1508`), `v0.28.0` (`63aedc6`), `v0.29.0` (`509b65a`), `v0.30.0`
(`cd35469`), `v0.31.0` (`1a1e2c0`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 139 Node-Tests, 2 Python-Tests, 28 Browsertests.

**Stand der Punkte aus `claude2codex.md`**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-03, OPT-08, OPT-13, OPT-19, OPT-21, OPT-22 |
| erledigt (Codex) | OPT-10, OPT-11 |
| teilweise | OPT-07 (Wiederholungsrunde fertig; Klausurmodus offen), OPT-15 (Checkliste fertig; Test vor Ort und Offline-Betrieb offen), OPT-20 |
| wartet auf Jakob | OPT-06, OPT-09, OPT-12, Durchführung der Checkliste 0.16, Freigabe zum Leeren von `.tmp/` (OPT-17) |
| offen | OPT-04, OPT-05, OPT-14, OPT-16, OPT-18 |

Nächste Handlungsnummer: 107.

### 0.22 Release 0.32.0: Modell-Editor [Claude, 2026-10-09]

Bezug: OPT-04 aus `claude2codex.md`, erste Ausbaustufe.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 107 | Commit `3240fad` (Eintrag 0.21, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 108 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 109 | `renderModeling`, Routenverteilung und `downloadBlob` gelesen | nur lesend |
| 110 | `erm-editor.js` angelegt (Logik und Seitenanbindung in einer Datei); in `app.js` nur `renderModelEditor`, die Route `modeling/editor` und ein Einstiegsabschnitt auf „Modellieren“; `styles.css`, `index.html`, `tools/build-site.cjs`, Versionsangaben, README | siehe unten |
| 111 | `tests/erm-editor.test.js` (7 Node-Tests) und `tests/erm-editor.browser.cjs` angelegt | |
| 112 | Der Node-Test fand eine Unsauberkeit: abgelehnte Beziehungen verbrauchten trotzdem Nummern; behoben | vor Veröffentlichung |
| 113 | Der Browsertest fand einen Bedienfehler: Nach dem Umbenennen eines Entitätstyps wurde neu gezeichnet und der Fokus sprang aus dem nächsten Feld zurück. Jetzt werden nur die Auswahllisten der Beziehungen nachgeführt | vor Veröffentlichung |
| 114 | Testserver auf Port 4199 gestartet; alle Tests ausgeführt; Bildschirmfoto bei 1440 px gesichtet | siehe Prüfung |
| 115 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.32.0` ergänzt | außerhalb des Repos, vor diesem Eintrag |

**Neu für Schülerinnen und Schüler**

Unter „Modellieren“ führt der neue Abschnitt „Modell-Editor“ zu
`#modeling/editor`. Ohne Freischaltung, ohne XP.

- **Bauen:** Entitätstypen anlegen und benennen; Attribute mit Datentyp
  (`INT`, `VARCHAR(50)`, `DATE`, `DOUBLE`, `BOOLEAN`) sowie Kennzeichen PK und
  FK; Beziehungen zwischen zwei Entitätstypen mit Kardinalität `1:N`, `N:1`,
  `1:1` oder `M:N`. Alles über Formularfelder, mit Tastatur bedienbar.
- **Sehen:** Das Diagramm entsteht automatisch: Kästen mit Attributen,
  unterstrichene Primärschlüssel, Linien mit Kardinalitäten an beiden Enden.
- **Prüfen:** Zwei Aufgaben mit Rückmeldung je Abweichung:
  - L2.1 Fahrschüler und Wohnorte (1:N)
  - L3.1 Fahrradvermietung (M:N über Beziehungsentität auflösen)

  Geprüft werden: vorhandene Entitätstypen (mit mehreren zulässigen
  Schreibweisen), genau ein Primärschlüssel, Fremdschlüssel auf der richtigen
  Seite, Richtung der Kardinalität, eine direkte M:N-Beziehung und überzählige
  Beziehungen. Dazu ein „Freies Modell“ ohne Prüfung.
- **Mitnehmen:** „SQL für Workbench“ lädt `CREATE TABLE`-Anweisungen mit
  `PRIMARY KEY` und `FOREIGN KEY … REFERENCES` herunter, in einer Reihenfolge,
  in der referenzierte Tabellen zuerst entstehen.

**Grenzen dieser Ausbaustufe**

- Kein freies Verschieben der Kästen; die Anordnung ist automatisch (bis zu
  acht Entitätstypen, je bis zu zwölf Attribute).
- Keine Optionalität (0 oder 1), keine Rollen, keine zusammengesetzten
  Schlüssel in der Prüfung, kein Bildexport.
- Attributnamen werden nicht fachlich geprüft, nur Schlüssel und Struktur.
  Ein Modell kann die Prüfung bestehen und trotzdem unpassende Attribute
  enthalten.
- Entwürfe liegen unter dem eigenen Schlüssel `workbenchlab-erm-v1` im
  Browserspeicher, je Aufgabe einer. Sie sind **nicht** Teil der
  JSON-Sicherung; der SQL-Export ist der Weg, ein Modell mitzunehmen.
- Das exportierte SQL ist ein Ausgangspunkt. In MySQL Workbench entsteht
  daraus per Reverse Engineering ein EER-Diagramm; das hat Claude nicht an
  einer echten Workbench geprüft.

**Technik:** `erm-editor.js` stellt `window.WORKBENCH_ERM` bereit: `sanitize`,
`checkModel`, `toSql`, `layout`, `identifier`, `norm`, die Aufgabenliste
`TASKS` und `mount`. Der Editor behandelt seine Ereignisse selbst und greift
nur ein, wenn `#ermEditor` vorhanden ist. Bezeichner für das SQL werden auf
Kleinbuchstaben, Ziffern und Unterstrich reduziert. Versionsangaben auf
`0.32.0`. `lehrkraft.html` lädt die Datei nicht.

**Prüfung**

- 146 Node-Tests (7 neu) und 2 Python-Tests bestanden. Die Node-Tests prüfen
  beide Aufgaben mit richtigem Modell und je typischem Fehler, führen das
  exportierte SQL in der Browser-Datenbank aus (Schlüssel, Verweise,
  Reihenfolge), bereinigen beschädigte gespeicherte Modelle und stellen sicher,
  dass sich Kästen im Diagramm bei 1 bis 8 Entitätstypen nicht überlappen.
- Alle 29 Browsertests bestanden (Edge, Port 4199). Der neue
  `erm-editor.browser.cjs` baut bei 1440 und 390 px das 1:N-Modell per Tastatur,
  prüft Diagramm, Rückmeldungen, Bestehen, Ablehnung einer Selbstbeziehung,
  SQL-Export, Bestand nach Neuladen, getrennte Modelle je Aufgabe, Entfernen
  und Leeren.
- Bildschirmfoto bei 1440 px im dunklen Modus gesichtet.
- Nicht geprüft: die M:N-Aufgabe im Browser (nur in den Node-Tests), heller
  Modus, Import des exportierten SQL in eine echte MySQL Workbench, Touch auf
  einem echten Gerät, Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.23.

### 0.23 Veröffentlichung 0.32.0 geprüft; Prüfung des hellen Modus; Release 0.32.1 [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 116 | Commit `2d94902` gepusht; GitHub-Actions-Lauf 37893395355 | Job `test` und Job `deploy` erfolgreich |
| 117 | Live-Seite im Browser geprüft: Version `0.32.0`, `#modeling/editor` öffnet den Editor mit drei Aufgaben und Prüfschaltfläche, keine Konsolenfehler | nur lesend |
| 118 | Tag `v0.32.0` gesetzt und gepusht; eigenen Testserver beendet | Sicherungspunkt |
| 119 | Testserver erneut auf Port 4199 gestartet. Mit einem Einmal-Skript alle seit 0.28.0 neuen Ansichten im **hellen Modus** bei 1280 px fotografiert (Fehlersuche, Vorhersage, Klauseln ordnen, Wiederholungsrunde, Modell-Editor, Klassenübersicht) und den Textkontrast gegen den Hintergrund gemessen | Skript und Bilder nur im temporären Sitzungsordner |
| 120 | Ergebnis: keine Textstelle unter 4,5 : 1. Die Messung meldete nur die grünen Hauptschaltflächen; das ist ein Messfehler des Skripts (es erkennt Farbverläufe nicht), die Schaltflächen zeigen weiße Schrift auf dunklem Grün. Zwei Bilder (Modell-Editor, Klauseln ordnen) gesichtet: lesbar und vollständig | damit ist der bisher offene Punkt „heller Modus nicht geprüft“ für diese Ansichten erledigt |
| 121 | Dabei gefunden: Im Modell-Editor wurde `VARCHAR(50)` in der Datentyp-Auswahl bei mittlerer Breite abgeschnitten. Spaltenbreite in `styles.css` korrigiert; Versionsangaben auf `0.32.1` | Release 0.32.1 |
| 122 | Alle Tests erneut ausgeführt | siehe Prüfung |
| 123 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.32.1` ergänzt | außerhalb des Repos, vor diesem Eintrag |

**Prüfung 0.32.1**

- 146 Node-Tests und 2 Python-Tests bestanden; alle 29 Browsertests bestanden
  (Edge, Port 4199).
- Bild des Modell-Editors im hellen Modus bei 1280 px nach der Korrektur
  gesichtet: `VARCHAR(50)` ist vollständig lesbar.
- Nicht geprüft: Schul-PCs, echte MySQL Workbench, Touch auf einem echten
  Gerät, echter Bildschirmleser.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.24.

### 0.24 Veröffentlichung 0.32.1 geprüft; Übergabe an Jakob und Codex [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 124 | Commit `ec2e022` gepusht; GitHub-Actions-Lauf 37893968996 | Job `test` und Job `deploy` erfolgreich |
| 125 | Live geprüft: alle Dateien mit `?v=0.32.1`, `styles.css` enthält die korrigierte Spaltenbreite | per Abruf |
| 126 | Tag `v0.32.1` gesetzt und gepusht | Sicherungspunkt |
| 127 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 128 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`), `v0.26.0`
(`8ed27fc`), `v0.26.1` (`b8c9b01`), `v0.26.2` (`40566ec`), `v0.27.0`
(`16b1508`), `v0.28.0` (`63aedc6`), `v0.29.0` (`509b65a`), `v0.30.0`
(`cd35469`), `v0.31.0` (`1a1e2c0`), `v0.32.0` (`2d94902`), `v0.32.1`
(`ec2e022`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 146 Node-Tests, 2 Python-Tests, 29 Browsertests.

**Was am 9. Oktober hinzukam (Überblick für die Abnahme)**

| Version | Inhalt | Wo zu finden |
| --- | --- | --- |
| 0.26.0 | freies SQL-Labor, deutsche SQL-Meldungen | SQL-Labor → „Frei ausprobieren“ |
| 0.26.1 | Rettungskopie bei unlesbarem Lernstand | nur im Fehlerfall sichtbar |
| 0.26.2 | Druckansicht | Druckersymbol in jeder Einheit |
| 0.27.0 | Klassenübersicht | `lehrkraft.html` |
| 0.28.0 | Fehlersuche (6), Prüfergebnis über den Reitern | SQL-Labor → Filter „Fehlersuche“ |
| 0.29.0 | Vorhersage (5), Schul-PC-Checkliste | Filter „Vorhersage“; Abschnitt 0.16 |
| 0.30.0 | Klauseln ordnen (4) | Filter „Klauseln ordnen“ |
| 0.31.0 | Wiederholungsrunde | SQL-Labor → „Wiederholungsrunde“ |
| 0.32.0/0.32.1 | Modell-Editor | Modellieren → „Editor öffnen“ |

**Stand der Punkte aus `claude2codex.md`**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-03, OPT-08, OPT-13, OPT-19, OPT-21, OPT-22 |
| erledigt (Codex) | OPT-10, OPT-11 |
| erste Stufe erledigt | OPT-04 (Modell-Editor), OPT-07 (Wiederholungsrunde), OPT-15 (Checkliste), OPT-20 |
| braucht eine Entscheidung von Jakob | OPT-06, OPT-09, OPT-12, OPT-17, OPT-18; Durchführung der Checkliste 0.16 |
| braucht Abstimmung mit Codex | OPT-05, OPT-14, OPT-16 |

**Warum Claude die restlichen Punkte nicht eigenständig umsetzt**

- OPT-05 (Einheiten in Schritte teilen) baut die Darstellung aller 21
  Einheiten um. Daran hängen viele der 20 von Codex geschriebenen Browser-Abnahmetests
  und die Abnahmedokumente; eine einseitige Änderung würde Codex' geprüften
  Stand entwerten.
- OPT-14 und OPT-16 (Dokumentation zusammenführen, `app.js`/`styles.css`
  aufteilen) verschieben und löschen Dateien, die Codex angelegt hat und auf
  die seine Arbeitsweise verweist.
- OPT-18 (Profildialog beim Erstbesuch) und OPT-06 (Freischaltung) sind
  bewusste didaktische Festlegungen; Codex hat den Profildialog am 8. Oktober
  auf Jakobs Wunsch mehrfach überarbeitet.
- OPT-12 und OPT-09 hängen an der Frage, ob XP in die Bewertung einfließen.
- OPT-17 verlangt das Löschen von rund 1 GB lokaler Dateien.

Seit dem 9. Oktober sind elf Versionen entstanden, die Jakob noch nicht gesehen
hat. Bevor weitere hinzukommen, ist eine Durchsicht im Unterrichtsblick
sinnvoller als weiterer Umfang: Die neuen Aufgaben und der Modell-Editor
enthalten fachliche Formulierungen, die die Lehrkraft freigeben sollte.

Nächste Handlungsnummer: 129.

### 0.25 Release 0.33.0: Bildexport und M:N-Browsertest im Modell-Editor [Claude, 2026-10-09]

Bezug: OPT-04, Folgearbeiten zu 0.32.0. Schließt zwei in 0.22 benannte Lücken.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 129 | Commit `e3a4fea` (Eintrag 0.24, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 130 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 131 | `erm-editor.js`: Schaltfläche „Diagramm als Bild“ und `diagramFile()`; Versionsangaben auf `0.33.0` | |
| 132 | `tests/erm-editor.browser.cjs` erweitert: Bildexport und M:N-Aufgabe (direkte M:N-Beziehung wird erklärt, aufgelöstes Modell besteht, drei Kästen, vier Kardinalitäten) | |
| 133 | Testserver auf Port 4199 gestartet; exportiertes Bild per Einmal-Skript dargestellt und gesichtet; alle Tests ausgeführt | Skript und Bild nur im temporären Sitzungsordner |
| 134 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.33.0` ergänzt | außerhalb des Repos, vor diesem Eintrag |

**Neu:** „Diagramm als Bild“ lädt das aktuelle Diagramm als SVG-Datei
(`workbenchlab-modell-<aufgabe>.svg`) herunter. Die Datei ist eigenständig:
Farben und Schriften sind fest eingetragen, sie lässt sich in Word, OneNote
oder einem Browser öffnen und verlustfrei vergrößern. Sie übernimmt die Farben
des gerade aktiven Farbmodus; für Ausdrucke empfiehlt sich der helle Modus.

**Prüfung**

- 146 Node-Tests und 2 Python-Tests bestanden; alle 29 Browsertests bestanden
  (Edge, Port 4199).
- Der erweiterte `erm-editor.browser.cjs` prüft bei 1440 und 390 px zusätzlich:
  SVG-Datei ist eigenständig (keine Klassen, keine Farbvariablen), lässt sich
  als Bild laden und enthält Namen und Schlüsselkennzeichen; M:N-Aufgabe im
  Browser mit falschem und richtigem Modell.
- Exportiertes Bild dargestellt und gesichtet: Kästen, Schlüssel, Linie und
  Kardinalitäten vollständig.
- Nicht geprüft: Einfügen der SVG-Datei in Word oder OneNote, Import des SQL in
  eine echte MySQL Workbench, Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.26.

### 0.26 Veröffentlichung 0.33.0 geprüft [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 135 | Commit `b1b2b80` gepusht; GitHub-Actions-Lauf 37894735612 | Job `test` und Job `deploy` erfolgreich |
| 136 | Live geprüft: alle Dateien mit `?v=0.33.0`, `erm-editor.js` enthält den Bildexport | per Abruf |
| 137 | Tag `v0.33.0` gesetzt und gepusht | Sicherungspunkt `b1b2b80` |
| 138 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 139 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

Sicherungspunkte, Übersicht der Versionen und der Stand der offenen Punkte
stehen in Abschnitt 0.24; hinzugekommen ist `v0.33.0`. Testumfang unverändert:
146 Node-Tests, 2 Python-Tests, 29 Browsertests.

Nächste Handlungsnummer: 140.

### 0.27 Übergabedatei und README aufgeräumt [Claude, 2026-10-09]

Bezug: OPT-14, soweit es Claudes eigene Texte betrifft. Keine Änderung an der
App, keine neue Version.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 140 | Commit `c3dd674` (Eintrag 0.26, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 141 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen; `codex2claude.md` seit `4dedae1` unverändert | vor Arbeitsbeginn |
| 142 | `claude2codex.md` vollständig neu gefasst | siehe unten |
| 143 | Die acht einzelnen Absätze, die Claude seit 0.26.0 an den Kopf der README gesetzt hatte, durch eine Tabelle ersetzt | `README.md`; Codex' Absätze darunter unverändert |
| 144 | Node-Tests ausgeführt (146 bestanden); Browsertests nicht erneut, da keine App-Datei geändert wurde | |
| 145 | Dieser Eintrag mit beiden Dateien als ein Commit gepusht | Deployment ohne App-Änderung |

**Warum die Übergabedatei neu gefasst wurde:** Die Fassung vom 8. Oktober
enthielt inzwischen falsche Aussagen (Deployment ohne Testlauf, keine
`package.json`, Reihenfolge-Tabelle mit erledigten Punkten) und kannte keine
der neuen Dateien. Die neue Fassung enthält:

- A1: Tabelle der Versionen 0.26.0 bis 0.33.0 mit Dateien.
- A2: die sechs Stellen, an denen Claude in Codex' Teile eingegriffen hat, zum
  Prüfen und Zurücknehmen.
- B: aktuelle Dateikarte mit Urheber, neue Routen und Speicher-Schlüssel,
  Befehle, zehn Regeln, darunter die beiden heute gelernten (Reihenfolge der
  Konstanten vor `loadState()`, Vergleich von Werten aus dem `vm`-Kontext).
- C: Statusübersicht aller 22 Punkte, die fünf Entscheidungen für Jakob, die
  offenen Punkte im Einzelnen und die bekannten Schwächen in Claudes Teilen.

Die OPT-IDs sind unverändert. Die frühere Fassung bleibt über den Git-Verlauf
abrufbar (`git show e3a4fea:claude2codex.md`).

**Nicht angefasst:** die übrigen Teile von OPT-14 (Release-Dateien verschieben,
`documentation.md` teilen, historische README-Abschnitte), weil sie Dateien
von Codex verschieben oder kürzen würden.

Nächste Handlungsnummer: 146.

### 0.28 Release 0.34.0: Klausurtraining [Claude, 2026-10-09]

Bezug: OPT-07, zweiter Teil. Damit ist OPT-07 vollständig.

**Vorbemerkung:** Claude hatte nach 0.33.0 angehalten und eine Durchsicht durch
Jakob empfohlen. Die automatische Prüfung des Auftrags wies darauf hin, dass
Klausurmodus und zweite Editor-Stufe nicht blockiert sind. Das stimmt; die
Empfehlung zur Durchsicht bleibt bestehen (siehe 0.24), ist aber kein
Hindernis. Claude hat deshalb weitergearbeitet.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 146 | Commit `12f235b` (Eintrag 0.27 mit Übergabedatei und README) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 147 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 148 | `review.js` um `examSummary` und `clock` ergänzt; in `app.js` Klausurtraining mit Route `sql/klausur`, Einstieg im SQL-Labor, Rücksprung aus der Aufgabe, ein Aufruf in `award`; `styles.css`; Versionsangaben auf `0.34.0`; README-Tabelle | siehe unten |
| 149 | `tests/review.test.js` um einen Test erweitert (jetzt 6); `tests/exam.browser.cjs` angelegt | |
| 150 | Drei Fehlversuche im Browsertest, alle im Testcode: der Lösungshelfer kannte Aufgaben zum Anlegen von Tabellen nicht; die Annahme „höchstens zwei Einheiten“ war falsch, weil auch L1.4 eine SQL-Aufgabe hat | nur Testcode |
| 151 | **Der Browsertest fand einen echten Darstellungsfehler:** In den Aufgabenlisten von Wiederholungsrunde und Klausurtraining schob ein langer Einheitenname die Seite bei 1440 px über den Rand. Der Fehler bestand seit 0.31.0 in der Wiederholungsrunde, trat dort aber nur bei bestimmten Aufgaben auf. Mit einem Einmal-Skript alle 15 Aufgabenkombinationen durchgeprüft, Ursache behoben (`.review-list` in `styles.css`) | Skript nur im temporären Sitzungsordner |
| 152 | Testserver auf Port 4199 gestartet; Browsertest dreimal hintereinander (zufällige Auswahl) und danach alle Tests ausgeführt; Bildschirmfoto gesichtet | siehe Prüfung |
| 153 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.34.0` ergänzt | außerhalb des Repos, vor diesem Eintrag |

**Neu für Schülerinnen und Schüler**

- Im SQL-Labor erscheint der Abschnitt „Klausurtraining“, sobald mindestens
  drei SQL-Aufgaben freigeschaltet sind.
- „Runde starten“ zieht fünf Aufgaben aus den **freigeschalteten** Einheiten,
  bevorzugt aus verschiedenen: Schreibaufgaben, Fehlersuche, Vorhersage,
  Klauseln ordnen. Jede Runde ist neu gemischt.
- Eine Uhr zählt 20 Minuten herunter. Nach Ablauf kann weitergearbeitet
  werden; später gelöste Aufgaben werden getrennt gezählt.
- „Jetzt auswerten“ zeigt: in der Zeit gelöste Aufgaben, benötigte Zeit, und je
  Einheit „x von y“ mit der Empfehlung „sicher“ oder einer Schaltfläche zur
  Einheit.
- Neu gelöste Aufgaben bringen wie gewohnt XP; die Runde selbst gibt keine.

**Bewusste Entscheidungen und Grenzen**

- Hinweise und SQL-Coach bleiben während der Runde verfügbar. Sie abzuschalten
  hätte einen Eingriff in Codex' Aufgabenansicht bedeutet; der Starttext sagt
  offen, dass die Lernenden selbst entscheiden.
- Die Zeit wird nicht erzwungen und lässt sich durch Schließen des Fensters
  nicht anhalten: Sie läuft ab dem Startzeitpunkt.
- Runde und Auswertung liegen unter `workbenchlab-exam-v1` im Browserspeicher,
  nicht im Lernstand und nicht in der JSON-Sicherung. Die Klassenübersicht
  sieht sie nicht.
- 20 Minuten und fünf Aufgaben sind fest eingestellt (`examMinutes`,
  `examSize` in `app.js`).
- Modell- und Begriffsaufgaben sind nicht enthalten.

**Prüfung**

- 147 Node-Tests (1 neu) und 2 Python-Tests bestanden.
- Browsertests (Edge, Port 4199): Der Rechner war während der Läufe stark
  ausgelastet; ein Gesamtlauf dauerte über 25 Minuten statt vier.
  - Erster Gesamtlauf: `backup-safety.browser.cjs` brach mit Zeitüberschreitung
    ab; einzeln wiederholt bestand er. Claude wertet das als Lastproblem, nicht
    als Fehler der Änderung.
  - Zweiter Gesamtlauf: 20 Tests bestanden, dann scheiterte
    `review.browser.cjs`. **Echter Folgefehler:** Der Einstieg zum
    Klausurtraining trug dieselbe Klasse `review-teaser` wie der zur
    Wiederholungsrunde. Behoben (eigene Klasse `exam-teaser`).
  - Danach auf dem endgültigen Stand einzeln ausgeführt und bestanden: die 14
    Tests, die der zweite Lauf nicht mehr erreicht hatte (darunter `review`,
    `exam`, `predict-exercises`), sowie erneut `debug-exercises`,
    `order-exercises`, `practical-exercises` und `erm-editor`.
  - **Nicht erneut ausgeführt** nach der letzten Korrektur (zwei Zeilen: eine
    Klasse im Einstiegsabschnitt, eine CSS-Regel): zwölf Tests, die das
    SQL-Labor nicht berühren (`aggregation`, `appearance`, `backup-safety`,
    `command-search`, `home-navigation`, `lesson-completion`,
    `lesson-openings`, `lesson-phase-order`, `mn-modeling`, `model-glossary`,
    `notebook-drawing`, `opening-lessons-layout`). Sie bestanden im zweiten
    Gesamtlauf mit dem Stand unmittelbar davor.
- Der neue `exam.browser.cjs` zieht zufällige Aufgaben; er lief fünfmal
  hintereinander erfolgreich und löst dabei jeden Aufgabentyp über die
  Oberfläche.
- Bildschirmfoto der Auswertung bei 1440 px gesichtet.
- Nicht geprüft: heller Modus des Klausurtrainings, Verhalten der Uhr, wenn
  der Rechner in den Ruhezustand geht, Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.29.

### 0.29 Veröffentlichung 0.34.0 geprüft [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 154 | Commit `f262a72` gepusht; GitHub-Actions-Lauf 37900210801 | Job `test` und Job `deploy` erfolgreich |
| 155 | Live-Seite im Browser geprüft: Version `0.34.0`, `#sql/klausur` öffnet das Klausurtraining und zeigt ohne freigeschaltete Aufgaben den Hinweis, keine Konsolenfehler | nur lesend |
| 156 | Tag `v0.34.0` gesetzt und gepusht | Sicherungspunkt `f262a72` |
| 157 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 158 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Testumfang:** 147 Node-Tests, 2 Python-Tests, 30 Browsertests.

**Stand der Punkte aus `claude2codex.md`**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-03, OPT-07, OPT-08, OPT-13, OPT-19, OPT-21, OPT-22 |
| erledigt (Codex) | OPT-10, OPT-11 |
| erste Stufe erledigt | OPT-04 (Modell-Editor), OPT-15 (Checkliste), OPT-20 |
| braucht eine Entscheidung von Jakob | OPT-06, OPT-09, OPT-12, OPT-17, OPT-18; Durchführung der Checkliste 0.16 |
| braucht Abstimmung mit Codex | OPT-05, OPT-14 (Rest), OPT-16 |

Nächste Handlungsnummer: 159.

### 0.30 Release 0.35.0: Modell-Editor, zweite Stufe [Claude, 2026-10-09]

Bezug: OPT-04, zweite Stufe.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 159 | Commit `88390c7` (Eintrag 0.29, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 160 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 161 | `erm-editor.js`: Kästen verschieben (Zeiger und Tastatur), „Automatisch anordnen“, dritte geprüfte Aufgabe „Schulbibliothek“; `styles.css`; Versionsangaben auf `0.35.0`; README-Tabelle | siehe unten |
| 162 | `tests/erm-editor.test.js` um zwei Tests erweitert (jetzt 9); `tests/erm-editor.browser.cjs` um das Verschieben erweitert | |
| 163 | Ein Fehlversuch im Browsertest: Der Test erwartete ein Prüfergebnis, das ein früherer Testschritt bereits geleert hatte | nur Testcode |
| 164 | Testserver auf Port 4199 gestartet; alle Node-, Python- und alle 30 Browsertests auf dem endgültigen Stand ausgeführt | siehe Prüfung; schließt die in 0.28 offen gebliebene Lücke |
| 165 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.35.0` ergänzt | außerhalb des Repos, vor diesem Eintrag |

**Neu für Schülerinnen und Schüler**

- **Kästen verschieben:** Jeder Kasten im Diagramm lässt sich mit Maus oder
  Finger ziehen. Mit der Tastatur: Kasten ansteuern, dann Pfeiltasten (10
  Einheiten, mit Umschalttaste 50). Linien und Kardinalitäten folgen. Die
  Anordnung bleibt je Aufgabe gespeichert und geht in den Bildexport ein.
- **„Automatisch anordnen“** stellt das Raster wieder her.
- Ein Prüfergebnis bleibt beim Verschieben stehen, weil die Anordnung das
  Modell nicht ändert.
- **Dritte geprüfte Aufgabe „Schulbibliothek (Transfer)“**: vier
  Entitätstypen (Verlag, Buch, Leser, Ausleihe) mit drei 1:N-Beziehungen, davon
  eine aufgelöste M:N-Beziehung.

**Grenzen**

- Die Zeichenfläche ist mindestens 700 × 340 Einheiten groß und wächst mit den
  Kästen bis höchstens 1400 × 1000. Beim Ziehen mit der Maus bleibt ein Kasten
  innerhalb der aktuellen Fläche; mit den Pfeiltasten lässt sie sich
  vergrößern.
- Auf schmalen Bildschirmen wird das Diagramm verkleinert dargestellt; die
  Schrift im Diagramm ist dort entsprechend klein.
- Weiterhin offen: Optionalität (0 oder 1). Claude hat sie bewusst nicht
  umgesetzt, weil die Schreibweise zur Notation in den Unterrichtsmaterialien
  passen muss; das sollte Jakob vorgeben.
- Weiterhin nicht Teil der JSON-Sicherung; keine XP.

**Technik:** `layout()` übernimmt gespeicherte Positionen `x`/`y` eines
Entitätstyps und ordnet die übrigen im Raster an; `sanitize()` rundet und
begrenzt sie. Das Ziehen nutzt `pointerdown`/`pointermove`/`pointerup` auf
Dokumentebene; während des Ziehens bleibt die Größe der Zeichenfläche fest,
damit sich der Maßstab nicht ändert. Die exportierte SVG-Datei enthält keine
Bedienattribute.

**Prüfung**

- 149 Node-Tests (2 neu) und 2 Python-Tests bestanden.
- **Alle 30 Browsertests auf dem endgültigen Stand bestanden** (Edge, Port
  4199), jeder beim ersten Versuch. Damit sind auch die zwölf Tests erneut
  gelaufen, die bei 0.34.0 nach der letzten Korrektur nicht wiederholt worden
  waren.
- Der erweiterte `erm-editor.browser.cjs` prüft bei 1440 und 390 px: Ziehen mit
  der Maus, Linie folgt, Fokus bleibt auf dem Kasten, Prüfergebnis bleibt
  stehen, Pfeiltasten mit und ohne Umschalttaste, Bestand nach Neuladen,
  „Automatisch anordnen“, kein Überlauf, Bildexport ohne Bedienattribute.
- Nicht geprüft: Ziehen mit dem Finger auf einem echten Touch-Gerät (nur
  Mausereignisse im Test), die Aufgabe „Schulbibliothek“ im Browser (nur in den
  Node-Tests), heller Modus der neuen Bedienelemente, Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.31.

### 0.31 Veröffentlichung 0.35.0 geprüft; Stand aller Punkte [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 166 | Commit `e1daeb0` gepusht; GitHub-Actions-Lauf 37901111155 | Job `test` und Job `deploy` erfolgreich |
| 167 | Live-Seite im Browser geprüft: Version `0.35.0`, der Modell-Editor zeigt vier Aufgaben und „Automatisch anordnen“, keine Konsolenfehler | nur lesend |
| 168 | Tag `v0.35.0` gesetzt und gepusht | Sicherungspunkt `e1daeb0` |
| 169 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 170 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`) sowie `v0.26.0` bis
`v0.35.0` (zuletzt `v0.33.0` `b1b2b80`, `v0.34.0` `f262a72`, `v0.35.0`
`e1daeb0`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 149 Node-Tests, 2 Python-Tests, 30 Browsertests.

**Stand der Punkte aus `claude2codex.md`**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-03, OPT-07, OPT-08, OPT-13, OPT-19, OPT-21, OPT-22; OPT-04 bis auf die Optionalität |
| erledigt (Codex) | OPT-10, OPT-11 |
| teilweise | OPT-15 (Checkliste), OPT-20 (Hinweis und zwei MySQL-Befehle) |
| braucht eine Vorgabe oder Entscheidung von Jakob | OPT-06, OPT-09, OPT-12, OPT-17, OPT-18; Notation der Optionalität (OPT-04); Durchführung der Checkliste 0.16 (OPT-15) |
| braucht Abstimmung mit Codex | OPT-05, OPT-14 (Rest), OPT-16 |
| braucht eine echte MySQL-/MariaDB-Instanz zum Nachprüfen | OPT-20 (Rest) |

Damit ist kein Punkt mehr offen, den Claude ohne Vorgabe, Abstimmung oder
Prüfmöglichkeit umsetzen kann.

Nächste Handlungsnummer: 171.

### 0.32 Release 0.36.0: Prüfung an echter MariaDB und gemessene MySQL-Unterschiede [Claude, 2026-10-09]

Bezug: OPT-20; außerdem schließt der Eintrag den seit 0.28 wiederholt
genannten Punkt „nicht an einer echten Datenbank geprüft“ für Claudes
Aufgaben und den SQL-Export des Modell-Editors.

**Vorbemerkung:** Claude hatte OPT-20 als blockiert eingestuft, weil eine echte
MySQL- oder MariaDB-Instanz zum Nachprüfen fehle. Das war falsch: Codex'
`tools/verify-native-sql.cjs` nennt die MariaDB des Informatik-Sticks unter
`C:\Informatik-Stick\Programme\Xampp_7.4.7\mysql`, und sie ist vorhanden.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 171 | Commit `db39141` (Eintrag 0.31, nur Protokoll) gepusht, Actions-Lauf 37901246991 erfolgreich | keine Änderung an der App |
| 172 | `tools/verify-native-sql.cjs` gelesen; MariaDB-Programme am genannten Ort gefunden | nur lesend |
| 173 | `tools/verify-claude-native.cjs` angelegt und ausgeführt: eigene MariaDB-Instanz auf Port 33399, Datenverzeichnis im Temp-Ordner des Systems, danach beendet und Daten gelöscht; geprüft, dass kein `mysqld` und kein Temp-Verzeichnis zurückbleibt | 43 Prüfungen bestanden |
| 174 | `sql-feedback.js` um `MYSQL_DIFFERENCES` und `mysqlNotes` ergänzt; in `app.js` Hinweise unter dem Ergebnis des freien Labors und eine aufklappbare Liste; `styles.css`; Versionsangaben auf `0.36.0`; README-Tabelle | siehe unten |
| 175 | `tests/sql-feedback.test.js` um zwei Tests erweitert (jetzt 9); `tests/sql-playground.browser.cjs` erweitert | |
| 176 | **Der Browsertest fand einen eigenen Anzeigefehler aus 0.26.0:** Eine gültige Abfrage ohne Treffer meldete im freien Labor „Befehl ausgeführt. 0 Datensätze betroffen“. Jetzt erscheint „0 Ergebniszeilen“ mit dem Hinweis, die Bedingung zu prüfen | `runPlayground` in `app.js` |
| 177 | **Eigener Werkzeugfehler:** Ein Änderungsskript, das Claude über die Shell eingegeben hatte, verlor Rückstriche und schrieb ein unsichtbares Steuerzeichen in `app.js`. `node --check` meldete den Syntaxfehler sofort; Zeile repariert, alle Quelldateien auf Steuerzeichen durchsucht (keine weiteren) | nie committet |
| 178 | Testserver auf Port 4199 gestartet; alle Tests ausgeführt | siehe Prüfung |
| 179 | Claudes Merkzettel ergänzt: `codex-zusammenarbeit.md` um `v0.36.0`; `testumgebung-node-playwright.md` um den Ort der MariaDB, das neue Prüfwerkzeug und die Warnung vor Rückstrichen in Shell-Skripten | außerhalb des Repos, vor diesem Eintrag |

**Ergebnis der Prüfung an MariaDB 10.4.13**

| Geprüft | Ergebnis |
| --- | --- |
| 6 Aufgaben „Fehlersuche“ | Startcode zeigt in MariaDB dasselbe Symptom (Abbruch bzw. falsches Ergebnis), die Korrektur liefert dasselbe Ergebnis wie im Browser |
| 5 Aufgaben „Vorhersage“ (9 Fragen) | jede als richtig markierte Antwort stimmt auch in MariaDB |
| 4 Aufgaben „Klauseln ordnen“ | richtige Reihenfolge liefert dasselbe Ergebnis; vertauschte Reihenfolge bricht auch in MariaDB ab |
| SQL-Export des Modell-Editors (1:N und M:N, alle fünf Datentypen) | Tabellen, Primär- und Fremdschlüssel werden angelegt; ein ungültiger Verweis wird abgewiesen |
| `SHOW TABLES`, `DESCRIBE` | verhalten sich wie im freien Labor nachgebildet |

**Gemessene Unterschiede zwischen Browser-Labor und MariaDB**

| Anweisung | Browser-Labor | MariaDB |
| --- | --- | --- |
| `SELECT 7 / 2;` | `3` | `3.5000` |
| `… WHERE ort = 'stuttgart';` (in der Tabelle steht `Stuttgart`) | 0 Zeilen | 4 Zeilen |
| `vorname \|\| ' ' \|\| nachname` | `Mia Keller` | `0` |

Gleich verhielten sich: `LIKE 'k%'` (in beiden ohne Unterscheidung von Groß-
und Kleinschreibung), `CONCAT`, Text in doppelten Anführungszeichen,
`GROUP BY` mit weiterer Spalte, Datumsvergleich als Text, `LIMIT`, Tabellenname
in Großbuchstaben, abgewiesener Fremdschlüssel. `AVG` liefert denselben Wert,
MariaDB zeigt ihn mit vier Nachkommastellen.

**Neu für Schülerinnen und Schüler**

- Im freien SQL-Labor erscheint unter dem Ergebnis ein Hinweis „In MySQL
  Workbench anders: …“, wenn die Anweisung einen der drei Unterschiede
  betreffen kann: Division ohne Kommazahl, `||`, oder ein Textvergleich ohne
  Treffer. Text in Anführungszeichen und Kommentare lösen keinen Hinweis aus.
- Eine aufklappbare Liste nennt alle drei Unterschiede mit dem jeweils in
  beiden Systemen funktionierenden Weg (`7 / 2.0`, genaue Schreibweise,
  `CONCAT`).
- Eine Abfrage ohne Treffer zeigt „0 Ergebniszeilen“.

**Grenzen**

- Die Hinweise erscheinen nur im freien Labor, nicht in den Aufgaben.
- Gemessen wurde an der MariaDB 10.4.13 des Sticks in Grundeinstellung. Eine
  andere Zeichensatz- oder Moduseinstellung an den Schul-PCs kann das Verhalten
  bei Groß-/Kleinschreibung und `||` ändern.
- Das Browser-Labor verhält sich weiterhin anders als MySQL; Claude hat das
  Verhalten nicht angeglichen, weil das die Prüfung der bestehenden Aufgaben
  verändern würde.

**Prüfung**

- 151 Node-Tests (2 neu) und 2 Python-Tests bestanden. Ein Node-Test hält die
  Browser-Seite der drei Unterschiede fest (`7 / 2` ergibt 3, `'stuttgart'`
  findet nichts, `||` verbindet), damit die Hinweise nicht unbemerkt falsch
  werden, falls `sql.js` einmal ausgetauscht wird.
- Alle 30 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199),
  jeder beim ersten Versuch.
- `tools/verify-claude-native.cjs`: 43 Prüfungen gegen MariaDB 10.4.13
  bestanden. Dieses Werkzeug läuft nicht in der GitHub-Prüfung mit, weil dort
  keine MariaDB des Sticks vorhanden ist; es ist bei Bedarf von Hand zu starten.
- Nicht geprüft: die Bedienoberfläche von MySQL Workbench selbst (nur der
  Datenbankserver), die Einstellungen der Schul-PCs, heller Modus der neuen
  Hinweise.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.33.

### 0.33 Veröffentlichung 0.36.0 geprüft; Stand aller Punkte [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 180 | Commit `101bc9b` gepusht; GitHub-Actions-Lauf 37902299259 | Job `test` und Job `deploy` erfolgreich |
| 181 | Live geprüft: alle Dateien mit `?v=0.36.0`, `sql-feedback.js` enthält die Liste der Unterschiede | per Abruf |
| 182 | Tag `v0.36.0` gesetzt und gepusht | Sicherungspunkt `101bc9b` |
| 183 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 184 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`) sowie `v0.26.0` bis
`v0.36.0` (`101bc9b`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 151 Node-Tests, 2 Python-Tests, 30 Browsertests; zusätzlich von
Hand 43 Prüfungen gegen MariaDB.

**Stand der Punkte aus `claude2codex.md`**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-03, OPT-07, OPT-08, OPT-13, OPT-19, OPT-21, OPT-22; OPT-04 bis auf die Optionalität; OPT-20 für das freie Labor |
| erledigt (Codex) | OPT-10, OPT-11 |
| teilweise | OPT-15 (Checkliste) |
| braucht eine Vorgabe oder Entscheidung von Jakob | OPT-06, OPT-09, OPT-12, OPT-17, OPT-18; Notation der Optionalität (OPT-04); Durchführung der Checkliste 0.16 (OPT-15) |
| braucht Abstimmung mit Codex | OPT-05, OPT-14 (Rest), OPT-16; MySQL-Hinweise auch in den Aufgaben (OPT-20, Eingriff in `runSqlPractice`) |

Nächste Handlungsnummer: 185.

### 0.34 Release 0.37.0: Optionalität im Modell-Editor, MySQL-Hinweise in den Aufgaben, Testartefakte außerhalb von Google Drive [Claude, 2026-10-09]

Bezug: OPT-04 (Rest), OPT-20 (Rest), OPT-17 (Claudes Anteil).

**Vorbemerkung:** Claude hatte zwei dieser Punkte als blockiert gemeldet. Beide
Einstufungen waren falsch:

- „Die Schreibweise der Optionalität braucht Jakobs Vorgabe“: Die Lerneinheit
  zu Kardinalitäten in `content.js` legt sie bereits fest (`0..1`, `1..1`,
  `0..N`, `1..N`). Der Editor verwendet jetzt genau diese Schreibweise.
- „MySQL-Hinweise in den Aufgaben brauchen Abstimmung mit Codex“: Es ist eine
  Zeile nach der Ergebnisanzeige bei „Ausführen“; Prüfung, Coach und XP bleiben
  unberührt. Die Stelle ist unten benannt, damit Codex sie zurücknehmen kann.

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 185 | Commit `7b4a487` (Eintrag 0.33, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 186 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 187 | In `content.js` und `learning-path.js` nach der vorhandenen Schreibweise der Optionalität gesucht | nur lesend |
| 188 | `erm-editor.js`: Optionalität je Beziehungsseite, Beschriftung im Diagramm, optionaler Fremdschlüssel im SQL-Export | siehe unten |
| 189 | `app.js`: gemeinsame Funktion `mysqlNotesHtml`; Hinweis auch nach „Ausführen“ in Abfrage-Aufgaben (`runSqlPractice`) | Eingriff in Codex' Aufgabenansicht, eine Einfügung |
| 190 | Neun eigene Browsertests schreiben Bildschirmfotos, PDF und Downloads jetzt in `%TEMP%\workbenchlab-tests` statt nach `.tmp/` | Codex' Tests unverändert |
| 191 | Tests erweitert: `erm-editor.test.js` (jetzt 10), `erm-editor.browser.cjs`, `debug-exercises.browser.cjs`; `tools/verify-claude-native.cjs` um drei Prüfungen zur Optionalität | |
| 192 | Änderungen diesmal ausschließlich über Skriptdateien eingespielt (Lehre aus Handlung 177); danach alle geänderten Dateien mit `node --check` und auf Steuerzeichen geprüft | keine Auffälligkeit |
| 193 | Testserver auf Port 4199 und eigene MariaDB-Instanz auf Port 33399 gestartet; alle Tests ausgeführt; MariaDB-Instanz beendet, kein `mysqld` zurückgeblieben | siehe Prüfung |
| 194 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.37.0` und die Regel ergänzt, vor der Aussage „blockiert“ erst Repo, `resources/` und Stick zu prüfen | außerhalb des Repos, vor diesem Eintrag |

**Neu im Modell-Editor**

- Unter jeder Beziehung stehen zwei Kästchen: „linke Seite optional (0
  erlaubt)“ und „rechte Seite optional (0 erlaubt)“.
- Ist eine Seite optional, zeigt das Diagramm beide Enden in der Schreibweise
  der Lerneinheit: `0..1`, `1..1`, `0..N`, `1..N`. Ohne Optionalität bleibt die
  kurze Form `1`, `N`, `M`.
- Die Angabe an einem Entitätstyp sagt, wie viele seiner Datensätze zu einem
  Datensatz der anderen Seite gehören. `0..1` am Ort bedeutet: Ein Fahrschüler
  darf auch ohne Ort gespeichert sein.
- Im SQL-Export bleibt ein solcher Fremdschlüssel ohne `NOT NULL`. Optionalität
  an der N-Seite ändert die Tabellen nicht.
- Die Prüfung der drei Aufgaben hängt nicht an der Optionalität.

**Neu in den Aufgaben:** Nach „Ausführen“ erscheint unter dem Ergebnis einer
Abfrage-Aufgabe derselbe Hinweis „In MySQL Workbench anders: …“ wie im freien
Labor, wenn die Anweisung einen der drei gemessenen Unterschiede betreffen
kann. Bei „Coach-Tipp“ und „Lösung prüfen“ erscheint er nicht.

**Stelle zum Zurücknehmen:** in `runSqlPractice` der Block
`if (practice.check.type === "query") { … mysqlNotesHtml … }` direkt nach
`if (!useCoach) {`.

**Grenzen**

- Die Lerneinheit nennt auch die Krähenfuß-Notation; der Editor zeichnet sie
  nicht, sondern schreibt Zahlen.
- Ob `0..1` am Ort oder am Fahrschüler stehen soll, wird in Lehrwerken
  unterschiedlich gelesen. Der Editor erklärt seine Leserichtung im
  Hinweistext; Jakob sollte prüfen, ob sie zu seinem Unterricht passt.
- `.tmp/` selbst (rund 1 GB, überwiegend von Codex' Tests) ist unverändert;
  das Leeren braucht weiterhin Jakobs Freigabe.

**Prüfung**

- 152 Node-Tests (1 neu) und 2 Python-Tests bestanden.
- Alle 30 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199),
  jeder beim ersten Versuch.
- `tools/verify-claude-native.cjs`: 46 Prüfungen gegen MariaDB 10.4.13
  bestanden, darunter neu: Ein optionaler Fremdschlüssel aus dem Export darf
  leer bleiben und prüft vorhandene Werte weiterhin; ein verpflichtender darf
  nicht leer bleiben.
- Nicht geprüft: heller Modus der beiden Kästchen, Touch auf einem echten
  Gerät, Schul-PCs.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.35.

### 0.35 Veröffentlichung 0.37.0 geprüft; Stand aller Punkte [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 195 | Commit `21eff8c` gepusht; GitHub-Actions-Lauf 37903390580 | Job `test` und Job `deploy` erfolgreich |
| 196 | Live geprüft: alle Dateien mit `?v=0.37.0`, `erm-editor.js` enthält die Optionalität | per Abruf |
| 197 | Tag `v0.37.0` gesetzt und gepusht | Sicherungspunkt `21eff8c` |
| 198 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 199 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`) sowie `v0.26.0` bis
`v0.37.0` (`21eff8c`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 152 Node-Tests, 2 Python-Tests, 30 Browsertests; zusätzlich von
Hand 46 Prüfungen gegen MariaDB.

**Stand der Punkte aus `claude2codex.md`**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-03, OPT-04, OPT-07, OPT-08, OPT-13, OPT-19, OPT-20, OPT-21, OPT-22 |
| erledigt (Codex) | OPT-10, OPT-11 |
| teilweise | OPT-15 (Checkliste), OPT-17 (Claudes Tests schreiben nicht mehr nach `.tmp/`) |
| offen | OPT-05, OPT-06, OPT-09, OPT-12, OPT-14 (Rest), OPT-16, OPT-18; Rest von OPT-15 und OPT-17 |

**Zu den offenen Punkten, nach der Erfahrung dieses Tages neu bewertet.**
Zweimal hat Claude einen Punkt als blockiert gemeldet, der es nicht war. Für
die verbliebenen Punkte hat Claude deshalb geprüft, ob Repo, `resources/` oder
der Stick die fehlende Entscheidung schon enthalten:

| Punkt | Ergebnis der Prüfung |
| --- | --- |
| OPT-06 Freischaltung, OPT-18 Profildialog | In `documentation.md` (Abschnitte 2 und 3) und in den Abnahmen ausdrücklich als gewolltes Verhalten beschrieben: sequenzielle Freischaltung, Abschluss erst nach Lehrkraftbestätigung, Profil mit Kürzel und Klasse als Pflichtangabe. Eine Änderung widerspräche einer dokumentierten Festlegung. |
| OPT-09 Lehrkraft-Code, OPT-12 Lösungen im Quelltext | `documentation.md` und `codex2claude.md` halten fest, dass XP kein manipulationssicherer Nachweis sein sollen; Codex rät von OPT-09 ab. Ohne Jakobs Entscheidung zur Rolle der XP gibt es keinen Grund, das umzubauen. |
| OPT-05 Einheiten in Schritte teilen | Die Abnahmedokumente beschreiben die heutige Darstellung als abgenommen (Arbeitsschritte aufklappbar, Aufgabengruppen mit höchstens fünf Fragen). Das ist bereits Codex' Antwort auf die Länge der Einheiten. |
| OPT-14, OPT-16 Aufräumen | Betrifft Codex' Dateien; Claudes eigener Anteil ist erledigt. |
| OPT-15 Offline, OPT-17 `.tmp/` | Schul-PC-Test und Löschfreigabe kann nur Jakob geben. |

Nächste Handlungsnummer: 200.

### 0.36 Durchsicht unabhängig von der Punkteliste [Claude, 2026-10-09]

Anlass: Claude hatte gemeldet, es gebe nichts mehr ohne Rückfrage zu tun, und
sich dabei nur auf die eigene Punkteliste gestützt. Diese Durchsicht prüft die
Plattform unabhängig davon auf Ladegewicht, Bilder und Seitenkopf.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 200 | Commit `8ccd941` (Eintrag 0.35, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 201 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 202 | Seitenkopf, Größe aller ausgelieferten Dateien, Bild-Attribute, Video-Einbindung und Übertragungsgrößen der Live-Seite geprüft | nur lesend |
| 203 | Beschreibungstext der Seite korrigiert: „fuer … ueben“ zu „für … üben“ | `index.html`, eine Zeile; keine neue Version, weil keine versionierte Datei betroffen ist |
| 204 | Node-Tests ausgeführt | 152 bestanden |
| 205 | Dieser Eintrag mit der Korrektur als ein Commit gepusht | |

**Befunde**

| Geprüft | Befund | Handlung |
| --- | --- | --- |
| Beschreibungstext für Suchmaschinen und Lesezeichen | Umlaute als „ue“ geschrieben | korrigiert |
| Übertragung | `app.js` 228 KB, komprimiert übertragen 55 KB; Symbolbibliothek 398 KB, komprimiert 96 KB; Browser-Datenbank 655 KB; Zwischenspeicherung zehn Minuten (Vorgabe von GitHub Pages) | in Ordnung, nichts geändert |
| Video der Startanleitung (10 MB) | wird erst auf Wunsch geladen (`preload="none"`) | in Ordnung |
| Bilder | vier Fotos zwischen 190 und 250 KB, Landkarte 610 KB als WebP; ohne feste Maße im Markup | kein Handlungsbedarf erkannt; feste Maße würden nur ein kurzes Verrutschen beim Laden vermeiden |
| Nicht verwendete Dateien | Drei PNG-Dateien mit zusammen 8,8 MB (`bpe6-relief-map.png`, `bpe6-settlement-map.png`, `workbenchlab-titanium.png`) werden veröffentlicht, aber von der Seite nicht geladen; es gibt jeweils eine WebP-Fassung | **Hinweis an Codex:** aus der Veröffentlichung nehmen (`isPublicFile` in `tools/build-site.cjs`) oder löschen. Kein Einfluss auf Ladezeiten der Lernenden; Claude hat die Dateien nicht angefasst, weil es Codex' Bildquellen sind |

**Ergebnis:** Außer der einen Textkorrektur hat die Durchsicht nichts ergeben,
was Claude ohne Rückfrage ändern sollte.

Nächste Handlungsnummer: 206.

### 0.37 Release 0.38.0: Jakobs Entscheidungen umgesetzt [Claude, 2026-10-09]

**Auftrag:** Jakob hat am 9. Oktober im Chat neun Rückfragen beantwortet.

| Nr. | Jakobs Entscheidung | Umsetzung |
| --- | --- | --- |
| 1 | Übungen frei zugänglich; die Lerneinheiten bleiben als roter Faden in fester Reihenfolge | in 0.38.0 umgesetzt |
| 2 | Profildialog beim Erstbesuch bleibt | keine Änderung |
| 3 | Leistung fließt über das Punktesystem NAGOLD in die kontinuierlich erbrachte Leistung (keL) ein: je vollständig abgeschlossener Lerneinheit einmalig 5 NAGOLD, im Profil sichtbar; mehr als 100 im Jahr sind ausdrücklich in Ordnung | in 0.38.0 umgesetzt |
| 3 | Musterlösungen gehören nicht in den öffentlichen Quelltext | in 0.38.0 umgesetzt |
| 4 | `.tmp/` darf geleert werden | siehe Abschnitt 0.38 |
| 5 | Eine Lerneinheit bleibt eine vollständige Seite | keine Änderung; OPT-05 damit vorerst erledigt |
| 6 | Dokumentation und Code aufräumen, damit alle drei den Überblick behalten | folgt als eigener Arbeitsblock |
| 7, 8 | Schul-PC-Test und Durchsicht der neuen Aufgaben macht Jakob schrittweise im Unterricht | – |
| 9 | Kardinalitäten wie in den offiziellen Abituraufgaben; die Formulierung „1 : N“ aus dem Materialpaket ist in Ordnung | in 0.38.0 umgesetzt |

Später ergänzt von Jakob: Lösungen könnten im Entwicklermodus sichtbar werden;
als offener Punkt OPT-23 aufgenommen (siehe `claude2codex.md`).

**Handlungen**

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 206 | Jakobs Entscheidungen in Claudes Merkzettel `jakob-entscheidungen-2026-10-09.md` festgehalten | außerhalb des Repos |
| 207 | `resources/Leistungsbewertung/Leistungsbewertung.docx` und `Vertrag.docx` gelesen: 1 NAGOLD entspricht einem Bewertungspunkt, keL zählt 50 %; NAGOLD gibt es für erfolgreich erledigte Arbeitsaufträge | nur lesend, nicht veröffentlicht |
| 208 | Jakobs OneNote-Notizbuch „Lernfelder“ über seinen Freigabelink im eingebauten Browser geöffnet (Gastzugang mit Schreibrecht; Claude hat nichts verändert). Von der Seite „Abitur“ **eine** Datei heruntergeladen: die Aufgabenstellung des Haupttermins 2025 (`2024-2025.pdf`, 7,1 MB). Korrektur-, Lösungs- und Notendateien sowie die dort stehenden Namen von Prüflingen hat Claude nicht geöffnet und gibt sie nirgends wieder | Ablage unversioniert unter `resources/abitur/` |
| 209 | PDF-Lesewerkzeug PyMuPDF 1.28.2 für den aktuellen Benutzer installiert (`pip install --user pymupdf`) | außerhalb des Repos |
| 210 | Abituraufgabe gesichtet (Datenbankteil, Seiten 2 bis 4) | Befund unten |
| 211 | Umsetzung der Entscheidungen 1, 3 und 9; neues Werkzeug `tools/build-expected.cjs`, neue Datei `expected-results.js`, Erweiterung von `tools/build-site.cjs` | siehe unten |
| 212 | Tests ergänzt und angepasst, darunter zwei von Codex (`practical-exercises.browser.cjs`: Übung öffnet sich jetzt, die Einheit bleibt gesperrt) | siehe Prüfung |
| 213 | Testserver auf Port 4199 gestartet; alle Tests ausgeführt | siehe Prüfung |
| 214 | Claudes Merkzettel ergänzt (`codex-zusammenarbeit.md`, `testumgebung-node-playwright.md`) | außerhalb des Repos, vor diesem Eintrag |

**Befund aus der Abituraufgabe (Haupttermin 2025)**

- Die Datenbankstruktur ist als MySQL-Workbench-Diagramm abgedruckt. An den
  Verbindungen steht `1` auf der einen und `∞` auf der anderen Seite. Eine
  Angabe zur Optionalität gibt es nicht.
- Die Leserichtung entspricht dem Modell-Editor: `1` steht an der Tabelle, auf
  die verwiesen wird, `∞` an der Tabelle mit dem Fremdschlüssel.
- Die Aufgabe verlangt, aus einem Sachtext ein ER-Modell und ein
  Relationenmodell in dritter Normalform zu entwickeln.
- Eine Teilaufgabe gibt eine fehlerhafte SQL-Anweisung vor und verlangt, den
  Fehler zu erläutern und zu korrigieren. Das entspricht dem Aufgabentyp
  „Fehlersuche“ aus 0.28.0.
- Die Abfragen verbinden Tabellen über `FROM a, b WHERE a.x = b.x`.

**1. Übungen frei, Einheiten in Reihenfolge**

- Jede Übung lässt sich öffnen, auch im SQL-Labor und unter „Modellieren“.
- Gehört eine Übung zu einer Einheit, die im Lernpfad noch nicht erreicht ist,
  trägt ihre Karte das Kennzeichen „Vorgriff“.
- Die Lerneinheiten selbst bleiben unverändert gesperrt, bis die vorherige
  abgeschlossen ist.
- Das Klausurtraining zieht weiterhin nur Aufgaben aus erreichten Einheiten.

**3. NAGOLD**

- Im Profil steht unter dem Level: „x NAGOLD aus WorkbenchLab: n abgeschlossene
  Lerneinheiten × 5. Sie zählen, sobald deine Lehrkraft den Abschluss bestätigt
  hat.“
- Beim Abschluss einer Einheit erscheint „+XP und +5 NAGOLD gesammelt“.
- Die Klassenübersicht zeigt je Person eine Spalte NAGOLD (neu berechnet aus
  den abgeschlossenen Einheiten), den Mittelwert und führt sie im CSV.
- Die JSON-Sicherung nennt den Wert in `summary.nagold`.
- Der Wert 5 steht als `nagoldPerLesson` in `app.js` und als
  `NAGOLD_PER_LESSON` in `teacher-overview.js`; ein Test hält beide gleich.
- 21 Einheiten ergeben 105 NAGOLD. XP bleiben das Motivationssystem innerhalb
  der Plattform; NAGOLD hängen allein am Abschluss einer Einheit, für den die
  Lehrkraft-Bestätigung nötig ist.

**3. Keine Lösungsanweisungen im öffentlichen Quelltext**

- `tools/build-expected.cjs` berechnet zu jeder SQL-Aufgabe das Sollergebnis
  und schreibt es nach `expected-results.js` (29 Einträge).
- Die Seite prüft Lösungen gegen dieses Sollergebnis. Fehlt es, greift sie wie
  bisher auf die Lösungsanweisung zurück; das ist nur in der Entwicklung der
  Fall.
- Beim Veröffentlichen entfernt `tools/build-site.cjs` aus fünf Inhaltsdateien
  alle Zeilen `solution`, `expectedSql`, `referenceSql`, `fixed` und
  `proofSql` und bricht ab, falls danach noch eine Lösungsangabe vorhanden wäre
  oder ein Sollergebnis fehlt.
- Im Repository bleiben die Lösungen stehen, weil die Tests sie brauchen. Das
  Repository ist öffentlich; wer dort sucht, findet sie weiterhin. Entfernt
  sind sie aus der Lernseite, also aus dem, was der Browser der Lernenden lädt.
- Weiterhin im Browser lesbar und nicht vermeidbar: das Sollergebnis als
  Tabelle, die richtige Antwortnummer bei Auswahl- und Vorhersageaufgaben, die
  richtige Zeilenreihenfolge bei „Klauseln ordnen“.
- **Arbeitsregel:** Nach jeder Änderung an einer SQL-Aufgabe
  `node tools/build-expected.cjs` ausführen. Ein Test schlägt fehl, wenn
  `expected-results.js` veraltet ist. Lösungsangaben immer einzeilig schreiben.

**9. Schreibweise im Modell-Editor**

- Über dem Diagramm lässt sich die Schreibweise wählen: `1 : N` (wie im
  Materialpaket) oder `1 : ∞` (wie in MySQL Workbench und im Abitur). Die Wahl
  bleibt gespeichert.
- Die Optionalität aus 0.37.0 bleibt als Zusatz erhalten; im Abitur kommt sie
  nicht vor.

**Prüfung**

- 155 Node-Tests (3 neu) und 2 Python-Tests bestanden. Neu geprüft:
  `expected-results.js` ist aktuell und deckt jede SQL-Aufgabe ab; nach dem
  Entfernen der Lösungszeilen laden die Inhaltsdateien weiter, und alles, was
  Lernende sehen oder die Prüfung braucht, ist unverändert.
- Alle 31 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199),
  jeder beim ersten Versuch.
- Der neue `public-site.browser.cjs` baut die veröffentlichte Fassung, liefert
  sie auf einem eigenen freien Port aus und prüft dort: keine Lösungsangaben in
  den geladenen Daten und Dateien; richtige und falsche Lösungen einer
  Abfrage-, einer Fehlersuche- und einer `INSERT`-Aufgabe werden allein mit dem
  Sollergebnis beurteilt; keine gesperrte Übung, „Vorgriff“ vorhanden; L1.4
  bleibt gesperrt, L1.3 offen; NAGOLD im Profil.
- Nicht geprüft: Schul-PCs; heller Modus der NAGOLD-Zeile und der neuen Auswahl
  im Modell-Editor.
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.38.

### 0.38 Veröffentlichung 0.38.0 geprüft; `.tmp/` geleert [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 215 | Commit `96f7578` gepusht; GitHub-Actions-Lauf 37915734473 | Job `test` und Job `deploy` erfolgreich |
| 216 | Live geprüft: alle Dateien mit `?v=0.38.0`; in den fünf veröffentlichten Inhaltsdateien keine Zeile mit `solution`, `expectedSql`, `referenceSql`, `fixed` oder `proofSql`; `expected-results.js` wird ausgeliefert | per Abruf |
| 217 | Tag `v0.38.0` gesetzt und gepusht | Sicherungspunkt `96f7578` |
| 218 | Eigenen Testserver auf Port 4199 beendet (Befehlszeile vorher geprüft) | fremde Prozesse unberührt |
| 219 | **`.tmp/` geleert** (Freigabe Jakob): 1711 Dateien, 991 MB, über die Papierkorb-Funktion von Windows gelöscht; danach einen leeren Ordner `.tmp` neu angelegt, weil Codex' Prüfwerkzeuge dort Unterordner anlegen | Ob die Dateien im Windows- oder im Google-Drive-Papierkorb liegen, hat Claude nicht geprüft |
| 220 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll und Übergabedatei) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`) sowie `v0.26.0` bis
`v0.38.0` (`96f7578`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 155 Node-Tests, 2 Python-Tests, 31 Browsertests; zusätzlich von
Hand 46 Prüfungen gegen MariaDB (zuletzt bei 0.37.0 ausgeführt).

**Stand der Punkte**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, OPT-02, OPT-03, OPT-04, OPT-06, OPT-07, OPT-08, OPT-12 (veröffentlichte Fassung), OPT-13, OPT-19, OPT-20, OPT-21, OPT-22 |
| erledigt (Codex) | OPT-10, OPT-11 |
| verworfen durch Jakob | OPT-05 (eine Einheit bleibt eine Seite), OPT-18 (Profildialog bleibt) |
| teilweise | OPT-15 (Checkliste; Jakob testet schrittweise im Unterricht), OPT-17 (`.tmp/` geleert; Codex' Tests schreiben weiter dorthin) |
| freigegeben, als Nächstes | OPT-14 Dokumentation zusammenführen, OPT-16 `app.js` und `styles.css` aufteilen |
| offen | OPT-09 (neu zu bewerten), OPT-23 (Lösungen im Entwicklermodus), OPT-24 (Fehlersuche nach Abiturmuster) |

Nächste Handlungsnummer: 221.

### 0.39 Dokumentation aufgeräumt [Claude, 2026-10-09]

Bezug: OPT-14, von Jakob am 9. Oktober freigegeben („damit Codex, du und ich den
Überblick behalten“). Keine Änderung an der App, keine neue Version.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 221 | Commit `0982390` (OPT-17-Status in der Übergabedatei) gepusht | keine Änderung an der App |
| 222 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 223 | 17 Dateien per `git mv` nach `documentation/releases/` verschoben: 15 Release-Berichte (0.22.0 bis 0.25.3) und 2 Abnahmen. `RELEASE_0.24.1.md` heißt jetzt einheitlich `RELEASE_0_24_1.md`. Der Git-Verlauf der Dateien bleibt erhalten | Inhalt unverändert |
| 224 | Verweise auf diese Dateien in `documentation.md`, `OPT_11_PUBLIC_ARTIFACT.md` und innerhalb der verschobenen Dateien angepasst | |
| 225 | `CHANGELOG.md` im Projektstamm angelegt: eine Zeile je Version von 0.1 bis 0.38.0 mit Verweis auf die Quelle | neu |
| 226 | `README.md` neu gefasst (227 statt 303 Zeilen): Wegweiser, aktueller Funktionsumfang, aktuelle Dateikarte, Veröffentlichung, NAGOLD. Die Abschnitte „Ziel“, „Fachliche Grundlage“, „SQL-Labor und MySQL Workbench“, „Lokale Prüfungen“ und der Datenschutzteil sind wörtlich übernommen | |
| 227 | Die überholten README-Teile (Release-Hinweise bis 0.25, Stände 0.5.0 und 0.7.0, alte Architektur- und Startabschnitte) wörtlich nach `documentation/releases/README_BIS_0_25_3.md` verschoben | nichts gelöscht |
| 228 | Am Anfang dieser Datei den Abschnitt „Wegweiser und aktueller Stand“ eingefügt (eigene Markierung `CLAUDE-WEGWEISER`) | |
| 229 | Alle Verweise in `README.md` und `CHANGELOG.md` auf Existenz der Zieldateien geprüft; Node-Tests ausgeführt | keine fehlenden Ziele; 155 bestanden |
| 230 | Dieser Eintrag mit allen Änderungen als ein Commit gepusht | Deployment ohne App-Änderung |

**Nicht angefasst:** die Abschnitte 1 bis 12 und die Anhänge dieser Datei
(Codex, Stand 3. Oktober), die Konzeptdokumente im Ordner `documentation/`,
`codex2claude.md`, `Lehrbuch/`. Abschnitt 2 nennt weiterhin 38 Übungen und den
Stand 0.21.0; der neue Wegweiser am Dateianfang nennt den aktuellen Stand und
weist darauf hin.

**Für Codex:** Neue Release-Berichte bitte unter `documentation/releases/`
ablegen oder, einfacher, als Zeile in `CHANGELOG.md` mit einem Abschnitt in
dieser Datei.

**Offen aus OPT-14:** die alten Abschnitte dieser Datei in ein eigenes
Archivdokument auslagern. Das würde die Datei von rund 4000 auf wenige hundert
Zeilen kürzen, verschiebt aber Codex' Text; Claude macht es erst nach einem
kurzen Zeichen von Codex oder Jakob, weil Codex' Arbeitsweise auf diese
Abschnitte verweist.

Nächste Handlungsnummer: 231.

### 0.40 Release 0.38.1: Fehlersuche nach Abiturmuster [Claude, 2026-10-09]

Bezug: OPT-24.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 231 | Commit `28f022b` (Dokumentation aufgeräumt) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 232 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 233 | Siebte Fehlersuche-Aufgabe `debug-and-or-klammern` in `debug-exercises.js` ergänzt; `node tools/build-expected.cjs` ausgeführt (30 Sollergebnisse); Versionsangaben auf `0.38.1`; README, `CHANGELOG.md` und Wegweiser auf 59 Übungen | |
| 234 | Tests angepasst (`debug-exercises.test.js` jetzt 6 Tests, `debug-exercises.browser.cjs`) | |
| 235 | Testserver auf Port 4199 und eigene MariaDB-Instanz auf Port 33399 gestartet; alle Tests ausgeführt; MariaDB-Instanz beendet | siehe Prüfung |

**Die Aufgabe:** Zu L2.4. Gewünscht sind die Fahrschüler aus Esslingen oder
Tuebingen. Die vorgegebene Abfrage verbindet zwei Tabellen über die
`WHERE`-Bedingung und hängt die beiden Ortsbedingungen ohne Klammern mit `AND`
und `OR` an. Weil `AND` vor `OR` ausgewertet wird, erscheinen zwölf statt vier
Zeilen. Die Korrektur setzt eine Klammer; eine Lösung mit `JOIN … ON` und `IN`
wird ebenfalls akzeptiert. 20 XP, drei gestufte Hinweise.

Das Muster stammt aus dem Abitur-Haupttermin 2025 (fehlerhafte Anweisung
erläutern und korrigieren, Tabellenverbund über `WHERE`). Beispiel, Daten und
Wortlaut sind eigene; aus der Prüfungsaufgabe ist nichts übernommen.

**Prüfung**

- 156 Node-Tests (1 neu) und 2 Python-Tests bestanden. Der neue Test hält fest:
  ohne Klammern zwölf Zeilen, mit Klammern vier; eine gleichwertige Lösung mit
  `JOIN` und `IN` liefert dasselbe und erfüllt die Aufbauprüfung.
- Alle 31 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199),
  jeder beim ersten Versuch.
- `tools/verify-claude-native.cjs`: 49 Prüfungen gegen MariaDB 10.4.13
  bestanden; die neue Aufgabe zeigt dort dasselbe falsche und dasselbe
  korrigierte Ergebnis wie im Browser.
- Nicht geprüft: Schul-PCs; die Aufgabe im Browser bis zur Lösung (der
  Browsertest prüft Anzahl und Kennzeichnung, gelöst werden dort zwei andere
  Fehlersuche-Aufgaben).
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.41.

### 0.41 Veröffentlichung 0.38.1 geprüft; Stand aller Punkte [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 236 | Commit `c652f44` gepusht; GitHub-Actions-Lauf 37917148601 | Job `test` und Job `deploy` erfolgreich |
| 237 | Live geprüft: alle Dateien mit `?v=0.38.1`; die neue Aufgabe ist enthalten, ihre Korrekturzeile nicht | per Abruf |
| 238 | Tag `v0.38.1` gesetzt und gepusht; eigenen Testserver auf Port 4199 beendet | Sicherungspunkt `c652f44` |
| 239 | Claudes Merkzettel `codex-zusammenarbeit.md` um `v0.38.1` und die neuen Orte (`CHANGELOG.md`, `documentation/releases/`) ergänzt | außerhalb des Repos |
| 240 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Testumfang:** 156 Node-Tests, 2 Python-Tests, 31 Browsertests; zusätzlich von
Hand 49 Prüfungen gegen MariaDB.

**Stand der Punkte**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, -02, -03, -04, -06, -07, -08, -12 (veröffentlichte Fassung), -13, -19, -20, -21, -22, -24 |
| erledigt (Codex) | OPT-10, OPT-11 |
| verworfen durch Jakob | OPT-05, OPT-18 |
| weitgehend erledigt | OPT-14 (Auslagern der alten Abschnitte dieser Datei offen), OPT-15 (Checkliste; Test im Unterricht durch Jakob), OPT-17 (`.tmp/` geleert) |
| freigegeben, noch nicht begonnen | OPT-16 `app.js` und `styles.css` aufteilen |
| offen | OPT-09 (Lehrkraft-Bestätigung absichern), OPT-23 (Lösungen im Entwicklermodus) |

**Zu OPT-16:** `app.js` hatte rund 4600 Zeilen in einer einzigen Funktion. Das
Aufteilen ändert kein Verhalten, berührt aber jede Stelle; es sollte in kleinen
Schritten mit vollständigem Testlauf nach jedem Schritt geschehen und nicht
gleichzeitig mit Arbeit von Codex an derselben Datei.

Nächste Handlungsnummer: 241.

### 0.42 Release 0.38.2: `app.js` aufteilen, Schritt 1 [Claude, 2026-10-09]

Bezug: OPT-16, von Jakob am 9. Oktober freigegeben. Für Lernende ändert sich
nichts.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 241 | Commit `a2c08de` (Eintrag 0.41, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 242 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 243 | Aus `app.js` zwei zusammenhängende Blöcke unverändert nach `sql-check.js` verschoben: die nachgebildeten Datumsfunktionen (`parseDateParts`, `registerSqlFunctions`) und die Prüflogik (`tableFromResult`, `normalizeCell`, `normalizedRows`, `sameTable`, `sqlCoachPatterns`, `sqlPatternInfo`, `checkSqlPatterns`). Das Verschiebeskript bricht ab, falls ein Block etwas aus dem Lernstand, den Inhalten oder der Seite benutzt oder `app.js` danach noch einen der internen Namen verwendet | `app.js` 4605 → 4489 Zeilen; `sql-check.js` 127 Zeilen |
| 244 | `app.js` bezieht die vier benötigten Funktionen aus `window.WORKBENCH_SQL_CHECK`; `index.html` lädt `sql-check.js` vor `app.js`; `tools/build-site.cjs`, README und `CHANGELOG.md` ergänzt; Versionsangaben auf `0.38.2` | |
| 245 | `tests/sql-check.test.js` angelegt (5 Tests). Die Prüflogik war bisher nur über Browsertests abgedeckt; jetzt wird sie direkt getestet | |
| 246 | Testserver auf Port 4199 gestartet; alle Tests ausgeführt | siehe Prüfung |

**Warum dieser Schritt zuerst:** Die Blöcke hängen von nichts anderem in
`app.js` ab, lassen sich also ohne Umbau herauslösen, und sie entscheiden über
richtig und falsch. Direkte Tests dafür sind der größte Gewinn.

**Mögliche nächste Schritte (nicht begonnen):** Sicherung und Import
(`stableStringify`, `sha256Hex`, `backupPayload`, `verifyBackupIntegrity`,
`importProgressFile`) nach `backup.js`; danach Lernstand (`normalizeState`,
`loadState`, `saveState`) nach `state.js`. Beide greifen auf gemeinsame
Variablen zu und brauchen deshalb eine Übergabe von Abhängigkeiten, nicht nur
ein Verschieben.

**Prüfung**

- 161 Node-Tests (5 neu) und 2 Python-Tests bestanden.
- Alle 31 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199),
  jeder beim ersten Versuch. Darunter sind alle Tests, die SQL-Aufgaben lösen
  und prüfen lassen, sowie der Test der veröffentlichten Fassung.
- Nicht erneut ausgeführt: die Prüfung gegen MariaDB (die Aufgaben sind
  unverändert; zuletzt bei 0.38.1 mit 49 Prüfungen bestanden).
- Veröffentlichung: Ergebnis des Deployments steht im Eintrag 0.43.

### 0.43 Veröffentlichung 0.38.2 geprüft; Stand aller Punkte [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 247 | Commit `423de85` gepusht; GitHub-Actions-Lauf 37917998270 | Job `test` und Job `deploy` erfolgreich |
| 248 | Live-Seite im Browser geprüft: Version `0.38.2`, `sql-check.js` geladen, eine Abfrage mit `YEAR()` läuft im freien Labor, 59 Übungen, keine Lösungsangaben in den geladenen Daten, keine Konsolenfehler | nur lesend |
| 249 | Tag `v0.38.2` gesetzt und gepusht; eigenen Testserver auf Port 4199 beendet; Claudes Merkzettel um `v0.38.2` ergänzt | Sicherungspunkt `423de85` |
| 250 | Dieser Eintrag als eigener Commit gepusht (nur Protokoll) | Deployment ohne App-Änderung |

**Sicherungspunkte:** `codex-stand-2026-10-08` (`4dedae1`) sowie `v0.26.0` bis
`v0.38.2` (`423de85`). Wiederherstellung wie in Abschnitt 0.1.

**Testumfang:** 161 Node-Tests, 2 Python-Tests, 31 Browsertests; zusätzlich von
Hand 49 Prüfungen gegen MariaDB.

**Stand der Punkte**

| Status | Punkte |
| --- | --- |
| erledigt (Claude) | OPT-01, -02, -03, -04, -06, -07, -08, -12 (veröffentlichte Fassung), -13, -19, -20, -21, -22, -24 |
| erledigt (Codex) | OPT-10, OPT-11 |
| verworfen durch Jakob | OPT-05, OPT-18 |
| begonnen | OPT-16 (Schritt 1 von mehreren), OPT-14 (bis auf das Auslagern der alten Abschnitte dieser Datei) |
| wartet auf Jakob im Unterricht | OPT-15 (Checkliste), Durchsicht der neuen Aufgaben |
| offen | OPT-09 (Lehrkraft-Bestätigung absichern), OPT-23 (Lösungen im Entwicklermodus) |

Nächste Handlungsnummer: 251.

### 0.44 Alte Abschnitte ins Archiv ausgelagert [Claude, 2026-10-09]

Bezug: OPT-14, letzter Teil. Jakobs Freigabe zum Aufräumen vom 9. Oktober deckt
das ab; Claude hatte in 0.39 unnötig auf ein weiteres Zeichen gewartet.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 251 | Commit `ff12930` (Eintrag 0.43, nur Protokoll) gepusht, Actions-Lauf erfolgreich | keine Änderung an der App |
| 252 | `git fetch`, `git status`: Stand identisch mit GitHub, keine fremden Änderungen | vor Arbeitsbeginn |
| 253 | Die Abschnitte 1 bis 12 und die Anhänge (Verfasser Codex, 2081 Zeilen) unverändert nach `documentation/archiv/PROJEKTDOKUMENTATION_BIS_0_21.md` verschoben. Geändert wurden nur Verweise auf andere Dateien, die vom neuen Ort aus eine Ebene höher zeigen müssen. Abschnittsnummern unverändert | diese Datei: 4109 → rund 2050 Zeilen |
| 254 | Am Ende dieser Datei einen Verweis auf das Archiv mit der Liste der Abschnitte eingefügt; Wegweiser angepasst | |
| 255 | Verweise in `README.md`, `CHANGELOG.md`, `documentation/TECHNIK_UND_DIDAKTIK.md` und `Lehrbuch/QUELLEN.md` auf das Archiv umgestellt (je eine Zeile in den beiden Codex-Dateien) | |
| 256 | Alle Verweise im Archiv, in `README.md` und in `CHANGELOG.md` auf Existenz der Zieldateien geprüft; Node-Tests ausgeführt | keine fehlenden Ziele; 161 bestanden |
| 257 | Dieser Eintrag mit allen Änderungen als ein Commit gepusht | Deployment ohne App-Änderung |

Damit ist OPT-14 erledigt. Die Dokumentation besteht jetzt aus:

| Datei | Zweck |
| --- | --- |
| `README.md` | Einstieg, Funktionsumfang, Dateikarte |
| `CHANGELOG.md` | eine Zeile je Version |
| `documentation/documentation.md` | Wegweiser, aktueller Stand, Claudes Arbeitsprotokoll |
| `claude2codex.md`, `codex2claude.md` | Übergaben und offene Punkte |
| `documentation/releases/` | Einzelberichte 0.22.0 bis 0.25.3, archivierte README-Teile |
| `documentation/archiv/` | Codex' Projektdokumentation bis 0.21.0 |
| übrige Dateien in `documentation/` | Konzepte, Bildherkunft, Berichte zu OPT-10 und OPT-11 |

Nächste Handlungsnummer: 258.

### 0.45 Release 0.39.0: Lösungen für die Lehrkraft im Entwicklermodus [Claude, 2026-10-09]

Bezug: OPT-23 (Idee von Jakob, 9. Oktober). Grundsatz bleibt: Die veröffentlichte
Lernseite enthält keine Lösungen. Sichtbar werden sie nur, wenn die Lehrkraft im
Entwicklermodus eine Datei von ihrem eigenen Rechner lädt.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 258 | `tools/build-solutions.cjs` neu: sammelt je Aufgabe die Lösung (SQL-Anweisung, richtige Reihenfolge, richtige Antwort, Diagrammfelder) und schreibt `resources/workbenchlab-loesungen.json` | 59 von 59 Aufgaben; Ordner `resources/` ist nicht versioniert und wird nicht veröffentlicht |
| 259 | `index.html`: Knopf „Lösungsdatei laden“ und Dateifeld im Profildialog, nur bei eingeschaltetem Entwicklermodus sichtbar | hinter dem Knopf für den Entwicklermodus (Codex-Datei, 5 Zeilen ergänzt) |
| 260 | `app.js`: `teacherSolutions` (nur Arbeitsspeicher), `loadSolutionFile` (Prüfung von Kennung, Größe, Aufgabenkennungen; Text wird maskiert), `teacherSolutionHtml`; Anzeige eingeklappt am Ende jeder Aufgabe; Entwicklermodus aus → Lösungen verworfen | nichts davon in `localStorage` |
| 261 | `styles.css`: Block am Ende; im Druck ausgeblendet | |
| 262 | Tests neu: `tests/teacher-solutions.test.js` (3), `tests/teacher-solutions.browser.cjs` | siehe Prüfung |
| 263 | Fehlgriff: Der Browsertest las zuerst den sichtbaren Text eines eingeklappten Bereichs und fand deshalb nur die Überschrift | Test auf den vollständigen Text umgestellt; App unverändert |
| 264 | Versionsangaben auf `0.39.0`; `CHANGELOG.md`, `README.md`, Wegweiser dieser Datei, `claude2codex.md` (OPT-23 erledigt, Zählungen) | |
| 265 | Lösungsdatei für Jakob erzeugt: `node tools/build-solutions.cjs` | `resources/workbenchlab-loesungen.json` |
| 266 | Merkzettel `codex-zusammenarbeit.md` um Tag `v0.39.0` und den Weg zur Lösungsdatei ergänzt | außerhalb des Repositorys |
| 267 | Eigenen Testserver auf Port 4199 gestartet und nach den Tests beendet | keine fremden Prozesse berührt |

**Bedienung für die Lehrkraft:** Profil öffnen → `AltGr + S` → „Entwicklermodus
einschalten“ → „Lösungsdatei laden“ → `resources/workbenchlab-loesungen.json`
wählen. Bei jeder Aufgabe steht dann unten „Lösung für die Lehrkraft“. Nach dem
Neuladen der Seite oder dem Ausschalten des Entwicklermodus sind die Lösungen weg.
Nach Änderungen an Aufgaben die Datei mit `node tools/build-solutions.cjs` neu erzeugen.

**Prüfung**

- 164 Node-Tests (3 neu) und 2 Python-Tests bestanden.
- Alle 32 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199),
  darunter `public-site.browser.cjs`: Die gebaute Seite enthält weiterhin keine Lösungen.
- Der neue Browsertest prüft bei 1440 und 390 Pixeln: kein Knopf ohne
  Entwicklermodus; drei ungültige Dateien abgelehnt; HTML in der Datei bleibt
  Text; SQL-, Vorhersage-, Ordnungs- und Diagrammaufgabe zeigen die Lösung; nichts
  im Browserspeicher; weg nach Neuladen und nach Ausschalten.

**Nicht geprüft:** Bedienung durch Jakob am eigenen Gerät; Anzeige am Beamer.
Der Dateidialog des Betriebssystems selbst ist im Test durch direktes Setzen der
Datei ersetzt.

**Bekannte Grenze:** Die Lösungen stehen weiterhin im öffentlichen Repository
(nicht auf der Lernseite), weil die Tests sie brauchen (siehe OPT-12 in `claude2codex.md`).

Nächste Handlungsnummer: 268.

### 0.46 Veröffentlichung 0.39.0 geprüft [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 268 | Vor dem Commit `git fetch` und `git status`: keine fremden Änderungen | |
| 269 | Commit `e1369a4` gepusht; Actions-Lauf (Tests und Deployment) erfolgreich | https://jakobsawazki.github.io/WorkbenchLab/ |
| 270 | Live geprüft: `index.html` mit `v=0.39.0`; `app.js` enthält `loadSolutionFile`; in `content.js`, `practical-exercises.js`, `debug-exercises.js`, `predict-exercises.js` 0 Lösungszeilen; `resources/workbenchlab-loesungen.json` und `tools/build-solutions.cjs` liefern 404 | Lösungsdatei ist nicht öffentlich |
| 271 | Sicherungs-Tag `v0.39.0` gesetzt und gepusht | Wiederherstellung wie in Abschnitt 0.1 |
| 272 | Eigenen Testserver auf Port 4199 beendet | |
| 273 | Dieser Eintrag als eigener Commit gepusht | keine Änderung an der App |

**Stand der Punkte:** erledigt OPT-01 bis 04, 06 bis 08, 10 bis 14, 19 bis 24;
abgelehnt OPT-05, 18; bei Jakob im Unterricht OPT-15; offen OPT-09
(Lehrkraft-Bestätigung absichern, braucht Jakobs Entscheidung) und die weiteren
Schritte von OPT-16 (`app.js` und `styles.css` aufteilen).

Nächste Handlungsnummer: 274.

### 0.47 Release 0.39.1: `app.js` aufteilen, Schritt 2 [Claude, 2026-10-09]

Bezug: OPT-16. Keine sichtbare Änderung. Die Prüfsumme der JSON-Sicherung gab es
zweimal (in `app.js` von Codex und als Kopie in `teacher-overview.js` von
Claude); ein Test verglich bisher nur die Texte der beiden Kopien.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 274 | `backup.js` neu: `stableStringify`, `sha256Hex`, `verifyBackupIntegrity` unverändert aus `app.js` übernommen (Verfasser Codex) → `window.WORKBENCH_BACKUP` | ohne DOM, ohne Lernstand |
| 275 | `app.js`: die drei Funktionen entfernt, eine Zeile bindet `backup.js` ein | 4546 → 4515 Zeilen |
| 276 | `teacher-overview.js`: eigene Kopie entfernt, nutzt `backup.js` | eine Quelle statt zwei |
| 277 | `index.html`, `lehrkraft.html`: `backup.js` vor `app.js` bzw. `teacher-overview.js` geladen; `tools/build-site.cjs`: in die Liste der öffentlichen Dateien aufgenommen (je eine Zeile in Codex-Dateien) | |
| 278 | `tests/backup.test.js` neu (4 Tests: Schlüsselreihenfolge, SHA-256 mit Umlauten, gültig/verändert/ohne Prüfsumme/altes Format, Ladereihenfolge und einzige Kopie); `tests/teacher-overview.test.js` angepasst | die Prüfsumme war bisher nur über Browsertests abgedeckt |
| 279 | Fehlgriff: Ein Test zählt die Skripte der Lehrkraftseite fest (8); mit `backup.js` sind es 9 | Zahl im Test angepasst |
| 280 | Versionsangaben auf `0.39.1`; `CHANGELOG.md`, `README.md`, Wegweiser, `claude2codex.md`, Merkzettel (Tag-Bereich) | |
| 281 | Eigenen Testserver auf Port 4199 gestartet, nach den Tests beendet | keine fremden Prozesse berührt |

**Prüfung**

- 168 Node-Tests (4 neu) und 2 Python-Tests bestanden.
- Alle 32 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199),
  darunter die drei, die Sicherungen exportieren, verändern und wieder laden
  (`backup-safety`, `study-workflow`, `notebook-drawing`) und die Klassenübersicht.

**Nicht geprüft:** Schul-PCs. Sicherungsdateien aus älteren Versionen wurden nur
über die vorhandenen Tests (Format 2 und 3) geprüft, nicht mit echten Dateien von
Lernenden.

**Nächste Schritte von OPT-16:** Lernstand (`normalizeState`, `loadState`,
`saveState`) nach `state.js`; `styles.css` aufteilen. Beides greift tiefer in
Codex' Teile ein und sollte jeweils ein eigener Release bleiben.

Nächste Handlungsnummer: 282.

### 0.48 Veröffentlichung 0.39.1 geprüft [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 282 | Vor dem Commit `git fetch` und `git status`: keine fremden Änderungen | |
| 283 | Commit `2beb956` gepusht; Actions-Lauf (Tests und Deployment) erfolgreich | https://jakobsawazki.github.io/WorkbenchLab/ |
| 284 | Live geprüft: `index.html` mit `v=0.39.1`, `backup.js` abrufbar | |
| 285 | Sicherungs-Tag `v0.39.1` gesetzt und gepusht | Wiederherstellung wie in Abschnitt 0.1 |
| 286 | Eigenen Testserver auf Port 4199 beendet | |
| 287 | Dieser Eintrag als eigener Commit gepusht | keine Änderung an der App |

**Stand:** Alle Punkte aus `claude2codex.md`, die Claude ohne Rückmeldung
erledigen kann, sind erledigt. Offen bleiben:

| Punkt | Wer | Was fehlt |
| --- | --- | --- |
| OPT-09 Lehrkraft-Bestätigung absichern | Jakob entscheidet | ob und wie (z. B. Code der Lehrkraft); an der Bestätigung hängen die NAGOLD |
| OPT-15 Test am Schul-PC | Jakob im Unterricht | Checkliste in Abschnitt 0.16 |
| OPT-16 Lernstand nach `state.js`, `styles.css` aufteilen | Claude oder Codex | reine Aufräumarbeit ohne Nutzen für Lernende; greift tief in Codex' Teile ein, deshalb in Absprache mit Codex |

Nächste Handlungsnummer: 288.

### 0.49 Release 0.39.2: `app.js` aufteilen, Schritt 3 [Claude, 2026-10-09]

Bezug: OPT-16. Keine sichtbare Änderung. In 0.48 hatte Claude diesen Schritt
als „in Absprache mit Codex“ zurückgestellt; er ließ sich aber ohne inhaltliche
Änderung am Code erledigen, deshalb jetzt umgesetzt.

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 288 | `state.js` neu: Vorgabewerte (`defaultState`), Muster für Kürzel und Klasse, `normalizeStudentCode`, `isValidStudentCode`, `normalizeClassName`, `isValidClassName`, `createOpaqueId`, `isOpaqueId`, `shortIdentity`, `uniqueAllowedStrings`, `worksheetAnswerLimit`, `normalizeState`, `playgroundSchemas` – per Skript zeichengleich aus `app.js` ausgeschnitten → `window.WORKBENCH_STATE` | ohne DOM, ohne Speicherzugriff; Verfasser des Codes: Codex |
| 289 | `app.js`: Blöcke entfernt, ein Absatz bindet `state.js` ein. `loadState`, `saveState`, Rettungskopie und Import bleiben in `app.js` | 4515 → 4310 Zeilen |
| 290 | `index.html`: `state.js` nach `backup.js` geladen; `tools/build-site.cjs`: in die Liste der öffentlichen Dateien (je eine Zeile in Codex-Dateien) | |
| 291 | `tests/state.test.js` neu (8 Tests): Kürzel und Klasse, Kennungen, leerer/unbrauchbarer Stand, gültiger Stand bleibt erhalten und ist nach zweiter Bereinigung unverändert, Unbekanntes/Doppeltes/Überlanges wird entfernt oder gekürzt, Entwürfe des freien SQL-Labors, Ladereihenfolge | `normalizeState` war bisher nur mittelbar über Browsertests abgedeckt |
| 292 | Einzige inhaltliche Änderung, in Claudes eigenem Rettungszweig von `loadState`: Bei unlesbarem Lernstand wird jetzt eine tiefe Kopie der Vorgabewerte verwendet (`structuredClone`) statt einer flachen. Vorher hätten sich spätere Einträge in die gemeinsamen Vorgabe-Listen geschrieben | beim Lesen des Codes für die Auslagerung aufgefallen; kein beobachteter Fehler |
| 293 | Versionsangaben auf `0.39.2`; `CHANGELOG.md`, `README.md`, Wegweiser, `claude2codex.md`, Merkzettel (Tag-Bereich) | |
| 294 | Eigenen Testserver auf Port 4199 gestartet, nach den Tests beendet | keine fremden Prozesse berührt |

**Prüfung**

- 176 Node-Tests (8 neu) und 2 Python-Tests bestanden.
- Alle 32 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199),
  darunter `state-rescue` (unlesbarer Lernstand), `backup-safety`,
  `study-workflow` und `notebook-drawing` (Sicherung laden und speichern).

**Nicht geprüft:** Schul-PCs; echte Lernstände von Lernenden aus älteren
Versionen (nur die in den Tests nachgebildeten).

**Stand OPT-16:** `app.js` hatte vor Schritt 1 4605 Zeilen und hat jetzt
4310, obwohl seither OPT-23 dazukam. Ausgelagert und direkt getestet sind
SQL-Prüflogik, Prüfsumme und Lernstand-Bereinigung. Offen ist nur noch das
Aufteilen von `styles.css`.

Nächste Handlungsnummer: 295.

### 0.50 Veröffentlichung 0.39.2 geprüft [Claude, 2026-10-09]

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 295 | Vor dem Commit `git fetch` und `git status`: keine fremden Änderungen | |
| 296 | Commit `7c20e52` gepusht; Actions-Lauf (Tests und Deployment) erfolgreich | https://jakobsawazki.github.io/WorkbenchLab/ |
| 297 | Live geprüft: `index.html` mit `v=0.39.2`, `state.js` abrufbar | |
| 298 | Sicherungs-Tag `v0.39.2` gesetzt und gepusht | Wiederherstellung wie in Abschnitt 0.1 |
| 299 | Eigenen Testserver auf Port 4199 beendet | |
| 300 | Berichtigung: Zeilenzahlen von `app.js` in 0.47 und 0.49 waren geschätzt und ungenau. Mit `git show <Tag>:app.js` nachgezählt und dort korrigiert | `v0.38.1`: 4605 · `v0.39.0`: 4546 · `v0.39.1`: 4515 · `v0.39.2`: 4310 |
| 301 | Dieser Eintrag als eigener Commit gepusht | keine Änderung an der App |

**Offene Punkte**

| Punkt | Wer | Was fehlt |
| --- | --- | --- |
| OPT-09 Lehrkraft-Bestätigung absichern | Jakob entscheidet | ob und wie; an der Bestätigung hängen die NAGOLD |
| OPT-15 Test am Schul-PC | Jakob im Unterricht | Checkliste in Abschnitt 0.16 |
| OPT-16 `styles.css` aufteilen | Claude oder Codex | reine Ordnungsarbeit; die Reihenfolge der Regeln bestimmt das Aussehen, deshalb nur mit Bildvergleich vorher/nachher sinnvoll |

Nächste Handlungsnummer: 302.

### 0.51 Release 0.39.3: `styles.css` aufteilen (OPT-16, Schritt 4) [Claude, 2026-10-09]

Bezug: OPT-16, letzter Teil. Keine sichtbare Änderung. In 0.50 hatte Claude
diesen Schritt als „nur mit Bildvergleich sinnvoll“ offen gelassen; genau so ist
er jetzt umgesetzt.

**Vorgehen:** Die Datei wurde an fünf Leerzeilen zwischen zwei Regeln
geschnitten, nichts umsortiert. Beide Seiten laden die sechs Dateien in
derselben Reihenfolge. Damit bleibt die Kaskade (welche Regel gewinnt) gleich.

| Datei | Zeilen | Inhalt |
| --- | ---: | --- |
| `styles.css` | 1134 | Grundlagen, Farbwerte, Seitenrahmen, Navigation, Kopfzeile, Startseite, Lernpfad |
| `styles-lesson.css` | 813 | Lerneinheit: Ablauf, Inhalt, Arbeitsblatt, Notizen, Arbeitsauftrag, Abschluss |
| `styles-practice.css` | 616 | Übungen: Ergebnisbanner, SQL-Labor, Coach, Tabellen, Kardinalitäten, Diagrammaufgaben |
| `styles-visuals.css` | 809 | Schaubilder der Einheiten, Erfolge, Workbench-Start, nachgebaute Fenster |
| `styles-shared.css` | 1192 | spätere Schichten: gemeinsame Flächen, Dialoge, Dunkelmodus, Bildschirmbreiten, Lernkarte |
| `styles-extensions.css` | 213 | Claudes Erweiterungen seit 0.26.0 |

Die Namen beschreiben den Schwerpunkt; weil nichts umsortiert wurde, sind die
Themen nicht überall scharf getrennt (Verfasser der ersten fünf Teile: Codex).

| Nr. | Handlung | Ergebnis / Ort |
| ---: | --- | --- |
| 302 | Eigenen Testserver auf Port 4199 gestartet | |
| 303 | Hilfsskripte für den Bildvergleich geschrieben (`shots.cjs`, `cmp.cjs`): 416 Ansichten = alle 12 Übersichtsseiten, 21 Einheiten, 59 Übungen, 4 Befehle, Druckansicht, 3 Dialoge, Klassenübersicht leer und mit Sicherung; je 1440 und 390 Pixel, hell und dunkel | nur im Arbeitsordner außerhalb des Repositorys, nicht versioniert |
| 304 | Fehlgriff: Die ersten zwei Serien desselben Stands unterschieden sich in 91 Bildern (meist 1 bis 30 Pixel, Abweichung 1; Startseite und Profildialog deutlich) | Ursache: Grafikkarten-Rundung und zu frühe Aufnahme. Aufnahme ohne Grafikkarte, mit Warten auf Schriften und Bilder → nur noch 6 Bilder mit höchstens 79 abweichenden Pixeln |
| 305 | Zwei Serien vor der Änderung aufgenommen (Stand `v0.39.2`) | Maß für das Grundrauschen |
| 306 | `styles.css` per Skript geschnitten. Das Skript bricht ab, wenn die sechs Stücke, mit je einer Leerzeile verbunden, nicht exakt die alte Datei ergeben, oder wenn ein Stück offene Klammern hat | verlustfrei; je Datei drei Kommentarzeilen als Kopf ergänzt |
| 307 | `index.html`, `lehrkraft.html`: sechs `<link>`-Zeilen statt einer; `tools/build-site.cjs`: fünf neue öffentliche Dateien (Codex-Dateien) | |
| 308 | `tests/styles-split.test.js` neu (4 Tests): Reihenfolge in beiden Seiten, veröffentlicht, Klammern geschlossen, kein `@import`, keine ungeladene Style-Datei; `tests/teacher-overview.test.js`: Zahl der Verweise 9 → 14 | |
| 309 | Zwei Serien nach der Änderung aufgenommen und mit beiden Serien davor verglichen | siehe Prüfung |
| 310 | Versionsangaben auf `0.39.3`; `CHANGELOG.md`, `README.md`, Wegweiser, `claude2codex.md` (OPT-16 erledigt, Dateikarte), Merkzettel (Tag-Bereich, Regel zur Reihenfolge) | |

**Prüfung**

- Bildvergleich: In jedem der vier Vergleiche vorher/nachher sind 409 bis 413
  von 416 Bildern bytegleich. Die übrigen (höchstens 156 Pixel, Kopfzeile bzw.
  eine sehr lange Einheit) unterscheiden sich genauso zwischen zwei Aufnahmen
  desselben Stands; kein Bild weicht in beiden Nachher-Serien von beiden
  Vorher-Serien ab.
- 180 Node-Tests (4 neu) und 2 Python-Tests bestanden.
- Alle 32 Browsertests auf dem endgültigen Stand bestanden (Edge, Port 4199).
- Gebaute Seite (`_site`) enthält alle sechs Dateien.

**Nicht geprüft:** andere Browser als Edge; Schul-PCs; sehr langsame
Verbindung (sechs statt einer Style-Datei beim ersten Aufruf, danach aus dem
Zwischenspeicher).

**Für Codex:** Neue Regeln ans Ende der thematisch passenden Datei; soll eine
Regel eine frühere überschreiben, muss sie in derselben oder einer späteren
Datei stehen. Die Reihenfolge der `<link>`-Zeilen nicht ändern.

Damit ist OPT-16 erledigt. Nächste Handlungsnummer: 311.

<!-- CLAUDE:END -->

## Archiv: Abschnitte 1 bis 12 und Anhänge [Claude, 2026-10-09]

Die früheren Abschnitte dieser Datei (Verfasser: Codex, Stand 3. Oktober 2026, bis Release 0.21.0)
stehen unverändert in [`archiv/PROJEKTDOKUMENTATION_BIS_0_21.md`](archiv/PROJEKTDOKUMENTATION_BIS_0_21.md):

- 1. Projektziel
- 2. Aktueller Funktionsstand
- 3. Lernpfad
- 4. L1.1 Tabellenentwurf
- 5. Lernprofil und JSON-Sicherung
- 6. Versionsverlauf
- 7. Qualitätssicherung
- 8. Erledigte Aufgaben
- 9. Offene Vor-Ort-Prüfungen und weitere Ausbauideen
- 10. Ideen für spätere Versionen
- 11. Arbeits- und Veröffentlichungsregeln
- 12. Wichtige Dateien
- Anhaenge: bisherige Projektdokumente

Der Git-Verlauf dieser Datei enthält den früheren Gesamtstand; letzter Commit davor: `ff12930`.
