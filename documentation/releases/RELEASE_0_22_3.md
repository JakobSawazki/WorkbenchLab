# WorkbenchLab 0.22.3

Stand: 3. Oktober 2026

Die Praxisauftraege L1.1 bis L1.4 erhalten eine direkte Verknuepfung zur
animierten Startanleitung. Die Route `#reference/workbench-start` kann auch
direkt geoeffnet werden. Das Video startet nicht automatisch.

Bei Aufruf aus einer Lerneinheit fuehrt ein Rueckkehrbutton wieder zum
Praxisauftrag. Auch Browser-Zurueck erhaelt die geoeffneten Arbeitsschritte,
Scrollposition und Tastaturfokus. Ein direkter oder neu geladener Aufruf
zeigt keinen irrefuehrenden Rueckkehrbutton.

Die feste Kopfzeile verdeckt die Startanleitung und Rueckkehr nicht.
Die Verbindungswerte und SQL-Dateien bleiben unveraendert.

## Pruefung

- 94 Node-Tests ohne Fehler.
- Alle vier Verknuepfungen auf Desktop und Mobilgeraeten geprueft.
- Rueckkehrbutton und Browser-Zurueck: Schritte, Position und Fokus erhalten.
- Direktaufruf, Neuladen und pausiertes Video geprueft.
- Gesamter Lernpfad: 21 Uebungsrueckwege, SQL-Links und vollstaendige
  Arbeitsschritte; 168 Desktop-/Mobilansichten ohne JavaScript-Fehler.

Die native Workbench-Bedienung am Schul-PC bleibt gesondert zu pruefen.
