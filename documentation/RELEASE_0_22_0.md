# WorkbenchLab 0.22.0

Stand: 3. Oktober 2026

## Ziel und Umsetzung

Information, Aufgaben und Browseruebungen stehen vor dem eigenen praktischen Auftrag in MySQL Workbench. Alle 21 Einheiten haben Materialbezug, eigene Antwortfelder, einen Verstaendnischeck, einen praktischen Auftrag und Abschlussnachweise. Originale Unterrichtsdateien bleiben lokal; die neuen Downloads enthalten fiktive Daten.

| Einheiten | Praktische Arbeit | Gepruefte Grundlage |
| --- | --- | --- |
| L1.1 | Erste SQL-Tabelle untersuchen und Skript sichern | Ein-Tabelle-Fixture, PK-Fehler und Wiederholung |
| L1.2 bis L1.3 | Eigenes ER-/EER-Modell anlegen, weiterfuehren und erneut oeffnen | Vollstaendige L1-Attribute, eigene Dateinamen und Modellcheck |
| L1.4 | Schema erzeugen, Testdaten importieren, SELECT kontrollieren | Import in nativ erzeugtes Referenzschema |
| L1.5 bis L1.7 | Projektion, Selektion, Sortierung und DISTINCT | Aufgabenbezug, Browser-SQL-Uebungen und gemeinsamer L1-Bestand |
| L1.8 | Funktionen und Gruppierung, 14 Auftraege | Randfaelle im ergaenzten L1-Bestand |
| L1.9 | Datum und Berechnungen, 12 Felder | Fiktiver Fahrradbestand; native Datumsfunktionen |
| L1.10 | Daten anlegen, aendern und loeschen | Getrennter Anfangsbestand, Zielschluessel und Vorher-/Nachher-Kontrollen |
| L2.1 | Fachliches ERD plus Workbench-Tabellenentwurf | Neue Kopie, sechs Nachweisfelder, noch keine technische Beziehung |
| L2.2 | Entwurf weiterfuehren, 1:N und FK, getrenntes Schema | Vollstaendige Importstruktur und nativer JOIN |
| L2.3 | Referentielle Integritaet untersuchen | Drei FKs, blockierte Operationen und geordnete Datenerfassung |
| L2.4 | Mehrtabellenabfragen, 27 Felder | Kartesisches Produkt, Rollen, leere Gruppen und Mittelwerte |
| L3.1 | Zwei eigene M:N-Modelle; vier Transferfaelle | Wiederholte Vorgaenge, Paar-Eindeutigkeit und Mindestbeteiligung |
| L3.2 | 26 Auswertungen und zwei Reverse-Engineering-Modelle | Exakte Referenzergebnisse fuer alle 26 Abfragen; zwoelf Tabellen |
| L3.3 | 3NF pruefen, eigene Modelle und Rekonstruktionsabfragen | Fuenf Faelle mit vollstaendiger Attributerhaltung |
| L4.1 | Filmstudio und Tanzschule durch 1NF, 2NF und 3NF fuehren | Sechs eigene Stufenmodelle; rekonstruierte Ausgangsdaten |
| L5.1 | Spuren verknuepfen und EER-/Datenflussmodell unterscheiden | Mehrfachzaehlung und Profile ohne Ereignisse |
| L5.2 | Datenrate, Qualitaet und 3V begruenden | NULL, Nullwert, positive Werte und echte DATE_FORMAT-Auswertung |
| L5.3 | SQL-Befunde fuer ein begruendetes Urteil verwenden | Leere Stationen, kleine Gruppen, Wetter ohne Kausalitaetsbehauptung |

## Aktuelle Pruefungen

- 91 Node-Tests: Unterrichtsinhalte, Material-Aufgaben-Zuordnung, SQL-Ergebnisse, Schluesselregeln, Datenrekonstruktion und Speicherverhalten.
- Alle 21 Einheiten: tatsaechliche DOM-Reihenfolge Information/Arbeitsblatt, Quiz/Uebungen, Workbench-Auftrag und Abschluss.
- Alle 21 Uebungswege: Uebung oeffnen, zur richtigen Einheit zurueckkehren und den Praxisauftrag erreichen.
- Alle SQL-Links liefern die benoetigten Dateien; 84 Desktop-/Mobilansichten in Dark und Light Mode ohne horizontalen Ueberlauf oder JavaScript-Fehler.
- Vollstaendiger sequenzieller Abschluss aller 21 Einheiten mit Quiz, Selbstauskunft, Lehrkraftbestaetigung, Freischaltung und einmaliger XP-Vergabe.
- Zwoelf unveraenderte SQL-Downloads in einer frischen nativen MariaDB-10.4.13-Instanz importiert. Referenzstrukturen fuer L1.4 und L2.2 separat erstellt. DATE_FORMAT, DATEDIFF, YEAR, MONTH, TIMESTAMPDIFF, JOIN, Summen und blockierter ungueltiger FK geprueft.
- Der native Test verwendet nur ein neues Verzeichnis unter .tmp und einen eigenen Loopback-Port. Kein Windows-Dienst installiert, keine bestehende Unterrichtsdatenbank veraendert; Testserver danach beendet.

Werkzeuge: tests/lesson-phase-order.browser.cjs, tests/lesson-completion.browser.cjs, tools/verify-curriculum-browser.cjs und tools/verify-native-sql.cjs. Die letzten beiden legen lokale Ergebnisprotokolle unter .tmp ab; diese werden nicht publiziert.

## Weitere Inhalte

Neue fotorealistische Lernkarte mit bestehender Freischaltung und interaktiven Lerneinheiten. Animierte Startfolge fuer den Informatik-Stick mit lokalem Video, Untertiteln und Verbindungseinstellungen. Laengere Stellungnahmen in L5.3 bleiben bis 4000 Zeichen beim Speichern, Neuladen und JSON-Export erhalten.

## Grenzen und naechste Optimierung

Die native Serverpruefung ist keine GUI-Pruefung von MySQL Workbench 6.3.10 oder 8.0.21 und keine Schul-PC-Abnahme. .mwb-Dateien und SQL-Dateien muessen ausserhalb der Browser-JSON-Sicherung gespeichert werden. Bei historischen Fallberichten werden belegte Fakten und Schlussfolgerungen unterschieden.

Die Unterrichtsfolge wird weiter auf Uebersichtlichkeit und leichte Verstaendlichkeit optimiert. Die Anzahl ausfuellbarer Aufgaben ist keine Garantie fuer einen passenden Stundenumfang; Transfer- und Zusatzaufgaben bleiben als solche gekennzeichnet beziehungsweise nach Absprache.
