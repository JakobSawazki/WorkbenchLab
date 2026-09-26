-- Fiktive Unterrichtsdaten fuer WorkbenchLab L1.4.
-- Voraussetzung: Schema fahrschule und Tabelle fahrschueler aus dem eigenen Modell.
-- Dieses Skript genau einmal ausfuehren; erneutes INSERT verletzt den Primaerschluessel.

USE fahrschule;

INSERT INTO fahrschueler
  (schuelernr, nachname, vorname, telefon, email, strasse, hausnr,
   plz, ort, geburtsdatum, fahrstundenzahl)
VALUES
  (1, 'Muster', 'Ada', '0000000001', 'ada@example.invalid',
   'Musterweg', '1', '00001', 'Schorndorf', '1999-03-12', 4),
  (2, 'Dressel', 'Ben', '0000000002', 'ben@example.invalid',
   'Drosselweg', '2', '00002', 'Schorndorf', '2000-11-05', 22),
  (3, 'Dressel', 'Cem', '0000000003', 'cem@example.invalid',
   'Testweg', '3', '00001', 'Testort', '2001-07-21', 7),
  (4, 'Demo', 'Dana', '0000000004', 'dana@example.invalid',
   'Drosselweg', '4', '00003', 'Schorndorf', '2002-09-02', 0),
  (5, 'Muster', 'Eli', '0000000005', 'eli@example.invalid',
   'Musterweg', '5', '00002', 'Demodorf', '2003-01-18', 25);

SELECT * FROM fahrschueler;
SELECT COUNT(*) AS anzahl FROM fahrschueler;
