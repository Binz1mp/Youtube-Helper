document.addEventListener("yt-navigate-finish", function collapsibleElement() {
  let topButton = document.getElementsByClassName("top_button");
  for (i = 0; i < topButton.length; i++) {
    topButton[i].addEventListener("click", function (e) {
      if (window.location.href.indexOf("youtube.com/watch") > -1) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        console.log("top button not found");
      }
    });
  }
});