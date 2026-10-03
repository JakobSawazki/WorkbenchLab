-- L5: Vollstaendig fiktive Portal- und Mobilitaetsdaten, keine echten Profile.
-- Einmal einrichten. Wiederholungen fuehren nur SELECT-Abfragen aus.
-- Das kleine Beispiel simuliert Analysefragen, keinen echten Big-Data-Betrieb.
CREATE DATABASE IF NOT EXISTS workbenchlab_l5 CHARACTER SET utf8mb4;
USE workbenchlab_l5;
CREATE TABLE profile (
  profilnr INT NOT NULL PRIMARY KEY, geraeteart VARCHAR(20) NOT NULL
) ENGINE=InnoDB;
CREATE TABLE aktivitaeten (
  ereignisnr INT NOT NULL PRIMARY KEY, profilnr INT NOT NULL,
  zeitpunkt DATETIME NOT NULL, aktion VARCHAR(30) NOT NULL,
  FOREIGN KEY (profilnr) REFERENCES profile(profilnr)
) ENGINE=InnoDB;
CREATE TABLE standorte (
  standortnr INT NOT NULL PRIMARY KEY, profilnr INT NOT NULL,
  zeitpunkt DATETIME NOT NULL, zone VARCHAR(30) NOT NULL,
  FOREIGN KEY (profilnr) REFERENCES profile(profilnr)
) ENGINE=InnoDB;
INSERT INTO profile VALUES (1,'Laptop'),(2,'Laptop'),(3,'Tablet'),(4,'Tablet'),(5,'Telefon'),(6,'Laptop');
INSERT INTO aktivitaeten VALUES
 (1,1,'2020-01-01 08:00:00','Anmeldung'),
 (2,1,'2020-01-01 08:00:20','Seite gelesen'),
 (3,2,'2020-01-01 08:00:45','Anmeldung'),
 (4,1,'2020-01-01 08:01:00','Aufgabe abgegeben'),
 (5,3,'2020-01-01 08:01:10','Anmeldung'),
 (6,2,'2020-01-01 08:01:20','Seite gelesen'),
 (7,4,'2020-01-01 08:02:00','Aufgabe abgegeben'),
 (8,5,'2020-01-01 08:02:10','Anmeldung'),
 (9,2,'2020-01-01 08:02:20','Aufgabe abgegeben'),
 (10,3,'2020-01-01 08:03:00','Seite gelesen'),
 (11,4,'2020-01-01 08:03:10','Seite gelesen'),
 (12,1,'2020-01-01 08:04:00','Abmeldung');
INSERT INTO standorte VALUES
 (1,1,'2020-01-01 08:00:00','Campus'),(2,1,'2020-01-01 12:00:00','Bibliothek'),(3,1,'2020-01-01 15:00:00','Campus'),
 (4,2,'2020-01-01 08:00:00','Campus'),(5,2,'2020-01-01 15:00:00','Bahnhof'),
 (6,3,'2020-01-01 08:00:00','Bahnhof'),
 (7,5,'2020-01-01 08:00:00','Wohnzone'),(8,5,'2020-01-01 15:00:00','Campus');

-- Mobilitaetsdaten sind absichtlich NICHT mit Portalprofilen verknuepft.
CREATE TABLE stationen (
  stationnr INT NOT NULL PRIMARY KEY, bezeichnung VARCHAR(30) NOT NULL
) ENGINE=InnoDB;
CREATE TABLE mieten (
  mietnr INT NOT NULL PRIMARY KEY, startstationnr INT NOT NULL, zielstationnr INT NOT NULL,
  zeitpunkt DATETIME NOT NULL, dauer_min INT,
  FOREIGN KEY (startstationnr) REFERENCES stationen(stationnr),
  FOREIGN KEY (zielstationnr) REFERENCES stationen(stationnr)
) ENGINE=InnoDB;
CREATE TABLE wetter (
  datum DATE NOT NULL PRIMARY KEY, temperatur DECIMAL(4,1) NOT NULL
) ENGINE=InnoDB;
INSERT INTO stationen VALUES (1,'Station A'),(2,'Station B'),(3,'Station C'),(4,'Station D');
-- Eine Dauer fehlt; 0 markiert einen zu pruefenden Datensatz, nicht einen bestaetigten Messwert.
INSERT INTO mieten VALUES
 (1,1,2,'2020-01-01 08:00:00',10),(2,1,3,'2020-01-01 09:00:00',20),
 (3,2,1,'2020-01-01 10:00:00',NULL),(4,1,2,'2020-01-01 11:00:00',30),
 (5,1,2,'2020-01-02 08:00:00',10),(6,2,1,'2020-01-02 09:00:00',15),(7,2,3,'2020-01-02 10:00:00',20),
 (8,1,2,'2020-01-03 08:00:00',30),(9,1,2,'2020-01-03 09:00:00',25),(10,3,1,'2020-01-03 10:00:00',0);
INSERT INTO wetter VALUES ('2020-01-01',5),('2020-01-02',10),('2020-01-03',15);
