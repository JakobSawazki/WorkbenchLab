-- Fiktiver, eigenstaendiger Uebungsbestand fuer WorkbenchLab L1.9.
-- Keine Originaldaten und keine Musterloesungen. Nur einmal ausfuehren.
-- Voraussetzung: Erlaubnis, eine lokale Datenbank anzulegen.
-- Keine vorhandenen Tabellen oder Zeilen werden geloescht oder geaendert.
CREATE DATABASE IF NOT EXISTS workbenchlab_l1_9
  CHARACTER SET utf8mb4;
USE workbenchlab_l1_9;

CREATE TABLE fahrraeder (
  fahrradnr INT PRIMARY KEY,
  typ VARCHAR(30) NOT NULL,
  anschaffungspreis DECIMAL(10,2) NOT NULL,
  tagessatz DECIMAL(8,2) NOT NULL,
  anschaffungsdatum DATE NOT NULL
);

INSERT INTO fahrraeder
  (fahrradnr, typ, anschaffungspreis, tagessatz, anschaffungsdatum)
VALUES
  (1, 'Mountainbike', 1200.00, 18.50, '2020-11-15'),
  (2, 'Mountainbike', 1800.00, 24.00, '2022-03-10'),
  (3, 'Rennrad', 2400.00, 31.50, '2023-12-20'),
  (4, 'Rennrad', 1600.00, 22.00, '2021-01-05'),
  (5, 'Citybike', 600.00, 12.00, '2019-06-01'),
  (6, 'Trekkingrad', 900.00, 16.00, '2024-09-30');

SELECT fahrradnr, typ, anschaffungspreis, tagessatz, anschaffungsdatum
FROM fahrraeder
ORDER BY fahrradnr;
