# Release 0.45.0: Offline-Kopie der Webseite

Stand: 10. Oktober 2026, Codex. Fortsetzung von OPT-15 im autarken Gesamtauftrag.

## Umfang

Unter Speichern & Laden kann die HTTPS-Seite ausdrücklich offline vorbereitet
werden. Ohne diesen Klick wird kein Service Worker registriert. Die ZIP-Fassung
bleibt als Alternative für den Informatik-Stick erhalten; unter Datei-URLs bleibt
der neue Bereich verborgen. Gesperrte Worker-/Cache-APIs legen die App nicht lahm.

Der Bau erzeugt aus der gefilterten, lösungsbereinigten öffentlichen Dateiliste
ein Manifest mit Version, Buildkennung, Größen und SHA-256. Erst wenn sämtliche
Dateien geprüft und gespeichert sind, erhält ein Cache seinen Abschlussmarker.
Fehlende Einträge werden erkannt. Reparatur lädt nur Bytes der passenden Version;
ein beschädigtes Update oder Speichermangel ersetzt keine funktionierende Kopie.

Updates warten auf das Schließen aller WorkbenchLab-Tabs. Kein erzwungenes
Neuladen, skipWaiting oder clients.claim: Bearbeitete Notizen und laufende Tabs
bleiben in ihrer bisherigen vollständigen Version. Alte Versionscaches werden
erst bei Aktivierung einer neueren Version entfernt. Andere Apps derselben
GitHub-Pages-Domain und ihr Cache bleiben unangetastet.

Enthalten sind HTML, lokale Bilder und Bibliotheken, SQL-WASM, zwölf Skripte,
Startvideo und Untertitel sowie die Lehrkraftseite. Video-Anfragen unterstützen
Bytebereiche einschließlich Vorspulen und korrekter 416-Antworten. YouTube und
externe Quellen werden nicht zwischengespeichert und brauchen weiter Internet.

Versionsprüfung und Entfernen stehen als benannte Symbolknöpfe bereit. Entfernen
verlangt eine Bestätigung und ist bei weiteren WorkbenchLab-Tabs gesperrt. Dabei
werden nur diese Registrierung und ihre App-Caches gelöscht, keine Notizen,
Profile oder fremden App-Daten. Laufende Sitzungsdatenbanken gehen beim ausdrücklich
bestätigten Neuladen verloren; die Bestätigung weist auf vorherige Sicherung hin.

## Prüfungen

Neue Node-Prüfungen erfassen Manifest/Hashes, Versionsbindung, Pfadschutz,
Bytebereiche, App-Scope, fehlende Abschlussmarker und URL-Normalisierung.
Der neue Edge-Test verwendet drei isolierte Veröffentlichungsstände und prüft:

- ausdrückliche Vorbereitung und exakte Cache-Dateiliste;
- Neuladen ohne Netz, SQL-Skript, Video/Vorspulen/Untertitel und Lehrkraftseite;
- fehlende Datei, Reparatur und fehlgeschlagene Offline-Versionsprüfung;
- beschädigtes Update sowie Speicherfehler bei Erstinstallation und Update;
- zwei offene Tabs mit Notizen, wartende Version und spätere Aktivierung;
- Abbruch/Bestätigung beim Entfernen ohne Verlust von Notizen oder Fremdcaches;
- dunkle/helle Ansicht mit großer Schrift bei 360 Pixeln;
- gesperrte Browser-APIs und vollständigen Browser-Neustart ohne Netz.

Release-Gates bestanden: 221 Node-Tests, vier Python-Tests und sämtliche
45 Browsertestdateien gegen eine feste Kopie des lösungsbereinigten Pakets.
Darunter 318 Kontrast-, 1200 Überlauf- und 252 Namensansichten sowie 925
Tastaturstopps. Zwei ältere Browsertests lasen Lösungen aus der Webseite;
Klausur- und Praxistest verwenden jetzt lokale Testdaten. Der Gesamtlauf bis
Überlauf und anschließend der korrigierte Praxistest samt allen verbleibenden
Dateien sind bestanden. Keine Produktprüfung dafür abgeschwächt.
168 native MariaDB-Prüfungen sowie zwölf Skriptimporte mit nativen Abfragen
und Fremdschlüsseln bestanden. Mobile Ansichten beider Farbmodi visuell geprüft.

68 öffentliche Dateien, 66 Cache-Nutzdateien. ZIP: 71 Einträge, 10.941.291 Bytes,
SHA-256 `3846c6c7877e73a4a7fc4e65fffa29690d968fbe113126e6e1ff0c4a375adbf7`.
Veröffentlicht als `1498898`, Tag `v0.45.0`; Pages-Lauf
[`38029563457`](https://github.com/JakobSawazki/WorkbenchLab/actions/runs/38029563457)
erfolgreich. Alle 66 Cache-Dateien und die Worker-Buildkennung live geprüft,
private Ressourcen 404; reales anonym heruntergeladenes ZIP mit identischem
Hash. Isolierter Edge-Kontext auf GitHub Pages: Vorbereitung, Offline-Neuladen
mit Notizen, SQL-Ergebnis und Video/Seek/Untertitel erfolgreich. Weitere
Einzelheiten stehen im Projektprotokoll.

## Grenzen

Browser können Offline-Caches löschen; die Kopie ist kein Lernstandbackup.
Dateisicherung bleibt erforderlich. Der Schul-PC-Test unter echten Richtlinien
steht weiterhin aus. Das ZIP ist für direktes Öffnen per file:// vorgesehen,
nicht als alternative HTTPS-Installation. Keine neue MySQL-Aussage oder geänderte
SQL-Aufgabe. Modell-Editor, OPT-12 und Vor-Ort-Abnahmen bleiben im Gesamtauftrag.
