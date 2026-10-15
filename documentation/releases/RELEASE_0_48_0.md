# WorkbenchLab 0.48.0

15. Oktober 2026, Codex. Zusammenfassung von Jakobs anschliessenden
Oberflaechen- und NAGOLD-Wuenschen nach Release 0.47.0.

## Aenderungen

- NAGOLD-Tabelle speichert gueltige Aenderungen und Loeschungen sofort;
  kein separater Speichern-Button. Bei unvollstaendigen Korrekturen bleibt
  der letzte gueltige Stand erhalten. Neue unvollstaendige Zeilen blockieren
  andere Zeilen nicht; Speicherfehler werden gemeldet.
- Anwesenheit als Anlass mit automatisch vorausgefuellten 2 Punkten.
- Startkapital als Anlass mit einmalig 5 Punkten. Die erfolgte Vergabe
  bleibt im Lernstand und der Sicherung auch nach Loeschen der Zeile erhalten.
  Alte Startkapital-Zeilen werden erkannt. Keine Gutschrift allein durch
  den Seitenbesuch, kein technischer Manipulationsschutz.
- Goldfarbener Jahresziel-Balken im Profil: 100 NAGOLD = 100 Prozent =
  Sehr gut (Note 1), nach Jakobs Vorgabe. Keine anderen Notengrenzen.
  Echte Summen bleiben auch bei negativen Werten oder ueber 100 sichtbar.
- Stift statt Listensymbol zum Bearbeiten der NAGOLD-Tabelle.
- Klassenkurzformen nur mit Buchstaben, Zahlen und Bindestrichen;
  Sonderzeichen werden bei Eingabe und Laden/Import entfernt.
- H2-Werkzeug entfernt, nummerierte Notizen mit Fortsetzung durch Enter
  ergaenzt. Bulletpoints und Checkliste bleiben. Alte Notizen unveraendert.
- Logo mit vergroesserndem Metallglanz bei Hover und Tastaturfokus;
  reduzierte Bewegung wird respektiert, kein Layoutsprung.
- Redundante Startseiten-Verknuepfung "Quellen und Werkzeuge" und
  Profil-Speicherhinweis unter dem Einheitenabschluss entfernt.

## Pruefung und Veroeffentlichung

229 Node-Tests und vier Python-Tests bestanden. Gezielt geprueft:
NAGOLD-Autosave, Sperre der zweiten Startkapital-Vergabe nach Loeschen und
Neuladen, Erhalt beim Sicherungsimport, Hinweis bei gesperrtem Browserspeicher,
Jahresziel mit negativen und ueber 100 liegenden Werten, nummerierte Notizen
samt Enter und Klassenbereinigung. Alle 49 Browsertestdateien gegen eine
feste, loesungsbereinigte TEMP-Kopie bestanden: 252 Namensansichten,
318 Kontrastansichten, 1.200 Ueberlaufansichten und 953 Tastaturstopps.
Der erste Gesamtlauf endete bei einer Tastatur-Scrollpruefung im bestehenden
Modelltest mit Timeout; derselbe Test bestand unveraendert im Einzellauf,
danach bestanden alle verbleibenden Dateien gegen dieselbe Kopie. Keine
Pruefung abgeschwaecht oder uebersprungen. SQL-Aufgaben und MySQL-Aussagen
unveraendert; die nativen SQL-Pruefungen wurden fuer diesen UI-Release nicht
erneut benoetigt.

Alle 69 oeffentlichen Dateien stimmen bytegenau mit der festen TEMP-Kopie
fuer die Browsertests ueberein. Offline-ZIP: 10.952.073 Bytes, SHA-256
`2b2840b13235a6b31259c9a264a66f114b2d4b42e81617978926f411ebf5a49c`.

Schul-PC-Abnahme, echte assistive Technik und reale Hardware bleiben offen.

Veroeffentlichungsziel: `main`, Tag `v0.48.0`, GitHub Pages und
`https://github.com/JakobSawazki/WorkbenchLab/releases/tag/v0.48.0`
mit `WorkbenchLab-0.48.0-offline.zip`. Browserdaten bleiben lokal im jeweiligen
Browser; Sicherungen sind weiterhin fuer Browser-/PC-Wechsel erforderlich.
