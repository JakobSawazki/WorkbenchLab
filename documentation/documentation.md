# WorkbenchLab Projektdokumentation

Stand: 26. September 2026, 17:51 Uhr (Europe/Berlin)

Lokaler Entwicklungsstand: **0.14.0**

Veröffentlichter Stand: **0.14.0**

Repository: `https://github.com/JakobSawazki/WorkbenchLab`

Live-Seite: `https://jakobsawazki.github.io/WorkbenchLab/`

## 1. Projektziel

WorkbenchLab ist ein öffentliches Lernportal für die
Bildungsplaneinheit BPE6 „Relationale Datenbanken“ in Jahrgangsstufe 1. Die
Schülerinnen und Schüler sollen Fachwissen aufbauen, in MySQL Workbench
anwenden, browsergestützte Übungen bearbeiten, eigene Notizen führen und ihren
Fortschritt nachvollziehbar als JSON-Datei sichern.

Die fachliche Grundlage bilden der Bildungsplan und das lokale Materialpaket
„Relationale Datenbanken“ des Landesbildungsservers Baden-Württemberg, Stand
31.07.2025. Die Originalmaterialien unter `resources/` werden nicht
veröffentlicht. Öffentliche Texte, Illustrationen und Interaktionen werden
eigenständig und webgerecht aufbereitet.

## 2. Aktueller Funktionsstand

- statische Single-Page-App ohne erforderliches Backend
- Dark Mode als Standard; Light Mode über das Sonnen-/Mond-Symbol
- fünf Lernfortschritte `L1` bis `L5`
- 21 Lerneinheiten und 38 Übungen
- sequenzielle Freischaltung: zunächst nur `L1.1`, danach jeweils die nächste
  Einheit; der nächste Lernfortschritt folgt erst nach dem vorherigen
- zweistufiges Lernpfad-Menü in der Seitenleiste für Desktop und Tastatur
- anklickbarer Breadcrumb nach dem Muster `Lernfortschritt 1 > L1.1`
- Profilbearbeitung über das anklickbare Avatar-Icon
- Entwicklerschalter ausschließlich im geöffneten Profilfenster mit `AltGr + S`
  ein- und ausblendbar; der Schalter öffnet oder sperrt alle Einheiten nur
  für die aktuelle Browsersitzung und vergibt keine XP
- integrierte Arbeitsaufträge für Browser, Heft und MySQL Workbench
- Lektionsabschluss erst nach Selbstkontrolle, bestandenem Verständnischeck
  und Lehrkraftbestätigung
- XP, Level, Erfolge und Aktivitätstage
- lokales SQL-Labor mit `sql.js`, deterministischer Prüfung und SQL-Coach
- eigenständige eERM- und Workbench-Illustrationen in HTML/CSS
- lokales Lernprofil mit Schülerkürzel und Klasse
- JSON-Sicherung mit Profil-, Geräte- und Übertragungsinformationen

## 3. Lernpfad

| Kürzel | Lernfortschritt | Einheiten |
| --- | --- | ---: |
| L1 | Eine Tabelle aufbauen und mit SQL nutzen | 10 |
| L2 | Mehrere Tabellen modellieren und verbinden | 4 |
| L3 | M:N-Beziehungen und 3NF sicher beherrschen | 3 |
| L4 | Schrittweise normalisieren | 1 |
| L5 | Digitale Spuren und Big Data beurteilen | 3 |

Die Reihenfolge wird aus `learning-path.js` abgeleitet. Eine Einheit ist
freigeschaltet, wenn die unmittelbar vorherige Einheit abgeschlossen ist. Das
gilt auch für Direktlinks und die zugehörigen Übungen. Der Entwicklermodus
überbrückt die Sperren zur Unterrichtsvorbereitung, verändert aber keine
Abschlüsse und vergibt keine XP.

## 4. L1.1 Tabellenentwurf

L1.1 wurde am 20.09.2026 vollständig aus folgenden lokalen Quellen
eigenständig neu aufbereitet:

- `L1_1 Information Tabellenentwurf.docx`
- `L1_1 Aufgabe Tabellenentwurf.docx`
- `L1_1 Vorlage Tabellenentwurf.docx`

Umgesetzt wurden:

- eine eigene responsive Illustration „Kontaktkarten werden Relation“
- Definitionen für Datensatz/Tupel, Primärschlüssel, Attribut und Attributwert
- Entwurfsregeln für Tabellenname, Attributname, Atomarität und Schlüssel
- Datentypentabelle für `INT`, `DOUBLE`, `VARCHAR(n)`, `DATE`, `TIME` und
  `BOOLEAN`/`TINYINT(1)` einschließlich Bedeutung und Beispiel; die frühere
  pauschale Byteangabe für `VARCHAR(n)` wurde fachlich präzisiert
- Fahrschul-Fallsituation mit nachvollziehbarem Praxisauftrag
- vier Freitextfelder für Definitionen in eigenen Worten
- direkt ausfüllbare Tabellenentwurfsvorlage mit elf Attributzeilen,
  Datentypauswahl, Zeichenanzahl und genau einem Primärschlüssel
- eigene Zusammenfassung und Leitfragen
- automatische lokale Speicherung aller Eingaben und Aufnahme in den
  JSON-Export

### Unterrichtsstart mit L1.1 bis L1.6

| Einheit | Schwerpunkt | Lernprodukt | Arbeitsort |
| --- | --- | --- | --- |
| L1.1 | atomare Attribute, Schlüssel und Datentypen | digitaler Tabellenentwurf | Browser und Heft |
| L1.2 | ERD und Relationenschema aus `L1_2.1` und Aufgabe `L1_2` | vier digitale Antworten und ERD-Skizze | Browser und Heft |
| L1.3 | EER-Modell mit einer Tabelle nach `L1_2.2` | `.mwb`-Datei und digitales Prüfblatt | Informatik-Stick, MySQL Workbench und Browser |
| L1.4 | Modell synchronisieren und fiktive Daten importieren nach `L1_3`/`L1_4` | Schema, SELECT-Kontrolle und digitales Prüfblatt | Informatik-Stick, MySQL Workbench und Browser |
| L1.5 | Projektion und Sortierung nach `L1_5.1` | drei SQL-Abfragen, digitales Blatt und drei Browserübungen | MySQL Workbench und Browserlabor |
| L1.6 | Selektion nach `L1_5.3` | zwölf digitale Antworten und fünf Browserübungen | MySQL Workbench und Browserlabor |

Die Einheiten bleiben nacheinander gesperrt und werden erst nach Abschluss
der vorherigen Einheit geöffnet. L1.2 führt noch keine zweite Tabelle und
keine Kardinalität ein; L1.3 erzeugt zunächst nur eine Modelldatei. Die
serverseitige Datenbank folgt in L1.4. Die alten, thematisch unpassenden
Browserchecks für L1.2 und L1.3 wurden entsprechend ersetzt.

Vor der ersten Stunde:

1. Bereitstellung für die Schüler-PCs klären. `127.0.0.1:4174` ist nur auf
   dem jeweiligen Rechner erreichbar; GitHub Pages zeigt noch Version 0.5.0.
2. An einem echten Schul-PC Informatik-Stick, `MySQL starten`, MySQL Workbench,
   EER-Diagramm, das erneute Öffnen einer `.mwb`-Datei und die Synchronisierung
   samt Importskript prüfen.
3. Schülerkürzel und Klasse im Lernprofil anlegen lassen. Den JSON-Export als
   Lernstandssicherung erklären; die `.mwb`-Datei muss getrennt aufbewahrt
   werden und ist **nicht** im JSON enthalten.
4. Die Lehrkraft bestätigt den fachlichen Abschluss nach Sichtung des
   Lernprodukts. Die Browser-Checkbox ist kein manipulationssicherer
   Nachweis und ersetzt die persönliche Kontrolle nicht.

Die Browser- und Inhaltstests sind abgeschlossen; die Punkte 1 und 2 sind
für einen produktiven Unterrichtseinsatz noch offen.

## 5. Lernprofil und JSON-Sicherung

### 5.1 Pflichtangaben

- Schülerkürzel im Format `ABC.DEF`
- offizielle Klassenkurzform, zum Beispiel `J1-1` oder `WGJ1/1`

Das Kürzel wird normalisiert; Umlaute werden in `AE`, `OE`, `UE` und `SS`
umgeschrieben. Der vollständige Name wird nicht gespeichert.

### 5.2 Nachvollziehbare Kennungen

Jedes neue Profil erhält:

- eine zufällige portable Profil-ID
- einen Profilcode als kurze Anzeigeform
- Zeitstempel der Profilerstellung
- Kennung des Browserprofils, auf dem das Lernprofil angelegt wurde

Jedes Browserprofil erhält lokal:

- eine zufällige Geräte-ID
- einen kurzen Gerätecode
- Zeitstempel der Erzeugung

Beim Import auf ein anderes Browserprofil bleibt das Herkunftsgerät des
Lernprofils erhalten. Zusätzlich wird eine begrenzte Übertragungshistorie mit
Quell-Export, Quellgerät, Zielgerät und Importzeitpunkt geführt.

### 5.3 Exportformat 3

Version 3 enthält unter anderem:

- App- und Formatversion
- Export-ID und Exportzeitpunkt
- Schülerkürzel und Klasse
- Profil-ID, Profilcode und Profilherkunft
- aktuelles Exportgerät und grobe Browserumgebung
- XP- und Fortschrittszusammenfassung
- Lektionsabschlüsse, Quizstatus und Abschlusschecks
- SQL-Entwürfe und Modellierungsantworten
- eigene Notizen und digitale Arbeitsblätter
- SHA-256-Prüfsumme über den vollständigen Export ohne den Integritätsblock

Beim Import wird die Prüfsumme vor der Übernahme kontrolliert. Die Formate 1
und 2 bleiben lesbar; bei ihnen wird transparent angezeigt, dass keine
Prüfsumme vorliegt.

### 5.4 Technische Sicherheitsgrenzen

Eine Browserseite auf GitHub Pages kann keine MAC-Adresse auslesen. Eine lokale
IP-Adresse ist durch heutige Browser ebenfalls nicht zuverlässig verfügbar;
eine öffentliche IP-Adresse wäre häufig nur die gemeinsame Schul-/Routeradresse
und würde einen externen Dienst erfordern. Deshalb werden weder MAC noch IP
vorgetäuscht. Im Export stehen diese Werte auf `null` und die Einschränkung wird
erklärt.

Die SHA-256-Prüfsumme erkennt beschädigte oder nachträglich veränderte Dateien,
ist aber keine geheime digitale Signatur. Weil die Anwendung öffentlich und
clientseitig ist, könnte eine technisch versierte Person eine Datei samt
Prüfsumme neu erzeugen. Für eine belastbare Betrugsprävention sind später ein
Lehrkraft-Schlüssel, signierte Abgaben oder ein authentifiziertes Backend nötig.
Die Lernstandsdatei bleibt daher ein Nachweisbaustein und ersetzt nicht die
Beobachtung und Bestätigung durch die Lehrkraft.

## 6. Versionsverlauf

### 0.14.0, 26.09.2026, 17:51 Uhr

- Nach ausdrücklicher Freigabe auf `main` veröffentlicht (Release-Commit
  `4809fad`). Der GitHub-Pages-Workflow war erfolgreich.
- Live geprüft: Startseite, `learning-path.js` und das L2-Beispieldaten-Skript
  liefern HTTP 200. Die lokalen Originalmaterialien unter `resources/` und
  der unfertige Lehrbuchentwurf liefern HTTP 404 und sind nicht veröffentlicht.
- Vor dem Push bestanden 12 Node-Inhaltstests und zwei Python-Datentests.
  Ein echter Durchlauf mit MySQL Workbench 6.3.10 am Schul-PC bleibt offen.

### 0.14.0-local, 26.09.2026, 17:31 Uhr

- L2.1 aus `L2_1` (Redundanzfreiheit) und `L2_2.1` (Datenbankmodell mit zwei
  Tabellen) neu ausgearbeitet: Ergebnis-Duplikate versus gespeicherte
  Redundanz, Änderungsanomalie, fachliches ERD, 1:N und Relationenschema.
  Fünf direkt ausfüllbare Antworten, Notizfragen und eine neue vierteilige
  Browserübung ergänzen den handgezeichneten Modellauftrag.
- L2.2 an `L2_2.2` (softwaregestützte Modellierung) gebunden: Kopie des
  L1-Modells, eigenes Schema `fahrschule_l2`, `orte` mit `ortnr` als PK/AI,
  `ortnr` als FK in `fahrschueler`, Entfernen der redundanten Ortsattribute
  nur im neuen Modell. Eine interaktive EER-Übung lässt PK, FK und 1:N
  direkt im Diagramm setzen.
- Ein eigenes Skript mit ausschließlich fiktiven L2-Testdaten ergänzt. Es
  enthält nur INSERT- und SELECT-Abfragen, keine CREATE-, DROP-, ALTER-
  oder DELETE-Anweisung. Die SQL-Vorschau von Forward Engineer muss vor
  Ausführung geprüft werden; das Material-Setting zum Löschen vorhandener
  Objekte wurde bewusst nicht in den Schülerablauf übernommen.
- Zwölf Node-Inhaltstests und zwei SQLite-Datentests bestanden. Das neue
  Diagramm und L2.1 im lokalen Browser geprüft; kein Push, keine
  Veröffentlichung. Ein echter Durchlauf in Workbench 6.3.10 am Schul-PC
  bleibt offen.

### 0.13.0-local, 26.09.2026, 16:08 Uhr

- Nachschlagen für den tatsächlichen Unterrichtsablauf präzisiert: offizieller
  Link zu Schultasche-BW, Start über das Play-Symbol, Doppelklick auf
  `MySQL starten`, Warten auf `ready for connections`, Konsolenfenster offen
  lassen und erst dann MySQL Workbench öffnen.
- Schulversion 6.3.10 als Bezugspunkt gesetzt; 8.0.21 bleibt eine mögliche
  Variante auf dem privaten Stick. Eine lokale Connection wird mit
  `127.0.0.1`, Port `3306` und dem im Screenshot sichtbaren Beispielbenutzer
  `root` illustriert, aber nicht als allgemeingültige Schulkonfiguration
  behauptet. Keine Schul-/Microsoft-365-Passwörter verwenden.
- L1.3 um einen eigenen Dienst- und Verbindungsschritt samt
  `SELECT VERSION();`, Notizfeld und Abschlusskontrolle ergänzt. Die
  Unterscheidung zwischen gespeicherter `.mwb`-Modelldatei und erst in L1.4
  erzeugter Datenbank bleibt erhalten.
- Zehn Node-Inhaltstests bestanden; die neue Nachschlagen-Ansicht im lokalen
  Browser visuell geprüft. Kein Push und keine Veröffentlichung.

### 0.12.0-local, 26.09.2026, 15:21 Uhr

- L1.7 anhand von `L1_5.7 Information Redundanzen in Abfrageergebnissen`
  und dem zugehörigen Aufgabenblatt auf `DISTINCT` fokussiert. Die bisher
  vermischten Themen `LIKE`, `IN` und `BETWEEN` gehören nicht zum Kern dieses
  Originalabschnitts; die vorhandene LIKE-Browserübung bleibt als klar
  gekennzeichnete Vertiefung erhalten.
- Erklärungen zu Wiederholungen im Ergebnis und zu einmaligen
  Wertekombinationen, ein digitales Blatt mit allen vier Originalaufträgen,
  Notizfragen und ein gezielter Kurzcheck ergänzt.
- Drei weitere Browser-SQL-Übungen für Vorname, Nachname und Fahrstunden
  ergänzt. Die lokale Browser-Testtabelle enthält nun auch eine doppelte
  Fahrstundenzahl; im MySQL-Unterrichtsmodell heißt dieses Attribut weiterhin
  `fahrstundenzahl`. Keine Änderung des bereits vorbereiteten L1.4-Imports.
- Neun Node-Inhaltstests und die vier DISTINCT-Abfragen in `sql.js` geprüft.
  Stand weiterhin lokal; kein Push und keine Veröffentlichung.

### 0.11.0-local, 25.09.2026, 18:15 Uhr

- L1.6 anhand `L1_5.3` als ausführliche Einheit zu Selektion, Operatoren,
  Text-, Zahlen- und Datumsvergleichen sowie LIKE, AND, OR, NOT und BETWEEN
  ergänzt. Das digitale Blatt umfasst die Begriffsfrage und Aufgaben 2 bis 12.
- Vier neue Browser-SQL-Übungen ergänzen die vorhandene Sortierübung; die
  Originalaufgaben werden in Workbench mit einem passend gestalteten,
  ausschließlich fiktiven Importdatensatz lösbar.
- Der sichtbare Reiter `Muster` wurde aus der Schüler-SQL-Ansicht entfernt.
  Hinweise und SQL-Coach bleiben erhalten. Die Original-Musterlösungen aus
  `resources/` werden weiterhin nicht auf der Homepage ausgeliefert.
- Stand weiterhin lokal; keine Veröffentlichung ausgelöst.

### 0.10.0-local, 25.09.2026, 18:05 Uhr

- L1.5 anhand von `L1_5.1 Information Datenbankabfrage Projektion` und
  `L1_5.1 Aufgabe Datenbankabfrage Projektion` ausgearbeitet: SELECT, FROM,
  ORDER BY, ASC/DESC und Sortierung nach zwei Attributen.
- Vier digitale Antwortfelder (Begriff und drei SQL-Abfragen) sowie drei direkt
  ausführbare und bewertete Browserübungen ergänzt. Eine zweite Person mit
  gleichem Nachnamen macht das zweite Sortierkriterium im Testdatensatz sichtbar.
- Abhängigkeit zwischen L1.2, L1.3 und L1.4 geklärt: elf Attribute explizit
  benannt; das fiktive Importscript befüllt nun alle elf statt nur fünf
  Spalten und enthält keine Original-Kontaktdaten.
- Stand weiterhin lokal; keine Veröffentlichung ausgelöst.

### 0.9.0-local, 25.09.2026, 16:30 Uhr

- L1.4 anhand der Informations- und Aufgabenblätter `L1_3` und `L1_4`
  ausgearbeitet: Workbench-Verbindung, `Synchronize Model`, SCHEMAS-Kontrolle,
  Datenimport und `SELECT`-Prüfung. Eigenes digitales Nachweisblatt und
  Verständnischeck ergänzt.
- Ein kleines, nicht destruktives SQL-Übungsskript mit fünf ausdrücklich
  fiktiven Datensätzen unter `assets/sql/` erstellt. Die Kontaktangaben aus
  dem Originalmaterial werden nicht auf der Homepage bereitgestellt.
- Download des Übungsskripts im Praxisauftrag ergänzt; L1.1-Vorlage um eine
  Attributzeile erweitert, damit alle elf Spalten des späteren Modells Platz
  finden. Workbench-Reihenfolgeübung an den Quellenablauf angepasst.
- Stand weiterhin lokal; keine Veröffentlichung ausgelöst.

### 0.8.0-local, 25.09.2026, 16:10 Uhr

- L1.2 anhand von `L1_2.1 Information Datenbank modellieren` und
  `L1_2 Aufgabe Datenbank modellieren` als ERD- und Relationenschema-Einheit
  neu ausgearbeitet: Fachbegriffe, Modellgrafik, vier digitale Antworten,
  Heftauftrag, passende Browserübung und Verständnischeck.
- L1.3 anhand von `L1_2.2 Information Datenbank softwaregestützt modellieren`
  und Aufgabe `L1_2` zu einem konkreten Workbench-Ablauf überarbeitet:
  Schema, EER-Diagramm, Tabelle, PK/NN, Datentypen, `.mwb`-Kontrolle und fünf
  digitale Reflexionsfelder. Vorzeitige Kardinalitätsübung ersetzt.
- Das Arbeitsblatt-Rendering unterstützt jetzt auch reine Freitextvorlagen
  ohne leere Attributtabelle. L1.2 hat eine passende eigene Ablaufleiste.
- Versionsparameter für lokale CSS- und JS-Dateien verhindern alte
  Mischstände aus dem Browsercache.
- Vier automatisierte Inhaltstests für die ersten drei Lerneinheiten ergänzt.
- Fachliche Präzisierung zum Speicherbedarf von `VARCHAR(n)` in L1.1.
- L1.1 verwendet nun einen eigenen Ablauf für den Tabellenentwurf statt einer
  verfrühten Aufforderung, bereits in MySQL Workbench zu arbeiten.
- Stand lokal, kein GitHub-Push und keine Freigabe für Schüler-PCs erfolgt.

### 0.7.2-local, 25.09.2026

- Bedienelemente in Dark und Light Mode mit zurückhaltendem Metall-Look,
  Lichtkante, Tiefe und klaren Hover-/Klickzuständen versehen.
- Primäre Aktionen in dunklem Metall-Türkis; sekundäre Aktionen und
  Icon-Buttons in Stahl bzw. Graphit. Navigationspunkte und Profil-Icon
  stilistisch angepasst.
- Bewegungseffekte bei reduzierter Bewegung deaktiviert.
- Topbar-Raster korrigiert, damit lange Lektionstitel Aktions-Icons nicht
  überlagern. Stand bleibt lokal; keine Veröffentlichung.

### 0.7.1-local, 25.09.2026

- Avatar im Seitenmenü öffnet das Lernprofil; Stift-Schalter entfernt.
- `AltGr + S` blendet nur im geöffneten Profilfenster den Entwicklerschalter
  ein oder wieder aus. Der Schalter aktiviert/deaktiviert die globale
  Lernpfad-Freischaltung ohne Lernstand oder XP zu verändern.
- Breadcrumb in Lerneinheiten führt über den Lernfortschritt direkt zum
  entsprechenden Abschnitt im Lernpfad.
- `docs/` in `documentation/` umbenannt; vorhandene Markdown-Dokumente,
  Arbeitslisten und Übergabehinweise in `documentation/documentation.md`
  konsolidiert. Screenshots bleiben unter `documentation/screenshots/`.
- Stand lokal; kein GitHub-Push und keine Veröffentlichung.

### 0.7.0-local, 20.09.2026, 14:13 Uhr

- Dark Mode als Standard gesetzt; gespeicherter Light Mode bleibt erhalten
- Klasse als Pflichtangabe in Profil, Seitenleiste und JSON-Sicherung ergänzt
- Profil-Dialog auf Desktop und Mobil ohne Feld-/Button-Überlagerung aufgebaut
- Profilherkunft, Exportgerät, Übertragungshistorie und Browserumgebung ergänzt
- JSON-Format auf Version 3 mit SHA-256-Integritätsprüfung erweitert
- Grenzen von MAC- und IP-Ermittlung transparent dokumentiert
- sequenzielle Freischaltung über alle 21 Lerneinheiten eingeführt
- `AltGr + S` und sitzungsbezogenen Entwicklermodus ergänzt
- zweistufiges Lernpfad-Flyout mit `L1` bis `L5` und allen Lerneinheiten gebaut
- Breadcrumbs auf „Lernfortschritt n > Lx.y“ umgestellt
- L1.1 aus Information, Aufgabe und Vorlage vollständig integriert
- digitales L1.1-Arbeitsblatt und allgemeine Lektionsnotizen ergänzt
- alle neuen Zustände in lokale Speicherung, Normalisierung und Export aufgenommen

### 0.6.0-local, 20.09.2026

- lokalen BPE6-Bestand mit 245 Dateien erfasst: 169 DOCX, 45 SQL-Dateien,
  27 Workbench-Modelle, drei Videos und eine Präsentation
- 21 Einheiten in fünf Lernfortschritte eingeordnet
- alle Einheiten mit Praxisauftrag, Lernprodukt, Abschlusskriterien und
  Materialbezug ausgestattet
- lehrkraftbestätigten Lektionsabschluss eingeführt
- Übungen für `CREATE TABLE`, `UPDATE` und `DELETE` ergänzt
- private Selbstversuche aus L5 durch fiktive datensparsame Fälle ersetzt
- Materialmatrix erstellt; jetzt als Anhang in dieser Dokumentation

### 0.5.0, 18.06.2026

- anonymisiertes Schülerkürzel `ABC.DEF` eingeführt
- Profil-Dialog und Fokusabstände korrigiert
- JSON-Format 2 mit Profil-ID, Browser-/Gerätecode, Export-ID und Zeitstempel
- Datenschutzgrenzen für lokale Identitäten dokumentiert
- als derzeitige Live-Version veröffentlicht

### 0.4.0, 18.06.2026

- drei eigenständige fotorealistische Unterrichtsmotive ergänzt
- Fachdiagramme als zugängliche HTML/CSS-Modelle beibehalten
- lokalen SQL-Coach mit Kriteriencheck, Ergebnisvergleich und übersetzten
  Fehlermeldungen umgesetzt
- Architektur für eine optionale serverseitige KI-Rückmeldung dokumentiert;
  keine API-Schlüssel im Browser

### 0.3.0, 18.06.2026

- eigenes eERM-Modul mit Sachtextanalyse, Kardinalitäten und M:N-Auflösung
- interaktive Diagrammaufgaben zu Fahrradvermietung und Schule
- normalisiertes Vermietungsschema und Drei-Tabellen-JOIN
- Befehlsbibliothek um Primär- und Fremdschlüssel erweitert

### 0.2.0, 18.06.2026

- Workbench-Ablauf, flexible SQL-Filter und Datumsfunktionen ergänzt
- Übungen für `DISTINCT`, `LIKE`, `IN`, `BETWEEN`, `YEAR` und `MONTH`
- Nachschlage-Screenshots durch eigene responsive Illustrationen ersetzt

### 0.1.0, 18.06.2026

- PythonLab-Struktur analysiert und statische SPA aufgebaut
- Bildungsplan und Kompetenzraster ausgewertet
- 13 Lektionen, 13 Übungen, SQL-Labor, XP, Erfolge und Sicherungsdialog
- Lucide und `sql.js` lokal eingebunden
- GitHub-Pages-Workflow vorbereitet, Repository erstellt und veröffentlicht

## 7. Qualitätssicherung

### 25.09.2026, Version 0.11.0-local

- `node --test tests/learning-path.test.js`: 8/8 erfolgreich.
- `python -m unittest discover -s tests -p 'test_*.py' -v`: 1/1
  erfolgreich. Der Datentest prüft die Suchfälle des Originalaufgabenblatts
  gegen fünf fiktive Datensätze.
- L1.6 im Browser: zwölf Eingabefelder, fünf Übungslinks, kein horizontaler
  Überlauf in der geprüften Desktopansicht. Alle fünf SQL-Übungen mit
  korrekten Abfragen erfolgreich bewertet; kein `Muster`-Reiter sichtbar.
- Echtes MySQL Workbench am Schul-PC, Mobilansicht der langen L1.6-Seite und
  Screenreader-Abnahme bleiben noch offen.

### 25.09.2026, Version 0.10.0-local

- Drei L1.5-SQL-Aufgaben mit den vorgesehenen Lösungen im Browserlabor
  ausgeführt und erfolgreich bewertet; noch mit dem bisherigen Zehn-Zeilen-
  Testdatensatz, vor Ergänzung des zweiten Nachnamens `Keller`.
- Nach Ergänzung des zweiten Nachnamens `Keller` die dritte Übung erneut
  geprüft: elf Ergebniszeilen und korrekte Bewertung. Eine Abfrage ohne
  zweites Sortierkriterium wird erkannt und erhält einen passenden Coach-Tipp.
- `node --test tests/learning-path.test.js`: 6/6 erfolgreich; der neue Test
  deckt drei SQL-Aufgaben und den doppelten Nachnamen ab.
- Das vollständige fiktive Importskript wurde gegen eine passende
  In-Memory-Tabelle ausgeführt: fünf Zeilen, drei Orte, zwei gleiche Nachnamen.
  Nur die MySQL-spezifische `USE`-Anweisung wurde für SQLite entfernt.
- L1.5-Ansicht ohne Browserkonsolenfehler geprüft.
- Die vollständig befüllte fiktive Importdatei muss weiterhin an einem echten
  Schul-PC in MySQL Workbench geprüft werden.

### 25.09.2026, Version 0.9.0-local

- `node --test tests/learning-path.test.js`: 5/5 erfolgreich; Syntaxprüfungen
  für `app.js`, `content.js` und `learning-path.js` erfolgreich.
- L1.4 im Browser: fünf digitale Antwortfelder, vollständiger Praxisauftrag,
  Download-Link und keine Konsolenfehler oder horizontaler Überlauf bei der
  geprüften Desktopbreite.
- Übungsskript lokal per HTTP mit Status 200 erreichbar. Der INSERT-Teil wurde
  mit einer passenden In-Memory-Tabelle ausgeführt und ergab fünf Datensätze;
  dabei wurde nur die MySQL-spezifische `USE`-Zeile für SQLite entfernt.
- Statischer Test bestätigt: keine `DROP`-, `DELETE`- oder
  `TRUNCATE`-Anweisung im Downloadskript.
- MySQL Workbench am Schul-PC und das echte Ausführen des Skripts bleiben
  noch zu prüfen.

### 25.09.2026, Version 0.8.0-local

- `node --test tests/learning-path.test.js`: 4/4 erfolgreich.
- `node --check` für `app.js`, `content.js` und `learning-path.js`: erfolgreich.
- L1.2 im Browser: vier Freitextfelder, ERD/Schema-Grafik, eigener Ablauf,
  passende Übung und Abschlusskontrollen vorhanden.
- L1.3 im Browser: fünf Freitextfelder, Workbench-Modellgrafik und fünf
  passende Übungsfelder vorhanden; Eingabe im Prüfblatt blieb nach Neuladen
  erhalten.
- Korrigierter L1.1-Ablauf im Browser nach Neuladen sichtbar.
- Isolierter Testlernweg mit synthetischem Profil `TES.TER` auf `localhost`:
  L1.1 ausgefüllt, nach Neuladen erhalten und mit simuliertem Lehrkraft-Haken
  abgeschlossen; 40 XP und L1.2 freigeschaltet. L1.2 mit vier Antworten und
  Notiz ebenfalls nach Neuladen erhalten, Quiz bestanden, abgeschlossen;
  insgesamt 70 XP und L1.3 freigeschaltet. Die Lehrkraft-Bestätigung wurde
  dabei nur für den Funktionstest simuliert, nicht fachlich erteilt.
- Mobilansicht 390 × 844 ohne horizontalen Überlauf; Browserkonsole ohne
  Fehlermeldung.
- Echtes Schul-PC-Setup und öffentlicher Zugriff noch **nicht** geprüft.

### 25.09.2026, Version 0.7.2-local

- Dark und Light Mode visuell im lokalen Browser geprüft.
- Lange Lektionsüberschrift neben Topbar-Aktionen ohne Überlagerung.
- Mobilansicht bei 390 × 844: kein horizontaler Überlauf; Titel und
  Aktionsreihe mit getrennten Flächen.
- Button-Hover, Aktivierung und Fokuszustände im CSS definiert;
  `prefers-reduced-motion` berücksichtigt.

### 25.09.2026, Version 0.7.1-local

- `node --check app.js` und `node --check learning-path.js`: erfolgreich
- `git diff --check`: keine Whitespace-Fehler
- Profilfenster über Avatar geöffnet; kein Stift-Button mehr vorhanden
- `AltGr + S` im Profil: Schalter sichtbar; erneuter Hotkey: verborgen
- Hotkey außerhalb des Profils: Schalter bleibt verborgen
- Schalter aktiv: keine gesperrten Lerneinheiten oder Lernfortschritte;
  deaktiviert: sequenzielle Sperren wiederhergestellt
- Breadcrumb von L1.1 führt zu Lernfortschritt 1 im Lernpfad
- Mobilansicht bei 390 × 844: 28 px Abstand zwischen Entwicklerschalter
  und Dialogaktionen; Dialoginhalt scrollbar
- Browserkonsole beim Funktionstest: keine Fehler
- Dokumentation: genau eine Markdown-Datei unter `documentation/`,
  Screenshots und README-Verweise erhalten

### 20.09.2026, Version 0.7.0-local

- `node --check app.js`: erfolgreich
- `node --check learning-path.js`: erfolgreich
- Dark-Mode-Start ohne gespeicherte Präferenz: erfolgreich
- anfängliche Freigabe: genau eine Einheit (`L1.1`)
- Entwicklermodus: alle 21 Einheiten freigeschaltet
- Abschluss von L1.1: 40 XP; anschließend genau L1.1 und L1.2 zugänglich
- L1.1: vier Definitionen, sechs Datentypen, zehn Vorlagenzeilen
- Arbeitsblatt und Notizen nach Neuladen erhalten
- Profilnormalisierung: `mia.mül` wird `MIA.MUE`; Klasse `WGJ1/1` gespeichert
- alle 21 Lektionsseiten aufgerufen: keine fehlende Seite
- alle 27 Übungsseiten aufgerufen: 13 SQL- und 14 strukturierte Übungen
- Browserkonsole: keine Fehler oder Warnungen
- Desktopansicht bei 1440 × 1000 visuell geprüft
- zweistufiges Lernpfad-Menü per Tastaturfokus visuell geprüft
- Mobilansicht bei 390 × 844 visuell geprüft
- Profilfelder und Dialogaktionen im Mobilmodus ohne Überlagerung

Bereits im Stand 0.6.0 wurden alle 13 SQL-Lösungen und 14 strukturierten
Übungen inhaltlich erfolgreich durchgespielt. Die Änderung 0.7.0 betrifft die
Freischaltung und L1.1-Datenerfassung; die Übungsrouten wurden erneut vollständig
auf Erreichbarkeit geprüft.

## 8. Erledigte Aufgaben

- [x] lokale Orientierung an PythonLab und Excel-Lab
- [x] BPE6-Materialbestand und Kompetenzraster analysiert
- [x] fünf Lernfortschritte und 21 Lerneinheiten strukturiert
- [x] Workbench-Aufträge und lehrkraftbestätigten Abschluss umgesetzt
- [x] SQL-Labor und eERM-Übungen integriert
- [x] Dark Mode als Standard
- [x] Profil mit Kürzel und Klasse
- [x] nachvollziehbares JSON-Format 3
- [x] sequenzielle Freischaltung und Entwicklermodus
- [x] Lernpfad-Schnellmenü und Breadcrumbs
- [x] L1.1 inhaltlich und interaktiv vollständig integriert
- [x] L1.2 bis L1.6 quellennah für den Unterrichtsstart vertieft
- [x] Inhaltstests für L1.1 bis L1.7 ergänzt
- [x] L2.1 und L2.2 samt interaktivem 1:N-Diagramm und fiktiven
  Zwei-Tabellen-Testdaten ergänzt
- [x] sichtbaren Musterlösungs-Reiter aus der Schüleransicht entfernt
- [x] automatische Notiz- und Arbeitsblattspeicherung
- [x] Desktop- und Mobilprüfung des Stands 0.7.0-local
- [x] keine Veröffentlichung des lokalen Stands vorgenommen

## 9. Offene Aufgaben, priorisiert

1. Den vollständigen Ablauf an einem Schul-PC mit Informatik-Stick,
   `MySQL starten`, Workbench 6.3.10 und den dortigen Connection-Daten
   erproben. Die hier abgebildeten `127.0.0.1:3306` und `root` sind nur
   Werte aus dem privaten Screenshot, keine verifizierte Schulkonfiguration.
2. Schülerzugriff für die erste Stunde bereitstellen; Online-Stand 0.5.0
   enthält die lokalen L1.1-bis-L1.7-Änderungen noch nicht.
3. L1.8 bis L5.3 schrittweise mit direkt ausfüllbaren, quellennahen
   Aufgabenblättern ergänzen; L2.1 und L2.2 sind bereits vertieft.
4. Tastatur- und Screenreader-Abnahme mit realer Hilfstechnik durchführen.
5. Eine Lehrkraftansicht für mehrere JSON-Dateien entwickeln: Zuordnung,
   Prüfsummenstatus, Übertragungshistorie, Rubrik und Exportübersicht.
6. Für einen stärkeren Abgabenachweis ein datenschutzkonformes Modell mit
   Lehrkraft-Code oder serverseitiger Signatur konzipieren.
7. Freie eERM-Modellierung mit mehreren fachlich richtigen Lösungsvarianten
   und differenzierter Rückmeldung über die neue geführte 1:N-Übung hinaus
   entwickeln.
8. Mehrstufige Normalisierungs- und gemischte Abituraufgaben ergänzen.
9. Erst nach ausdrücklicher Freigabe committen, pushen und GitHub Pages auf
   den freigegebenen lokalen Stand aktualisieren.

## 10. Ideen für spätere Versionen

- druckbares Kompetenzraster aus dem Lernstand
- Lehrkraft-Import mehrerer JSON-Dateien mit Plausibilitätsampel
- Unterrichtscode je Abgabe oder Stunde
- Optionaler, zufällig vergebener Wiederherstellungscode für ein lokales
  Schülerprofil. Er muss getrennt von der JSON-Sicherung aufbewahrt werden;
  ein in derselben Datei enthaltener Code belegt weder Identität noch
  Unverändertheit. Ein gleichbleibender Schul-PC ist ebenfalls kein Beweis.
- Später gegebenenfalls eine separat genehmigte Freigabeliste aus Kürzel und
  Klasse mit individuell ausgegebenen Aktivierungscodes; keine Abfrage oder
  Speicherung von Schul-/Microsoft-365-Passwörtern. Verbindliche Freigaben
  und bewertungsrelevante Nachweise benötigen serverseitige Prüfung.
- signierte Exportdateien über ein kleines datenschutzkonformes Backend
- freies SQL-Labor mit Schemaauswahl und Aufgabenhistorie
- Diagnosechecks vor einzelnen Unterrichtsstunden
- MySQL-spezifische Hinweise zu Abweichungen von SQLite
- optionale Musterlösungen nur in einer künftig getrennten Lehrkraftansicht;
  der vorhandene Entwicklermodus blendet sie vorerst bewusst nicht ein
- SQL-Coach anhand anonymisierter realer Fehlermuster weiterentwickeln
- optionale KI-Rückmeldung ausschließlich serverseitig, mit klarer
  Datensparsamkeit und ohne offen ausgelieferten API-Schlüssel

## 11. Arbeits- und Veröffentlichungsregeln

- `resources/` bleibt lokal und wird nicht veröffentlicht.
- Lösungen aus Originalmaterialien werden nicht direkt öffentlich kopiert.
- Bei einer statischen Website sind clientseitige Prüfdaten technisch im
  ausgelieferten JavaScript einsehbar. Der entfernte `Muster`-Reiter verhindert
  nur die direkte Anzeige in der Schüleroberfläche; für geheime,
  notenrelevante Musterantworten ist später eine getrennte Lehrkraft-Lösung
  oder ein geschütztes Backend nötig.
- Neue Webinhalte werden eigenständig formuliert und fachlich geprüft.
- Lernstandsänderungen müssen in Normalisierung, Export, Import und
  Dokumentation nachgezogen werden.
- Keine API-Schlüssel, personenbezogenen Klarnamen oder privaten Kontodaten in
  Clientcode, Repository oder Screenshots.
- Vor jeder Veröffentlichung: Syntaxprüfung, `git diff --check`, Desktop,
  Mobil, Tastatur, mindestens eine Übung je Übungstyp und Live-Smoke-Test.
- Veröffentlichung nur nach ausdrücklicher lokaler Freigabe.

## 12. Wichtige Dateien

| Datei | Aufgabe |
| --- | --- |
| `index.html` | App-Shell, Navigation, Profil- und Sicherungsdialoge |
| `styles.css` | responsives Light-/Dark-Design und Visualisierungen |
| `content.js` | Basislektionen, Übungen, SQL-Schemata und Befehle |
| `learning-path.js` | fünf Lernfortschritte, Vertiefungen und L1.1 |
| `app.js` | Routing, Freischaltung, Interaktionen, Persistenz und Export |
| `documentation/documentation.md` | Projektstand, Aufgaben, Materialmatrix und archivierte Fachnotizen |
| `documentation/screenshots/` | Screenshots vergangener Entwicklungsstände |

## Anhaenge: bisherige Projektdokumente

Die folgenden Abschnitte bewahren die frueheren Einzeldateien als historischen Projektstand. Alte Dateipfade in den uebernommenen Texten bezeichnen die damalige Struktur; aktuelle Pfade stehen oben in dieser Datei.


###### Bildsprache und Assets (frueher: `documentation/BILDSPRACHE_UND_ASSETS.md`)

#### Bildsprache und Assets

Stand: 18. Juni 2026

##### Leitentscheidung

Fotos zeigen reale Lernsituationen und geben den Bereichen einen hochwertigen,
professionellen Kontext. Fachlich verbindliche ERM/eERM-Diagramme werden nicht
als Foto gerendert: In HTML/CSS bleiben Entitätstypen, Attribute, Schlüssel,
Kardinalitäten und Eingabefelder lesbar, responsiv und prüfbar.

##### Generierte Bildserie

Die drei Motive wurden mit dem integrierten OpenAI-Bildwerkzeug neu für
WorkbenchLab erzeugt. Es handelt sich nicht um Fotos realer Schülerinnen oder
Schüler.

| Datei | Einsatz | Kern des Generierungsprompts |
| --- | --- | --- |
| `assets/images/learning-database-classroom.jpg` | Übersicht | Zwei 17- bis 18-jährige Lernende vergleichen im hellen Computerraum ein relationales Datenbankmodell mit der Arbeit am Laptop; dokumentarisch, natürlich, ohne Logos oder lesbaren Text. |
| `assets/images/eerm-workshop.jpg` | Modellieren | Lerngruppe modelliert eine Fahrradvermietung mit Entitätskarten, Beziehungen, Laptop und Notizen; fotorealistische Draufsicht, ohne lesbare Beschriftungen. |
| `assets/images/sql-lab.jpg` | SQL-Labor | Schüler testet eine SQL-Abfrage; Codeeditor und Ergebnistabelle sind als Struktur sichtbar, aber ohne lesbaren generierten Text; helle Unterrichtssituation. |

Alle Motive wurden auf maximal 1600 Pixel Breite skaliert und als JPEG mit
Qualitätsstufe 88 gespeichert. Die Originalgenerierungen bleiben außerhalb des
Repositories im lokalen Codex-Bildordner.

##### Gestaltungsregeln

- Fotos ersetzen keine Definition, Tabelle oder Modellnotation.
- Keine künstlichen Hologramme oder dekorativen Datenbank-Symbole.
- Keine Logos, Wasserzeichen oder lesbaren Fantasietexte.
- Bildausschnitte müssen auf Desktop und Mobil den Lernvorgang erkennen lassen.
- Alternativtexte beschreiben die Lernsituation, nicht die Optik.

###### BPE6-Abgleich (frueher: `documentation/BPE6_ABGLEICH_2026.md`)

#### BPE6-Abgleich

Stand: 18. Juni 2026

##### Bildungsplan

Quelle: [Bildungsplan Informatik Baden-Württemberg](https://bildungsplaene-bw.de/,Lde/In_OS_nichtTG)

Jahrgangsstufe 1 enthält BPE6 **Relationale Datenbanken** mit einem
Zeitrichtwert von 30 Stunden. Die Einheit verlangt, dass Schülerinnen und
Schüler aus realen Situationen Datenmodelle entwickeln, diese in ein
Datenbanksystem überführen und komplexe Datenbestände speichern, auswerten und
verändern.

##### Abdeckung in WorkbenchLab

| Bildungsplanbereich | Umsetzung in WorkbenchLab |
| --- | --- |
| BPE6.1 Entity-Relationship-Modell | Eigenes eERM-Modul mit Sachtextanalyse, Rollen und Ereignissen, Kardinalitäten, Optionalität und M:N-Auflösung; zwei interaktive Diagrammaufgaben; Workbench-Ablauf mit Forward Engineering und Synchronize Model |
| BPE6.2 Relationenmodell | Relation, Datensatz, Attribut, Primärschlüssel, Fremdschlüssel, Redundanz, 3NF |
| BPE6.3 relationale Datenbank und SQL-Datenpflege | CREATE DATABASE/USE, CREATE/INSERT/UPDATE/DELETE-Karten, INSERT-Übung, Skriptimport und Ergebniskontrolle in MySQL Workbench |
| BPE6.4 SQL-Auswertung über mehrere Tabellen | SELECT, DISTINCT, WHERE, LIKE, IN, BETWEEN, ORDER BY, Datums- und Aggregatfunktionen, GROUP BY, HAVING und JOIN-Übungen; eERM-Transferaufgabe zur Fahrradvermietung über drei Tabellen |
| BPE6.5 Massendaten | Big-Data-Lektion und Bewertungsübung |

##### Lokale Materialstruktur

Quelle: `resources\bpe-6-relationale-datenbanken`

Die lokalen Materialien enthalten:

- Lernfortschritt 1: eine Tabelle, Tabellenentwurf, Projektion, Selektion,
  Funktionen, Gruppierung, Datenpflege
- Lernfortschritt 2: Redundanzfreiheit, mehrere Tabellen, Fremdschlüssel,
  referentielle Integrität, Abfragen über mehrere Tabellen
- Lernfortschritt 3: M:N-Beziehungen, komplexere Modelle, SQL-Auswertungen,
  3NF
- Lernfortschritt 4: Zusatzthema Normalisierung 1NF bis 3NF
- Lernfortschritt 5: Big Data, digitale Spuren, Chancen und Risiken
- Kompetenzraster und Ich-kann-Listen

##### Aktueller Umsetzungsgrad

Die Version 0.5.0 deckt die gesamte Breite von BPE6 ab, aber noch nicht die
Tiefe aller Originalaufgaben. Besonders komplexe SQL-Auswertungen, freie
eERM-Konstruktion und mehrstufige Normalisierung können weiter ausgebaut werden.

Priorisierte Lücken:

1. Reverse Engineering und Workbench-Fehlerdiagnose
2. mehr SQL-Aufgaben über 5 bis 7 Tabellen
3. anspruchsvollere 3NF-Zerlegeaufgaben
4. Abiturähnliche kombinierte Aufgaben
5. Lehrkraftansicht oder Portfolioexport

###### BPE6-Materialmatrix und Lernpfad (frueher: `documentation/BPE6_MATERIALMATRIX_2026.md`)

#### BPE6 Materialmatrix und Lernpfad

Stand: 20. September 2026

Lokaler Entwicklungsstand: 0.7.0-local

##### Zweck

Diese Matrix dokumentiert, wie die lokalen Unterrichtsmaterialien des
Landesbildungsservers Baden-Württemberg in den WorkbenchLab-Lernpfad eingehen.
Die Homepage übernimmt keine Originalarbeitsblätter oder Musterlösungen.
Erklärungen, Beispieldaten und Aufgaben werden eigenständig formuliert und für
Browser sowie MySQL Workbench aufbereitet.

##### Lokaler Referenzbestand

Pfad:

`resources/bpe-6-relationale-datenbanken`

Erfasster Bestand:

| Dateityp | Anzahl | Verwendung |
| --- | ---: | --- |
| Word-Dokumente | 169 | Kompetenzraster, Informationen, Aufgaben, Lösungen und Aktivitätsverfolgung |
| SQL-Skripte | 45 | Themen- und Syntaxabgleich; nicht automatisch öffentlich übernommen |
| MySQL-Workbench-Modelle | 27 | Abgleich der Modellierungsfolgen und Fallkontexte |
| Videos | 3 | lokale Normalisierungsmaterialien; nicht in die Homepage kopiert |
| Präsentation | 1 | lokale Lehrkraftquelle zur Normalisierung |
| Gesamt | 245 | Referenzbestand außerhalb der öffentlichen Ausgabe |

##### Didaktische Abbildung

| Lernfortschritt | Lokaler Materialkern | WorkbenchLab-Einheiten | Praktische Umgebung |
| --- | --- | --- | --- |
| L1 Eine Tabelle | Tabellenentwurf, eine Relation, Workbench-Generierung und Import, Projektion, Selektion, Funktionen, Gruppierung, INSERT, UPDATE, DELETE | L1.1 bis L1.10 | MySQL Workbench und Browser-SQL |
| L2 Mehrere Tabellen | Redundanzfreiheit, Entitäten, Beziehungen, Kardinalitäten, Fremdschlüssel, referentielle Integrität und Equi-Join | L2.1 bis L2.4 | Workbench EER Diagram und SQL Editor |
| L3 Transfer und 3NF | M:N-Auflösung, komplexere Modelle, Mehrtabellenauswertung und Prüfung der Dritten Normalform | L3.1 bis L3.3 | Workbench EER Diagram und SQL Editor |
| L4 Normalisierung | 1NF, 2NF, 3NF und vollständige Zerlegefolge | L4.1 | Heft, Workbench-Modell und Browserübung |
| L5 Massendaten | digitale Spuren, Big-Data-Merkmale, Risiken, Missbrauchsfälle und Nutzen | L5.1 bis L5.3 | fiktive Fallanalyse ohne private Schülerkonten |

##### Zuordnung der Einheiten

###### Lernfortschritt 1

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L1.1 | Warum Datenbanken | `L1_1 Information Tabellenentwurf`, `L1_1 Aufgabe Tabellenentwurf` |
| L1.2 | Relation und Schlüssel | `L1_1 Information Tabellenentwurf`, `L1_2.1 Information Datenbank modellieren` |
| L1.3 | eERM Grundlagen | `L1_2.1` und `L1_2.2 Information Datenbank modellieren` |
| L1.4 | Vom Modell zur Datenbank | `L1_3 Information Datenbank generieren`, `L1_4 Information Daten importieren` |
| L1.5 | SELECT und Projektion | `L1_5.1 Information und Aufgabe`, `L1_5.2 Vertiefungsaufgabe` |
| L1.6 | Selektion und Sortierung | `L1_5.3 Information und Aufgabe`, `L1_5.4 Vertiefungsaufgabe` |
| L1.7 | DISTINCT und Filtermuster | `L1_5.7 Information und Aufgabe Redundanzen in Abfrageergebnissen` |
| L1.8 | Funktionen und Gruppierung | `L1_5.5` und `L1_5.8 Information und Aufgaben` |
| L1.9 | Datum und Berechnungen | `L1_5.6 Information Datum Funktionen` und Vertiefungsaufgabe |
| L1.10 | Daten verwalten | `L1_6`, `L1_7` und `L1_8 Information und Aufgaben` |

###### Lernfortschritt 2

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L2.1 | Vom Sachtext zum ER-Modell | `L2_2.1 Information Datenbankmodell 2 Tabellen`, `L2_2.5 Information Datenmodellierung` |
| L2.2 | Kardinalitäten begründen | `L2_2.1 Information`, Modellierungsaufgaben zu Fahrlehrern und Mitarbeitenden |
| L2.3 | Fremdschlüssel und Integrität | `L2_3 Information und Aufgabe referentielle Integrität` |
| L2.4 | JOIN über mehrere Tabellen | `L2_2.3 Information und Aufgabe`, `L2_4 Aufgabe Datenbankabfragen n Tabellen` |

###### Lernfortschritt 3

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L3.1 | M:N als Beziehungsentität | `L3_1 Information M-N-Beziehung`, Modellierungsaufgaben L3_1.1 bis L3_1.6 |
| L3.2 | M:N-Daten auswerten | `L3_2.1` und `L3_2.2 Aufgaben Datenbankabfragen` |
| L3.3 | Redundanz und 3NF | `L3_3 Information 3NF`, Aufgaben L3_3.1 bis L3_3.5 |

###### Lernfortschritt 4

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L4.1 | Normalisierung 1NF bis 3NF | `L4_3 Information Übersicht Normalformen`, Aufgaben L4_1 bis L4_3 |

###### Lernfortschritt 5

| Code | Einheit | Zentrale lokale Unterlagen |
| --- | --- | --- |
| L5.1 | Digitale Spuren | `L5_1 Information und Aufgabe Digitale Spuren im Netz` |
| L5.2 | Big Data Merkmale, Chancen und Risiken | `L5_2 Information und Aufgabe`, Aufgaben L5_3 und L5_5 |
| L5.3 | Big Data begründet beurteilen | Material zu Risiken, Cambridge Analytica und Nutzen als historische Ausgangspunkte |

##### Abweichungen und redaktionelle Entscheidungen

- Private Konten, reale Standortverläufe oder persönliche Aktivitätsdaten der
  Lernenden werden nicht für Aufgaben benötigt. Frühere Selbstversuche aus den
  lokalen Materialien werden durch fiktive Fälle ersetzt.
- Historische Zahlen, Webseiten und Fallbeschreibungen aus den älteren
  Big-Data-Unterlagen werden nicht ungeprüft als aktuelle Fakten übernommen.
- MySQL Workbench bleibt das verbindliche Unterrichtswerkzeug. Das
  Browserlabor nutzt SQLite über `sql.js` und kennzeichnet deshalb
  Dialektunterschiede.
- Lösungen aus den lokalen Unterlagen werden nicht in die öffentliche
  Schülerausgabe kopiert. Automatische Prüfungen verwenden eigene kleine
  Datensätze und erwartete Ergebnisse.
- Die BPE6-Kerninhalte folgen dem Bildungsplan. `UPDATE`, `DELETE`, `HAVING`
  und die vollständige Folge 1NF bis 3NF sind didaktische Ergänzungen des
  Lernwegs.

##### Abschluss und Leistungsbezug

Eine Lerneinheit gilt im lokalen Stand 0.7.0 erst als abgeschlossen, wenn die
Schülerin oder der Schüler die fachlichen Arbeitsschritte abhakt, den
Verständnischeck besteht und die Lehrkraft das Lernprodukt bestätigt. Die XP
sind eine motivierende Dokumentation, aber kein manipulationssicheres
Notensystem. Für die mündliche oder kontinuierlich erbrachte Leistung bleibt
die pädagogische Bewertung der Lehrkraft maßgeblich.

Die Lerneinheiten werden sequenziell freigeschaltet. L1.1 enthält als erste
vollständig vertiefte Einheit ein digitales Aufgabenblatt und eigene
Lernnotizen. JSON-Dateien dokumentieren Kürzel, Klasse, Profilherkunft,
Exportgerät und Prüfsumme; sie unterstützen die Zuordnung, ersetzen aber keine
Lehrkraftbeobachtung oder kryptografisch signierte Abgabe.

##### Veröffentlichungsstatus

Die Matrix und der neue Lernpfad sind lokal. Es wurde weder gepusht noch eine
GitHub-Pages-Veröffentlichung ausgelöst. Die Browserprüfung ist erfolgt; vor
einer Veröffentlichung folgen der Test am Schul-PC und die ausdrückliche
Freigabe.

###### Lernstand und Identitaet (frueher: `documentation/LERNSTAND_UND_IDENTITAET.md`)

#### Lernstand und Identität

Stand: 20. September 2026

##### Schülerkürzel und Klasse

WorkbenchLab speichert keinen vollständigen Namen. Schülerinnen und Schüler
verwenden ein Kürzel aus drei Buchstaben des Vornamens, einem Punkt und drei
Buchstaben des Nachnamens, zum Beispiel `MIA.MUE` für Mia Müller. Umlaute und
ß werden automatisch in `AE`, `OE`, `UE` und `SS` umgeschrieben.

Zusätzlich ist die offizielle Klassenkurzform Pflicht, zum Beispiel `J1-1`
oder `WGJ1/1`. Kürzel und Klasse müssen innerhalb einer Lerngruppe eindeutig
zugeordnet werden. Bei Namensgleichheit legt die Lehrkraft gemeinsam mit den
Betroffenen ein abweichendes anonymisiertes Kürzel fest.

##### Profil, Herkunftsgerät und Exportgerät

WorkbenchLab verwendet getrennte zufällige IDs:

- `profileId` gehört zum Lernstand und bleibt bei Export und Import erhalten.
- `profileDeviceId` bezeichnet das Browserprofil, auf dem das Lernprofil
  erstmals angelegt wurde.
- `deviceId` bezeichnet das Browserprofil, auf dem der aktuelle Export
  erzeugt wurde.
- `exportId` bezeichnet genau eine Exportdatei.

Bei einem Import bleibt die Profilherkunft erhalten. Zusätzlich wird eine auf
zwölf Einträge begrenzte Übertragungshistorie mit Quell-Export, Quellgerät,
Zielgerät und Importzeitpunkt geführt. Damit ist erkennbar, wenn ein Lernstand
zwischen Browserprofilen übertragen wurde.

Alle Kennungen werden zufällig im Browser erzeugt. Sie sind keine amtlichen
oder hardwaregebundenen Identitätsmerkmale.

##### Warum MAC und IP nicht gespeichert werden

Eine statische Browserseite darf keine MAC-Adresse des PCs auslesen. Auch eine
lokale IP-Adresse ist in modernen Browsern nicht zuverlässig verfügbar. Eine
öffentliche IP-Adresse würde einen externen Dienst voraussetzen und wäre in
der Schule häufig nur die gemeinsame Routeradresse vieler Geräte.

WorkbenchLab täuscht diese Werte deshalb nicht vor. Im Export stehen
`macAddress` und `ipAddress` auf `null` sowie eine verständliche technische
Erläuterung. Als zusätzliche Plausibilitätsdaten werden nur Plattform,
Browsersprache, Zeitzone, Bildschirmformat und Seitenursprung aufgenommen.

##### JSON-Format 3

Eine Sicherung enthält lesbare Identitäts-, Export- und Integritätsdaten:

```json
{
  "app": "WorkbenchLab",
  "formatVersion": 3,
  "appVersion": "0.7.0-local",
  "exportedAt": "2026-09-20T12:00:00.000Z",
  "exportId": "export_...",
  "identity": {
    "studentCode": "MIA.MUE",
    "studentClass": "WGJ1/1",
    "profileId": "profile_...",
    "profileOriginDeviceId": "device_...",
    "deviceId": "device_...",
    "deviceCode": "E5F6G7H8",
    "environment": {
      "platform": "Win32",
      "language": "de-DE",
      "timezone": "Europe/Berlin",
      "screen": "1920x1080x24"
    },
    "networkIdentifiers": {
      "macAddress": null,
      "ipAddress": null
    }
  },
  "summary": {
    "xp": 240,
    "completedLessons": 4,
    "completedTasks": 7
  },
  "data": {},
  "integrity": {
    "algorithm": "SHA-256",
    "digest": "..."
  }
}
```

Die SHA-256-Prüfsumme umfasst den vollständigen Export ohne den
`integrity`-Block. Beim Import wird sie vor der Übernahme kontrolliert.
Beschädigte oder ohne Neuberechnung veränderte Dateien werden abgelehnt.

##### Sicherheitsgrenze der Prüfsumme

Eine Prüfsumme ist keine digitale Signatur. Der Quellcode einer statischen
Website ist öffentlich; eine technisch versierte Person könnte Daten verändern
und anschließend selbst eine neue Prüfsumme erzeugen. Das Format verbessert
Nachvollziehbarkeit und Fehlererkennung, beweist aber nicht allein die
Urheberschaft.

Ein stärkerer Nachweis benötigt einen geheimen Lehrkraft-Schlüssel oder ein
authentifiziertes Backend, das Exporte serverseitig signiert. Ein solcher
Ausbau muss datenschutzkonform geplant werden und darf keine geheimen Schlüssel
im Browser ausliefern.

##### Einsatz durch die Lehrkraft

Für eine plausible Zuordnung werden gemeinsam betrachtet:

- Schülerkürzel und Klasse
- Profilcode und Profilherkunft
- Exportgerät und Exportzeitpunkt
- gültige Prüfsumme
- Übertragungshistorie
- sichtbare Arbeit im Unterricht
- erstellte SQL-, Workbench- und Modellierungsprodukte
- kurze fachliche Erläuterung durch die Schülerin oder den Schüler

XP und JSON-Datei unterstützen die Dokumentation, sind aber keine alleinige
Grundlage für eine Note.

##### Kompatibilität

Sicherungen mit `formatVersion: 1` und `formatVersion: 2` bleiben importierbar.
Sie besitzen keine SHA-256-Prüfsumme. Fehlen Kürzel oder Klasse, fordert
WorkbenchLab diese Angaben nach dem Import einmalig an.

###### SQL-Feedback und optionale KI (frueher: `documentation/SQL_FEEDBACK_UND_KI.md`)

#### SQL-Feedback und optionale KI

Stand: 18. Juni 2026

##### Umgesetzter Stand

Version 0.5.0 verwendet bewusst einen lokalen SQL-Coach. SQL-Code, Profil und
Lernstand verlassen den Browser nicht. Die Rückmeldung basiert auf der echten
Ausführung in `sql.js`, den geforderten Aufgabenbestandteilen und einem
Vergleich mit der erwarteten Ergebnismenge.

Der Coach darf Tipps geben. XP werden weiterhin ausschließlich durch die
deterministische Aufgabenprüfung vergeben. Für eine Note bleibt die
pädagogische Bewertung durch die Lehrkraft maßgeblich.

##### Warum kein API-Schlüssel im Browser liegt

WorkbenchLab wird statisch über GitHub Pages ausgeliefert. Jeder Schlüssel in
JavaScript wäre für Besucher einsehbar und könnte missbraucht werden. Eine
externe KI darf daher nur über ein serverseitiges Gateway angesprochen werden,
das den Schlüssel als Secret verwaltet, Anfragen begrenzt und Eingaben
minimiert.

##### Geprüfte kostenlose Optionen

Die folgenden Angaben wurden am 18. Juni 2026 anhand der offiziellen
Anbieterdokumentation geprüft und können sich ändern:

- [Google Gemini Developer API](https://ai.google.dev/gemini-api/docs/pricing):
  kostenloses Kontingent vorhanden; Inhalte des Free Tier können laut
  Preisseite zur Produktverbesserung verwendet werden. Für Schülercode und
  Leistungsbezug ist das ohne zusätzliche schulische Prüfung keine gute
  Voreinstellung.
- [Groq API](https://console.groq.com/docs/rate-limits): Free-Plan mit
  modellabhängigen Tages- und Minutenlimits. Auch hier muss der Schlüssel
  serverseitig liegen und die schulische Datenschutzfreigabe vorliegen.
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/):
  laut Preisseite 10.000 Neurons pro Tag kostenfrei. Ein Worker eignet sich
  technisch als Gateway vor GitHub Pages, benötigt aber Konto, Secret,
  Missbrauchsschutz und eine schulische Datenschutzentscheidung.

##### Empfohlene Zielarchitektur

1. WorkbenchLab sendet nur Aufgaben-ID, Schemaausschnitt und SQL-Entwurf.
2. Name, XP, Lernstand und Browser-ID werden nie übertragen.
3. Ein Cloudflare Worker oder eigener Schulserver hält den API-Schlüssel.
4. Das Gateway setzt Rate Limits, maximale Eingabelänge und feste Prompts.
5. Das Modell liefert nur strukturiertes Feedback mit Hinweis und Begründung.
6. Die lokale Prüfung entscheidet weiterhin über richtig oder falsch.
7. Externe Rückmeldung wird als KI-Hinweis gekennzeichnet und protokolliert
   keine personenbezogenen Daten.

Vor einer Aktivierung sind Anbieterbedingungen, Auftragsverarbeitung,
Speicherorte, Löschfristen sowie die schulischen Vorgaben zum Einsatz
generativer KI zu prüfen. Bis dahin ist der lokale Coach die robuste und
datensparsame Lösung.

###### Technik und Didaktik (frueher: `documentation/TECHNIK_UND_DIDAKTIK.md`)

#### Technik und Didaktik

Stand: 18. Juni 2026

##### Didaktisches Modell

WorkbenchLab folgt einem wiederholbaren Lernzyklus:

1. Ein Begriff oder Verfahren wird kurz erklärt.
2. Ein kleines Beispiel macht die Denkweise sichtbar.
3. Ein Verständnischeck sichert den Kern.
4. Eine Übung prüft die Anwendung.
5. XP und Erfolge geben Rückmeldung über kontinuierliches Arbeiten.

Die Inhalte sind bewusst in kleine Lernschritte geteilt, weil BPE6 fachlich
dicht ist. Modellierung und SQL werden nicht getrennt behandelt: Jede
SQL-Abfrage verweist auf das zugrunde liegende Datenmodell.

##### SQL im Browser

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

##### Lernstand

Der Lernstand liegt im `localStorage` unter `workbenchlab-v1` und enthält:

- anonymisiertes Schülerkürzel im Format `ABC.DEF`
- portable Profil-ID
- abgeschlossene Lektionen
- gelöste Übungen
- gelöste Befehls-Miniaufgaben
- SQL-Entwürfe
- Slot-Antworten
- Aktivitätstage
- zuletzt geöffnete Lektion

Export und Import verwenden ein JSON-Format mit `app: "WorkbenchLab"` und
`formatVersion: 2`. Der Export ergänzt eine zufällige Export-ID, die App-Version,
einen Zeitstempel und eine lokale Browser-/Geräte-ID. Die Profil-ID wird beim
Import übernommen; die Geräte-ID des Zielbrowsers bleibt unverändert. Dateien
mit `formatVersion: 1` können weiterhin geladen werden und verlangen danach
einmalig ein gültiges Schülerkürzel.

Die IDs erleichtern die organisatorische Zuordnung, sind aber weder
Hardware-Fingerprinting noch ein manipulationssicherer Leistungsnachweis.
Details stehen in `docs/LERNSTAND_UND_IDENTITAET.md`.

##### Leistungsbewertung

XP und Erfolge können sichtbar machen, dass regelmäßig geübt wurde. Sie sind
für die kontinuierlich erbrachte Leistung hilfreich, aber nicht alleinige
Notengrundlage. Sinnvoll ist eine Kombination aus:

- beobachteter Mitarbeit
- kurzen mündlichen Erklärungen
- WorkbenchLab-Lernstand
- SQL-/Modellierungsprodukten aus dem Unterricht
- Reflexion oder Portfolio

##### Barrierearmut und Bedienung

- semantische Buttons und Formulare
- Tastaturbedienung für Karten
- sichtbare Fokuszustände
- responsive Layouts
- Export/Import für Gerätewechsel
- Light- und Dark-Mode

##### Bildsprache

Fotorealistische Unterrichtsmotive schaffen Kontext auf Übersicht, eERM- und
SQL-Einstieg. Die eigentlichen ERM/eERM-Modelle bleiben HTML/CSS-basiert, weil
Kardinalitäten, Schlüssel und Attribute dort scharf, responsiv, zugänglich und
automatisch prüfbar sind. Herkunft und Prompts sind unter
`docs/BILDSPRACHE_UND_ASSETS.md` dokumentiert.

##### Veröffentlichungsentscheidung

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

###### Bisherige Taskliste (frueher: `TASKS.md`)

#### WorkbenchLab Tasks und Projektstand

Stand: 20. September 2026

Lokaler Entwicklungsstand: 0.7.0-local

Veröffentlichter Stand: 0.5.0

##### Leitentscheidung

WorkbenchLab wird als eigenes öffentliches Lernportal aufgebaut. Die lokalen
BPE6-Originalmaterialien dienen als fachliche Referenz, werden aber nicht
ungeprüft veröffentlicht. Öffentliche Inhalte werden eigenständig formuliert
und als interaktive Lernmodule umgesetzt.

##### Erledigt

- 2026-09-20: Version `0.7.0-local` mit Dark Mode als Standard, Pflichtfeld
  Klasse und überarbeitetem Profil-Dialog umgesetzt.
- 2026-09-20: JSON-Format 3 mit Profilherkunft, aktuellem Exportgerät,
  Übertragungshistorie, Geräteumgebung und SHA-256-Prüfsumme ergänzt; MAC- und
  IP-Grenzen transparent dokumentiert.
- 2026-09-20: Sequenzielle Freischaltung über alle 21 Einheiten umgesetzt;
  direkte Lektions- und Übungslinks beachten dieselbe Sperre.
- 2026-09-20: `AltGr + S` blendet einen sitzungsbezogenen Entwicklerschalter
  ein, der alle Einheiten zur Vorschau öffnet, ohne Abschlüsse zu vergeben.
- 2026-09-20: Zweistufiges Lernpfad-Menü mit L1 bis L5, Lektionsuntermenüs,
  Sperrstatus und Breadcrumbs umgesetzt.
- 2026-09-20: L1.1 aus Information, Aufgabe und Vorlage vollständig als
  Weblektion mit Definitionen, Datentypen, eigener Illustration, digitalem
  Tabellenentwurf und Lernnotizen integriert.
- 2026-09-20: Alle 21 Lektions- und 27 Übungsrouten erneut im Browser geprüft;
  Dark Mode, Sperrkette, Entwicklermodus, lokale Eingabepersistenz und
  Freischaltung von L1.2 erfolgreich getestet; keine Konsolenfehler.
- 2026-09-20: Mobile Profilansicht bei 390 × 844 und Desktopansicht bei
  1440 × 1000 visuell geprüft; keine Überlagerung der Dialogfelder und Buttons.
- 2026-09-20: Ausführliche, zentrale `documentation.md` mit Versionen,
  Entscheidungen, erledigten und offenen Aufgaben angelegt.

- 2026-09-20: Excel-Lab als Referenz für Startseite, Lernpfad,
  Unterrichtseinheiten und lehrkraftbestätigten Abschluss ausgewertet.
- 2026-09-20: Lokalen BPE6-Bestand mit 245 Dateien strukturiert erfasst:
  169 DOCX, 45 SQL-Skripte, 27 Workbench-Modelle, drei Videos und eine
  Präsentation.
- 2026-09-20: Kompetenzraster und Ich-kann-Listen erneut ausgewertet und den
  fünf Lernfortschritten zugeordnet.
- 2026-09-20: Die vorhandenen Lektionen in fünf quellennahen Lernfortschritten
  neu geordnet und um zwei Einheiten zu digitalen Spuren und begründeter
  Big-Data-Bewertung erweitert.
- 2026-09-20: Alle 21 Einheiten um einen integrierten Arbeitsauftrag für
  Browser, Heft oder MySQL Workbench, ein konkretes Lernprodukt,
  Abschlusskriterien und Materialbezug ergänzt.
- 2026-09-20: Lektionsabschluss auf Selbstkontrolle, Verständnischeck und
  Lehrkraftbestätigung umgestellt; ältere gespeicherte Abschlüsse bleiben
  gültig.
- 2026-09-20: SQL-Labor um automatisch prüfbare Aufgaben für `CREATE TABLE`,
  `UPDATE` und `DELETE` erweitert; insgesamt 27 Übungen im lokalen Stand.
- 2026-09-20: Schülerbezogene Selbstversuche mit privaten Konten aus dem
  Big-Data-Pfad entfernt und durch fiktive, datensparsame Fallanalysen ersetzt.
- 2026-09-20: Materialmatrix und Veröffentlichungsstatus dokumentiert; noch
  kein Push und keine Änderung der Live-Seite.
- 2026-09-20: Alle 21 Lektionsrouten, 13 SQL-Aufgaben und 14 weitere
  Übungstypen automatisiert im Browser erfolgreich geprüft; keine Konsolen-
  oder Seitenfehler.
- 2026-09-20: Lernpfad bei 1440 Pixeln und die vollständige Lektionsansicht bei
  390 Pixeln visuell geprüft; mobiler horizontaler Überlauf 0 Pixel.

- 2026-06-18: PythonLab-Struktur analysiert und passende Architektur für
  WorkbenchLab übernommen.
- 2026-06-18: Bildungsplan BPE6 online und lokal abgeglichen.
- 2026-06-18: Kompetenzraster und Ich-kann-Listen der Lernfortschritte 1 bis 5
  ausgewertet.
- 2026-06-18: Statische Single-Page-App mit Navigation, Lernpfad, Profil,
  XP-System, Erfolgen, Light-/Dark-Mode und Sicherungsdialog erstellt.
- 2026-06-18: 13 BPE6-Lektionen erstellt.
- 2026-06-18: 13 prüfbare Übungen erstellt.
- 2026-06-18: Browser-SQL-Labor mit `sql.js` integriert.
- 2026-06-18: Zwei eigene Fahrschul-Übungsdatenbanken für Browser-Training
  erstellt.
- 2026-06-18: SQL-Prüfungen für SELECT, WHERE, ORDER BY, GROUP BY, HAVING,
  INSERT und JOIN umgesetzt.
- 2026-06-18: Modellierungsübungen zu Kardinalitäten, Fremdschlüsseln,
  Normalformen und Big Data erstellt.
- 2026-06-18: Befehlsbereich mit 12 SQL-Syntaxkarten und Miniaufgaben erstellt.
- 2026-06-18: Nachschlagebereich mit Bildungsplan, Landesbildungsserver,
  Informatik-Stick und MySQL-Workbench-Hinweisen erstellt.
- 2026-06-18: `resources/` per `.gitignore` vom öffentlichen Repository
  ausgeschlossen.
- 2026-06-18: GitHub-Pages-Workflow vorbereitet.
- 2026-06-18: Lucide und `sql.js` lokal unter `vendor/` eingebunden, damit die
  App ohne externe CDN-Laufzeitabhängigkeit startet.
- 2026-06-18: Öffentliches Repository
  `https://github.com/JakobSawazki/WorkbenchLab` erstellt und `main` gepusht.
- 2026-06-18: GitHub Pages über Actions aktiviert und erfolgreich unter
  `https://jakobsawazki.github.io/WorkbenchLab/` veröffentlicht.
- 2026-06-18: Alle 13 Übungen, 13 Lektionsquizze und 12 Befehls-Miniaufgaben
  automatisiert im Browser erfolgreich geprüft.
- 2026-06-18: Desktop- und Mobilansicht geprüft; kein horizontales Überlaufen
  bei 390 Pixeln und keine Browser-Konsolenfehler.
- 2026-06-18: Live-SQL-Aufgabe direkt auf GitHub Pages erfolgreich ausgeführt.
- 2026-06-18: Version 0.2.0 mit drei neuen Lektionen zu Workbench-Ablauf,
  flexiblen SQL-Filtern und Datumsfunktionen ausgebaut.
- 2026-06-18: Vier neue Übungen für Workbench-Reihenfolge, `DISTINCT`,
  `LIKE`-Muster und `YEAR`/`MONTH` ergänzt und im Browser erfolgreich geprüft.
- 2026-06-18: Befehlsbibliothek auf 15 Karten erweitert: `SELECT DISTINCT`,
  `LIKE`/`IN`/`BETWEEN` sowie `CREATE DATABASE`/`USE`.
- 2026-06-18: Screenshots im Nachschlagebereich durch drei eigenständige,
  responsive Illustrationen und eine Vier-Schritt-Startstrecke ersetzt.
- 2026-06-18: Kurzreferenz um Parent/Child, Auto Increment, `DISTINCT` und
  flexible Filtermuster ergänzt.
- 2026-06-18: Inhaltsbeziehungen für 16 Lektionen, 17 Übungen, 15 Befehle und
  12 Erfolge maschinell auf Vollständigkeit geprüft.
- 2026-06-18: Vollständiger Browser-Regressionstest für 16 Lektionsquizze,
  17 Übungen und 15 Befehls-Miniaufgaben erfolgreich; keine Konsolenfehler.
- 2026-06-18: Neue Nachschlagen-Seite bei 1440 und 390 Pixeln geprüft und
  dokumentiert; kein horizontaler Überlauf, keine abgeschnittenen Grafiken.
- 2026-06-18: Version 0.3.0 um ein eigenes Modul `eERM modellieren` mit drei
  vertiefenden Lektionen und dem bestehenden Workbench-Ablauf erweitert.
- 2026-06-18: Sachtextanalyse, Rollen/Ereignisse, Zwei-Satz-Methode,
  Optionalität und M:N-Auflösung didaktisch neu aufbereitet.
- 2026-06-18: Neuer interaktiver Diagramm-Aufgabentyp mit Entity-Kästen,
  Beziehungslinien, Kardinalitäts- und Fremdschlüsselauswahl implementiert.
- 2026-06-18: Zwei konkrete eERM-Diagrammaufgaben zu Fahrradvermietung und
  schulischen Bildungsangeboten ergänzt.
- 2026-06-18: Normalisiertes Fahrradvermietungs-Schema und Drei-Tabellen-
  SQL-Aufgabe mit `JOIN` und `DATEDIFF` ergänzt.
- 2026-06-18: Schlüsselbibliothek um `PRIMARY KEY`/`AUTO_INCREMENT` und
  `FOREIGN KEY`/`REFERENCES` erweitert.
- 2026-06-18: Vollständiger Browser-Regressionstest für 19 Lektionsquizze,
  22 Übungen und 17 Befehls-Miniaufgaben erfolgreich; keine Konsolenfehler.
- 2026-06-18: eERM-Diagramme bei 1440 und 390 Pixeln geprüft; mobile
  Beziehungskette ohne horizontalen Überlauf oder abgeschnittene Felder.
- 2026-06-18: Version 0.4.0 mit drei eigens generierten, fotorealistischen
  Unterrichtsmotiven für Übersicht, eERM-Werkstatt und SQL-Labor gestaltet.
- 2026-06-18: Fachdiagramme bewusst als zugängliche HTML/CSS-Modelle
  beibehalten; Fotos dienen dem Kontext und ersetzen keine prüfbare Notation.
- 2026-06-18: Lokalen SQL-Coach mit Coach-Tipp, Kriteriencheck,
  Ergebnisvergleich, Sortierungsdiagnose und didaktisch übersetzten
  Fehlermeldungen implementiert.
- 2026-06-18: Kostenlose KI-API-Optionen geprüft und eine serverseitige,
  datensparsame Zielarchitektur dokumentiert; keine Schlüssel im Browser.
- 2026-06-18: SQL-Coach mit korrekter Lösung, falscher Sortierung und
  Syntaxfehler geprüft; alle zehn SQL-Aufgaben bestehen weiterhin ihre
  deterministische XP-Prüfung.
- 2026-06-18: Neue Bildbereiche und SQL-Coach bei 1440 und 390 Pixeln geprüft;
  alle Bilder geladen, kein horizontaler Überlauf, keine Konsolenfehler.
- 2026-06-18: Version 0.5.0 mit verbindlichem anonymisiertem Schülerkürzel im
  Format `ABC.DEF`, verständlicher Eingabehilfe und klarer Fehlermeldung
  umgesetzt.
- 2026-06-18: Überlappung zwischen Fokusrahmen des Profilfelds und den
  Dialogbuttons beseitigt; Dialog für Desktop und Mobilansicht überarbeitet.
- 2026-06-18: JSON-Sicherung auf Format 2 erweitert: Schülerkürzel, portable
  Profil-ID, lokaler Browser-/Gerätecode, Export-ID, App-Version, Zeitstempel
  und kompakte Fortschrittszusammenfassung.
- 2026-06-18: Import übernimmt die Profil-ID, aber niemals die Geräte-ID des
  Quellgeräts; Sicherungen im bisherigen Format 1 bleiben importierbar.
- 2026-06-18: Datenschutzgrenzen der lokalen Identitäten und Einsatzhinweise
  für die Leistungsbewertung dokumentiert.

##### Offen Priorisiert

1. L1.2 anhand der zugehörigen Informations-, Aufgaben- und Vorlagendateien
   in derselben Tiefe wie L1.1 ausarbeiten.
2. Anschließend L1.3 bis L5.3 schrittweise mit direkt ausfüllbaren,
   quellennahen Arbeitsblättern ergänzen.
3. Den lokalen Stand zusätzlich mit einem Screenreader-Stichprobentest
   abnehmen.
4. Die neuen Workbench-Aufträge an einem Schul-PC mit Informatik-Stick,
   MySQL-Dienst und der tatsächlich eingesetzten Workbench-Version erproben.
5. Browserprüfung mit echten Schüler-Workflows im Unterricht durchführen.
6. Workbench-Pfad um Reverse Engineering, Modellversionen und typische
   Fehlermeldungen beim Verbindungsaufbau erweitern.
7. eERM-Werkstatt um freie Drag-and-Drop-Modelle und eine differenzierte
   Plausibilitätsrückmeldung für mehrere richtige Modellvarianten erweitern.
8. Normalisierung mit mehrstufigen Zerlege-Aufgaben erweitern.
9. Abitur-Training mit gemischten Modellierungs- und SQL-Aufgaben ergänzen.
10. Lehrkraftansicht planen: mehrere JSON-Lernstände anhand Schüler-, Klassen-,
   Profil- und Gerätecode sowie Prüfsummenstatus zusammenführen.
11. Belastbaren Abgabenachweis über Lehrkraft-Code oder serverseitige Signatur
   datenschutzkonform konzipieren.
12. Erst nach ausdrücklicher lokaler Freigabe Version 0.7.0 festschreiben,
   committen, pushen und GitHub Pages prüfen.

##### Ideen

- Aufgabenserien nach BPE6.1 bis BPE6.5 filterbar machen.
- Freies SQL-Labor mit auswählbarem Schema und Aufgaben-Historie ergänzen.
- JSON-Portfolio für Schülerinnen und Schüler mit Reflexionsfeldern.
- Kleine Diagnosetests vor jeder Unterrichtsstunde.
- SQL-Coach anhand anonymisierter Fehlversuche aus dem Unterricht weiter
  verfeinern.
- MySQL-spezifische Unterschiede zu SQLite als Warnkarten anzeigen.
- Druckbares Kompetenzraster aus dem aktuellen Lernstand erzeugen.
- Optionales Backend nur datenschutzkonform und nicht mit offenem API-Key im
  Browser.

##### Arbeitsregeln

- `resources/` bleibt lokal und wird nicht veröffentlicht.
- Lösungen aus den Originalmaterialien nicht direkt in öffentliche Dateien
  kopieren.
- Neue öffentliche Inhalte eigenständig formulieren.
- Inhaltliche Daten bevorzugt in `content.js` pflegen.
- Lernstandsänderungen immer in Normalisierung, Export/Import und README
  nachziehen.
- `documentation.md` ist der verbindliche ausführliche Projektstand; diese
  Datei bleibt die kompakte Arbeitsliste.
- Vor Veröffentlichung mindestens ausführen:
  - `node --check app.js`
  - `node --check content.js`
  - `git diff --check`
  - Desktop- und Mobilansicht im Browser prüfen
  - SQL-Labor mit mindestens einer SELECT-, GROUP-BY-, INSERT- und JOIN-Aufgabe
    testen

###### Bisherige Uebergabe (frueher: `UEBERGABE_Codex.md`)

#### Übergabe WorkbenchLab

Stand: 20. September 2026

Lokaler Entwicklungsstand: 0.7.0-local

Live-Version: 0.5.0

Live: `https://jakobsawazki.github.io/WorkbenchLab/`

Repository: `https://github.com/JakobSawazki/WorkbenchLab`

##### Projektziel

WorkbenchLab ist die Datenbank-Schwester von PythonLab. Es soll Schülerinnen
und Schüler in J1 durch BPE6 Relationale Datenbanken führen und kontinuierliche
Übungsleistung sichtbar machen.

##### Wichtige Pfade

- Projekt: `G:\Meine Ablage\Codex\WorkbenchLab`
- Lokale BPE6-Materialien:
  `G:\Meine Ablage\Codex\WorkbenchLab\resources\bpe-6-relationale-datenbanken`
- Bildungsplan-PDF:
  `G:\Meine Ablage\Codex\WorkbenchLab\resources\29-TB02-Inhalt-Band 2a-AG-3 Informatik.pdf`

##### Aktueller Stand

Der lokale Entwicklungsstand erweitert die bisherige App um einen
Excel-Lab-ähnlichen Unterrichtsablauf. `learning-path.js` ordnet die Inhalte in
die fünf Lernfortschritte des lokalen Kompetenzrasters ein. Alle 21 Einheiten
enthalten nun integrierte Informationsabschnitte, einen konkreten Arbeitsauftrag
für Browser, Heft oder MySQL Workbench, ein Lernprodukt, Quellenhinweise und
Abschlusskriterien. Lektions-XP werden erst nach Selbstkontrolle, bestandenem
Verständnischeck und Lehrkraftbestätigung vergeben.

Version 0.7.0 ergänzt eine verbindliche Reihenfolge: Zu Beginn ist nur L1.1
offen, jede abgeschlossene Einheit schaltet genau die nächste frei. Das
zweistufige Lernpfad-Menü zeigt L1 bis L5 und alle zugehörigen Einheiten. Über
`AltGr + S` wird ein sitzungsbezogener Entwicklerschalter eingeblendet, der
alle Einheiten für die Unterrichtsvorbereitung öffnet, ohne Fortschritt zu
verändern. Dark Mode ist jetzt der Standard.

L1.1 ist vollständig aus Information, Aufgabe und Vorlage neu aufbereitet. Die
Lektion enthält vier Fachdefinitionen, sechs MySQL-Datentypen, eine eigene
Kontaktkarten-Illustration, ein direkt ausfüllbares Tabellenentwurfsblatt und
lokal gespeicherte eigene Notizen.

Das SQL-Labor enthält im lokalen Stand 27 Übungen. Neu hinzugekommen sind
ausführbare und automatisch prüfbare Aufgaben für `CREATE TABLE`, `UPDATE` und
`DELETE`. Zwei zusätzliche Einheiten behandeln digitale Spuren und eine
begründete Big-Data-Fallanalyse, ohne private Schülerkonten oder reale
Standortverläufe einzubeziehen.

Dieser Stand wurde noch nicht zu GitHub übertragen. Die Live-Seite bleibt bis
zur ausdrücklichen Freigabe unverändert auf Version 0.5.0.

Die lokale Browserregression vom 20. September 2026 umfasst alle 21
Lektionsseiten und alle 27 Übungen. Desktop- und Mobilansicht wurden mit 1440
beziehungsweise 390 Pixeln geprüft. Dark-Mode-Start, Sperrkette,
Entwicklermodus, L1.1-Persistenz und Profil-Dialog wurden zusätzlich geprüft;
es traten keine Konsolenfehler auf.

Die erste lauffähige Version ist als statische App umgesetzt:

- `index.html`
- `styles.css`
- `content.js`
- `learning-path.js`
- `app.js`

Die App enthält Lernpfad, SQL-Labor, Modellierungsübungen, Befehle,
Nachschlagen, Erfolge, lokale Lernstandsicherung und Theme-Schalter.

Version 0.5.0 umfasst 19 Lektionen, 22 Übungen und 17 SQL-Befehlskarten. Das
eigene Modul `eERM modellieren` führt vom Sachtext über Kardinalitäten zur
M:N-Auflösung. Zwei interaktive Diagrammaufgaben prüfen Kardinalitäten und
Fremdschlüssel direkt im Modell. Eine dritte Übungsdatenbank verbindet die
Fahrradvermietungs-Modellierung mit einer Drei-Tabellen-SQL-Abfrage.

Eine fotorealistische, eigens generierte Bildserie rahmt die Lernbereiche,
während Fachdiagramme weiterhin präzise und interaktiv in HTML/CSS bleiben.
Der lokale SQL-Coach übersetzt Fehler, prüft Aufgabenbestandteile und vergleicht
Ergebnismengen, ohne Schülercode an einen externen Dienst zu senden.

Das lokale Lernprofil verwendet ein anonymisiertes Schülerkürzel im Format
`ABC.DEF` und eine verpflichtende Klassenkurzform. JSON-Sicherungen enthalten
Profilherkunft, aktuelles Exportgerät, eine begrenzte Übertragungshistorie und
eine SHA-256-Prüfsumme. Das Exportformat ist Version 3; Dateien der Versionen 1
und 2 werden weiterhin angenommen. MAC- und IP-Adressen werden nicht
vorgetäuscht, weil eine statische Browserseite sie nicht zuverlässig ermitteln
kann. Eine Prüfsumme erkennt Änderungen, ist aber keine geheime Signatur.

Die ausführliche Historie, Sicherheitsgrenzen, Prüfprotokolle und offene
Aufgaben stehen zentral in `documentation.md`.

##### Didaktische Struktur

Die Struktur folgt den lokalen Ich-kann-Listen:

1. Datenbanknotwendigkeit, eine Tabelle, Primärschlüssel
2. eERM und Relationenmodell einschließlich Sachtextanalyse, Optionalität,
   Parent/Child und Beziehungsentitäten
3. SQL über eine Tabelle einschließlich `DISTINCT`, `LIKE`, `IN`, `BETWEEN`
   und Datumsfunktionen
4. Datenpflege mit INSERT/UPDATE/DELETE-Grundlogik
5. mehrere Tabellen, Fremdschlüssel, referentielle Integrität
6. JOIN und M:N-Auflösung
7. Redundanz, 3NF, Normalisierung
8. Big Data

##### Technische Hinweise

- Browser-SQL nutzt die lokal unter `vendor/` eingebundene `sql.js`-Version.
- Die SQL-Schemata stehen in `content.js`.
- MySQL-Funktionen `YEAR`, `MONTH`, `NOW` und `DATEDIFF` werden im Browser nachgebildet.
- Für Unterrichtsskripte bleibt MySQL Workbench verbindlich.
- Der SQL-Coach arbeitet vollständig im Browser; eine KI-API ist nicht aktiv.
- Ein späteres KI-Gateway darf keine Schlüssel im Frontend enthalten und nicht
  allein über XP oder Leistungsbewertung entscheiden.
- `resources/` ist per `.gitignore` ausgeschlossen.

##### Nächste sinnvolle Schritte

1. L1.2 und danach die weiteren Einheiten so tief wie L1.1 ausarbeiten.
2. Die Workbench-Arbeitsaufträge an einem Schul-PC mit Informatik-Stick testen.
3. Einen Screenreader-Stichprobentest durchführen.
4. Lehrkraftansicht und signierten Abgabenachweis konzipieren.
5. Schülerfeedback aus dem ersten Unterrichtseinsatz dokumentieren.
6. eERM-Interaktion zu freien Drag-and-Drop-Modellen erweitern.
7. Erst nach Freigabe Version 0.7.0 veröffentlichen und die Live-Seite prüfen.

###### BPE6-Quellenentscheidung (frueher: `references/bpe6/README.md`)

#### BPE6-Quellen und Integrationsentscheidung

Stand: 18. Juni 2026

##### Lokale Quelle

Die BPE6-Materialien liegen lokal unter:

`G:\Meine Ablage\Codex\WorkbenchLab\resources\bpe-6-relationale-datenbanken`

Diese Ablage enthält Informationsblätter, Aufgaben, Lösungen, SQL-Skripte,
MySQL-Workbench-Modelle, Kompetenzraster und Ich-kann-Listen.

##### Öffentliche Quellen

- Bildungsplan: <https://bildungsplaene-bw.de/,Lde/In_OS_nichtTG>
- Materialübersicht: <https://www.schule-bw.de/faecher-und-schularten/mathematisch-naturwissenschaftliche-faecher/informatik/material/materialien-zum-neuen-bildungsplan-informatik-an-den-nichtgewerblichen-beruflichen-gymnasien>
- Informatik-Stick / Schultasche-BW: <https://schultasche-bw.de/>

##### Entscheidung

Die Originalmaterialien werden nicht direkt veröffentlicht. WorkbenchLab nutzt
sie als didaktische und fachliche Referenz. Öffentliche Inhalte werden:

- in eigener Sprache formuliert
- in interaktive Übungen übertragen
- mit eigenen kleinen Beispieldaten versehen
- transparent auf Bildungsplan und Landesbildungsserver verlinkt

Musterlösungen und originale Arbeitsblätter bleiben lokal.

###### BPE6-Materialmanifest (frueher: `references/bpe6/MANIFEST.md`)

#### BPE6 Lokales Manifest

Stand: 20. September 2026

Erfasster Umfang: 245 Dateien, darunter 169 DOCX, 45 SQL-Skripte, 27
MySQL-Workbench-Modelle, drei Videos und eine Präsentation.

Nicht öffentlich zu veröffentlichender lokaler Referenzbestand:

- `resources/29-TB02-Inhalt-Band 2a-AG-3 Informatik.pdf`
- `resources/bpe-6-relationale-datenbanken/Kompetenzraster_Datenbank.docx`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 1`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 2`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 3`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 4`
- `resources/bpe-6-relationale-datenbanken/Lernfortschritt 5`

Öffentlich nutzbar sind nur eigenständig formulierte Ableitungen in
`content.js`, Dokumentation und App-Texten.
