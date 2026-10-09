# WorkbenchLab Projektdokumentation

Stand: 9. Oktober 2026 (Europe/Berlin) [Claude, 2026-10-09: Kopfzeilen aktualisiert]

Aktueller Release-Stand: **0.26.1** [Claude, 2026-10-09; zuvor stand hier 0.21.0, tatsächlich war 0.25.3 veröffentlicht]

Veröffentlichter Stand: siehe Abschnitt 0.4.

Mitwirkende: Jakob Sawazki, Codex, seit 8. Oktober 2026 zusätzlich Claude. Claudes Einträge stehen in Abschnitt 0 und sind dort sowie an jeder anderen Stelle mit `[Claude, Datum]` gekennzeichnet.

Repository: `https://github.com/JakobSawazki/WorkbenchLab`

Live-Seite: `https://jakobsawazki.github.io/WorkbenchLab/`

Abschlussprüfung der bisherigen konkreten Änderungswünsche:
[Abnahme vom 3. Oktober 2026](ABNAHME_2026-10-03.md).

Auf erneuten ausdrücklichen Auftrag werden nun auch die sieben eigenständigen
Lehrbuch-Manuskriptdateien und vier ergänzenden Projekttexte veröffentlicht.
Das Lehrbuch bleibt ein gekennzeichneter Entwurf; Originalmaterialien und
lokale Testexporte bleiben ausgeschlossen. Die Abnahme dokumentiert den
vorherigen Veröffentlichungsstand; dieser Nachtrag erweitert den Dateiumfang,
nicht die Funktionen der App.

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

<!-- CLAUDE:END -->

## 1. Projektziel

WorkbenchLab ist ein öffentliches Lernportal für die
Bildungsplaneinheit BPE6 „Relationale Datenbanken“ in Jahrgangsstufe 1. Die
Schülerinnen und Schüler sollen Fachwissen aufbauen, in MySQL Workbench
anwenden, browsergestützte Übungen bearbeiten, eigene Notizen führen und ihren
Fortschritt nachvollziehbar als JSON-Datei sichern.

Die fachliche Grundlage bilden der Bildungsplan und das lokale Materialpaket
„Relationale Datenbanken“ des Landesbildungsservers Baden-Württemberg, Stand
31.07.2025. Die Originalmaterialien unter `resources/` werden nicht
veröffentlicht. Öffentliche Texte, Illustrationen und Interaktionen werden
eigenständig und webgerecht aufbereitet.

## 2. Aktueller Funktionsstand

- statische Single-Page-App ohne erforderliches Backend
- Dark Mode als Standard; Light Mode über das Sonnen-/Mond-Symbol
- dunkle Graphitflächen mit metallischen Werkzeugen und fotorealistischem
  Titan-Datenbank-Icon; persönlich einstellbare Farben und Schriftgröße
- fünf Lernfortschritte `L1` bis `L5`
- 21 Lerneinheiten und 38 Übungen
- sequenzielle Freischaltung: zunächst nur `L1.1`, danach jeweils die nächste
  Einheit; der nächste Lernfortschritt folgt erst nach dem vorherigen
- zweistufiges Lernpfad-Menü in der Seitenleiste für Desktop und Tastatur
- anklickbarer Breadcrumb nach dem Muster `Lernfortschritt 1 > L1.1`
- Profilbearbeitung über das gesamte anklickbare Profilfeld mit Hover-Rahmen
- Entwicklerschalter ausschließlich im geöffneten Profilfenster mit `AltGr + S`
  ein- und ausblendbar; der Schalter öffnet oder sperrt alle Einheiten nur
  für die aktuelle Browsersitzung und vergibt keine XP
- integrierte Arbeitsaufträge für Browser, Heft und MySQL Workbench
- Lektionsabschluss erst nach Selbstkontrolle, bestandenem Verständnischeck
  und Lehrkraftbestätigung
- XP, Level, Erfolge und Aktivitätstage
- lokales SQL-Labor mit `sql.js`, deterministischer Prüfung und SQL-Coach
- eigenständige eERM- und Workbench-Illustrationen in HTML/CSS
- lokales Lernprofil mit Schülerkürzel und Klasse
- JSON-Sicherung (Format 6) mit Profil-, Geräte- und Übertragungsinformationen
- sechs ergänzende YouTube-Tutorials unter Nachschlagen, mit direkten
  Sprunglinks aus den passenden L1-/L2-Einheiten
- ausblendbare Navigation; Lernfortschritte und Arbeitsreihenfolge anfangs
  zugeklappt; farbliche Unterscheidung der Arbeitsbereiche
- lokal gespeicherte, fett dargestellte Textmarker in Gelb, Mint, Koralle
  und Grün, mit Radierer
- eingebettetes Lernheft unter „Meine Notizen“ mit allgemeinen Notizen und
  den bereits bestehenden Lektionszusammenfassungen
- persönliche Zeichnungen je Notiz mit Stift, Radierer, Farben, Strichstärke,
  Rückgängig/Wiederholen und PNG-Export; Skizzen sind Teil der JSON-Sicherung
- fotorealistische BPE6-Relief-Landkarte mit fünf anklickbaren Stationen

## 3. Lernpfad

| Kürzel | Lernfortschritt | Einheiten |
| --- | --- | ---: |
| L1 | Eine Tabelle aufbauen und mit SQL nutzen | 10 |
| L2 | Mehrere Tabellen modellieren und verbinden | 4 |
| L3 | M:N-Beziehungen und 3NF sicher beherrschen | 3 |
| L4 | Schrittweise normalisieren | 1 |
| L5 | Digitale Spuren und Big Data beurteilen | 3 |

Die Reihenfolge wird aus `learning-path.js` abgeleitet. Eine Einheit ist
freigeschaltet, wenn die unmittelbar vorherige Einheit abgeschlossen ist. Das
gilt auch für Direktlinks und die zugehörigen Übungen. Der Entwicklermodus
überbrückt die Sperren zur Unterrichtsvorbereitung, verändert aber keine
Abschlüsse und vergibt keine XP.

## 4. L1.1 Tabellenentwurf

L1.1 wurde am 20.09.2026 vollständig aus folgenden lokalen Quellen
eigenständig neu aufbereitet:

- `L1_1 Information Tabellenentwurf.docx`
- `L1_1 Aufgabe Tabellenentwurf.docx`
- `L1_1 Vorlage Tabellenentwurf.docx`

Umgesetzt wurden:

- eine eigene responsive Illustration „Kontaktkarten werden Relation“
- Definitionen für Datensatz/Tupel, Primärschlüssel, Attribut und Attributwert
- Entwurfsregeln für Tabellenname, Attributname, Atomarität und Schlüssel
- Datentypentabelle für `INT`, `DOUBLE`, `VARCHAR(n)`, `DATE`, `TIME` und
  `BOOLEAN`/`TINYINT(1)` einschließlich Bedeutung und Beispiel; die frühere
  pauschale Byteangabe für `VARCHAR(n)` wurde fachlich präzisiert
- Fahrschul-Fallsituation mit nachvollziehbarem Praxisauftrag
- vier Freitextfelder für Definitionen in eigenen Worten
- direkt ausfüllbare Tabellenentwurfsvorlage mit elf Attributzeilen,
  Datentypauswahl, Zeichenanzahl und genau einem Primärschlüssel
- eigene Zusammenfassung und Leitfragen
- automatische lokale Speicherung aller Eingaben und Aufnahme in den
  JSON-Export

### Unterrichtsstart mit L1.1 bis L1.6

| Einheit | Schwerpunkt | Lernprodukt | Arbeitsort |
| --- | --- | --- | --- |
| L1.1 | atomare Attribute, Schlüssel und Datentypen | digitaler Tabellenentwurf | Browser und Heft |
| L1.2 | ERD und Relationenschema aus `L1_2.1` und Aufgabe `L1_2` | vier digitale Antworten und ERD-Skizze | Browser und Heft |
| L1.3 | EER-Modell mit einer Tabelle nach `L1_2.2` | `.mwb`-Datei und digitales Prüfblatt | Informatik-Stick, MySQL Workbench und Browser |
| L1.4 | Modell synchronisieren und fiktive Daten importieren nach `L1_3`/`L1_4` | Schema, SELECT-Kontrolle und digitales Prüfblatt | Informatik-Stick, MySQL Workbench und Browser |
| L1.5 | Projektion und Sortierung nach `L1_5.1` | drei SQL-Abfragen, digitales Blatt und drei Browserübungen | MySQL Workbench und Browserlabor |
| L1.6 | Selektion nach `L1_5.3` | zwölf digitale Antworten und fünf Browserübungen | MySQL Workbench und Browserlabor |

Die Einheiten bleiben nacheinander gesperrt und werden erst nach Abschluss
der vorherigen Einheit geöffnet. L1.2 führt noch keine zweite Tabelle und
keine Kardinalität ein; L1.3 erzeugt zunächst nur eine Modelldatei. Die
serverseitige Datenbank folgt in L1.4. Die alten, thematisch unpassenden
Browserchecks für L1.2 und L1.3 wurden entsprechend ersetzt.

Vor der ersten Stunde:

1. Bereitstellung für die Schüler-PCs klären. `127.0.0.1:4174` ist nur auf
   dem jeweiligen Rechner erreichbar; GitHub Pages zeigt noch Version 0.5.0.
2. An einem echten Schul-PC Informatik-Stick, `MySQL starten`, MySQL Workbench,
   EER-Diagramm, das erneute Öffnen einer `.mwb`-Datei und die Synchronisierung
   samt Importskript prüfen.
3. Schülerkürzel und Klasse im Lernprofil anlegen lassen. Den JSON-Export als
   Lernstandssicherung erklären; die `.mwb`-Datei muss getrennt aufbewahrt
   werden und ist **nicht** im JSON enthalten.
4. Die Lehrkraft bestätigt den fachlichen Abschluss nach Sichtung des
   Lernprodukts. Die Browser-Checkbox ist kein manipulationssicherer
   Nachweis und ersetzt die persönliche Kontrolle nicht.

Die Browser- und Inhaltstests sind abgeschlossen; die Punkte 1 und 2 sind
für einen produktiven Unterrichtseinsatz noch offen.

## 5. Lernprofil und JSON-Sicherung

### 5.1 Pflichtangaben

- Schülerkürzel im Format `ABC.DEF`
- offizielle Klassenkurzform, zum Beispiel `J1-1` oder `WGJ1/1`

Das Kürzel wird normalisiert; Umlaute werden in `AE`, `OE`, `UE` und `SS`
umgeschrieben. Der vollständige Name wird nicht gespeichert.

### 5.2 Nachvollziehbare Kennungen

Jedes neue Profil erhält:

- eine zufällige portable Profil-ID
- einen Profilcode als kurze Anzeigeform
- Zeitstempel der Profilerstellung
- Kennung des Browserprofils, auf dem das Lernprofil angelegt wurde

Jedes Browserprofil erhält lokal:

- eine zufällige Geräte-ID
- einen kurzen Gerätecode
- Zeitstempel der Erzeugung

Beim Import auf ein anderes Browserprofil bleibt das Herkunftsgerät des
Lernprofils erhalten. Zusätzlich wird eine begrenzte Übertragungshistorie mit
Quell-Export, Quellgerät, Zielgerät und Importzeitpunkt geführt.

### 5.3 Exportformat 5

Version 5 enthält unter anderem:

- App- und Formatversion
- Export-ID und Exportzeitpunkt
- Schülerkürzel und Klasse
- Profil-ID, Profilcode und Profilherkunft
- aktuelles Exportgerät und grobe Browserumgebung
- XP- und Fortschrittszusammenfassung
- Lektionsabschlüsse, Quizstatus und Abschlusschecks
- SQL-Entwürfe und Modellierungsantworten
- eigene Notizen und digitale Arbeitsblätter
- allgemeine Lernheftnotizen und Textmarkierungen mit Textankern
- vektorbasierte Zeichnungen je Notiz, einschließlich Radieroperationen
- SHA-256-Prüfsumme über den vollständigen Export ohne den Integritätsblock

Beim Import wird die Prüfsumme vor der Übernahme kontrolliert. Die Formate 1
bis 5 bleiben lesbar; Formate 1 und 2 besitzen keine Prüfsumme. Format 5
verhindert, dass ältere WorkbenchLab-Versionen eine neue Sicherung annehmen
und die ihnen unbekannten Zeichnungen bei einer erneuten Sicherung verlieren.
Format 6 schützt zusätzlich die neuen Radierergrößen (24, 48 und 96 logische
Canvas-Pixel) vor dem Verlust beim Import in ältere Apps. Bestehende Zeichnungen
mit den früheren Radierstärken bleiben gültig. Neue Format-6-Dateien benötigen
WorkbenchLab ab 0.21; die noch öffentliche Version 0.20 lehnt sie sicher ab.
Exportdateien werden kompakt serialisiert. Export und Import verwenden dieselbe
Größengrenze von 25 MiB, damit eine erfolgreich erzeugte Datei nicht an einer
kleineren Importgrenze scheitert. Aufbewahrte ältere, eingerückte JSON-Dateien
bleiben lesbar. Fehler werden im geöffneten Sicherungsdialog angezeigt;
außerhalb des Dialogs erscheint eine kurze Rückmeldung. Während eines laufenden
Dateivorgangs sind die beiden Dateiaktionen gesperrt. Dieser Schutz ersetzt
weder eine Dateisicherung noch eine serverseitige Signatur.
Technische Angaben erscheinen nicht im Schülerdialog; die kurze Ladebestätigung
zeigt Kürzel, Klasse und XP und warnt vor dem Ersetzen des aktuellen Lernstands.

### 5.4 Lokale Speicherung, Markierungen und Lernheft

Eingaben werden beim Bearbeiten im Browser gespeichert. Bei einem Fehler des
Browserspeichers bleiben die Daten im geöffneten Tab bearbeitbar, und der
Disketten-Symbol wird hervorgehoben und der Sicherungsdialog warnt vor dem
Speicherfehler. Browserdaten können gelöscht werden oder an einem anderen PC
fehlen. Download und Laden erfolgen ausschließlich über das Disketten-Symbol;
der zusätzliche Hinweisblock am Seitenende wurde auf Wunsch entfernt.

Im Sicherungsdialog kann der Schüler zusätzlich einen automatischen
JSON-Download nach jedem erstmals abgeschlossenen Lernabschnitt einschalten.
Diese Option ist zunächst aus. Der Browser legt Downloads gemäß seinen
Einstellungen ab oder fragt nach einem Ort. Eine Website kann nicht ohne
Benutzerfreigabe fortlaufend dieselbe Datei im Download-Ordner überschreiben.
Der Export verwendet einen unveränderlichen Schnappschuss des Lernstands,
damit Eingaben während der Prüfsummenberechnung die Sicherung nicht beschädigen.

Die Textmarker arbeiten im Informationsteil der Lektionsseiten, einschließlich
Begriffen, Regeln, Datentypen und Codebeispielen. Gespeichert werden der
Lektionsbezug, der Textblock, die Start-/Endposition, der markierte Text und
die Farbe. Beim Wiederherstellen muss der Text zum Anker passen; überarbeitete
Inhalte werden dadurch nicht versehentlich an einer anderen Stelle markiert.
Umfärben und Radieren erhalten nicht ausgewählte Reststücke und verändern
weder den Unterrichtstext noch die Inline-Code-Struktur.

„Meine Notizen“ enthält ein allgemeines Lernheft und eine Zusammenfassung je
Lerneinheit. Die Zusammenfassung verwendet dieselben Daten wie das Notizfeld
direkt in der Lektion. Der Texteditor bietet Überschrift-/Listen-/Checklisten-
Einfügung, Datum, Kopieren, Textdatei-Download und Suche in Titeln und Inhalten.
Es wird kein externer Editor geladen. Eingaben werden als Text behandelt;
HTML- oder Skripteinträge werden nicht ausgeführt. Maximal 12.000 Zeichen je
Notiz und 400 Markierungsabschnitte je Lektion sind vorgesehen.

### 5.5 Technische Sicherheitsgrenzen

Eine Browserseite auf GitHub Pages kann keine MAC-Adresse auslesen. Eine lokale
IP-Adresse ist durch heutige Browser ebenfalls nicht zuverlässig verfügbar;
eine öffentliche IP-Adresse wäre häufig nur die gemeinsame Schul-/Routeradresse
und würde einen externen Dienst erfordern. Deshalb werden weder MAC noch IP
vorgetäuscht. Im Export stehen diese Werte auf `null` und die Einschränkung wird
erklärt.

Die SHA-256-Prüfsumme erkennt beschädigte oder nachträglich veränderte Dateien,
ist aber keine geheime digitale Signatur. Weil die Anwendung öffentlich und
clientseitig ist, könnte eine technisch versierte Person eine Datei samt
Prüfsumme neu erzeugen. Für eine belastbare Betrugsprävention sind später ein
Lehrkraft-Schlüssel, signierte Abgaben oder ein authentifiziertes Backend nötig.
Die Lernstandsdatei bleibt daher ein Nachweisbaustein und ersetzt nicht die
Beobachtung und Bestätigung durch die Lehrkraft.

## 6. Versionsverlauf

### 0.21.0, 01.10.2026

- Veröffentlichung ausdrücklich beauftragt. Release beinhaltet die bisherigen
  lokalen Änderungen; Originalmaterialien, Testexporte, Lehrbuchentwurf und
  separate unversionierte Dokumente bleiben unveröffentlicht.
- [x] Release-Commit `ad3b09a` auf `main` gepusht. GitHub-Pages-Lauf
  `36929273971` erfolgreich. Öffentliche Seite liefert HTTP 200 und verweist
  auf Version 0.21.0. SHA-256-Abgleich für Lernpfad, App, CSS, neue Karten-WebP
  und JOIN-Download bestätigt den tatsächlichen Inhalt auf der Online-Seite.
- [x] 37 Node-Tests erfolgreich. Sieben Browserdurchläufe lokal und acht
  auf der veröffentlichten HTTPS-Seite bestanden: Lernworkflow, Darstellung,
  Notizen/Zeichnungen, XP, Sicherungsgrenzen, Siedlungskarte, M:N-Diagramm und
  online zusätzlich L3.1-Arbeitsblatt. HTTP 404 für lokale Testgrafik,
  Lehrbuch-README und nicht freigegebenes Technikdokument bestätigt.

- [x] L3.1 anhand des Informationsblatts und der sechs Modellierungsaufgaben
  erweitert, ohne Musterlösungsdateien zu lesen. 15 ausfüllbare Aufträge:
  Fahrschule und Fahrradvermietung als Kern, Immobilien, Wartungen,
  Motorsportclub und Schulen als optionale Transfers. Drei aufklappbare
  Arbeitsblattgruppen vermeiden eine gleichzeitig sichtbare Aufgabenfülle.
- [x] M:N relational darstellbar erklärt; Fremdschlüsselpaar als Schlüssel
  nur bei einmaliger Zuordnung, separate Vorgangsnummer bei Wiederholungen,
  UNIQUE-Regel und zusätzliche Geschäftsregeln unterschieden. Mindest-
  beteiligung, NOT NULL und 0..N präzisiert. Fahrschulauftrag enthält bewusst
  keinen unaufgeforderten Schülerbezug; Wartungszeiten werden je Beteiligung
  und Berufsabschlussdaten je Abschluss erfasst. Zwei .mwb-Dateien speichern
  und erneut öffnen; kein unnötiger SQL-Download für Modellierungsaufgaben.
- [x] Drei neue Tests für Quellenabdeckung, Schlüssel-/Kardinalitätstheorie
  und tatsächliche PK-/FK-/NOT-NULL-Constraints im SQLite-Testmodell.
  Browserprüfung: 15 Felder und gespeicherte Antworten bei 390/1440 Pixeln;
  Diagramm bei vier Breiten, beiden Themes und großer Schrift. Tabellen und
  Kardinalitäten stehen in getrennten Zeilen statt mehrdeutigem Flex-Umbruch.
  Die Speicherung und das Wiederöffnen realer Workbench-Dateien bleiben vor
  Ort zu prüfen; Browsertests ersetzen diese Kontrolle nicht.
- [x] L2.4 anhand von L2_2.3 Information/Aufgabe und L2_4 Aufgabe ausgebaut,
  ohne Musterlösungsdateien zu lesen. Fünf Zwei-Tabellen-, 15 Mehrtabellen-
  und sieben Zusatzaufträge eigenständig übertragen. Große Aufgabenmenge in
  drei native aufklappbare Abschnitte gegliedert; nur Einstieg zunächst offen.
  Vorhandene Arbeitsblätter behalten ihre bisherige Darstellung.
- [x] Fiktiver Download `assets/sql/l2-4-join-testdaten.sql`: eigenes Schema
  `workbenchlab_l2_4`, neun Schüler, vier Lehrkräfte, fünf Orte. Kein vorhandener
  Bestand verändert. Ein leerer Ort und eine Lehrkraft ohne Schüler machen
  LEFT JOIN und COUNT(Child-PK) überprüfbar; Talort ohne e kontrastiert den
  LIKE-Filter. Namensgleiche Attribute und zwei Rollen der Ortstabelle erklärt.
- [x] Originalaufträge bei T4/M10 um leere Gruppen präzisiert. Zeilenzahl
  eines INNER JOIN nicht verallgemeinert. Kalenderjahresalter statt heutiges
  vollständiges Alter; ungerundete Durchschnitte für Unterabfragen statt
  FORMAT-Text als Vergleichsgrenze. Fachlicher Abgleich mit
  [MySQL JOIN](https://dev.mysql.com/doc/refman/8.0/en/join.html) und
  [skalaren Unterabfragen](https://dev.mysql.com/doc/refman/8.0/en/scalar-subqueries.html).
- [x] Zwei neue Tests für eindeutige Gruppenzuordnung sämtlicher 27 Felder,
  kartesisches Produkt, INNER/LEFT JOIN, leere Gruppen, Schlüsselzählung,
  striktes HAVING, DISTINCT/LIKE, zwei Ortsaliasnamen und skalare Vergleiche.
  Browserprüfung bei 390/1440 Pixeln: Auf-/Zuklappen, Speicherung, Downloadlink,
  Layout und Screenshotkontrolle. Bestehender Arbeitsblatt-/Textmarker-/Notiz-
  und JSON-Workflow weiterhin erfolgreich. SQL-Test nutzt SQLite; reale
  MySQL/MariaDB-Funktionen, Importrechte und Workbench bleiben vor Ort zu prüfen.
- [x] Landkarte auf Wunsch des Nutzers neu gestaltet: fotorealistische,
  zunehmend große Siedlungen vom blauen Dorf L1 bis zur korallfarbenen Stadt L5.
  Ein einziger Weg verbindet L1–L2–L3–L4–L5 ohne Abkürzungen. Graphitrelief,
  metallische Materialien und die fünf bestehenden Lernfortschrittfarben bleiben.
  Mit eingebauter Bildgenerierung in zwei Durchgängen erstellt; letzter
  Durchgang entfernt zwei ungewollte Direktverbindungen. Promptprotokoll:
  `documentation/SETTLEMENT_MAP_PROMPT.md`.
- [x] Neue Assets `assets/bpe6-settlement-map.png` und `.webp` mit 1672×941
  Pixeln; WebP ca. 449 kB. Altes Kartenbild unverändert aufbewahrt. HTML-Pins
  neu positioniert; Alternativtext beschreibt die Reihenfolge. Menüs, Touch,
  Tastaturzugang und vorhandene Sperrlogik bleiben erhalten.
- [x] Eigene Kartenprüfung bei 390/1440/1920 Pixeln: Bild geladen, fünf Buttons
  innerhalb des Bildes, keine überlappenden Buttons oder horizontales Scrollen,
  gesperrte Lerneinheit bleibt gesperrt, verfügbare Einheit erreichbar.
  Screenshotkontrolle auf Desktop/Mobil und bestehende Notiz-/Zeichnungsprüfung
  bestanden. Noch nicht veröffentlicht.
- [x] L2.3 lokal vertieft und gezielt geprüft: sieben Aufträge aus dem
  Drei-Tabellen-Originalblatt übertragen, zwei Zusatzaufträge zu ungültigen
  Verweisen und Löschregeln. Rollen von Parent/Child, Grenzen der referentiellen
  Integrität und RESTRICT/CASCADE/SET NULL erläutert. Echte Fehlermeldungen
  dokumentieren statt einen Fehlercode vorauszusetzen; Schutzfunktionen bleiben
  eingeschaltet. Personen und Kontaktdaten vollständig fiktiv.
- [x] `assets/sql/l2-3-integritaet-testdaten.sql` legt ausschließlich den
  getrennten Anfangsbestand `workbenchlab_l2_3` an, mit InnoDB, drei NOT-NULL-
  Fremdschlüsseln und expliziten RESTRICT-Regeln. Daten aus L2.2 bleiben erhalten.
  Lehrkraftabgleich von Schema/Importrechten und Workbench-Test stehen aus.
- [x] Zwei neue Tests prüfen Aufgabenabdeckung und aktive Fremdschlüssel im
  SQL-Testbestand. Ungültige INSERT/UPDATE/DELETE verändern den Bestand nicht;
  erlaubte Einfügereihenfolge und umgekehrte Löschreihenfolge geprüft,
  Kontrollpersonen und Orte erhalten. SQLite verifiziert nicht Workbench-
  Fehlermeldungen oder MySQL-Safe-Updates. Fachlicher Abgleich:
  [MySQL-Fremdschlüssel](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html).
- [x] L2.3-Browserprüfung bei 390/1440 Pixeln: neun Antwortfelder, Speicherung
  nach Neuladen, Downloadlink und Layout. Gemeinsamer Aufgabenblatt-Test leitet
  Freischaltung nun aus der tatsächlichen Modulreihenfolge ab statt nur L1.
- [x] Autarke Inhaltsrunde 22:35 Uhr: L1.10 anhand von drei Informations-
  und sechs Aufgabenblättern L1_6 bis L1_8 vertieft, ohne Musterlösungen zu lesen.
  16 Antwortfelder decken drei Personen-Inserts, zwei Updates, zwei Deletes,
  eine Fahrradlieferung, fünf Preisänderungen, zwei Löschaufträge und eine
  zusätzliche Sicherheitsreflexion ab. Personen, Kontakte und Lieferung
  sind ausdrücklich fiktiv; Aufgaben sind webgerechte Übertragungen.
- [x] Getrennte Datenbank `workbenchlab_l1_10` mit einer Kontrollperson und
  zehn Fahrrädern. Keine vorhandenen Tabellen zurückgesetzt; Download enthält
  nur Anfangsdaten, keine Aufgabenlösungen. Unbekannte Angaben sind NULL-fähig.
  Rechnungsvorlage nennt im Einleitungstext zwei Fahrräder, zeigt aber drei
  physische Fahrräder; Übertragung benennt eindeutig drei, mit freien IDs 20–22.
- [x] Vorher-Nachher-Kontrollen anhand bestätigter Primärschlüssel, Safe Updates
  eingeschaltet lassen, relative Preisänderungen nur einmal. DELETE einer Zeile
  von UPDATE eines Attributs unterschieden. Autocommit/ROLLBACK-Grenzen erläutert.
  Fachabgleich mit [Workbench Safe Updates](https://dev.mysql.com/doc/workbench/en/wb-preferences-sql-editor.html)
  und [MySQL-Transaktionen](https://dev.mysql.com/doc/refman/8.0/en/commit.html).
- [x] Zwei neue Tests prüfen Inhaltsabdeckung und komplette Änderungsfolge,
  erhaltene Kontrollperson, NULL, gerundete Preise, ODER-Zielmenge und strikte
  Preis-/Altersgrenzen (festes Bezugsjahr 2018). Insgesamt 30 Node-Tests bestanden;
  Browserprüfung für Speicherung und Layout bei 390/1440 Pixeln bestanden.
  SQLite-Datentests ersetzen nicht die Abnahme mit Workbench/MariaDB am Schul-PC.
- [x] Autarke Inhaltsrunde 22:27 Uhr: L1.9 mit YEAR, MONTH, NOW, Datumsformat,
  berechneten Preisen und dokumentierter Alterszählung vertieft. Die acht
  Fahrradvermietungsaufträge aus L1_5.6 sind eigenständig paraphrasiert;
  D1–D3 sind Einstiegsaufträge, D4 zur Tageszählung ausdrücklich ein Zusatz.
  Keine Musterlösungsdateien gelesen. R8 legt die Kalenderjahresdifferenz
  fest und erklärt deren Unterschied zu vollständig vergangenen Jahren.
- [x] Optionaler fiktiver Fahrradbestand in `workbenchlab_l1_9`, getrennt von
  Fahrschule und späterer Browser-Mietdatenbank. Sechs Fahrräder mit Preisen
  und Anschaffungsdaten; einmaliges Anlegen, ohne DROP, UPDATE oder DELETE.
  Download benennt Voraussetzung und Attributzuordnung. MySQL-Datenbankanlage,
  FORMAT, NOW und TIMESTAMPDIFF benötigen noch den echten Workbench-Durchlauf.
- [x] Zwei weitere Inhalt-/Datenprüfungen, insgesamt 28 Node-Tests erfolgreich.
  Browserprüfung bei 390/1440 Pixeln für zwölf Antwortfelder, automatische
  Speicherung, Downloadlink und Layout; Screenshots geprüft. SQL-Datentests
  nutzen SQLite und weisen MySQL-spezifische Verifikation nicht als erledigt aus.
  Fachlicher Abgleich mit [MySQL-Datumsfunktionen](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html)
  und [MySQL-Rundung](https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html#function_round).
- [x] Autarke Inhaltsrunde 22:20 Uhr: L1.8 anhand der Informations- und
  Aufgabenblätter L1_5.5 und L1_5.8 vertieft, ohne Musterlösungen zu lesen.
  Sechs Funktions- und acht Gruppierungsaufträge sind direkt ausfüllbar,
  automatisch gespeichert und mit SQL-spezifischen Platzhaltern versehen.
  Die lokale Einheitsnummer L1.8 ist nicht die DELETE-Datei L1_8 im Materialpaket.
- [x] Erklärung unterscheidet COUNT bei NULL, Einzelbetrag und Gesamtbetrag,
  FORMAT als Textdarstellung, WHERE/HAVING und explizites ORDER BY. Technischer
  Abgleich mit den offiziellen MySQL-8.0-Handbuchseiten zu Aggregatfunktionen,
  FORMAT, GROUP BY und ORDER BY; keine automatische Sortierung versprochen.
- [x] Separater Download `assets/sql/l1-8-fahrschule-testfaelle.sql` ergänzt sechs
  ausdrücklich fiktive Zeilen. Originale L1.4-Daten bleiben unverändert.
  Orts-/PLZ-Filter und Grenzen von zwei Personen bzw. 20 Stunden sind prüfbar.
  Skript setzt das eigene Modell und die fünf L1.4-Zeilen voraus, nur einmal
  importieren; keine Tabellenlöschung und keine Musterlösungsabfragen.
- [x] Zwei neue Inhalt-/SQL-Tests und Browserprüfung bei 390/1440 Pixeln:
  14 Antwortfelder, Antworten nach Neuladen, Downloadlink und kein horizontaler
  Überlauf. SQLite prüft die Testdaten und Aggregationslogik, nicht MySQL FORMAT.
  Ein echter Durchlauf mit den Schulversionen von Workbench bleibt erforderlich.
- [x] Autarke Sicherungsrunde 22:05 Uhr: bisherige Importgrenze von 2 MB
  war kleiner als mögliche Zeichnungs-/SQL-Sicherungen. Export jetzt kompakt,
  gemeinsame Export-/Importgrenze 25 MiB. Jeder angebotene Download wird vorher
  gegen dieselbe Grenze geprüft; größere Dateien werden nicht erzeugt.
- [x] Manuelle Exportfehler werden abgefangen statt als unbehandelte Promise
  zu enden. Kurze, zugängliche Statusmeldung im Sicherungsfenster; ohne Fehler
  bleibt sie ausgeblendet. Fehlerhafte JSON-Dateien erhalten verständlichen
  deutschen Text. Dateiaktionen sind während des Vorgangs gesperrt; Dateiname
  wird passend zum Snapshot vor der asynchronen Prüfsumme festgelegt.
- [x] Import weist Versionsnummern unter 1 und nicht objektförmige Nutzdaten
  zurück. Prüfsumme und Identitätskonsistenz bleiben verpflichtend für die
  entsprechenden Versionen. Abbruch/Fehler verändert den aktuellen Lernstand
  nicht; Dateifeld wird zurückgesetzt und erlaubt erneutes Laden.
- [x] Neue Sicherungs-Browsersuite: neun ungültige Dateivarianten, zu große
  Datei, Bestätigungsabbruch, Datei über 2 MB mit 48.000 Zeichnungspunkten und
  zehn langen SQL-Entwürfen verlustfrei durch Laden/Export, Prüfsumme, mobile
  Fehleransicht und fehlende Web-Crypto-Unterstützung ohne Laufzeitfehler.
  Lernheft-/JSON-, Zeichnungs- und Darstellungs-Regressionssuiten ebenfalls grün.
- [x] Autarke Abschlussrunde 21:56 Uhr: Nach erfolgreichem Abschluss erscheint
  ein Direktbutton zur nächsten freigeschalteten Einheit. Er erhält den Fokus;
  nach der letzten Einheit führt der Button zurück zum Lernpfad. Gesperrte
  Einheiten und doppelte XP bleiben durch die bestehenden Regeln verhindert.
- [x] Fehlender Selbstcheck, Kurzcheck oder Lehrkraft-Haken wird beim Versuch
  des Abschlusses gezielt fokussiert und ins Sichtfeld gebracht. Quiz-Abgabe
  ohne Auswahl führt ebenfalls zu den Antworten. Radiogruppe ist mit der
  Frage beschriftet; Quiz-Rückmeldung besitzt eine höfliche Live-Region.
- [x] Neue End-to-End-Suite prüft alle 21 Einheiten nacheinander, sämtliche
  Lernfortschritt-Übergänge, exakte XP-Gesamtsumme, Wiederaufruf ohne Doppel-XP,
  falsche/richtige/leere Quizantwort, gespeicherte Haken nach Neuladen,
  fehlende Abschlussvoraussetzungen und Desktop/Mobil mit großer Schrift.
  Diese Suite und die Lernheft-/JSON-Regressionssuite erfolgreich; alle 24
  Node-Tests ebenfalls grün. Die clientseitige Lehrkraft-Bestätigung bleibt
  eine Selbstauskunft, keine technische Authentifizierung der Lehrkraft.
- [ ] Mit echter Hilfstechnik prüfen, ob Quizfrage, Prüfergebnis und
  Fokuswechsel beim Abschluss verständlich angekündigt werden.
- [x] Autarke Qualitätsrunde 21:45 Uhr: systematischer Layouttest für L1.1,
  L1.2 und L1.3 bei vier Breiten (390, 768, 1100, 1440 px), beiden Modi und
  großer Schrift. Konkreter Fehler bei 1100 px gefunden: ER-Modell lief seitlich
  über und Attributnamen im Workbench-Modell wurden abgeschnitten. Beide
  Diagramme reagieren jetzt auf die verfügbare Containerbreite, erhalten
  mehr Platz und wechseln bei Bedarf zur vertikalen Darstellung. Attributnamen
  bleiben vollständig lesbar. 24 Prüfkombinationen und Screenshots erfolgreich.
  Hinweis „Folge dem Pfeil“ ersetzt die feste Leserichtung „von links nach
  rechts“, damit Text und vertikale Darstellung zusammenpassen. Gesamtabgleich:
  24 Node-Tests und alle sieben aktuellen Browser-Prüfsuiten erfolgreich;
  `git diff --check` ohne Fehler. Weitere Qualitätsarbeit bleibt aktiv, und
  schulische Praxistests sowie die Veröffentlichung bleiben ausstehend.
- [x] eERM-Erklärung von der Startseite entfernt; Bildunterschrift nennt dort
  allgemein das Datenmodell. L1.2 behandelt zuerst das grundlegende ER-Modell.
  In L1.3 erklärt ein aufklappbarer Begriffsblock eERM und Workbenchs englische
  Bezeichnung EER direkt zum ersten Workbench-Modell. Beziehungen/Erweiterungen
  werden als spätere Inhalte eingeordnet; die ausführliche Erklärung bleibt
  bei L2 und im Modellierbereich zugänglich.
- [x] Profil-Hover auf die gesamte Fläche erweitert: leichter Akzentglanz,
  farbiger Außenrahmen und Avatar-Rand, auch über Kürzel/Klasse/Level. Gezielte
  Selektoren verhindern Überschreiben durch Dark-Mode-Grundstile. Tastaturfokus
  erhält denselben Effekt; Abmessungen bleiben unverändert. Beide Modi getestet.
- [x] Grüner Textmarker rechts neben Koralle ergänzt. Bestehende Farben und
  Markierungen bleiben erhalten; Grün bleibt auch nach Neuladen und JSON-Import
  gültig. Text bleibt wie bei den übrigen Markierungen zusätzlich fett.
- [x] Nachtrag 21:25 Uhr: L1.1-Kontaktkarten-Grafik erhält eine breitere rechte
  Spalte, die weiter links beginnt. Containerabhängige Aufteilung verhindert
  das bisherige Überlaufen fester Mindestbreiten; schmale Ansichten zeigen
  Karten, Pfeil und Tabelle untereinander. Tabellenzellen umbrechen statt
  Inhalte mit Auslassungspunkten zu kürzen. Tabellenkopf `fahrschueler` in
  Dunkelblau (#17486b) mit weißer Schrift. Eigene Edge-Browsersuite prüft
  fünf Breiten (390 bis 1920 px), beide Modi und 16/20-px-Schrift auf Überlauf.
- [x] Nachtrag: Gesamter Profilbereich links unten ist ein einziger nativer
  Button. Avatar, Kürzel, Klasse, Level und freie Fläche öffnen denselben
  Profildialog. Enter/Leertaste und sichtbarer Tastaturfokus unterstützt;
  gezielte Browserprüfungen für sämtliche Klickbereiche ergänzt.
- [x] Freie Farbwähler entfernt. Pro Modus stehen fünf Schriftfarben, fünf
  Hintergrundfarben und sechs Akzentfarben bereit; alle Text-/Hintergrund-
  Kombinationen auf Mindestkontrast 4,5:1 geprüft. Alte freie Farben fallen
  auf zulässige Standardwerte zurück; Schriftgrößen bleiben erhalten.
- [x] Menüs und Dialoge erhalten dezente helle Glaskanten und zurückhaltende
  Schatten, ohne transparente Textflächen oder zusätzliche Bedienhinweise.
- [x] Textmarker-Leiste zeigt nur das erkennbare Symbol und Farbfelder;
  markierter Text erscheint zusätzlich fett. Gespeicherte Markierungen gelten
  weiterhin und profitieren ebenfalls von dieser Darstellung.
- [x] ESC schließt Notizen wie X und kehrt zur vorherigen Lerneinheit samt
  Scrollposition zurück. Offene Dialoge und Radierergrößen schließen zuerst,
  ohne gleichzeitig die Notizen zu verlassen.
- [x] Landkarte dauerhaft sichtbar und vor Lernstand/Nächster-Schritt-Bereich.
  Stationsmenüs öffnen bei Mauszeiger, Tastaturfokus oder Touch und zeigen alle
  zugehörigen Lerneinheiten. Freischaltungsregeln bleiben unverändert; gesperrte
  Einheiten erhalten keine Direktfreigabe. Mobile Menüs passen ins Sichtfeld.
- [x] Langer Druck auf Radierer öffnet Klein/Mittel/Groß; Tastaturzugang über
  Pfeil nach unten. Standard Mittel (48 px), unabhängig von der Stiftstärke.
  Zeichnungen, Radieroperationen und JSON-Prüfsumme bleiben beim Export/Import
  erhalten; Sicherungsformat auf 6 angehoben.
- [x] YouTube-Einbettung bewusst unverändert: Jakob bestätigte am 01.10.2026
  die funktionierende öffentliche Wiedergabe unter `#reference/fgOiWEGNJ-o`.
  Lokale Wiedergabe funktioniert bei ihm nicht und wird vorerst akzeptiert.
  Fehler 153 bedeutet laut offizieller YouTube-IFrame-API-Dokumentation eine
  fehlende Herkunftsangabe; kein pauschaler Beleg für einen Inhaltsfehler.
  Quelle: https://developers.google.com/youtube/iframe_api_reference
- [x] 23 Node-Tests sowie vier Edge/Playwright-Browsersuiten erfolgreich.
  Desktop und Mobil, beide Modi, große Schrift, Markierungen, ESC,
  Langdruck-Größenauswahl, Canvas-Pixel, JSON-Roundtrip und alte Imports geprüft.
- [x] Erneuter Veröffentlichungsauftrag erhalten; Version und Cache-Parameter
  für Release 0.21.0 gesetzt. Deployment und Online-Funktionen geprüft.

### 0.20.0, 01.10.2026, 19:36 Uhr

- [x] Doppelte XP-Zahl und Fortschrittsbalken aus dem Profil links unten entfernt.
  Kürzel, Klasse und Level bleiben sichtbar.
- [x] XP-Symbol oben rechts öffnet einen kompakten Dialog mit aktuellem Level,
  XP-Zahl, Fortschritt und verbleibenden XP zum nächsten Level. Die ersten
  120 XP führen zu Level 2; spätere Schwellen werden dynamisch berechnet.
  Das höchste Level besitzt einen eigenen Abschlusszustand.
- [x] X und Escape schließen den Dialog; der Fokus kehrt zum XP-Symbol zurück.
- [x] 23 Node-Tests und zwei Python-Datentests bestanden. Vier isolierte
  Edge-Browserdurchläufe bestanden: Lernworkflow, Darstellung, Zeichnungen
  und XP-Dialog. Desktop/Mobil einschließlich großer Schrift geprüft.
- [x] Windows-Metadatendateien `desktop.ini` störten `git fetch`, weil sie
  im internen Referenzverzeichnis lagen. Sechs Dateien wurden nach
  `.tmp/git-metadata-backup/` gesichert, nicht gelöscht. Anschließend war
  der Abgleich erfolgreich; lokal und `origin/main` standen auf `0307b59`.
- Veröffentlichung ausdrücklich beauftragt. Release enthält die bisherigen
  lokalen Funktionen aus 0.17 bis 0.19 einschließlich Textmarker, Notizen,
  Zeichnungen, Landkarte und Darstellungsoptionen.
- Originalmaterialien unter `resources/`, lokale Testdaten unter `.tmp/`,
  der unversionierte Lehrbuchentwurf und separate unversionierte Dokumente
  werden nicht mit veröffentlicht. Deploymentprüfung folgt nach dem Push.
- [x] Release-Commit `d49ce79` auf `main` gepusht. GitHub-Pages-Lauf
  `36900911054` am 01.10.2026 erfolgreich abgeschlossen.
- [x] Öffentliche Seite liefert HTTP 200 und referenziert Release 0.20.0.
  Alle vier Browserdurchläufe nochmals auf der veröffentlichten HTTPS-Seite
  erfolgreich ausgeführt, einschließlich SQL-Runtime, Grafiken und JSON-Import.
  Original-PDF, lokaler Testexport und Lehrbuch-README liefern HTTP 404.
- [ ] Bei einer späteren CI-Wartung die GitHub-Actions-Versionen prüfen:
  Der erfolgreiche Lauf meldete die erzwungene Umstellung der verwendeten
  Node-20-Actions auf Node 24. Keine CI-Änderung für diesen Release vorgenommen.

### 0.19.0-local, 01.10.2026, 19:28 Uhr

- [x] Zusätzlichen Speicherhinweis und JSON-Button am Seitenende entfernt.
  Automatische lokale Speicherung bleibt aktiv; Speicherfehler erscheinen
  am Disketten-Symbol und im Sicherungsdialog statt in einem dauerhaften Textblock.
- [x] Start-Icon springt auch bei bereits geöffneter Startseite nach ganz oben.
- [x] eERM-Erklärung als zunächst geschlossenes Details-Element umgesetzt.
  Die ausgeschriebene Abkürzung bleibt stets sichtbar.
- [x] Urheberhinweis dezenter rechts unten platziert; XP-Anzeige und
  Profil-Avatar an die metallischen Werkzeuge angeglichen. Der Avatar behält
  den persönlichen Initialbuchstaben; ein separates statisches Profilbild
  würde diese persönliche Zuordnung verlieren und wurde daher nicht verwendet.
- [x] Fotorealistische Relief-Landkarte mit fünf verbundenen Stationen
  generiert. Echte HTML-Schaltflächen ergänzen L1 bis L5, Fortschritt und
  Sperrstatus. Zugang bleibt an die bestehenden Voraussetzungen gekoppelt.
  Die Darstellung ist eine Lernlandkarte, kein fachliches eERM-Diagramm.
- [x] Notizeditor erhält einen X-Knopf statt „Zur Lerneinheit“. Bei Öffnen aus
  einer Lerneinheit werden Ziel und Leseposition gemerkt; Schließen stellt
  beides wieder her. Direkte Notizlinks haben einen sicheren Rücksprung.
- [x] Zeichenbereich mit sechs Stiftfarben, vier Strichstärken, Radierer,
  Rückgängig/Wiederholen, bestätigtem Leeren und PNG-Download eingebaut.
  Text und Zeichnung sind getrennte Ansichten derselben Notiz. Rasteranzeige
  erfolgt im Canvas; gespeichert werden normalisierte Strichkoordinaten,
  Farben und Werkzeuge. Dadurch bleiben Zeichnungen beim Größenwechsel stabil.
- [x] Zeichnungen werden nach jedem fertigen Strich lokal gespeichert und
  in JSON-Format 5 übernommen. Ältere Sicherungen bleiben importierbar.
  Ungültige Koordinaten, fremde Notiz-IDs und unerlaubte Werkzeuge werden
  verworfen. Maximal 120 Striche/8.000 Punkte je Notiz und 60.000 Punkte
  insgesamt begrenzen Speicherverbrauch; Erreichen des Limits wird angezeigt.
- [x] 23 Node-Tests bestanden; Browserprüfungen für Lernworkflow,
  Darstellung und Zeichnungsfunktionen bestanden. Pixelprüfungen belegen
  Zeichnen, Teilradierung, Farben und Undo/Redo. PNG-Download, Neuladen,
  JSON-Prüfsumme, Format-5-Roundtrip und Format-4-Import geprüft. Desktop
  1440×1000 sowie Mobil 390×844, beide Modi einschließlich 20-px-Schrift,
  ohne horizontalen Überlauf geprüft. Screenshots in `.tmp/drawing-qa/`.
- [ ] Physische Eingabestifte und Schulbrowser noch praktisch testen.
- Ausschließlich lokal; kein Commit, kein Push, Online bleibt 0.16.1.

#### Landkarten-Asset

Werkzeug: eingebautes `image_gen`; Optimierung lokal mit `sharp`.
Original: `assets/bpe6-relief-map.png`. Verwendete WebP-Datei:
`assets/bpe6-relief-map.webp`, rund 425 KB. HTML-Beschriftungen wurden
bewusst nicht in das Bild generiert, damit sie korrekt und zugänglich bleiben.
Generierungs-Prompt:

```text
Use case: scientific-educational. Asset type: landscape image background for an interactive five-stage learning map on WorkbenchLab. Create a premium photorealistic miniature relief map, near overhead camera, landscape 16:9 composition. Graphite and brushed titanium terrain contours with winding paths connect five clearly separated circular stations, placed approximately at image coordinates (12% across,65% down), (30%,30%), (50%,65%), (70%,30%), (88%,65%). Each station has one tiny realistic sculpted educational landmark: a single database table, two joined tables, a network of three tables, neatly organized nested tiles, and a data observatory. The five regions have subtle blue, mint, amber, violet and coral accents respectively. Crisp legible geography and paths, softly lit realistic terrain texture, silver contours, dark charcoal backing, professional architectural model photography. Entire miniature terrain map visible edge to edge, no frame, no lettering, no text, no labels, no numbers, no watermark, no orbs. Small landmarks, plenty of clear terrain for HTML navigation pins to be overlaid. No diagrams or SQL text to hallucinate.
```

### 0.18.0-local, 01.10.2026, 19:07 Uhr

- [x] Neues fotorealistisches WorkbenchLab-Icon generiert und lokal eingebaut.
  Das Original liegt unter `assets/workbenchlab-titanium.png`; die für
  Seitenleiste und Favicon verwendete 192-px-WebP-Datei unter
  `assets/workbenchlab-titanium.webp` ist nur rund 6 KB groß.
- [x] Dark Mode dunkler und neutraler gestaltet: Graphitflächen, dezente
  Metallkanten, geprägte Werkzeuge, Lichtreflex beim Hover und Druckeffekt.
  Dark Mode bleibt ohne gespeicherte Wahl Standard; Light Mode bleibt erhalten.
- [x] Darstellungsoptionen rechts neben dem Moduswechsel ergänzt:
  Schrift, Hintergrund und Elemente mit vordefinierten Farbswatches sowie
  eigener Farbauswahl; Schriftgrößen 16, 18 und 20 px. Einstellungen gelten
  sofort, bleiben lokal gespeichert und sind für beide Modi getrennt.
  Zurücksetzen stellt beide Standardpaletten und 16 px wieder her, lässt aber
  den gewählten Modus und sämtliche Lerndaten unverändert.
- [x] Kontrastprüfung ergänzt: zu kontrastarme Text-/Hintergrundkombinationen
  werden zurückgewiesen; Sekundärtext und Akzente werden für Lesbarkeit
  abgeleitet. Text, Links und Primärbutton-Beschriftungen werden gegen die
  entsprechenden Flächen mit mindestens 4,5:1 getestet.
- [x] SQL-Status durch ein Datenbanksymbol im gleichen Werkzeugstil ersetzt.
  Statuspunkt und Tooltip unterscheiden Vorbereitung, Bereitschaft und Fehler.
  Anklicken öffnet das SQL-Labor; bei Ladefehlern wird ein neuer Versuch gestartet.
- [x] Speicherdialog vereinfacht: Kürzel, Klasse, XP, Download, Laden und
  optionaler automatischer Download. Technische Herkunftsdaten und Prüfsumme
  bleiben unverändert in der JSON-Datei, werden aber nicht mehr im Dialog oder
  der Ladebestätigung angezeigt. Die Bestätigung vor dem Ersetzen bleibt erhalten.
- [x] Ursache des seitlichen Scrollbalkens behoben: Das unsichtbare
  Dateiauswahlfeld erbte zuvor die volle Breite normaler Profileingaben.
  Auch die Checkbox ist wieder kompakt und steht neben ihrer Beschriftung.
- [x] 21 Node-Tests bestanden. Zwei isolierte Edge-Browserdurchläufe bestanden:
  bisherige Notiz-/Textmarker-/Exportfunktionen sowie Optionen, Kontrastwarnung,
  Neuladen, Reset, Icon-Laden und SQL-Navigation. Desktop 1440×1000 und Mobil
  390×844 in beiden Modi einschließlich 20-px-Schrift geprüft. Screenshots
  liegen lokal in `.tmp/appearance-qa/` und `.tmp/study-qa/`.
- [ ] Sichtprüfung auf Schul-PCs und im dortigen Browser steht noch aus.
- Keine Veröffentlichung, kein Commit und kein GitHub-Push. Online bleibt 0.16.1.

#### Icon-Erstellung

Werkzeug: eingebautes `image_gen`, danach lokale Größenoptimierung mit `sharp`.
Keine externen Herstellerlogos oder personenbezogenen Bilder als Vorlage verwendet.
Generierungs-Prompt:

```text
Use case: product-mockup. Create a single square photorealistic premium app icon for WorkbenchLab, a relational database learning application. A physically crafted brushed titanium database cylinder with three stacked tiers, connected by crisp engraved circuit traces to two small table-grid tiles. Subtle mint enamel accents and a small amber detail. Black graphite square backing with lightly chamfered corners, studio product photography, sharp metallic reflections, controlled lighting, high contrast recognizable silhouette at 60px size, front-facing centered object filling 85% of frame. No lettering, no watermark, no extra objects. Square image.
```

### 0.17.0-local, 01.10.2026, 11:14 Uhr

- eERM-Abkürzung und Bezug zum EER-Modell in Workbench erläutert, auf der
  Übersicht und den frühen Modellierungsseiten direkt sichtbar.
- Landkarte, Lernfortschritte und Arbeitsreihenfolge zunächst zugeklappt.
  Schnellmenü und Breadcrumb öffnen den gewünschten Lernfortschritt weiterhin
  gezielt. Eine direkte Weiterlernen-Schaltfläche bleibt sichtbar.
- Blaue, grüne, gelbe, violette und korallfarbene Akzente für Lernfortschritte
  und Information, Aufgaben, Notizen und Checks ergänzt. Die linke Navigation
  ist über das Menüsymbol aus-/einblendbar; die Desktopwahl bleibt gespeichert.
- Textmarker mit drei Farbswatches und Teilradierung, persistenten Textankern
  und JSON-Sicherung ergänzt. Der Markerbalken bleibt beim Lesen sichtbar.
- Eingebettetes persönliches Lernheft unter Nachschlagen eingebaut, mit Suche,
  eigener allgemeiner Notiz, gemeinsamen Lektionsnotizen und Textdatei-Export.
- L1.1 unterscheidet max. Zeichenzahl und Speicherbedarf: VARCHAR bleibt
  numerisch; für andere Typen sind Text und eine Vorschlagsliste möglich.
  Bei Typwechsel werden feste Basiswerte wie INT 4 Byte und DATE 3 Byte
  vorbelegt. Eigene Texte überstehen Neuladen und Import.
- Dauerhaften Speicherstatus und JSON-Download am Seitenende ergänzt;
  optionaler automatischer Download nach Lektionsabschluss. Speicherfehler
  werden angezeigt. Exportformat 4 schützt die neuen Felder vor Verlust in
  älteren App-Versionen; ältere Sicherungen bleiben importierbar.
- 18 Node-Tests, zwei Python-Datentests sowie ein isolierter Edge-Browserdurchlauf mit synthetischem
  Profil bestanden: Farben, Inline-Code-Erhalt, absatzübergreifende Auswahl,
  Umfärben, Radieren, Neuladen, Notizsynchronisierung, Suche, manueller und
  automatischer JSON-Download, gültige Prüfsumme, Import von Format 4,
  Rückwärtskompatibilität mit Format 3 und Speicherfehler.
  Desktop 1440×1000 und Mobil 390×844 geprüft; der mobile Überlauf in L1.1
  wurde korrigiert. Screenshots und Testexporte liegen lokal in `.tmp/study-qa/`.
- Ausschließlich lokal umgesetzt. Online bleibt Version 0.16.1 unverändert.

### 0.16.1, 27.09.2026, 10:55 Uhr

- Alle sechs eingebetteten Tutorials auf der veröffentlichten HTTPS-Seite
  einzeln geladen. Die Player wurden sichtbar geöffnet; bei fünf Videos
  wurde der Wiedergabestatus „Video anhalten“ beobachtet. Beim zweiten Video
  waren laufende Untertitel sichtbar. Nach jedem Test wurde der Player
  geschlossen. Kein Fehler 153 auf der Live-Seite beobachtet.
- Video-Zuordnungen als einzelne Lektionskürzel hinterlegt. In L1.1, L1.2,
  L1.3, L1.4, L2.1 und L2.2 führt nun ein Video-Button direkt zur passenden
  Karte unter Nachschlagen. L2.2 zeigt beide zugeordneten Tutorials an.
  Die Zieladresse ist auch direkt verlinkbar; Videoaufrufe vergeben keine XP.
- Lokalen Direktlink aus L1.1 einschließlich Scroll- und Fokusziel geprüft.
  14 Node- und zwei Python-Tests bestanden. Ein Test im Schulbrowser bleibt
  offen.

### 0.16.0, 27.09.2026, 10:28 Uhr

- Sechs öffentliche YouTube-Tutorials aus der schulischen OneNote-Seite
  „Tutorials“ als ergänzende Videothek unter „Nachschlagen“ aufgenommen.
  Themen, Kanäle und Video-IDs wurden mit YouTubes oEmbed-Angaben abgeglichen;
  die private OneNote-Adresse und angehängte SQL-Dateien werden nicht
  veröffentlicht. Jede Karte verweist auf passende L1-/L2-Einheiten.
- Einbettung über `youtube-nocookie.com` erst nach bewusstem Klick, mit
  Referrer-Richtlinie, Seitenursprung, Schließen-Schaltfläche und direktem
  YouTube-Link als Alternative. Die Startseite lädt keinen Drittanbieter-
  Player im Hintergrund.
- Desktop und Mobilansicht sowie Laden/Schließen geprüft; 14 Node- und zwei
  Python-Tests bestanden. Die Einbettung des ersten Videos spielte auf der
  veröffentlichten HTTPS-Seite sichtbar ab. Der lokale `127.0.0.1`-Test
  blieb ohne Bild; ein direkter Embed-Aufruf ohne Referrer zeigte den von
  YouTube dokumentierten Fehler 153. Die übrigen fünf Videos und die
  Wiedergabe im Schulbrowser sind noch praktisch zu prüfen.

### 0.15.0, 26.09.2026, 21:12 Uhr

- Dark Mode als HTML- und CSS-Ausgangszustand gesetzt. Eine bewusst gewählte
  Light-Mode-Einstellung bleibt weiterhin im Browser gespeichert.
- Oberfläche mit Graphit- und Stahltönen, metallischen Lichtkanten und
  differenzierten Hover-/Fokuszuständen für Navigation und Bedienelemente
  überarbeitet. Dashboard-Titel kompakter gesetzt, damit auf Desktop und
  Mobilgeräten mehr Lerninhalt im ersten Bildschirm sichtbar ist.
- Startseite und L1.2 auf Desktop sowie Startseite mobil geprüft; Light-/Dark-
  Umschaltung und horizontalen Überlauf kontrolliert. 13 Node- und zwei
  Python-Tests bestanden. CSS-Version für Browser-Cache aktualisiert.

### 0.14.0, 26.09.2026, 17:51 Uhr

- Nach ausdrücklicher Freigabe auf `main` veröffentlicht (Release-Commit
  `4809fad`). Der GitHub-Pages-Workflow war erfolgreich.
- Live geprüft: Startseite, `learning-path.js` und das L2-Beispieldaten-Skript
  liefern HTTP 200. Die lokalen Originalmaterialien unter `resources/` und
  der unfertige Lehrbuchentwurf liefern HTTP 404 und sind nicht veröffentlicht.
- Vor dem Push bestanden 12 Node-Inhaltstests und zwei Python-Datentests.
  Ein echter Durchlauf mit MySQL Workbench 6.3.10 am Schul-PC bleibt offen.

### 0.14.0-local, 26.09.2026, 17:31 Uhr

- L2.1 aus `L2_1` (Redundanzfreiheit) und `L2_2.1` (Datenbankmodell mit zwei
  Tabellen) neu ausgearbeitet: Ergebnis-Duplikate versus gespeicherte
  Redundanz, Änderungsanomalie, fachliches ERD, 1:N und Relationenschema.
  Fünf direkt ausfüllbare Antworten, Notizfragen und eine neue vierteilige
  Browserübung ergänzen den handgezeichneten Modellauftrag.
- L2.2 an `L2_2.2` (softwaregestützte Modellierung) gebunden: Kopie des
  L1-Modells, eigenes Schema `fahrschule_l2`, `orte` mit `ortnr` als PK/AI,
  `ortnr` als FK in `fahrschueler`, Entfernen der redundanten Ortsattribute
  nur im neuen Modell. Eine interaktive EER-Übung lässt PK, FK und 1:N
  direkt im Diagramm setzen.
- Ein eigenes Skript mit ausschließlich fiktiven L2-Testdaten ergänzt. Es
  enthält nur INSERT- und SELECT-Abfragen, keine CREATE-, DROP-, ALTER-
  oder DELETE-Anweisung. Die SQL-Vorschau von Forward Engineer muss vor
  Ausführung geprüft werden; das Material-Setting zum Löschen vorhandener
  Objekte wurde bewusst nicht in den Schülerablauf übernommen.
- Zwölf Node-Inhaltstests und zwei SQLite-Datentests bestanden. Das neue
  Diagramm und L2.1 im lokalen Browser geprüft; kein Push, keine
  Veröffentlichung. Ein echter Durchlauf in Workbench 6.3.10 am Schul-PC
  bleibt offen.

### 0.13.0-local, 26.09.2026, 16:08 Uhr

- Nachschlagen für den tatsächlichen Unterrichtsablauf präzisiert: offizieller
  Link zu Schultasche-BW, Start über das Play-Symbol, Doppelklick auf
  `MySQL starten`, Warten auf `ready for connections`, Konsolenfenster offen
  lassen und erst dann MySQL Workbench öffnen.
- Schulversion 6.3.10 als Bezugspunkt gesetzt; 8.0.21 bleibt eine mögliche
  Variante auf dem privaten Stick. Eine lokale Connection wird mit
  `127.0.0.1`, Port `3306` und dem im Screenshot sichtbaren Beispielbenutzer
  `root` illustriert, aber nicht als allgemeingültige Schulkonfiguration
  behauptet. Keine Schul-/Microsoft-365-Passwörter verwenden.
- L1.3 um einen eigenen Dienst- und Verbindungsschritt samt
  `SELECT VERSION();`, Notizfeld und Abschlusskontrolle ergänzt. Die
  Unterscheidung zwischen gespeicherter `.mwb`-Modelldatei und erst in L1.4
  erzeugter Datenbank bleibt erhalten.
- Zehn Node-Inhaltstests bestanden; die neue Nachschlagen-Ansicht im lokalen
  Browser visuell geprüft. Kein Push und keine Veröffentlichung.

### 0.12.0-local, 26.09.2026, 15:21 Uhr

- L1.7 anhand von `L1_5.7 Information Redundanzen in Abfrageergebnissen`
  und dem zugehörigen Aufgabenblatt auf `DISTINCT` fokussiert. Die bisher
  vermischten Themen `LIKE`, `IN` und `BETWEEN` gehören nicht zum Kern dieses
  Originalabschnitts; die vorhandene LIKE-Browserübung bleibt als klar
  gekennzeichnete Vertiefung erhalten.
- Erklärungen zu Wiederholungen im Ergebnis und zu einmaligen
  Wertekombinationen, ein digitales Blatt mit allen vier Originalaufträgen,
  Notizfragen und ein gezielter Kurzcheck ergänzt.
- Drei weitere Browser-SQL-Übungen für Vorname, Nachname und Fahrstunden
  ergänzt. Die lokale Browser-Testtabelle enthält nun auch eine doppelte
  Fahrstundenzahl; im MySQL-Unterrichtsmodell heißt dieses Attribut weiterhin
  `fahrstundenzahl`. Keine Änderung des bereits vorbereiteten L1.4-Imports.
- Neun Node-Inhaltstests und die vier DISTINCT-Abfragen in `sql.js` geprüft.
  Stand weiterhin lokal; kein Push und keine Veröffentlichung.

### 0.11.0-local, 25.09.2026, 18:15 Uhr

- L1.6 anhand `L1_5.3` als ausführliche Einheit zu Selektion, Operatoren,
  Text-, Zahlen- und Datumsvergleichen sowie LIKE, AND, OR, NOT und BETWEEN
  ergänzt. Das digitale Blatt umfasst die Begriffsfrage und Aufgaben 2 bis 12.
- Vier neue Browser-SQL-Übungen ergänzen die vorhandene Sortierübung; die
  Originalaufgaben werden in Workbench mit einem passend gestalteten,
  ausschließlich fiktiven Importdatensatz lösbar.
- Der sichtbare Reiter `Muster` wurde aus der Schüler-SQL-Ansicht entfernt.
  Hinweise und SQL-Coach bleiben erhalten. Die Original-Musterlösungen aus
  `resources/` werden weiterhin nicht auf der Homepage ausgeliefert.
- Stand weiterhin lokal; keine Veröffentlichung ausgelöst.

### 0.10.0-local, 25.09.2026, 18:05 Uhr

- L1.5 anhand von `L1_5.1 Information Datenbankabfrage Projektion` und
  `L1_5.1 Aufgabe Datenbankabfrage Projektion` ausgearbeitet: SELECT, FROM,
  ORDER BY, ASC/DESC und Sortierung nach zwei Attributen.
- Vier digitale Antwortfelder (Begriff und drei SQL-Abfragen) sowie drei direkt
  ausführbare und bewertete Browserübungen ergänzt. Eine zweite Person mit
  gleichem Nachnamen macht das zweite Sortierkriterium im Testdatensatz sichtbar.
- Abhängigkeit zwischen L1.2, L1.3 und L1.4 geklärt: elf Attribute explizit
  benannt; das fiktive Importscript befüllt nun alle elf statt nur fünf
  Spalten und enthält keine Original-Kontaktdaten.
- Stand weiterhin lokal; keine Veröffentlichung ausgelöst.

### 0.9.0-local, 25.09.2026, 16:30 Uhr

- L1.4 anhand der Informations- und Aufgabenblätter `L1_3` und `L1_4`
  ausgearbeitet: Workbench-Verbindung, `Synchronize Model`, SCHEMAS-Kontrolle,
  Datenimport und `SELECT`-Prüfung. Eigenes digitales Nachweisblatt und
  Verständnischeck ergänzt.
- Ein kleines, nicht destruktives SQL-Übungsskript mit fünf ausdrücklich
  fiktiven Datensätzen unter `assets/sql/` erstellt. Die Kontaktangaben aus
  dem Originalmaterial werden nicht auf der Homepage bereitgestellt.
- Download des Übungsskripts im Praxisauftrag ergänzt; L1.1-Vorlage um eine
  Attributzeile erweitert, damit alle elf Spalten des späteren Modells Platz
  finden. Workbench-Reihenfolgeübung an den Quellenablauf angepasst.
- Stand weiterhin lokal; keine Veröffentlichung ausgelöst.

### 0.8.0-local, 25.09.2026, 16:10 Uhr

- L1.2 anhand von `L1_2.1 Information Datenbank modellieren` und
  `L1_2 Aufgabe Datenbank modellieren` als ERD- und Relationenschema-Einheit
  neu ausgearbeitet: Fachbegriffe, Modellgrafik, vier digitale Antworten,
  Heftauftrag, passende Browserübung und Verständnischeck.
- L1.3 anhand von `L1_2.2 Information Datenbank softwaregestützt modellieren`
  und Aufgabe `L1_2` zu einem konkreten Workbench-Ablauf überarbeitet:
  Schema, EER-Diagramm, Tabelle, PK/NN, Datentypen, `.mwb`-Kontrolle und fünf
  digitale Reflexionsfelder. Vorzeitige Kardinalitätsübung ersetzt.
- Das Arbeitsblatt-Rendering unterstützt jetzt auch reine Freitextvorlagen
  ohne leere Attributtabelle. L1.2 hat eine passende eigene Ablaufleiste.
- Versionsparameter für lokale CSS- und JS-Dateien verhindern alte
  Mischstände aus dem Browsercache.
- Vier automatisierte Inhaltstests für die ersten drei Lerneinheiten ergänzt.
- Fachliche Präzisierung zum Speicherbedarf von `VARCHAR(n)` in L1.1.
- L1.1 verwendet nun einen eigenen Ablauf für den Tabellenentwurf statt einer
  verfrühten Aufforderung, bereits in MySQL Workbench zu arbeiten.
- Stand lokal, kein GitHub-Push und keine Freigabe für Schüler-PCs erfolgt.

### 0.7.2-local, 25.09.2026

- Bedienelemente in Dark und Light Mode mit zurückhaltendem Metall-Look,
  Lichtkante, Tiefe und klaren Hover-/Klickzuständen versehen.
- Primäre Aktionen in dunklem Metall-Türkis; sekundäre Aktionen und
  Icon-Buttons in Stahl bzw. Graphit. Navigationspunkte und Profil-Icon
  stilistisch angepasst.
- Bewegungseffekte bei reduzierter Bewegung deaktiviert.
- Topbar-Raster korrigiert, damit lange Lektionstitel Aktions-Icons nicht
  überlagern. Stand bleibt lokal; keine Veröffentlichung.

### 0.7.1-local, 25.09.2026

- Avatar im Seitenmenü öffnet das Lernprofil; Stift-Schalter entfernt.
- `AltGr + S` blendet nur im geöffneten Profilfenster den Entwicklerschalter
  ein oder wieder aus. Der Schalter aktiviert/deaktiviert die globale
  Lernpfad-Freischaltung ohne Lernstand oder XP zu verändern.
- Breadcrumb in Lerneinheiten führt über den Lernfortschritt direkt zum
  entsprechenden Abschnitt im Lernpfad.
- `docs/` in `documentation/` umbenannt; vorhandene Markdown-Dokumente,
  Arbeitslisten und Übergabehinweise in `documentation/documentation.md`
  konsolidiert. Screenshots bleiben unter `documentation/screenshots/`.
- Stand lokal; kein GitHub-Push und keine Veröffentlichung.

### 0.7.0-local, 20.09.2026, 14:13 Uhr

- Dark Mode als Standard gesetzt; gespeicherter Light Mode bleibt erhalten
- Klasse als Pflichtangabe in Profil, Seitenleiste und JSON-Sicherung ergänzt
- Profil-Dialog auf Desktop und Mobil ohne Feld-/Button-Überlagerung aufgebaut
- Profilherkunft, Exportgerät, Übertragungshistorie und Browserumgebung ergänzt
- JSON-Format auf Version 3 mit SHA-256-Integritätsprüfung erweitert
- Grenzen von MAC- und IP-Ermittlung transparent dokumentiert
- sequenzielle Freischaltung über alle 21 Lerneinheiten eingeführt
- `AltGr + S` und sitzungsbezogenen Entwicklermodus ergänzt
- zweistufiges Lernpfad-Flyout mit `L1` bis `L5` und allen Lerneinheiten gebaut
- Breadcrumbs auf „Lernfortschritt n > Lx.y“ umgestellt
- L1.1 aus Information, Aufgabe und Vorlage vollständig integriert
- digitales L1.1-Arbeitsblatt und allgemeine Lektionsnotizen ergänzt
- alle neuen Zustände in lokale Speicherung, Normalisierung und Export aufgenommen

### 0.6.0-local, 20.09.2026

- lokalen BPE6-Bestand mit 245 Dateien erfasst: 169 DOCX, 45 SQL-Dateien,
  27 Workbench-Modelle, drei Videos und eine Präsentation
- 21 Einheiten in fünf Lernfortschritte eingeordnet
- alle Einheiten mit Praxisauftrag, Lernprodukt, Abschlusskriterien und
  Materialbezug ausgestattet
- lehrkraftbestätigten Lektionsabschluss eingeführt
- Übungen für `CREATE TABLE`, `UPDATE` und `DELETE` ergänzt
- private Selbstversuche aus L5 durch fiktive datensparsame Fälle ersetzt
- Materialmatrix erstellt; jetzt als Anhang in dieser Dokumentation

### 0.5.0, 18.06.2026

- anonymisiertes Schülerkürzel `ABC.DEF` eingeführt
- Profil-Dialog und Fokusabstände korrigiert
- JSON-Format 2 mit Profil-ID, Browser-/Gerätecode, Export-ID und Zeitstempel
- Datenschutzgrenzen für lokale Identitäten dokumentiert
- als derzeitige Live-Version veröffentlicht

### 0.4.0, 18.06.2026

- drei eigenständige fotorealistische Unterrichtsmotive ergänzt
- Fachdiagramme als zugängliche HTML/CSS-Modelle beibehalten
- lokalen SQL-Coach mit Kriteriencheck, Ergebnisvergleich und übersetzten
  Fehlermeldungen umgesetzt
- Architektur für eine optionale serverseitige KI-Rückmeldung dokumentiert;
  keine API-Schlüssel im Browser

### 0.3.0, 18.06.2026

- eigenes eERM-Modul mit Sachtextanalyse, Kardinalitäten und M:N-Auflösung
- interaktive Diagrammaufgaben zu Fahrradvermietung und Schule
- normalisiertes Vermietungsschema und Drei-Tabellen-JOIN
- Befehlsbibliothek um Primär- und Fremdschlüssel erweitert

### 0.2.0, 18.06.2026

- Workbench-Ablauf, flexible SQL-Filter und Datumsfunktionen ergänzt
- Übungen für `DISTINCT`, `LIKE`, `IN`, `BETWEEN`, `YEAR` und `MONTH`
- Nachschlage-Screenshots durch eigene responsive Illustrationen ersetzt

### 0.1.0, 18.06.2026

- PythonLab-Struktur analysiert und statische SPA aufgebaut
- Bildungsplan und Kompetenzraster ausgewertet
- 13 Lektionen, 13 Übungen, SQL-Labor, XP, Erfolge und Sicherungsdialog
- Lucide und `sql.js` lokal eingebunden
- GitHub-Pages-Workflow vorbereitet, Repository erstellt und veröffentlicht

## 7. Qualitätssicherung

### 25.09.2026, Version 0.11.0-local

- `node --test tests/learning-path.test.js`: 8/8 erfolgreich.
- `python -m unittest discover -s tests -p 'test_*.py' -v`: 1/1
  erfolgreich. Der Datentest prüft die Suchfälle des Originalaufgabenblatts
  gegen fünf fiktive Datensätze.
- L1.6 im Browser: zwölf Eingabefelder, fünf Übungslinks, kein horizontaler
  Überlauf in der geprüften Desktopansicht. Alle fünf SQL-Übungen mit
  korrekten Abfragen erfolgreich bewertet; kein `Muster`-Reiter sichtbar.
- Echtes MySQL Workbench am Schul-PC, Mobilansicht der langen L1.6-Seite und
  Screenreader-Abnahme bleiben noch offen.

### 25.09.2026, Version 0.10.0-local

- Drei L1.5-SQL-Aufgaben mit den vorgesehenen Lösungen im Browserlabor
  ausgeführt und erfolgreich bewertet; noch mit dem bisherigen Zehn-Zeilen-
  Testdatensatz, vor Ergänzung des zweiten Nachnamens `Keller`.
- Nach Ergänzung des zweiten Nachnamens `Keller` die dritte Übung erneut
  geprüft: elf Ergebniszeilen und korrekte Bewertung. Eine Abfrage ohne
  zweites Sortierkriterium wird erkannt und erhält einen passenden Coach-Tipp.
- `node --test tests/learning-path.test.js`: 6/6 erfolgreich; der neue Test
  deckt drei SQL-Aufgaben und den doppelten Nachnamen ab.
- Das vollständige fiktive Importskript wurde gegen eine passende
  In-Memory-Tabelle ausgeführt: fünf Zeilen, drei Orte, zwei gleiche Nachnamen.
  Nur die MySQL-spezifische `USE`-Anweisung wurde für SQLite entfernt.
- L1.5-Ansicht ohne Browserkonsolenfehler geprüft.
- Die vollständig befüllte fiktive Importdatei muss weiterhin an einem echten
  Schul-PC in MySQL Workbench geprüft werden.

### 25.09.2026, Version 0.9.0-local

- `node --test tests/learning-path.test.js`: 5/5 erfolgreich; Syntaxprüfungen
  für `app.js`, `content.js` und `learning-path.js` erfolgreich.
- L1.4 im Browser: fünf digitale Antwortfelder, vollständiger Praxisauftrag,
  Download-Link und keine Konsolenfehler oder horizontaler Überlauf bei der
  geprüften Desktopbreite.
- Übungsskript lokal per HTTP mit Status 200 erreichbar. Der INSERT-Teil wurde
  mit einer passenden In-Memory-Tabelle ausgeführt und ergab fünf Datensätze;
  dabei wurde nur die MySQL-spezifische `USE`-Zeile für SQLite entfernt.
- Statischer Test bestätigt: keine `DROP`-, `DELETE`- oder
  `TRUNCATE`-Anweisung im Downloadskript.
- MySQL Workbench am Schul-PC und das echte Ausführen des Skripts bleiben
  noch zu prüfen.

### 25.09.2026, Version 0.8.0-local

- `node --test tests/learning-path.test.js`: 4/4 erfolgreich.
- `node --check` für `app.js`, `content.js` und `learning-path.js`: erfolgreich.
- L1.2 im Browser: vier Freitextfelder, ERD/Schema-Grafik, eigener Ablauf,
  passende Übung und Abschlusskontrollen vorhanden.
- L1.3 im Browser: fünf Freitextfelder, Workbench-Modellgrafik und fünf
  passende Übungsfelder vorhanden; Eingabe im Prüfblatt blieb nach Neuladen
  erhalten.
- Korrigierter L1.1-Ablauf im Browser nach Neuladen sichtbar.
- Isolierter Testlernweg mit synthetischem Profil `TES.TER` auf `localhost`:
  L1.1 ausgefüllt, nach Neuladen erhalten und mit simuliertem Lehrkraft-Haken
  abgeschlossen; 40 XP und L1.2 freigeschaltet. L1.2 mit vier Antworten und
  Notiz ebenfalls nach Neuladen erhalten, Quiz bestanden, abgeschlossen;
  insgesamt 70 XP und L1.3 freigeschaltet. Die Lehrkraft-Bestätigung wurde
  dabei nur für den Funktionstest simuliert, nicht fachlich erteilt.
- Mobilansicht 390 × 844 ohne horizontalen Überlauf; Browserkonsole ohne
  Fehlermeldung.
- Echtes Schul-PC-Setup und öffentlicher Zugriff noch **nicht** geprüft.

### 25.09.2026, Version 0.7.2-local

- Dark und Light Mode visuell im lokalen Browser geprüft.
- Lange Lektionsüberschrift neben Topbar-Aktionen ohne Überlagerung.
- Mobilansicht bei 390 × 844: kein horizontaler Überlauf; Titel und
  Aktionsreihe mit getrennten Flächen.
- Button-Hover, Aktivierung und Fokuszustände im CSS definiert;
  `prefers-reduced-motion` berücksichtigt.

### 25.09.2026, Version 0.7.1-local

- `node --check app.js` und `node --check learning-path.js`: erfolgreich
- `git diff --check`: keine Whitespace-Fehler
- Profilfenster über Avatar geöffnet; kein Stift-Button mehr vorhanden
- `AltGr + S` im Profil: Schalter sichtbar; erneuter Hotkey: verborgen
- Hotkey außerhalb des Profils: Schalter bleibt verborgen
- Schalter aktiv: keine gesperrten Lerneinheiten oder Lernfortschritte;
  deaktiviert: sequenzielle Sperren wiederhergestellt
- Breadcrumb von L1.1 führt zu Lernfortschritt 1 im Lernpfad
- Mobilansicht bei 390 × 844: 28 px Abstand zwischen Entwicklerschalter
  und Dialogaktionen; Dialoginhalt scrollbar
- Browserkonsole beim Funktionstest: keine Fehler
- Dokumentation: genau eine Markdown-Datei unter `documentation/`,
  Screenshots und README-Verweise erhalten

### 20.09.2026, Version 0.7.0-local

- `node --check app.js`: erfolgreich
- `node --check learning-path.js`: erfolgreich
- Dark-Mode-Start ohne gespeicherte Präferenz: erfolgreich
- anfängliche Freigabe: genau eine Einheit (`L1.1`)
- Entwicklermodus: alle 21 Einheiten freigeschaltet
- Abschluss von L1.1: 40 XP; anschließend genau L1.1 und L1.2 zugänglich
- L1.1: vier Definitionen, sechs Datentypen, zehn Vorlagenzeilen
- Arbeitsblatt und Notizen nach Neuladen erhalten
- Profilnormalisierung: `mia.mül` wird `MIA.MUE`; Klasse `WGJ1/1` gespeichert
- alle 21 Lektionsseiten aufgerufen: keine fehlende Seite
- alle 27 Übungsseiten aufgerufen: 13 SQL- und 14 strukturierte Übungen
- Browserkonsole: keine Fehler oder Warnungen
- Desktopansicht bei 1440 × 1000 visuell geprüft
- zweistufiges Lernpfad-Menü per Tastaturfokus visuell geprüft
- Mobilansicht bei 390 × 844 visuell geprüft
- Profilfelder und Dialogaktionen im Mobilmodus ohne Überlagerung

Bereits im Stand 0.6.0 wurden alle 13 SQL-Lösungen und 14 strukturierten
Übungen inhaltlich erfolgreich durchgespielt. Die Änderung 0.7.0 betrifft die
Freischaltung und L1.1-Datenerfassung; die Übungsrouten wurden erneut vollständig
auf Erreichbarkeit geprüft.

## 8. Erledigte Aufgaben

- [x] lokale Orientierung an PythonLab und Excel-Lab
- [x] BPE6-Materialbestand und Kompetenzraster analysiert
- [x] fünf Lernfortschritte und 21 Lerneinheiten strukturiert
- [x] Workbench-Aufträge und lehrkraftbestätigten Abschluss umgesetzt
- [x] SQL-Labor und eERM-Übungen integriert
- [x] Dark Mode als Standard
- [x] Profil mit Kürzel und Klasse
- [x] nachvollziehbares JSON-Format 6 mit Import älterer Formate
- [x] sequenzielle Freischaltung und Entwicklermodus
- [x] Lernpfad-Schnellmenü und Breadcrumbs
- [x] L1.1 inhaltlich und interaktiv vollständig integriert
- [x] L1.2 bis L3.1 quellennah für den Unterricht vertieft
- [x] Inhaltstests für L1.1 bis L1.10 ergänzt
- [x] L2.1 und L2.2 samt interaktivem 1:N-Diagramm und fiktiven
  Zwei-Tabellen-Testdaten ergänzt
- [x] sichtbaren Musterlösungs-Reiter aus der Schüleransicht entfernt
- [x] automatische Notiz- und Arbeitsblattspeicherung
- [x] Desktop- und Mobilprüfung des Stands 0.7.0-local
- [x] beauftragte Veröffentlichung von 0.21.0 auf GitHub Pages geprüft

## 9. Offene Vor-Ort-Prüfungen und weitere Ausbauideen

Die folgenden Punkte sind nicht Teil der erledigten konkreten Design- und
Bedienungswünsche. Vor-Ort-Prüfungen bleiben unbestätigt; weitere Ausbauten
bleiben offen und werden durch die Abschlussprüfung nicht als fertig erklärt.

1. Den vollständigen Ablauf an einem Schul-PC mit Informatik-Stick,
   `MySQL starten`, Workbench 6.3.10 und den dortigen Connection-Daten
   erproben. Die hier abgebildeten `127.0.0.1:3306` und `root` sind nur
   Werte aus dem privaten Screenshot, keine verifizierte Schulkonfiguration.
2. Schülerzugriff für die erste Stunde am Schulnetz und den eingesetzten
   Browsern praktisch testen, einschließlich Video-Einbettung und
   JSON-Sicherung.
3. L3.2 bis L5.3 schrittweise mit direkt ausfüllbaren, quellennahen
   Aufgabenblättern ergänzen; L1 und L2 sind bereits vertieft.
4. Tastatur- und Screenreader-Abnahme mit realer Hilfstechnik durchführen.
5. Eine Lehrkraftansicht für mehrere JSON-Dateien entwickeln: Zuordnung,
   Prüfsummenstatus, Übertragungshistorie, Rubrik und Exportübersicht.
6. Für einen stärkeren Abgabenachweis ein datenschutzkonformes Modell mit
   Lehrkraft-Code oder serverseitiger Signatur konzipieren.
7. Freie eERM-Modellierung mit mehreren fachlich richtigen Lösungsvarianten
   und differenzierter Rückmeldung über die neue geführte 1:N-Übung hinaus
   entwickeln.
8. Mehrstufige Normalisierungs- und gemischte Abituraufgaben ergänzen.
9. Nach dem ersten Unterrichtseinsatz Rückmeldungen der Lernenden und
   Lehrkraft sammeln und Prioritäten für den nächsten Release festlegen.

## 10. Ideen für spätere Versionen

- druckbares Kompetenzraster aus dem Lernstand
- Lehrkraft-Import mehrerer JSON-Dateien mit Plausibilitätsampel
- Unterrichtscode je Abgabe oder Stunde
- Optionaler, zufällig vergebener Wiederherstellungscode für ein lokales
  Schülerprofil. Er muss getrennt von der JSON-Sicherung aufbewahrt werden;
  ein in derselben Datei enthaltener Code belegt weder Identität noch
  Unverändertheit. Ein gleichbleibender Schul-PC ist ebenfalls kein Beweis.
- Später gegebenenfalls eine separat genehmigte Freigabeliste aus Kürzel und
  Klasse mit individuell ausgegebenen Aktivierungscodes; keine Abfrage oder
  Speicherung von Schul-/Microsoft-365-Passwörtern. Verbindliche Freigaben
  und bewertungsrelevante Nachweise benötigen serverseitige Prüfung.
- signierte Exportdateien über ein kleines datenschutzkonformes Backend
- freies SQL-Labor mit Schemaauswahl und Aufgabenhistorie
- Diagnosechecks vor einzelnen Unterrichtsstunden
- MySQL-spezifische Hinweise zu Abweichungen von SQLite
- optionale Musterlösungen nur in einer künftig getrennten Lehrkraftansicht;
  der vorhandene Entwicklermodus blendet sie vorerst bewusst nicht ein
- SQL-Coach anhand anonymisierter realer Fehlermuster weiterentwickeln
- optionale KI-Rückmeldung ausschließlich serverseitig, mit klarer
  Datensparsamkeit und ohne offen ausgelieferten API-Schlüssel

## 11. Arbeits- und Veröffentlichungsregeln

- `resources/` bleibt lokal und wird nicht veröffentlicht.
- Lösungen aus Originalmaterialien werden nicht direkt öffentlich kopiert.
- Bei einer statischen Website sind clientseitige Prüfdaten technisch im
  ausgelieferten JavaScript einsehbar. Der entfernte `Muster`-Reiter verhindert
  nur die direkte Anzeige in der Schüleroberfläche; für geheime,
  notenrelevante Musterantworten ist später eine getrennte Lehrkraft-Lösung
  oder ein geschütztes Backend nötig.
- Neue Webinhalte werden eigenständig formuliert und fachlich geprüft.
- Lernstandsänderungen müssen in Normalisierung, Export, Import und
  Dokumentation nachgezogen werden.
- Keine API-Schlüssel, personenbezogenen Klarnamen oder privaten Kontodaten in
  Clientcode, Repository oder Screenshots.
- Vor jeder Veröffentlichung: Syntaxprüfung, `git diff --check`, Desktop,
  Mobil, Tastatur, mindestens eine Übung je Übungstyp und Live-Smoke-Test.
- Veröffentlichung nur nach ausdrücklicher lokaler Freigabe.

## 12. Wichtige Dateien

| Datei | Aufgabe |
| --- | --- |
| `index.html` | App-Shell, Navigation, Profil- und Sicherungsdialoge |
| `styles.css` | responsives Light-/Dark-Design und Visualisierungen |
| `content.js` | Basislektionen, Übungen, SQL-Schemata und Befehle |
| `learning-path.js` | fünf Lernfortschritte, Vertiefungen und L1.1 |
| `app.js` | Routing, Freischaltung, Interaktionen, Persistenz und Export |
| `documentation/documentation.md` | Projektstand, Aufgaben, Materialmatrix und archivierte Fachnotizen |
| `documentation/screenshots/` | Screenshots vergangener Entwicklungsstände |

## Anhaenge: bisherige Projektdokumente

Die folgenden Abschnitte bewahren die frueheren Einzeldateien als historischen Projektstand. Alte Dateipfade in den uebernommenen Texten bezeichnen die damalige Struktur; aktuelle Pfade stehen oben in dieser Datei.


###### Bildsprache und Assets (frueher: `documentation/BILDSPRACHE_UND_ASSETS.md`)

#### Bildsprache und Assets

Stand: 18. Juni 2026

##### Leitentscheidung

Fotos zeigen reale Lernsituationen und geben den Bereichen einen hochwertigen,
professionellen Kontext. Fachlich verbindliche ERM/eERM-Diagramme werden nicht
als Foto gerendert: In HTML/CSS bleiben Entitätstypen, Attribute, Schlüssel,
Kardinalitäten und Eingabefelder lesbar, responsiv und prüfbar.

##### Generierte Bildserie

Die drei Motive wurden mit dem integrierten OpenAI-Bildwerkzeug neu für
WorkbenchLab erzeugt. Es handelt sich nicht um Fotos realer Schülerinnen oder
Schüler.

| Datei | Einsatz | Kern des Generierungsprompts |
| --- | --- | --- |
| `assets/images/learning-database-classroom.jpg` | Übersicht | Zwei 17- bis 18-jährige Lernende vergleichen im hellen Computerraum ein relationales Datenbankmodell mit der Arbeit am Laptop; dokumentarisch, natürlich, ohne Logos oder lesbaren Text. |
| `assets/images/eerm-workshop.jpg` | Modellieren | Lerngruppe modelliert eine Fahrradvermietung mit Entitätskarten, Beziehungen, Laptop und Notizen; fotorealistische Draufsicht, ohne lesbare Beschriftungen. |
| `assets/images/sql-lab.jpg` | SQL-Labor | Schüler testet eine SQL-Abfrage; Codeeditor und Ergebnistabelle sind als Struktur sichtbar, aber ohne lesbaren generierten Text; helle Unterrichtssituation. |

Alle Motive wurden auf maximal 1600 Pixel Breite skaliert und als JPEG mit
Qualitätsstufe 88 gespeichert. Die Originalgenerierungen bleiben außerhalb des
Repositories im lokalen Codex-Bildordner.

##### Gestaltungsregeln

- Fotos ersetzen keine Definition, Tabelle oder Modellnotation.
- Keine künstlichen Hologramme oder dekorativen Datenbank-Symbole.
- Keine Logos, Wasserzeichen oder lesbaren Fantasietexte.
- Bildausschnitte müssen auf Desktop und Mobil den Lernvorgang erkennen lassen.
- Alternativtexte beschreiben die Lernsituation, nicht die Optik.

###### BPE6-Abgleich (frueher: `documentation/BPE6_ABGLEICH_2026.md`)

#### BPE6-Abgleich

Stand: 18. Juni 2026

##### Bildungsplan

Quelle: [Bildungsplan Informatik Baden-Württemberg](https://bildungsplaene-bw.de/,Lde/In_OS_nichtTG)

Jahrgangsstufe 1 enthält BPE6 **Relationale Datenbanken** mit einem
Zeitrichtwert von 30 Stunden. Die Einheit verlangt, dass Schülerinnen und
Schüler aus realen Situationen Datenmodelle entwickeln, diese in ein
Datenbanksystem überführen und komplexe Datenbestände speichern, auswerten und
verändern.

##### Abdeckung in WorkbenchLab

| Bildungsplanbereich | Umsetzung in WorkbenchLab |
| --- | --- |
| BPE6.1 Entity-Relationship-Modell | Eigenes eERM-Modul mit Sachtextanalyse, Rollen und Ereignissen, Kardinalitäten, Optionalität und M:N-Auflösung; zwei interaktive Diagrammaufgaben; Workbench-Ablauf mit Forward Engineering und Synchronize Model |
| BPE6.2 Relationenmodell | Relation, Datensatz, Attribut, Primärschlüssel, Fremdschlüssel, Redundanz, 3NF |
| BPE6.3 relationale Datenbank und SQL-Datenpflege | CREATE DATABASE/USE, CREATE/INSERT/UPDATE/DELETE-Karten, INSERT-Übung, Skriptimport und Ergebniskontrolle in MySQL Workbench |
| BPE6.4 SQL-Auswertung über mehrere Tabellen | SELECT, DISTINCT, WHERE, LIKE, IN, BETWEEN, ORDER BY, Datums- und Aggregatfunktionen, GROUP BY, HAVING und JOIN-Übungen; eERM-Transferaufgabe zur Fahrradvermietung über drei Tabellen |
| BPE6.5 Massendaten | Big-Data-Lektion und Bewertungsübung |

##### Lokale Materialstruktur

Quelle: `resources\bpe-6-relationale-datenbanken`

Die lokalen Materialien enthalten:

- Lernfortschritt 1: eine Tabelle, Tabellenentwurf, Projektion, Selektion,
  Funktionen, Gruppierung, Datenpflege
- Lernfortschritt 2: Redundanzfreiheit, mehrere Tabellen, Fremdschlüssel,
  referentielle Integrität, Abfragen über mehrere Tabellen
- Lernfortschritt 3: M:N-Beziehungen, komplexere Modelle, SQL-Auswertungen,
  3NF
- Lernfortschritt 4: Zusatzthema Normalisierung 1NF bis 3NF
- Lernfortschritt 5: Big Data, digitale Spuren, Chancen und Risiken
- Kompetenzraster und Ich-kann-Listen

##### Aktueller Umsetzungsgrad

Die Version 0.5.0 deckt die gesamte Breite von BPE6 ab, aber noch nicht die
Tiefe aller Originalaufgaben. Besonders komplexe SQL-Auswertungen, freie
eERM-Konstruktion und mehrstufige Normalisierung können weiter ausgebaut werden.

Priorisierte Lücken:

1. Reverse Engineering und Workbench-Fehlerdiagnose
2. mehr SQL-Aufgaben über 5 bis 7 Tabellen
3. anspruchsvollere 3NF-Zerlegeaufgaben
4. Abiturähnliche kombinierte Aufgaben
5. Lehrkraftansicht oder Portfolioexport

###### BPE6-Materialmatrix und Lernpfad (frueher: `documentation/BPE6_MATERIALMATRIX_2026.md`)

#### BPE6 Materialmatrix und Lernpfad

Stand: 20. September 2026

Lokaler Entwicklungsstand: 0.7.0-local

##### Zweck

Diese Matrix dokumentiert, wie die lokalen Unterrichtsmaterialien des
Landesbildungsservers Baden-Württemberg in den WorkbenchLab-Lernpfad eingehen.
Die Homepage übernimmt keine Originalarbeitsblätter oder Musterlösungen.
Erklärungen, Beispieldaten und Aufgaben werden eigenständig formuliert und für
Browser sowie MySQL Workbench aufbereitet.

##### Lokaler Referenzbestand

Pfad:

`resources/bpe-6-relationale-datenbanken`

Erfasster Bestand:

| Dateityp | Anzahl | Verwendung |
| --- | ---: | --- |
| Word-Dokumente | 169 | Kompetenzraster, Informationen, Aufgaben, Lösungen und Aktivitätsverfolgung |
| SQL-Skripte | 45 | Themen- und Syntaxabgleich; nicht automatisch öffentlich übernommen |
| MySQL-Workbench-Modelle | 27 | Abgleich der Modellierungsfolgen und Fallkontexte |
| Videos | 3 | lokale Normalisierungsmaterialien; nicht in die Homepage kopiert |
| Präsentation | 1 | lokale Lehrkraftquelle zur Normalisierung |
| Gesamt | 245 | Referenzbestand außerhalb der öffentlichen Ausgabe |

##### Didaktische Abbildung

| Lernfortschritt | Lokaler Materialkern | WorkbenchLab-Einheiten | Praktische Umgebung |
| --- | --- | --- | --- |
| L1 Eine Tabelle | Tabellenentwurf, eine Relation, Workbench-Generierung und Import, Projektion, Selektion, Funktionen, Gruppierung, INSERT, UPDATE, DELETE | L1.1 bis L1.10 | MySQL Workbench und Browser-SQL |
| L2 Mehrere Tabellen | Redundanzfreiheit, Entitäten, Beziehungen, Kardinalitäten, Fremdschlüssel, referentielle Integrität und Equi-Join | L2.1 bis L2.4 | Workbench EER Diagram und SQL Editor |
| L3 Transfer und 3NF | M:N-Auflösung, komplexere Modelle, Mehrtabellenauswertung und Prüfung der Dritten Normalform | L3.1 bis L3.3 | Workbench EER Diagram und SQL Editor |
| L4 Normalisierung | 1NF, 2NF, 3NF und vollständige Zerlegefolge | L4.1 | Heft, Workbench-Modell und Browserübung |
| L5 Massendaten | digitale Spuren, Big-Data-Merkmale, Risiken, Missbrauchsfälle und Nutzen | L5.1 bis L5.3 | fiktive Fallanalyse ohne private Schülerkonten |

##### Zuordnung der Einheiten

###### Lernfortschritt 1

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L1.1 | Warum Datenbanken | `L1_1 Information Tabellenentwurf`, `L1_1 Aufgabe Tabellenentwurf` |
| L1.2 | Relation und Schlüssel | `L1_1 Information Tabellenentwurf`, `L1_2.1 Information Datenbank modellieren` |
| L1.3 | eERM Grundlagen | `L1_2.1` und `L1_2.2 Information Datenbank modellieren` |
| L1.4 | Vom Modell zur Datenbank | `L1_3 Information Datenbank generieren`, `L1_4 Information Daten importieren` |
| L1.5 | SELECT und Projektion | `L1_5.1 Information und Aufgabe`, `L1_5.2 Vertiefungsaufgabe` |
| L1.6 | Selektion und Sortierung | `L1_5.3 Information und Aufgabe`, `L1_5.4 Vertiefungsaufgabe` |
| L1.7 | DISTINCT und Filtermuster | `L1_5.7 Information und Aufgabe Redundanzen in Abfrageergebnissen` |
| L1.8 | Funktionen und Gruppierung | `L1_5.5` und `L1_5.8 Information und Aufgaben` |
| L1.9 | Datum und Berechnungen | `L1_5.6 Information Datum Funktionen` und Vertiefungsaufgabe |
| L1.10 | Daten verwalten | `L1_6`, `L1_7` und `L1_8 Information und Aufgaben` |

###### Lernfortschritt 2

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L2.1 | Vom Sachtext zum ER-Modell | `L2_2.1 Information Datenbankmodell 2 Tabellen`, `L2_2.5 Information Datenmodellierung` |
| L2.2 | Kardinalitäten begründen | `L2_2.1 Information`, Modellierungsaufgaben zu Fahrlehrern und Mitarbeitenden |
| L2.3 | Fremdschlüssel und Integrität | `L2_3 Information und Aufgabe referentielle Integrität` |
| L2.4 | JOIN über mehrere Tabellen | `L2_2.3 Information und Aufgabe`, `L2_4 Aufgabe Datenbankabfragen n Tabellen` |

###### Lernfortschritt 3

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L3.1 | M:N als Beziehungsentität | `L3_1 Information M-N-Beziehung`, Modellierungsaufgaben L3_1.1 bis L3_1.6 |
| L3.2 | M:N-Daten auswerten | `L3_2.1` und `L3_2.2 Aufgaben Datenbankabfragen` |
| L3.3 | Redundanz und 3NF | `L3_3 Information 3NF`, Aufgaben L3_3.1 bis L3_3.5 |

###### Lernfortschritt 4

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L4.1 | Normalisierung 1NF bis 3NF | `L4_3 Information Übersicht Normalformen`, Aufgaben L4_1 bis L4_3 |

###### Lernfortschritt 5

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L5.1 | Digitale Spuren | `L5_1 Information und Aufgabe Digitale Spuren im Netz` |
| L5.2 | Big Data Merkmale, Chancen und Risiken | `L5_2 Information und Aufgabe`, Aufgaben L5_3 und L5_5 |
| L5.3 | Big Data begründet beurteilen | Material zu Risiken, Cambridge Analytica und Nutzen als historische Ausgangspunkte |

##### Abweichungen und redaktionelle Entscheidungen

- Private Konten, reale Standortverläufe oder persönliche Aktivitätsdaten der
  Lernenden werden nicht für Aufgaben benötigt. Frühere Selbstversuche aus den
  lokalen Materialien werden durch fiktive Fälle ersetzt.
- Historische Zahlen, Webseiten und Fallbeschreibungen aus den älteren
  Big-Data-Unterlagen werden nicht ungeprüft als aktuelle Fakten übernommen.
- MySQL Workbench bleibt das verbindliche Unterrichtswerkzeug. Das
  Browserlabor nutzt SQLite über `sql.js` und kennzeichnet deshalb
  Dialektunterschiede.
- Lösungen aus den lokalen Unterlagen werden nicht in die öffentliche
  Schülerausgabe kopiert. Automatische Prüfungen verwenden eigene kleine
  Datensätze und erwartete Ergebnisse.
- Die BPE6-Kerninhalte folgen dem Bildungsplan. `UPDATE`, `DELETE`, `HAVING`
  und die vollständige Folge 1NF bis 3NF sind didaktische Ergänzungen des
  Lernwegs.

##### Abschluss und Leistungsbezug

Eine Lerneinheit gilt im lokalen Stand 0.7.0 erst als abgeschlossen, wenn die
Schülerin oder der Schüler die fachlichen Arbeitsschritte abhakt, den
Verständnischeck besteht und die Lehrkraft das Lernprodukt bestätigt. Die XP
sind eine motivierende Dokumentation, aber kein manipulationssicheres
Notensystem. Für die mündliche oder kontinuierlich erbrachte Leistung bleibt
die pädagogische Bewertung der Lehrkraft maßgeblich.

Die Lerneinheiten werden sequenziell freigeschaltet. L1.1 enthält als erste
vollständig vertiefte Einheit ein digitales Aufgabenblatt und eigene
Lernnotizen. JSON-Dateien dokumentieren Kürzel, Klasse, Profilherkunft,
Exportgerät und Prüfsumme; sie unterstützen die Zuordnung, ersetzen aber keine
Lehrkraftbeobachtung oder kryptografisch signierte Abgabe.

##### Veröffentlichungsstatus

Die Matrix und der neue Lernpfad sind lokal. Es wurde weder gepusht noch eine
GitHub-Pages-Veröffentlichung ausgelöst. Die Browserprüfung ist erfolgt; vor
einer Veröffentlichung folgen der Test am Schul-PC und die ausdrückliche
Freigabe.

###### Lernstand und Identitaet (frueher: `documentation/LERNSTAND_UND_IDENTITAET.md`)

#### Lernstand und Identität

Stand: 20. September 2026

##### Schülerkürzel und Klasse

WorkbenchLab speichert keinen vollständigen Namen. Schülerinnen und Schüler
verwenden ein Kürzel aus drei Buchstaben des Vornamens, einem Punkt und drei
Buchstaben des Nachnamens, zum Beispiel `MIA.MUE` für Mia Müller. Umlaute und
ß werden automatisch in `AE`, `OE`, `UE` und `SS` umgeschrieben.

Zusätzlich ist die offizielle Klassenkurzform Pflicht, zum Beispiel `J1-1`
oder `WGJ1/1`. Kürzel und Klasse müssen innerhalb einer Lerngruppe eindeutig
zugeordnet werden. Bei Namensgleichheit legt die Lehrkraft gemeinsam mit den
Betroffenen ein abweichendes anonymisiertes Kürzel fest.

##### Profil, Herkunftsgerät und Exportgerät

WorkbenchLab verwendet getrennte zufällige IDs:

- `profileId` gehört zum Lernstand und bleibt bei Export und Import erhalten.
- `profileDeviceId` bezeichnet das Browserprofil, auf dem das Lernprofil
  erstmals angelegt wurde.
- `deviceId` bezeichnet das Browserprofil, auf dem der aktuelle Export
  erzeugt wurde.
- `exportId` bezeichnet genau eine Exportdatei.

Bei einem Import bleibt die Profilherkunft erhalten. Zusätzlich wird eine auf
zwölf Einträge begrenzte Übertragungshistorie mit Quell-Export, Quellgerät,
Zielgerät und Importzeitpunkt geführt. Damit ist erkennbar, wenn ein Lernstand
zwischen Browserprofilen übertragen wurde.

Alle Kennungen werden zufällig im Browser erzeugt. Sie sind keine amtlichen
oder hardwaregebundenen Identitätsmerkmale.

##### Warum MAC und IP nicht gespeichert werden

Eine statische Browserseite darf keine MAC-Adresse des PCs auslesen. Auch eine
lokale IP-Adresse ist in modernen Browsern nicht zuverlässig verfügbar. Eine
öffentliche IP-Adresse würde einen externen Dienst voraussetzen und wäre in
der Schule häufig nur die gemeinsame Routeradresse vieler Geräte.

WorkbenchLab täuscht diese Werte deshalb nicht vor. Im Export stehen
`macAddress` und `ipAddress` auf `null` sowie eine verständliche technische
Erläuterung. Als zusätzliche Plausibilitätsdaten werden nur Plattform,
Browsersprache, Zeitzone, Bildschirmformat und Seitenursprung aufgenommen.

##### JSON-Format 3

Eine Sicherung enthält lesbare Identitäts-, Export- und Integritätsdaten:

```json
{
  "app": "WorkbenchLab",
  "formatVersion": 3,
  "appVersion": "0.7.0-local",
  "exportedAt": "2026-09-20T12:00:00.000Z",
  "exportId": "export_...",
  "identity": {
    "studentCode": "MIA.MUE",
    "studentClass": "WGJ1/1",
    "profileId": "profile_...",
    "profileOriginDeviceId": "device_...",
    "deviceId": "device_...",
    "deviceCode": "E5F6G7H8",
    "environment": {
      "platform": "Win32",
      "language": "de-DE",
      "timezone": "Europe/Berlin",
      "screen": "1920x1080x24"
    },
    "networkIdentifiers": {
      "macAddress": null,
      "ipAddress": null
    }
  },
  "summary": {
    "xp": 240,
    "completedLessons": 4,
    "completedTasks": 7
  },
  "data": {},
  "integrity": {
    "algorithm": "SHA-256",
    "digest": "..."
  }
}
```

Die SHA-256-Prüfsumme umfasst den vollständigen Export ohne den
`integrity`-Block. Beim Import wird sie vor der Übernahme kontrolliert.
Beschädigte oder ohne Neuberechnung veränderte Dateien werden abgelehnt.

##### Sicherheitsgrenze der Prüfsumme

Eine Prüfsumme ist keine digitale Signatur. Der Quellcode einer statischen
Website ist öffentlich; eine technisch versierte Person könnte Daten verändern
und anschließend selbst eine neue Prüfsumme erzeugen. Das Format verbessert
Nachvollziehbarkeit und Fehlererkennung, beweist aber nicht allein die
Urheberschaft.

Ein stärkerer Nachweis benötigt einen geheimen Lehrkraft-Schlüssel oder ein
authentifiziertes Backend, das Exporte serverseitig signiert. Ein solcher
Ausbau muss datenschutzkonform geplant werden und darf keine geheimen Schlüssel
im Browser ausliefern.

##### Einsatz durch die Lehrkraft

Für eine plausible Zuordnung werden gemeinsam betrachtet:

- Schülerkürzel und Klasse
- Profilcode und Profilherkunft
- Exportgerät und Exportzeitpunkt
- gültige Prüfsumme
- Übertragungshistorie
- sichtbare Arbeit im Unterricht
- erstellte SQL-, Workbench- und Modellierungsprodukte
- kurze fachliche Erläuterung durch die Schülerin oder den Schüler

XP und JSON-Datei unterstützen die Dokumentation, sind aber keine alleinige
Grundlage für eine Note.

##### Kompatibilität

Sicherungen mit `formatVersion: 1` und `formatVersion: 2` bleiben importierbar.
Sie besitzen keine SHA-256-Prüfsumme. Fehlen Kürzel oder Klasse, fordert
WorkbenchLab diese Angaben nach dem Import einmalig an.

###### SQL-Feedback und optionale KI (frueher: `documentation/SQL_FEEDBACK_UND_KI.md`)

#### SQL-Feedback und optionale KI

Stand: 18. Juni 2026

##### Umgesetzter Stand

Version 0.5.0 verwendet bewusst einen lokalen SQL-Coach. SQL-Code, Profil und
Lernstand verlassen den Browser nicht. Die Rückmeldung basiert auf der echten
Ausführung in `sql.js`, den geforderten Aufgabenbestandteilen und einem
Vergleich mit der erwarteten Ergebnismenge.

Der Coach darf Tipps geben. XP werden weiterhin ausschließlich durch die
deterministische Aufgabenprüfung vergeben. Für eine Note bleibt die
pädagogische Bewertung durch die Lehrkraft maßgeblich.

##### Warum kein API-Schlüssel im Browser liegt

WorkbenchLab wird statisch über GitHub Pages ausgeliefert. Jeder Schlüssel in
JavaScript wäre für Besucher einsehbar und könnte missbraucht werden. Eine
externe KI darf daher nur über ein serverseitiges Gateway angesprochen werden,
das den Schlüssel als Secret verwaltet, Anfragen begrenzt und Eingaben
minimiert.

##### Geprüfte kostenlose Optionen

Die folgenden Angaben wurden am 18. Juni 2026 anhand der offiziellen
Anbieterdokumentation geprüft und können sich ändern:

- [Google Gemini Developer API](https://ai.google.dev/gemini-api/docs/pricing):
  kostenloses Kontingent vorhanden; Inhalte des Free Tier können laut
  Preisseite zur Produktverbesserung verwendet werden. Für Schülercode und
  Leistungsbezug ist das ohne zusätzliche schulische Prüfung keine gute
  Voreinstellung.
- [Groq API](https://console.groq.com/docs/rate-limits): Free-Plan mit
  modellabhängigen Tages- und Minutenlimits. Auch hier muss der Schlüssel
  serverseitig liegen und die schulische Datenschutzfreigabe vorliegen.
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/):
  laut Preisseite 10.000 Neurons pro Tag kostenfrei. Ein Worker eignet sich
  technisch als Gateway vor GitHub Pages, benötigt aber Konto, Secret,
  Missbrauchsschutz und eine schulische Datenschutzentscheidung.

##### Empfohlene Zielarchitektur

1. WorkbenchLab sendet nur Aufgaben-ID, Schemaausschnitt und SQL-Entwurf.
2. Name, XP, Lernstand und Browser-ID werden nie übertragen.
3. Ein Cloudflare Worker oder eigener Schulserver hält den API-Schlüssel.
4. Das Gateway setzt Rate Limits, maximale Eingabelänge und feste Prompts.
5. Das Modell liefert nur strukturiertes Feedback mit Hinweis und Begründung.
6. Die lokale Prüfung entscheidet weiterhin über richtig oder falsch.
7. Externe Rückmeldung wird als KI-Hinweis gekennzeichnet und protokolliert
   keine personenbezogenen Daten.

Vor einer Aktivierung sind Anbieterbedingungen, Auftragsverarbeitung,
Speicherorte, Löschfristen sowie die schulischen Vorgaben zum Einsatz
generativer KI zu prüfen. Bis dahin ist der lokale Coach die robuste und
datensparsame Lösung.

###### Technik und Didaktik (frueher: `documentation/TECHNIK_UND_DIDAKTIK.md`)

#### Technik und Didaktik

Stand: 18. Juni 2026

##### Didaktisches Modell

WorkbenchLab folgt einem wiederholbaren Lernzyklus:

1. Ein Begriff oder Verfahren wird kurz erklärt.
2. Ein kleines Beispiel macht die Denkweise sichtbar.
3. Ein Verständnischeck sichert den Kern.
4. Eine Übung prüft die Anwendung.
5. XP und Erfolge geben Rückmeldung über kontinuierliches Arbeiten.

Die Inhalte sind bewusst in kleine Lernschritte geteilt, weil BPE6 fachlich
dicht ist. Modellierung und SQL werden nicht getrennt behandelt: Jede
SQL-Abfrage verweist auf das zugrunde liegende Datenmodell.

##### SQL im Browser

Das SQL-Labor nutzt lokal eingebundenes `sql.js`, also SQLite im Browser.
Lucide und `sql.js` liegen unter `vendor/`; zur Laufzeit ist kein CDN nötig.
Vorteile:

- kein Server nötig
- GitHub-Pages-kompatibel
- gefahrloses Experimentieren
- unmittelbares Feedback
- einfache Lernstandsprüfung

Der SQL-Coach ergänzt die reine Ergebnisprüfung um eine erklärbare Diagnose:

1. Ist die Anweisung ausführbar?
2. Sind die geforderten SQL-Bestandteile enthalten?
3. Stimmen Spaltenzahl, Zeilenzahl und Werte?
4. Ist eine geforderte Sortierung korrekt?

Typische SQLite-Meldungen wie unbekannte Tabelle, unbekannte oder mehrdeutige
Spalte und unvollständige Eingabe werden in konkrete deutsche Prüfschritte
übersetzt. Die Analyse arbeitet vollständig lokal und beeinflusst XP nur dann,
wenn die bestehende deterministische Aufgabenprüfung bestanden wird.

Grenzen:

- MySQL Workbench wird nicht ersetzt.
- Nicht jede MySQL-Syntax funktioniert in SQLite.
- Die Originalskripte aus den Unterrichtsmaterialien müssen in MySQL Workbench
  genutzt werden.
- Der Browser-Lernstand ist nicht manipulationssicher.
- Der Coach ist eine didaktische Heuristik und keine allgemeine SQL-KI.

Für BPE6-Übungen werden eigene kleine Fahrschul-Datensätze verwendet. Sie sind
fachlich an den Unterricht angelehnt, aber nicht als direkte Kopie von
Originalarbeitsblättern oder Lösungen gedacht.

##### Lernstand

Der Lernstand liegt im `localStorage` unter `workbenchlab-v1` und enthält:

- anonymisiertes Schülerkürzel im Format `ABC.DEF`
- portable Profil-ID
- abgeschlossene Lektionen
- gelöste Übungen
- gelöste Befehls-Miniaufgaben
- SQL-Entwürfe
- Slot-Antworten
- Aktivitätstage
- zuletzt geöffnete Lektion

Export und Import verwenden ein JSON-Format mit `app: "WorkbenchLab"` und
`formatVersion: 2`. Der Export ergänzt eine zufällige Export-ID, die App-Version,
einen Zeitstempel und eine lokale Browser-/Geräte-ID. Die Profil-ID wird beim
Import übernommen; die Geräte-ID des Zielbrowsers bleibt unverändert. Dateien
mit `formatVersion: 1` können weiterhin geladen werden und verlangen danach
einmalig ein gültiges Schülerkürzel.

Die IDs erleichtern die organisatorische Zuordnung, sind aber weder
Hardware-Fingerprinting noch ein manipulationssicherer Leistungsnachweis.
Details stehen in `docs/LERNSTAND_UND_IDENTITAET.md`.

##### Leistungsbewertung

XP und Erfolge können sichtbar machen, dass regelmäßig geübt wurde. Sie sind
für die kontinuierlich erbrachte Leistung hilfreich, aber nicht alleinige
Notengrundlage. Sinnvoll ist eine Kombination aus:

- beobachteter Mitarbeit
- kurzen mündlichen Erklärungen
- WorkbenchLab-Lernstand
- SQL-/Modellierungsprodukten aus dem Unterricht
- Reflexion oder Portfolio

##### Barrierearmut und Bedienung

- semantische Buttons und Formulare
- Tastaturbedienung für Karten
- sichtbare Fokuszustände
- responsive Layouts
- Export/Import für Gerätewechsel
- Light- und Dark-Mode

##### Bildsprache

Fotorealistische Unterrichtsmotive schaffen Kontext auf Übersicht, eERM- und
SQL-Einstieg. Die eigentlichen ERM/eERM-Modelle bleiben HTML/CSS-basiert, weil
Kardinalitäten, Schlüssel und Attribute dort scharf, responsiv, zugänglich und
automatisch prüfbar sind. Herkunft und Prompts sind unter
`docs/BILDSPRACHE_UND_ASSETS.md` dokumentiert.

##### Veröffentlichungsentscheidung

Öffentlich veröffentlicht werden nur:

- eigenständig formulierte Erklärungen
- eigene Übungsdaten
- App-Code
- Dokumentation
- kleine selbst bereitgestellte Screenshots zum Startablauf

Nicht veröffentlicht werden:

- lokale BPE6-Originalmaterialien
- Musterlösungen
- große Medienpakete
- private Unterrichtsablagen

###### Bisherige Taskliste (frueher: `TASKS.md`)

#### WorkbenchLab Tasks und Projektstand

Stand: 20. September 2026

Lokaler Entwicklungsstand: 0.7.0-local

Veröffentlichter Stand: 0.5.0

##### Leitentscheidung

WorkbenchLab wird als eigenes öffentliches Lernportal aufgebaut. Die lokalen
BPE6-Originalmaterialien dienen als fachliche Referenz, werden aber nicht
ungeprüft veröffentlicht. Öffentliche Inhalte werden eigenständig formuliert
und als interaktive Lernmodule umgesetzt.

##### Erledigt

- 2026-09-20: Version `0.7.0-local` mit Dark Mode als Standard, Pflichtfeld
  Klasse und überarbeitetem Profil-Dialog umgesetzt.
- 2026-09-20: JSON-Format 3 mit Profilherkunft, aktuellem Exportgerät,
  Übertragungshistorie, Geräteumgebung und SHA-256-Prüfsumme ergänzt; MAC- und
  IP-Grenzen transparent dokumentiert.
- 2026-09-20: Sequenzielle Freischaltung über alle 21 Einheiten umgesetzt;
  direkte Lektions- und Übungslinks beachten dieselbe Sperre.
- 2026-09-20: `AltGr + S` blendet einen sitzungsbezogenen Entwicklerschalter
  ein, der alle Einheiten zur Vorschau öffnet, ohne Abschlüsse zu vergeben.
- 2026-09-20: Zweistufiges Lernpfad-Menü mit L1 bis L5, Lektionsuntermenüs,
  Sperrstatus und Breadcrumbs umgesetzt.
- 2026-09-20: L1.1 aus Information, Aufgabe und Vorlage vollständig als
  Weblektion mit Definitionen, Datentypen, eigener Illustration, digitalem
  Tabellenentwurf und Lernnotizen integriert.
- 2026-09-20: Alle 21 Lektions- und 27 Übungsrouten erneut im Browser geprüft;
  Dark Mode, Sperrkette, Entwicklermodus, lokale Eingabepersistenz und
  Freischaltung von L1.2 erfolgreich getestet; keine Konsolenfehler.
- 2026-09-20: Mobile Profilansicht bei 390 × 844 und Desktopansicht bei
  1440 × 1000 visuell geprüft; keine Überlagerung der Dialogfelder und Buttons.
- 2026-09-20: Ausführliche, zentrale `documentation.md` mit Versionen,
  Entscheidungen, erledigten und offenen Aufgaben angelegt.

- 2026-09-20: Excel-Lab als Referenz für Startseite, Lernpfad,
  Unterrichtseinheiten und lehrkraftbestätigten Abschluss ausgewertet.
- 2026-09-20: Lokalen BPE6-Bestand mit 245 Dateien strukturiert erfasst:
  169 DOCX, 45 SQL-Skripte, 27 Workbench-Modelle, drei Videos und eine
  Präsentation.
- 2026-09-20: Kompetenzraster und Ich-kann-Listen erneut ausgewertet und den
  fünf Lernfortschritten zugeordnet.
- 2026-09-20: Die vorhandenen Lektionen in fünf quellennahen Lernfortschritten
  neu geordnet und um zwei Einheiten zu digitalen Spuren und begründeter
  Big-Data-Bewertung erweitert.
- 2026-09-20: Alle 21 Einheiten um einen integrierten Arbeitsauftrag für
  Browser, Heft oder MySQL Workbench, ein konkretes Lernprodukt,
  Abschlusskriterien und Materialbezug ergänzt.
- 2026-09-20: Lektionsabschluss auf Selbstkontrolle, Verständnischeck und
  Lehrkraftbestätigung umgestellt; ältere gespeicherte Abschlüsse bleiben
  gültig.
- 2026-09-20: SQL-Labor um automatisch prüfbare Aufgaben für `CREATE TABLE`,
  `UPDATE` und `DELETE` erweitert; insgesamt 27 Übungen im lokalen Stand.
- 2026-09-20: Schülerbezogene Selbstversuche mit privaten Konten aus dem
  Big-Data-Pfad entfernt und durch fiktive, datensparsame Fallanalysen ersetzt.
- 2026-09-20: Materialmatrix und Veröffentlichungsstatus dokumentiert; noch
  kein Push und keine Änderung der Live-Seite.
- 2026-09-20: Alle 21 Lektionsrouten, 13 SQL-Aufgaben und 14 weitere
  Übungstypen automatisiert im Browser erfolgreich geprüft; keine Konsolen-
  oder Seitenfehler.
- 2026-09-20: Lernpfad bei 1440 Pixeln und die vollständige Lektionsansicht bei
  390 Pixeln visuell geprüft; mobiler horizontaler Überlauf 0 Pixel.

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
- 2026-06-18: Version 0.3.0 um ein eigenes Modul `eERM modellieren` mit drei
  vertiefenden Lektionen und dem bestehenden Workbench-Ablauf erweitert.
- 2026-06-18: Sachtextanalyse, Rollen/Ereignisse, Zwei-Satz-Methode,
  Optionalität und M:N-Auflösung didaktisch neu aufbereitet.
- 2026-06-18: Neuer interaktiver Diagramm-Aufgabentyp mit Entity-Kästen,
  Beziehungslinien, Kardinalitäts- und Fremdschlüsselauswahl implementiert.
- 2026-06-18: Zwei konkrete eERM-Diagrammaufgaben zu Fahrradvermietung und
  schulischen Bildungsangeboten ergänzt.
- 2026-06-18: Normalisiertes Fahrradvermietungs-Schema und Drei-Tabellen-
  SQL-Aufgabe mit `JOIN` und `DATEDIFF` ergänzt.
- 2026-06-18: Schlüsselbibliothek um `PRIMARY KEY`/`AUTO_INCREMENT` und
  `FOREIGN KEY`/`REFERENCES` erweitert.
- 2026-06-18: Vollständiger Browser-Regressionstest für 19 Lektionsquizze,
  22 Übungen und 17 Befehls-Miniaufgaben erfolgreich; keine Konsolenfehler.
- 2026-06-18: eERM-Diagramme bei 1440 und 390 Pixeln geprüft; mobile
  Beziehungskette ohne horizontalen Überlauf oder abgeschnittene Felder.
- 2026-06-18: Version 0.4.0 mit drei eigens generierten, fotorealistischen
  Unterrichtsmotiven für Übersicht, eERM-Werkstatt und SQL-Labor gestaltet.
- 2026-06-18: Fachdiagramme bewusst als zugängliche HTML/CSS-Modelle
  beibehalten; Fotos dienen dem Kontext und ersetzen keine prüfbare Notation.
- 2026-06-18: Lokalen SQL-Coach mit Coach-Tipp, Kriteriencheck,
  Ergebnisvergleich, Sortierungsdiagnose und didaktisch übersetzten
  Fehlermeldungen implementiert.
- 2026-06-18: Kostenlose KI-API-Optionen geprüft und eine serverseitige,
  datensparsame Zielarchitektur dokumentiert; keine Schlüssel im Browser.
- 2026-06-18: SQL-Coach mit korrekter Lösung, falscher Sortierung und
  Syntaxfehler geprüft; alle zehn SQL-Aufgaben bestehen weiterhin ihre
  deterministische XP-Prüfung.
- 2026-06-18: Neue Bildbereiche und SQL-Coach bei 1440 und 390 Pixeln geprüft;
  alle Bilder geladen, kein horizontaler Überlauf, keine Konsolenfehler.
- 2026-06-18: Version 0.5.0 mit verbindlichem anonymisiertem Schülerkürzel im
  Format `ABC.DEF`, verständlicher Eingabehilfe und klarer Fehlermeldung
  umgesetzt.
- 2026-06-18: Überlappung zwischen Fokusrahmen des Profilfelds und den
  Dialogbuttons beseitigt; Dialog für Desktop und Mobilansicht überarbeitet.
- 2026-06-18: JSON-Sicherung auf Format 2 erweitert: Schülerkürzel, portable
  Profil-ID, lokaler Browser-/Gerätecode, Export-ID, App-Version, Zeitstempel
  und kompakte Fortschrittszusammenfassung.
- 2026-06-18: Import übernimmt die Profil-ID, aber niemals die Geräte-ID des
  Quellgeräts; Sicherungen im bisherigen Format 1 bleiben importierbar.
- 2026-06-18: Datenschutzgrenzen der lokalen Identitäten und Einsatzhinweise
  für die Leistungsbewertung dokumentiert.

##### Offen Priorisiert

1. L1.2 anhand der zugehörigen Informations-, Aufgaben- und Vorlagendateien
   in derselben Tiefe wie L1.1 ausarbeiten.
2. Anschließend L1.3 bis L5.3 schrittweise mit direkt ausfüllbaren,
   quellennahen Arbeitsblättern ergänzen.
3. Den lokalen Stand zusätzlich mit einem Screenreader-Stichprobentest
   abnehmen.
4. Die neuen Workbench-Aufträge an einem Schul-PC mit Informatik-Stick,
   MySQL-Dienst und der tatsächlich eingesetzten Workbench-Version erproben.
5. Browserprüfung mit echten Schüler-Workflows im Unterricht durchführen.
6. Workbench-Pfad um Reverse Engineering, Modellversionen und typische
   Fehlermeldungen beim Verbindungsaufbau erweitern.
7. eERM-Werkstatt um freie Drag-and-Drop-Modelle und eine differenzierte
   Plausibilitätsrückmeldung für mehrere richtige Modellvarianten erweitern.
8. Normalisierung mit mehrstufigen Zerlege-Aufgaben erweitern.
9. Abitur-Training mit gemischten Modellierungs- und SQL-Aufgaben ergänzen.
10. Lehrkraftansicht planen: mehrere JSON-Lernstände anhand Schüler-, Klassen-,
   Profil- und Gerätecode sowie Prüfsummenstatus zusammenführen.
11. Belastbaren Abgabenachweis über Lehrkraft-Code oder serverseitige Signatur
   datenschutzkonform konzipieren.
12. Erst nach ausdrücklicher lokaler Freigabe Version 0.7.0 festschreiben,
   committen, pushen und GitHub Pages prüfen.

##### Ideen

- Aufgabenserien nach BPE6.1 bis BPE6.5 filterbar machen.
- Freies SQL-Labor mit auswählbarem Schema und Aufgaben-Historie ergänzen.
- JSON-Portfolio für Schülerinnen und Schüler mit Reflexionsfeldern.
- Kleine Diagnosetests vor jeder Unterrichtsstunde.
- SQL-Coach anhand anonymisierter Fehlversuche aus dem Unterricht weiter
  verfeinern.
- MySQL-spezifische Unterschiede zu SQLite als Warnkarten anzeigen.
- Druckbares Kompetenzraster aus dem aktuellen Lernstand erzeugen.
- Optionales Backend nur datenschutzkonform und nicht mit offenem API-Key im
  Browser.

##### Arbeitsregeln

- `resources/` bleibt lokal und wird nicht veröffentlicht.
- Lösungen aus den Originalmaterialien nicht direkt in öffentliche Dateien
  kopieren.
- Neue öffentliche Inhalte eigenständig formulieren.
- Inhaltliche Daten bevorzugt in `content.js` pflegen.
- Lernstandsänderungen immer in Normalisierung, Export/Import und README
  nachziehen.
- `documentation.md` ist der verbindliche ausführliche Projektstand; diese
  Datei bleibt die kompakte Arbeitsliste.
- Vor Veröffentlichung mindestens ausführen:
  - `node --check app.js`
  - `node --check content.js`
  - `git diff --check`
  - Desktop- und Mobilansicht im Browser prüfen
  - SQL-Labor mit mindestens einer SELECT-, GROUP-BY-, INSERT- und JOIN-Aufgabe
    testen

###### Bisherige Uebergabe (frueher: `UEBERGABE_Codex.md`)

#### Übergabe WorkbenchLab

Stand: 20. September 2026

Lokaler Entwicklungsstand: 0.7.0-local

Live-Version: 0.5.0

Live: `https://jakobsawazki.github.io/WorkbenchLab/`

Repository: `https://github.com/JakobSawazki/WorkbenchLab`

##### Projektziel

WorkbenchLab ist die Datenbank-Schwester von PythonLab. Es soll Schülerinnen
und Schüler in J1 durch BPE6 Relationale Datenbanken führen und kontinuierliche
Übungsleistung sichtbar machen.

##### Wichtige Pfade

- Projekt: `G:\Meine Ablage\Codex\WorkbenchLab`
- Lokale BPE6-Materialien:
  `G:\Meine Ablage\Codex\WorkbenchLab\resources\bpe-6-relationale-datenbanken`
- Bildungsplan-PDF:
  `G:\Meine Ablage\Codex\WorkbenchLab\resources\29-TB02-Inhalt-Band 2a-AG-3 Informatik.pdf`

##### Aktueller Stand

Der lokale Entwicklungsstand erweitert die bisherige App um einen
Excel-Lab-ähnlichen Unterrichtsablauf. `learning-path.js` ordnet die Inhalte in
die fünf Lernfortschritte des lokalen Kompetenzrasters ein. Alle 21 Einheiten
enthalten nun integrierte Informationsabschnitte, einen konkreten Arbeitsauftrag
für Browser, Heft oder MySQL Workbench, ein Lernprodukt, Quellenhinweise und
Abschlusskriterien. Lektions-XP werden erst nach Selbstkontrolle, bestandenem
Verständnischeck und Lehrkraftbestätigung vergeben.

Version 0.7.0 ergänzt eine verbindliche Reihenfolge: Zu Beginn ist nur L1.1
offen, jede abgeschlossene Einheit schaltet genau die nächste frei. Das
zweistufige Lernpfad-Menü zeigt L1 bis L5 und alle zugehörigen Einheiten. Über
`AltGr + S` wird ein sitzungsbezogener Entwicklerschalter eingeblendet, der
alle Einheiten für die Unterrichtsvorbereitung öffnet, ohne Fortschritt zu
verändern. Dark Mode ist jetzt der Standard.

L1.1 ist vollständig aus Information, Aufgabe und Vorlage neu aufbereitet. Die
Lektion enthält vier Fachdefinitionen, sechs MySQL-Datentypen, eine eigene
Kontaktkarten-Illustration, ein direkt ausfüllbares Tabellenentwurfsblatt und
lokal gespeicherte eigene Notizen.

Das SQL-Labor enthält im lokalen Stand 27 Übungen. Neu hinzugekommen sind
ausführbare und automatisch prüfbare Aufgaben für `CREATE TABLE`, `UPDATE` und
`DELETE`. Zwei zusätzliche Einheiten behandeln digitale Spuren und eine
begründete Big-Data-Fallanalyse, ohne private Schülerkonten oder reale
Standortverläufe einzubeziehen.

Dieser Stand wurde noch nicht zu GitHub übertragen. Die Live-Seite bleibt bis
zur ausdrücklichen Freigabe unverändert auf Version 0.5.0.

Die lokale Browserregression vom 20. September 2026 umfasst alle 21
Lektionsseiten und alle 27 Übungen. Desktop- und Mobilansicht wurden mit 1440
beziehungsweise 390 Pixeln geprüft. Dark-Mode-Start, Sperrkette,
Entwicklermodus, L1.1-Persistenz und Profil-Dialog wurden zusätzlich geprüft;
es traten keine Konsolenfehler auf.

Die erste lauffähige Version ist als statische App umgesetzt:

- `index.html`
- `styles.css`
- `content.js`
- `learning-path.js`
- `app.js`

Die App enthält Lernpfad, SQL-Labor, Modellierungsübungen, Befehle,
Nachschlagen, Erfolge, lokale Lernstandsicherung und Theme-Schalter.

Version 0.5.0 umfasst 19 Lektionen, 22 Übungen und 17 SQL-Befehlskarten. Das
eigene Modul `eERM modellieren` führt vom Sachtext über Kardinalitäten zur
M:N-Auflösung. Zwei interaktive Diagrammaufgaben prüfen Kardinalitäten und
Fremdschlüssel direkt im Modell. Eine dritte Übungsdatenbank verbindet die
Fahrradvermietungs-Modellierung mit einer Drei-Tabellen-SQL-Abfrage.

Eine fotorealistische, eigens generierte Bildserie rahmt die Lernbereiche,
während Fachdiagramme weiterhin präzise und interaktiv in HTML/CSS bleiben.
Der lokale SQL-Coach übersetzt Fehler, prüft Aufgabenbestandteile und vergleicht
Ergebnismengen, ohne Schülercode an einen externen Dienst zu senden.

Das lokale Lernprofil verwendet ein anonymisiertes Schülerkürzel im Format
`ABC.DEF` und eine verpflichtende Klassenkurzform. JSON-Sicherungen enthalten
Profilherkunft, aktuelles Exportgerät, eine begrenzte Übertragungshistorie und
eine SHA-256-Prüfsumme. Das Exportformat ist Version 3; Dateien der Versionen 1
und 2 werden weiterhin angenommen. MAC- und IP-Adressen werden nicht
vorgetäuscht, weil eine statische Browserseite sie nicht zuverlässig ermitteln
kann. Eine Prüfsumme erkennt Änderungen, ist aber keine geheime Signatur.

Die ausführliche Historie, Sicherheitsgrenzen, Prüfprotokolle und offene
Aufgaben stehen zentral in `documentation.md`.

##### Didaktische Struktur

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

##### Technische Hinweise

- Browser-SQL nutzt die lokal unter `vendor/` eingebundene `sql.js`-Version.
- Die SQL-Schemata stehen in `content.js`.
- MySQL-Funktionen `YEAR`, `MONTH`, `NOW` und `DATEDIFF` werden im Browser nachgebildet.
- Für Unterrichtsskripte bleibt MySQL Workbench verbindlich.
- Der SQL-Coach arbeitet vollständig im Browser; eine KI-API ist nicht aktiv.
- Ein späteres KI-Gateway darf keine Schlüssel im Frontend enthalten und nicht
  allein über XP oder Leistungsbewertung entscheiden.
- `resources/` ist per `.gitignore` ausgeschlossen.

##### Nächste sinnvolle Schritte

1. L1.2 und danach die weiteren Einheiten so tief wie L1.1 ausarbeiten.
2. Die Workbench-Arbeitsaufträge an einem Schul-PC mit Informatik-Stick testen.
3. Einen Screenreader-Stichprobentest durchführen.
4. Lehrkraftansicht und signierten Abgabenachweis konzipieren.
5. Schülerfeedback aus dem ersten Unterrichtseinsatz dokumentieren.
6. eERM-Interaktion zu freien Drag-and-Drop-Modellen erweitern.
7. Erst nach Freigabe Version 0.7.0 veröffentlichen und die Live-Seite prüfen.

###### BPE6-Quellenentscheidung (frueher: `references/bpe6/README.md`)

#### BPE6-Quellen und Integrationsentscheidung

Stand: 18. Juni 2026

##### Lokale Quelle

Die BPE6-Materialien liegen lokal unter:

`G:\Meine Ablage\Codex\WorkbenchLab\resources\bpe-6-relationale-datenbanken`

Diese Ablage enthält Informationsblätter, Aufgaben, Lösungen, SQL-Skripte,
MySQL-Workbench-Modelle, Kompetenzraster und Ich-kann-Listen.

##### Öffentliche Quellen

- Bildungsplan: <https://bildungsplaene-bw.de/,Lde/In_OS_nichtTG>
- Materialübersicht: <https://www.schule-bw.de/faecher-und-schularten/mathematisch-naturwissenschaftliche-faecher/informatik/material/materialien-zum-neuen-bildungsplan-informatik-an-den-nichtgewerblichen-beruflichen-gymnasien>
- Informatik-Stick / Schultasche-BW: <https://schultasche-bw.de/>

##### Entscheidung

Die Originalmaterialien werden nicht direkt veröffentlicht. WorkbenchLab nutzt
sie als didaktische und fachliche Referenz. Öffentliche Inhalte werden:

- in eigener Sprache formuliert
- in interaktive Übungen übertragen
- mit eigenen kleinen Beispieldaten versehen
- transparent auf Bildungsplan und Landesbildungsserver verlinkt

Musterlösungen und originale Arbeitsblätter bleiben lokal.

###### BPE6-Materialmanifest (frueher: `references/bpe6/MANIFEST.md`)

#### BPE6 Lokales Manifest

Stand: 20. September 2026

Erfasster Umfang: 245 Dateien, darunter 169 DOCX, 45 SQL-Skripte, 27
MySQL-Workbench-Modelle, drei Videos und eine Präsentation.

Nicht öffentlich zu veröffentlichender lokaler Referenzbestand:

- `resources/29-TB02-Inhalt-Band 2a-AG-3 Informatik.pdf`
- `resources/bpe-6-relationale-datenbanken/Kompetenzraster_Datenbank.docx`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 1`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 2`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 3`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 4`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 5`

Öffentlich nutzbar sind nur eigenständig formulierte Ableitungen in
`content.js`, Dokumentation und App-Texten.
