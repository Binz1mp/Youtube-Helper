document.addEventListener("youtube-helper-ready", ({ detail: { watch, toolbar, mount, signal } }) => {
  const ui = globalThis.youtubeHelper;
  const toggle = toolbar.querySelector(".hover_button");
  const actions = toolbar.querySelector(".yh-actions");
  const fab = ui.button("yh-fab-toggle", "add", ui.message("expandTools"));
  fab.setAttribute("aria-controls", actions.id);
  toolbar.append(fab);

  // Keep an inline row during automatic mini-player mode while the original
  // controls remain in the FAB. Forward clicks to their existing handlers.
  const inlineToolbar = document.createElement("div");
  inlineToolbar.className = "yh-toolbar";
  inlineToolbar.setAttribute("role", "group");
  inlineToolbar.setAttribute("aria-label", toolbar.getAttribute("aria-label"));
  const inlineActions = document.createElement("div");
  inlineActions.className = "yh-actions";
  inlineToolbar.append(inlineActions);
  const inlineButtons = [...actions.querySelectorAll(":scope > .yh-button")].map((source) => {
    const copy = source.cloneNode(true);
    copy.addEventListener("click", () => source.click(), { signal });
    inlineActions.append(copy);
    return { source, copy };
  });
  function syncInlineButtons() {
    for (const { source, copy } of inlineButtons) {
      const pressed = source.getAttribute("aria-pressed");
      ui.setButton(copy, source.querySelector(".yh-button-label").textContent,
        pressed === null ? undefined : pressed === "true");
      copy.disabled = source.disabled;
    }
  }
  const buttonObserver = new MutationObserver(() => {
    if (inlineToolbar.isConnected) syncInlineButtons();
  });
  buttonObserver.observe(actions, {
    subtree: true, childList: true, characterData: true, attributes: true,
    attributeFilter: ["disabled", "aria-pressed", "aria-label", "title"],
  });

  const HEADER = 36;
  const HANDLE = 24;
  const geometries = { mini: null, hover: null };
  let manual = ui.settings.get("pinPlayer") === 1;
  let autoDismissed = false;
  let mode = "inline";
  let expanded = false;
  let player = null;
  let placeholder = null;
  let sourceParent = null;
  let sourceRatio = 1;
  let slotWidth = 0;
  let panel = null;
  let grip = null;
  let interaction = null;
  let resizeObserver = null;
  let pending = false;
  let inlineGeometry = null;
  let inlineRecovery = null;

  function captureInlineGeometry(current) {
    const nodes = [current, ...current.querySelectorAll(
      ".html5-video-container, video, .ytp-chrome-bottom, .ytp-progress-bar-container, .ytp-caption-window-container")];
    return nodes.map((node) => ({
      node,
      properties: ["width", "height", "left", "top"].map((name) => ({
        name, value: node.style.getPropertyValue(name), priority: node.style.getPropertyPriority(name),
      })),
    }));
  }
  function restoreInlineGeometry(current, geometry) {
    for (const { node, properties } of geometry || []) {
      if (node !== current && !current.contains(node)) continue;
      for (const { name, value, priority } of properties) {
        if (value) node.style.setProperty(name, value, priority);
        else node.style.removeProperty(name);
      }
    }
  }
  function cancelInlineRecovery() {
    inlineRecovery?.abort();
    inlineRecovery = null;
  }
  function recoverInlinePlayer(current) {
    cancelInlineRecovery();
    if (signal.aborted || document.fullscreenElement || document.pictureInPictureElement) return;
    const controller = new AbortController();
    inlineRecovery = controller;
    let queued = false;
    const active = () => !signal.aborted && !controller.signal.aborted && current.isConnected &&
      watch.contains(current) && ui.getPlayer(watch) === current && !current.classList.contains("yh-floating-player") &&
      !document.fullscreenElement && !document.pictureInPictureElement;

    function fitLoadedVideo() {
      const frame = current.getBoundingClientRect();
      if (!frame.width || !frame.height) return;
      for (const video of current.querySelectorAll("video")) {
        if (!video.videoWidth || !video.videoHeight) continue;
        const scale = Math.min(frame.width / video.videoWidth, frame.height / video.videoHeight);
        const width = video.videoWidth * scale;
        const height = video.videoHeight * scale;
        const rect = video.getBoundingClientRect();
        const left = (frame.width - width) / 2;
        const top = (frame.height - height) / 2;
        if (Math.abs(rect.width - width) <= 1 && Math.abs(rect.height - height) <= 1 &&
            Math.abs(rect.left - frame.left - left) <= 1 && Math.abs(rect.top - frame.top - top) <= 1) continue;
        const container = video.closest(".html5-video-container");
        if (container) {
          container.style.width = "100%";
          container.style.height = "100%";
        }
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.left = `${left}px`;
        video.style.top = `${top}px`;
      }
    }
    function requestLayout() {
      if (queued || !active()) return;
      queued = true;
      requestAnimationFrame(() => {
        if (!active()) { queued = false; return; }
        // Notify YouTube only after returning to the real inline container.
        // Floating renders never emit this event, avoiding the former resize loop.
        window.dispatchEvent(new Event("resize"));
        requestAnimationFrame(() => {
          queued = false;
          if (active()) fitLoadedVideo();
        });
      });
    }
    for (const type of ["loadedmetadata", "loadeddata", "resize"]) {
      current.addEventListener(type, requestLayout, { capture: true, signal: controller.signal });
    }
    requestLayout();
  }

  function viewport() {
    const visual = window.visualViewport;
    const left = visual?.offsetLeft || 0;
    const top = visual?.offsetTop || 0;
    const width = visual?.width || window.innerWidth;
    const height = visual?.height || window.innerHeight;
    const margin = width < 600 ? 12 : 20;
    const masthead = document.querySelector("#masthead-container, ytd-masthead");
    const mastheadBottom = masthead?.getBoundingClientRect().bottom || top;
    return {
      left, top, width, height, margin,
      minLeft: left + margin,
      minTop: Math.min(top + height - HEADER - margin, Math.max(top, mastheadBottom) + margin) + HEADER,
      right: left + width - margin,
      bottom: top + height - margin,
      visibleTop: Math.max(top, mastheadBottom),
    };
  }
  const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));
  function fit(box, bounds = viewport()) {
    const maxWidth = Math.max(1, bounds.right - bounds.minLeft);
    const maxHeight = Math.max(1, bounds.bottom - bounds.minTop);
    const width = Math.max(1, Math.min(box.width, maxWidth, maxHeight * box.ratio));
    const height = width / box.ratio;
    return {
      ...box, width, height,
      left: clamp(box.left, bounds.minLeft, bounds.right - width),
      top: clamp(box.top, bounds.minTop, bounds.bottom - height),
    };
  }
  function setExpanded(value) {
    expanded = value;
    toolbar.classList.toggle("yh-fab-expanded", value);
    actions.hidden = toolbar.classList.contains("yh-toolbar-floating") && !value;
    fab.setAttribute("aria-expanded", String(value));
    ui.setButton(fab, ui.message(value ? "collapseTools" : "expandTools"));
  }
  function setFloatingToolbar(active) {
    active = active && ui.settings.get("fabVisible") === 1;
    if (toolbar.classList.contains("yh-toolbar-floating") !== active) {
      toolbar.classList.toggle("yh-toolbar-floating", active);
      setExpanded(false);
    }
    // Escape the watch page's stacking contexts, especially in theater mode.
    const container = active ? document.body : mount;
    if (toolbar.parentElement !== container) container.append(toolbar);
    if (active && !manual && mode === "mini") {
      syncInlineButtons();
      if (inlineToolbar.parentElement !== mount) mount.append(inlineToolbar);
    } else {
      inlineToolbar.remove();
    }
    if (!active) {
      for (const key of ["left", "top"]) toolbar.style.removeProperty(`--yh-fab-${key}`);
    }
  }
  function placeFab(bounds) {
    if (!toolbar.classList.contains("yh-toolbar-floating")) return;
    toolbar.style.setProperty("--yh-fab-left", `${bounds.right - 56}px`);
    toolbar.style.setProperty("--yh-fab-top", `${bounds.bottom - 56}px`);
  }
  function render() {
    const bounds = viewport();
    placeFab(bounds);
    if (!player || !panel || !grip) return;
    const box = fit(geometries[mode], bounds);
    geometries[mode] = box;
    for (const key of ["width", "height", "left", "top"]) {
      player.style.setProperty(`--yh-float-${key}`, `${box[key]}px`);
    }
    panel.style.width = `${box.width}px`;
    panel.style.left = `${box.left}px`;
    panel.style.top = `${box.top - HEADER}px`;
    grip.style.left = `${box.left + box.width - HANDLE / 2}px`;
    grip.style.top = `${box.top + box.height - HANDLE / 2}px`;
  }
  function finishInteraction(event) {
    if (!interaction || (event && event.pointerId !== interaction.pointerId)) return;
    const { target, pointerId } = interaction;
    interaction = null;
    target.classList.remove("yh-interacting");
    if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
    schedule();
  }
  function changeSize(box, delta) {
    const bounds = viewport();
    const maximum = Math.max(1, Math.min(bounds.right - bounds.minLeft,
      (bounds.bottom - bounds.minTop) * box.ratio));
    const width = clamp(box.width + delta, Math.min(240, maximum, box.width), maximum);
    return fit({ ...box, width, height: width / box.ratio }, bounds);
  }
  function bindManipulation(element, kind) {
    element.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || !event.isPrimary || interaction ||
          (kind === "drag" && event.target.closest("button"))) return;
      event.preventDefault();
      event.stopPropagation();
      if (expanded) setExpanded(false);
      interaction = {
        target: element, pointerId: event.pointerId, kind,
        x: event.clientX, y: event.clientY, box: { ...geometries[mode] },
      };
      element.setPointerCapture(event.pointerId);
      element.classList.add("yh-interacting");
    }, { signal });
    element.addEventListener("pointermove", (event) => {
      if (!interaction || event.pointerId !== interaction.pointerId) return;
      const { box, x, y } = interaction;
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      if (kind === "drag") {
        geometries[mode] = fit({ ...box, left: box.left + dx, top: box.top + dy });
      } else {
        const delta = Math.abs(dx) >= Math.abs(dy * box.ratio) ? dx : dy * box.ratio;
        geometries[mode] = changeSize(box, delta);
      }
      render();
    }, { signal });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
      element.addEventListener(type, finishInteraction, { signal });
    }
    element.addEventListener("keydown", (event) => {
      if (event.target !== element || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      const step = event.shiftKey ? 40 : 10;
      const box = geometries[mode];
      if (kind === "drag") {
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
        geometries[mode] = fit({ ...box, left: box.left + dx, top: box.top + dy });
      } else {
        geometries[mode] = changeSize(box, ["ArrowLeft", "ArrowUp"].includes(event.key) ? -step : step);
      }
      render();
    }, { signal });
  }
  function detach() {
    if (!player) return;
    finishInteraction();
    resizeObserver?.disconnect();
    resizeObserver = null;
    const original = player;
    let returned = false;
    const replacement = watch.querySelector("#movie_player");
    if (sourceParent && (!replacement || replacement === player)) {
      movePlayer(sourceParent, player, placeholder?.parentElement === sourceParent ? placeholder : null);
      restoreInlineGeometry(player, inlineGeometry);
      returned = sourceParent.isConnected;
      if (!sourceParent.isConnected) {
        player.querySelectorAll("video, audio").forEach((media) => media.pause());
      }
    } else {
      // YouTube has replaced this player; do not leave its media running on body.
      player.querySelectorAll("video, audio").forEach((media) => media.pause());
      player.remove();
    }
    player.classList.remove("yh-floating-player");
    for (const key of ["width", "height", "left", "top"]) player.style.removeProperty(`--yh-float-${key}`);
    ui.setFloatingPlayer(watch, null);
    placeholder?.remove();
    watch.classList.remove("yh-floating-active");
    panel?.remove();
    grip?.remove();
    player = placeholder = panel = grip = null;
    sourceParent = null;
    inlineGeometry = null;
    slotWidth = 0;
    mode = "inline";
    if (returned) recoverInlinePlayer(original);
  }
  async function restoreOriginal() {
    const original = player;
    if (manual && !await ui.saveSetting("pinPlayer", 0, toolbar)) return;
    autoDismissed = true;
    geometries.hover = null;
    refresh();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    original?.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" });
  }
  function movePlayer(container, element, before = null) {
    // Preserve focus, fullscreen and embedded player state where supported.
    if (typeof container.moveBefore === "function" && container.isConnected && element.isConnected) {
      container.moveBefore(element, before);
    } else {
      container.insertBefore(element, before);
    }
  }
  function updateSourceSlot() {
    if (!placeholder?.isConnected) return;
    const width = placeholder.getBoundingClientRect().width;
    // Only source width changes can resize the slot; player size and scrolling cannot.
    if (width > 0 && Math.abs(width - slotWidth) > 0.5) {
      slotWidth = width;
      placeholder.style.height = `${width / sourceRatio}px`;
    }
    schedule();
  }
  function attach(current, rect) {
    // A delayed restore from an earlier scroll must never resize the mini player.
    cancelInlineRecovery();
    inlineGeometry = captureInlineGeometry(current);
    player = current;
    sourceParent = player.parentElement;
    sourceRatio = rect.width / rect.height;
    const originalStyle = getComputedStyle(player);
    placeholder = document.createElement("div");
    placeholder.className = "yh-player-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.style.height = `${rect.height}px`;
    if (originalStyle.position === "absolute") {
      placeholder.style.position = "absolute";
      placeholder.style.top = originalStyle.top;
      placeholder.style.left = originalStyle.left;
    }
    player.before(placeholder);
    slotWidth = placeholder.getBoundingClientRect().width;
    ui.setFloatingPlayer(watch, player);
    movePlayer(document.body, player);
    panel = document.createElement("div");
    panel.className = "yh-floating-bar";
    panel.tabIndex = 0;
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", ui.message("dragPlayer"));
    panel.title = ui.message("dragPlayer");
    const title = document.createElement("span");
    title.className = "yh-floating-title";
    title.append(ui.icon("pin"), document.createElement("span"));
    const close = ui.button("yh-floating-restore", "close", ui.message("floatingRestore"));
    close.addEventListener("click", restoreOriginal, { signal });
    panel.append(title, close);

    grip = document.createElement("button");
    grip.type = "button";
    grip.className = "yh-resize-handle";
    grip.title = ui.message("resizePlayer");
    grip.setAttribute("aria-label", grip.title);
    bindManipulation(panel, "drag");
    bindManipulation(grip, "resize");
    document.body.append(panel, grip);
    resizeObserver = new ResizeObserver(updateSourceSlot);
    resizeObserver.observe(placeholder);
    player.classList.add("yh-floating-player");
    watch.classList.add("yh-floating-active");
  }
  function refresh() {
    pending = false;
    if (signal.aborted) return;
    const pinned = ui.settings.get("pinPlayer") === 1;
    if (manual !== pinned) {
      manual = pinned;
      geometries.hover = null;
    }
    const current = ui.getPlayer(watch);
    const video = current?.querySelector("video");
    if (player) {
      if (player !== current || !placeholder?.isConnected || !panel?.isConnected || !grip?.isConnected ||
          player.parentElement !== document.body) detach();
    }
    toggle.disabled = !current || !video;
    ui.setButton(toggle, ui.message(manual ? "hover_on" : "hover_off"), manual);
    const suspended = Boolean(document.fullscreenElement || document.pictureInPictureElement) ||
      current?.classList.contains("ytp-player-minimized");
    if (!current || !video || suspended) {
      detach();
      setFloatingToolbar(manual && Boolean(current && video) && !document.fullscreenElement);
      render();
      return;
    }
    const bounds = viewport();
    // Measure the original video slot, never the floating player's position.
    const rect = (placeholder || current).getBoundingClientRect();
    if (!rect.width || !rect.height) {
      detach();
      setFloatingToolbar(false);
      return;
    }
    const sourceVisible = rect.bottom > bounds.visibleTop && rect.top < bounds.top + bounds.height;
    if (sourceVisible) autoDismissed = false;
    const shouldMinimize = !autoDismissed && rect.bottom <= bounds.visibleTop;
    // Explicit Hover keeps its size and always takes priority over scroll mode.
    const minimize = ui.settings.get("autoMiniPlayer") === 1 &&
      (shouldMinimize || (interaction && mode === "mini"));
    const desired = manual ? "hover" : minimize ? "mini" : "inline";
    if (desired === "inline") {
      detach();
      setFloatingToolbar(false);
      return;
    }
    if (!geometries[desired]) {
      const ratio = rect.width / rect.height;
      if (desired === "hover") {
        geometries.hover = fit({ left: rect.left, top: rect.top, width: rect.width, height: rect.height, ratio }, bounds);
      } else {
        const fabSpace = ui.settings.get("fabVisible") === 1 ? 68 : 0;
        const width = Math.min(420, bounds.width - bounds.margin * 2,
          Math.max(1, bounds.bottom - bounds.minTop - fabSpace) * ratio);
        geometries.mini = fit({
          left: bounds.right - width, top: bounds.bottom - fabSpace - width / ratio,
          width, height: width / ratio, ratio,
        }, bounds);
      }
    }
    mode = desired;
    if (!player) attach(current, rect);
    const title = panel.querySelector(".yh-floating-title span");
    const label = ui.message(mode === "hover" ? "floatingTitle" : "miniPlayerTitle");
    if (title.textContent !== label) title.textContent = label;
    setFloatingToolbar(true);
    render();
  }
  function schedule() {
    if (pending || signal.aborted) return;
    pending = true;
    requestAnimationFrame(refresh);
  }

  toggle.addEventListener("click", async () => {
    const next = !manual;
    if (!await ui.saveSetting("pinPlayer", next ? 1 : 0, toolbar) || signal.aborted) return;
    refresh();
    if (manual && toolbar.classList.contains("yh-toolbar-floating")) fab.focus({ preventScroll: true });
  }, { signal });
  fab.addEventListener("click", () => setExpanded(!expanded), { signal });
  toolbar.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !expanded) return;
    event.preventDefault();
    event.stopPropagation();
    setExpanded(false);
    fab.focus({ preventScroll: true });
  }, { signal });
  document.addEventListener("pointerdown", (event) => {
    if (expanded && !toolbar.contains(event.target)) setExpanded(false);
  }, { signal });
  document.addEventListener("youtube-helper-update", schedule, { signal });
  document.addEventListener("fullscreenchange", schedule, { signal });
  for (const type of ["loadedmetadata", "enterpictureinpicture", "leavepictureinpicture"]) {
    document.addEventListener(type, schedule, { signal, capture: true });
  }
  window.addEventListener("scroll", schedule, { signal, passive: true, capture: true });
  window.addEventListener("resize", schedule, { signal, passive: true });
  window.visualViewport?.addEventListener("resize", schedule, { signal, passive: true });
  window.visualViewport?.addEventListener("scroll", schedule, { signal, passive: true });
  signal.addEventListener("abort", () => {
    buttonObserver.disconnect();
    inlineToolbar.remove();
    cancelInlineRecovery();
    detach();
    setFloatingToolbar(false);
    fab.remove();
  }, { once: true });
  setExpanded(false);
  refresh();
});
