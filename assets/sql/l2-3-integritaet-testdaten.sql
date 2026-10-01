-- Fiktiver Anfangsbestand fuer WorkbenchLab L2.3, keine Musterloesungen.
-- Nur einmal ausfuehren. Lokale Datenbankanlage muss erlaubt sein.
-- Die vorhandene L2.2-Datenbank bleibt unberuehrt; keine Ruecksetzbefehle.
CREATE DATABASE IF NOT EXISTS workbenchlab_l2_3
  CHARACTER SET utf8mb4;
USE workbenchlab_l2_3;

CREATE TABLE orte (
  ortnr INT PRIMARY KEY,
  plz VARCHAR(5) NOT NULL,
  ort VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE fahrlehrer (
  fahrlehrernr INT PRIMARY KEY,
  nachname VARCHAR(45) NOT NULL,
  vorname VARCHAR(45) NOT NULL,
  telefon VARCHAR(30),
  email VARCHAR(100),
  strasse VARCHAR(60),
  hausnr VARCHAR(10),
  geburtsdatum DATE,
  gehalt DECIMAL(10,2),
  wochenstunden INT,
  ortnr INT NOT NULL,
  CONSTRAINT fk_lehrer_ort FOREIGN KEY (ortnr) REFERENCES orte(ortnr)
    ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE fahrschueler (
  schuelernr INT PRIMARY KEY,
  nachname VARCHAR(45) NOT NULL,
  vorname VARCHAR(45) NOT NULL,
  telefon VARCHAR(30),
  email VARCHAR(100),
  strasse VARCHAR(60),
  hausnr VARCHAR(10),
  geburtsdatum DATE,
  fahrstundenzahl INT,
  ortnr INT NOT NULL,
  fahrlehrernr INT NOT NULL,
  CONSTRAINT fk_schueler_ort FOREIGN KEY (ortnr) REFERENCES orte(ortnr)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_schueler_lehrer FOREIGN KEY (fahrlehrernr) REFERENCES fahrlehrer(fahrlehrernr)
    ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

INSERT INTO orte (ortnr, plz, ort) VALUES
  (101, '00101', 'Musterstadt'), (102, '00102', 'Testdorf');
INSERT INTO fahrlehrer
  (fahrlehrernr, nachname, vorname, telefon, email, strasse, hausnr,
   geburtsdatum, gehalt, wochenstunden, ortnr)
VALUES
  (201, 'Demo', 'Iris', '0000000201', 'iris@example.invalid',
   'Testweg', '1', '1980-01-01', 2400.00, 40, 101),
  (202, 'Probe', 'Noah', '0000000202', 'noah@example.invalid',
   'Musterweg', '2', '1985-02-02', 2200.00, 35, 102);
INSERT INTO fahrschueler
  (schuelernr, nachname, vorname, telefon, email, strasse, hausnr,
   geburtsdatum, fahrstundenzahl, ortnr, fahrlehrernr)
VALUES
  (1, 'Kontrolle', 'Ada', '0000000001', 'ada@example.invalid',
   'Kontrollweg', '1', '2000-01-01', 4, 101, 201);

SELECT ortnr, plz, ort FROM orte ORDER BY ortnr;
SELECT fahrlehrernr, nachname, ortnr FROM fahrlehrer ORDER BY fahrlehrernr;
SELECT schuelernr, nachname, ortnr, fahrlehrernr
FROM fahrschueler ORDER BY schuelernr;
