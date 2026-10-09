# WorkbenchLab 0.42.0

9. Oktober 2026, Codex. Zwischenrelease im laufenden autarken Ausbauauftrag.

## Änderungen

- Blaues Satin-Titan, dezente Materialtextur und Glaskanten; vorhandene
  Farbpaletten, reduzierte Bewegung, Druck und Kontrastmodi bleiben erhalten.
- NAGOLD neben XP im gleich hohen Profilbutton, auch bei 360 Pixeln und
  großer Schrift. Im Profil weiterhin ausgeschrieben.
- NAGOLD-Tabelle: Datum, Uhrzeit (HH:MM), Anlass und 1 bis 5 ganze Punkte;
  lokale Zeitvorbelegung, Vorauswahl oder Freitext, Plus/Minus,
  Doppelklick oder Tastatur-Bearbeitung. X/Esc verwirft den Entwurf.
- Einheitenabschlüsse buchen einmalig 5 NAGOLD mit Datum und Uhrzeit.
  Alte Einträge werden ohne erfundene historische Zeit übernommen.
  XP werden unabhängig berechnet. Sicherungsformat 7, alte Importe möglich.
- Lehrkraftübersicht: separate lokale Bestätigungen für gesehene Einheiten
  und NAGOLD, eigene Sicherung/Import, getrennte bestätigte CSV-Spalten.
  Änderungen an gemeldeten Einträgen benötigen erneute Bestätigung.
  Die Schülertabelle bleibt Selbstauskunft; keine versteckten Zugangscodes.
- Unlesbare Lernstände bleiben auch bei vollem Rettungsspeicher erhalten.
- Keine Kontrastausnahmen für kleine Beschriftungen mehr. Test- und
  Diagnoseartefakte liegen in Windows-Temp statt Google Drive. Drei
  ungenutzte PNG-Originale bleiben als Quellen, nicht im Webseitenpaket.
- `pnpm serve` nutzt einen lokalen Node-Server ohne Zusatzabhängigkeiten.
  HTTP-Teilabrufe ermöglichen das Vorspulen der vorhandenen Startanimation.

## Prüfung

Release-Gates: `node tools/run-tests.cjs`,
`python -B -m unittest discover -s tests -p "test_*.py"` und alle
`tests/*.browser.cjs`. Der Pakettest prüft die gefilterte Veröffentlichung,
nicht nur den Entwicklungsordner. Der Paketumfang beträgt 61 Dateien.

Bestanden: 208 Node-Tests, 2 Python-Tests, alle 42 Browser-Testdateien,
294 Kontrastansichten ohne Ausnahmen, 1188 Breitenansichten, 248 Ansichten
für vorlesbare Namen/Struktur und 919 Tastaturstopps. Letzter vollständiger
Browserlauf gegen den neuen lokalen Server auf Port 4201.

Zusätzlich `node tools/verify-native-sql.cjs` für zwölf Einheitenskripte und
native Abfragen/Fremdschlüssel sowie `node tools/verify-claude-native.cjs`
für Claudes MariaDB-Prüfungen. Die Prüfer verwenden getrennte temporäre
Datenbanken, nicht Jakobs Arbeitsdatenbank. Die Video-Prüfung bestätigt
1920×1080, etwa 102 Sekunden, 15 Untertitel und sechs unterschiedliche
decodierte Zeitpunkte auf dem HTTP-Teilabrufe unterstützenden Server.

Beide nativen Prüfer bestanden, einschließlich aller 151 Claude-Fälle.
Die lokale Lösungsdatei für Jakob ist passend zu 0.42.0 neu erzeugt und
bleibt unversioniert. `git diff --check` und Indexprüfung ohne Befund.

## Grenzen und Fortsetzung

Dieser Release beendet den Gesamtauftrag nicht. OPT-25 (Einheitenskripte im
Browser), Offline-Paket/Service Worker, Modell-Editor-Erweiterungen und der
Rest von OPT-12 bleiben im Arbeitsplan. Der Webseitenbau entfernt Lösungen,
aber der öffentliche Git-Verlauf enthält weiterhin frühere Lösungsangaben.
Bestätigungen auf dem Lehrkraftgerät sind keine Identitätsauthentifizierung
für eingelesene Schülerdateien. Reale Schul-PCs, MySQL 8, echter Bildschirmleser
und tatsächlicher Unterrichtseinsatz bleiben extern zu prüfen.

Live-Adressen: [Lernplattform](https://jakobsawazki.github.io/WorkbenchLab/),
[Lehrkraftübersicht](https://jakobsawazki.github.io/WorkbenchLab/lehrkraft.html).
