(() => {
  "use strict";

  const root = document.getElementById("pupu-likes");
  if (!root) return;

  const button = root.querySelector(".pupu-likes__button");
  const label = root.querySelector(".pupu-likes__label");
  const heart = root.querySelector(".pupu-likes__heart");
  const count = root.querySelector(".pupu-likes__count");
  const status = root.querySelector(".pupu-likes__status");
  const retry = root.querySelector(".pupu-likes__retry");
  const isPreview = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  const key = root.dataset.counterKey + (isPreview ? "_preview" : "");
  const storageKey = `pupu-liked:${key}`;
  const totalKey = `pupu-total:${key}`;
  const api = "https://countapi.mileshilliard.com/api/v1";
  let busy = false;
  let liked = readLiked();
  let refreshing = false;
  let writeVersion = 0;
  let lastTotal = readTotal();

  function readTotal() {
    try {
      const value = JSON.parse(window.localStorage.getItem(totalKey));
      return Number.isSafeInteger(value) && value >= 0 ? value : null;
    } catch (_) {
      return null;
    }
  }

  function readLiked() {
    try {
      return window.localStorage.getItem(storageKey) === "1";
    } catch (_) {
      return false;
    }
  }

  function renderButton() {
    button.disabled = busy || liked;
    button.setAttribute("aria-pressed", String(liked));
    button.setAttribute("aria-busy", String(busy));
    heart.textContent = liked ? "♥" : "♡";
    label.textContent = liked ? "Liked Pupu" : "Like Pupu";
  }

  function renderCount(value) {
    count.textContent = `${value.toLocaleString("en-US")} ${value === 1 ? "like" : "likes"}`;
    lastTotal = value;
    try {
      window.localStorage.setItem(totalKey, JSON.stringify(value));
    } catch (_) {
      // Keep the last confirmed total in memory when storage is unavailable.
    }
  }

  function showLastTotal() {
    count.textContent = lastTotal === null
      ? "Count temporarily unavailable"
      : `${lastTotal.toLocaleString("en-US")} ${lastTotal === 1 ? "like" : "likes"} (last saved)`;
  }

  async function requestOnce(action) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${api}/${action}/${encodeURIComponent(key)}`, {
        signal: controller.signal,
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer"
      });
      // New counters do not exist until their first real like.
      if (action === "get" && response.status === 404) return 0;
      if (!response.ok) throw new Error("Counter request failed");
      const data = await response.json();
      if (!/^[0-9]+$/.test(String(data.value))) throw new Error("Invalid count");
      const value = Number(data.value);
      if (!Number.isSafeInteger(value)) throw new Error("Invalid count");
      return value;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function request(action) {
    for (let attempt = 0; ; attempt++) {
      try {
        return await requestOnce(action);
      } catch (error) {
        // Reading is safe to retry. A timed-out write may already have counted.
        if (action !== "get" || attempt === 2) throw error;
        await new Promise(resolve => window.setTimeout(resolve, [500, 1500][attempt]));
      }
    }
  }

  async function refreshCount() {
    if (refreshing) return;
    refreshing = true;
    const version = writeVersion;
    retry.disabled = true;
    retry.textContent = "Refreshing…";
    try {
      const value = await request("get");
      // An older read must never overwrite the result of a newer like.
      if (version !== writeVersion) return;
      renderCount(value);
      retry.hidden = true;
    } catch (_) {
      if (version !== writeVersion) return;
      showLastTotal();
      retry.hidden = false;
    } finally {
      refreshing = false;
      retry.disabled = false;
      retry.textContent = "Refresh count";
    }
  }

  retry.addEventListener("click", refreshCount);
  window.addEventListener("online", refreshCount);

  button.addEventListener("click", async () => {
    if (busy || liked) return;
    // Also respect a like recorded in another tab since this page loaded.
    if (readLiked()) {
      liked = true;
      renderButton();
      return;
    }
    busy = true;
    writeVersion++;
    status.textContent = "Sending Pupu some love…";
    renderButton();
    try {
      const value = await request("hit");
      writeVersion++;
      renderCount(value);
      retry.hidden = true;
      liked = true;
      try {
        window.localStorage.setItem(storageKey, "1");
      } catch (_) {
        // The shared count still succeeds when browser storage is unavailable.
      }
      status.textContent = "Pupu approves. Now, back to work!";
    } catch (_) {
      status.textContent = "We couldn’t confirm your like. Please try again later.";
    } finally {
      busy = false;
      renderButton();
    }
  });

  window.addEventListener("storage", async (event) => {
    if (event.key !== storageKey || event.newValue !== "1") return;
    liked = true;
    renderButton();
    await refreshCount();
  });

  renderButton();
  if (lastTotal !== null) showLastTotal();
  refreshCount();
})();
