# Abgleich der offenen Punkte bis 0.48.0

Grundlage: Jakobs autarker Folgeauftrag, `claude2codex.md`, die Entscheidungen
in `codex2claude.md` und der aktuelle Quellstand. Die alte Claude-Uebergabe
bleibt als historisches Dokument unveraendert. Ihre Offen-Markierungen sind
kein aktueller Arbeitsauftrag, wenn die Funktion inzwischen umgesetzt wurde.

## Aktuell nachgewiesener Stand

- Vor diesem Dokumentationsnachtrag entsprachen lokaler und per GitHub-API
  abgefragter `main` beide dem Release-
  Commit `5429822349e0c10c1b6969da96b599d968dc0841`.
- Pages-Lauf `38716244037` ist erfolgreich abgeschlossen. Release `v0.48.0`
  ist oeffentlich, nicht als Entwurf gespeichert.
- ZIP: 10.952.073 Bytes; GitHub meldet SHA-256
  `2b2840b13235a6b31259c9a264a66f114b2d4b42e81617978926f411ebf5a49c`.
- Beide nativen Pruefer erneut ausgefuehrt: 168 Pruefungen gegen MariaDB
  10.4.13 sowie zwoelf Skriptimporte, Abfragen und Fremdschluessel bestanden.
  Sie verwenden eigene temporaere Datenverzeichnisse und wurden beendet.
- `git fetch` scheitert erneut an `refs/desktop.ini`. Kein Metadatum wurde
  entfernt und kein alternativer Loeschweg benutzt. Der direkte API-Abgleich
  bestaetigt den Remote-Stand unabhaengig vom defekten lokalen Fetch.

## Claudes Vorschlaege

| Punkt | Aktueller Befund | Konkreter Nachweis |
| --- | --- | --- |
| OPT-01 Freies SQL-Labor | umgesetzt | `app.js`, `tests/sql-playground.browser.cjs` |
| OPT-02 Deutsche Fehler | umgesetzt | `sql-feedback.js`, `tests/sql-feedback.test.js`, `tests/mysql-lab.browser.cjs` |
| OPT-03 Aufgabentypen | umgesetzt | `debug-exercises.js`, `predict-exercises.js`, `order-exercises.js` und gleichnamige Tests |
| OPT-04 Modell-Editor samt Erweiterungen | umgesetzt: drei einmalige XP-Bewertungen, gesicherte Kopien, optionale Kraehenfuesse | `erm-editor.js`, `tests/erm-editor.browser.cjs`, `tests/erm-progress.browser.cjs`, `tests/erm-backup.browser.cjs` |
| OPT-05 Kuerzere Einheiten | von Jakob verworfen; eine Einheit bleibt eine Seite | Entscheidung vom 9. Oktober, Uebergabe A0/C1 |
| OPT-06 Freischaltung | Uebungen frei, Lerneinheiten nacheinander | `isPracticeUnlocked` in `app.js`, `tests/lesson-completion.browser.cjs` |
| OPT-07 Wiederholung/Klausur | umgesetzt | `review.js`, `tests/review.browser.cjs`, `tests/exam.browser.cjs` |
| OPT-08 Klassenuebersicht | umgesetzt | `teacher-overview.js`, `tests/teacher-overview.browser.cjs` |
| OPT-09 Lehrkraft-Bestaetigung | Empfehlung b umgesetzt: eigene Liste und Sicherung auf dem Lehrkraftgeraet, separate bestaetigte CSV-Werte | `teacher-overview.js`, `tests/teacher-reviews.browser.cjs`; kein Echtheitsversprechen fuer Schuelereintraege |
| OPT-10 Deployment-Gates | Node-/Python-Gates vor Pages; vollstaendige lokale Browser-Gates im Releasebericht | `.github/workflows/pages.yml`, `documentation/releases/RELEASE_0_48_0.md` |
| OPT-11 Oeffentliche Dateiliste | umgesetzt; Ressourcen/Loesungsdatei nicht im Website-Bau | `tools/build-site.cjs`, `tests/public-site.test.js`, `tests/public-site.browser.cjs` |
| OPT-12 Loesungen im Quelltext | veroeffentlichte App gefiltert; oeffentlicher Repository-Verlauf als Grenze von Jakob akzeptiert | Entscheidung vom 12. Oktober in `codex2claude.md`; `tests/public-site.test.js` |
| OPT-13 Versionsgleichstand | umgesetzt | beide HTML-Seiten, `content.js`, `learning-path.js`, `package.json`; automatisierte Tests |
| OPT-14 Dokumentation | Wegweiser, Changelog, Releaseberichte und Archiv vorhanden; aktueller Abgleich hier | `documentation/documentation.md`, `CHANGELOG.md`, `documentation/releases/`, `documentation/archiv/` |
| OPT-15 Offline-Betrieb | ZIP und freiwillige HTTPS-Offline-Kopie umgesetzt; Vor-Ort-Abnahme nur teilweise berichtet | `tools/build-offline.cjs`, `offline-client.js`, `offline-worker.js`, `tests/offline.browser.cjs`, `tests/offline-cache.browser.cjs`; separate Schul-PC-Liste |
| OPT-16 Aufteilen | vereinbarte Auslagerungen und sechs CSS-Dateien umgesetzt; kein weiterer Umbau vereinbart | `sql-check.js`, `backup.js`, `state.js`, `tests/styles-split.test.js`; Notizeditor zusaetzlich `note-text.js` |
| OPT-17 Artefakte/PNG | Tests schreiben nach System-Temp; drei ungenutzte PNG-Originale bleiben lokal, nicht im Website-Bau | `tests/artifacts.cjs`, `tools/build-site.cjs`, `tests/public-artifact.test.js` |
| OPT-18 Profildialog entfernen | von Jakob verworfen; Erstbesuchs-Dialog bleibt | Entscheidung vom 9. Oktober, `tests/storage-blocked.browser.cjs` |
| OPT-19 Druckansicht | umgesetzt | `tests/print-view.browser.cjs` |
| OPT-20 MySQL-Unterschiede | Hinweise und gemessene Nachbildungen umgesetzt | `sql-feedback.js`, `sql-check.js`, beide erneut bestandenen nativen Pruefer; kein Nachweis fuer MySQL 8 |
| OPT-21 Ladefehler | Original/Rettung bleiben erhalten, Import kann Speicherung wiederherstellen | `loadState` in `app.js`, `tests/state-rescue.browser.cjs`, `tests/backup-safety.browser.cjs` |
| OPT-22 Ergebnisbanner | oberhalb der Reiter vorhanden | `renderSqlPractice` in `app.js`, `tests/practical-exercises.browser.cjs` |
| OPT-23 Lehrkraftloesungen | nur aus lokal gewaehlter Datei im Entwicklermodus | `tools/build-solutions.cjs`, `tests/teacher-solutions.browser.cjs` |
| OPT-24 Abitur-Fehlersuche | siebte Aufgabe einschliesslich Klammerung und SQL-Ergebnis vorhanden | `debug-exercises.js`, `tests/debug-exercises.test.js`, nativer Pruefer |
| OPT-25 Einheitenskripte | eigener leerer Arbeitsbereich, zwoelf Skripte, getrennte Datenbanken | `sql-workspace.js`, `tests/sql-workspace.browser.cjs`, `tests/sql-workspace.test.js` |

Die in Claudes alter Uebergabe genannten zwei Kontrastausnahmen sind ebenfalls
beseitigt; der Releasebericht dokumentiert 318 bestandene Kontrastansichten.

## Claudes Aenderungen an Codex-Teilen: A2, Punkte 1 bis 23

Die urspruengliche Einzelpruefung steht in `codex2claude.md` unter
"A2: Rueckmeldung zu allen 23 Punkten". Fuer den aktuellen Stand gilt:

| Punkt | Heutige Pruefung / Weiterentwicklung |
| --- | --- |
| A2-01 | Ergebnisbanner bleibt sichtbar oberhalb der Reiter; `tests/practical-exercises.browser.cjs`. |
| A2-02 | Neues gemeinsames Profil mit passendem Hilfedialog und stabiler Hoehe; `tests/xp.browser.cjs`. |
| A2-03 | Fehlgeschlagene Rettungsschreibvorgaenge schuetzen das Original; `tests/state-rescue.browser.cjs`. |
| A2-04 | 59 Uebungen; Typen und Erwartungswerte in den Inhalts-/Aufgabentests geprueft. |
| A2-05 | Fetch-Fehler erneut vorhanden, Remote-Abgleich per API; keine Git-Metadaten geloescht. |
| A2-06 | MySQL-Hinweise ohne zusaetzliche Punktevergabe; `tests/mysql-lab.browser.cjs` und native Pruefer. |
| A2-07 | Uebungen frei, Einheiten in Reihenfolge; `tests/public-site.browser.cjs` und `tests/lesson-completion.browser.cjs`. |
| A2-08 | Oeffentliche SQL-Pruefung mit vorberechneten Sollwerten; `tests/public-site.test.js` und `tests/solution-variants.test.js`. |
| A2-09 | Auf Jakobs spaetere Wuensche zur offenen NAGOLD-Tabelle weiterentwickelt; nur gueltige Tabellenzeilen zaehlen, Einheitenabschluss einmalig; `tests/nagold.browser.cjs`. |
| A2-10 | Loesungsfilter mit Abbruch bei fehlenden Sollwerten; `tools/build-site.cjs`, `tests/public-site.test.js`. |
| A2-11 | Geoeffnete Uebungen bei weiterhin gesperrter Einheit geprueft; `tests/practical-exercises.browser.cjs`. |
| A2-12 | Versionsgleichstand inzwischen 0.48.0, nicht mehr 0.41.5; Versions-/Veroeffentlichungstests. |
| A2-13 | Ausgelagerte Module eingebunden, direkte Tests vorhanden; spaetere funktionale Erweiterungen getrennt dokumentiert. |
| A2-14 | Sechs CSS-Dateien in fester Reihenfolge; `tests/styles-split.test.js`. |
| A2-15 | Lokal geladene Lehrkraftloesungen nur im Entwicklermodus; `tests/teacher-solutions.browser.cjs`. |
| A2-16 | Sicherungsformat inzwischen 9 mit Modell-Entwuerfen und bewerteten Kopien; `tests/erm-backup.browser.cjs`, `tests/erm-progress.browser.cjs`. |
| A2-17 | Archiv, Releaseberichte und aktuelle Wegweiser vorhanden; neue lokale Markdown-Verweise ebenfalls auf Existenz geprueft. |
| A2-18 | Ortszeit und SQL-Nachbildungen: `tests/mysql-lab.browser.cjs`, beide nativen Pruefer erneut bestanden; kein MySQL-8-Versprechen. |
| A2-19 | Datei-Eingaben haben vorlesbare Namen; `tests/a11y-names.browser.cjs`. |
| A2-20 | Start und Dateisicherung bei gesperrtem Speicher; `tests/storage-blocked.browser.cjs`. |
| A2-21 | Themen- und Akzentkontrast ohne die alten Ausnahmen; `tests/appearance.test.js`, `tests/contrast.browser.cjs`. |
| A2-22 | Richtige SQL-Schreibvarianten bestehen, falsche bleiben falsch; `tests/solution-variants.test.js`, `tests/sql-check.test.js`. |
| A2-23 | SQL-Editor ist per Tastatur verlassbar, Bedienelemente bleiben im Bild; `tests/keyboard.browser.cjs`, `tests/overflow.browser.cjs`. |

## Was dadurch nicht bewiesen ist

Eine vorhandene Datei allein beweist keine funktionierende Oberflaeche.
Die angegebenen Tests und Release-Gates ergaenzen die Codepruefung. Reale
Schulgeraete, echte assistive Technik und deren administrative Richtlinien
werden dadurch nicht abgenommen. Aktuelle Teilrueckmeldung und verbleibende
Schritte: [Schul-PC-Abnahme](ABNAHME_SCHUL_PC.md).

Keine neuen Produktfunktionen, keine SQL-Aenderung und keine Aenderung an
Browserdaten, Git-Metadaten oder Repository-Sichtbarkeit fuer diesen Abgleich.

## Erneut ausgefuehrte Abschlusspruefung

- `node tools/run-tests.cjs`: 229 Tests bestanden.
- `python -B -m unittest discover -s tests -p "test_*.py"`: vier bestanden.
- `node tools/run-browser-tests.cjs`: alle 49 Dateien in einem vollstaendigen
  Lauf gegen eine feste TEMP-Publikationskopie bestanden, ohne Wiederholung.
  252 Namens-, 318 Kontrast- und 1.200 Ueberlaufansichten, 953 Tastaturstopps.
- Abgleich des Laufprotokolls mit allen `tests/*.browser.cjs`: keine Datei
  ausgelassen. Alle 69 oeffentlichen Dateien entsprechen bytegenau der
  geprueften festen Kopie.
- `node tools/verify-claude-native.cjs`: 168 bestanden; danach eigener Server
  beendet. `node tools/verify-native-sql.cjs`: zwoelf Importe und native
  Abfragen/Fremdschluessel bestanden; eigener Server ebenfalls beendet.
- 25 verschiedene OPT-Punkte, 23 verschiedene A2-Punkte und alle konkret
  genannten Code-/Testdateien maschinell auf Vollstaendigkeit/Existenz geprueft.
  17 lokale Markdown-Verweise in README und den beiden neuen Abnahme-Dateien
  auf gueltige Ziele geprueft.

Das vollstaendige Browser-Laufprotokoll liegt lokal unter
`%TEMP%/workbenchlab-audit-0480-oOPYdo/browser-tests.log`, nicht im Website-Bau.
Die Live-Seite antwortet mit HTTP 200 und versionsgleichen Verweisen auf
`app.js?v=0.48.0` und `styles.css?v=0.48.0`. Vor dem Dokumentations-Push
wurde der unveraenderte Remote-Ausgangscommit nochmals per API bestaetigt.
