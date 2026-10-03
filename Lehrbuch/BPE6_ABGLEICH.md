# Bildungsplanbezug des Lehrbuchs

**Geprüft am 6. September 2026 · Planungsstand 0.1**

Grundlage ist der [offizielle Bildungsplan Informatik, nichtgewerbliche berufliche Gymnasien Baden-Württemberg](https://bildungsplaene-bw.de/,Lde/In_OS_nichtTG). Er ordnet BPE 6 der Jahrgangsstufe 1 zu und nennt 30 Stunden. Die folgende Übersicht fasst die Anforderungen in eigenen Worten zusammen; sie ersetzt den Originalplan nicht.

| Bereich | Fachlicher Kern | Geplante Kapitel | Vorgesehener Kompetenznachweis |
| --- | --- | --- | --- |
| BPE 6.1 | Realsituationen als ER-Modell darstellen: Objekte, Typen, Merkmale, Beziehungen und Kardinalitäten | 01–03 | Modell aus einem unbekannten Sachtext begründen |
| BPE 6.2 | Tabellenmodell ableiten; Text, Ganzzahl, Fließkomma, Datum, Wahrheitswert; beide Schlüsselarten, Redundanz und 3NF | 04–05 | Modell übersetzen und seine Qualität prüfen |
| BPE 6.3 | Mehrere Tabellen umsetzen; CREATE, INSERT, Konsistenz und referentielle Integrität | 06–07 | Datenbank aufbauen und Regelverletzungen erklären |
| BPE 6.4 | Mehrtabellenabfragen; Auswahl, Bedingungen, Sortierung, AND/OR/NOT; SUM/COUNT/AVG/MIN/MAX/MONTH/YEAR und Gruppierung | 08–10 | SQL entwickeln und Ergebnisse kontrollieren |
| BPE 6.5 | Massendatenspeicherung und ihre Folgen diskutieren; personenbezogene Daten und daraus erkennbare Zusammenhänge | 11 | Fallbezogenes Urteil formulieren |

Kapitel 12 verbindet diese Kompetenzen in einem vorbereiteten Transferfall. Die Verteilung auf Kapitel und Einzelstunden ist eine eigene redaktionelle Entscheidung.

## Didaktische Ergänzungen

Die Ausarbeitung verwendet MySQL Workbench und JOIN als praktische Umsetzung. UPDATE/DELETE, HAVING, zusätzliche Filterformen und die Normalisierung über 1NF/2NF werden im Bildungsplan nicht einzeln benannt. Sie unterstützen die geplanten Lernwege; ihre Nichtnennung ist kein pauschaler Prüfungsausschluss. LEFT JOIN und Unterabfragen bleiben zunächst Vertiefungen. Ein bestimmtes Modellierungswerkzeug oder eine bestimmte ER-Notation folgt aus dieser Bildungsplanquelle nicht.

## Worauf wir beim Ausarbeiten achten

- Die Lernziele müssen sich in einer Aufgabe tatsächlich zeigen lassen. „Verstehen“ wird beispielsweise durch eine Erklärung, eine Modellentscheidung oder eine korrigierte Abfrage überprüfbar.
- Die Zeitplanung umfasst ausgewählte Kernaufgaben. Zusätzliche Übungsreihen werden sichtbar als Erweiterung markiert.
- Das Buch führt seine Diagrammnotation anhand einer Legende ein und unterscheidet fachliches Modell, Tabellenmodell und Werkzeugansicht.
- Die Wahl einer Serverversion und konkrete Prüfungsanforderungen für den jeweiligen Abiturjahrgang werden vor entsprechenden Unterrichts- oder Prüfungshinweisen gesondert überprüft.
- Bei fertigen Kapiteln werden Aufgaben und Beispiele gegen diese Übersicht geprüft. Der aktuelle Plan belegt eine vorgesehene Abdeckung, noch keine vollständig ausgearbeiteten Inhalte.
