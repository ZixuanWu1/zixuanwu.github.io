const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../assets/js/pupu-likes.js"), "utf8");
const key = "zixuanwu1_github_io_pupu_likes_v1";
const storageKey = `pupu-liked:${key}`;
const settle = () => new Promise(resolve => setImmediate(resolve));
const response = (value, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => ({ value })
});

async function mount({ fetchImpl, storage = new Map(), hostname = "zixuanwu1.github.io", blockedStorage = false }) {
  const calls = [];
  const elements = {};
  for (const selector of ["button", ".pupu-likes__label", ".pupu-likes__heart", ".pupu-likes__count", ".pupu-likes__status"]) {
    elements[selector] = {
      textContent: "", attributes: {}, handlers: {}, disabled: true,
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, handler) { this.handlers[name] = handler; }
    };
  }
  const events = {};
  const localStorage = {
    getItem(name) { if (blockedStorage) throw new Error("Blocked"); return storage.get(name) ?? null; },
    setItem(name, value) { if (blockedStorage) throw new Error("Blocked"); storage.set(name, value); }
  };
  vm.runInNewContext(source, {
    document: { getElementById: () => ({ dataset: { counterKey: key }, querySelector: selector => elements[selector] }) },
    window: { location: { hostname }, localStorage, setTimeout, clearTimeout, addEventListener: (name, fn) => { events[name] = fn; } },
    AbortController,
    fetch: async (url, options) => { calls.push({ url, options }); return fetchImpl(url); }
  });
  await settle();
  return {
    calls, storage, events,
    button: elements.button,
    count: elements[".pupu-likes__count"],
    status: elements[".pupu-likes__status"],
    click: () => elements.button.handlers.click()
  };
}

test("a fresh counter starts at zero; one successful click persists and cannot repeat", async () => {
  const app = await mount({ fetchImpl: url => url.includes("/get/") ? response(null, 404) : response("1") });
  assert.equal(app.count.textContent, "0 likes");
  assert.equal(app.calls.length, 1);
  await app.click();
  assert.equal(app.count.textContent, "1 like");
  assert.equal(app.storage.get(storageKey), "1");
  assert.equal(app.button.attributes["aria-pressed"], "true");
  await app.click();
  assert.equal(app.calls.length, 2);
  assert.equal(app.calls[1].options.credentials, "omit");
  assert.equal(app.calls[1].options.referrerPolicy, "no-referrer");
});

test("returning visitors see the latest shared total without adding another like", async () => {
  const app = await mount({ storage: new Map([[storageKey, "1"]]), fetchImpl: () => response(12) });
  assert.equal(app.count.textContent, "12 likes");
  assert.equal(app.button.disabled, true);
  await app.click();
  assert.equal(app.calls.length, 1);
});

test("failed writes do not change the total or record a successful like", async () => {
  const app = await mount({ fetchImpl: url => url.includes("/get/") ? response(8) : response(null, 503) });
  await app.click();
  assert.equal(app.count.textContent, "8 likes");
  assert.equal(app.storage.has(storageKey), false);
  assert.equal(app.button.disabled, false);
  assert.match(app.status.textContent, /couldn’t confirm/);
});

test("failed reads and invalid values never masquerade as a zero count", async () => {
  for (const result of [response(null, 503), response(null), response(-3), response("NaN")]) {
    const app = await mount({ fetchImpl: () => result });
    assert.equal(app.count.textContent, "Likes unavailable");
    assert.equal(app.button.disabled, false);
  }
});

test("blocked browser storage does not prevent a shared like or repeat it in this session", async () => {
  const app = await mount({ blockedStorage: true, fetchImpl: url => response(url.includes("/get/") ? 3 : 4) });
  await app.click();
  assert.equal(app.count.textContent, "4 likes");
  await app.click();
  assert.equal(app.calls.length, 2);
});

test("local previews use a separate counter", async () => {
  const app = await mount({ hostname: "127.0.0.1", fetchImpl: () => response(0) });
  await app.click();
  assert.ok(app.calls.every(call => call.url.endsWith(`${key}_preview`)));
  assert.equal(app.storage.has(storageKey), false);
});

test("rapid clicks cannot submit multiple concurrent likes", async () => {
  let finish;
  const app = await mount({ fetchImpl: url => url.includes("/get/") ? response(0) : new Promise(resolve => { finish = resolve; }) });
  const first = app.click();
  await app.click();
  assert.equal(app.calls.length, 2);
  finish(response(1));
  await first;
  assert.equal(app.count.textContent, "1 like");
});

test("a successful like in another tab updates this tab without an extra write", async () => {
  const app = await mount({ fetchImpl: () => response(6) });
  await app.events.storage({ key: storageKey, newValue: "1" });
  await app.click();
  assert.equal(app.button.disabled, true);
  assert.ok(app.calls.every(call => call.url.includes("/get/")));
});
