# L3.3: 3NF-Modelle und SQL-Nachweise

## Materialbezug

Die Einheit verarbeitet die vorhandene Information zu 3NF und alle fuenf
Aufgabenfaelle: Kfz-Haendler, Speisen/Zusatzstoffe, Warenlieferungen,
Projektverwaltung und Pruefung zweier Pizzeria-Modelle. Die Quellen sind in
der Einheit einzeln aufgefuehrt; Originaldateien und Loesungsmodelle bleiben
ausserhalb der veroeffentlichten Assets.

Die sieben Aufgabenblatt-Gruppen enthalten 20 speicherbare Antworten. Nach
Information und Uebungen entwickeln die Lernenden ein Haendlermodell und
einen Transferfall in Workbench. Die weiteren Faelle bleiben fuer Vertiefung
zugaenglich. Erwartet werden zwei eigene .mwb-Dateien, exportierte CREATE-
Skripte und gespeicherte SQL-Pruefabfragen.

## Bewusste fachliche Anpassungen

- Abhaengigkeiten werden als Geschaeftsregeln vorgegeben oder begruendet;
  zufaellig eindeutige Werte begruenden keinen Kandidatenschluessel.
- 2NF bezieht sich auf alle Kandidatenschluessel, nicht nur den gewaehlten PK.
  3NF wird mit Superschluessel beziehungsweise primaerem Attribut erklaert.
  Fremdschluessel und 3NF sind getrennte Eigenschaften.
- Alle Personen, Kontakte, Adressen und Zusatzstoffcodes sind fiktiv.
  Z-Codes vermeiden Aussagen zu realen Lebensmittelzulassungen.
- Unterschiedliche Lieferpreise bleiben Werte der Lieferposition.
  Unterschiedliche Lieferantentelefone werden im Uebungsbestand ausdruecklich
  als historische Kontakte der Lieferung aufgefasst und beide erhalten.
- Abteilungsgesamtzahlen beschreiben einen vorgegebenen Stand, nicht die
  Anzahl der drei Personen im Ausgangsausschnitt.
- Das Pizzeria-Grundmodell darf unter den genannten Abhaengigkeiten als
  3NF-konform bewertet werden. Fehlende Paar-Eindeutigkeit ist eine separate
  Geschaeftsregel. Die Erweiterung hat hingegen bewusst eine transitive
  Abhaengigkeit ueber den Fahrzeughaendler.
- UNIQUE auf der Bestellung begrenzt Auslieferungen auf hoechstens eine;
  es erzwingt nicht, dass jede Bestellung bereits ausgeliefert ist.
  Zwei Orte teilen dieselbe PLZ, damit PLZ nicht als Ortsschluessel gilt.

## Pruefung und Grenzen

Der Download `assets/sql/l3-3-normalisierung-ausgangsdaten.sql` erstellt nur
ein eigenes Ausgangsschema mit vier rohen und zehn Pizzeria-Tabellen. Er
enthaelt keine fertigen Zielzerlegungen, keine DROP-Anweisungen und keine
Abschaltung von Fremdschluesselpruefungen.

`tests/third-normal-form.test.js` prueft die 20 Aufgaben, 14 Tabellen und neun
Ausgangs-FKs. Fuer jeden der fuenf Faelle werden Referenzzerlegungen in einer
isolierten SQL.js-Datenbank angelegt und jedes Attribut der Ausgangszeilen per
JOIN verglichen. Weitere Tests pruefen doppelte Paare, ungueltige Verweise,
Lieferpreise, Kontaktwechsel, Projektarbeitstage und Abteilungsgesamtzahlen.
Diese Referenzmodelle stehen nur im Testcode, nicht im Schueler-Download.

Die Ergebnisse belegen die Rekonstruktion des Testbestands, nicht einen
allgemeinen Normalform- oder Verlustfreiheitsbeweis fuer beliebige Daten.
Im Unterricht gehoert die Begruendung aus den Abhaengigkeiten weiterhin dazu.
Die SQL.js-Pruefung entfernt MySQL-Schema- und Engine-Syntax; sie ersetzt
keinen nativen Test mit MariaDB und Schul-Workbench 6.3.10.

`tools/verify-l3-3.cjs` prueft Aufgabenfelder, Aufklappgruppen, Wiederladen,
JSON-Sicherung, SQL-Download, Kurzcheck und Desktop/Smartphone in beiden Themes.
Die Aenderungen bleiben lokal.
