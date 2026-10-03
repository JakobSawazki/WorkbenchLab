# L2.1: Vom fachlichen Modell zum eigenen Workbench-Entwurf

## Unterrichtsfolge

1. Speicherredundanz und Aenderungsanomalie anhand der L1-Tabelle erklaeren.
2. Fachliches ERD ohne Software zeichnen, beide Leserichtungen formulieren und Relationen ableiten.
3. Browseraufgaben und Wissenscheck bearbeiten.
4. Eigene vollstaendige L1-Datei als L2_1_tabellenentwurf.mwb kopieren.
5. Zwei Tabellen im EER-Diagramm vorbereiten, alle nicht ausgelagerten L1-Attribute erhalten und erneut oeffnen.

Die Originalaufgaben L2_1 und L2_2.1 wurden lokal gelesen. Ihre fachliche Analyse, Begriffsarbeit und handgezeichnete Modellierung bleiben erhalten. Die anschliessende Workbench-Phase ist eine eigene Ergaenzung. Originaldateien und Loesungen wurden nicht veraendert.

## Bewusste Abgrenzung zu L2.2

In L2.1 ist ortnr bei fahrschueler eine geplante Verweisspalte, noch kein eingerichteter Foreign-Key-Constraint. Eine Textnotiz enthaelt die fachlichen Leserichtungen. Kein Serverzugriff durch Forward Engineering oder Synchronisierung.

L2.2 fuehrt die Datei als neue Kopie weiter, setzt die nicht-identifizierende Beziehung und prueft die vorhandene Spaltenzuordnung. Automatisch hinzugefuegte FK-Spalten werden erst nach korrekter Zuordnung entfernt. Erst danach folgen SQL-Vorschau, Freigabe und das getrennte Schema fahrschule_l2 mit den vorhandenen fiktiven Testdaten.

PK und FK sind INT; der obligatorische Wohnort wird durch NN an fahrschueler.ortnr dargestellt. Die fertige Beziehung gehoert nicht zum Primaerschluessel des Fahrschuelers. Die SQL-Datei aus L2.2 setzt die vollstaendigen L1-Attribute voraus, keine gekuerzte Uebungstabelle aus L1.1.

Die Bearbeitung von Fremdschluessel und Spaltenzuordnung im Tabelleneditor ist im [MySQL Workbench Manual](https://dev.mysql.com/doc/workbench/en/wb-table-editor-foreign-keys-tab.html) dokumentiert. Die Beziehungen im EER-Diagramm beschreibt das [Kapitel zu Foreign-Key-Beziehungen](https://dev.mysql.com/doc/workbench/en/wb-foreign-key-relationships.html). Das ersetzt keine native Versionspruefung auf dem Informatik-Stick.

## Nachweise

- Sechstes Antwortfeld fuer Dateiname, wieder geoeffnete Tabellen und die noch fehlende technische Beziehung.
- Eigene .mwb-Datei und unveraenderte L1-Datei; die JSON-Sicherung ersetzt keine Workbench-Datei.
- Inhaltspruefungen fuer die Weiterfuehrung L2.1 nach L2.2 und Workbench-Auftraege in allen 21 Lerneinheiten.
- Browserpruefung der Phasenfolge und der praktischen Aufgabe bei Desktop- und Mobilbreite.

Eine native Ausfuehrung in Workbench 6.3.10 beziehungsweise 8.0.21 ist noch nicht nachgewiesen.
