(() => {
  const icons = {
    related: "M4 5h16v2H4zm0 6h10v2H4zm0 6h10v2H4zm13-6 5 4-5 4z",
    wide: "M3 5h18v14H3zm2 2v10h14V7zm1 1h8v8H6z",
    pin: "M16 9V4h1V2H7v2h1v5l-2 2v2h5v9h2v-9h5v-2zm-6 .83V4h4v5.83L15.17 11H8.83z",
    pip: "M3 4h18v16H3zm2 2v12h14V6zm7 5h6v5h-6z",
    top: "M5 4h14v2H5zm6 16V10.83l-4.59 4.58L5 14l7-7 7 7-1.41 1.41L13 10.83V20z",
    close: "m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z",
    add: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z",
  };
  let session = null;
  let scheduled = false;
  let navigating = false;

  const messages = new Map();
  let i18nAvailable = true;
  function message(key, fallback = key) {
    if (messages.has(key)) return messages.get(key) || fallback;
    if (i18nAvailable) {
      try {
        const translated = chrome.i18n.getMessage(key);
        messages.set(key, translated);
        return translated || fallback;
      } catch {
        // Reloading the extension invalidates APIs in already-open tabs.
        // Keep cached labels and avoid calling the invalid context again.
        i18nAvailable = false;
      }
    }
    return fallback;
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Keep the current session usable. */ }
  }
  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", icons[name]);
    path.setAttribute("fill", "currentColor");
    svg.append(path);
    return svg;
  }
  function setButton(button, label, pressed) {
    const text = button.querySelector(".yh-button-label");
    if (text && text.textContent !== label) text.textContent = label;
    button.title = label;
    button.setAttribute("aria-label", label);
    if (typeof pressed === "boolean") button.setAttribute("aria-pressed", String(pressed));
  }
  function button(className, iconName, label, toggle = false) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = `yh-button ${className}`;
    const text = document.createElement("span");
    text.className = "yh-button-label";
    element.append(icon(iconName), text);
    setButton(element, label, toggle ? false : undefined);
    return element;
  }
  function announce(toolbar, text) {
    const status = toolbar.querySelector(".yh-status");
    if (status.textContent !== text) status.textContent = text;
    status.hidden = !text;
  }
  function getWatch() {
    if (location.pathname !== "/watch") return null;
    return document.querySelector("ytd-watch-flexy:not([hidden])");
  }
  function directChild(parent, node) {
    if (!node || !parent.contains(node)) return null;
    while (node.parentElement !== parent) node = node.parentElement;
    return node;
  }
  function placement(watch) {
    const below = watch.querySelector("#below");
    if (!below) return null;
    const comments = directChild(below, below.querySelector("ytd-comments"));
    if (comments) return { parent: below, before: comments };
    const metadata = directChild(below, below.querySelector("ytd-watch-metadata, #meta"));
    return metadata ? { parent: below, after: metadata } : null;
  }
  function place(toolbar, target) {
    if (target.before) {
      if (toolbar.parentElement !== target.parent || toolbar.nextElementSibling !== target.before) {
        target.parent.insertBefore(toolbar, target.before);
      }
    } else if (toolbar.parentElement !== target.parent || toolbar.previousElementSibling !== target.after) {
      target.after.after(toolbar);
    }
  }
  function getPlayer(watch) {
    const inline = watch.querySelector("#movie_player");
    if (inline) return inline;
    return session?.watch === watch && session.floatingPlayer?.isConnected ? session.floatingPlayer : null;
  }
  function setFloatingPlayer(watch, player) {
    if (session?.watch === watch) session.floatingPlayer = player;
  }
  function updateTheater(watch) {
    if (!session || session.watch !== watch) return;
    const needsTheater = read("related_display") === "display_none" ||
      read("right_blank_display") === "display_none";
    const sizeButton = getPlayer(watch)?.querySelector(".ytp-size-button");
    if (!sizeButton || document.fullscreenElement) return;
    if (needsTheater && !watch.hasAttribute("theater")) {
      session.enteredTheater = true;
      sizeButton.click();
    } else if (!needsTheater && session.enteredTheater && watch.hasAttribute("theater")) {
      session.enteredTheater = false;
      sizeButton.click();
    }
  }
  function cleanup() {
    if (!session) return;
    session.controller.abort();
    session.toolbar.remove();
    session.mount.remove();
    session = null;
  }
  function reconcile() {
    scheduled = false;
    if (navigating) return;
    const watch = getWatch();
    const target = watch && placement(watch);
    if (!target) {
      if (!watch || (session && (!session.toolbar.isConnected || !session.mount.isConnected))) cleanup();
      return;
    }
    if (session && (session.watch !== watch || !session.toolbar.isConnected || !session.mount.isConnected)) cleanup();
    if (!session) {
      // Keep the inline slot stable while the floating toolbar lives on body.
      const mount = document.createElement("div");
      mount.className = "yh-toolbar-slot";
      const toolbar = document.createElement("div");
      toolbar.className = "yh-toolbar";
      toolbar.setAttribute("role", "group");
      toolbar.setAttribute("aria-label", message("helperToolbar", "Viewing tools"));

      const actions = document.createElement("div");
      actions.className = "yh-actions";
      actions.id = "youtube-helper-actions";
      actions.append(
        button("related_collapse_button", "related", message("relatedVideo_off"), true),
        button("remove_right_blank", "wide", message("rightBlank_off"), true),
        button("hover_button", "pin", message("hover_off"), true),
        button("pip_button", "pip", message("pipButton", "PIP"), true),
        button("top_button", "top", message("topButton", "Back to top")),
      );
      const status = document.createElement("span");
      status.className = "yh-status";
      status.setAttribute("role", "status");
      status.hidden = true;
      actions.append(status);
      toolbar.append(actions);
      const controller = new AbortController();
      session = { watch, toolbar, mount, controller, enteredTheater: false };
      mount.append(toolbar);
      place(mount, target);
      const detail = { watch, toolbar, mount, signal: controller.signal };
      document.dispatchEvent(new CustomEvent("youtube-helper-ready", { detail }));
    } else {
      place(session.mount, target);
      document.dispatchEvent(new Event("youtube-helper-update"));
    }
  }
  function schedule() {
    if (scheduled || navigating) return;
    scheduled = true;
    requestAnimationFrame(reconcile);
  }

  globalThis.youtubeHelper = {
    message, read, write, icon, button, setButton, announce, updateTheater, getPlayer, setFloatingPlayer,
  };
  document.addEventListener("yt-navigate-start", () => {
    navigating = true;
    cleanup();
  });
  document.addEventListener("yt-navigate-finish", () => {
    navigating = false;
    schedule();
  });
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
})();
