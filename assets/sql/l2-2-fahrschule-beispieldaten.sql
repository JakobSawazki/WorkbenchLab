-- Fiktive Testdaten fuer WorkbenchLab L2.2 (zwei Tabellen).
-- Voraussetzung: Die Lehrkraft hat das neue Schema fahrschule_l2 geprueft.
-- Tabellen: orte(ortnr, plz, ort) und fahrschueler mit ortnr als Fremdschluessel.
-- Dieses Skript nur einmal in einem leeren L2-Schema ausfuehren.

USE fahrschule_l2;

INSERT INTO orte (ortnr, plz, ort) VALUES
  (101, '00001', 'Musterstadt'),
  (102, '00002', 'Testdorf'),
  (103, '00003', 'Beispielheim');

INSERT INTO fahrschueler
  (schuelernr, nachname, vorname, telefon, email, strasse, hausnr,
   geburtsdatum, fahrstundenzahl, ortnr)
VALUES
  (1, 'Adler', 'Mia', '0000000001', 'mia@example.invalid',
   'Musterweg', '1', '2007-03-12', 4, 101),
  (2, 'Bauer', 'Cem', '0000000002', 'cem@example.invalid',
   'Feldweg', '2', '2007-11-05', 12, 101),
  (3, 'Cordes', 'Lea', '0000000003', 'lea@example.invalid',
   'Parkweg', '3', '2008-07-21', 7, 102),
  (4, 'Dorn', 'Ben', '0000000004', 'ben@example.invalid',
   'Ringweg', '4', '2008-09-02', 0, 102),
  (5, 'Eilers', 'Nora', '0000000005', 'nora@example.invalid',
   'Bergweg', '5', '2006-01-18', 25, 103);

SELECT COUNT(*) AS anzahl_orte FROM orte;
SELECT COUNT(*) AS anzahl_fahrschueler FROM fahrschueler;

SELECT f.schuelernr, f.nachname, o.plz, o.ort
FROM fahrschueler AS f
JOIN orte AS o ON f.ortnr = o.ortnr
ORDER BY f.schuelernr;
