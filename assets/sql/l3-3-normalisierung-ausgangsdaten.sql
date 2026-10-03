-- WorkbenchLab L3.3: fiktive Ausgangsdaten, keine fertige 3NF-Zerlegung.
-- Einmal ausfuehren; keine frueheren Unterrichtsdaten werden ersetzt.
-- Die roh-Tabellen sind bereits entnestet. Eigene Zielmodelle getrennt anlegen.
CREATE DATABASE IF NOT EXISTS workbenchlab_l3_3 CHARACTER SET utf8mb4;
USE workbenchlab_l3_3;

CREATE TABLE haendler_roh (
  kfznr INT PRIMARY KEY, kennzeichen VARCHAR(20),
  haendlernr INT NOT NULL, firma VARCHAR(50), telefon VARCHAR(20),
  modellnr INT NOT NULL, modellbezeichnung VARCHAR(30), marke VARCHAR(30),
  kaufdatum DATE, kaufpreis DECIMAL(10,2)
) ENGINE=InnoDB;
INSERT INTO haendler_roh VALUES
 (1,'DEMO-101',1,'Demo-Auto','DEMO-TEL-A',11,'Modell A','Demo-Marke','2020-01-01',12000),
 (2,'DEMO-102',1,'Demo-Auto','DEMO-TEL-A',11,'Modell A','Demo-Marke','2020-02-01',13000),
 (3,'DEMO-103',1,'Demo-Auto','DEMO-TEL-A',12,'Modell B','Demo-Marke','2020-03-01',18000),
 (4,'DEMO-104',2,'Test-Garage','DEMO-TEL-B',13,'Modell C','Test-Marke','2020-04-01',19000);

CREATE TABLE speisen_roh (
  speisenr INT NOT NULL, speisebezeichnung VARCHAR(40), preis DECIMAL(8,2),
  stoffnr VARCHAR(4) NOT NULL, stoffbezeichnung VARCHAR(30),
  kategorie_kuerzel VARCHAR(4), kategoriebezeichnung VARCHAR(30),
  PRIMARY KEY (speisenr, stoffnr)
) ENGINE=InnoDB;
-- Z-Codes und Stoffnamen sind frei erfunden, keine E-Nummern oder Zulassungshinweise.
INSERT INTO speisen_roh VALUES
 (1,'Demo-Speise A',2.00,'Z1','Demo-Stoff A','K1','Demo-Kategorie A'),
 (1,'Demo-Speise A',2.00,'Z2','Demo-Stoff B','K1','Demo-Kategorie A'),
 (2,'Demo-Speise B',3.00,'Z1','Demo-Stoff A','K1','Demo-Kategorie A'),
 (2,'Demo-Speise B',3.00,'Z3','Demo-Stoff C','K2','Demo-Kategorie B'),
 (3,'Demo-Speise C',4.00,'Z3','Demo-Stoff C','K2','Demo-Kategorie B');

CREATE TABLE lieferungen_roh (
  liefnr INT NOT NULL, artnr INT NOT NULL,
  lieferernr INT NOT NULL, firma VARCHAR(40), ort VARCHAR(30),
  kontakttelefon VARCHAR(20), lieferdatum DATE,
  artikel VARCHAR(40), menge INT, stueckpreis DECIMAL(8,2),
  PRIMARY KEY (liefnr, artnr)
) ENGINE=InnoDB;
-- Ein Artikel hoechstens einmal je Lieferung.
-- kontakttelefon ist der historische Kontakt DIESER Lieferung.
INSERT INTO lieferungen_roh VALUES
 (1,101,1,'Demo-Lieferant','Musterstadt','DEMO-TEL-A','2020-11-20','Demo-Riegel',25,0.90),
 (2,101,2,'Test-Lieferant','Testdorf','DEMO-TEL-B','2020-12-03','Demo-Riegel',75,0.85),
 (2,102,2,'Test-Lieferant','Testdorf','DEMO-TEL-B','2020-12-03','Demo-Milch',15,0.50),
 (3,101,2,'Test-Lieferant','Testdorf','DEMO-TEL-C','2020-12-18','Demo-Riegel',55,0.80);

CREATE TABLE projekte_roh (
  mitarbeiternr INT NOT NULL, vorname VARCHAR(30), nachname VARCHAR(30), email VARCHAR(60),
  projektnr INT NOT NULL, projektname VARCHAR(40), projekt_startdatum DATE,
  arbeitstage INT, abteilungsnr INT, abteilungsbezeichnung VARCHAR(30),
  gesamte_mitarbeiterzahl INT,
  PRIMARY KEY (mitarbeiternr, projektnr)
) ENGINE=InnoDB;
-- Ausschnitt von drei Personen; Gesamtzahlen sind separate Vorgaben zum selben Stand.
INSERT INTO projekte_roh VALUES
 (1,'Mara','Probe','mara@example.invalid',1,'Demo-Projekt A','2018-04-01',69,1,'Fertigung',33),
 (2,'Tari','Demo','tari@example.invalid',2,'Demo-Projekt B','2018-09-10',23,2,'Montage',22),
 (2,'Tari','Demo','tari@example.invalid',3,'Demo-Projekt C','2019-02-23',78,2,'Montage',22),
 (3,'Nuri','Fiktiv','nuri@example.invalid',3,'Demo-Projekt C','2019-02-23',105,1,'Fertigung',33);

-- Nachgestellte Pizzeria-Pruefmodelle; Stammdaten je Nummer sind eindeutig.
CREATE TABLE pizza_kunden (
  k_nr INT PRIMARY KEY, nachname VARCHAR(45), telefon VARCHAR(45), email VARCHAR(60)
) ENGINE=InnoDB;
CREATE TABLE pizza_bestellungen (
  best_nr INT PRIMARY KEY, k_nr INT NOT NULL, bestelldatum DATE,
  FOREIGN KEY (k_nr) REFERENCES pizza_kunden(k_nr)
) ENGINE=InnoDB;
CREATE TABLE pizza_pizzen (
  p_nr INT PRIMARY KEY, pizzaname VARCHAR(45), preis DECIMAL(8,2)
) ENGINE=InnoDB;
CREATE TABLE pizza_bestellpositionen (
  bes_pos_nr INT PRIMARY KEY, best_nr INT NOT NULL, p_nr INT NOT NULL, anzahl INT,
  FOREIGN KEY (best_nr) REFERENCES pizza_bestellungen(best_nr),
  FOREIGN KEY (p_nr) REFERENCES pizza_pizzen(p_nr)
) ENGINE=InnoDB;
CREATE TABLE pizza_zutaten (
  z_nr INT PRIMARY KEY, zutatenbezeichnung VARCHAR(45)
) ENGINE=InnoDB;
CREATE TABLE pizza_zuordnungen (
  pz_nr INT PRIMARY KEY, p_nr INT NOT NULL, z_nr INT NOT NULL,
  FOREIGN KEY (p_nr) REFERENCES pizza_pizzen(p_nr),
  FOREIGN KEY (z_nr) REFERENCES pizza_zutaten(z_nr)
) ENGINE=InnoDB;
CREATE TABLE pizza_orte (
  ort_nr INT PRIMARY KEY, plz VARCHAR(5), ortname VARCHAR(45)
) ENGINE=InnoDB;
CREATE TABLE pizza_fahrer (
  fahrer_nr INT PRIMARY KEY, vorname VARCHAR(45), nachname VARCHAR(45),
  strasse VARCHAR(45), ort_nr INT NOT NULL,
  FOREIGN KEY (ort_nr) REFERENCES pizza_orte(ort_nr)
) ENGINE=InnoDB;
-- Hier steckt bewusst eine transitive Abhaengigkeit ueber haendlernr.
CREATE TABLE pizza_fahrzeuge (
  fahrzeug_nr INT PRIMARY KEY, kennzeichen VARCHAR(45), anschaffungspreis DECIMAL(10,2),
  haendlernr INT NOT NULL, firma VARCHAR(45), strasse VARCHAR(45), plz VARCHAR(5), ort VARCHAR(45)
) ENGINE=InnoDB;
CREATE TABLE pizza_auslieferungen (
  liefer_nr INT PRIMARY KEY, lieferdatum DATE,
  best_nr INT NOT NULL UNIQUE, fahrer_nr INT NOT NULL, fahrzeug_nr INT NOT NULL,
  FOREIGN KEY (best_nr) REFERENCES pizza_bestellungen(best_nr),
  FOREIGN KEY (fahrer_nr) REFERENCES pizza_fahrer(fahrer_nr),
  FOREIGN KEY (fahrzeug_nr) REFERENCES pizza_fahrzeuge(fahrzeug_nr)
) ENGINE=InnoDB;
INSERT INTO pizza_kunden VALUES (1,'Probe',NULL,NULL),(2,'Demo',NULL,NULL);
INSERT INTO pizza_bestellungen VALUES (1,1,'2020-01-01'),(2,2,'2020-01-02');
INSERT INTO pizza_pizzen VALUES (1,'Demo-Pizza A',8.00),(2,'Demo-Pizza B',10.00);
INSERT INTO pizza_bestellpositionen VALUES (1,1,1,2),(2,2,2,1);
INSERT INTO pizza_zutaten VALUES (1,'Demo-Zutat A'),(2,'Demo-Zutat B');
INSERT INTO pizza_zuordnungen VALUES (1,1,1),(2,1,2),(3,2,1);
INSERT INTO pizza_orte VALUES (1,'00001','Musterstadt'),(2,'00001','Testdorf');
INSERT INTO pizza_fahrer VALUES
 (1,'Mara','Probe','Testweg 1',1),(2,'Tari','Demo','Testweg 2',2);
INSERT INTO pizza_fahrzeuge VALUES
 (1,'DEMO-P101',20000,1,'Demo-Auto','Testweg 10','00001','Musterstadt'),
 (2,'DEMO-P102',23000,1,'Demo-Auto','Testweg 10','00001','Musterstadt');
INSERT INTO pizza_auslieferungen VALUES (1,'2020-01-01',1,1,1);
