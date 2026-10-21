(() => {
  let enabled = false;
  let ready = false;
  let settingsChanged = false;
  let redirecting = false;
  let oldHref = location.href;
  const convertedLinks = new WeakMap();

  function watchUrl(href) {
    if (!href) return null;
    let url;
    try { url = new URL(href, location.href); } catch { return null; }
    if (url.origin !== location.origin) return null;
    const match = /^\/shorts\/([A-Za-z0-9_-]+)\/?$/.exec(url.pathname);
    if (!match) return null;
    url.pathname = "/watch";
    url.searchParams.set("v", match[1]);
    return url.href;
  }
  function updateLink(link) {
    const href = link.getAttribute("href");
    const previous = convertedLinks.get(link);
    if (previous && href !== previous.converted) convertedLinks.delete(link);
    if (!enabled) {
      if (previous && href === previous.converted) link.setAttribute("href", previous.original);
      convertedLinks.delete(link);
      return;
    }
    const converted = watchUrl(href);
    if (!converted) return;
    convertedLinks.set(link, { original: href, converted });
    link.setAttribute("href", converted);
  }
  function updateLinks(root) {
    if (root.matches?.("a[href]")) updateLink(root);
    root.querySelectorAll?.("a[href]").forEach(updateLink);
  }
  function redirect() {
    if (!ready || !enabled || redirecting) return;
    const target = watchUrl(location.href);
    if (!target) return;
    redirecting = true;
    location.replace(target);
  }
  function navigationChanged() {
    oldHref = location.href;
    redirect();
  }
  function applySetting(value) {
    enabled = value !== 0 && value !== false;
    ready = true;
    updateLinks(document);
    redirect();
  }

  const observer = new MutationObserver((mutations) => {
    if (!ready) return;
    if (oldHref !== location.href) navigationChanged();
    const roots = new Set();
    for (const mutation of mutations) {
      if (mutation.type === "attributes") roots.add(mutation.target);
      else for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) roots.add(node);
      }
    }
    for (const root of roots) updateLinks(root);
  });
  observer.observe(document.documentElement, {
    subtree: true, childList: true, attributes: true, attributeFilter: ["href"],
  });
  document.addEventListener("yt-navigate-finish", navigationChanged);
  document.addEventListener("yt-page-data-updated", navigationChanged);
  window.addEventListener("popstate", navigationChanged);
  function beforeLinkActivation(event) {
    if (!ready || !enabled) return;
    const link = event.target.closest?.("a[href]");
    if (link) updateLink(link);
  }
  document.addEventListener("pointerdown", beforeLinkActivation, { capture: true, passive: true });
  document.addEventListener("click", beforeLinkActivation, { capture: true });

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local" || !Object.hasOwn(changes, "shortsAsVideos")) return;
      settingsChanged = true;
      applySetting(changes.shortsAsVideos.newValue);
    });
    chrome.storage.local.get({ shortsAsVideos: 1 }).then((settings) => {
      // A live change can arrive before the initial storage read completes.
      if (!settingsChanged) applySetting(settings.shortsAsVideos);
    }).catch(() => { observer.disconnect(); });
  } catch {
    // An extension reload can invalidate APIs in an already-open tab.
    observer.disconnect();
  }
})();
