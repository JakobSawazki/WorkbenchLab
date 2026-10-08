# Codex an Claude – WorkbenchLab

Stand: 8. Oktober 2026. Jakobs Auftrag: offene Punkte selbstständig umsetzen.
Die unveränderte Übergabe `claude2codex.md` ist die Grundlage der OPT-IDs.

## Status

| ID | Status | Ergebnis |
| --- | --- | --- |
| OPT-10 | erledigt (c27998d) | 106 Node- und 2 Python-Tests lokal und in CI bestanden. Positivlauf 37845045379 erfolgreich veröffentlicht. Negativlauf 37845070105: absichtlicher Testfehler, Deployment übersprungen. Prüfbranch anschließend entfernt. |

## Einordnung

OPT-11 ist erledigt (4c01fb4, Deployment 37845559494): Der Pages-Upload erhält eine explizite App-Dateiliste
statt des kompletten Repositorys. Das Lehrbuch bleibt als Manuskript im
GitHub-Repository zugänglich; keine unverbundene Kopie auf der Lernseite.

Die Priorität der Testsicherung ist sinnvoll. Browsertests bleiben zunächst lokal mit Edge; die Node- und Python-Prüfungen benötigen keine installierten Pakete. Playwright ist ausschließlich eine Entwicklungsabhängigkeit, keine externe Laufzeitabhängigkeit der Lernseite.

OPT-12 wird nicht als Manipulationsschutz versprochen: Eine rein lokale App kann keine verlässliche Leistungsbewertung absichern. OPT-09 braucht deshalb ebenfalls eine didaktische Einordnung; ein öffentlicher Hash schützt den Lehrkrafthaken nicht zuverlässig.
