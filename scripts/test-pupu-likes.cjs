const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../assets/js/pupu-likes.js"), "utf8");
const key = "zixuanwu1_github_io_pupu_likes_v1";
const storageKey = `pupu-liked:${key}`;
const settle = async () => {
  for (let i = 0; i < 10; i++) await new Promise(resolve => setImmediate(resolve));
};
const response = (value, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => ({ value })
});

async function mount({ fetchImpl, storage = new Map(), hostname = "zixuanwu1.github.io", blockedStorage = false }) {
  const calls = [];
  const elements = {};
  for (const selector of [".pupu-likes__button", ".pupu-likes__label", ".pupu-likes__heart", ".pupu-likes__count", ".pupu-likes__status", ".pupu-likes__retry"]) {
    elements[selector] = {
      textContent: "", attributes: {}, handlers: {}, disabled: true, hidden: true,
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
    window: {
      location: { hostname }, localStorage,
      setTimeout: (fn, ms) => ms < 10000 ? setImmediate(fn) : setTimeout(fn, ms),
      clearTimeout,
      addEventListener: (name, fn) => { events[name] = fn; }
    },
    AbortController,
    fetch: async (url, options) => { calls.push({ url, options }); return fetchImpl(url); }
  });
  await settle();
  return {
    calls, storage, events,
    button: elements[".pupu-likes__button"],
    retry: elements[".pupu-likes__retry"],
    count: elements[".pupu-likes__count"],
    status: elements[".pupu-likes__status"],
    click: () => elements[".pupu-likes__button"].handlers.click()
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
  assert.equal(app.calls.filter(call => call.url.includes("/hit/")).length, 1);
});

test("failed reads and invalid values never masquerade as a zero count", async () => {
  for (const result of [response(null, 503), response(null), response(-3), response("NaN")]) {
    const app = await mount({ fetchImpl: () => result });
    assert.equal(app.count.textContent, "Count temporarily unavailable");
    assert.equal(app.button.disabled, false);
    assert.equal(app.retry.hidden, false);
    assert.equal(app.calls.length, 3);
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

test("a transient read failure recovers automatically without incrementing the counter", async () => {
  let reads = 0;
  const app = await mount({ fetchImpl: () => ++reads === 1 ? response(null, 503) : response(9) });
  assert.equal(app.count.textContent, "9 likes");
  assert.equal(app.retry.hidden, true);
  assert.equal(app.calls.length, 2);
  assert.ok(app.calls.every(call => call.url.includes("/get/")));
});

test("an unavailable service shows the last confirmed total with an explicit stale label", async () => {
  const storage = new Map([[`pupu-total:${key}`, "7"]]);
  let available = false;
  const app = await mount({ storage, fetchImpl: () => response(available ? 9 : null, available ? 200 : 503) });
  assert.equal(app.count.textContent, "7 likes (last saved)");
  assert.equal(app.retry.hidden, false);
  available = true;
  await app.retry.handlers.click();
  assert.equal(app.count.textContent, "9 likes");
  assert.equal(storage.get(`pupu-total:${key}`), "9");
  assert.equal(app.retry.hidden, true);
});

test("reconnecting reloads the total without adding a like", async () => {
  let available = false;
  const app = await mount({ fetchImpl: () => response(available ? 5 : null, available ? 200 : 503) });
  available = true;
  await app.events.online();
  assert.equal(app.count.textContent, "5 likes");
  assert.ok(app.calls.every(call => call.url.includes("/get/")));
});

test("an old read cannot overwrite a newer successful like", async () => {
  let finishRead;
  let reads = 0;
  const app = await mount({ fetchImpl: url => {
    if (url.includes("/hit/")) return response(8);
    if (++reads === 1) return response(7);
    return new Promise(resolve => { finishRead = resolve; });
  } });
  const refresh = app.retry.handlers.click();
  await app.click();
  finishRead(response(7));
  await refresh;
  assert.equal(app.count.textContent, "8 likes");
});

test("slow count loading does not block a visitor from liking Pupu", async () => {
  let finishRead;
  const app = await mount({ fetchImpl: url => url.includes("/hit/")
    ? response(4)
    : new Promise(resolve => { finishRead = resolve; }) });
  assert.equal(app.button.disabled, false);
  await app.click();
  finishRead(response(3));
  await settle();
  assert.equal(app.count.textContent, "4 likes");
});
