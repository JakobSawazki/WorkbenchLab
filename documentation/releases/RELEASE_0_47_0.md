# WorkbenchLab 0.47.0

15. Oktober 2026, Codex. Auftrag: NAGOLD-Auswahl scrollbar, einzelne
Notiztextstellen farbig, Textmarker bis ans Seitenende, eigene Kommentare und
weiter benutzbare Zeichnungen an der bisherigen Kapazitaetsgrenze.

## Aenderungen

- NAGOLD: Scrollen innerhalb der Vorschlagsliste schliesst die Liste nicht
  mehr. `overscroll-behavior: contain` und gesperrtes Hintergrundscrollen bei
  offenen Dialogen verhindern das Weiterreichen an die Seite dahinter.
- Notizen: Texteditor mit einzelnen farbigen Textstellen, vordefinierten
  themenabhaengigen Schriftfarben und Standardfarbe. Klartext bleibt in den
  bisherigen Feldern; `noteTextStyles` enthaelt nur bereinigte Farbbereiche.
  Einfuegen/Loeschen verschiebt die Bereiche. Rueckgaengig/Wiederholen fuer
  Text und Farbe; Zwischenablage ausschliesslich als Text. Bestehende Notizen
  werden nicht als HTML interpretiert.
- Textmarker liegt ueber dem gesamten Einheiteninhalt und bleibt bis unten
  erreichbar. Weitere Textbloecke in Aufgaben, Praxisauftrag und Abschluss
  erhalten ebenfalls stabile Auswahlanzeichen.
- Kommentare an ausgewaehlten Textstellen: Dialog mit Zitat und eigenem Text,
  Bearbeiten und Loeschen in der Einheit. `lessonComments`, maximal 100 je
  Einheit und 1.200 Zeichen je Kommentar. Ausgabe ausschliesslich escaped.
- Zeichnen: Bei 120 Strichen, 8.000 Punkten oder sehr langen einzelnen
  Strichen wird die sichtbare Flaeche als transparentes PNG verdichtet.
  Danach bleiben Zeichnen und Radieren moeglich. Alte Striche werden zu einem
  Bild zusammengefasst; ihre Einzel-Rueckgaengig-Schritte entfallen, neue
  Striche haben weiterhin ihre eigene Historie. PNG-Import nur mit festem
  1200x720-Header und begrenzten Bytes; keine URLs/SVGs. Bei Speichermangel
  bleibt die Dateisicherung der Ausweg.
- Sicherungsformat 9 enthaelt Farben, Kommentare und verdichtete Zeichnungen.
  Alte Sicherungen bleiben ladbar. Aeltere App-Versionen sollen die neue
  Sicherung nicht laden, damit sie diese neuen Daten nicht still verlieren.

## Pruefung

228 Node- und vier Python-Tests bestanden. Native MariaDB: 168 Vergleiche
und zwoelf Skriptimporte samt Abfragen/Fremdschluesseln bestanden; keine
SQL-Aufgabe oder MySQL-Aussage geaendert.

Neue gezielte Edge-Pruefung: echtes Mausrad auf der NAGOLD-Liste, farbiges
Wort nach Neuladen, Text-Rueckgaengig/Wiederholen, sicheres Kommentar-Markup,
Bearbeiten/Loeschen, Textmarker am Seitenende, volle Zeichnung bei beiden
alten Grenzen, PNG-Erhalt und echtes Ausradieren nach Neuladen, Export und
Import auf einem zweiten Browser, beide Designs bei 1440/360 Pixeln.

Vollstaendige Suite mit allen 48 Browsertestdateien gegen eine feste,
loesungsbereinigte TEMP-Kopie bestanden: 318 Kontrast-, 1200 Ueberlauf-,
252 Namensansichten und 955 Tastaturstopps. Zusaetzlich Kommentar-Dialog mit
grosser Schrift in beiden Designs bei 360/1440 Pixeln geprueft. Alle 69
manifest-gelisteten oeffentlichen Dateien stimmen mit dem finalen Bau ueberein.
Offline-ZIP: 10.950.544 Bytes, SHA-256
`052af4a116445338a1107ae427dafe91b9c5dc4fe4aebed8eca81c132b4d950d`.
Schul-PCs, echte mobile
Hardware und ein echter Bildschirmleser wurden nicht vor Ort geprueft.
