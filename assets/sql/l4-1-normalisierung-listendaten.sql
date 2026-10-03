-- L4.1: Fiktive Listen-Ausgangsdaten, keine fertige Normalisierung.
-- Einrichtung einmal ausfuehren. Keine vorhandenen Tabellen werden ersetzt.
-- Trennzeichen |: Eintraege gleicher Position gehoeren zusammen.
-- Eigene atomare Zieltabellen in separaten Schemas workbenchlab_l4_* anlegen.
CREATE DATABASE IF NOT EXISTS workbenchlab_l4 CHARACTER SET utf8mb4;
USE workbenchlab_l4;

CREATE TABLE filmstudio_unf (
  schauspielernr INT NOT NULL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  rollen TEXT NOT NULL,
  filmnummern TEXT NOT NULL,
  filmtitel TEXT NOT NULL,
  kategorienummern TEXT NOT NULL,
  kategorienamen TEXT NOT NULL
) ENGINE=InnoDB;
-- Eine Person spielt im Uebungsfall je Film hoechstens eine Rolle.
INSERT INTO filmstudio_unf VALUES
 (100,'Emma Probe','Demo-Rolle A','10','Demo-Film A','2','Action'),
 (200,'Uwe Demo','Demo-Rolle B|Demo-Rolle C','20|10','Demo-Film B|Demo-Film A','1|2','Fantasy|Action'),
 (300,'Bastian Fiktiv','Demo-Rolle D|Demo-Rolle E','30|40','Demo-Film C|Demo-Film D','3|2','Komoedie|Action');

CREATE TABLE tanzschule_unf (
  kursnr INT NOT NULL PRIMARY KEY,
  lehrernr INT NOT NULL,
  lehrername VARCHAR(60) NOT NULL,
  kursbeschreibung VARCHAR(120) NOT NULL,
  schuelernummern TEXT NOT NULL,
  vornamen TEXT NOT NULL,
  nachnamen TEXT NOT NULL,
  telefone TEXT NOT NULL
) ENGINE=InnoDB;
-- Jede kursnr bezeichnet ein Angebot, nicht den Tanzstil.
-- Gleicher Stil kann unterschiedliche Preise haben (Foxtrott 101/104).
-- Alle Personen, Namen und Telefone sind fiktiv. Eine Anmeldung je Kurs/Person.
INSERT INTO tanzschule_unf VALUES
 (101,10,'Diego Probe','Foxtrott;95.00;2018-10-10;2019-01-18','1|2|3|4','Person01|Person02|Person03|Person04','Demo01|Demo02|Demo03|Demo04','TEL-01|TEL-02|TEL-03|TEL-04'),
 (102,10,'Diego Probe','Salsa;165.00;2018-08-12;2018-11-28','2|5|6|7|8|9','Person02|Person05|Person06|Person07|Person08|Person09','Demo02|Demo05|Demo06|Demo07|Demo08|Demo09','TEL-02|TEL-05|TEL-06|TEL-07|TEL-08|TEL-09'),
 (103,10,'Diego Probe','Tango;170.00;2018-02-07;2018-05-26','5|7|10|3','Person05|Person07|Person10|Person03','Demo05|Demo07|Demo10|Demo03','TEL-05|TEL-07|TEL-10|TEL-03'),
 (104,20,'Dimitri Demo','Foxtrott;105.00;2018-09-28;2018-12-22','3|8|1|11','Person03|Person08|Person01|Person11','Demo03|Demo08|Demo01|Demo11','TEL-03|TEL-08|TEL-01|TEL-11'),
 (105,20,'Dimitri Demo','Swing;110.00;2018-05-19;2018-08-30','12|13|9|14','Person12|Person13|Person09|Person14','Demo12|Demo13|Demo09|Demo14','TEL-12|TEL-13|TEL-09|TEL-14'),
 (106,30,'Tatjana Fiktiv','Tango;170.00;2018-11-05;2019-02-12','8|1','Person08|Person01','Demo08|Demo01','TEL-08|TEL-01'),
 (107,30,'Tatjana Fiktiv','Salsa;165.00;2018-07-02;2018-10-10','15|16|2|13','Person15|Person16|Person02|Person13','Demo15|Demo16|Demo02|Demo13','TEL-15|TEL-16|TEL-02|TEL-13');

SELECT * FROM filmstudio_unf ORDER BY schauspielernr;
SELECT * FROM tanzschule_unf ORDER BY kursnr;
