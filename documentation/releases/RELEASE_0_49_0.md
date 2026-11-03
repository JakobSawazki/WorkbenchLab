# WorkbenchLab 0.49.0

3. November 2026, Codex. Gemeinsame Veroeffentlichung von Jakobs seit
0.48.0 beauftragten Aenderungen und dem anschliessend bestaetigten offenen
Lernpfad.

## Aenderungen

- Alle Lerneinheiten sind direkt waehlbar, nicht nur der zuvor gewuenschte
  Einstieg L1.5. Die Reihenfolge und Weiterlernen-Empfehlung bleiben erhalten.
  Besuchen oder Ueberspringen vergibt keine Abschluesse, XP oder NAGOLD.
  Normale fachliche Abschlussbedingungen bleiben bestehen.
- L1.2 erklaert ER/ERD und PK mit ausgeschriebenen englischen Begriffen,
  deutschen Bedeutungen und einem Beispiel fuer einen Primaerschluessel.
- Speichern & Laden enthaelt regulaer nur die beiden Datei-Aktionen;
  Offline-Paket und Offline-Vorbereitung entfallen. Bestehende Offline-Kopien
  und Kompatibilitaetswerkzeuge werden nicht geloescht.
- Sicherungsdownload nach erfolgreichem erstmaligem Einheitenabschluss ist
  fest aktiv, auch bei alten ausgeschalteten Einstellungen. Browser koennen
  weiterhin Download-Berechtigungen verlangen.
- Klasse und Schuelerkuerzel stehen im Sicherungsnamen; der Punkt im Kuerzel
  bleibt erhalten, Geraetekennung und Datum dienen der weiteren Zuordnung.
- Plus in der NAGOLD-Tabelle speichert direkt Anwesenheit mit 2 Punkten,
  aktuellem Datum und Uhrzeit. Bearbeiten und Loeschen bleiben moeglich.
  Alleiniges Oeffnen einer leeren Tabelle vergibt keine Punkte.
- Im aktiven Entwicklermodus kann das Lernprofil nach ausdruecklicher
  Bestaetigung vollstaendig geloescht werden. Lerndaten und separate Entwuerfe
  werden entfernt; Darstellung, Geraetekennung, Lehrkraftdaten und Offline-
  Kopie bleiben erhalten. Andere offene Lernseiten-Tabs laden neu.
- Import alter Sicherungen mit frueher erlaubten Klassentrennern korrigiert:
  Nur bei Formaten vor 9 und exakt gleichen urspruenglichen Klassenwerten in
  identity/data wird die Normalisierung akzeptiert. Original-Pruefsumme,
  aktuelle Klassenregel und sonstige Identitaetspruefungen bleiben verbindlich.
  Keine private Schuelersicherung wird veroeffentlicht.

## Pruefungen

231 Node-Tests, vier Python-Tests und alle 51 Browsertestdateien bestanden.
Browser gegen eine feste loesungsbereinigte TEMP-Kopie geprueft: 254
Namens-/ARIA-Ansichten, 322 Kontrastansichten, 1212 Ueberlaufansichten und
953 Tastaturstopps. Alle 69 finalen oeffentlichen Dateien stimmen bytegenau
mit dieser geprueften Kopie ueberein; keine private Schuelerdatei enthalten.

Der erste Browserlauf bestand elf Dateien und stoppte im Klausurtest an
einer alten Annahme zum gesperrten Lernpfad. Der Test prueft jetzt die exakte
Anzahl und Codes der tatsaechlich gezogenen Einheiten statt maximal drei
Einheiten; auch der Einstieg mit frischem Profil wird geprueft. Danach
bestanden Klausurtest und alle weiteren 39 Dateien gegen dieselbe Kopie.
Keine Produktionsdatei zwischen diesen Laeufen geaendert. SQL-Aufgaben,
Referenzabfragen und MySQL-Aussagen unveraendert; keine neue native SQL-
Funktion oder Aufgabe in diesem Release.

Veroeffentlichungsziel: main, Tag v0.49.0, GitHub Pages und GitHub-Release.
Der Pages-Workflow fuehrt Node-/Python-Tests vor der Bereitstellung erneut
aus. Kein neues Offline-ZIP-Angebot im Sicherungsfenster.

Schul-PC-Abnahme und echte assistive Technik bleiben Vor-Ort-Pruefungen.
Sicherungen sind weiterhin fuer Browser-/PC-Wechsel erforderlich.
