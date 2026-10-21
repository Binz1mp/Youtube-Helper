document.addEventListener("youtube-helper-ready", ({ detail: { watch, toolbar, signal } }) => {
  const ui = globalThis.youtubeHelper;
  const stored = Number(ui.read("caption_scale") || 100);
  let scale = Number.isFinite(stored) ? Math.round(Math.min(200, Math.max(50, stored)) / 10) * 10 : 100;
  let player = null;
  let nativeFont = 0;
  let observer = null;

  const control = document.createElement("div");
  control.className = "yh-caption-control";
  const label = document.createElement("label");
  label.htmlFor = "youtube-helper-caption-scale";
  label.textContent = ui.message("captionSize", "Subtitle size");
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "yh-caption-reset";
  reset.title = ui.message("captionReset", "Reset subtitle size");
  reset.setAttribute("aria-label", reset.title);
  const output = document.createElement("output");
  output.setAttribute("for", label.htmlFor);
  reset.append(output);
  const slider = document.createElement("input");
  slider.id = label.htmlFor;
  slider.type = "range";
  slider.min = "50";
  slider.max = "200";
  slider.step = "10";
  control.append(label, reset, slider);
  toolbar.querySelector(".yh-actions").insertBefore(control, toolbar.querySelector(".yh-status"));

  function clear(element) {
    element?.classList.remove("yh-caption-sized", "yh-caption-compact");
    element?.style.removeProperty("--yh-caption-font-size");
  }
  function apply() {
    const active = Boolean(player?.isConnected && player.classList.contains("yh-floating-player"));
    slider.disabled = reset.disabled = !active;
    slider.value = String(scale);
    slider.setAttribute("aria-valuetext", `${scale}%`);
    if (output.textContent !== `${scale}%`) output.textContent = `${scale}%`;
    if (!active) {
      clear(player);
      return;
    }

    const rect = player.getBoundingClientRect();
    const compact = rect.width < 640;
    const text = player.querySelector(".captions-text");
    // Read YouTube's own size, avoiding our computed override as a new baseline.
    if (text && /^\d+(\.\d+)?px$/.test(text.style.fontSize)) {
      nativeFont = parseFloat(text.style.fontSize);
    } else if (text && !nativeFont) {
      const overridden = player.classList.contains("yh-caption-sized");
      if (overridden) player.classList.remove("yh-caption-sized");
      nativeFont = parseFloat(getComputedStyle(text).fontSize) || 0;
      if (overridden) player.classList.add("yh-caption-sized");
    }

    const responsiveFont = Math.max(10, Math.min(32, rect.width / 26.25, rect.height / 12));
    const base = compact ? responsiveFont : nativeFont || responsiveFont;
    player.style.setProperty("--yh-caption-font-size", `${base * scale / 100}px`);
    player.classList.toggle("yh-caption-compact", compact);
    // At 100%, a full-size Hover player keeps the native caption size.
    player.classList.toggle("yh-caption-sized", compact || scale !== 100);
  }
  function refresh() {
    const current = ui.getPlayer(watch);
    if (current !== player) {
      observer?.disconnect();
      observer = null;
      clear(player);
      player = current;
      nativeFont = 0;
      if (player) {
        observer = new ResizeObserver(apply);
        observer.observe(player);
      }
    }
    apply();
  }
  function update(value) {
    scale = value;
    ui.write("caption_scale", String(scale));
    apply();
  }
  slider.addEventListener("input", () => update(slider.valueAsNumber), { signal });
  reset.addEventListener("click", () => update(100), { signal });
  document.addEventListener("youtube-helper-update", refresh, { signal });
  signal.addEventListener("abort", () => {
    observer?.disconnect();
    clear(player);
    control.remove();
  }, { once: true });
  refresh();
});
