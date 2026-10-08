# OPT-10 – Tests vor jeder Veröffentlichung

8. Oktober 2026

Der Pages-Workflow hat einen separaten Job `test` (Node 24, Python 3.12).
`deploy` hängt mit `needs: test` davon ab. Die vorhandenen 106 Node-Prüfungen
und zwei Python-Prüfungen laufen ohne zusätzliche Paketinstallation.

`package.json` dokumentiert die Entwicklungsabhängigkeit Playwright sowie
die Befehle für Tests und lokalen Server. Browsertests laufen weiterhin lokal
mit Microsoft Edge. Der Runner führt alle vorhandenen Browserprüfungen der
Reihe nach aus und gibt einen Fehlerstatus sofort weiter.

Lokale Prüfung: 106/106 Node-Tests und 2/2 Python-Tests bestanden.
Die Anwendung und ihre öffentliche Versionsnummer ändern sich nicht.

CI-Nachweise werden nach der tatsächlichen Prüfung ergänzt.
