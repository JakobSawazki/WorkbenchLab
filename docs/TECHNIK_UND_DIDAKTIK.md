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

## Bildsprache

Fotorealistische Unterrichtsmotive schaffen Kontext auf Übersicht, eERM- und
SQL-Einstieg. Die eigentlichen ERM/eERM-Modelle bleiben HTML/CSS-basiert, weil
Kardinalitäten, Schlüssel und Attribute dort scharf, responsiv, zugänglich und
automatisch prüfbar sind. Herkunft und Prompts sind unter
`docs/BILDSPRACHE_UND_ASSETS.md` dokumentiert.

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
