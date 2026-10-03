# Vorlage für ein Lehrbuchkapitel

Diese Vorlage wird für jedes neue Kapitel unter `kapitel/` kopiert. Platzhalter sind nur hier vorgesehen und werden bei der Ausarbeitung ersetzt. Fachlicher Kern, Hilfen und Vertiefung sollen im fertigen Kapitel klar erkennbar sein.

## Metadaten am Dateianfang

```yaml
---
id: "kapitel-xx-kurztitel"
title: "Kapitel XX · Verständlicher Titel"
order: 0
status: "entwurf"
bpe: ["6.x"]
estimated_lessons: 0
sql_dialect: "keiner"
lab_lessons: []
lab_practices: []
updated: "JJJJ-MM-TT"
---
```

Die ID bleibt bei späteren Titeländerungen stabil. `order` und `estimated_lessons` werden als Zahlen eingetragen. `bpe` nennt die zugeordneten Bereiche; bloße Vorbereitung darauf wird im Kapiteltext erklärt. `sql_dialect` lautet je nach Beispiel etwa `keiner`, `mysql` oder `sqlite`. Bei mehreren Dialekten müssen die einzelnen Beispiele zusätzlich gekennzeichnet sein. In `lab_lessons` und `lab_practices` stehen ausschließlich geprüfte vorhandene IDs.

`status` beschreibt den Redaktionsstand: `entwurf`, `fachlich-geprueft`, `erprobt` oder `freigegeben`. Dieses Feld ist eine redaktionelle Angabe, kein technischer Zugriffsschutz.

## Aufbau des fertigen Kapiteltexts

### 1. Titel und Leitfrage

Eine Frage macht deutlich, welches Problem die Lernenden am Ende lösen können.

### 2. Das lernst du

Drei bis fünf konkrete Ich-kann-Ziele. Vorkenntnisse und ungefähr benötigte Zeit kurz angeben.

### 3. Eine Situation zum Nachdenken

Eine überschaubare, eigenständig formulierte Situation. Alle für die Aufgabe nötigen Geschäftsregeln und Beispieldaten stehen dabei. Personen und Organisationen sind fiktiv.

### 4. Schritt für Schritt verstehen

Fachbegriffe einführen und an der Situation erklären. Jede Untersektion beantwortet eine erkennbare Frage. Ein Merksatz fasst den entscheidenden Zusammenhang zusammen; er ersetzt die Erklärung nicht.

### 5. Ein Beispiel gemeinsam lösen

Ausgangslage → Überlegung → Vorgehen → Ergebnis → Prüfung. Bei SQL: Schema, Ausgangsdaten, Dialekt, Anweisung und erwartetes Ergebnis. Bei Modellierung: Annahmen, Notation, Schlüssel und begründete Beziehungen. Ein alternativer richtiger Lösungsweg wird anerkannt, wenn die Regeln ihn zulassen.

### 6. Selbst bearbeiten

Aufgaben erhalten stabile Kennungen, beispielsweise `02-A1`.

| Stufe | Aufgabe soll zeigen | Mögliche Tätigkeit |
| --- | --- | --- |
| Grundlagen | Ich kann einen Begriff oder Zusammenhang erklären. | zuordnen, beschreiben, an einem Beispiel erläutern |
| Anwendung | Ich kann das Verfahren auf einen ähnlichen Fall anwenden. | modellieren, implementieren, abfragen, prüfen |
| Transfer | Ich kann Entscheidungen in einem veränderten Fall begründen. | vergleichen, überarbeiten, beurteilen |

Hilfen geben zunächst einen nächsten Denkschritt. Ausführliche Musterlösungen und Hinweise für Lehrkräfte werden erst im weiteren Arbeitsprozess gesondert erstellt; sie gehören nicht automatisch in die öffentliche Schülerausgabe.

### 7. Häufige Denkfehler

Zwei oder drei konkrete Irrtümer mit einer verständlichen Erklärung. Dabei nur Inhalte aufgreifen, die das Kapitel tatsächlich eingeführt hat.

### 8. Kurz prüfen

Kurze Fragen oder eine Mini-Aufgabe prüfen die Lernziele. Eine bloße Selbsteinschätzung ersetzt keine fachliche Aufgabe.

### 9. In WorkbenchLab üben

Nur tatsächlich vorhandene und passende Lektionen oder Übungen verlinken. Datenbestand und Werkzeug angeben. Wenn noch keine passende Übung existiert, das als Redaktionsnotiz festhalten und keinen funktionierenden Übungslink vortäuschen.

### 10. Ausblick und Quellen

Ein kurzer Übergang zum nächsten Kapitel. Fachliche Belege und Herkunft von Bildern, Daten oder übernommenen Ideen direkt bei der jeweiligen Verwendung nachweisen.

## Redaktionsprüfung vor einer Leseausgabe

Ein Kapitel ist bereit, wenn seine Lernziele bearbeitbar sind, alle nötigen Begriffe eingeführt wurden, Beispiele fachlich geprüft sind und Links sowie Abbildungen funktionieren. SQL wird im benannten System ausgeführt; bei verschiedenen Systemen werden die Abweichungen geprüft. Eine Druckausgabe erhält zusätzlich eine Sichtprüfung von Seitenumbrüchen, Tabellen und Codeblöcken.
