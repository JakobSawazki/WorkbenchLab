# Abnahme WorkbenchLab 0.22.3

Stand: 3. Oktober 2026. Geprueft wurde die oeffentliche GitHub-Pages-Seite
mit isolierten synthetischen Testprofilen. Echte Lernstaende und vorhandene
Unterrichtsdatenbanken wurden nicht veraendert.

## Bisherige Auftraege

| Bereich | Aktueller Nachweis |
| --- | --- |
| Metallischer Dark Mode, Start-Icon, Kontrast, SQL-Icon, feste Farbpaletten, Schriftgroesse, Zuruecksetzen | appearance.browser.cjs und appearance.test.js; Dark/Light, Desktop/Mobil und grosse Schrift |
| Intuitive Diskette ohne technische Profilangaben oder zusaetzlichen Speicherfooter | appearance.browser.cjs, notebook-drawing.browser.cjs |
| Browserspeicherung, JSON-Sichern/Laden, optionaler Abschlussdownload | study-workflow.browser.cjs, backup-safety.browser.cjs; auch Speicherfehler und ungueltige Importe |
| Start-Icon mit Sprung nach Hause/ganz nach oben; ausblendbare Navigation; anfangs geschlossene Lernschritte | notebook-drawing.browser.cjs, study-workflow.browser.cjs |
| eERM-Erklaerung im passenden Modellierungskontext, aufklappbar | model-glossary.browser.cjs; nicht auf der Startseite oder in L1.1/L1.2 |
| Dezenter Herstellerhinweis und metallisches Profil | styles.css und aktuelle Sichtpruefung der Darstellung |
| Gesamtes Profil anklickbar und hervorgehoben; XP nur oben mit schliessbarem Leveldialog | xp.browser.cjs; Avatar, Name, Klasse, Level, Rand, Tastatur, beide Modi |
| Neue fotorealistische Karte, Weg L1-L5, wachsende Siedlungen, Farbakzente und Einheitenmenues | settlement-map.browser.cjs und aktuelle Sichtpruefung; 390/1440/1920 px, Hover/Touch und sequenzielle Freischaltung |
| Textmarker als Symbol, fette Markierungen und zusaetzliches Gruen | study-workflow.browser.cjs, study-tools.test.js; Erstellen, Aendern, Loeschen und Neuladen |
| Eingebettete Notizen, X/Escape, Rueckkehr, Zeichnen, Farben, Radieren, Undo/Redo, PNG und JSON | notebook-drawing.browser.cjs; Canvas-Pixel und JSON-Roundtrip |
| Radierergroessen Klein/Mittel/Gross per Langdruck, Mittel standardmaessig 48 | notebook-drawing.browser.cjs; auch Tastaturauswahl |
| L1.1 Speicherangaben und vollstaendig sichtbare Grafik mit dunkelblauem Tabellenkopf | study-workflow.browser.cjs, table-design-layout.browser.cjs; fuenf Breiten, zwei Modi, zwei Schriftgroessen |
| YouTube einbetten, zusaetzlicher externer Link | learning-path.test.js, app.js; Online-Wiedergabe vom Nutzer bestaetigt, lokale Einschraenkung akzeptiert |
| Animierte Startfolge mit Klicks, Wartephase, offenem CMD, Workbench-Versionen und Connection-Werten | workbench-start.test.js, verify-workbench-start.cjs; Online-MP4 1920x1080, 101.98 Sekunden, 15 Untertitel, sechs verschiedene dekodierte Frames |
| Direkter Startanleitungsaufruf aus L1.1-L1.4 und Rueckkehr | startup-navigation.browser.cjs; Button/Browser-Zurueck erhalten Schritte, Position und Fokus; kein Autoplay |
| Information, Aufgaben und echte Workbench-Arbeit in allen 21 Einheiten | lesson-phase-order.browser.cjs, lessonbezogene Node-Tests und RELEASE_0_22_0.md; Modell- und SQL-Auftraege sowie Lernprodukte vorhanden |
| Uebersichtliche grosse Aufgabenblaetter ohne Verlust von Aufgaben/Antworten | worksheet-groups.browser.cjs und worksheet-groups.test.js; zehn Blaetter, 164 Antworten, Neuladen und JSON-Roundtrip, 40 Ansichten |
| Alle 21 Abschluesse, Modulwechsel und keine doppelten XP | lesson-completion.browser.cjs; vollstaendiger sequenzieller Durchlauf |
| SQL-Downloads auf dem nativen Datenbankserver | verify-native-sql.cjs; zwoelf Imports in frischer MariaDB 10.4.13, JOIN, DATE_FORMAT, DATEDIFF, YEAR/MONTH, TIMESTAMPDIFF, SUM und FK-Fehler geprueft; Server danach beendet |
| GitHub und Online-Verfuegbarkeit | main auf GitHub; Pages-Lauf 37133870117 erfolgreich; lokale und veroeffentlichte Kern-Dateien per SHA-256 identisch |

## Umfang und Ergebnis

94 Node-Tests und zwoelf Online-Browserpruefsuiten ohne Fehler. Die
Videopruefung hat zusaetzlich Bilddaten dekodiert und das erfolgreiche Laden
der Untertitel abgewartet. Die neun abgeglichenen Dateien sind index.html,
app.js, styles.css, learning-path.js, appearance.js, study-tools.js, drawing.js,
die Alpenkarte und die Untertiteldatei. Die Website-Version bleibt 0.22.3;
der Abnahmenachtrag aendert keine Schuelerfunktionen.

Die bisher beauftragten Website-Funktionen und Unterrichtsauftraege sind
umgesetzt und im beschriebenen Umfang geprueft. Es werden keine weiteren
Funktionen allein zur Fortsetzung der autonomen Arbeit hinzugefuegt.

## Verbleibende Einsatzgrenzen

- Die native SQL-Pruefung ersetzt keine GUI-Abnahme der Workbench-Versionen
  6.3.10/8.0.21 und keinen Test am realen Schul-PC oder im Schulnetz.
- Die Startanimation stellt Oberflaechen didaktisch nach. Ein gezeigter
  erfolgreicher Verbindungstest ist keine Verbindung zu einem Schul-PC.
- Eigene .mwb- und .sql-Dateien werden in Workbench separat gespeichert;
  die Browser-JSON-Datei sichert den Lernstand, nicht externe Arbeitsdateien.
- Eine Screenreader-Abnahme und Unterrichtsrueckmeldungen stehen aus.
- Lehrkraft-Sammelansicht, signierte Abgaben und ein integrierter
  Lehrbuchleser sind nicht Bestandteil der bisherigen Website-Auftraege.

Private Originalmaterialien unter resources/ und lokale Testartefakte unter
.tmp/ bleiben von Git und der Veroeffentlichung ausgeschlossen.
