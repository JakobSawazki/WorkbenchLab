(function () {
  "use strict";

  // Public Entra identifiers; leave empty until the school approves the app.
  const tenantId = "";
  const clientId = "";
  const appBase = "https://jakobsawazki.github.io/WorkbenchLab/";
  const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
  const enabled = uuid.test(tenantId) && uuid.test(clientId) && window.isSecureContext
    && [appBase, appBase + "index.html"].includes(location.origin + location.pathname);
  let initialization;
  let client;

  function prepare() {
    if (!enabled) return Promise.resolve(false);
    initialization ||= (async () => {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = appBase + "vendor/msal/msal-browser.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
      });
      const app = new window.msal.PublicClientApplication({
        auth: {
          clientId,
          authority: `https://login.microsoftonline.com/${tenantId}`,
          redirectUri: appBase + "outlook-redirect.html"
        },
        cache: { cacheLocation: "memoryStorage" }
      });
      await app.initialize();
      client = app;
      return true;
    })().catch(() => {
      initialization = undefined;
      return false;
    });
    return initialization;
  }

  async function getToken(address) {
    if (!client) throw new Error("Die Microsoft-Anmeldung ist nicht bereit.");
    const result = await client.loginPopup({
      loginHint: address,
      scopes: ["User.Read", "Mail.ReadWrite"]
    });
    if (result.account?.tenantId?.toLowerCase() !== tenantId.toLowerCase() || !result.accessToken) {
      throw new Error("Bitte verwende dein Microsoft-Schulkonto.");
    }
    return result.accessToken;
  }

  window.WORKBENCH_OUTLOOK_AUTH = { prepare, getToken, enabled };
})();
