-- Fiktiver Anfangsbestand fuer WorkbenchLab L1.10, keine Musterloesungen.
-- Nur einmal ausfuehren. Voraussetzung: lokale Datenbankanlage ist erlaubt.
-- Aufgaben ausschliesslich hier, nicht an den Daten aus L1.4 oder L1.9.
-- Vorhandene Tabellen werden weder geloescht noch zurueckgesetzt.
CREATE DATABASE IF NOT EXISTS workbenchlab_l1_10
  CHARACTER SET utf8mb4;
USE workbenchlab_l1_10;

CREATE TABLE fahrschueler (
  schuelernr INT PRIMARY KEY,
  nachname VARCHAR(45) NOT NULL,
  vorname VARCHAR(45) NOT NULL,
  telefon VARCHAR(30),
  email VARCHAR(100),
  strasse VARCHAR(60),
  hausnr VARCHAR(10),
  plz VARCHAR(5),
  ort VARCHAR(45),
  geburtsdatum DATE,
  fahrstundenzahl INT
) ENGINE=InnoDB;

INSERT INTO fahrschueler
  (schuelernr, nachname, vorname, telefon, email, strasse, hausnr,
   plz, ort, geburtsdatum, fahrstundenzahl)
VALUES (1, 'Kontrolle', 'Ada', '0000000001', 'ada@example.invalid',
        'Kontrollweg', '1', '00001', 'Teststadt', '2000-01-01', 4);

CREATE TABLE fahrraeder (
  fahrradnr INT PRIMARY KEY,
  modell VARCHAR(50) NOT NULL,
  typ VARCHAR(30) NOT NULL,
  rahmennr VARCHAR(30) NOT NULL UNIQUE,
  anschaffungspreis DECIMAL(10,2) NOT NULL,
  tagessatz DECIMAL(8,2),
  anschaffungsdatum DATE NOT NULL
) ENGINE=InnoDB;

INSERT INTO fahrraeder
  (fahrradnr, modell, typ, rahmennr, anschaffungspreis, tagessatz, anschaffungsdatum)
VALUES
  (1, 'Test-Trail', 'Mountainbike', 'TEST-1', 1200.00, 18.50, '2013-11-15'),
  (5, 'Test-City', 'Citybike', 'TEST-5', 600.00, 12.00, '2014-06-01'),
  (16, 'Test-Race', 'Rennrad', 'TEST-16', 1600.00, 22.00, '2015-01-05'),
  (30, 'Test-Spezial A', 'Spezialrad', 'TEST-30', 1500.00, 25.00, '2016-04-01'),
  (31, 'Test-Spezial B', 'Spezialrad', 'TEST-31', 1700.00, 28.00, '2017-04-01'),
  (40, 'Test-Tour', 'Trekkingrad', 'TEST-40', 900.00, 16.00, '2015-09-30'),
  (41, 'Test-Berg', 'Mountainbike', 'TEST-41', 1800.00, 24.00, '2017-03-10'),
  (50, 'Test-Kind', 'Kinderfahrrad', 'TEST-50', 300.00, 8.00, '2016-05-01'),
  (51, 'Test-Billig', 'Citybike', 'TEST-51', 99.00, 5.00, '2016-05-01'),
  (52, 'Test-Grenze', 'Citybike', 'TEST-52', 100.00, 5.00, '2014-05-01');

SELECT schuelernr, nachname, vorname FROM fahrschueler ORDER BY schuelernr;
SELECT fahrradnr, typ, anschaffungspreis, tagessatz, anschaffungsdatum
FROM fahrraeder ORDER BY fahrradnr;
