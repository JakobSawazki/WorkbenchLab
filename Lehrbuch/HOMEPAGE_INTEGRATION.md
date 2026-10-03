# Das Lehrbuch mit WorkbenchLab verbinden

**Technisches Konzept · aktualisiert am 3. Oktober 2026 · Lernpfad veröffentlicht, integrierte Langtextausgabe offen**

## Umgesetzter Stand

`learning-path.js` ergänzt die vorhandene App um fünf Lernfortschritte, 21
Unterrichtseinheiten, integrierte Workbench-Aufträge, Materialbezug und einen
lehrkraftbestätigten Abschluss. Die Inhalte erscheinen in den bestehenden
Routen `#path`, `#lesson/<id>` und `#practice/<id>`. Es entstand kein zweites
Lernportal neben der vorhandenen App.

Die Live-Seite enthält Version 0.21.0. Die eigenständig erstellten
Lehrbuch-Manuskripte werden auf ausdrücklichen Auftrag als Entwürfe ebenfalls
öffentlich bereitgestellt; dies ist noch keine integrierte Leseausgabe.

Noch nicht umgesetzt ist eine eigene Leseausgabe der ausführlichen
Markdown-Manuskripte unter `Lehrbuch/kapitel`. Diese längeren Kapitel sind eine
redaktionelle Vertiefung und nicht Voraussetzung dafür, dass Informationen und
Aufgaben direkt im Lernpfad bearbeitet werden können.

## Ausgangslage

WorkbenchLab besteht derzeit aus einer statischen App ohne Build-Schritt. `index.html` enthält die Navigation; `app.js` steuert die Ansicht über Hash-Routen. `content.js` enthält die vorhandenen Kurzlektionen und Übungen. Ein Markdown-Renderer ist noch nicht vorhanden.

Die bestehenden Ziele verwenden `#lesson/<id>` und `#practice/<id>`. Ein späterer Bereich mit `#lehrbuch/<kapitel-id>` kann sich in diesen Aufbau einfügen.

## Empfohlene Umsetzung

1. **Manuskript schreiben:** Ausführliche Kapiteltexte bleiben in `Lehrbuch/kapitel/*.md`. Die Kapitelmetadaten enthalten Reihenfolge, stabile ID, Bearbeitungsstand und passende Übungs-IDs.
2. **Kapitel auswählen:** Ein kleines Inhaltsverzeichnis beziehungsweise Manifest wählt ausdrücklich die für die Leseausgabe vorgesehenen Kapitel aus. Seine Einführung ist erst bei der Webintegration nötig.
3. **Leseinhalt erzeugen:** Ein lokaler Konvertierungsschritt erzeugt HTML-Fragmente oder JSON mit fertigem Kapitel-HTML. Generierte Dateien werden nicht von Hand redigiert.
4. **In WorkbenchLab anzeigen:** Der neue Bereich erhält Inhaltsverzeichnis, Kapitelansicht, Vor-/Zurück-Navigation, Links zu Übungen und eine Druckansicht. Er nutzt die bestehende Gestaltung und funktioniert auch auf kleinen Bildschirmen.
5. **Gezielt veröffentlichen:** Ein eigener Ausgabeordner enthält ausschließlich die erforderlichen App-Dateien und ausgewählten Kapitel. Der Pages-Workflow veröffentlicht später diesen Ordner.

Als kleinere Alternative könnte ein lokal mitgelieferter Parser Markdown erst beim Öffnen im Browser umwandeln. Für das geplante Lehrbuch bevorzuge ich die statische Erzeugung: Links, Druckdarstellung und die Auswahl der Ausgabe lassen sich vorher prüfen. Für die jetzige Textarbeit ist noch keine neue Abhängigkeit nötig.

Das Frontmatter ist bereits vorbereitet, hat aber heute keine technische Wirkung in der Homepage. Der neue Navigationspunkt und die neue Route existieren ebenfalls noch nicht.

## Verbindung mit vorhandenen Lernangeboten

Die folgenden IDs wurden gegen den lokalen Stand von `content.js` geprüft. Sie sind Anschlussmöglichkeiten, keine vollständige Abdeckung aller geplanten Buchaufgaben.

| Buchkapitel | Vorhandene Lesson-IDs | Vorhandene Practice-IDs |
| --- | --- | --- |
| 01 | `warum-datenbanken` | `db-benefit-choice` |
| 02 | `eerm-grundlagen`, `erm-sachtext-analyse` | `erm-entity-analysis` |
| 03 | `erm-kardinalitaeten`, `erm-beziehungsentitaet` | `eerm-cardinality`, `erm-cardinality-cases`, `erm-rental-diagram`, `erm-school-diagram` |
| 04 | `relation-und-schluessel`, `mn-beziehungen` | `relation-key-choice` |
| 05 | `redundanz-3nf`, `normalisierung` | `normalform-choice`, `normalform-slots` |
| 06 | `workbench-workflow` | `workbench-flow-slots` |
| 07 | `daten-verwalten`, `fremdschluessel-integritaet` | `sql-insert`, `fk-integrity-choice` |
| 08 | `select-projektion`, `where-sortierung`, `sql-muster` | `sql-projection`, `sql-selection-order`, `sql-distinct`, `sql-filter-patterns` |
| 09 | `datum-berechnungen`, `funktionen-gruppierung` | `sql-date-functions`, `sql-group-having` |
| 10 | `joins` | `sql-join-places`, `sql-join-hours`, `sql-rental-history` |
| 11 | `big-data` | `bigdata-choice` |
| 12 | Auswahl passend zum späteren Projekt | Eigenständige Abschlussaufgabe noch zu erstellen |

WorkbenchLab enthält inzwischen die Ausführungsaufgaben sql-create-table, sql-update-hours und sql-delete-student sowie ergänzende Praxisaufträge. Sie ersetzen nicht automatisch die noch zu schreibenden Buchaufgaben: Datenbestand, Lernziel und Anschluss müssen für jedes Kapitel geprüft werden. Ein bloßer Link auf eine Befehlskarte ersetzt keine Ausführungsaufgabe.

Die Kurzlektionen dürfen als knappe Einstiege erhalten bleiben. Vollständige Lehrbuchpassagen werden daraus nicht zusätzlich von Hand in `content.js` kopiert. SQL-Übungen und deren automatische Prüfung bleiben bei der bestehenden Übungslogik; das Buch verweist darauf.

## SQL und Beispieldaten

Das Browserlabor arbeitet mit SQLite über `sql.js` und bildet ausgewählte MySQL-Funktionen nach. Deshalb wird bei jeder Lehrbuchaufgabe festgelegt:

- welches Schema und welche Ausgangsdaten verwendet werden;
- ob sie in der Unterrichtsumgebung oder im Browserlabor ausgeführt wird;
- welche Dialektunterschiede für genau dieses Beispiel relevant sind;
- welches Ergebnis erwartet wird und wie es kontrolliert wurde.

Der neue RadZeit-Einstieg verwendet eigene kleine Tabellen. Die vorhandene Labordatenbank `fahrradvermietung` hat andere Beispieldaten; gleiche Themen bedeuten nicht automatisch gleiche Ergebnisse.

## Tatsächlicher Veröffentlichungsweg im Projekt

Der aktuelle Workflow `.github/workflows/pages.yml` lädt mit `path: "."` den gesamten Checkout als Pages-Artefakt hoch. Er wird unter anderem durch einen Push auf `main` ausgelöst. `.gitignore` schließt `resources/` aus, aber nicht diesen Lehrbuchordner.

Die lokale Dateianlage veröffentlicht nichts. Sobald Lehrbuchdateien jedoch eingecheckt und nach `main` gepusht werden, könnten sie mit dem heutigen Workflow öffentlich erreichbar werden. Ein Status wie `entwurf` verhindert dies nicht. Auch ein öffentlicher Git-Verlauf wäre unabhängig von der Homepage einsehbar.

Bei der späteren Integration wird deshalb der Veröffentlichungsordner ausdrücklich zusammengestellt. Originalmaterialien und interne Lehrkraftunterlagen gehören weder in diese Ausgabe noch unbedacht in ein öffentliches Repository. Hier wurden ausschließlich neue Manuskript- und Planungsdateien angelegt; Workflow, Git-Konfiguration und App wurden nicht verändert.

## Prüfung der späteren Webausgabe

Vor der ersten Webausgabe werden Kapitelreihenfolge, Inhaltsverzeichnis und alle Übungslinks geprüft. Dazu kommen Tastaturbedienung, schmale Bildschirme, Tabellen, Codeblöcke und Druckdarstellung. Markdown wird mit einer begrenzten, dokumentierten Syntax verarbeitet; fremdes HTML darf dabei keine ungeprüften Skripte in die Buchansicht einbringen.

Die Webintegration beginnt sinnvoll, sobald zwei oder drei Kapitel den gewünschten Stil und die fachliche Tiefe zeigen. Das Manuskript kann währenddessen weiterwachsen.
