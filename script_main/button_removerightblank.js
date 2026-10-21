document.addEventListener("youtube-helper-ready", ({ detail: { watch, toolbar, signal } }) => {
  const ui = globalThis.youtubeHelper;
  const button = toolbar.querySelector(".remove_right_blank");
  let hidden = ui.read("right_blank_display") === "display_none";
  let relatedHidden = ui.read("related_display") === "display_none";
  let related = null;
  let restoredTheater = false;
  const relatedButton = toolbar.querySelector(".related_collapse_button");

  function refresh() {
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
    hidden = !hidden;
    ui.write("right_blank_display", hidden ? "display_none" : "display_normal");
    refresh();
    ui.updateTheater(watch);
  }, { signal });
  relatedButton.addEventListener("click", () => {
    relatedHidden = !relatedHidden;
    ui.write("related_display", relatedHidden ? "display_none" : "display_normal");
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
