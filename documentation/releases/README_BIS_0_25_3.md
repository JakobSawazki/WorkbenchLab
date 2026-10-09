# Frühere README-Abschnitte (bis Release 0.25.3)

Archiviert von Claude am 9. Oktober 2026 beim Neufassen der README. Der Wortlaut ist unverändert;
nur die Verweise auf Dateien wurden an den neuen Ort angepasst. Verfasser der Abschnitte: Codex.

**Schmalere Profilanzeige:** [Release 0.25.1](RELEASE_0_25_1.md) reduziert die Mindestbreite des Profilbuttons; Name, Klasse und XP bleiben erhalten.

**Grundfunktionen:** [Abnahme des bisherigen Stands](ABNAHME_0_22_3.md).

**Neue praktische Übungen:** [Release 0.23.0](RELEASE_0_23_0.md)
ergänzt drei SQL-Aufgaben und zwei Diagrammaufgaben. Eigene SQL-Entwürfe können
direkt als Datei für Workbench heruntergeladen werden. INSERT, UPDATE und
DELETE prüfen zusätzlich, dass unbeteiligte Datensätze erhalten bleiben.

**Unterrichtsablauf:** Alle 21 Einheiten enthalten Informationen, ausfüllbare
Aufgaben, Browserübungen und anschließend einen eigenen Praxisauftrag in
MySQL Workbench. SQL und ER-/EER-Modelle werden bereits in L1.1 und L1.2
praktisch eingesetzt. Ergänzende SQL-Downloads enthalten nur fiktive
Übungsdaten. Eine neue fotorealistische Alpenkarte zeigt den Lernweg vom
Dorf zur Stadt; Markierungen, Notizen und Zeichnungen begleiten die Einheiten.
Der Lernstand lässt sich über das Diskettensymbol als JSON sichern und laden.
Ein Aufruf von `127.0.0.1` funktioniert nur auf dem jeweiligen Rechner. Vor
dem Einsatz an Schüler-PCs ist ein Test mit dem Informatik-Stick nötig. Die
Schüleroberfläche zeigt im SQL-Labor keine Musterlösung an. Alle zwölf
SQL-Downloads wurden in einer isolierten MariaDB-10.4.13-Instanz geprüft.
Die Bedienung der Workbench-Versionen auf den Schul-PCs ist damit noch nicht
nativ geprüft. [Prüfumfang und Release-Nachweise](RELEASE_0_22_0.md).

**Übersichtliche Praxisaufträge:** Seit 0.22.1 zeigen alle Arbeitsschritte eine
kurze Überschrift und eine aufklappbare vollständige Anleitung. Der erste
Schritt ist geöffnet. Details können unabhängig geöffnet und geschlossen
werden; Aufgaben und Sicherheitsregeln bleiben erhalten.

**Kleine Aufgabenabschnitte:** Seit 0.22.2 sind die zehn umfangreicheren
Aufgabenblätter in aufklappbare Abschnitte mit höchstens fünf Fragen gegliedert.
Nur der erste Abschnitt ist anfangs geöffnet. Alle 164 Antwortfelder bleiben
erhalten, einschließlich Speicherung und JSON-Sicherung. Zusatzaufgaben sind
gesondert gekennzeichnet.

**Direkter Workbench-Einstieg:** Die Praxisaufträge L1.1 bis L1.4 verlinken die
animierte Startanleitung. Die Rückkehr erhält die geöffneten Arbeitsschritte
und die Scrollposition. Das Video startet weiterhin nur auf Wunsch.

![WorkbenchLab Übersicht mit neuer Bildsprache](../screenshots/workbenchlab-visuals-desktop.png)

## Historischer Ausbau in Version 0.7.0-local

- fünf Lernfortschritte entsprechend dem lokalen Kompetenzraster
- 21 Lerneinheiten mit durchgehendem Ablauf **Informieren, Planen, in
  Workbench arbeiten, Abschließen**
- integrierte Praxisaufträge mit Lernprodukt, empfohlenem Dateinamen und
  transparentem Bezug zu Informations- und Aufgabenblättern
- Abschluss einer Einheit erst nach Selbstkontrolle, Verständnischeck und
  Bestätigung durch die Lehrkraft
- drei neue ausführbare SQL-Aufgaben für `CREATE TABLE`, `UPDATE` und `DELETE`
- zwei neue Einheiten zu digitalen Spuren und zur begründeten
  Big-Data-Fallanalyse
- 27 prüfbare Übungen mit XP
- Dark Mode als Standard und Light Mode als umschaltbare Alternative
- sequenzielle Freischaltung: zunächst L1.1, danach jeweils die nächste Einheit
- zweistufiges Lernpfad-Menü und Breadcrumbs je Lernfortschritt
- sitzungsbezogener Entwicklermodus über `AltGr + S`
- L1.1 vollständig aus Information, Aufgabe und Vorlage aufbereitet, mit
  ausfüllbarem Tabellenentwurf und eigenen Lernnotizen
- Lernprofil mit Schülerkürzel und Klasse
- JSON-Format 3 mit Profilherkunft, Übertragungshistorie und
  SHA-256-Integritätsprüfung
- kompatible Übernahme bisheriger lokaler Lernstände aus Version 0.5.0

Diese Liste dokumentiert den damaligen lokalen Ausbau. Der Lernpfad ist
inzwischen Teil der veröffentlichten Anwendung und wurde bis Version 0.22.0
um durchgängige praktische Workbench-Phasen erweitert.

![Lokaler Lernpfad 0.6.0 mit fünf Lernfortschritten](../screenshots/learning-path-0.6-desktop.png)

![Lokale mobile Lektionsansicht mit Workbench-Auftrag](../screenshots/lesson-workflow-0.6-mobile.png)

## Historischer Funktionsumfang in Version 0.5.0

- 19 Lektionen in sechs Modulen entlang der BPE6-Kompetenzspur
- 22 prüfbare Übungen mit XP
- browserbasiertes SQL-Labor über `sql.js`
- lokaler SQL-Coach mit verständlicher Syntaxübersetzung, Kriteriencheck und
  Ergebnisdiagnose ohne Cloud-Übertragung
- drei Übungsdatenbanken: eine einfache Fahrschüler-Tabelle, ein
  normalisiertes Fahrschul-Schema und eine Fahrradvermietung mit
  Beziehungsentität
- Prüfungen für Projektion, Selektion, Sortierung, `DISTINCT`, `LIKE`,
  Datumsfunktionen, Gruppierung, `HAVING`, `INSERT` und `JOIN`
- eigene eERM-Werkstatt: Sachtextanalyse, Rollen und Ereignisse,
  Kardinalitäten, Optionalität und M:N-Auflösung
- zwei interaktive eERM-Diagramme mit auswählbaren Kardinalitäten und
  Fremdschlüsseln
- drei eigens generierte, fotorealistische Unterrichtsmotive für Übersicht,
  eERM-Werkstatt und SQL-Labor
- Modellierungsübungen zu Fremdschlüsseln, Normalformen und Big Data
- Workbench-Lerneinheit zu Dienststart, Verbindung, Forward Engineering,
  Synchronisierung, Skriptimport und Ergebniskontrolle
- Befehlsbibliothek mit 17 SQL-Karten und Miniaufgaben
- XP, Level, Erfolge und Aktivitätsserie
- lokaler Lernstand mit anonymisiertem Schülerkürzel im Browser
- nachvollziehbarer JSON-Export mit Profil- und Gerätecode
- Light- und Dark-Mode
- Nachschlagebereich mit Bildungsplan, Landesbildungsserver,
  Informatik-Stick und MySQL-Workbench-Hinweisen
- eigenständige responsive Illustrationen für Informatik-Stick,
  MySQL-Dienst und eERM in Workbench statt eingebetteter Screenshots

![Neu gestalteter Nachschlagebereich](../screenshots/nachschlagen-desktop.png)

![Interaktive eERM-Aufgabe](../screenshots/eerm-diagram-desktop.png)

## Technische Architektur

WorkbenchLab ist eine statische Single-Page-App ohne Build-Schritt. Die für
Icons und Browser-SQL benötigten Laufzeitdateien werden lokal mitgeliefert,
damit das Portal nicht von externen CDNs abhängt.

| Datei | Aufgabe |
| --- | --- |
| `index.html` | App-Shell, Navigation, Dialoge und Skripteinbindung |
| `styles.css` | Layout, Responsive Design, SQL-Runner, Diagramme |
| `content.js` | Basistexte, Übungen, SQL-Schemata, Befehle, Quellen |
| `learning-path.js` | lokaler BPE6-Lernpfad, Materialbezug, Workbench-Aufträge und ergänzende Übungen |
| `app.js` | Routing, Freischaltung, Rendering, XP, SQL-Prüfung, Export/Import |
| `assets/` | optimierte Bildserie für Unterrichtskontext; Fachdiagramme bleiben responsiv in HTML und CSS |
| `vendor/` | lokal eingebundene Laufzeitdateien für Lucide und `sql.js` |
| `documentation/documentation.md` | zentraler Versions-, Aufgaben- und Prüfstand mit didaktischen und technischen Anhängen |
| `documentation/screenshots/` | Screenshots der lokalen Entwicklungsstände |

Hash-Routing wie `#lesson/joins` oder `#practice/sql-group-having` bleibt mit
GitHub Pages kompatibel.

## Lokal starten

```powershell
cd "G:\Meine Ablage\Codex\WorkbenchLab"
python -m http.server 4174
```

Danach `http://localhost:4174` öffnen.

Die ersten Einheiten lassen sich mit `node --test tests/learning-path.test.js`
auf Vollständigkeit und Zuordnung prüfen.
Das fiktive Importskript und seine Selektionsfälle prüft
`python -B -m unittest discover -s tests -p 'test_*.py' -v`.

## GitHub Pages

Das Projekt enthält einen GitHub-Actions-Workflow unter
`.github/workflows/pages.yml`. Nach dem Push in ein GitHub-Repository kann in
den Repository-Einstellungen GitHub Pages mit **Build and deployment: GitHub
Actions** aktiviert werden.

Der Ordner `resources/` ist absichtlich ausgeschlossen, damit keine
Originalarbeitsblätter, Lösungen oder großen Materialpakete öffentlich
veröffentlicht werden.
