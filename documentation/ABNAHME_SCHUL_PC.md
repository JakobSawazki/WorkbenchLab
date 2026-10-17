# Schul-PC-Abnahme fuer WorkbenchLab 0.48.0

Diese Liste ersetzt fuer die heutige Abnahme die historische Checkliste
0.16 in `documentation.md`. Insbesondere gilt deren alte Erwartung eines
fehlgeschlagenen Offline-Neuladens nicht mehr: Offline-Betrieb ist umgesetzt.

## Bereits im Unterricht berichtet

Jakobs aktuelle Rueckmeldung: Im Unterricht wurde MySQL Workbench ueber den
Informatik-Stick verwendet; Jakob hat den Start manuell gezeigt. Das Laden
der SQL-Skripte hat funktioniert. Das belegt reale Unterrichtsnutzung und
das Laden, aber nicht automatisch alle folgenden Schritte, die genaue
Workbench-Buildnummer oder die Verwendung der animierten Webseiten-Anleitung.

Fruehere Rueckmeldung zum scheinbaren Notizverlust: Die Notizen waren weiterhin
in Chrome vorhanden; am Folgetermin war stattdessen Edge verwendet worden.
Das war kein belegter Speicherverlust. Browserdaten sind browsergetrennt.

## Durchfuehrung

Datum: __________ Raum/PC: __________ Browser/Version: __________
Workbench-Version: __________ MariaDB-Version: __________

Mit einem eigenen Test-Lernstand arbeiten, keine vorhandenen Schuelerdaten
loeschen oder zuruecksetzen. Ergebnisse lokal notieren. Fuer technische
Rueckmeldungen reichen Testdaten; echte Schuelersicherungen nicht in GitHub
hochladen. Netzwerkpruefungen nur im Rahmen der schulischen Vorgaben.

| Nr. | Schritt | Erwartung | Ergebnis |
| --- | --- | --- | --- |
| A1 | [Webseite](https://jakobsawazki.github.io/WorkbenchLab/?v=0.48.0#home) im Schulnetz oeffnen | Seite und SQL-Labor laden; SQL ist bereit | offen |
| A2 | Startanleitung unter Nachschlagen ansehen und tatsaechliche Schritte am Stick vergleichen | Reihenfolge: Stick, MySQL starten, Konsole offen lassen, Workbench, Verbindung | offen; bisher manuell gezeigt |
| A3 | Workbench-Version ablesen; Verbindung testen; `SELECT VERSION();` ausfuehren | genaue Versionen und erfolgreiche Verbindung dokumentiert | Workbench-Nutzung berichtet; Details offen |
| A4 | Einheitenskript herunterladen und in Workbench laden/ausfuehren | Laden und Ausfuehrung getrennt bestaetigen; Fehlermeldungen notieren | Laden berichtet; Ausfuehrung offen |
| A5 | EER-Modell als `.mwb` speichern, schliessen und wieder oeffnen | Modell bleibt unveraendert | offen |
| A6 | Testnotiz schreiben, ein Wort faerben, eine nummerierte Liste anlegen; Text markieren und kommentieren | Text, Farbe, Liste, Markierung und Kommentar sichtbar | offen |
| A7 | Eine Zeichnung anlegen, radieren, Seite neu laden | Zeichnung und Radierung bleiben erhalten | offen |
| A8 | Browser ganz schliessen und denselben Browser am selben PC erneut oeffnen | Notizdaten aus A6/A7 vorhanden | offen |
| A9 | Nach Ab- und Anmeldung am Schul-PC denselben Browser oeffnen | Daten noch vorhanden; falls nicht, schulische Loeschrichtlinie feststellen und Dateisicherung am Stundenende einplanen | offen |
| A10 | Lernstand ueber Diskette/Speichern als Datei sichern und in einem zweiten Browser mit Laden uebernehmen | Notizen, Farben, Zeichnung, Markierungen, Kommentare und Punkte uebertragen; Original bleibt unveraendert | offen |
| A11 | Im Test-Lernstand Startkapital einmal auswaehlen, danach Anwesenheit in neuer Zeile | 5 + 2 NAGOLD, ohne Speichern-Knopf; nach Neuladen erhalten; Startkapital nicht erneut angeboten | offen |
| A12 | Freiwillige Offline-Kopie vorbereiten; nach Abschluss ohne Netzwerk neu laden | Seite, SQL-Labor, Notizen und lokales Anleitungsvideo verfuegbar; YouTube braucht weiterhin Internet | offen |
| A13 | Offline-ZIP herunterladen, vollstaendig entpacken und `index.html` ohne Netzwerk oeffnen | Browser-SQL startet; Notizen und JSON-Sicherung funktionieren | offen |
| A14 | Zwei Test-Sicherungen in der Lehrkraftuebersicht laden, eine NAGOLD-Zeile separat bestaetigen, CSV exportieren | gemeldete und bestaetigte Werte bleiben getrennt; CSV in Excel lesbar | offen |

## Rueckmeldung

Je offenem Punkt genuegen Nummer, Browser/Version und Ergebnis. Bei Fehlern
genauen Wortlaut bzw. Bildschirmfoto ohne personenbezogene Inhalte angeben.
Nicht durchgefuehrte Schritte bleiben offen; automatisierte Edge-Tests am
Entwicklungsgeraet ersetzen diese Vor-Ort-Abnahme nicht.
