document.addEventListener("youtube-helper-ready", ({ detail: { toolbar, signal } }) => {
  toolbar.querySelector(".top_button").addEventListener("click", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  }, { signal });
});
