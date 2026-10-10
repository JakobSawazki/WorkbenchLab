# WorkbenchLab

**Aktueller Release:** 0.45.0 · **Live:** <https://jakobsawazki.github.io/WorkbenchLab/> ·
**Repository:** <https://github.com/JakobSawazki/WorkbenchLab>

WorkbenchLab ist eine browserbasierte Lernumgebung für Jahrgangsstufe 1 im
Fach Informatik an nichtgewerblichen beruflichen Gymnasien. Inhaltlicher Kern
ist BPE6 **Relationale Datenbanken**: eERM, Relationenmodell, SQL,
Fremdschlüssel, referentielle Integrität, Normalisierung und Big Data.

Entwickelt von Jakob Sawazki gemeinsam mit zwei KI-Agenten (Codex und Claude).

## Wo steht was?

| Ich suche … | Datei |
| --- | --- |
| Was hat sich wann geändert? | [CHANGELOG.md](CHANGELOG.md) |
| Aktueller Stand, Wegweiser, Arbeitsprotokoll | [documentation/documentation.md](documentation/documentation.md) |
| Übergabe Claude → Codex, offene Punkte | [claude2codex.md](claude2codex.md) |
| Übergabe Codex → Claude | [codex2claude.md](codex2claude.md) |
| Einzelne Release- und Abnahmeberichte | [documentation/releases/](documentation/releases/) |
| Projektdokumentation bis Release 0.21.0 (Codex) | [documentation/archiv/](documentation/archiv/PROJEKTDOKUMENTATION_BIS_0_21.md) |
| Lehrbuch-Manuskript (Entwurf) | [Lehrbuch/README.md](Lehrbuch/README.md) |
| Stand vor Claudes Mitarbeit wiederherstellen | Tag `codex-stand-2026-10-08`; Anleitung in der Projektdokumentation, Abschnitt 0.1 |

## Was die Plattform bietet

| Bereich | Inhalt |
| --- | --- |
| Lernpfad | 21 Lerneinheiten in fünf Lernfortschritten (L1 bis L5), jeweils mit Information, Aufgabenblatt, Browserübungen, Praxisauftrag in MySQL Workbench und Abschluss; Einheiten in fester Reihenfolge |
| SQL-Labor | 59 Übungen, frei zugänglich: Abfragen schreiben, Fehlersuche, Vorhersage, Klauseln ordnen; freies SQL-Labor mit zwölf Einheitenskripten, eigenen SQL-Dateien und getrennten Datenbanken; Wiederholungsrunde; Klausurtraining; deutsche Fehlermeldungen; Hinweise auf Unterschiede zu MySQL |
| Modellieren | Modell- und Begriffsaufgaben; Modell-Editor mit Diagramm, drei geprüften Aufgaben, SQL- und Bildexport |
| Nachschlagen | SQL-Befehle mit Suche, Startanleitung für Informatik-Stick und Workbench, Videos, Quellen |
| Lernstand | lokal im Browser; Sicherung und Übertragung als JSON-Datei; Notizen, Markierungen, Zeichnungen; Druckansicht |
| Offline | Webseite unter „Speichern & Laden“ ausdrücklich offline vorbereiten; Updates warten auf das Schließen aller App-Tabs. Alternativ ZIP aus dem GitHub-Release entpacken und `index.html` in Edge öffnen, ohne Server oder Installation. Externe Quellen und YouTube benötigen weiterhin Internet; Lernstand regelmäßig separat sichern |
| Motivation | XP, Level, Erfolge, Aktivitätstage; NAGOLD-Tabelle mit automatischen und eigenen Einträgen |
| Lehrkraft | Klassenübersicht und getrennte Bestätigungsliste unter <https://jakobsawazki.github.io/WorkbenchLab/lehrkraft.html>; Entwicklermodus im Profil mit `AltGr + S`, dort auch „Lösungsdatei laden“ (Datei erzeugen mit `node tools/build-solutions.cjs`) |

![WorkbenchLab Übersicht](documentation/screenshots/workbenchlab-visuals-desktop.png)

## Ziel

Die Schülerinnen und Schüler sollen Datenbanken nicht nur bedienen, sondern
fachlich verstehen:

1. Reale Situation analysieren.
2. Entitäten, Attribute, Beziehungen und Kardinalitäten modellieren.
3. Relationenmodell mit Primär- und Fremdschlüsseln ableiten.
4. Tabellen und Daten mit SQL aufbauen und pflegen.
5. Datenbestände mit SELECT, JOIN, Funktionen, Gruppierung und HAVING auswerten.
6. Redundanz, 3NF und Normalisierung begründen.
7. Big-Data-Chancen und -Risiken reflektiert beurteilen.

## Fachliche Grundlage

- [Bildungsplan Informatik Baden-Württemberg](https://bildungsplaene-bw.de/,Lde/In_OS_nichtTG)
- Jahrgangsstufe 1, BPE6 **Relationale Datenbanken**, 30 Stunden
- [Landesbildungsserver: Materialien zum neuen Bildungsplan Informatik](https://www.schule-bw.de/faecher-und-schularten/mathematisch-naturwissenschaftliche-faecher/informatik/material/materialien-zum-neuen-bildungsplan-informatik-an-den-nichtgewerblichen-beruflichen-gymnasien)
- Materialpaket **Relationale Datenbanken**, Stand 31.07.2025

Die vollständigen lokalen Unterrichtsmaterialien liegen unter:

`G:\Meine Ablage\Codex\WorkbenchLab\resources\bpe-6-relationale-datenbanken`

Diese Originalmaterialien dienen als fachliche Referenz und werden durch
`.gitignore` nicht in ein öffentliches Repository übernommen.

## SQL-Labor und MySQL Workbench

Das SQL-Labor läuft vollständig im Browser und verwendet SQLite über `sql.js`.
Es ist für schnelles Üben gedacht. Die Unterrichtsumgebung bleibt:

1. [Informatik-Stick über Schultasche-BW](https://schultasche-bw.de/) beziehen
   und mit dem Play-Symbol **Start** öffnen; an der Schule ist eine ältere
   Ausgabe bereits eingerichtet.
2. Unter **Datenbank MariaDB** **MySQL starten** doppelklicken, auf
   `ready for connections` warten und das Konsolenfenster geöffnet lassen.
3. In der Schule **MySQL Workbench 6.3.10** aus dem Stick öffnen. Zu Hause kann
   eine andere Stick-Version, etwa 8.0.21, angeboten werden.
4. Die lokale Verbindung in Workbench testen und erst danach Modell oder
   Unterrichtsskripte bearbeiten. Das Windows-/Microsoft-365-Passwort gehört
   nicht in die lokale Datenbankverbindung.

Im Browser-Labor sind ausgewählte MySQL-Funktionen wie `YEAR`, `MONTH`, `NOW`
und `DATEDIFF` als Übungshilfe nachgebildet. Für verbindliche Arbeit mit den
Originalskripten ist MySQL Workbench maßgeblich.

## Offline-Paket

Unter „Speichern & Laden“ führt „Offline-Paket“ zum ZIP der passenden
GitHub-Releaseversion. Vollständig entpacken und `index.html` in Edge öffnen.
SQL, die Einheitenskripte und die lokale Startanleitung funktionieren ohne
Netzwerk; YouTube und externe Quellen nicht. Die Lehrkraftseite ist ebenfalls
enthalten. Der persönliche Lernstand gehört nicht zum ZIP: vor Ordner-,
Versions- oder PC-Wechsel als Datei speichern und danach laden.

Entwickler bauen es mit `node tools/build-offline.cjs` (Node und Python,
keine zusätzliche Bibliothek). Ausgabe: `dist/WorkbenchLab-VERSION-offline.zip`.
Bei jedem Release nach Versionsabgleich und Tests neu bauen und als Asset
am gleichnamigen GitHub-Tag veröffentlichen; der Webseitenlink ist versionsfest.
Das Paket enthält eine öffentliche Dateiliste mit Größen und SHA-256, keine
privaten Materialien oder Lehrkraftlösungsdatei. Der Offline-Cache der normalen
HTTPS-Seite per Service Worker ist noch nicht umgesetzt.

Der SQL-Coach analysiert die Eingabe lokal in vier Schritten: Ausführbarkeit,
geforderter SQL-Aufbau, Ergebnismenge und Sortierung. Er übersetzt typische
SQLite-Fehler in fachliche Hinweise und zeigt den nächsten Prüfschritt, ohne
eine externe API oder einen offenen Schlüssel zu verwenden.

![Lokaler SQL-Coach mit differenzierter Rückmeldung](documentation/screenshots/sql-coach-desktop.png)

## Technische Architektur

Statische Single-Page-App ohne Server und ohne externe Laufzeitabhängigkeiten.
Icons und Browser-SQL werden lokal mitgeliefert.

| Datei | Aufgabe |
| --- | --- |
| `index.html` | App-Shell, Dialoge, Skripteinbindung |
| `app.js` | Routing, Darstellung, Freischaltung, XP und NAGOLD, SQL-Prüfung, Sicherung |
| `nagold.js` | Bereinigung und Summe der NAGOLD-Tabelle, automatische Einträge und Übernahme älterer Punktestände |
| `content.js`, `learning-path.js`, `lesson-openings.js`, `practical-exercises.js` | Inhalte: Einheiten, Übungen, Übungsdatenbanken, Befehle |
| `debug-exercises.js`, `predict-exercises.js`, `order-exercises.js` | Aufgabentypen Fehlersuche, Vorhersage, Klauseln ordnen |
| `expected-results.js` | vorberechnete Sollergebnisse der SQL-Aufgaben (erzeugt von `tools/build-expected.cjs`) |
| `sql-check.js` | Ergebnisvergleich und Aufbauprüfung der SQL-Aufgaben |
| `sql-feedback.js` | deutsche SQL-Meldungen, Unterschiede zu MySQL |
| `review.js`, `erm-editor.js` | Wiederholungsrunde und Klausurtraining; Modell-Editor |
| `study-tools.js`, `drawing.js`, `appearance.js`, `command-search.js`, `reference-search.js` | Markierungen und Notizen, Zeichnen, Darstellung, Suchen |
| `lehrkraft.html`, `teacher-overview.js` | Klassenübersicht |
| `styles.css`, `styles-lesson.css`, `styles-practice.css`, `styles-visuals.css`, `styles-shared.css`, `styles-extensions.css` | Styling in sechs Teilen; die Reihenfolge ist fest |
| `assets/`, `vendor/` | Bilder, SQL-Downloads, Video; Lucide und `sql.js` |
| `tests/`, `tools/` | 216 Node-Tests, 44 Browsertests, Prüf- und Bauwerkzeuge |
| `resources/`, `references/` | lokales Originalmaterial, **nicht** versioniert und nicht veröffentlicht |

## Veröffentlichung

GitHub Pages, ausgelöst durch jeden Push auf `main`
(`.github/workflows/pages.yml`). Vor der Veröffentlichung müssen die Node- und
Python-Tests bestehen. `tools/build-site.cjs` stellt nur die App-Dateien
zusammen und entfernt dabei die Lösungsanweisungen der SQL-Aufgaben. Tests,
Werkzeuge, Dokumentation und Lehrbuch bleiben im Repository, außerhalb der
Lernseite.

Bei jedem Release gemeinsam anheben: alle `?v=`-Parameter in `index.html` und
`lehrkraft.html`, `content.version` in `learning-path.js`, `version` in
`package.json`. Nach Änderungen an SQL-Aufgaben `node tools/build-expected.cjs`
ausführen.

## Lokale Prüfungen (OPT-10)

Voraussetzungen: Node.js ab 22, Python 3, pnpm ab 10. Für Browserprüfungen
zusätzlich Microsoft Edge. Die Anwendung selbst bleibt ohne Paketabhängigkeiten.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm test
pnpm test:python
pnpm serve
# In einem zweiten Terminal, während der Server läuft:
pnpm test:browser
```

Browserprüfungen verwenden `http://127.0.0.1:4174/`; eine abweichende lokale
Adresse lässt sich mit `WORKBENCH_TEST_URL` setzen. Node- und Python-Tests
benötigen keinen Server. Alternativ lassen sie sich direkt mit
`node tools/run-tests.cjs` und `python -B -m unittest discover -s tests -p 'test_*.py' -v`
starten. Historische Einzelprüfungen bleiben unverändert erhalten.

**Dokumentationsstand:** 8. Oktober 2026

**Live:** <https://jakobsawazki.github.io/WorkbenchLab/>

**Repository:** <https://github.com/JakobSawazki/WorkbenchLab>

**Lehrbuch-Manuskript:** [Entwurf und Kapitelplanung](Lehrbuch/README.md).
Die Markdown-Dateien sind öffentlich; eine integrierte Leseausgabe ist noch
nicht umgesetzt.

WorkbenchLab ist eine browserbasierte Lernumgebung für Jahrgangsstufe 1 im
Fach Informatik an nichtgewerblichen beruflichen Gymnasien. Inhaltlicher Kern
ist BPE6 **Relationale Datenbanken**: eERM, Relationenmodell, SQL,
Fremdschlüssel, referentielle Integrität, Normalisierung und Big Data.

Die Oberfläche orientiert sich bewusst an PythonLab: Lernpfad, Übungen, XP,
Erfolge, Nachschlagebereich, lokale Lernstandsicherung und GitHub-Pages-fähige
statische Architektur.

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
nativ geprüft. [Prüfumfang und Release-Nachweise](documentation/releases/RELEASE_0_22_0.md).

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

![WorkbenchLab Übersicht mit neuer Bildsprache](documentation/screenshots/workbenchlab-visuals-desktop.png)

## Datenschutz und Leistungsbewertung

WorkbenchLab speichert Schülerkürzel, Klasse, Lernstand, XP, gelöste Aufgaben,
Arbeitsblätter, Notizen und Entwürfe lokal im Browser unter `workbenchlab-v1`.
Das Kürzel folgt dem Schema `ABC.DEF`: drei Buchstaben des Vornamens, Punkt,
drei Buchstaben des Nachnamens. Es gibt kein Backend und keine zentrale
Schülerdatenbank.

Beim JSON-Export werden zusätzlich Profilherkunft, aktuelles Exportgerät,
Übertragungshistorie und eine SHA-256-Prüfsumme ausgegeben. Browser können
weder eine MAC-Adresse noch zuverlässig eine lokale IP-Adresse bereitstellen;
diese Werte werden deshalb nicht vorgetäuscht. Details und Grenzen der
Zuordnung stehen im [Archiv der Projektdokumentation](documentation/archiv/PROJEKTDOKUMENTATION_BIS_0_21.md), Abschnitt 5.

Der SQL-Coach sendet weder SQL-Code noch Profil- oder Leistungsdaten an einen
KI-Dienst. Ein optionaler KI-Ausbau ist nur über ein geschütztes serverseitiges
Gateway vorgesehen; Details stehen in [SQL-Feedback und KI](documentation/SQL_FEEDBACK_UND_KI.md).

Die XP sind das Motivationssystem innerhalb der Plattform. In die Bewertung der
kontinuierlich erbrachten Leistung fließt etwas anderes ein: Je vollständig
abgeschlossener Lerneinheit zählen einmalig 5 **NAGOLD**, das Punktesystem der
Lehrkraft. Der Abschluss einer Einheit verlangt die Bestätigung durch die
Lehrkraft; diese Bestätigung ist im Browser ein Haken und technisch nicht
manipulationssicher. Maßgeblich bleibt deshalb die persönliche Kontrolle des
Lernprodukts. Ein Klick auf NAGOLD im Profil öffnet die
Punktetabelle: automatische Einträge je Einheit sowie eigene Einträge mit
Datum, Uhrzeit (HH:MM), Anlass und 1 bis 5 Punkten. Neue Zeilen erhalten
automatisch das lokale Datum und die Uhrzeit. Zeilen lassen sich hinzufügen, bearbeiten
und löschen. XP werden weiter aus Abschlüssen berechnet; NAGOLD werden aus
der Tabelle summiert, auch in der Klassenübersicht. Diese Tabelle ist eine
Selbstauskunft, kein manipulationssicherer Leistungsnachweis. Sicherungen
verwenden Format 7; ältere Sicherungen bleiben ladbar.

In der Lehrkraftübersicht lassen sich gesehene Einheiten und NAGOLD
unabhängig bestätigen. Die Bestätigungen bleiben auf dem Lehrkraftgerät,
haben eine eigene Sicherungsdatei und separate Spalten im CSV. Geänderte
Punktezeilen erfordern erneute Bestätigung; Schülerdateien können keine
Bestätigungen in diese Liste einschleusen.

`pnpm serve` nutzt einen lokalen Node-Server ohne zusätzliche Abhängigkeiten.
Er unterstützt HTTP-Teilabrufe, damit sich das Startvideo auch lokal
vorspulen lässt. Python bleibt für die Python-Tests erforderlich. Testbilder
und diagnostische Ausgaben liegen in `%TEMP%\workbenchlab-tests`, nicht im
synchronisierten Projektordner.

Die veröffentlichte Lernseite enthält keine Lösungsanweisungen zu den
SQL-Aufgaben; sie prüft gegen vorberechnete Sollergebnisse. Im öffentlichen
Repository stehen die Lösungen weiterhin, weil die Tests sie brauchen.
