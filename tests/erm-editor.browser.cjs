// Claude, OPT-04: Modell-Editor im Browser.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
      await context.addInitScript(() => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("dialog", (dialog) => dialog.accept());
      await page.goto(base + "#modeling");
      await page.locator(".erm-teaser").waitFor();
      const xpStart = await page.locator("#topXp").innerText();

      // Ohne Freischaltung erreichbar.
      await page.locator('[data-route="modeling/editor"]').click();
      await page.locator("#ermEditor").waitFor();
      assert.equal(await page.locator("#viewTitle").innerText(), "Modell-Editor");
      assert.equal(await page.locator("#ermTask").inputValue(), "fahrschule-ort");
      assert.match(await page.locator("#ermDiagram").innerText(), /Noch kein Entitätstyp/);
      assert.ok(await page.locator("#ermAddRelation").isDisabled());

      const entity = (index) => page.locator(".erm-entity").nth(index);
      const attribute = (entityIndex, index) => entity(entityIndex).locator(".erm-attribute-row").nth(index);

      // Leeres Modell prüfen: beide Entitätstypen fehlen.
      await page.locator("#ermCheck").click();
      assert.match(await page.locator("#ermResult").innerText(), /Noch nicht ganz[\s\S]*„Ort“ fehlt noch[\s\S]*„Fahrschüler“ fehlt noch/);

      // Ort anlegen; der Fokus springt in das neue Namensfeld, das erste Attribut ist als PK vorbelegt.
      await page.locator("#ermAddEntity").click();
      assert.ok(await entity(0).locator("[data-erm-entity-name]").evaluate((input) => input === document.activeElement));
      await page.keyboard.type("Ort");
      await attribute(0, 0).locator("[data-erm-attribute-name]").fill("ortnr");
      assert.ok(await attribute(0, 0).locator("[data-erm-pk]").isChecked());
      await entity(0).locator("[data-erm-add-attribute]").click();
      await page.keyboard.type("ort");

      // Fahrschüler anlegen, zunächst ohne Fremdschlüssel und mit falscher Kardinalität.
      await page.locator("#ermAddEntity").click();
      await page.keyboard.type("Fahrschüler");
      await attribute(1, 0).locator("[data-erm-attribute-name]").fill("schuelernr");
      await entity(1).locator("[data-erm-add-attribute]").click();
      await page.keyboard.type("nachname");
      await entity(1).locator("[data-erm-add-attribute]").click();
      await page.keyboard.type("ortnr");
      await attribute(1, 2).locator("[data-erm-attribute-type]").selectOption("INT");
      await page.locator("#ermAddRelation").click();
      const relation = page.locator(".erm-relation").first();
      await relation.locator("[data-erm-relation-card]").selectOption("N:1");

      // Diagramm zeigt beide Kästen, Schlüsselkennzeichnung und Kardinalitäten.
      const diagram = page.locator("#ermDiagram svg");
      assert.equal(await diagram.locator(".erm-box").count(), 2);
      assert.equal(await diagram.locator(".erm-line").count(), 1);
      assert.deepEqual(await diagram.locator(".erm-card").allTextContents(), ["N", "1"]);
      assert.match(await diagram.locator(".erm-attribute.is-pk").first().textContent(), /ortnr \(PK\)/);
      assert.match(await diagram.getAttribute("aria-label"), /2 Entitätstypen, 1 Beziehung/);

      await page.locator("#ermCheck").click();
      let result = await page.locator("#ermResult").innerText();
      assert.match(result, /N-Seite und braucht einen Fremdschlüssel/);
      assert.match(result, /Kardinalität zwischen/);

      // Korrigieren: Fremdschlüssel setzen, Kardinalität drehen.
      await attribute(1, 2).locator("[data-erm-fk]").check();
      assert.equal(await page.locator("#ermResult").innerText(), "");
      await relation.locator("[data-erm-relation-card]").selectOption("1:N");
      await page.locator("#ermCheck").click();
      result = await page.locator("#ermResult").innerText();
      assert.match(result, /Modell stimmt/);
      assert.match(result, /Beziehung stimmt: ein Datensatz in „Ort“ gehört zu vielen in „Fahrschüler“/);
      assert.equal(await page.locator("#ermResult .is-warning").count(), 0);
      assert.equal(await page.locator("#topXp").innerText(), xpStart);

      // Eine Beziehung eines Entitätstyps mit sich selbst wird abgelehnt.
      await relation.locator("[data-erm-relation-to]").selectOption({ label: "Ort" });
      await page.getByText("zwei verschiedene Entitätstypen").waitFor();
      assert.equal(await relation.locator("[data-erm-relation-to]").inputValue(), await entity(1).getAttribute("data-entity"));

      // SQL-Export.
      const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#ermSql").click()]);
      assert.equal(download.suggestedFilename(), "workbenchlab-modell-fahrschule-ort.sql");
      fs.mkdirSync(".tmp", { recursive: true });
      const file = path.resolve(".tmp", `erm-export-${width}.sql`);
      await download.saveAs(file);
      const sql = fs.readFileSync(file, "utf8");
      assert.match(sql, /CREATE TABLE ort \(\n {2}ortnr INT NOT NULL,\n {2}ort VARCHAR\(50\),\n {2}PRIMARY KEY \(ortnr\)\n\);/);
      assert.match(sql, /FOREIGN KEY \(ortnr\) REFERENCES ort\(ortnr\)/);
      assert.ok(sql.indexOf("CREATE TABLE ort") < sql.indexOf("CREATE TABLE fahrschueler"));

      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);
      await page.screenshot({ path: `.tmp/erm-editor-${width}.png`, animations: "disabled", fullPage: true });

      // Entwurf übersteht Neuladen; je Aufgabe ein eigenes Modell; nicht im Lernstand.
      await page.reload();
      await page.locator("#ermEditor .erm-entity").first().waitFor();
      assert.equal(await page.locator(".erm-entity").count(), 2);
      assert.equal(await entity(1).locator("[data-erm-entity-name]").inputValue(), "Fahrschüler");
      await page.locator("#ermTask").selectOption("fahrradvermietung");
      assert.equal(await page.locator(".erm-entity").count(), 0);
      assert.match(await page.locator(".erm-task p").innerText(), /Kunden mieten Fahrräder/);
      await page.locator("#ermTask").selectOption("frei");
      assert.equal(await page.locator("#ermCheck").count(), 0);
      await page.locator("#ermTask").selectOption("fahrschule-ort");
      assert.equal(await page.locator(".erm-entity").count(), 2);
      assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1").includes("Fahrschüler")), false);

      // Diagramm als eigenständige Bilddatei.
      const [image] = await Promise.all([page.waitForEvent("download"), page.locator("#ermImage").click()]);
      assert.equal(image.suggestedFilename(), "workbenchlab-modell-fahrschule-ort.svg");
      const imageFile = path.resolve(".tmp", `erm-export-${width}.svg`);
      await image.saveAs(imageFile);
      const svg = fs.readFileSync(imageFile, "utf8");
      assert.ok(svg.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
      assert.match(svg, /<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
      assert.match(svg, />Fahrschüler</);
      assert.match(svg, />ortnr \(FK\)</);
      assert.doesNotMatch(svg, /var\(|class=/);
      const imagePage = await context.newPage();
      await imagePage.setContent(`<img id="i" src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}">`);
      assert.ok(await imagePage.locator("#i").evaluate((img) => img.decode().then(() => img.naturalWidth > 300 && img.naturalHeight > 80)));
      await imagePage.close();

      // M:N-Aufgabe: direkte M:N-Beziehung wird erklärt, das aufgelöste Modell besteht.
      const rental = (resolved) => ({ nextId: 20, entities: [
        { id: 1, name: "Kunde", attributes: [{ id: 2, name: "kundennr", type: "INT", pk: true, fk: false }, { id: 3, name: "nachname", type: "VARCHAR(50)", pk: false, fk: false }] },
        { id: 4, name: "Fahrrad", attributes: [{ id: 5, name: "fahrradnr", type: "INT", pk: true, fk: false }, { id: 6, name: "modell", type: "VARCHAR(50)", pk: false, fk: false }] },
        ...(resolved ? [{ id: 7, name: "Mietvertrag", attributes: [{ id: 8, name: "vertragnr", type: "INT", pk: true, fk: false }, { id: 9, name: "von_datum", type: "DATE", pk: false, fk: false }, { id: 10, name: "kundennr", type: "INT", pk: false, fk: true }, { id: 11, name: "fahrradnr", type: "INT", pk: false, fk: true }] }] : [])
      ], relations: resolved ? [{ id: 12, from: 1, to: 7, card: "1:N" }, { id: 13, from: 7, to: 4, card: "N:1" }] : [{ id: 12, from: 1, to: 4, card: "M:N" }] });
      for (const resolved of [false, true]) {
        await page.evaluate((data) => {
          const store = JSON.parse(localStorage.getItem("workbenchlab-erm-v1"));
          store.task = "fahrradvermietung";
          store.models.fahrradvermietung = data;
          localStorage.setItem("workbenchlab-erm-v1", JSON.stringify(store));
        }, rental(resolved));
        await page.reload();
        await page.locator("#ermEditor .erm-entity").first().waitFor();
        assert.equal(await page.locator("#ermTask").inputValue(), "fahrradvermietung");
        assert.equal(await page.locator("#ermDiagram .erm-box").count(), resolved ? 3 : 2);
        await page.locator("#ermCheck").click();
        const text = await page.locator("#ermResult").innerText();
        if (resolved) {
          assert.match(text, /Modell stimmt/);
          assert.equal(await page.locator("#ermResult .is-warning").count(), 0);
          assert.deepEqual(await page.locator("#ermDiagram .erm-card").allTextContents(), ["1", "N", "N", "1"]);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
        } else {
          assert.match(text, /„Mietvertrag“ fehlt noch/);
          assert.match(text, /Beziehungsentität mit zwei 1:N-Beziehungen/);
        }
      }
      await page.locator("#ermTask").selectOption("fahrschule-ort");

      // Entfernen eines Entitätstyps entfernt auch seine Beziehungen; Leeren setzt zurück.
      await entity(0).locator("[data-erm-remove-entity]").click();
      assert.equal(await page.locator(".erm-entity").count(), 1);
      assert.equal(await page.locator(".erm-relation").count(), 0);
      await page.locator("#ermReset").click();
      assert.equal(await page.locator(".erm-entity").count(), 0);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: model editor reachable without unlock, build 1:N model by keyboard, live diagram, specific feedback, pass, self-relation rejected, SQL export, persistence per task, not in progress data, image export, M:N task, removal and reset, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
