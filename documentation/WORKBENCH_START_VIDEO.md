# Animierte Startanleitung

Die lokale Anleitung ist unter **Nachschlagen** eingebunden. Sie wird nicht
automatisch abgespielt und braucht weder YouTube noch eine Internetverbindung,
wenn die Dateien lokal bereitliegen.

## Dateien

- `assets/tutorials/workbench-start.mp4`: 1:42 Minuten, 1920 x 1080, H.264,
  ohne Ton; die Hinweise sind im Bild eingeblendet.
- `assets/tutorials/workbench-start-poster.png`: Vorschaubild.
- `assets/tutorials/workbench-start.de.vtt`: optionale deutsche Untertitel.
- `assets/tutorials/workbench-start-animation.html` und `.js`: editierbare,
  pausierbare Canvas-Animation mit Zeitleiste.
- `tools/render-workbench-start.cjs`: erzeugt Video und Kontrollbilder.

## Ablauf

| Zeit | Handlung |
| --- | --- |
| 0:00 | Reihenfolge im Überblick |
| 0:04 | Informatik-Stick starten; Desktop in der Schule, Startmenü am Laptop |
| 0:11 | Warten und zum Datenbank-MariaDB-Ordner scrollen |
| 0:19 | MySQL starten: Doppelklick |
| 0:25 | Auf `ready for connections` warten; CMD nicht schließen |
| 0:37 | CMD minimieren |
| 0:41 | Workbench 6.3.10 starten; Hinweis auf Laptop-Version 8.0.21 |
| 0:49 | Plus neben MySQL Connections |
| 0:55 | Verbindungsdaten eintragen bzw. vorgegebene Werte prüfen |
| 1:15 | Test Connection |
| 1:23 | Testbestätigung schließen und Connection speichern |
| 1:28 | local doppelklicken |
| 1:35 | SQL-Editor; Server läuft weiter |

Die Unterrichtswerte stammen aus Jakobs Vorgabe: `local`, `Standard (TCP/IP)`,
`127.0.0.1`, `3306`, `root`. Das Datenbank-Passwort wird nicht vorausgesetzt
oder gezeigt. Eine mögliche Passwortabfrage richtet sich nach der Lehrkraft.
Default Schema bleibt zunächst unverändert.

Die Oberflächen sind didaktisch nachgestellt, keine Bildschirmaufnahme.
Privater Desktop, lokale IP und personenbezogene Angaben aus den Vorlagen
sind nicht übernommen. Der erfolgreiche Verbindungstest ist ausdrücklich
ein Beispiel, kein Nachweis einer Verbindung an den Schul-PCs. Die echte
Startdauer kann abweichen. Einzelne Dialoge können je nach Version anders aussehen.

## Export

Lokalen HTTP-Server mit Range-Unterstützung im Projekt auf Port 4174 starten
(`node tools/preview-workbench.cjs`, benötigt `send@1.2.1`). Node.js und Playwright
müssen verfügbar sein; der Export nutzt Microsoft Edge und MediaRecorder,
ohne zusätzliche Encoder oder Online-Dienste. Als Export-Abhängigkeit wird
`mp4box@2.4.1` benötigt. Der MP4-Parser korrigiert die Dauer in den drei
Container-Kopffeldern anhand der tatsächlich aufgezeichneten Frames;
Fragmentpositionen und Videodaten bleiben unverändert. Die Website lädt
diese Bibliothek nicht.

```powershell
node tools/render-workbench-start.cjs --preview
node tools/render-workbench-start.cjs
node tools/verify-workbench-start.cjs
```

Der vollständige Export läuft in Echtzeit. Kontrollbilder landen ausschließlich
in `.tmp/workbench-start-video`. Nur die Video-Assets gehören zur Website.

## Fachliche Grundlage

- [MySQL: Neue Verbindung](https://dev.mysql.com/doc/workbench/en/wb-mysql-connections-new.html)
- [MySQL: Standard TCP/IP](https://dev.mysql.com/doc/workbench/en/wb-mysql-connections-methods-standard.html)
- [MySQL: Verbindung testen](https://dev.mysql.com/doc/workbench/en/wb-getting-started-tutorial-create-connection.html)
