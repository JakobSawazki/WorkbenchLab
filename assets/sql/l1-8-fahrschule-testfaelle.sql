-- Fiktive Zusatzdaten fuer WorkbenchLab L1.8, keine Musterloesungen.
-- Voraussetzung: eigenes Modell und die fuenf Beispieldatensaetze aus L1.4.
-- Genau einmal ausfuehren. IDs 9001 bis 9006 muessen noch frei sein.
-- Vorhandene Zeilen bleiben unveraendert; keine Tabellen werden geloescht.
-- PLZ und Kontaktdaten sind absichtlich fiktiv. Preis in den Aufgaben: 30 Euro.
USE fahrschule;

INSERT INTO fahrschueler
  (schuelernr, nachname, vorname, telefon, email, strasse, hausnr,
   plz, ort, geburtsdatum, fahrstundenzahl)
VALUES
  (9001, 'Probe', 'Fia', '0000009001', 'fia@example.invalid',
   'Testweg', '1', '73601', 'Welzheim', '2000-01-01', 2),
  (9002, 'Probe', 'Gio', '0000009002', 'gio@example.invalid',
   'Testweg', '2', '73601', 'Welzheim', '2001-01-01', 18),
  (9003, 'Beispiel', 'Hana', '0000009003', 'hana@example.invalid',
   'Musterweg', '3', '73602', 'Lorch', '2000-02-01', 1),
  (9004, 'Beispiel', 'Ivo', '0000009004', 'ivo@example.invalid',
   'Musterweg', '4', '73602', 'Lorch', '2001-02-01', 2),
  (9005, 'Test', 'Juna', '0000009005', 'juna@example.invalid',
   'Testweg', '5', '73603', 'Plüderhausen', '2000-03-01', 12),
  (9006, 'Test', 'Kai', '0000009006', 'kai@example.invalid',
   'Musterweg', '6', '73604', 'Schorndorf', '2001-03-01', 3);

SELECT schuelernr, ort, plz, fahrstundenzahl
FROM fahrschueler
ORDER BY schuelernr;
