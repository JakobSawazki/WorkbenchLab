# WorkbenchLab 0.43.0

10. Oktober 2026, Codex. OPT-25 im laufenden autarken Ausbauauftrag.

## Änderungen

- Vierter Bestand im freien SQL-Labor: leerer Arbeitsbereich für eigene
  Datenbanken und die zwölf unterschiedlichen Skripte der Lerneinheiten.
- Skript auswählen und öffnen oder eine eigene SQL-Datei öffnen; kein
  automatisches Ausführen, Nachfrage vor dem Ersetzen eines Entwurfs.
- `CREATE DATABASE`, `USE`, `SELECT DATABASE()`, qualifizierte Tabellennamen
  und getrennte gleichnamige Tabellen. L3.2 behält beide Datenbanken.
- Live-Übersicht mit Datenbanken, Spalten, Typen, Primärschlüsseln und
  Tabellenvorschau, ohne den SQL-Entwurf zu überschreiben.
- Aliase, Unterabfragen, korrelierte Abfragen und CTEs werden anhand eines
  MySQL-Syntaxbaums auf SQLite abgebildet. Kein Entfernen von Schemaangaben.
- MySQL-Textwerte, einfache AUTO_INCREMENT-Primärschlüssel und Fremdschlüssel
  bleiben berücksichtigt. Gefährdende DROP-/TRUNCATE-Operationen mit externen
  Fremdschlüsseln werden abgelehnt. Nicht unterstützte Syntax wird gemeldet.
- Bei Laufzeitfehlern bleiben bereits ausgeführte Anweisungen erhalten und
  werden gezählt. Syntaxanalyse geschieht vor dem Ausführen des gesamten
  Texts. Eine leere letzte Abfrage zeigt nicht das vorherige Ergebnis.
- Entwurf bleibt über Browser-Neustart und Lernstandsicherung erhalten;
  Datenbanken sind Sitzungsdaten. Wechsel, Neuladen oder Zurücksetzen
  verwirft sie, wie jetzt ausdrücklich im Labor angegeben. Keine XP/NAGOLD.

## Technik und Herkunft

`sql-workspace.js` ergänzt die bestehenden drei Übungsbestände, ohne deren
Ausführung oder Aufgabenprüfung umzustellen. SQL.js bleibt die Datenbank.
Logische Schemata erhalten kollisionsfreie interne Tabellennamen in einer
SQLite-Verbindung; getestet mit 15 Datenbanken, ohne ATTACH-Zehnergrenze.
Interne Namen werden in Fehlermeldungen durch Unterrichtsnamen ersetzt.

Parser: unveränderter MySQL-UMD-Build von `node-sql-parser` 5.4.0,
Apache-2.0, lokal unter `vendor/node-sql-parser/`. Herkunft, geprüfte
Archiv-Prüfsumme und Lizenz liegen daneben. Keine Installationsskripte,
kein CDN zur Laufzeit, keine Erweiterung der sechs Stylesheet-Dateien.
Die lokale Lösungsdatei für Jakob wurde für 0.43.0 neu erzeugt, nicht publiziert.

## Prüfung

Release-Gates: 215 Node-Tests, 2 Python-Tests und alle 43 Browser-Testdateien.
Der neue Browsertest prüft Skriptöffnung ohne Ausführung, notwendige
Voraussetzungen, L3.2 mit beiden Datenbanken, Abfragen, Tabellenvorschau,
Teilfehler, leere Ergebnisse, Dateiaustausch, Entwürfe und beide Designs
bei 1440 und 360 Pixeln, bei 360 mit 20-Pixel-Schrift. Bestehende Kontrast-,
Überlauf-, Namens- und Tastaturprüfungen umfassen die neue Oberfläche.

`verify-claude-native.cjs` umfasst jetzt 168 Prüfungen, darunter native
Vergleiche von Datenbankwechsel, qualifizierten Namen, Alias-/Unterabfragen,
Textbytes, AUTO_INCREMENT, Umbenennen, TRUNCATE und Fremdschlüsselschutz.
Der Prüfer kontrolliert auch das getrennte Datenverzeichnis und den Port.
Unter Windows wird die Client-Ausgabe über eine temporäre reguläre Datei
statt einer vereinzelt leeren stdout-Pipe erfasst. Fehlgeschlagene Aussagen
werden nicht einfach wiederholt und anschließend als bestanden ausgegeben.

Alle zwölf Skripte sind zusätzlich mit ihren realen Voraussetzungen im
neuen Browserkern geprüft. L1.4/L1.8 und L2.2 sind bewusst keine
eigenständigen Datenbanklösungen: Die vorher erarbeiteten Tabellen werden
nicht heimlich automatisch angelegt. Der separate native Skriptprüfer
bleibt die Referenz für die vollständigen MySQL-Importe.

Abschlussprüfung bestanden: 215 Node-Tests, 2 Python-Tests, alle 43
Browser-Testdateien auf Port 4202; 318 Kontrastansichten ohne Ausnahmen,
1200 Breitenansichten, 252 Namens-/Strukturansichten, 925 Tastaturstopps.
168 native Prüfungen in drei vollständigen aufeinanderfolgenden Läufen
bestanden; separater Skriptprüfer bestätigt alle zwölf Importe und die
bisherigen nativen Aufgaben-/Fremdschlüsselprüfungen. Paketbau: 65 Dateien.
Desktop- und Mobilbilder visuell geprüft. Veröffentlichung über den
bestehenden Pages-Workflow, der Node und Python nochmals ausführt.

## Grenzen und Fortsetzung

Keine vollständige MySQL-Emulation. Erweiterte ALTER-Anweisungen,
Transaktionen, Routinen, nicht vom Parser unterstützte Schreibweisen und
alle übrigen bekannten SQLite-Unterschiede bleiben bei MySQL Workbench.
Ein ungeeignetes Skript führt zu einer Meldung, nicht zu stiller Umdeutung.

Der Gesamtauftrag bleibt aktiv: Offline-Betrieb, Modell-Erweiterungen und
der verbleibende Umgang mit Lösungen im öffentlichen Git-Verlauf folgen.
Schul-PCs, reale Workbench-Oberfläche, MySQL 8 und echte Assistenztechnik
sind weiterhin nicht vor Ort geprüft.
