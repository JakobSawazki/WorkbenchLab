# L5 Praktische Datenanalyse

L5.1 untersucht fiktive Portalaktivitaeten und Standortmeldungen mit LEFT JOIN,
COUNT und DISTINCT. Ein EER-Modell entsteht durch Reverse Engineering;
der organisatorische Datenfluss wird getrennt davon gezeichnet.

L5.2 verbindet die 3V-Erklaerung mit Ereigniszahlen pro Kalenderminute und
Qualitaetspruefungen von Mietdauern. NULL und 0 werden bewusst verschieden
behandelt. Der kleine Testbestand wird nicht als echter Big-Data-Betrieb oder
Leistungsbenchmark ausgegeben. NIST beschreibt Big Data auch im Zusammenhang
mit skalierbarer Verarbeitung, nicht anhand einer beliebigen Zeilenzahl:
[NIST Begriffsuebersicht](https://csrc.nist.gov/topics/technologies/big-data).

L5.3 untersucht Nachfrage je Station, Tageszahlen zusammen mit Wetterwerten
und eine didaktische Mindestgruppengroesse. Ein Urteil mit 180 bis 250 Woertern
nutzt mindestens zwei gepruefte SQL-Befunde, ein Gegenargument und drei
ueberpruefbare Bedingungen. Kleine Gruppen, drei Tage und fehlender Personenbezug
rechtfertigen weder individuelle Tarife noch Kausal- oder Anonymitaetsbehauptungen.

## Umgang mit Vorlagen

Die Konto-Selbstversuche aus L5_1 werden durch fiktive Daten ersetzt. Es werden
keine Google-, Social-Media- oder Schulprofile geoeffnet oder importiert.
Die historischen Berichte aus L5_3 bis L5_5 bleiben Gespraechsanlaesse,
nicht ungepruefte aktuelle Beschreibungen. Konkrete aktuelle Anbieter-Einstellungen,
Laenderdarstellungen oder medizinische Wirkungen werden nicht behauptet.

Der Cambridge-Analytica-Abschnitt beschraenkt sich auf den von der FTC 2019
festgestellten taeuschenden Datenzugang fuer Profilbildung und gezielte Ansprache.
Er behauptet keinen bewiesenen Einfluss auf einen konkreten Wahlausgang:
[FTC Feststellung 2019](https://www.ftc.gov/news-events/news/press-releases/2019/12/ftc-issues-opinion-order-against-cambridge-analytica-deceiving-consumers-about-collection-facebook).

## Bestand und Nachweise

Sechs Tabellen enthalten sechs Profile, zwoelf Aktivitaeten, acht Standortmeldungen,
vier Stationen, zehn Mieten und drei Wetterwerte. Die Miettabelle enthaelt bewusst
keinen Profilverweis. Alle Daten sind frei erfunden; Personen werden nicht bewertet.
Der Ausgangsbestand wird einmal eingerichtet und in allen drei Einheiten weitergenutzt.

`tests/data-analysis.test.js` prueft Feldzuordnung, FK-Regeln, Nullgruppen,
JOIN-Vervielfachung, Ereignisrate, unterschiedliche AVG-Grundgesamtheiten,
Gruppenunterdrueckung und Tagesaggregation mit konkreten erwarteten Ergebnissen.
SQL.js ersetzt keinen nativen MariaDB-Test. DATE_FORMAT wird nur fuer das
hier verwendete Minutenformat simuliert; ein nativer Test bleibt gesondert.

Die Schueler-Aufgaben verwenden eigene SQL-Skripte und speichern ihre Begruendung
in insgesamt 15 Aufgabenfeldern. Die Erweiterung bleibt lokal.

`tools/verify-l5.cjs` prueft alle drei Einheiten im Browser: Aufgabenfelder,
Wiederladen, Kurzchecks, SQL-Downloads, JSON-Sicherung und Desktop/Smartphone
mit beiden Darstellungsmodi. Dabei werden keine echten Profile veraendert.
