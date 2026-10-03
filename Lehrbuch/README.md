# Lehrbuch: Relationale Datenbanken

**WorkbenchLab · BPE 6 · Manuskriptstand 0.2 · Veröffentlichung als Entwurf am 3. Oktober 2026**

Hier entsteht ein Lehrbuch für Jahrgangsstufe 1 im Fach Informatik an den nichtgewerblichen beruflichen Gymnasien in Baden-Württemberg. Zielgruppe und Unterrichtsumgebung sind aus dem bestehenden WorkbenchLab-Projekt übernommen. Der aktuelle Stand umfasst das Buchkonzept, die Kapitelplanung und ein ausgearbeitetes Einstiegskapitel als Stilprobe. Das vollständige Lehrbuch entsteht anschließend kapitelweise.

## Empfehlung: Markdown als Manuskript, Homepage als Leseausgabe

Wir schreiben das Lehrbuch zunächst in Markdown. Sobald einige Kapitel fachlich und didaktisch abgestimmt sind, erhält WorkbenchLab einen Bereich **Lehrbuch**, dessen Lesetexte aus diesen Dateien erzeugt werden.

So gibt es eine zentrale Textquelle: Eine Korrektur am Manuskript kann später in die Homepage und eine druckbare Ausgabe übernommen werden. Die erste Webausgabe muss deshalb nicht warten, bis das ganze Buch fertig ist. Sie kann mit zwei oder drei ausgearbeiteten Kapiteln beginnen.

| Arbeitsweise | Nutzen | Aufwand und Grenzen |
| --- | --- | --- |
| Markdown als Manuskript | Gliederung, Erklärungen und Aufgaben lassen sich gut besprechen, vergleichen und umstellen. | Gestaltung und interaktive Übungen sind noch keine fertige Buchansicht. |
| Inhalte sofort ausschließlich in der Homepage schreiben | Kapitel sind unmittelbar im vertrauten Portal lesbar. | Textarbeit hängt an der Oberfläche; zusätzliche Druckfassungen können Doppelpflege verursachen. |
| Markdown schreiben und daraus die Homepage erzeugen | Verbindet gut überarbeitbare Texte mit dem vorhandenen SQL-Labor. | Ein kleiner Konvertierungsschritt wird später einmalig benötigt. **Empfohlener Weg.** |

Markdown macht den Aufbau übersichtlich; es ersetzt die fachliche Prüfung und Unterrichtserprobung nicht. Die spätere Druckausgabe benötigt außerdem eine eigene Layoutkontrolle.

## Hier beginnen

1. [Lehrbuchaufbau](LEHRBUCH_AUFBAU.md): zwölf Kapitel mit Lernzielen, Unterthemen, Aufgabenideen und einem Vorschlag für 30 Unterrichtsstunden.
2. [Einstiegskapitel lesen](kapitel/01-warum-datenbanken.md): ausgearbeitete Stilprobe mit einem fiktiven Fahrradverleih.
3. [Bildungsplanabgleich](BPE6_ABGLEICH.md): Zuordnung zu BPE 6.1 bis 6.5 und Abgrenzung ergänzender Inhalte.
4. [Kapitelvorlage](KAPITELVORLAGE.md): einheitlicher Aufbau für die weitere Ausarbeitung.
5. [Homepage-Anbindung](HOMEPAGE_INTEGRATION.md): Anschluss an die vorhandene App ohne doppelte Lehrbuchtexte.
6. [Quellen](QUELLEN.md): fachliche Grundlage und Stand der Prüfung.

## Didaktische Leitidee

Das Buch führt von einer verständlichen Alltagssituation über ein begründetes Datenmodell zur funktionsfähigen Datenbank. SQL folgt aus Fragen an die Daten. Die Lernenden sollen erklären können, weshalb ein Modell oder eine Abfrage passt, und nicht nur Befehle nachbauen.

Als roter Faden dient zunächst ein **fiktiver Fahrradverleih**. Kundschaft, einzelne Fahrräder und Mietvorgänge werden schrittweise eingeführt. Fahrschule und schulischer Geräteverleih dienen später als Transferkontexte. WorkbenchLab enthält bereits verwandte Übungsschemata; im Buch wird bei jedem Wechsel ausdrücklich angegeben, welcher Datenbestand gemeint ist.

Jedes Kapitel enthält einen Anlass, überprüfbare Lernziele, verständliche Erklärungen, ein durchgearbeitetes Beispiel, Aufgaben in drei Anforderungsstufen und eine kurze Selbstkontrolle. Rechen- und SQL-Ergebnisse werden bei der Ausarbeitung mit den jeweiligen Beispieldaten geprüft.

## Arbeitsweise für die nächsten Kapitel

- Zuerst den fachlichen Kerntext und das Beispiel verfassen; danach Aufgaben und Hilfen daran ausrichten.
- Grundlagen, Anwendung und Transfer sichtbar unterscheiden. Vertiefungen dürfen den Kernpfad nicht überladen.
- Neue Kapitel als einzelne Markdown-Dateien unter `kapitel/` ablegen. Die zentrale Kapitelplanung bleibt in `LEHRBUCH_AUFBAU.md`.
- Datensätze, SQL-Dateien und Fachgrafiken erst anlegen, wenn das jeweilige Kapitel sie benötigt. Ihre Quellen liegen ebenfalls innerhalb dieses Lehrbuchordners.
- Für ausführliche SQL-Beispiele ist die tatsächliche Unterrichtsdatenbank zu dokumentieren. MySQL Workbench ist die Arbeitsoberfläche; das Browserlabor verwendet SQLite. Die Dialekte müssen bei jedem Beispiel kenntlich sein.
- Den Text zuerst auf Verständlichkeit, fachliche Korrektheit und Bildungsplanbezug prüfen; dann mit Lernenden erproben und für eine Leseausgabe auswählen.

Die veröffentlichte Homepage enthält in Version 0.21.0 den Lernpfad mit fünf Lernfortschritten, 21 integrierten Unterrichtseinheiten und konkreten Workbench-Aufträgen. Die ausführlichen Markdown-Kapitel bleiben davon getrennte redaktionelle Langfassungen; ein automatischer HTML-Export oder eine PDF-Ausgabe ist noch nicht eingerichtet. Der nächste konkrete Schreibschritt ist Kapitel 2 mit einer kurzen Sachtextanalyse und einem ersten Datenmodell.

## Stand und Veröffentlichung

Kapitel 1 ist ein **Entwurf zur inhaltlichen Abstimmung**; Kapitel 2 bis 12 sind geplant. Die im Aufbau genannten Aufgaben sind Entwicklungsvorschläge, soweit sie noch nicht im Einstiegskapitel stehen.

Auf ausdrücklichen Auftrag werden diese eigenständig erstellten Manuskript- und Planungsdateien nun ebenfalls auf GitHub und GitHub Pages veröffentlicht. Sie bleiben als Entwurf gekennzeichnet und sind kein vollständig ausgearbeitetes Lehrbuch. Der aktuelle Pages-Workflow lädt den gesamten ausgecheckten Projektordner hoch; die eingecheckten Dateien sind deshalb öffentlich erreichbar. Original-Unterrichtsmaterialien, Zugangsdaten und lokale Testexporte bleiben ausgeschlossen. Der [Integrationsplan](HOMEPAGE_INTEGRATION.md) beschreibt, welche Teile bereits umgesetzt sind und wie eine spätere integrierte Leseausgabe entstehen soll.
