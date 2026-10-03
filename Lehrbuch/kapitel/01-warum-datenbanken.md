---
id: "kapitel-01-warum-datenbanken"
title: "Kapitel 01 · Warum Datenbanken?"
order: 1
status: "entwurf"
bpe: ["6.1", "6.2"]
estimated_lessons: 1
sql_dialect: "keiner"
lab_lessons: ["warum-datenbanken"]
lab_practices: ["db-benefit-choice"]
updated: "2026-09-06"
---

# Kapitel 01 · Warum Datenbanken?

**Leitfrage:** Wie behalten wir den Überblick, wenn immer mehr Personen und Vorgänge zusammenkommen?

Dieses Kapitel führt in die spätere Modellierung ein. Du brauchst noch keine SQL-Kenntnisse. Für Lesen, ausgewählte Aufgaben und eine gemeinsame Besprechung ist ungefähr eine Unterrichtsstunde vorgesehen. Die Transferaufgabe kann anschließend bearbeitet werden.

## Das lernst du

Nach diesem Kapitel kannst du:

- Probleme einer unübersichtlichen Datensammlung an einem konkreten Fall erklären;
- Datenbank und Datenbankmanagementsystem unterscheiden;
- erläutern, weshalb eine Nummer zur eindeutigen Identifikation hilfreich ist;
- sinnvolle Fragen an einen Datenbestand formulieren.

## 1. Eine Liste für den Fahrradverleih

Der fiktive Fahrradverleih **RadZeit** beginnt mit einer einfachen Liste. Bei jedem Verleih trägt eine Mitarbeiterin oder ein Mitarbeiter eine neue Zeile ein.

| Zeile | Name | Wohnort | Fahrradtyp | Beginn | Ende |
| ---: | --- | --- | --- | --- | --- |
| 1 | Alex Berg | Freudenstadt | Cityrad | 01.06.2026 | 02.06.2026 |
| 2 | Samira Wolf | Nagold | E-Bike | 01.06.2026 | 03.06.2026 |
| 3 | Alex Berg | FDS | Trekkingrad | 04.06.2026 | 05.06.2026 |
| 4 | Alex Berg | Calw | Cityrad | 04.06.2026 | 04.06.2026 |

Alle Personen und Vorgänge in diesem Buchbeispiel sind erfunden. Die Zeilennummern helfen hier nur beim Besprechen der Liste.

Auf den ersten Blick enthält die Liste viele nützliche Angaben. Trotzdem kann der Verleih einige Fragen nicht zuverlässig beantworten:

- Steckt hinter allen Einträgen „Alex Berg“ dieselbe Person?
- Ist „FDS“ eine andere Schreibweise für Freudenstadt?
- Welches einzelne Cityrad wurde herausgegeben, wenn mehrere Cityräder vorhanden sind?
- Wo muss eine Ortsangabe geändert werden, damit die aktuellen Kundendaten einheitlich bleiben?

Die Einträge beweisen noch keinen Fehler. Zwei gleichnamige Menschen können an verschiedenen Orten wohnen, und eine Person kann umgezogen sein. Zuerst müssen wir klären, was die Angaben bedeuten und welche Regeln für unsere Liste gelten.

> **Merksatz:** Ein guter Datenbestand braucht verständliche Bedeutungen und eindeutige Zuordnungen.

## 2. Wann wird eine einfache Liste unpraktisch?

Eine Tabellenkalkulation kann Daten sortieren, filtern und berechnen. Für eine kleine, überschaubare Aufgabe ist sie oft gut geeignet.

Bei RadZeit werden jedoch Angaben zu Personen und zu Mietvorgängen in derselben Liste wiederholt. Wenn eine Person zehnmal ein Fahrrad mietet, wird ihr Name zehnmal eingetragen. Soll die Liste jeweils den aktuellen Wohnort enthalten, müsste eine Änderung möglicherweise an mehreren Stellen nachgetragen werden. Dabei können unterschiedliche Angaben stehen bleiben.

Außerdem arbeiten mehrere Personen mit denselben Informationen. Sie müssen sich auf eine gemeinsame, verlässliche Datenbasis einigen. Eine Datenbank mit passenden Regeln unterstützt diese Arbeit. Entscheidend ist also nicht nur die Zahl der Zeilen, sondern auch, wie die Daten zusammenhängen und gepflegt werden.

Das Datenbankprogramm kann allerdings nicht von allein entscheiden, welche Person gemeint war oder ob eine eingegebene Anschrift in der Wirklichkeit stimmt. Diese Informationen müssen korrekt erfasst werden.

## 3. Vier Begriffe, die du unterscheiden solltest

| Begriff | Bedeutung in diesem Kapitel | Beispiel bei RadZeit |
| --- | --- | --- |
| Daten | Gespeicherte Angaben, deren Bedeutung durch ihren Zusammenhang klar wird | „Nagold“ als Wohnort; 04.06.2026 als Mietbeginn |
| Datenbestand | Eine zusammengehörige Sammlung solcher Angaben | Alle bisher erfassten Personen und Mietvorgänge |
| Datenbank | Eine organisierte Sammlung zusammengehöriger Daten, die gezielt gespeichert und abgefragt werden kann | Die nach einem Modell strukturierten Verleihdaten |
| Datenbankmanagementsystem, kurz DBMS | Die Software, mit der eine Datenbank verwaltet und genutzt wird | MySQL verwaltet die Datenbank und führt Speicher- und Abfrageaufträge aus |

In einer **relationalen Datenbank** werden die Daten in Tabellen organisiert. Zusammenhänge zwischen den Tabellen lassen sich über gemeinsame Schlüsselwerte darstellen. Was ein Schlüssel genau ist, lernst du in Kapitel 4.

MySQL Workbench ist eine Oberfläche zum Arbeiten mit Datenbanken und Modellen. Das eigentliche DBMS übernimmt beispielsweise MySQL im Hintergrund. Eine geöffnete Oberfläche und ein laufender Datenbankdienst sind deshalb zwei verschiedene Dinge.

## 4. Ein Beispiel gemeinsam lösen: Personen eindeutig zuordnen

Wir klären die Liste mit dem Verleih. Dabei ergeben sich folgende Informationen:

- Die Einträge in Zeile 1 und 3 betreffen dieselbe Person.
- „FDS“ sollte in diesem Fall Freudenstadt bedeuten.
- In Zeile 4 ist eine andere Person mit demselben Namen gemeint.
- Die Kundenübersicht soll den aktuellen Wohnort enthalten.

Nun geben wir jeder Person eine eigene Kundennummer und erfassen die Personendaten in einer Übersicht:

| kundennr | vorname | nachname | wohnort |
| ---: | --- | --- | --- |
| 101 | Alex | Berg | Freudenstadt |
| 102 | Samira | Wolf | Nagold |
| 103 | Alex | Berg | Calw |

Die Nummer `101` bezeichnet genau eine Person in diesem Datenbestand. Auch wenn diese Person später ihren Namen oder Wohnort ändert, soll die Nummer beibehalten werden. Die zweite Person namens Alex Berg bekommt eine andere Nummer.

Die Mietvorgänge können nun auf die Kundennummer verweisen: Die ursprünglichen Zeilen 1 und 3 gehören zu `101`, Zeile 2 zu `102` und Zeile 4 zu `103`.

**Prüfung:** Wir können jetzt die beiden gleichnamigen Personen unterscheiden und die zwei Vorgänge der ersten Person zuordnen. Das Problem mit den einzelnen Fahrrädern ist noch offen. Auch dafür werden wir eindeutige Kennzeichnungen und ein passendes Modell benötigen.

Eine laufende Zeilennummer in einer angezeigten Liste ist kein verlässlicher Ersatz: Beim Sortieren kann eine Person an einer anderen Stelle stehen. Die zugewiesene Kundennummer bleibt dagegen bei derselben Person.

> **Merksatz:** Eine Kennung identifiziert ein Objekt. Ein beschreibendes Merkmal wie der Name muss dafür nicht eindeutig genug sein.

## 5. Von der Frage zur Auswertung

Bevor wir einen Befehl schreiben, formulieren wir, was wir wissen möchten. Für RadZeit könnten das beispielsweise diese Fragen sein:

- Welche Personen haben im Juni mindestens einmal ein Fahrrad gemietet?
- Wie viele Mietvorgänge wurden je Fahrradtyp erfasst?
- Welche Mietvorgänge gehören zur Kundennummer 101?

Jede dieser Fragen braucht bestimmte Daten. Die letzte Frage lässt sich nur verlässlich beantworten, wenn Mietvorgänge und Personen eindeutig verbunden sind.

Später verwenden wir **SQL**, eine Sprache, mit der wir unter anderem solche Abfragen formulieren. Zuerst entwerfen wir dafür die passende Datenstruktur.

## 6. Selbst bearbeiten

### 01-A1 · Grundlagen: Daten und Programme unterscheiden

Ordne zu: **gespeicherte Daten**, **DBMS** oder **Arbeitsoberfläche**.

1. Eine Tabelle mit Kundennummern und Namen.
2. MySQL, das eine Abfrage ausführt.
3. MySQL Workbench, in dem eine Abfrage eingegeben wird.

Erkläre anschließend in zwei Sätzen den Unterschied zwischen einer Datenbank und einem DBMS.

### 01-A2 · Anwendung: Die Liste untersuchen

Gehe von der ursprünglichen Liste in Abschnitt 1 aus, bevor die Zusatzinformationen aus Abschnitt 4 bekannt sind.

1. Beschreibe zwei Angaben, die mehrdeutig sind.
2. Nenne zu jeder Angabe eine konkrete Rückfrage an den Verleih.
3. Erkläre, weshalb du die Zeilen mit „Alex Berg“ nicht einfach zusammenfassen darfst.

**Hilfe:** Unterscheide zwischen dem, was du aus der Liste sicher weißt, und einer Vermutung.

### 01-A3 · Anwendung: Fragen an die Daten stellen

Formuliere drei weitere Fragen, die für den Verleih nützlich wären. Notiere jeweils, welche Daten du zum Beantworten brauchst. Kennzeichne mindestens eine Frage, für die die ursprüngliche Liste noch nicht ausreicht.

### 01-A4 · Transfer: Ein anderer Verleih

Eine Schule verleiht Tablets. In einer Liste stehen bisher nur der Name der ausleihenden Person, der Gerätetyp und das Ausleihdatum.

Schlage zwei Verbesserungen vor und begründe sie. Erkläre außerdem, welche Frage du klären musst, bevor du entscheiden kannst, ob ein Tablet noch ausgeliehen ist.

## 7. Häufige Denkfehler

**„Ein Name reicht immer zur Identifikation.“** Verschiedene Menschen können denselben Namen haben. Außerdem können Namen geändert werden.

**„Eine Datenbank verhindert jeden Fehler.“** Ein DBMS kann festgelegte Regeln prüfen. Ob ein plausibel geschriebener Name tatsächlich zur richtigen Person gehört, weiß es dadurch noch nicht.

**„Eine Tabellenkalkulation ist grundsätzlich ungeeignet.“** Die Eignung hängt vom Zweck ab. Für RadZeit sind insbesondere eindeutige Zuordnungen, zusammenhängende Daten und ihre verlässliche Pflege wichtig.

## 8. Kurz prüfen

Beantworte ohne Nachlesen:

1. Welche Aufgabe übernimmt das DBMS?
2. Warum sind die Kundennummern 101 und 103 im Beispiel hilfreich?
3. Nenne ein Problem der ursprünglichen Liste, das durch die Kundenübersicht noch nicht gelöst wurde.

Vergleiche deine Antworten mit den Erklärungen und besprich offene Punkte. Wenn du den Unterschied zwischen Daten und Verwaltungssoftware erklären sowie eine Zuordnung begründen kannst, hast du die Grundlage für das nächste Kapitel.

## 9. In WorkbenchLab üben

- [Lektion: Warum Datenbanken?](https://jakobsawazki.github.io/WorkbenchLab/#lesson/warum-datenbanken)
- [Passende Verständnisübung öffnen](https://jakobsawazki.github.io/WorkbenchLab/#practice/db-benefit-choice)

Diese vorhandenen Angebote ergänzen das Kapitel. Der kleine RadZeit-Datensatz gehört zu diesem Manuskript; er ist noch nicht als eigene Labordatenbank eingebaut.

## Ausblick und Einordnung

Im nächsten Kapitel untersuchst du, welche Objekte und Eigenschaften eine Datenbank überhaupt abbilden soll. Daraus entsteht dein erstes Datenmodell.

Dieses Einstiegskapitel bereitet die Modellierungsarbeit vor. Den curricularen Zusammenhang findest du im [Bildungsplanabgleich](../BPE6_ABGLEICH.md). Situation, Tabellen und Aufgaben wurden für dieses Manuskript eigenständig entworfen.
