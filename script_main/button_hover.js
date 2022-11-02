document.addEventListener("yt-navigate-finish", function collapsibleElement() {
  /**
   * localizing function
   * @param {"string"} messageName 
   * @returns localized text
   */
  function getLocalMessage(messageName) {
    return chrome.i18n.getMessage(messageName);
  }
  let hoverButton = document.getElementsByClassName("hover_button");

  const videotarget = document.querySelector(".html5-video-container");
  const videotargetzindex = document.querySelector(
    "#player.style-scope.ytd-watch-flexy"
  );
  const videotargetzindextheatremode = document.querySelector(
    "#player-container.style-scope.ytd-watch-flexy"
  );
  const videotargetzcontrolbar = document.querySelector(".ytp-chrome-bottom");
  const videotargetsubtitle = document.querySelector(
    ".ytp-caption-window-container#ytp-caption-window-container"
  );
  const videotargetgradient = document.querySelector(".ytp-gradient-bottom");

  function videoHoveringOn() {
    videotarget.style.position = "fixed";
    videotargetzindex.style.zIndex = "301";
    videotargetzindextheatremode.style.zIndex = "301";
    videotargetzcontrolbar.style.position = "fixed";
    videotargetgradient.style.position = "fixed";
    console.log("videoHoveringOn");
  }
  function videoHoveringOff() {
    videotarget.style.position = "";
    videotargetzindex.style.zIndex = "10";
    videotargetzindextheatremode.style.zIndex = "10";
    videotargetzcontrolbar.style.position = "";
    videotargetgradient.style.position = "";
    console.log("videoHoveringOff");
  }
  function buttonHoverringOn() {
    document.querySelector(".collapseParent").style.position = "fixed";
    document.querySelector(".collapseParent").style.left = "49%";
    document.querySelector(".collapseParent").style.bottom = "13%";
    document.querySelector(".collapseParent").style.zIndex = "601";
    console.log("buttonHoverringOn");
  }
  function buttonHoverringOff() {
    document.querySelector(".collapseParent").style.position = "";
    document.querySelector(".collapseParent").style.left = "";
    document.querySelector(".collapseParent").style.bottom = "";
    document.querySelector(".collapseParent").style.zIndex = "";
    console.log("buttonHoverringOff");
  }

  for (i = 0; i < hoverButton.length; i++) {
    hoverButton[i].addEventListener("click", function () {
      if (
        window.location.href.indexOf("youtube.com/watch") > -1 &&
        videotarget.style.position === ""
      ) {
        // document.querySelector(".hover_button").textContent = "Drop Video";
        document.querySelector(".hover_button").textContent = getLocalMessage("hover_on");
        localStorage.setItem("Hovering_status", "on");
        videoHoveringOn();
        buttonHoverringOn();
        console.log("Hover on");
        if (videotargetsubtitle) {
          videotargetsubtitle.style.position = "fixed";
          console.log("subtitle area found");
        } else {
          console.log("no subtitle area found");
        }
      } else if (
        window.location.href.indexOf("youtube.com/watch") > -1 &&
        videotarget.style.position === "fixed"
      ) {
        // document.querySelector(".hover_button").textContent = "Hover Video";
        document.querySelector(".hover_button").textContent = getLocalMessage("hover_off");
        localStorage.setItem("Hovering_status", "off");
        videoHoveringOff();
        buttonHoverringOff();
        console.log("Hover off");
        if (videotargetsubtitle) {
          videotargetsubtitle.style.position = "";
          console.log("subtitle area found");
        } else {
          console.log("no subtitle area found");
        }
      } else {
        console.log("something broken.");
      }
    });
  }

  if (
    window.location.href.indexOf("youtube.com/watch") > -1 &&
    localStorage.getItem("Hovering_status") === "on" &&
    videotarget.style.position === "fixed"
  ) {
    // setTimeout(function () {
    buttonHoverringOn();
    // document.querySelector(".hover_button").textContent = "Drop Video";
    document.querySelector(".hover_button").textContent = getLocalMessage("hover_on");
    console.log("on");
    // }, 1500);
  } else if (
    window.location.href.indexOf("youtube.com/watch") > -1 &&
    localStorage.getItem("Hovering_status") === "off" &&
    videotarget.style.position === ""
  ) {
    // document.querySelector(".hover_button").textContent = "Hover Video";
    document.querySelector(".hover_button").textContent = getLocalMessage("hover_off");
    buttonHoverringOff();
    console.log("off");
  } else {
    console.log("hover system broken");
  }
});