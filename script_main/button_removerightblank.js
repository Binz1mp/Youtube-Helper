document.addEventListener("youtube-helper-ready", ({ detail: { watch, toolbar, signal } }) => {
  const ui = globalThis.youtubeHelper;
  const button = toolbar.querySelector(".remove_right_blank");
  let related = null;
  let restoredTheater = false;
  const relatedButton = toolbar.querySelector(".related_collapse_button");

  function refresh() {
    const hidden = ui.settings.get("wideLayout") === 1;
    const relatedHidden = ui.settings.get("hideRelated") === 1;
    const secondary = watch.querySelector("#columns > #secondary");
    button.disabled = !secondary;
    watch.classList.toggle("yh-wide-layout", hidden && Boolean(secondary));
    ui.setButton(button, ui.message(hidden ? "rightBlank_on" : "rightBlank_off"), hidden);

    const currentRelated = watch.querySelector("#secondary #related, #related");
    if (related && related !== currentRelated) related.classList.remove("yh-related-hidden");
    related = currentRelated;
    related?.classList.toggle("yh-related-hidden", relatedHidden);
    relatedButton.disabled = !related;
    ui.setButton(relatedButton,
      ui.message(relatedHidden ? "relatedVideo_on" : "relatedVideo_off"), relatedHidden);
    if (!restoredTheater && ui.getPlayer(watch)?.querySelector(".ytp-size-button")) {
      restoredTheater = true;
      ui.updateTheater(watch);
    }
  }
  button.addEventListener("click", () => {
    ui.saveSetting("wideLayout", ui.settings.get("wideLayout") ? 0 : 1, toolbar);
  }, { signal });
  relatedButton.addEventListener("click", () => {
    ui.saveSetting("hideRelated", ui.settings.get("hideRelated") ? 0 : 1, toolbar);
  }, { signal });
  document.addEventListener("youtube-helper-settings-change", ({ detail: { keys } }) => {
    if (!keys.some((key) => key === "hideRelated" || key === "wideLayout")) return;
    refresh();
    ui.updateTheater(watch);
  }, { signal });
  document.addEventListener("youtube-helper-update", refresh, { signal });
  signal.addEventListener("abort", () => {
    watch.classList.remove("yh-wide-layout");
    related?.classList.remove("yh-related-hidden");
  }, { once: true });
  refresh();
});
