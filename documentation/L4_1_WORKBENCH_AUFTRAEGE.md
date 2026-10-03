# L4.1 Normalisierung mit Zwischenstufen

## Quellen und Umsetzung

L4_1 Grundlagen, L4_2.1 Erste Normalform, L4_2.2 Zweite Normalform,
L4_2.3 Dritte Normalform und L4_3 Tanzschule werden als 13 Aufgaben in fuenf
aufklappbaren Gruppen verarbeitet. Nach Information und Uebungen erstellen
die Lernenden fuer Filmstudio und Tanzschule je drei eigene EER-Stufenmodelle.
SQL-Zielschemata werden getrennt vom Listen-Ausgangsbestand angelegt.

Der Download enthaelt zwei absichtlich unnormalisierte Tabellen. Ihre Listen
sind positionsweise verknuepft; unabhaengiges Kombinieren der Eintraege wuerde
falsche Besetzungen oder Anmeldungen erzeugen. Das Filmstudio ergibt fuenf
Besetzungen, die Tanzschule 28 Anmeldungen fuer sieben Angebote und 16 Personen.

## Fachliche Entscheidungen

- Alle Namen, Kontakte und Filmtitel sind fiktiv. Die Vorlagen enthalten
  unterschiedliche Vornamen fuer dieselbe Schauspielernummer; der neue Bestand
  verwendet durchgaengige Identitaeten und thematisiert die Entscheidung.
- Pro Person und Film gilt zunaechst hoechstens eine Rolle. Eine Aufgabe prueft,
  welche Schluesselregel bei mehreren Rollen angepasst werden muss.
- Filmnummer bestimmt Titel und Kategorie, Kategorienummer den Kategorienamen.
  Die 2NF-Stufe behaelt diese transitive Abhaengigkeit bewusst fuer den naechsten
  Schritt; die 3NF-Stufe trennt Kategorien.
- Kursnummer identifiziert das konkrete Angebot. Tanzstil allein identifiziert
  weder Lehrkraft, Termine noch Preis. Der zweite Foxtrott-Preis wurde gegenueber
  der Vorlage gezielt veraendert, damit dieser Unterschied im Test sichtbar ist.
- Ein Kurs hat eine Lehrkraft; diese kann mehrere Angebote durchfuehren. Ein
  Schueler kann mehrere Kurse besuchen, aber jedes Kurs-Person-Paar nur einmal.
- Drei Stufen sind der Unterrichtsumfang; die Einheit behauptet nicht, dass es
  insgesamt nur drei Normalformen gibt. Kandidatenschluessel und Geschaeftsregeln
  werden ausdruecklich beruecksichtigt.

## Nachweise und Grenzen

`tests/normalization-stages.test.js` prueft die Listenzuordnungen gegen explizite
Besetzungs- und Anmeldungslisten. Es erzeugt unabhaengige 1NF-, 2NF- und
3NF-Referenzmodelle fuer beide Faelle und vergleicht jeweils alle Ausgangswerte
nach JOIN-Rekonstruktion. PK/FK-Regeln weisen doppelte Paare und ungueltige
Verweise ab. Ein neues Angebot ohne Anmeldung laesst sich separat speichern.

Die Referenzzerlegungen stehen nur im Testcode, nicht im Download. SQL.js
prueft die Datenlogik nach Entfernung von Schema-/Engine-Syntax. Das ist kein
nativer MariaDB-/Workbench-6.3.10-Test und kein allgemeiner Verlustfreiheitsbeweis;
im Unterricht bleibt die Begruendung aus den Abhaengigkeiten erforderlich.

Die Originaldateien und Loesungsmodelle bleiben unveraendert und ausserhalb
der oeffentlichen Assets. Die Erweiterung bleibt vorerst lokal.

`tools/verify-l4-1.cjs` prueft die 13 sichtbaren Aufgabenfelder, fuenf Gruppen,
Wiederladen, SQL-Download, die angepasste Uebung samt Rueckweg, Kurzcheck und
JSON-Sicherung. Desktop und Smartphone werden auf Ueberlaeufe geprueft;
Theme-Aufnahmen verwenden den echten Dark-/Light-Schalter.
