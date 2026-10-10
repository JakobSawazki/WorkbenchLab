# Release 0.44.0: Offline-Paket für den Informatik-Stick

Stand: 10. Oktober 2026, Codex. Bestandteil des autarken Gesamtauftrags,
Teilschritt von OPT-15; keine Behauptung einer abgeschlossenen Vor-Ort-Abnahme.

## Umfang

- `node tools/build-offline.cjs` bzw. `pnpm build:offline` erzeugt
  `dist/WorkbenchLab-0.44.0-offline.zip`. Nur zum Bauen werden Node und Python
  benötigt; auf dem Schüler-PC reichen Entpacken und Öffnen von `index.html`
  in Microsoft Edge. Die Klassenübersicht ist `lehrkraft.html`.
- Grundlage ist die ausdrücklich gefilterte, lösungsbereinigte öffentliche
  App-Dateiliste, nicht der ganze Repository- oder `_site`-Ordner. Private
  Materialien, Lehrkraftlösungsdatei, Tests und Drive-Metadaten bleiben draußen.
- Im erzeugten Paket liegt zusätzlich `offline-data.js`: versionsgleiche
  WASM-Bytes, zwölf öffentliche Einheitenskripte und Untertitel. Online wird
  diese Zusatzdatei weder geladen noch benötigt. Die vorhandene SQL-Engine
  und ihre fachlichen Grenzen ändern sich nicht.
- `file://` verwendet die eingebetteten Daten statt Fetch. Fehlende oder
  falsche Paketversionen führen zu einem ausdrücklichen Fehler statt zu einem
  kaputten Nachladeversuch. VTT-Untertitel kommen aus einer lokalen Blob-URL,
  weil direkte Dateizugriffe für Tracks vom Browser blockiert werden.
- Lokale Startanleitung einschließlich Vorspulen und Untertiteln, SQL-Labor,
  Modellieren, Lernstandexport/-import und Lehrkraftprüfsumme bleiben nutzbar.
  YouTube und externe Quellen sind weiterhin Online-Angebote.
- ZIP enthält keinen persönlichen Lernstand. Vor PC-, Ordner- oder
  Versionswechsel muss dieser als Datei gespeichert und danach geladen werden.
  Der Dateimodus zeigt dies im Sicherungsdialog an. Vorhandene Schutzmaßnahmen
  bei gesperrtem Browserspeicher bleiben erhalten.
- `offline-manifest.json` nennt Größe und SHA-256 aller Nutzdateien. Python
  `zipfile` packt nur diese Liste mit festen Zeitstempeln und normalen Dateirechten;
  Pfadtraversierung, doppelte Einträge und externe Verknüpfungsziele werden abgewiesen.
- GitHub-Release erhält das erzeugte ZIP; „Offline-Paket“ im Sicherungsdialog
  verlinkt die exakt passende Releaseversion. Im Dateimodus ist dieser Link aus.

## Prüfung

Neue automatische Prüfungen:

- Node: ZIP-Dateiliste, CRC, Größen und SHA-256, WASM-Identität, alle zwölf
  Skripttexte, VTT, Version, Ladereihenfolge und fehlende Lösungsangaben.
- Python: reproduzierbarer Archivinhalt, ausgeschlossene Metadaten, ungültige
  Pfade und Duplikate ohne angelegte Zieldatei.
- Edge: wirklich entpacktes ZIP unter einem Pfad mit Leerzeichen, `file://`,
  Netzwerk ausgeschaltet, 1440 und 360 Pixel (mobil große Schrift).
  Skript öffnen/ausführen, freies SQL, Dateisicherung und Wiederherstellung,
  Neuladen, Lehrkraftprüfsumme, Video/Vorspulen/Untertitel, geladene Bilder,
  kein Seitenüberlauf, keine HTTP-Anfrage und kein JS-Abbruch.
- Zusätzlich fehlende/falsche Offline-Laufzeit und gesperrter Browserspeicher.

Release-Gates bestanden: 216 Node-Tests, vier Python-Tests und alle 44
Browser-Testdateien auf Port 4202. Darunter 318 Kontrastansichten, 1200
Breitenansichten, 252 Namens-/Strukturansichten und 925 Tastaturstopps.
Die Browserprüfung lief in zwei Abschnitten: Im neuen Offline-Test war beim
zusätzlichen Notizexport-Assert zunächst der falsche Feldname `notes` statt
`lessonNotes` verwendet worden. Korrigiert, Offline-Test und sämtliche noch
folgenden Dateien erneut erfolgreich ausgeführt; kein Produktcode dafür geändert.
Alle 168 nativen Vergleichsprüfungen und zwölf Skriptimporte mit nativen
Abfragen/Fremdschlüsseln ebenfalls bestanden. Keine SQL-Aufgabe oder neue
MySQL-Aussage in diesem Release; native Prüfer bleiben unverändert.

Paket: 65 öffentliche Basisdateien, im ZIP zusätzlich Datenhelfer, Lesedatei
und Manifest (68 Einträge insgesamt). Das endgültige ZIP ist 10.931.103 Bytes
groß. Desktop-/Mobilbilder sowie der Downloadknopf in beiden Farbmodi bei
360 Pixeln und großer Schrift visuell geprüft. Diff-/Indexprüfung ohne Befund.

## Grenzen und nächster Schritt

OPT-15 ist noch nicht vollständig abgeschlossen: Service Worker mit
Versionsprüfung für die HTTPS-Webseite und Jakobs echter Schul-PC-Test stehen
aus. Das ZIP ist keine Zusage für jeden Browser oder jede Schulrichtlinie.
Das Verhalten von Browserspeicher bei Datei-URLs ist browserabhängig; siehe
[MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
Die eingebetteten Bytes nutzen den vorhandenen `wasmBinary`-Eingang des lokal
vendorten SQL.js-Builds; keine heruntergeladene Ersatzlaufzeit.

Die übrigen offenen Punkte (Modell-Editor, Lösungen im öffentlichen
Repositoryverlauf, reale Vor-Ort-Prüfungen) bleiben im Gesamtauftrag.
