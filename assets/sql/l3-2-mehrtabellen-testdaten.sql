-- WorkbenchLab L3.2: ausschliesslich fiktive Unterrichtsdaten.
-- Einmal ausfuehren. Keine bestehenden Tabellen werden geloescht oder ersetzt.
-- Danach das zum Auftrag passende Schema waehlen.
CREATE DATABASE IF NOT EXISTS workbenchlab_l3_2_fahrschule
  CHARACTER SET utf8mb4;
USE workbenchlab_l3_2_fahrschule;

CREATE TABLE orte (
  ortnr INT PRIMARY KEY,
  plz VARCHAR(5),
  ort VARCHAR(45)
) ENGINE=InnoDB;
CREATE TABLE fahrlehrer (
  fahrlehrernr INT PRIMARY KEY,
  nachname VARCHAR(45), vorname VARCHAR(45),
  telefon VARCHAR(45), email VARCHAR(45), strasse VARCHAR(45), hausnr VARCHAR(4),
  geburtsdatum DATE, gehalt DECIMAL(10,2), arbeitszeit DECIMAL(5,2),
  ortnr INT NOT NULL,
  FOREIGN KEY (ortnr) REFERENCES orte(ortnr)
) ENGINE=InnoDB;
CREATE TABLE fahrschueler (
  schuelernr INT PRIMARY KEY,
  nachname VARCHAR(45), vorname VARCHAR(45),
  telefon VARCHAR(45), email VARCHAR(45), strasse VARCHAR(45), hausnr VARCHAR(4),
  geburtsdatum DATE,
  ortnr INT NOT NULL,
  FOREIGN KEY (ortnr) REFERENCES orte(ortnr)
) ENGINE=InnoDB;
CREATE TABLE kfz (
  kfznr INT PRIMARY KEY,
  kennzeichen VARCHAR(45), anschaffungsdatum DATE,
  anschaffungspreis DECIMAL(10,2)
) ENGINE=InnoDB;
CREATE TABLE fahrstunden (
  fahrstundennr INT PRIMARY KEY,
  datum DATE, stundenzahl INT,
  fahrlehrernr INT NOT NULL, kfznr INT NOT NULL, schuelernr INT NOT NULL,
  FOREIGN KEY (fahrlehrernr) REFERENCES fahrlehrer(fahrlehrernr),
  FOREIGN KEY (kfznr) REFERENCES kfz(kfznr),
  FOREIGN KEY (schuelernr) REFERENCES fahrschueler(schuelernr)
) ENGINE=InnoDB;
INSERT INTO orte VALUES (1,'00001','Musterstadt'),(2,'00002','Testdorf');
INSERT INTO fahrlehrer VALUES
 (1,'Probe','Mara',NULL,NULL,'Testweg','1','1980-01-01',3000,40,1),
 (2,'Demo','Tari',NULL,NULL,'Testweg','2','1985-02-01',2400,30,2),
 (3,'Fiktiv','Nuri',NULL,NULL,'Testweg','3','1983-03-01',2700,35,1);
INSERT INTO fahrschueler VALUES
 (1,'Probe','Andreas',NULL,NULL,'Testweg','11','2000-12-31',1),
 (2,'Demo','Mia',NULL,NULL,'Testweg','12','2001-01-01',1),
 (3,'Fiktiv','Hakan',NULL,NULL,'Testweg','13','1999-06-20',2),
 (4,'Test','Lina',NULL,NULL,'Testweg','14','2001-12-31',2);
INSERT INTO kfz VALUES
 (1,'DEMO-001','2018-01-01',20000),
 (2,'DEMO-002','2018-02-01',24000),
 (3,'DEMO-003','2018-03-01',26000);
INSERT INTO fahrstunden VALUES
 (1,'2019-01-05',2,1,1,1),
 (2,'2019-01-05',1,1,2,2),
 (3,'2019-01-06',1,2,1,1),
 (4,'2019-02-01',3,1,2,3),
 (5,'2019-02-02',2,2,1,1),
 (6,'2019-02-02',1,3,2,3),
 (7,'2019-01-06',1,1,1,2),
 (8,'2019-03-01',1,1,2,4);

CREATE DATABASE IF NOT EXISTS workbenchlab_l3_2_fahrradvermietung
  CHARACTER SET utf8mb4;
USE workbenchlab_l3_2_fahrradvermietung;

CREATE TABLE orte (
  ortnr INT PRIMARY KEY, plz VARCHAR(5), ort VARCHAR(45)
) ENGINE=InnoDB;
CREATE TABLE fahrradarten (
  artnr INT PRIMARY KEY, bezeichnung VARCHAR(50)
) ENGINE=InnoDB;
CREATE TABLE hersteller (
  herstellernr INT PRIMARY KEY, herstellername VARCHAR(30), portal VARCHAR(50)
) ENGINE=InnoDB;
CREATE TABLE kunden (
  kundennr INT PRIMARY KEY, nachname VARCHAR(30), vorname VARCHAR(30),
  strasse VARCHAR(30), ortnr INT NOT NULL,
  FOREIGN KEY (ortnr) REFERENCES orte(ortnr)
) ENGINE=InnoDB;
CREATE TABLE modelle (
  modellnr INT PRIMARY KEY, bezeichnung VARCHAR(50), tagesmietpreis DECIMAL(8,2),
  artnr INT NOT NULL, herstellernr INT NOT NULL,
  FOREIGN KEY (artnr) REFERENCES fahrradarten(artnr),
  FOREIGN KEY (herstellernr) REFERENCES hersteller(herstellernr)
) ENGINE=InnoDB;
CREATE TABLE fahrraeder (
  fahrradnr INT PRIMARY KEY, rahmennr VARCHAR(20),
  anschaffungswert DECIMAL(10,2), kaufdatum DATE NOT NULL, modellnr INT NOT NULL,
  FOREIGN KEY (modellnr) REFERENCES modelle(modellnr)
) ENGINE=InnoDB;
CREATE TABLE vermietungen (
  vermietnr INT PRIMARY KEY, von DATE, bis DATE,
  fahrradnr INT NOT NULL, kundennr INT NOT NULL,
  FOREIGN KEY (fahrradnr) REFERENCES fahrraeder(fahrradnr),
  FOREIGN KEY (kundennr) REFERENCES kunden(kundennr)
) ENGINE=InnoDB;
INSERT INTO orte VALUES (1,'00001','Freiburg'),(2,'00002','Testdorf');
INSERT INTO fahrradarten VALUES
 (1,'Trekkingrad'),(2,'Lastenrad'),(3,'Unbelegte Art');
INSERT INTO hersteller VALUES (1,'Demo-Rad',NULL);
INSERT INTO kunden VALUES
 (1,'Probe','Mia','Testweg 1',1),
 (2,'Demo','Tari','Testweg 2',1),
 (3,'Fiktiv','Nuri','Testweg 3',2),
 (4,'Test','Lina','Testweg 4',2);
INSERT INTO modelle VALUES
 (1,'Demo Basis',10,1,1),(2,'Demo Komfort',20,1,1),(3,'Demo Transport',30,2,1);
INSERT INTO fahrraeder VALUES
 (1,'DEMO-R001',400,'2018-01-01',1),
 (2,'DEMO-R002',600,'2018-01-01',1),
 (3,'DEMO-R003',1000,'2018-02-01',2),
 (4,'DEMO-R004',2000,'2018-03-01',3),
 (5,'DEMO-R005',1200,'2018-02-01',2);
-- Mietbeginn inklusive, Mietende exklusive; keine Preiswechsel im Testbestand.
INSERT INTO vermietungen VALUES
 (1,'2019-01-01','2019-01-11',1,1),
 (2,'2019-01-11','2019-01-21',1,1),
 (3,'2019-01-21','2019-01-31',1,1),
 (4,'2019-01-31','2019-02-10',1,1),
 (5,'2019-02-10','2019-02-20',1,1),
 (6,'2019-02-20','2019-03-02',1,1),
 (7,'2019-01-01','2019-01-02',3,2),
 (8,'2019-01-02','2019-01-03',3,2),
 (9,'2019-01-03','2019-01-04',3,2),
 (10,'2019-01-04','2019-01-05',3,2),
 (100,'2019-01-05','2019-01-06',3,2),
 (11,'2019-01-01','2019-01-06',2,3),
 (12,'2019-01-06','2019-01-11',2,3),
 (13,'2019-01-11','2019-01-21',2,3),
 (14,'2019-01-21','2019-01-31',2,3),
 (15,'2019-01-31','2019-02-05',2,3),
 (133,'2019-02-05','2019-02-10',2,3);
-- Fuer F1-F10 zuvor: USE workbenchlab_l3_2_fahrschule;
-- Fuer R1-R16: USE workbenchlab_l3_2_fahrradvermietung;
