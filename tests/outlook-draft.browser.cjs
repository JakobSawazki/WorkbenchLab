const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 360, height: 760 } });
    await page.addInitScript(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({
      name: "TST.QAA", className: "TEST", generalNotes: "Fiktiver Lernstand"
    })));
    const posts = [];
    let mailbox = "tst.qaa@ks-nagold.de";
    await page.route("**/*", route => {
      const url = route.request().url();
      if (url.startsWith(base)) return route.continue();
      if (url === "https://graph.microsoft.com/v1.0/me?$select=mail") return route.fulfill({ json: { mail: mailbox } });
      if (url === "https://graph.microsoft.com/v1.0/me/messages" && route.request().method() === "POST") {
        posts.push(route.request().postDataJSON());
        return route.fulfill({ status: 201, json: { webLink: "https://outlook.office.com/mail/drafts/id/test" } });
      }
      return route.abort();
    });
    const open = () => page.locator("#quickSaveButton").click({ button: "right" });
    const automatic = page.locator("#backupOutlookDraft");
    await page.goto(base + "#home");
    await open();
    assert.ok(await automatic.isHidden());
    assert.ok(await page.locator("#backupEmailDraft").isVisible());
    assert.equal(posts.length, 0);

    await page.route("**/outlook-auth.js?*", route => route.fulfill({
      contentType: "text/javascript",
      body: 'window.WORKBENCH_OUTLOOK_AUTH = { enabled: true, prepare: async () => true, getToken: async () => "fixture" };'
    }));
    await page.reload();
    await open();
    await automatic.click();
    await page.getByText(/Entwurf mit Sicherung erstellt/).waitFor();
    assert.equal(posts.length, 1);
    assert.equal(posts[0].toRecipients[0].emailAddress.address, mailbox);
    const json = JSON.parse(Buffer.from(posts[0].attachments[0].contentBytes, "base64").toString("utf8"));
    assert.equal(json.data.generalNotes, "Fiktiver Lernstand");
    assert.equal(await page.locator("#backupOutlookOpen").getAttribute("href"), "https://outlook.office.com/mail/drafts/id/test");
    assert.ok(await page.locator("#backupDialog").evaluate(el => el.scrollWidth <= el.clientWidth + 1));

    mailbox = "abc.def@ks-nagold.de";
    await automatic.click();
    await page.getByText(/Postfach stimmt nicht/).waitFor();
    assert.equal(posts.length, 1);
    assert.ok(await page.locator("#backupOutlookOpen").isHidden());
    console.log("PASS: disabled fallback, automatic draft with actual backup JSON, mailbox mismatch without upload.");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
