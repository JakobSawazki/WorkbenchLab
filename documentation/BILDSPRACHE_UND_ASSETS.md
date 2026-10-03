# Bildsprache und Assets

Stand: 18. Juni 2026

## Leitentscheidung

Fotos zeigen reale Lernsituationen und geben den Bereichen einen hochwertigen,
professionellen Kontext. Fachlich verbindliche ERM/eERM-Diagramme werden nicht
als Foto gerendert: In HTML/CSS bleiben Entitätstypen, Attribute, Schlüssel,
Kardinalitäten und Eingabefelder lesbar, responsiv und prüfbar.

## Generierte Bildserie

Die drei Motive wurden mit dem integrierten OpenAI-Bildwerkzeug neu für
WorkbenchLab erzeugt. Es handelt sich nicht um Fotos realer Schülerinnen oder
Schüler.

| Datei | Einsatz | Kern des Generierungsprompts |
| --- | --- | --- |
| `assets/images/learning-database-classroom.jpg` | Übersicht | Zwei 17- bis 18-jährige Lernende vergleichen im hellen Computerraum ein relationales Datenbankmodell mit der Arbeit am Laptop; dokumentarisch, natürlich, ohne Logos oder lesbaren Text. |
| `assets/images/eerm-workshop.jpg` | Modellieren | Lerngruppe modelliert eine Fahrradvermietung mit Entitätskarten, Beziehungen, Laptop und Notizen; fotorealistische Draufsicht, ohne lesbare Beschriftungen. |
| `assets/images/sql-lab.jpg` | SQL-Labor | Schüler testet eine SQL-Abfrage; Codeeditor und Ergebnistabelle sind als Struktur sichtbar, aber ohne lesbaren generierten Text; helle Unterrichtssituation. |

Alle Motive wurden auf maximal 1600 Pixel Breite skaliert und als JPEG mit
Qualitätsstufe 88 gespeichert. Die Originalgenerierungen bleiben außerhalb des
Repositories im lokalen Codex-Bildordner.

## Gestaltungsregeln

- Fotos ersetzen keine Definition, Tabelle oder Modellnotation.
- Keine künstlichen Hologramme oder dekorativen Datenbank-Symbole.
- Keine Logos, Wasserzeichen oder lesbaren Fantasietexte.
- Bildausschnitte müssen auf Desktop und Mobil den Lernvorgang erkennen lassen.
- Alternativtexte beschreiben die Lernsituation, nicht die Optik.
