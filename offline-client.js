(() => {
  "use strict";

  function init() {
    const panel = document.querySelector("#offlineCachePanel");
    if (!panel || location.protocol === "file:") return;
    panel.hidden = false;
    const status = document.querySelector("#offlineCacheStatus");
    const hint = document.querySelector("#offlineCacheHint");
    const prepare = document.querySelector("#offlineCachePrepare");
    const check = document.querySelector("#offlineCacheCheck");
    const remove = document.querySelector("#offlineCacheRemove");
    const progress = document.querySelector("#offlineCacheProgress");
    const scope = new URL("./", location.href).href;
    const script = new URL("offline-worker.js", scope).href;
    const prefix = `workbenchlab-offline:${scope}:`;
    let registration = null;
    let busy = false;
    let updateIssue = "";
    const hooked = new WeakSet();
    let container, cacheStorage;

    function show(text, detail = "") {
      status.textContent = text;
      hint.textContent = detail;
      hint.hidden = !detail;
    }
    function controls(value) {
      busy = value;
      panel.setAttribute("aria-busy", String(value));
      prepare.disabled = check.disabled = value;
      remove.disabled = value;
      progress.hidden = !value;
    }
    function message(worker, command, timeout = 20000) {
      return new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => { channel.port1.close(); reject(new Error("Die Offline-Prüfung hat nicht geantwortet.")); }, timeout);
        channel.port1.onmessage = event => {
          clearTimeout(timer);
          channel.port1.close();
          event.data?.error ? reject(new Error(event.data.error)) : resolve(event.data);
        };
        worker.postMessage({ command }, [channel.port2]);
      });
    }
    async function refresh() {
      if (busy) return;
      const worker = registration?.waiting || registration?.active;
      check.hidden = remove.hidden = !worker;
      if (!worker) { prepare.hidden = false; show("Nicht vorbereitet"); return; }
      try {
        const report = await message(worker, "status");
        prepare.hidden = report.ready;
        remove.disabled = report.clients > 1;
        remove.title = report.clients > 1 ? "Erst andere WorkbenchLab-Tabs schließen" : "Offline-Kopie entfernen";
        if (!report.ready) show("Offline-Kopie unvollständig", "Bitte erneut vorbereiten, solange Internet verfügbar ist.");
        else if (registration.waiting) show(`Aktualisierung bereit · ${report.version}`, "Wird aktiv, sobald alle WorkbenchLab-Tabs geschlossen sind.");
        else show(`Offline verfügbar · ${report.version}`, updateIssue);
      } catch (error) { show("Offline-Prüfung nicht verfügbar", error.message); }
    }
    function watch(worker) {
      if (!worker || hooked.has(worker)) return;
      hooked.add(worker);
      worker.addEventListener("statechange", () => { if (["installed", "activated", "redundant"].includes(worker.state)) refresh(); });
    }
    function observe() {
      watch(registration.installing);
      watch(registration.waiting);
      registration.addEventListener("updatefound", () => watch(registration.installing));
    }
    async function waitInstalled() {
      const worker = registration.installing;
      if (!worker) return;
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => { worker.removeEventListener("statechange", changed); reject(new Error("Die Offline-Vorbereitung dauert zu lange. Bitte später erneut versuchen.")); }, 180000);
        function changed() {
          if (worker.state !== "redundant" && worker.state !== "activated" && !(worker.state === "installed" && registration.active)) return;
          clearTimeout(timer);
          worker.removeEventListener("statechange", changed);
          worker.state === "redundant" ? reject(new Error("Die Offline-Kopie wurde nicht vollständig gespeichert. Bitte Internetverbindung und Browserspeicher prüfen.")) : resolve();
        }
        worker.addEventListener("statechange", changed);
        changed();
      });
    }
    async function updateRegistration() {
      const response = await fetch(new URL("offline-assets.js", scope), { cache: "no-store", credentials: "omit" });
      if (!response.ok) throw new Error("Versionsprüfung nicht erreichbar");
      await registration.update();
      await waitInstalled();
    }

    try { if (isSecureContext) { container = navigator.serviceWorker; cacheStorage = window.caches; } } catch {}
    if (!container || !cacheStorage) {
      prepare.disabled = true;
      show("Offline-Cache nicht verfügbar", "Alternativ das Offline-Paket herunterladen.");
      return;
    }
    container.addEventListener("message", event => {
      if (event.source?.scriptURL !== script || event.data?.type !== "WORKBENCH_OFFLINE") return;
      if (busy && Number.isInteger(event.data.progress)) {
        progress.max = event.data.total;
        progress.value = event.data.progress;
        show(`Offline vorbereiten · ${event.data.progress}/${event.data.total}`);
      }
      if (event.data.missing) show("Offline-Kopie unvollständig", "Bitte mit Internet erneut vorbereiten.");
    });
    prepare.addEventListener("click", async () => {
      controls(true);
      show("Offline wird vorbereitet");
      let failed = "";
      try {
        registration = await container.register(script, { scope, updateViaCache: "none" });
        observe();
        await waitInstalled();
        const worker = registration.waiting || registration.active;
        if (!worker) throw new Error("Die Offline-Kopie ist noch nicht verfügbar.");
        await message(worker, "prepare", 180000);
      } catch (error) { failed = error.message; }
      finally { controls(false); await refresh(); if (failed) show("Nicht vollständig vorbereitet", failed); }
    });
    check.addEventListener("click", async () => {
      if (!registration) return;
      controls(true);
      show("Version wird geprüft");
      updateIssue = "";
      try { await updateRegistration(); }
      catch { updateIssue = "Die neue Version konnte nicht vollständig geprüft werden. Die bisherige Offline-Kopie bleibt erhalten."; }
      finally { controls(false); await refresh(); }
    });
    remove.addEventListener("click", async () => {
      const worker = registration?.waiting || registration?.active;
      if (!worker) return;
      try {
        if ((await message(worker, "status")).clients > 1) { show("Weitere WorkbenchLab-Tabs geöffnet", "Andere WorkbenchLab-Tabs zuerst schließen."); return; }
        if (!window.confirm("Offline-Kopie entfernen und Seite neu laden? Laufende Übungen und SQL-Datenbanken werden zurückgesetzt. Lernstand vorher als Datei speichern.")) return;
        if ((await message(worker, "status")).clients > 1) { await refresh(); return; }
        controls(true);
        await registration.unregister();
        for (const name of await cacheStorage.keys()) if (name.startsWith(prefix)) await cacheStorage.delete(name);
        const url = new URL(location.href);
        url.searchParams.set("offline", "off");
        location.replace(url.href);
      } catch (error) { controls(false); show("Offline-Kopie nicht entfernt", error.message); }
    });
    document.querySelector("#backupButton").addEventListener("click", refresh);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    container.getRegistration(scope).then(async candidate => {
      if (candidate?.scope === scope && (candidate.active || candidate.waiting || candidate.installing)?.scriptURL === script) {
        registration = candidate;
        observe();
        await refresh();
        // Only an already prepared installation checks for new builds automatically.
        updateRegistration().catch(() => {});
      } else show("Nicht vorbereitet");
    }).catch(() => { prepare.disabled = true; show("Offline-Cache nicht verfügbar"); });
  }
  window.WORKBENCH_OFFLINE_CLIENT = Object.freeze({ init });
})();
