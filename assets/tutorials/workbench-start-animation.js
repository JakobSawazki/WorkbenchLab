(() => {
  "use strict";
  const canvas = document.querySelector("#film");
  const ctx = canvas.getContext("2d", { alpha: false });
  const logo = new Image();
  logo.src = "../workbenchlab-titanium.webp";
  const duration = 102;
  const scenes = [
    { start: 0, end: 4, step: 0, title: "Informatik-Stick und MySQL Workbench", caption: "Die richtige Reihenfolge: Stick → MySQL → Workbench → Verbindung.", kind: "intro" },
    { start: 4, end: 11, step: 1, title: "1 · Informatik-Stick starten", caption: "Schule: Desktop-Verknüpfung doppelklicken. Laptop: im Startmenü „Start“ öffnen.", kind: "launch" },
    { start: 11, end: 19, step: 1, title: "Zum Datenbank-Ordner scrollen", caption: "Kurz warten. Dann nach unten bis „Datenbank MariaDB …“ scrollen.", kind: "scroll" },
    { start: 19, end: 25, step: 2, title: "2 · Erst „MySQL starten“", caption: "„MySQL starten“ mit einem Doppelklick ausführen.", kind: "mysql" },
    { start: 25, end: 37, step: 2, title: "Warten, bis der Server bereit ist", caption: "Das CMD-Fenster NICHT schließen. Auf „ready for connections“ warten.", kind: "console" },
    { start: 37, end: 41, step: 2, title: "CMD darf minimiert werden", caption: "Minimieren ist erlaubt. Das Fenster und der Server bleiben geöffnet.", kind: "minimize" },
    { start: 41, end: 49, step: 3, title: "3 · Jetzt die Workbench starten", caption: "Schul-PC: MySQL Workbench 6.3.10. Laptop der Lehrkraft: 8.0.21.", kind: "workbench" },
    { start: 49, end: 55, step: 4, title: "4 · Eine neue Connection anlegen", caption: "Beim ersten Mal: auf das Plus neben „MySQL Connections“ klicken.", kind: "home" },
    { start: 55, end: 75, step: 4, title: "Die Verbindungsdaten eintragen", caption: "local · Standard (TCP/IP) · 127.0.0.1 · 3306 · root", kind: "connection" },
    { start: 75, end: 83, step: 4, title: "Verbindung testen", caption: "„Test Connection“ anklicken. Passwort nur nach Vorgabe der Lehrkraft, falls abgefragt.", kind: "test" },
    { start: 83, end: 88, step: 4, title: "Die funktionierende Verbindung speichern", caption: "Nach erfolgreichem Test: Bestätigung schließen, dann die Connection mit „OK“ speichern.", kind: "save" },
    { start: 88, end: 95, step: 5, title: "5 · „local“ öffnen", caption: "Die neue Kachel „local“ doppelklicken. MySQL läuft weiterhin im Hintergrund.", kind: "open" },
    { start: 95, end: 102, step: 5, title: "Bereit für die Datenbankarbeit", caption: "SQL und Modelle können jetzt bearbeitet werden. CMD bleibt offen oder minimiert.", kind: "ready" }
  ];
  const colors = { bg: "#090b0e", panel: "#171b1f", mint: "#8adccb", blue: "#78bfff", amber: "#ffd27b", white: "#f5f7fa", muted: "#c1cbd3" };
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const ease = (n) => { n = clamp(n); return n * n * (3 - 2 * n); };
  function rect(x, y, w, h, fill, border, radius = 0) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = fill; ctx.fill();
    if (border) { ctx.strokeStyle = border; ctx.lineWidth = 2; ctx.stroke(); }
  }
  function text(value, x, y, size = 28, fill = "#20272e", weight = 400, align = "left", family = "Segoe UI") {
    ctx.font = `${weight} ${size}px "${family}", sans-serif`;
    ctx.fillStyle = fill; ctx.textAlign = align; ctx.textBaseline = "middle";
    ctx.fillText(value, x, y);
  }
  function lines(value, x, y, width, size, fill, weight = 400, gap = 1.4) {
    ctx.font = `${weight} ${size}px "Segoe UI", sans-serif`;
    let line = "", row = 0;
    for (const word of value.split(" ")) {
      if (line && ctx.measureText(`${line} ${word}`).width > width) {
        text(line, x, y + row++ * size * gap, size, fill, weight); line = word;
      } else line = line ? `${line} ${word}` : word;
    }
    text(line, x, y + row * size * gap, size, fill, weight);
    return row + 1;
  }
  function button(label, x, y, w, selected = false) {
    rect(x, y, w, 46, selected ? "#d8eefc" : "#fff", selected ? "#1277b8" : "#aab2b8", 5);
    text(label, x + w / 2, y + 23, 24, "#1c2833", 500, "center");
  }
  function playSymbol(x, y, size = 70) {
    const shade = ctx.createLinearGradient(x, y, x + size, y + size);
    shade.addColorStop(0, "#fafcfd"); shade.addColorStop(0.6, "#9fa7ad"); shade.addColorStop(1, "#444b51");
    ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = shade; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = "#444b51"; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + size * 0.4, y + size * 0.27); ctx.lineTo(x + size * 0.7, y + size * 0.5); ctx.lineTo(x + size * 0.4, y + size * 0.73); ctx.closePath(); ctx.fillStyle = "#15191c"; ctx.fill();
  }
  function folder(x, y) {
    rect(x, y - 13, 25, 12, "#d59e24", null, 3);
    rect(x, y - 7, 43, 30, "#f1c24c", "#d29a20", 3);
  }
  function cursor(x, y, clicks, t, label = "") {
    for (const click of clicks) {
      const delta = t - click;
      if (delta >= 0 && delta < 0.65) {
        ctx.globalAlpha = 1 - delta / 0.65;
        ctx.beginPath(); ctx.arc(x + 6, y + 7, 15 + delta * 80, 0, Math.PI * 2);
        ctx.strokeStyle = colors.amber; ctx.lineWidth = 5; ctx.stroke(); ctx.globalAlpha = 1;
      }
    }
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 39); ctx.lineTo(10, 29); ctx.lineTo(19, 47); ctx.lineTo(28, 42); ctx.lineTo(18, 25); ctx.lineTo(33, 24); ctx.closePath();
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#10151b"; ctx.lineWidth = 3; ctx.fill(); ctx.stroke(); ctx.restore();
    if (label) {
      ctx.font = "600 25px Segoe UI";
      const w = ctx.measureText(label).width + 30;
      const lx = Math.min(x + 48, 1840 - w);
      rect(lx, y + 32, w, 42, "#242c32", colors.amber, 5);
      text(label, lx + 15, y + 53, 25, colors.amber, 600);
    }
  }
  function move(t, from, to, at, clickTimes = [], label = "") {
    const p = ease((t - at + 1.6) / 1.6);
    cursor(from[0] + (to[0] - from[0]) * p, from[1] + (to[1] - from[1]) * p, clickTimes, t, t >= at - 0.3 ? label : "");
  }
  function desktop(serverRunning) {
    rect(64, 192, 1792, 706, "#101b28", "#475560", 8);
    rect(64, 839, 1792, 59, "#242b33");
    rect(890, 853, 32, 31, "#63c3fc");
    if (serverRunning) text("CMD · MySQL läuft", 1210, 870, 22, colors.mint, 600);
  }
  function windowFrame(title, x = 340, y = 216, w = 1240, h = 600, dark = false) {
    rect(x + 8, y + 9, w, h, "#05080c", null, 8);
    rect(x, y, w, h, dark ? "#101112" : "#f4f5f6", "#9ca9b4", 8);
    rect(x, y, w, 52, dark ? "#30343a" : "#e5e9ee", null, 8);
    text(title, x + 20, y + 27, 26, dark ? "#fff" : "#222");
    text("−", x + w - 160, y + 26, 32, dark ? "#fff" : "#333", 400, "center");
    text("□", x + w - 100, y + 26, 27, dark ? "#fff" : "#333", 400, "center");
    text("×", x + w - 40, y + 26, 32, dark ? "#fff" : "#333", 400, "center");
  }
  const rowLabels = [
    ["Informatik-Stick Verwaltung", true], ["EigeneDateien", true], ["Hilfe_und_Dokumentation", true],
    ["Datenbanktreiber", true], ["Laufzeitkomponenten", true], ["Python Programmierung", true],
    ["Thonny", false], ["Qt Designer", false], ["Java Programmierung", true], ["Webserver", true],
    ["Apache starten", false], ["Apache stoppen", false], ["Tomcat starten", false], ["Tomcat stoppen", false],
    ["Datenbank MariaDB …", true], ["Xampp · Setup", false], ["MySQL starten", false], ["MySQL stoppen", false],
    ["MySQL Datensicherung", false], ["MySQL Upgrade", false], ["MySQL Workbench 6.3.7", false],
    ["MySQL Workbench 6.3.10", false], ["MySQL Workbench 8.0.21", false]
  ];
  function stick(offset, selected = -1) {
    windowFrame("Informatikstick", 380, 213, 1160, 608);
    text("Datei     Bearbeiten     Einrichtung     ?", 405, 289, 23);
    text("Liste     Suche     Notizen", 407, 333, 24, "#234d6d");
    rect(397, 357, 1117, 437, "#fff", "#b7c0c8");
    ctx.save(); ctx.beginPath(); ctx.rect(399, 359, 1072, 433); ctx.clip();
    rowLabels.forEach(([label, isFolder], i) => {
      const y = 386 + i * 42 - offset;
      if (i === selected) rect(401, y - 20, 1065, 41, "#087fbd");
      if (isFolder) folder(424, y - 2);
      else {
        rect(454, y - 16, 34, 33, label.includes("Workbench") ? "#215b80" : "#eef3f5", "#8396a5", 4);
        text(label.includes("Workbench") ? "W" : "SQL", 471, y, label.includes("Workbench") ? 22 : 12, label.includes("Workbench") ? "#fff" : "#1a3b4c", 700, "center");
      }
      text(label, isFolder ? 485 : 507, y, 26, i === selected ? "#fff" : "#1c3b52");
    });
    ctx.restore();
    rect(1484, 370, 13, 407, "#edf0f2", null, 6);
    rect(1484, 370 + offset / 577 * 285, 13, 111, "#8a979e", null, 6);
  }
  function terminal(progress, ready) {
    windowFrame("C:\\WINDOWS\\system32\\cmd.exe", 214, 219, 1492, 598, true);
    const log = ["Bitte warten ...", "MySQL started mit mysql\\bin\\my.ini (console)",
      "mysqld (10.4.13-MariaDB) starting ...", "InnoDB: Initializing buffer pool ...",
      "InnoDB: Completed initialization of buffer pool", "InnoDB: Starting recovery ...",
      "InnoDB: Creating shared tablespace ...", "Server socket created ..."];
    const n = Math.min(log.length, 2 + Math.floor(progress * 6));
    for (let i = 0; i < n; i++) text(log[i], 246, 304 + i * 43, 29, "#d4d9dd", 400, "left", "Consolas");
    if (ready) {
      rect(241, 660, 1050, 58, "#19372d", colors.mint, 4);
      text("mysqld: ready for connections.  port: 3306", 258, 689, 30, colors.mint, 700, "left", "Consolas");
    }
    rect(1359, 278, 308, 65, "#472c22", colors.amber, 6);
    text("Nicht schließen!", 1513, 310, 27, colors.amber, 700, "center");
  }
  function wbHome(tile = false) {
    windowFrame("MySQL Workbench", 215, 215, 1490, 602);
    text("File     Edit     View     Database     Tools     Help", 240, 294, 22);
    text("MySQL Connections", 278, 389, 43, "#424d57", 600);
    ctx.beginPath(); ctx.arc(738, 389, 21, 0, Math.PI * 2); ctx.strokeStyle = "#3b4650"; ctx.lineWidth = 3; ctx.stroke();
    text("+", 738, 389, 35, "#3b4650", 400, "center");
    if (tile) {
      rect(279, 444, 494, 186, "#e9ecef", "#b4bcc2", 3);
      text("local", 305, 491, 37, "#526577", 600);
      text("root", 305, 545, 29, "#576773");
      text("127.0.0.1:3306", 305, 589, 29, "#576773");
    }
  }
  const fields = [
    { label: "Connection Name", value: "local", y: 336 },
    { label: "Connection Method", value: "Standard (TCP/IP)", y: 401 },
    { label: "Hostname", value: "127.0.0.1", y: 507 },
    { label: "Port", value: "3306", y: 566 },
    { label: "Username", value: "root", y: 625 }
  ];
  function connection(local, success = false, action = "") {
    wbHome(false);
    rect(65, 191, 1790, 707, "rgba(0,0,0,0.26)");
    windowFrame("Setup New Connection", 370, 255, 1180, 542);
    const active = local >= 0 && local < 20 ? Math.min(4, Math.floor(local / 4)) : -1;
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      text(`${f.label}:`, 397, f.y, 26, "#35434d", 500);
      rect(717, f.y - 23, 764, 45, "#fff", active === i ? "#087fbd" : "#abb4bc", 3);
      const typing = i === 0 || i === 2;
      let value = f.value;
      if (i === 0 && local < 0) value = "";
      else if (active === i && typing) value = f.value.slice(0, Math.floor(clamp((local % 4 - 0.9) / 1.5) * f.value.length));
      else if (i === 0 && local < 0.9) value = "";
      text(value, 737, f.y, 29, "#182934", 500);
      if (i === 1) text("⌄", 1452, f.y, 25, "#455763");
    }
    text("Parameters     SSL     Advanced", 400, 454, 25, "#245b7d", 600);
    text("Password / Default Schema: zunächst keine Vorgaben ändern.", 398, 688, 23, "#52626e");
    button("Test Connection", 1030, 728, 256, action === "test");
    button("Cancel", 1301, 728, 105);
    button("OK", 1421, 728, 102, action === "ok");
    if (success) {
      rect(540, 400, 840, 270, "#f6f7f8", "#8797a4", 7);
      text("Connection Test", 567, 433, 27, "#314450", 600);
      text("✓", 599, 520, 59, "#177450", 700);
      text("Verbindung erfolgreich", 666, 507, 35, "#23453c", 600);
      text("Beispiel eines erfolgreichen Tests", 666, 550, 26, "#50625d");
      button("OK", 1221, 595, 111);
    }
  }
  function drawScene(scene, time) {
    const t = time - scene.start;
    desktop(time >= 33);
    switch (scene.kind) {
      case "intro": {
        const names = ["Informatik-Stick", "MySQL starten", "Workbench", "Connection"];
        names.forEach((name, i) => {
          const x = 145 + i * 431;
          rect(x, 350, 353, 244, "#242a30", i < Math.floor(t) + 1 ? colors.mint : "#616d77", 7);
          text(String(i + 1).padStart(2, "0"), x + 176, 417, 60, colors.mint, 700, "center");
          text(name, x + 176, 505, 33, colors.white, 600, "center");
          if (i < 3) text("→", x + 392, 472, 49, colors.amber, 400, "center");
        });
        text("Schule 6.3.10  ·  Laptop 8.0.21", 960, 686, 33, colors.muted, 400, "center");
        break;
      }
      case "launch": {
        rect(205, 317, 230, 209, "#2c343d", "#647481", 6);
        playSymbol(277, 346, 88);
        text("Informatik-Stick", 320, 480, 27, colors.white, 600, "center");
        rect(733, 333, 954, 345, "#252a30", "#6b7680", 8);
        text("Laptop · Startmenü", 771, 384, 31, colors.white, 600);
        rect(1063, 426, 170, 174, "#343b43", null, 5); playSymbol(1108, 450, 80);
        text("Start", 1148, 568, 30, colors.white, 600, "center");
        move(t, [1570, 730], [309, 397], 3.7, [3.7, 3.94], "Doppelklick");
        break;
      }
      case "scroll": {
        const offset = ease((t - 1.5) / 4) * 577;
        stick(offset);
        move(t, [310, 405], [1488, 581], 1.3, [], "Scrollen");
        break;
      }
      case "mysql": {
        stick(577, t >= 2.2 ? 16 : -1);
        const y = 386 + 16 * 42 - 577;
        move(t, [1488, 581], [656, y], 2.2, [2.2, 2.44], "Doppelklick");
        break;
      }
      case "console": {
        terminal(clamp(t / 7), t >= 8);
        if (t >= 8) text("Server bereit", 1454, 745, 33, colors.mint, 700, "center");
        break;
      }
      case "minimize": {
        if (t < 1.5) terminal(1, true);
        else { stick(577); rect(1161, 845, 300, 43, "#244338", colors.mint, 4); text("CMD · MySQL läuft", 1311, 867, 22, colors.mint, 600, "center"); }
        move(t, [955, 720], [1546, 244], 1.25, [1.25], "Minimieren");
        break;
      }
      case "workbench": {
        stick(577, t >= 3.8 ? 21 : -1);
        rect(71, 680, 302, 104, "#203441", colors.blue, 5);
        text("Schule: 6.3.10", 94, 713, 30, colors.white, 600);
        text("Laptop: 8.0.21", 94, 757, 28, colors.muted);
        const y = 386 + 21 * 42 - 577;
        move(t, [1450, 720], [785, y], 3.8, [3.8, 4.04], "Doppelklick · Schule");
        break;
      }
      case "home": {
        wbHome();
        move(t, [1370, 692], [738, 389], 3.1, [3.1], "Neue Verbindung");
        break;
      }
      case "connection": {
        connection(t);
        const i = Math.min(4, Math.floor(t / 4));
        const f = fields[i];
        move(t % 4, [1310, f.y + 80], [846, f.y], 0.8, [0.8], i === 1 || i === 3 || i === 4 ? "Vorgabe prüfen" : "Eintragen");
        break;
      }
      case "test": {
        connection(20, t >= 4.2, "test");
        move(t, [846, 625], [1157, 750], 1.5, [1.5], "Test Connection");
        if (t >= 6.2) text("Bei Fehlern: MySQL, Host, Port und Zugang prüfen.", 960, 865, 24, colors.amber, 600, "center");
        break;
      }
      case "save": {
        connection(20, t < 1.3, "ok");
        if (t < 1.5) move(t, [1157, 750], [1277, 617], 0.8, [0.8], "Bestätigen");
        else move(t, [1277, 617], [1474, 751], 3, [3], "Speichern");
        break;
      }
      case "open": {
        wbHome(true);
        move(t, [1474, 751], [524, 500], 3, [3, 3.24], "Doppelklick");
        break;
      }
      case "ready": {
        windowFrame("MySQL Workbench · local", 215, 215, 1490, 602);
        rect(233, 280, 303, 502, "#eef1f3", "#bac6ce");
        text("SCHEMAS", 252, 311, 28, "#31434f", 700);
        text("Query 1", 575, 307, 29, "#245b7d", 600);
        rect(554, 345, 1118, 424, "#fff", "#b9c3cb");
        text("1", 572, 388, 27, "#6e8598", 400, "left", "Consolas");
        text("Verbindung geöffnet", 960, 850, 32, colors.mint, 600, "center");
        break;
      }
    }
  }
  function render(time) {
    time = clamp(time, 0, duration - 0.001);
    const scene = scenes.find((item) => time >= item.start && time < item.end);
    rect(0, 0, 1920, 1080, colors.bg);
    if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, 64, 33, 62, 62);
    text("WorkbenchLab", 146, 62, 30, colors.white, 700);
    text("ANIMIERTE ANLEITUNG · NACHGESTELLTE OBERFLÄCHEN", 1848, 62, 20, colors.muted, 500, "right");
    text(scene.title, 65, 136, 43, colors.white, 700);
    drawScene(scene, time);
    lines(scene.caption, 65, 951, 1784, 33, colors.white, 500, 1.22);
    const labels = ["Stick", "MySQL", "Workbench", "Connection", "Bereit"];
    labels.forEach((label, i) => {
      const x = 65 + i * 363;
      rect(x, 1036, 335, 4, i < scene.step ? colors.mint : "#48515a");
      text(`${i + 1}  ${label}`, x, 1013, 21, i < scene.step ? colors.mint : colors.muted, 600);
    });
    document.querySelector("#film").setAttribute("aria-label", `${scene.title}. ${scene.caption}`);
    return { title: scene.title, kind: scene.kind, time };
  }
  let playing = false, current = 0, started = 0;
  function sync() {
    document.querySelector("#position").value = current;
    document.querySelector("#time").textContent = `${Math.floor(current / 60)}:${String(Math.floor(current % 60)).padStart(2, "0")} / 1:42`;
  }
  function tick(now) {
    if (playing) {
      current = Math.min(duration, (now - started) / 1000);
      render(current); sync();
      if (current >= duration) setPlaying(false);
    }
    requestAnimationFrame(tick);
  }
  const play = document.querySelector("#play");
  function setPlaying(value) {
    if (value && current >= duration) current = 0;
    playing = value; started = performance.now() - current * 1000;
    play.innerHTML = `<i data-lucide="${playing ? "pause" : "play"}"></i>`;
    play.setAttribute("aria-label", playing ? "Pause" : "Wiedergabe");
    play.title = playing ? "Pause" : "Wiedergabe";
    window.lucide?.createIcons();
  }
  play.addEventListener("click", () => setPlaying(!playing));
  document.querySelector("#restart").addEventListener("click", () => { current = 0; render(0); sync(); setPlaying(true); });
  document.querySelector("#position").addEventListener("input", (event) => { current = Number(event.target.value); started = performance.now() - current * 1000; render(current); sync(); });
  logo.addEventListener("load", () => { if (!playing) render(current); });
  window.WorkbenchStart = { duration, scenes, render, pause: () => setPlaying(false) };
  render(0); window.lucide?.createIcons(); requestAnimationFrame(tick);
})();
