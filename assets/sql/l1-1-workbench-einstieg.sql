-- L1.1: Erste Tabelle ansehen. Alle Personen sind frei erfunden.
-- Erst Informatik-Stick, dann MySQL starten, zuletzt Workbench oeffnen.
-- Das Konsolenfenster bleibt geoeffnet.
-- Dieses Skript genau einmal ausfuehren; es ersetzt keine vorhandenen Tabellen.
-- Zum Wiederholen nur die SELECT-Anweisung am Ende markieren und ausfuehren.

CREATE DATABASE IF NOT EXISTS workbenchlab_l1_1_einstieg
  CHARACTER SET utf8mb4;
USE workbenchlab_l1_1_einstieg;

CREATE TABLE fahrschueler (
  schuelernr INT NOT NULL PRIMARY KEY,
  vorname VARCHAR(40) NOT NULL,
  nachname VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

INSERT INTO fahrschueler (schuelernr, vorname, nachname) VALUES
  (1, 'Mara', 'Probe'),
  (2, 'Tari', 'Demo');

SELECT schuelernr, vorname, nachname
FROM workbenchlab_l1_1_einstieg.fahrschueler
ORDER BY schuelernr;
