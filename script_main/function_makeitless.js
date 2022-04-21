document.addEventListener("yt-navigate-finish", function collapsibleElement() {
  setTimeout(function () {
    const morebutton = document.querySelector(
      "yt-formatted-string.less-button.style-scope.ytd-video-secondary-info-renderer"
    );
    if ((morebutton.style.display = "none !important")) {
      morebutton.click();
      console.log("now description is short.");
    } else {
      console.log("this can't be happen!");
    }
  }, 1500);
});
