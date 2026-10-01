-- Fiktiver, getrennter Anfangsbestand fuer WorkbenchLab L2.4.
-- Nur einmal anlegen. Lokale Datenbankanlage muss erlaubt sein.
-- Keine bestehenden Datenbanken werden geloescht oder zurueckgesetzt.
CREATE DATABASE IF NOT EXISTS workbenchlab_l2_4
  CHARACTER SET utf8mb4;
USE workbenchlab_l2_4;

CREATE TABLE orte (
  ortnr INT PRIMARY KEY, plz VARCHAR(5) NOT NULL, ort VARCHAR(45) NOT NULL
) ENGINE=InnoDB;
CREATE TABLE fahrlehrer (
  fahrlehrernr INT PRIMARY KEY, nachname VARCHAR(45) NOT NULL,
  vorname VARCHAR(45) NOT NULL, strasse VARCHAR(60), hausnr VARCHAR(10),
  ortnr INT NOT NULL,
  FOREIGN KEY (ortnr) REFERENCES orte(ortnr) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;
CREATE TABLE fahrschueler (
  schuelernr INT PRIMARY KEY, nachname VARCHAR(45) NOT NULL,
  vorname VARCHAR(45) NOT NULL, strasse VARCHAR(60), hausnr VARCHAR(10),
  geburtsdatum DATE NOT NULL, fahrstundenzahl INT NOT NULL,
  ortnr INT NOT NULL, fahrlehrernr INT NOT NULL,
  FOREIGN KEY (ortnr) REFERENCES orte(ortnr) ON DELETE RESTRICT ON UPDATE RESTRICT,
  FOREIGN KEY (fahrlehrernr) REFERENCES fahrlehrer(fahrlehrernr) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

INSERT INTO orte (ortnr,plz,ort) VALUES
  (101,'00101','Musterstadt'),(102,'00102','Testdorf'),
  (103,'00103','Beispielheim'),(104,'00104','Talort'),(105,'00105','Leerort');
INSERT INTO fahrlehrer (fahrlehrernr,nachname,vorname,strasse,hausnr,ortnr) VALUES
  (201,'Demo','Iris','Testweg','1',101),
  (202,'Probe','Noah','Musterweg','2',102),
  (203,'Fiktiv','Tari','Demoweg','3',103),
  (204,'Reserve','Ria','Testpfad','4',104);
INSERT INTO fahrschueler
  (schuelernr,nachname,vorname,strasse,hausnr,geburtsdatum,fahrstundenzahl,ortnr,fahrlehrernr)
VALUES
  (1,'Kontrolle','Ada','Testweg','1','2008-03-12',4,101,201),
  (2,'Muster','Ben','Testweg','2','2007-11-05',12,101,201),
  (3,'Demo','Cem','Musterweg','3','2008-07-21',0,101,202),
  (4,'Probe','Dana','Musterweg','4','2006-09-02',25,102,202),
  (5,'Beispiel','Eli','Demoweg','5','2007-01-18',7,102,203),
  (6,'Fiktiv','Fia','Demoweg','6','2008-02-20',18,103,203),
  (7,'Test','Gio','Testpfad','7','2009-12-10',10,104,202),
  (8,'Muster','Hana','Testpfad','8','2006-06-15',8,104,201),
  (9,'Probe','Ivo','Testweg','9','2007-04-01',16,102,202);

SELECT schuelernr,nachname,ortnr,fahrlehrernr FROM fahrschueler ORDER BY schuelernr;
