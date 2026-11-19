(() => {
  "use strict";

  const root = document.getElementById("pupu-likes");
  if (!root) return;

  const button = root.querySelector("button");
  const label = root.querySelector(".pupu-likes__label");
  const heart = root.querySelector(".pupu-likes__heart");
  const count = root.querySelector(".pupu-likes__count");
  const status = root.querySelector(".pupu-likes__status");
  const isPreview = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  const key = root.dataset.counterKey + (isPreview ? "_preview" : "");
  const storageKey = `pupu-liked:${key}`;
  const api = "https://countapi.mileshilliard.com/api/v1";
  let busy = true;
  let liked = readLiked();

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
  }

  async function request(action) {
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

  button.addEventListener("click", async () => {
    if (busy || liked) return;
    // Also respect a like recorded in another tab since this page loaded.
    if (readLiked()) {
      liked = true;
      renderButton();
      return;
    }
    busy = true;
    status.textContent = "Sending Pupu some love…";
    renderButton();
    try {
      renderCount(await request("hit"));
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
    try {
      renderCount(await request("get"));
    } catch (_) {
      count.textContent = "Likes unavailable";
    }
  });

  renderButton();
  request("get")
    .then(renderCount)
    .catch(() => { count.textContent = "Likes unavailable"; })
    .finally(() => {
      busy = false;
      renderButton();
    });
})();
