(function (root) {
  "use strict";

  const graph = "https://graph.microsoft.com/v1.0";
  const maxAttachmentBytes = 2 * 1024 * 1024;
  const schoolAddress = /^[a-z]{3}\.[a-z]{3}@ks-nagold\.de$/;
  const outlookHosts = new Set(["outlook.office.com", "outlook.office365.com"]);
  class DraftError extends Error {}

  function errorMessage(error) {
    return error instanceof DraftError ? error.message
      : "Die Verbindung zu Outlook wurde unterbrochen. Prüfe vor einem neuen Versuch deinen Ordner „Entwürfe“.";
  }

  async function encodeAttachment(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  }

  function safeOutlookLink(value) {
    try {
      const url = new URL(value);
      if (url.protocol === "https:" && outlookHosts.has(url.host) && !url.username && !url.password) return url.href;
    } catch {}
    return null;
  }

  async function createDraft({ accessToken, expectedAddress, file, signal }) {
    if (typeof expectedAddress !== "string" || !schoolAddress.test(expectedAddress) || typeof accessToken !== "string" || !accessToken) {
      throw new DraftError("Schuladresse oder Microsoft-Anmeldung fehlt.");
    }
    // Leave room for Base64 and message metadata in a single Graph request.
    if (!(file instanceof File) || file.type !== "application/json" || !/\.json$/i.test(file.name) || file.name.length > 160
      || file.size === 0 || file.size > maxAttachmentBytes) {
      throw new DraftError("Für den Entwurf ist eine JSON-Sicherung bis 2 MiB möglich. Größere Dateien bitte manuell anhängen.");
    }

    const headers = { Authorization: `Bearer ${accessToken}` };
    const request = { headers, redirect: "error", credentials: "omit", cache: "no-store", signal };
    const profile = await fetch(`${graph}/me?$select=mail`, request);
    if (!profile.ok) throw new DraftError("Das Microsoft-Schulpostfach konnte nicht geprüft werden.");
    const { mail } = await profile.json();
    if (typeof mail !== "string" || mail.toLowerCase() !== expectedAddress) {
      throw new DraftError("Das angemeldete Postfach stimmt nicht mit der Schuladresse im Profil überein.");
    }

    const response = await fetch(`${graph}/me/messages`, {
      ...request,
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "WorkbenchLab: Lernstandsicherung",
        body: { contentType: "Text", content: "Im Anhang ist meine aktuelle WorkbenchLab-Sicherung." },
        toRecipients: [{ emailAddress: { address: expectedAddress } }],
        attachments: [{
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: file.name,
          contentType: "application/json",
          contentBytes: await encodeAttachment(file)
        }]
      })
    });
    if (response.status !== 201) throw new DraftError("Outlook konnte den Entwurf nicht erstellen.");
    const result = await response.json().catch(() => ({}));
    return { outlookUrl: safeOutlookLink(result?.webLink) };
  }

  const api = { createDraft, errorMessage, maxAttachmentBytes };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.WORKBENCH_OUTLOOK_DRAFT = api;
})(globalThis);
