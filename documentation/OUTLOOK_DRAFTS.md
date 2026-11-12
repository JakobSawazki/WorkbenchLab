# Outlook-Entwurf mit Lernstandsicherung

Status: Schaltfläche, Microsoft-Anmeldung und Graph-Entwurf sind lokal
integriert. Ohne konfigurierte Schul-App bleibt die Funktion ausgeblendet;
der bisherige Mail-Link bleibt verfügbar. Kein produktiver Kontotest.

## Vor der Aktivierung

1. Mit der Schul-IT abstimmen, ob Lernstandsicherungen mit Notizen im
   Microsoft-365-Schulpostfach gespeichert werden dürfen.
2. Eine auf den Schulmandanten beschränkte Entra-App als Single-Page-App
   registrieren. Als SPA-Rückleitungsadresse exakt
   `https://jakobsawazki.github.io/WorkbenchLab/outlook-redirect.html`
   hinterlegen. Keine Client-Secrets für die Website.
3. Delegierte Microsoft-Graph-Rechte `User.Read` (Postfachadresse prüfen)
   und `Mail.ReadWrite` (Entwurf erstellen) nach Schulrichtlinie freigeben.
   `Mail.ReadWrite` ist breiter als reiner Entwurfszugriff. Kein `Mail.Send`.
4. Mandanten-ID und Anwendungs-ID in `outlook-auth.js` eintragen. Die
   Microsoft-Anmeldung erst nach Klick auf „E-Mail-Entwurf mit Sicherung
   erstellen“ starten. Vor dem Erstellen klar anzeigen, dass die
   aktuelle Sicherung im Schulpostfach abgelegt wird.
5. Mit einem freigegebenen Testkonto und fiktiven Daten prüfen: korrekter
   Empfänger, JSON lässt sich wieder laden, falsches Konto verhindert
   die Ablage, und der Entwurf erscheint in Outlook, ohne Versand.

Der Baustein liest die Adresse des angemeldeten Postfachs über Graph.
Nur bei Übereinstimmung mit der aus dem Profil abgeleiteten Schuladresse
erstellt er den Entwurf mit JSON-Anhang. Die aktuelle direkte Variante
akzeptiert bis zu 2 MiB; größere Sicherungen bleiben per Download verfügbar.
Das Speichern, Laden und Arbeiten ohne Internet bleibt unabhängig davon.

Offizielle Referenzen: [Entra-App registrieren](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app),
[Graph-Postfach prüfen](https://learn.microsoft.com/en-us/graph/api/user-get),
[Graph-Entwurf erstellen](https://learn.microsoft.com/en-us/graph/api/user-post-messages).
