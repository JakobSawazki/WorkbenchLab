# Codex an Claude – WorkbenchLab

## Aktueller Anforderungsabgleich nach 0.48.0 [Codex]

Alle OPT-01 bis OPT-25 am aktuellen Code-/Release-Stand abgeglichen:
`documentation/ABNAHME_0_48_0.md`. Umgesetzte und von Jakob verworfene Punkte
sind getrennt von noch nicht bestaetigter Hardware-Abnahme aufgefuehrt.
Beide nativen Pruefer erneut bestanden (168 Vergleiche, zwoelf Skriptimporte).

Jakob bestaetigt reale Workbench-Nutzung ueber den Informatik-Stick im
Unterricht nach manueller Einweisung und das Laden der SQL-Skripte.
Kein pauschaler Abschluss von Browser-Neustart, Sicherungsimport oder Offline-
Abnahme daraus abgeleitet. Aktuelle Liste: `documentation/ABNAHME_SCHUL_PC.md`.

Git-Fetch erneut durch `refs/desktop.ini` gestoert; keine Metadaten geloescht.
Vor diesem Dokumentationsnachtrag: GitHub-API und lokaler HEAD beide
`5429822349e0c10c1b6969da96b599d968dc0841`;
Pages-Lauf 38716244037 erfolgreich, oeffentliches ZIP mit korrektem Digest.
Keine Produktversion nur fuer Dokumentationsabgleich angehoben.

Abschliessend erneut bestanden: 229 Node-/vier Python-Tests, beide nativen
Pruefer und alle 49 Browserdateien in einem unveraenderten Gesamtlauf ohne
Wiederholung. Alle 69 oeffentlichen Dateien bytegleich zur festen Testkopie.
25 OPT-/23 A2-Eintraege vollstaendig, Code-/Testverweise vorhanden; 17 lokale
Markdown-Verweise gueltig. Nur README und Abnahme-/Uebergabedokumentation
geaendert. Die unbestaetigten Vor-Ort-Schritte bleiben ausdruecklich offen.

## Release 0.48.0 [Codex, 2026-10-15]

Jakob hat den Push und die Veroeffentlichung aller folgenden Aenderungen
beauftragt. Lokale Zwischenstaende unten werden durch den abschliessenden
Releasebericht `documentation/releases/RELEASE_0_48_0.md` abgeloest.

Release-Gates: 229 Node-, 4 Python-Tests und alle 49 Browserdateien bestanden.
Ein Scroll-Timeout im bestehenden Modelltest bestand im unveraenderten
Einzellauf; anschliessend alle verbleibenden Dateien erfolgreich. Feste
TEMP-Publikationskopie und finaler Bau: 69 Dateien bytegleich. Neues Offline-
Paket 0.48.0 erstellt; Hash und Testgrenzen stehen im Releasebericht. Keine
SQL-Aufgabe/MySQL-Aussage geaendert. Veroeffentlichung auf main/v0.48.0.

Redundanten Hinweis "Lernprofil ... lokal auf diesem Browser gespeichert"
unter dem Einheitenabschluss entfernt. Falls noch kein Profil besteht,
bleibt der notwendige Hinweis zum Anlegen erhalten. Speicherung unveraendert.

Notizleiste: H2/Markdown-Ueberschrift entfernt, Lucide `list-ordered` fuer
nummerierte Listen ergaenzt. Markierte Zeilen erhalten 1., 2. usw.; Enter am
Zeilenende setzt die Nummerierung fort, Enter auf einem leeren Listenpunkt
beendet sie. Bulletpoints und Checkliste unveraendert. Pointerdown bewahrt
die Textauswahl fuer Notizwerkzeuge. Bestehender Text wird nicht umgeschrieben.
Erweiterter study-workflow-Browsertest bestanden (inkl. Speichern/Reload).

Klassenkurzform auf Buchstaben (einschliesslich Umlauten), Zahlen und
Bindestriche eingeschraenkt. Leerzeichen/Punkt/Unterstrich/Slash usw. werden
bei Eingabe/Einsetzen, Blur, Laden und Import entfernt. HTML-Pattern und
Hinweise angepasst; historische Lehrkraft-Importanzeigen nicht umgeschrieben.
Profil-Browsertest und 11 state-Tests bestanden.

NAGOLD-Jahresziel im Profil: eigener goldfarbener, beschrifteter nativer
Fortschrittsbalken mit Prozentanzeige, Jahresziel 100 NAGOLD = Sehr gut
(Note 1) und verbleibenden Punkten. Keine weiteren Notengrenzen erfunden.
Negative Werte fuellen den Balken nicht, ueber 100 bleibt er voll; echte
Punktzahl und Tabelle bleiben unveraendert. Aktualisiert sofort bei Autosave.
Neuer Test `tests/nagold-progress.browser.cjs`: -10/0/5/99/100/125, live
aktualisierte Werte, Beschriftungen und Dark/Light bei 1440/360 mit grosser
Schrift bestanden; bestehender NAGOLD-Browsertest ebenfalls bestanden.
Alle Nachtraege dieses Abschnitts gehoeren zum gemeinsamen Release 0.48.0.

Auf Jakobs Wunsch den redundanten Startseiten-Link "Quellen und Werkzeuge"
entfernt. Der Navigationspunkt "Nachschlagen" bleibt unveraendert erhalten.
Bestandteil des Release 0.48.0.

Logo: dezente Vergroesserung, hellere Metalloberflaeche und Akzentrand bei
Hover bzw. Tastaturfokus. Keine Layoutverschiebung; reduzierte Bewegung wird
respektiert.

Im Profil zeigt der NAGOLD-Button rechts jetzt den Lucide-Stift statt der
Liste; Tooltip und vorlesbarer Name nennen das Bearbeiten der Tabelle.

Neue Auswahl "Anwesenheit" in der NAGOLD-Tabelle: Beim Wechsel zu diesem
Anlass werden 2 Punkte vorausgefuellt (auch bei direkter Texteingabe).

"Startkapital" als Auswahlpunkt ergaenzt. Nach Jakobs neuester Vorgabe gibt
die erste Vergabe automatisch 5 NAGOLD. Danach entfaellt der Vorschlag;
auch direktes erneutes Eintippen in eine andere Zeile vergibt keine Punkte.
`nagoldStartCapitalClaimed` bleibt nach Loeschen/Umbenennen erhalten und wird
mit dem Lernstand gesichert/importiert. Alte Startkapital-Zeilen werden beim
Normalisieren erkannt. Kein manipulationssicherer Leistungsnachweis.
Gezielter Browsertest und 18 Node-Tests (nagold/state) bestanden.

NAGOLD-Tabelle auf Autosave umgestellt, Speichern-Button entfernt. Gueltige
Zeilen und Loeschungen werden sofort gespeichert (auch bei X/Esc). Pro
Entwurfszeile bleibt bei unvollstaendiger Korrektur der letzte gueltige Stand
erhalten; neue unvollstaendige Zeilen werden nicht uebernommen und blockieren
andere Zeilen nicht. Sichtbare Meldung bei unvollstaendigen Eingaben oder
gesperrtem Browserspeicher. Tests/nagold.browser.cjs entsprechend angepasst.
Keine Gutschrift durch blosses Oeffnen der App, keine weiteren Zeilen bei
erneuter Auswahl; bestehende manuelle Bearbeitung bleibt moeglich.

Aktuelle Rückmeldung: **10. Oktober 2026**, siehe OPT-15/Release 0.45.0 unten;
die Übergabeprüfung 0.41.5 bleibt als historischer Abschnitt erhalten.

## Frühere Rückmeldung

Stand: 8. Oktober 2026. Jakobs Auftrag: offene Punkte selbstständig umsetzen.
Die unveränderte Übergabe `claude2codex.md` ist die Grundlage der OPT-IDs.

## Status

| ID | Status | Ergebnis |
| --- | --- | --- |
| OPT-10 | erledigt (c27998d) | 106 Node- und 2 Python-Tests lokal und in CI bestanden. Positivlauf 37845045379 erfolgreich veröffentlicht. Negativlauf 37845070105: absichtlicher Testfehler, Deployment übersprungen. Prüfbranch anschließend entfernt. |

## Einordnung

OPT-11 ist erledigt (4c01fb4, Deployment 37845559494): Der Pages-Upload erhält eine explizite App-Dateiliste
statt des kompletten Repositorys. Das Lehrbuch bleibt als Manuskript im
GitHub-Repository zugänglich; keine unverbundene Kopie auf der Lernseite.

Die Priorität der Testsicherung ist sinnvoll. Browsertests bleiben zunächst lokal mit Edge; die Node- und Python-Prüfungen benötigen keine installierten Pakete. Playwright ist ausschließlich eine Entwicklungsabhängigkeit, keine externe Laufzeitabhängigkeit der Lernseite.

OPT-12 wird nicht als Manipulationsschutz versprochen: Eine rein lokale App kann keine verlässliche Leistungsbewertung absichern. OPT-09 braucht deshalb ebenfalls eine didaktische Einordnung; ein öffentlicher Hash schützt den Lehrkrafthaken nicht zuverlässig.

## Prüfung der Übergabe 0.41.5 [Codex, 2026-10-09]

Grundlage: `claude2codex.md`, Wegweiser und Arbeitsprotokoll in
`documentation/documentation.md`, `CHANGELOG.md` und Git-Verlauf ab
`codex-stand-2026-10-08`. Übernommen bei sauberem Arbeitsbaum auf `main`,
Commit `44db3b1`. Keine pauschale Rücknahme deiner Arbeit erforderlich.

### Befund OPT-21: Rettung bei voller Speicherquota

**Datenverlustrisiko bestätigt und lokal korrigiert.** Wenn der Lernstand nicht
lesbar ist und das Schreiben der Rettungskopie scheitert, überschrieb der
anschließende Start trotzdem den Originalschlüssel mit einem leeren Stand.
Das kann bei voller Quota auftreten: Die zusätzliche Kopie passt nicht mehr,
das kleinere Ersatzobjekt dagegen schon. Die Meldung behauptete trotzdem,
die Kopie sei gespeichert; ein Download konnte eine ältere Kopie liefern.

Der ergänzte Test scheiterte vor der Korrektur an genau diesem Überschreiben.
Jetzt schützt `persistState` das Original beim Start und bei späteren
Speicherversuchen. Die aktuellen Rohdaten bleiben für den Download im
Arbeitsspeicher; die Meldung unterscheidet erfolgreiche und fehlgeschlagene
Speicherung. Der vorhandene Speicherwarnhinweis verweist auf die Dateisicherung.
Nur ein geprüfter und ausdrücklich bestätigter Lernstandimport hebt die
Schreibsperre auf. Schließen der Meldung, Download oder abgebrochener Import
heben sie nicht auf. Neue Arbeit in dieser Sitzung muss als Datei gesichert
werden; das Original bleibt auch über Neuladen erhalten.

Geändert: `app.js`, `tests/state-rescue.browser.cjs`. Der Test umfasst Desktop
und Mobilansicht, eine ältere bzw. keine gespeicherte Rettungskopie, Download
der aktuellen Rohdaten, spätere Speicherversuche, Neuladen sowie Abbruch und
Bestätigung eines Imports. Keine SQL-Aufgaben oder Sollergebnisse geändert.

### A2: Rückmeldung zu allen 23 Punkten

| Punkt | Entscheidung und Prüfung |
| --- | --- |
| 1 | Beibehalten: sichtbares Prüfergebnis außerhalb des Coach-Reiters; SQL-/Debug-/Mutations-Browserprüfungen. |
| 2 | Beibehalten: korrekte Hilfedialog-ID und Subpixel-Toleranz; Profil-/XP-Test. |
| 3 | Beibehalten mit obiger OPT-21-Korrektur für fehlgeschlagene Rettungsschreibvorgänge. |
| 4 | Beibehalten: aktuell 59 Übungen, davon 32 SQL-Aufgaben einschließlich sieben Fehlersuchen; Vorhersage und Sortieraufgaben bleiben eigene Typen. |
| 5 | Keine Aktion: kein Fetch-Fehler; keine Git-Referenzen gelöscht, kein Stash verwendet. |
| 6 | Beibehalten: MySQL-Hinweise im Ausführen-Zweig, keine zusätzliche XP-Vergabe; Labortests und native Messung. |
| 7 | Beibehalten: Übungen frei, Einheiten weiterhin sequenziell; entspricht Jakobs dokumentierter Entscheidung. |
| 8 | Beibehalten: öffentliche Prüfungen mit vorberechneten Sollwerten; alle gespeicherten Sollwerte zusätzlich lesend neu berechnet und verglichen. |
| 9 | Beibehalten: NAGOLD aus gültigen abgeschlossenen Einheiten abgeleitet, fünf je Einheit; kein separater veränderbarer Zähler. |
| 10 | Beibehalten: öffentliche Dateiliste und Lösungsentfernung mit Abbruchprüfung; veröffentlichbare Fassung im Browsertest geprüft. |
| 11 | Beibehalten: neue Testerwartung passt zur Freigabe der Übungen; Sperre der Einheiten bleibt geprüft. |
| 12 | Beibehalten: Versionsköpfe stimmen mit 0.41.5 überein. |
| 13 | Beibehalten: Verschiebe-Commits und Modul-Einbindung geprüft, direkte Logiktests grün. Begleitänderung bei 0.39.2: Fehlerfallback nutzt `structuredClone(defaultState)` statt flacher Kopie, sinnvoll gegen gemeinsam genutzte Listen. Die späteren SQL-Erweiterungen sind gesonderte Änderungen, keine reine Verschiebung. |
| 14 | Beibehalten: am Verschiebe-Commit alle CSS-Regeln und ihre Reihenfolge maschinell mit der vorherigen Gesamtdatei verglichen (ohne Kommentare/Leerraum identisch). Beide HTML-Seiten laden die sechs Dateien in derselben festen Reihenfolge. |
| 15 | Beibehalten: Lehrkraftlösungen nur aus lokaler Datei im Entwicklermodus, nicht dauerhaft gespeichert; Browser- und Veröffentlichungstests. |
| 16 | Beibehalten: Modell-Entwürfe in `extras.ermDrafts` mit Prüfsumme und Ersetzungsbestätigung; alte Sicherungen erhalten vorhandene Entwürfe. Format 6 bleibt kompatibel. |
| 17 | Beibehalten: Archiv- und Release-Verschiebungen im Git-Verlauf nachvollziehbar; keine Wiederherstellung doppelter Dokumente. |
| 18 | Beibehalten: MySQL-Erweiterungen und Ortszeit durch Labortests sowie 151 native Prüfungen an MariaDB 10.4.13 bestätigt. Daraus folgt keine vollständige MySQL-8-Kompatibilität. |
| 19 | Beibehalten: Dateifeld hat einen vorlesbaren Namen; Namens-/ARIA-Prüfungen. |
| 20 | Beibehalten: abgefangene Speicherzugriffe verhindern Startabbruch; Tests bei vollem, gesperrtem und nicht dauerhaftem Speicher. |
| 21 | Beibehalten: `--on-brand` und Kontrastkorrekturen bestehen den vorhandenen Kontrasttest einschließlich seiner dokumentierten Ausnahmen. |
| 22 | Beibehalten: Kommentar-/Schreibweisen-Normalisierung und CREATE-Prüfung bestehen die vorhandenen Äquivalenztests; Sollergebnisse stimmen mit den Aufgaben überein. Kein allgemeiner SQL-Parser oder Manipulationsschutz versprochen. |
| 23 | Beibehalten: SQL-Editor per Umschalt+Tab bzw. Esc+Tab verlassbar; Tastatur- und Breitenprüfungen. |

### Prüfprotokoll

- Übernommener Stand: 194 Node-Tests, 2 Python-Tests und alle 39 Browser-Testdateien bestanden.
- Native Nachprüfung: 151 Prüfungen mit eigener temporärer MariaDB-10.4.13-Instanz auf Port 33399 bestanden; Instanz anschließend vom Werkzeug beendet.
- Nach OPT-21-Korrektur: erneut 194 Node-Tests, 2 Python-Tests und alle 39 Browser-Testdateien bestanden, einschließlich der erweiterten Rettungsprüfung.
- CSS-Verschiebung, Versionsgleichheit und Aktualität von `expected-results.js` zusätzlich maschinell geprüft.
- Keine neuen MySQL-Aussagen/Funktionen und keine SQL-Aufgaben ergänzt; deshalb keine Änderung der Lösungsdatei oder Neugenerierung der Sollwertdatei erforderlich.
- Lokale Vorschau auf `http://127.0.0.1:4199/`; eigener Python-Server (PID 7764). Native Testinstanz auf Port 33399 ist beendet. `git diff --check` ohne Befund.

### Grenzen und offene Entscheidungen

OPT-09 und OPT-25 bleiben ohne Jakobs Antwort unverändert. OPT-15 bleibt der
Vor-Ort-Test durch Jakob gemäß Abschnitt 0.16. Kein echtes Schulgerät, anderer
Browser, echter Bildschirmleser oder MySQL 8 wurde hier nachgetestet.

Die Hinweise zu `.tmp/`, den drei ungenutzten Bildern und den zwei kleinen
Kontrastausnahmen wurden nicht als Änderungsauftrag behandelt. Keine
Dateien bereinigt oder Testausnahmen erweitert. Präzisierung zu Teil B1:
Modell-Entwürfe sind seit 0.40.0 Bestandteil der JSON-Sicherung, wie A2.16 und
C4 richtig festhalten. Wiederholungsrunde, Klausurtraining und Rettungskopie
bleiben außerhalb der normalen Lernstandsicherung.

Die veröffentlichte Fassung enthält keine SQL-Lösungsanweisungen; das
öffentliche GitHub-Repository enthält weiterhin die Quelldaten. Prüfsummen
sind Integritätskontrollen, kein Schutz gegen gezielte Leistungsfälschung.

Diese Rückmeldung und die OPT-21-Korrektur sind **lokal, noch nicht
veröffentlicht**. Der übernommene Release bleibt 0.41.5; keine neue
Release-Nummer, kein Push oder Deployment im Rahmen dieser Übergabeprüfung.
Für ein späteres Release gelten weiterhin Versionsabgleich, Changelogzeile
und der vollständige Testlauf vor jedem Push.

## Designentwurf Satin-Titan [Codex, 2026-10-09]

Jakob wünscht edlere Metallbuttons, leichte Transparenz und fotorealistische
bläuliche Hintergründe. Neue Regeln stehen ausschließlich am Ende von
`styles-shared.css`; Ladefolge, Layout, Farboptionen und alle funktionalen
Änderungen bleiben erhalten. Die neu erzeugte, lokal gespeicherte Textur
`assets/titanium-blue-satin.webp` (208166 Bytes) wird vom bestehenden
öffentlichen Assetpfad erfasst. Kein externer Bilddienst im Frontend.

Rahmenflächen und Buttons erhalten feines Satin-Titan, Dialoge und Menüs
deckende Glasflächen mit geringer Transparenz. Die Dekoration liegt separat
von den Kontrastfarben, greift keine Klicks ab und entfällt im Druck sowie
bei erzwungenen Kontrastfarben. Text-/SQL-Flächen bleiben ruhig. Bestehende
Fokusmarkierungen und Höhen bleiben erhalten; der wandernde Glanz entfällt.

Neuer Browsertest `material-design.browser.cjs`: Material geladen, echte
Pixelkontraste der Button-Innenflächen einschließlich der Akzentfarben,
Dialog/Esc, Profilhöhe, Hoverposition, vier Seiten in beiden Designs bei
1440/390 Pixeln und Druck-/Kontrastmodus. Screenshots liegen unter
`%TEMP%/workbenchlab-tests/material-design/`, nicht im Drive-Projekt.
194 Node-, 2 Python-Tests und alle 40 Browser-Testdateien bestanden,
einschließlich der neuen Materialprüfung und des öffentlichen Paketbaus mit
63 Dateien. `git diff --check` ohne Befund. Prompt und Assetherkunft stehen im
neuen Designabschnitt der Projektdokumentation.

Weiterhin lokaler Entwurf auf Basis 0.41.5, kein Commit/Push/Deployment.
OPT-09 und OPT-25 sind unverändert offen. Die vorangegangene OPT-21-Korrektur
bleibt erhalten; keine SQL-Aufgaben oder MySQL-Funktionen geändert.

## NAGOLD im Profilbutton, 2026-10-09

Auf Jakobs Wunsch rechts neben den XP den bestehenden NAGOLD-Stand als
goldfarbenes `5 NAG` ergänzt. Berechnung über `stateNagold()` unverändert;
Tooltip und zugänglicher Buttonname nennen NAGOLD ausgeschrieben. Keine
zweite Speicherung, keine Änderung der Lehrkraft-Bestätigung. Profilhöhe
bleibt identisch mit den anderen Werkzeugen, auch bei 320 Pixeln und großer
Schrift mit 2700 XP / 105 NAG. Bestehenden Profil-Browsertest um Werte
0/5/105, Position, Farbe, Klickfläche, zugänglichen Namen und Grenzen ergänzt.
194 Node- und 2 Python-Tests sowie Profil-, Material-, Kontrast-, Überlauf-
und Namens-Browsertests bestanden (288 Kontrast-, 1176 Breiten- und 242
Zugänglichkeitsansichten).
Weiterhin lokaler Entwurf, kein Push oder Deployment.

## NAGOLD-Tabelle, 2026-10-09

Jakobs jüngste Entscheidung ersetzt die zunächst gewünschte versteckte
Korrektur: NAGOLD im Profildialog ist ein normaler Button. Er öffnet eine
Tabelle mit Datum, Uhrzeit, Wofür und NAGOLD. Neue Zeilen über Plus, je Zeile Minus;
vorhandene Zeilen per Doppelklick oder Stift bearbeitbar. Eigener Anlass oder
Vorauswahl, heutiges lokales Datum und Uhrzeit (HH:MM) vorbelegt, 1 bis 5 ganze Punkte. Speichern
übernimmt den Entwurf; X/Esc verwirft Änderungen und kehrt ins Profil zurück.

Nach Jakobs anschließendem Wunsch fügt `award("lesson", …)` automatisch eine
Fünf-Punkte-Zeile mit lokalem Datum und Uhrzeit hinzu. `lessonId` verhindert Doppelbuchungen;
bereits abgeschlossene Einheiten werden beim Neuladen nicht neu gebucht.
Alte Stände ohne Tabelle werden einmalig aus bekannten Abschlüssen übernommen,
ohne ein erfundenes Datum. Eine ausdrücklich leere Tabelle bleibt leer.
Automatische Zeilen sind ebenfalls editier-/löschbar; XP bleiben unabhängig.

Gemeinsamer Helfer `nagold.js` für `state.js`, App und Klassenübersicht; Summe
weiter über `stateNagold()`. Eingaben und Importe werden begrenzt (160 Zeichen,
1–5 ganze Punkte, echte Kalenderdaten, maximal 1000 eigene plus 21
Einheiten-Zeilen). Neue öffentliche Datei für den Paketbau im Index vorgemerkt.
Format 7 verhindert, dass die alte App neue Tabellen beim Import still
verwirft. Formate 1–6 sind weiter ladbar. Keine SQL-/Lösungsänderungen.

Der begonnene Schlüssel-Ansatz ist vollständig entfernt, einschließlich der
vorübergehend lokal erzeugten, nicht veröffentlichten Schlüsseldatei. Keine
Schlüssel oder neuen versteckten Zugänge verbleiben. Der bestehende
Entwicklerzugang ist unverändert. Keine behauptete Lehrkraft-Sperre;
die Tabelle ist bewusst Selbstauskunft. OPT-09/OPT-25 bleiben davon unabhängig.

203 Node- und 2 Python-Tests bestanden; neuer Tabellen-Browsertest mit
Plus/Minus, Doppelklick/Stift, Grenzen, Abbruch/Fokus, Sicherung/Import,
Klassenübersicht, sicherem Text und 360/320 Pixeln mit großer Schrift in
beiden Designs bestanden. Bestehende Profil-, Paket-, Ablauf-, Format-,
Kontrast-, Überlauf- und Namensprüfungen ergänzt. Alle 41 Browser-Testdateien
bestanden, einschließlich 292 Kontrast-, 1188 Breiten- und 246
Zugänglichkeitsansichten. Alle 21 echten Einheitenabschlüsse erzeugen je eine
datierte Zeile mit Uhrzeit; die Kopfzeile passt auch mit 5105 NAG und großer
Schrift bei 360/320 Pixeln. Der öffentliche Pakettest baut 64 Dateien.
`git diff --check` und Indexprüfung ohne Befund.
Lokaler Entwurf auf Basis 0.41.5, kein Commit/Push/Deployment.

## Autarker Folgeauftrag: OPT-09, OPT-17 und Kontrast

Jakob hat jetzt die Umsetzung der offenen Vorschläge und eine geeignete
Veröffentlichung autorisiert. OPT-09 folgt Empfehlung b mit separater
Lehrkraft-Liste: gesehene Einheiten und NAGOLD auf dem Lehrkraftgerät,
eigene Sicherung/Import, separate bestätigte Summen im CSV. Die offene
Schülertabelle bleibt wie zuletzt gewünscht bearbeitbar. Änderungen an
gemeldeten Punktezeilen erfordern erneute Bestätigung. Keine Geheimcodes,
Schlüssel oder behauptete Identitätsprüfung. Speicherfehler blockieren
die Arbeit nicht, zerstören aber auch keine unlesbare alte Liste.

OPT-17: alle bisherigen Browser-Testausgaben aus `.tmp` nach Windows-Temp
umgestellt. Gemeinsamer Helfer `tests/artifacts.cjs`; vorhandene Dateien
nicht gelöscht. Die drei genannten PNG-Originale nur aus der Veröffentlichung
ausgeschlossen, weiterhin als Quellen vorhanden. Beide Kontrastausnahmen
der Nachschlageseite beseitigt; neue Lehrkraft-Bedienung wird ebenfalls auf
Kontrast und vorlesbare Namen geprüft.

Details und Grenzen in `documentation/documentation.md`, eigener Abschnitt
„Codex: Autarke Weiterarbeit“. Weiter offen: OPT-25, Offline-Betrieb,
Modell-Erweiterungen, Lösungsauslagerung. Vor-Ort-Prüfungen werden nicht
als erledigt ausgegeben. Kein Push dieses Zwischenstands.

Zusätzlicher Prüf-Befund: Python `http.server` hat das Startvideo lokal nicht
vorspulbar ausgeliefert (keine Byte-Bereiche). `tools/preview-workbench.cjs`
arbeitet nun mit Node-Bordmitteln statt der hier fehlenden `send`-Bibliothek;
`pnpm serve` nutzt ihn. Öffentliche Dateien/MIME, Pfadgrenzen, GET/HEAD und
Byte-Bereiche sind getestet. Lokaler Server zusätzlich auf 4201; dort
besteht die vollständige MP4-Prüfung mit sechs decodierten Zeitpunkten und
15 Untertiteln. Video unverändert. Auch ältere Diagnose- und Renderartefakte
liegen nun in Temp; nur die alte optionale MP4Box-Ladesuche verweist noch
auf `.tmp`, sie schreibt dort keine Artefakte.

208 Node- und 2 Python-Tests bestanden. Zwölf Skriptimporte und die bisherigen
nativen SQL-/Fremdschlüsselprüfungen an MariaDB 10.4.13 bestanden. Neuer
Lehrkraft-Browsertest bestanden; 294 Kontrastansichten ohne Ausnahmen und
248 Namensansichten bestanden. Vollständiger Browserlauf noch in Arbeit.

## Release 0.42.0: Freigabe

Alle zuvor als lokale Entwürfe beschriebenen Änderungen sind Bestandteil
von 0.42.0. Versionsgleichstand beider HTML-Seiten, Inhaltsdateien und
Paketversion hergestellt; Changelog und Releasebericht ergänzt. Lokale
Lösungsdatei für Jakob neu erzeugt, weiterhin unversioniert. Keine Änderung
an Aufgaben oder Musterlösungen, keine Veröffentlichung privater Ressourcen.

Abschluss-Gates bestanden: 208 Node-, 2 Python-Tests und alle 42 Browser-
Testdateien auf Port 4201, einschließlich 294 Kontrastansichten ohne
Ausnahmen, 1188 Breitenansichten, 248 Namensansichten und 919 Tastaturstopps.
Beide nativen MariaDB-Prüfer bestanden: 151 Claude-Fälle sowie zwölf
Skriptimporte mit Voraussetzungen und native Abfragen/Fremdschlüssel.
Video-Prüfer bestanden. Öffentlicher Paketbau 61 Dateien. Diff-/Indexprüfung
ohne Befund. Veröffentlichung über den bestehenden, unveränderten
GitHub-Pages-Workflow mit erneutem Node-/Python-Gate.

Der Gesamtauftrag bleibt aktiv. Weiter: OPT-25, Offline-Paket/Service Worker,
Modell-Editor-Erweiterungen und Rest von OPT-12; echte Vor-Ort-Prüfungen
bleiben externe Abnahme und werden nicht behauptet.

## OPT-25: Freies SQL-Labor mit Einheitenskripten (0.43.0)

Leerer vierter Arbeitsbereich, zwölf eindeutige Skripte aus den bestehenden
Praxisaufträgen und eigene SQL-Dateien. Öffnen führt nicht aus; vorhandener
Entwurf wird nur nach Bestätigung ersetzt. SQL-Text wird gespeichert und
normalisiert, Datenbanken bleiben Sitzungsdaten. Kein XP/NAGOLD und keine
heimlichen Voraussetzungs-Tabellen für die insert-only-Skripte L1.4/L1.8/L2.2.

Neuer reiner Helfer `sql-workspace.js`, SQL.js unverändert als Engine.
`node-sql-parser` 5.4.0 als unveränderter lokaler MySQL-Build mit Lizenz und
verifizierter npm-Archiv-Prüfsumme. Tabellen-/Spaltenbezüge werden strukturiert
übersetzt, nicht über das Entfernen von USE oder Schema-Präfixen. Auch beide
Datenbanken aus L3.2 und 15 getrennte Schemata funktionieren. Live-Katalog,
Tabellenvorschau ohne Entwurfsverlust, erhaltene Teiländerungen bei Fehlern,
korrekte leere letzte Ergebnisse; interne Namen nicht in Fehlermeldungen.

Sechs neue Node-Fälle und ein Browsertest; vorhandene Kontrast-, Überlauf-,
Namens- und Tastaturprüfer erfassen den Arbeitsbereich zusätzlich. Die
nativen Prüfungen sind um 17 Schema-/Text-/Schlüsselvergleiche erweitert
(jetzt 168). Ein Diagnosebefund betraf unter Windows vereinzelt leere
Client-Ausgaben: reguläre temporäre stdout-Datei statt Pipe, zusätzlich
Datadir-/Port-Prüfung und aussagekräftige Vergleichsmeldungen. Keine
fehlgeschlagene Datenbankaussage durch bloße Wiederholung freigegeben.

Versionsstempel 0.43.0, Changelog und Releasebericht vollständig. Lokale
Lösungsdatei regeneriert, unveröffentlicht. Abnahme bestanden: 215 Node-Tests,
2 Python-Tests und alle 43 Browserdateien auf Port 4202; 318 Kontrast-, 1200
Breiten-, 252 Namensansichten und 925 Tastaturstopps. Drei vollständige Läufe
mit jeweils 168 nativen Prüfungen sowie der separate Zwölf-Skript-Prüfer
bestanden. Gefiltertes Paket: 65 Dateien; neuer Arbeitsbereich auch daraus
erfolgreich geprüft. Freigabe für den bestehenden GitHub-Pages-Workflow.
Nicht erledigt: Offline-Betrieb, Modell-Erweiterungen, Rest OPT-12 und echte
Vor-Ort-Abnahmen. Gesamtauftrag bleibt aktiv.

## OPT-15: Stick-Paket ohne Installation (0.44.0)

Öffentliche App-Dateiliste nach Lösungsfilter als ZIP, nicht der gesamte
Drive-Ordner. Node-Bauwerkzeug und Python-Standardbibliothek, keine neue
Laufzeitabhängigkeit. In der ZIP-Fassung werden versionsgleiche WASM-Bytes,
zwölf öffentliche SQL-Skripte und Untertitel eingebettet. `file://` verwendet
sie statt Fetch; fehlende oder falsche Versionen melden einen Paketfehler.
VTT über Blob-URL behebt die Dateiorigin-Sperre bei Untertiteln. Onlinepfad
unverändert; Paketlink im Sicherungsdialog führt zum passenden GitHub-Release.

Entpacktes ZIP in Edge ohne Netzwerk bei 1440/360 Pixel geprüft: SQL, Skript,
Export/Import/Neuladen, Lehrkraft-Prüfsumme, MP4/Seek/Untertitel, Bilder und
Überlauf. Fehlendes Payload, Versionsfehler und gesperrter Speicher ebenfalls
geprüft. Dateiliste, Hashes, Lösungsfilter und sichere Archivpfade automatisiert.
Release-Gates bestanden: 216 Node-Tests, vier Python-Tests und alle 44 Browser-
dateien, 318 Kontrast-, 1200 Breiten-, 252 Namensansichten und 925 Tastaturstopps.
Im neuen Offline-Test falschen Notiz-Feldnamen im Assert korrigiert, dann den
vollständigen verbleibenden Abschnitt bestanden; kein Produktcodefehler.
168 native Vergleiche sowie zwölf native Importe und Abfragen/Fremdschlüssel
bestanden. Öffentliche Basis 65 Dateien, ZIP 68 Einträge und 10.931.103 Bytes.
Keine SQL-Aufgabe geändert. Lokale Lösungsdatei regeneriert, unveröffentlicht.

Kein persönlicher Lernstand in der ZIP. Dateisicherung vor Wechsel des
Ordners, PCs oder der Paketversion ist nötig; Dateispeicher ist browserabhängig.
Service Worker mit Versionsprüfung und echte Schul-PC-Abnahme sind noch offen;
OPT-15 und der Gesamtauftrag werden nicht als erledigt markiert. Modell-Editor
und Rest von OPT-12 bleiben ebenfalls im Arbeitsumfang.

## OPT-15: HTTPS-Cache, Release 0.45.0

Ausdrückliche Vorbereitung im Sicherungsdialog, sonst keine Registrierung.
`offline-client.js` und `offline-worker.js`, generiertes `offline-assets.js`
mit SHA-256/Größen nach Lösungsfilter. Keine neue Bibliothek. Versionsbindung
schließt auch die Workerdatei ein. Erst vollständiger Cache mit Abschlussmarker
wird nutzbar. Wartende Updates bleiben getrennt, bis alle App-Tabs zu sind;
kein skipWaiting/claim/Reload. Fremde Pages-Apps sind außerhalb des Scopes.
Reparatur akzeptiert nur exakte alte Bytes, Quota-/Hashfehler lassen die bisherige
Kopie stehen. Lokaler Film unterstützt Bytebereiche. Entfernen ist bestätigt,
bei mehreren App-Tabs gesperrt und löscht keine lokalen Schülerdaten.

221 Node- und vier Python-Tests sowie 168 native Prüfungen bestanden. Dedizierter
Edge-Test: Offline-SQL/Video/VTT, Defekt/Reparatur, Installations-/Update-Quota,
Zwei-Tab-Update, Notizerhalt, echte Browser-Neustarts, API-Sperren und 360 Pixel
mit großer Schrift. Alle 45 Browserdateien bestanden: 318 Kontrast-, 1200
Überlauf-, 252 Namensansichten und 925 Tastaturstopps. Klausur- und Praxistest
auf lokale Lösungsfixtures umgestellt, damit die Suite gegen die bereinigte
Fassung läuft. Gesamtlauf bis Überlauf, dann korrigierter Praxistest und alle
folgenden Dateien erfolgreich. Erste Umgebung
mit gleichzeitig erneuertem `_site` verworfen; neue Vorschau unveränderlich aus
öffentlicher Dateiliste in TEMP. `build-site` hat begrenzte Wiederholungen beim
bereits pfadgeprüften Löschen gegen kurz gesperrte Drive-Dateien.

ZIP für 0.45.0 neu gebaut (71 Einträge, 10.941.291 Bytes), Lösungsdatei lokal
regeneriert. Beide nativen Prüfer bestanden. Veröffentlicht: `1498898`, Tag
`v0.45.0`, Pages-Lauf `38029563457` erfolgreich. Alle 66 Live-Cache-Dateien
und Worker-Buildkennung geprüft, private Ressourcen 404. Reales anonymes ZIP
stimmt mit lokalem SHA-256 überein. Frischer Edge-Kontext auf GitHub Pages:
Vorbereitung, Offline-Neuladen mit Notizen, SQL-Ergebnis und Film/Seek/VTT
erfolgreich, anschließend geschlossen. Echte Schul-PCs,
Modell-Erweiterungen und OPT-12 bleiben offen, Gesamtziel bleibt aktiv.

## Nachpruefung des uebernommenen Modell-Ausbaus [Codex, 2026-10-12]

Zwischenzeitlichen Stand `f6e0858` (0.46.1) vor Weiterarbeit neu eingelesen.
Claudes NAGOLD-Aenderungen und Jakobs Entscheidungen vom 11. Oktober bleiben
erhalten; keine Ruecksetzung auf den Arbeitsstand vom 10. Oktober.

OPT-04: Die drei vorhandenen Strukturaufgaben vergeben je einmal 30 XP nach
ausdruecklicher erfolgreicher Pruefung, nicht durch Laden eines Entwurfs.
`completedModels` bewahrt eine bereinigte und erneut gepruefte Kopie, getrennt
vom Entwurf. Dadurch bleiben Punkte nach Weiterbearbeiten oder Leeren erhalten.
Format 8 exportiert die Kopien; Lehrkraftseite berechnet XP daraus selbst.
Keine zusaetzlichen NAGOLD fuer Modellaufgaben. Das ist weiterhin eine
Strukturpruefung, keine vollstaendige Attributbewertung oder Faelschungssicherung.

Zusaetzliche Kraehenfussnotation bleibt optional; 1:N und 1:unendlich bleiben
erhalten. Die Diagrammregion ist fokussierbar und auf schmalen Bildschirmen
horizontal mit den Pfeiltasten bedienbar, statt die Symbole unleserlich zu
verkleinern. Standalone-SVG enthaelt Linien und Kreise ohne externe CSS-Abhaengigkeit.

`tests/erm-progress.browser.cjs` um echten Zweitbrowser-Import sowie gesperrten
localStorage/sessionStorage erweitert: einmalige XP bleiben erhalten, Pruefen
und Dateisicherung funktionieren auch ohne Browserspeicher. Gezielter Edge-Lauf
bestanden, ebenso 224 Node- und vier Python-Tests. Alle 47 Browserdateien gegen
eine unveraenderliche, loesungsbereinigte TEMP-Kopie bestanden (318 Kontrast-,
1200 Ueberlauf-, 252 Namensansichten, 943 Tastaturstopps). Anschliessend den
erweiterten Modelltest mit Symbolkontrast und tatsaechlicher Diagrammbreite
erneut erfolgreich ausgefuehrt.

Native Pruefung: zwoelf Skriptimporte samt Abfragen/Fremdschluesseln bestanden.
Erster Lauf des 168-Faelle-Pruefers meldete beim Modell-Export unerwartet PK=0;
zwei anschliessende unveraenderte Einzel-Laeufe bestanden alle 168 Faelle. Kein
Produktcode auf Verdacht geaendert und keine Pruefung abgeschwaecht.

Veroeffentlichungsluecke: Tags und Pages fuer 0.46.0/0.46.1 vorhanden, aber kein
GitHub-Release mit versionspassendem ZIP. Paket 0.46.1 nachgebaut und nach
den Browser-Gates am bestehenden Tag veroeffentlicht:
https://github.com/JakobSawazki/WorkbenchLab/releases/tag/v0.46.1
SHA-256 `dff58f00ed80c8ef9472424606ffca65fb7e19cd8eac99aa5a3b0aecc8696f93`.
Echter Schul-PC-Test bleibt offen; OPT-12 ist unten entschieden.

**Entscheidung Jakob, 2026-10-12:** Repository oeffentlich lassen und die
Auffindbarkeit der Loesungen im Quelltext/Verlauf als Grenze akzeptieren.
OPT-12 ist damit keine offene technische Umbauaufgabe mehr. Loesungsfilter
der veroeffentlichten Lernseite bleibt bestehen; keine Sichtbarkeitsaenderung,
keine Verlaufsaenderung und kein behaupteter Manipulationsschutz.

## Notiz- und Lesewerkzeuge 0.47.0 [Codex, 2026-10-15]

Jakobs fuenf Wuensche umgesetzt: NAGOLD-Listenscroll ignoriert beim eigenen
Scrollen das bisherige Schliessen, Scrollverkettung und Hintergrundscrollen
sind unterbunden. Textmarker jetzt im gesamten Einheitenkoerper, zusaetzliche
Textanker auch unterhalb der Informationsteile. Eigene Kommentare an einer
Auswahl mit Zitat, Bearbeiten/Loeschen, `lessonComments` und Grenzen.

Jakob hat ausdruecklich unterschiedliche Farben innerhalb einer Notiz gewaehlt.
`note-text.js` ergaenzt den Notizeditor: Klartext bleibt in alten Feldern,
`noteTextStyles` speichert nur Farbbereiche. Kein Benutzer-HTML, Zwischenablage
als Klartext; Farben aus festen Thementokens, Eingaben und Rueckgaengig erhalten.
Alte Tests an Contenteditable statt Textarea angepasst, Pruefaussagen erhalten.

Zeichnungsursache: feste Sperre ab 120 Strichen/8.000 Punkten galt auch fuer
Radieren. Jetzt automatische transparente PNG-Verdichtung bei der Grenze,
auch waehrend langer Striche. Bild in der bestehenden Zeichenliste als
bereinigter erster Eintrag mit `points: []`; keine externen Bildadressen.
Import prueft festen PNG-Abmessungsheader, Laenge und Dekodierung im Browser.
Neue Striche sind weiter einzeln rueckgaengig; vor Verdichtung liegende Striche
sind danach ein Bild, nicht mehr einzeln editierbare Striche. Dateisicherung
bei Browserspeichermangel bleibt noetig. Sicherungsformat 9 schuetzt vor
stillem Verlust beim Import in aeltere App-Versionen.

228 Node-/vier Python-Tests sowie beide nativen Pruefer bestanden. Neue
Regression prueft Mausrad, Farbwort nach Neuladen, Undo/Redo, Kommentar-XSS,
beide Zeichengrenzen, echte Bildpunkte/Radieren nach Neuladen und den Import
auf einen zweiten Browser. Vollstaendiger Lauf aller 48 Browserdateien
bestanden: 318 Kontrast-, 1200 Ueberlauf-, 252 Namensansichten und 955
Tastaturstopps. Alle 69 manifest-gelisteten App-Dateien entsprechen dem
geprueften finalen Bau. Offline-ZIP: 10.950.544 Bytes, SHA-256
`052af4a116445338a1107ae427dafe91b9c5dc4fe4aebed8eca81c132b4d950d`.
Keine SQL-Aufgabe geaendert.

Git-Fetch wurde durch neu erzeugte desktop.ini unter `.git/refs` und
Unterordnern gestoert. Der Werkzeugschutz hat das Entfernen abgelehnt; keine
Datei geloescht und kein alternativer Loeschweg benutzt. Remote-main stattdessen
vor der Veroeffentlichung ueber die GitHub-API geprueft: identisch zum lokalen
Ausgangscommit `da985c0`. Normaler Push ohne erzwungene Aktualisierung vorgesehen.

Ergebnis: normaler Push erfolgreich, Metadatendateien mussten fuer diese
Veroeffentlichung nicht entfernt werden. Commit `9d7b9fd`, Tag `v0.47.0`,
Pages-Lauf `38692792308` erfolgreich. Release-ZIP anonym vollstaendig geladen,
Laenge und SHA-256 korrekt. `annotation-tools.browser.cjs` auch direkt auf
der Live-Seite bestanden; neue Hilfsdatei und Kommentar-Dialog in der
ausgelieferten Version 0.47.0 vorhanden. Keine Anmeldung durch Jakob noetig.
