document.addEventListener("youtube-helper-ready", ({ detail: { watch, toolbar, signal } }) => {
  const ui = globalThis.youtubeHelper;
  const button = toolbar.querySelector(".pip_button");
  let pending = false;
  function getVideo() {
    return ui.getPlayer(watch)?.querySelector("video");
  }
  function refresh() {
    const video = getVideo();
    const active = Boolean(video && document.pictureInPictureElement === video);
    button.disabled = pending || !video || !document.pictureInPictureEnabled ||
      video.disablePictureInPicture || video.readyState === 0;
    ui.setButton(button, ui.message(active ? "pipExit" : "pipButton", "PIP"), active);
  }
  button.addEventListener("click", async () => {
    const video = getVideo();
    if (!video || pending) return;
    pending = true;
    refresh();
    ui.announce(toolbar, "");
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await video.requestPictureInPicture();
    } catch (error) {
      if (!signal.aborted) {
        ui.announce(toolbar, ui.message("pipError", "Play the video and try PIP again."));
        console.warn("Youtube Helper: picture-in-picture failed.", error);
      }
    } finally {
      pending = false;
      if (!signal.aborted) refresh();
    }
  }, { signal });
  document.addEventListener("youtube-helper-update", refresh, { signal });
  for (const type of ["loadedmetadata", "emptied", "enterpictureinpicture", "leavepictureinpicture"]) {
    document.addEventListener(type, refresh, { signal, capture: true });
  }
  refresh();
});
