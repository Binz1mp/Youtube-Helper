document.addEventListener("yt-navigate-finish", function collapsibleElement() {
  setTimeout(function () {
    if (
      document.querySelector(
        "#primary-inner > ytd-merch-shelf-renderer.style-scope.ytd-watch-flexy"
      )
    ) {
      console.log("we found any ads which cover our button.");
      document
        .querySelector(
          "#primary-inner > ytd-merch-shelf-renderer.style-scope.ytd-watch-flexy"
        )
        .remove();
    } else {
      console.log("we haven't found any ads which cover our button.");
    }
  }, 1500);
});
