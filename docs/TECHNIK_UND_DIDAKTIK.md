# Technik und Didaktik

Stand: 18. Juni 2026

## Didaktisches Modell

WorkbenchLab folgt einem wiederholbaren Lernzyklus:

1. Ein Begriff oder Verfahren wird kurz erklärt.
2. Ein kleines Beispiel macht die Denkweise sichtbar.
3. Ein Verständnischeck sichert den Kern.
4. Eine Übung prüft die Anwendung.
5. XP und Erfolge geben Rückmeldung über kontinuierliches Arbeiten.

Die Inhalte sind bewusst in kleine Lernschritte geteilt, weil BPE6 fachlich
dicht ist. Modellierung und SQL werden nicht getrennt behandelt: Jede
SQL-Abfrage verweist auf das zugrunde liegende Datenmodell.

## SQL im Browser

Das SQL-Labor nutzt lokal eingebundenes `sql.js`, also SQLite im Browser.
Lucide und `sql.js` liegen unter `vendor/`; zur Laufzeit ist kein CDN nötig.
Vorteile:

- kein Server nötig
- GitHub-Pages-kompatibel
- gefahrloses Experimentieren
- unmittelbares Feedback
- einfache Lernstandsprüfung

Grenzen:

- MySQL Workbench wird nicht ersetzt.
- Nicht jede MySQL-Syntax funktioniert in SQLite.
- Die Originalskripte aus den Unterrichtsmaterialien müssen in MySQL Workbench
  genutzt werden.
- Der Browser-Lernstand ist nicht manipulationssicher.

Für BPE6-Übungen werden eigene kleine Fahrschul-Datensätze verwendet. Sie sind
fachlich an den Unterricht angelehnt, aber nicht als direkte Kopie von
Originalarbeitsblättern oder Lösungen gedacht.

## Lernstand

Der Lernstand liegt im `localStorage` unter `workbenchlab-v1` und enthält:

- Name oder Kürzel
- abgeschlossene Lektionen
- gelöste Übungen
- gelöste Befehls-Miniaufgaben
- SQL-Entwürfe
- Slot-Antworten
- Aktivitätstage
- zuletzt geöffnete Lektion

Export und Import verwenden ein JSON-Format mit `app: "WorkbenchLab"` und
`formatVersion: 1`.

## Leistungsbewertung

XP und Erfolge können sichtbar machen, dass regelmäßig geübt wurde. Sie sind
für die kontinuierlich erbrachte Leistung hilfreich, aber nicht alleinige
Notengrundlage. Sinnvoll ist eine Kombination aus:

- beobachteter Mitarbeit
- kurzen mündlichen Erklärungen
- WorkbenchLab-Lernstand
- SQL-/Modellierungsprodukten aus dem Unterricht
- Reflexion oder Portfolio

## Barrierearmut und Bedienung

- semantische Buttons und Formulare
- Tastaturbedienung für Karten
- sichtbare Fokuszustände
- responsive Layouts
- Export/Import für Gerätewechsel
- Light- und Dark-Mode

## Veröffentlichungsentscheidung

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
