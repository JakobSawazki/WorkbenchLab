# Release 0.25.0: fachliche Bildeinstiege

## Umfang

Die vorhandenen 21 Lerneinheiten behalten ihre Aufgaben, Quellen, Praxisauftraege und Abschlussbedingungen. Drei gezielte Einstiege verbinden neue fotorealistische Fallbilder mit jeweils drei kurzen Denkfragen und einer zunaechst geschlossenen Vergleichsloesung:

- L1.1: Einheitliche Attribute, nicht eindeutige Namen, veraenderliche Telefonnummern und Text statt Rechenwert.
- L2.1: Gespeicherte Redundanz statt Wiederholungen im Ergebnis; Aenderungsanomalie, beabsichtigte FK-Wiederholung und aus Fallregeln abgeleitete 1:N-Kardinalitaet. Der technische Constraint folgt weiterhin erst in L2.2.
- L5.1: Bewusste Ausleihe und zusaetzliche Protokolldaten; Stationspunkte sind kein Routenbeweis; eine Profilnummer garantiert keine Anonymitaet. Der Transfer zur vorhandenen Schulportal-Testdatenbank bleibt explizit.

Die Fragen sind muendliche Einstiegsimpulse und erzeugen weder weitere Pflichtfelder noch XP. Die eigentlichen Lernprodukte bleiben im bestehenden Aufgabenblatt und im Workbench-Praxisauftrag. Vergleichsloesungen, Falltext und Fragen sind mit dem Textmarker bearbeitbar; die neuen Anker bleiben bei Speicherung und Import erhalten. Fachlich verbindliche Tabellen und Diagramme werden nicht durch KI-Bilder ersetzt.

## Darstellung

Ungeframte Bild-/Fallansicht mit echter Alternativbeschreibung und Kennzeichnung als KI-generierte fiktive Szene. Alle drei Motive bleiben vollstaendig sichtbar (object-fit: contain); auf kleinen Bildschirmen stehen Bild und Aufgabe untereinander. Kein Autoplay und keine externen Bildanfragen.

Mitgepruefte mobile Korrekturen: Die Textmarker-Leiste bricht bei zu wenig Platz um. Lange Praxis-Dateinamen koennen umbrechen. Der Profilhinweis am Abschluss verweist korrekt auf den Button oben rechts.

## Abnahme

- 106 Node-Tests erfolgreich, einschliesslich drei gezielter lokaler Assets, unveraenderter Lektionen ausserhalb des neuen opening-Felds, fachlicher Fallgrenzen und Import-Validierung.
- Neue Bildeinstiegs-Browsertests: L1.1, L2.1 und L5.1, beide Farbmodi, Breiten 1440/1024/390/320 px; bei kleinen Breiten Schriftgroesse 20 px. Bildladung, Alternativtexte, dreiteilige Aufgaben, initial geschlossene Vergleichsloesung, Tastatur, unveraenderte XP und dauerhaft gespeicherte Markierung geprueft.
- Bestehende Browserpruefungen fuer Notizen/Markierungen/Sicherung, alle 21 sequenziellen Einheitsabschluesse, Profil/XP und Darstellung erfolgreich.
- Desktop- und Mobilansichten visuell kontrolliert; neue Assets zwischen 153 und 248 KB.

## Bilddateien und Herkunft

Erzeugt mit dem integrierten image_gen-Werkzeug, ohne CLI/API-Fallback. Fiktive Szenen, keine echten Schueler oder Kontodaten. Originale bleiben im lokalen Codex-Bildverzeichnis erhalten. Die finalen Projektdateien sind auf 1600 px Breite verkleinerte WebP-Versionen (Qualitaet 86), ohne nachtraegliche inhaltliche Bildbearbeitung:

- `assets/images/lesson-l1-1-kontaktdaten.webp`
- `assets/images/lesson-l2-1-wohnorte.webp`
- `assets/images/lesson-l5-1-radverleih.webp`

## Verwendete Prompts

### L1.1

```text
Use case: photorealistic-natural. Asset type: wide educational photograph for the beginning of a German vocational-school database lesson. Create one realistic documentary photograph in landscape 16:9 of a modest modern driving-school reception workspace in Germany. Primary subject clearly visible: a desktop with a small open index-card box containing assorted contact cards, a paper registration form with unidentifiable non-legible entries, and a laptop seen from the back/side; background window reveals a parked generic driving-school compact car without logos or license text. No people necessary. The learning theme is moving scattered registrations into structured data, not a fantasy computer interface. Crisp natural daylight, restrained realistic colors with navy-blue stationery and a few green accents, honest materials, photograph not illustration/CG render. All objects must be fully readable as objects, don't blur or darken them. Compose a useful wide scene with main desktop items in central safe area so responsive image containment keeps them visible. No personal data, readable names, branding, watermarks, captions, SQL or fake database diagrams. Fictional setting.
```

### L2.1

```text
Use case: photorealistic-natural. Asset type: wide 16:9 educational documentary photograph for a database lesson about separating objects and relationships. Show a fictional German driving school on a clear weekday in natural daylight: three young adult driving students waiting at a modest driving-school office exterior beside a generic compact training car. Beyond them a small real-looking residential neighborhood with several houses along the same street, emphasizing several people may live in the same locality. No staged advertising smiles, no luxury, no fantasy. Crisp true photographic detail, navy, green and neutral accents, approachable vocational-learning context. All central subjects visible in a wide establishing shot, straightforward scene rather than abstract technology metaphor. No readable personal information, names, license plates, logos, brand names, watermarks or text overlays; no invented SQL, tables or ER diagram. People are fictional adults.
```

### L5.1

```text
Use case: photorealistic-natural. Asset type: wide 16:9 educational documentary photograph for a school database lesson about digital traces in bicycle rental. A fictional young adult person using a smartphone beside an everyday bicycle rental docking station in a modern European town square, daylight. Several distinct ordinary rental bicycles in docks, one bicycle being released, phone visible held naturally but screen contains only a plain unbranded simple abstract interface, no readable personal data. Clear actual physical action, ordinary realistic environment, no neon circuitry, floating data, holograms, graphic arrows, or generated text. Real photography with crisp honest materials, restrained navy green and silver accents, inviting and realistic, wide view keeping person, phone and bicycle dock in central area, no advertising or fashion styling. No logos, brands, readable signs, plates, names, watermarks. All people are fictional adults. The picture should help ask which rental event, timestamp or station number could be recorded, but must not pretend any invisible data can be directly observed.
```
