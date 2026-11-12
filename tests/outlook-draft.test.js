const assert = require("node:assert/strict");
const test = require("node:test");
const { createDraft } = require("../outlook-draft.js");

const address = "tst.qaa@ks-nagold.de";
const json = '{"generalNotes":"Übung zur Sicherung"}';
const file = new File([json], "workbenchlab-test.json", { type: "application/json" });
const input = { accessToken: "fixture", expectedAddress: address, file };

test("Outlook creates only a draft addressed to the verified mailbox with the exact JSON attached", async t => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? Response.json({ mail: address.toUpperCase() })
      : Response.json({ webLink: "https://outlook.office.com/mail/drafts/id/fixture" }, { status: 201 });
  });
  assert.deepEqual(await createDraft(input), { outlookUrl: "https://outlook.office.com/mail/drafts/id/fixture" });
  assert.deepEqual(calls.map(call => call.url), [
    "https://graph.microsoft.com/v1.0/me?$select=mail",
    "https://graph.microsoft.com/v1.0/me/messages"
  ]);
  assert.ok(calls.every(call => call.options.redirect === "error"));
  assert.equal(calls[0].options.body, undefined);
  assert.equal(calls[1].options.method, "POST");
  const body = JSON.parse(calls[1].options.body);
  assert.deepEqual(body.toRecipients, [{ emailAddress: { address } }]);
  assert.equal(body.attachments.length, 1);
  assert.equal(body.attachments[0].name, file.name);
  assert.equal(Buffer.from(body.attachments[0].contentBytes, "base64").toString("utf8"), json);
});

test("invalid backups or addresses make no request and mailbox mismatch uploads nothing", async t => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => Response.json({ mail: "abc.def@ks-nagold.de" }));
  await assert.rejects(createDraft({ ...input, expectedAddress: "tst.qaa@example.com" }), /Schuladresse/);
  const oversized = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "large.json", { type: "application/json" });
  await assert.rejects(createDraft({ ...input, file: oversized }), /2 MiB/);
  assert.equal(fetchMock.mock.callCount(), 0);
  await assert.rejects(createDraft(input), /stimmt nicht/);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("failed Outlook requests are not retried and foreign links are not returned", async t => {
  let reply = new Response(null, { status: 429 });
  const fetchMock = t.mock.method(globalThis, "fetch", async url => url.includes("/me?")
    ? Response.json({ mail: address }) : reply);
  await assert.rejects(createDraft(input), /Entwurf nicht erstellen/);
  assert.equal(fetchMock.mock.callCount(), 2);
  reply = Response.json({ webLink: "https://outlook.office.com.example.net/draft" }, { status: 201 });
  assert.deepEqual(await createDraft(input), { outlookUrl: null });
});
