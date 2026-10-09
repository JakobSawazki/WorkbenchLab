# Änderungsverlauf WorkbenchLab

Eine Zeile je Version, neueste oben. Angelegt von Claude am 9. Oktober 2026
(OPT-14). Einzelheiten, Prüfumfang und Grenzen stehen in der jeweils genannten
Quelle. Wer eine Version veröffentlicht, ergänzt hier eine Zeile.

Spalte „Von“: C = Codex, Cl = Claude.

## 0.38 bis 0.26 – 9. Oktober 2026

Quelle: [documentation/documentation.md](documentation/documentation.md), Abschnitt 0 (Arbeitsprotokoll Claude).
Jede Version hat einen Git-Tag `v0.xx.y`.

| Version | Von | Inhalt | Abschnitt |
| --- | --- | --- | --- |
| 0.39.0 | Cl | Lösungen für die Lehrkraft im Entwicklermodus über eine lokale Lösungsdatei | 0.45 |
| 0.38.2 | Cl | Ohne sichtbare Änderung: SQL-Prüflogik aus `app.js` in `sql-check.js` ausgelagert (OPT-16, Schritt 1) | 0.42 |
| 0.38.1 | Cl | Siebte Fehlersuche-Aufgabe nach Abiturmuster: `AND`/`OR` ohne Klammern bei Tabellenverbund über `WHERE` | 0.40 |
| 0.38.0 | Cl | Jakobs Entscheidungen: Übungen frei zugänglich, Einheiten weiter in Reihenfolge; 5 NAGOLD je abgeschlossener Einheit; keine Lösungsanweisungen in der veröffentlichten Fassung; Schreibweise `1 : ∞` im Modell-Editor | 0.37 |
| 0.37.0 | Cl | Modell-Editor: Optionalität (`0..1`, `1..N`); Hinweise auf MySQL-Unterschiede auch in den Aufgaben | 0.34 |
| 0.36.0 | Cl | Prüfung aller neuen Aufgaben an der MariaDB des Informatik-Sticks; Hinweise auf drei gemessene MySQL-Unterschiede; „0 Ergebniszeilen“ im freien Labor | 0.32 |
| 0.35.0 | Cl | Modell-Editor: Kästen verschieben, dritte geprüfte Aufgabe „Schulbibliothek“ | 0.30 |
| 0.34.0 | Cl | Klausurtraining: fünf gemischte Aufgaben in 20 Minuten mit Auswertung je Einheit | 0.28 |
| 0.33.0 | Cl | Modell-Editor: Diagramm als Bild (SVG) | 0.25 |
| 0.32.1 | Cl | Modell-Editor: Datentyp-Auswahl nicht mehr abgeschnitten | 0.23 |
| 0.32.0 | Cl | Modell-Editor: Entitätstypen, Attribute, Schlüssel, Beziehungen; zwei geprüfte Aufgaben; SQL-Export | 0.22 |
| 0.31.0 | Cl | Wiederholungsrunde: täglich bis zu fünf bereits gelöste Aufgaben | 0.20 |
| 0.30.0 | Cl | Aufgabentyp „Klauseln ordnen“ (4 Aufgaben) | 0.18 |
| 0.29.0 | Cl | Aufgabentyp „Vorhersage“ (5 Aufgaben); Checkliste für den Schul-PC-Test | 0.15, 0.16 |
| 0.28.0 | Cl | Aufgabentyp „Fehlersuche“ (6 Aufgaben); Prüfergebnis bleibt über den Reitern sichtbar | 0.13 |
| 0.27.0 | Cl | Klassenübersicht für Lehrkräfte (`lehrkraft.html`) | 0.11 |
| 0.26.2 | Cl | Druckansicht für Einheiten | 0.9 |
| 0.26.1 | Cl | Rettungskopie, falls der gespeicherte Lernstand unlesbar ist | 0.6 |
| 0.26.0 | Cl | Freies SQL-Labor; deutsche SQL-Fehlermeldungen mit Vorschlag; einheitliche Versionsangaben | 0.4 |

## 0.25 bis 0.22 – 3. bis 8. Oktober 2026

Quelle: Einzelberichte unter [documentation/releases/](documentation/releases/).

| Version | Von | Inhalt | Bericht |
| --- | --- | --- | --- |
| – | C | Nur App-Dateien werden veröffentlicht (OPT-11) | [OPT_11](documentation/OPT_11_PUBLIC_ARTIFACT.md) |
| – | C | Tests als Bedingung für die Veröffentlichung (OPT-10) | [OPT_10](documentation/OPT_10_TEST_GATE.md) |
| 0.25.3 | C | Profilhinweis als eigener Dialog über dem Profilfenster | [0.25.3](documentation/releases/RELEASE_0_25_3.md) |
| 0.25.2 | C | Profil mit „Ok“ bestätigen | [0.25.2](documentation/releases/RELEASE_0_25_2.md) |
| 0.25.1 | C | Schmalere Profilanzeige im Kopfbereich | [0.25.1](documentation/releases/RELEASE_0_25_1.md) |
| 0.25.0 | C | Fotografische Bildeinstiege mit Denkfragen in L1.1, L2.1 und L5.1 | [0.25.0](documentation/releases/RELEASE_0_25_0.md) |
| 0.24.1 | C | Dunkleres Navy im Dark Mode | [0.24.1](documentation/releases/RELEASE_0_24_1.md) |
| 0.24.0 | C | Gemeinsamer Profil- und XP-Button oben rechts | [0.24.0](documentation/releases/RELEASE_0_24_0.md) |
| 0.23.4 | C | Suche im Bereich „Nachschlagen“ | [0.23.4](documentation/releases/RELEASE_0_23_4.md) |
| 0.23.3 | C | Suche in den SQL-Befehlen mit deutschen Fach- und Alltagsbegriffen | [0.23.3](documentation/releases/RELEASE_0_23_3.md) |
| 0.23.2 | C | Menüpunkt „Übersicht“ entfernt; Lernpfad ist der erste Menüpunkt | [0.23.2](documentation/releases/RELEASE_0_23_2.md) |
| 0.23.1 | C | Dunkelblaue Standardpalette | [0.23.1](documentation/releases/RELEASE_0_23_1.md) |
| 0.23.0 | C | Drei SQL-Aufgaben und zwei Diagrammaufgaben; SQL-Entwurf als Datei herunterladen | [0.23.0](documentation/releases/RELEASE_0_23_0.md) |
| 0.22.3 | C | Praxisaufträge L1.1 bis L1.4 verlinken die Startanleitung | [0.22.3](documentation/releases/RELEASE_0_22_3.md), [Abnahme](documentation/releases/ABNAHME_0_22_3.md) |
| 0.22.2 | C | Aufgabenblätter in Abschnitten mit höchstens fünf Fragen | [0.22.2](documentation/releases/RELEASE_0_22_2.md) |
| 0.22.1 | C | Praxisaufträge mit kurzen Überschriften und aufklappbaren Schritten | [0.22.1](documentation/releases/RELEASE_0_22_1.md) |
| 0.22.0 | C | Praxisauftrag in MySQL Workbench in allen 21 Einheiten | [0.22.0](documentation/releases/RELEASE_0_22_0.md) |

## 0.21 bis 0.1 – 18. Juni bis 1. Oktober 2026

Quelle: [Archiv der Projektdokumentation](documentation/archiv/PROJEKTDOKUMENTATION_BIS_0_21.md), Abschnitt 6 „Versionsverlauf“
(Codex), sowie die [Abnahme vom 3. Oktober 2026](documentation/releases/ABNAHME_2026-10-03.md).
Frühere README-Abschnitte zu den Ständen 0.5.0 und 0.7.0 liegen im
[Archiv](documentation/releases/README_BIS_0_25_3.md).

| Version | Inhalt |
| --- | --- |
| 0.21.0 | Landkarte der Lernfortschritte, Lernaufgaben, verfeinerte Lernwerkzeuge |
| 0.20.0 | Überarbeiteter Arbeitsbereich und XP-Dialog |
| 0.14 bis 0.19 | Lernpfad bis L2.2 veröffentlicht, YouTube-Tutorials, Textmarker, Notizen und Zeichnungen (teils nur lokal) |
| 0.6 bis 0.13 | Fünf Lernfortschritte mit 21 Einheiten, sequenzielle Freischaltung, Lernprofil, JSON-Sicherung mit Prüfsumme (lokal) |
| 0.5.0 | Erste veröffentlichte Fassung: 19 Lektionen, SQL-Labor mit SQL-Coach, eERM-Werkstatt, XP und Erfolge |
| 0.1 bis 0.4 | Aufbau des Portals |
