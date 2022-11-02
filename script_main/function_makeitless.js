document.addEventListener("yt-navigate-finish", function collapsibleElement() {
  setTimeout(function () {
    const moreButton = document.querySelector("yt-formatted-string.less-button.style-scope.ytd-video-secondary-info-renderer");
    if (window.location.href.indexOf("youtube.com/watch") > -1) {
      if (moreButton) {
        moreButton.click();
        console.log("now description is short.");
      } else {
        console.log("this can't be happen!");
      }
    }
  }, 1500);
});
