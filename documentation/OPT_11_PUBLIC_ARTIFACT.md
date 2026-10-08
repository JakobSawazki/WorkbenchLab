# OPT-11 – Veröffentlichung auf App-Dateien begrenzt

8. Oktober 2026

`tools/build-site.cjs` stellt `_site/` aus den versionierten App-Dateien
zusammen: zwölf Dateien im Stamm sowie `assets/` und `vendor/`.
Ignorierte lokale Materialien, OS-Dateien, Git-Daten, Tests, Werkzeuge,
Übergaben, Dokumentation und Lehrbuch-Manuskript sind ausgeschlossen.
Der Workflow lädt nur `_site/` hoch, weiterhin nach bestandenem Testjob.

Das Manuskript bleibt im öffentlichen GitHub-Repository erhalten. Es gibt
keinen App-Link auf diese bisher unverbundene Kopie; eine integrierte
Leseausgabe wird damit nicht vorweggenommen.

Prüfung: 108/108 Node-Tests bestanden (einschließlich der öffentlichen
Dateiauswahl). Lokal erzeugtes Paket enthält 45 Dateien. Browserprüfung
auf Port 4186: Bilder geladen, SQL bereit, keine JavaScript-Fehler.
Port 4180 war durch einen Service Worker eines anderen Lernprojekts belegt;
der unveränderte Test wurde deshalb auf einem frischen lokalen Ursprung geprüft.

Deployment- und Live-Nachweis folgen.

Online bestätigt: Implementierung 4c01fb4, CI-Lauf 37845559494 erfolgreich. index.html, SQL-WASM und SQL-Download liefern HTTP 200. tools/build-site.cjs, tests/learning-path.test.js, documentation/RELEASE_0_25_3.md, Lehrbuch/README.md und claude2codex.md liefern HTTP 404. Live-App mit allen drei sichtbaren Bildern und ohne JavaScript-Fehler geprüft.
