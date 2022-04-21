var oldHref = document.location.href;
if (window.location.href.indexOf("youtube.com/shorts") > -1) {
  window.location.replace(
    window.location.toString().replace(/shorts/, "/watch/")
  );
}

window.onload = function () {
  var bodyList = document.querySelector("body");
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        console.log("location changed!");
        if (window.location.href.indexOf("youtube.com/shorts") > -1) {
          window.location.replace(
            window.location.toString().replace(/shorts/, "/watch/")
          );
        }
      }
    });
  });
  var config = {
    childList: true,
    subtree: true,
  };
  observer.observe(bodyList, config);
};
