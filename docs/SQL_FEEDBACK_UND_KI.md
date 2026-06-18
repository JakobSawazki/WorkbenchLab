# SQL-Feedback und optionale KI

Stand: 18. Juni 2026

## Umgesetzter Stand

Version 0.5.0 verwendet bewusst einen lokalen SQL-Coach. SQL-Code, Profil und
Lernstand verlassen den Browser nicht. Die Rückmeldung basiert auf der echten
Ausführung in `sql.js`, den geforderten Aufgabenbestandteilen und einem
Vergleich mit der erwarteten Ergebnismenge.

Der Coach darf Tipps geben. XP werden weiterhin ausschließlich durch die
deterministische Aufgabenprüfung vergeben. Für eine Note bleibt die
pädagogische Bewertung durch die Lehrkraft maßgeblich.

## Warum kein API-Schlüssel im Browser liegt

WorkbenchLab wird statisch über GitHub Pages ausgeliefert. Jeder Schlüssel in
JavaScript wäre für Besucher einsehbar und könnte missbraucht werden. Eine
externe KI darf daher nur über ein serverseitiges Gateway angesprochen werden,
das den Schlüssel als Secret verwaltet, Anfragen begrenzt und Eingaben
minimiert.

## Geprüfte kostenlose Optionen

Die folgenden Angaben wurden am 18. Juni 2026 anhand der offiziellen
Anbieterdokumentation geprüft und können sich ändern:

- [Google Gemini Developer API](https://ai.google.dev/gemini-api/docs/pricing):
  kostenloses Kontingent vorhanden; Inhalte des Free Tier können laut
  Preisseite zur Produktverbesserung verwendet werden. Für Schülercode und
  Leistungsbezug ist das ohne zusätzliche schulische Prüfung keine gute
  Voreinstellung.
- [Groq API](https://console.groq.com/docs/rate-limits): Free-Plan mit
  modellabhängigen Tages- und Minutenlimits. Auch hier muss der Schlüssel
  serverseitig liegen und die schulische Datenschutzfreigabe vorliegen.
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/):
  laut Preisseite 10.000 Neurons pro Tag kostenfrei. Ein Worker eignet sich
  technisch als Gateway vor GitHub Pages, benötigt aber Konto, Secret,
  Missbrauchsschutz und eine schulische Datenschutzentscheidung.

## Empfohlene Zielarchitektur

1. WorkbenchLab sendet nur Aufgaben-ID, Schemaausschnitt und SQL-Entwurf.
2. Name, XP, Lernstand und Browser-ID werden nie übertragen.
3. Ein Cloudflare Worker oder eigener Schulserver hält den API-Schlüssel.
4. Das Gateway setzt Rate Limits, maximale Eingabelänge und feste Prompts.
5. Das Modell liefert nur strukturiertes Feedback mit Hinweis und Begründung.
6. Die lokale Prüfung entscheidet weiterhin über richtig oder falsch.
7. Externe Rückmeldung wird als KI-Hinweis gekennzeichnet und protokolliert
   keine personenbezogenen Daten.

Vor einer Aktivierung sind Anbieterbedingungen, Auftragsverarbeitung,
Speicherorte, Löschfristen sowie die schulischen Vorgaben zum Einsatz
generativer KI zu prüfen. Bis dahin ist der lokale Coach die robuste und
datensparsame Lösung.
