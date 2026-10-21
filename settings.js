(() => {
  const defaults = Object.freeze({
    hideRelated: 0,
    wideLayout: 0,
    pinPlayer: 0,
    autoMiniPlayer: 1,
    fabVisible: 1,
    shortsAsVideos: 1,
    captionScale: 100,
  });
  function normalize(key, value) {
    if (key === "captionScale") {
      const number = Number(value);
      return Number.isFinite(number) ? Math.round(Math.min(200, Math.max(50, number)) / 10) * 10 : 100;
    }
    return value === undefined ? defaults[key] : value === false || value === 0 ? 0 : 1;
  }
  function legacySettings() {
    const legacy = {};
    if (location.hostname !== "www.youtube.com") return legacy;
    try {
      for (const [key, oldKey, enabled] of [
        ["hideRelated", "related_display", "display_none"],
        ["wideLayout", "right_blank_display", "display_none"],
        ["pinPlayer", "Hovering_status", "on"],
      ]) {
        const value = localStorage.getItem(oldKey);
        if (value !== null) legacy[key] = value === enabled ? 1 : 0;
      }
      const scale = localStorage.getItem("caption_scale");
      if (scale !== null) legacy.captionScale = normalize("captionScale", scale);
    } catch { /* Storage can be unavailable on a restricted page. */ }
    return legacy;
  }
  const legacy = legacySettings();
  const values = { ...defaults, ...legacy };
  const listeners = new Set();
  const received = new Set();
  let loaded = false;
  let storageAvailable = false;
  let writes = Promise.resolve();

  function apply(changes) {
    const keys = [];
    for (const [key, value] of Object.entries(changes)) {
      if (!Object.hasOwn(defaults, key)) continue;
      const next = normalize(key, value);
      if (values[key] === next) continue;
      values[key] = next;
      keys.push(key);
    }
    if (loaded && keys.length) for (const listener of listeners) listener(keys);
  }
  async function initialize() {
    try {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        const updates = {};
        for (const key of Object.keys(defaults)) {
          if (!Object.hasOwn(changes, key)) continue;
          received.add(key);
          updates[key] = changes[key].newValue;
        }
        apply(updates);
      });
      const stored = await chrome.storage.local.get(Object.keys(defaults));
      const migration = {};
      for (const key of Object.keys(defaults)) {
        // A live change takes priority over the initial read and old preferences.
        if (received.has(key)) continue;
        if (Object.hasOwn(stored, key)) values[key] = normalize(key, stored[key]);
        else if (Object.hasOwn(legacy, key)) migration[key] = values[key];
      }
      storageAvailable = true;
      if (Object.keys(migration).length) {
        try { await chrome.storage.local.set(migration); } catch { /* Keep the loaded preferences. */ }
      }
    } catch { /* Keep defaults and old preferences if the extension context was invalidated. */ }
    loaded = true;
  }
  const ready = initialize();
  function set(key, value) {
    if (!Object.hasOwn(defaults, key)) return Promise.reject(new Error("Unknown setting"));
    const next = normalize(key, value);
    const pending = writes.then(async () => {
      await ready;
      if (!storageAvailable) throw new Error("Extension settings are unavailable");
      await chrome.storage.local.set({ [key]: next });
      apply({ [key]: next });
    });
    // Serialize slider updates and clicks without blocking later retries after a failure.
    writes = pending.catch(() => {});
    return pending;
  }
  globalThis.youtubeHelperSettings = {
    defaults, ready, get: (key) => values[key], set,
    get loaded() { return loaded; },
    get available() { return storageAvailable; },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
})();
