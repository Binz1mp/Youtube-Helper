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

  const collapseButton = document.querySelector(".collapseParent");
  const videoTarget = document.querySelector(".html5-video-container");
  const videoTargetZIndex = document.querySelector(
    "#player.style-scope.ytd-watch-flexy"
  );
  const videoTargetZIndexTheatreMode = document.querySelector(
    "#player-container.style-scope.ytd-watch-flexy"
  );
  const videoTargetZControllbar = document.querySelector(".ytp-chrome-bottom");
  const videoTargetsubtitle = document.querySelector(
    ".ytp-caption-window-container#ytp-caption-window-container"
  );
  const videoTargetGradient = document.querySelector(".ytp-gradient-bottom");

  function videoHoveringOn() {
    videoTarget.style.position = "fixed";
    videoTargetZIndex.style.zIndex = "301";
    videoTargetZIndexTheatreMode.style.zIndex = "301";
    videoTargetZControllbar.style.position = "fixed";
    videoTargetGradient.style.position = "fixed";
    
    console.log("videoHoveringOn");
  }
  function videoHoveringOff() {
    videoTarget.style.position = "";
    videoTargetZIndex.style.zIndex = "10";
    videoTargetZIndexTheatreMode.style.zIndex = "10";
    videoTargetZControllbar.style.position = "";
    videoTargetGradient.style.position = "";
    
    console.log("videoHoveringOff");
  }
  function buttonHoverringOn() {
    collapseButton.style.position = "fixed";
    collapseButton.style.left = "49%";
    collapseButton.style.bottom = "13%";
    collapseButton.style.zIndex = "602";
    console.log("buttonHoverringOn");
    collapseButton.id = 'hovering';
    // document.querySelector(".hover_controller").id = 'now_hovering';
    collapseButton.children[0].id = 'now_hovering_but_hidden';
    collapseButton.children[1].id = 'now_hovering_but_hidden';
    collapseButton.children[2].id = 'now_hovering_but_hidden';
    collapseButton.children[3].id = 'now_hovering_but_hidden';
    collapseButton.children[4].id = 'now_hovering_but_hidden';
    document.querySelector(".hover_controller").setAttribute('id' ,'now_hovering');
  }
  function buttonHoverringOff() {
    collapseButton.style.position = "";
    collapseButton.style.left = "";
    collapseButton.style.bottom = "";
    collapseButton.style.zIndex = "";
    console.log("buttonHoverringOff");
    collapseButton.removeAttribute('id');
    collapseButton.children[0].removeAttribute('id');
    collapseButton.children[1].removeAttribute('id');
    collapseButton.children[2].removeAttribute('id');
    collapseButton.children[3].removeAttribute('id');
    collapseButton.children[4].removeAttribute('id');
    document.querySelector(".hover_controller").setAttribute('id', "");
  }

  const hoverController = document.querySelector(".hover_controller");
  hoverController.addEventListener("click", function () {
    if (localStorage.getItem("Hovering_status") === "on" &&
    collapseButton.children[0].id == 'now_hovering_but_hidden') {
      console.log("111111111111111111111111111");
      collapseButton.children[0].removeAttribute('id');
      collapseButton.children[1].removeAttribute('id');
      collapseButton.children[2].removeAttribute('id');
      collapseButton.children[3].removeAttribute('id');
      collapseButton.children[4].removeAttribute('id');
    }
    else {
      console.log("2222222222222222222222222222222");
      collapseButton.children[0].id = 'now_hovering_but_hidden';
      collapseButton.children[1].id = 'now_hovering_but_hidden';
      collapseButton.children[2].id = 'now_hovering_but_hidden';
      collapseButton.children[3].id = 'now_hovering_but_hidden';
      collapseButton.children[4].id = 'now_hovering_but_hidden';
    }
  });

  for (i = 0; i < hoverButton.length; i++) {
    hoverButton[i].addEventListener("click", function () {
      if (
        window.location.href.indexOf("youtube.com/watch") > -1 &&
        videoTarget.style.position === ""
      ) {
        // document.querySelector(".hover_button").textContent = "Drop Video";
        videoHoveringOn();
        buttonHoverringOn();
        document.querySelector(".hover_button").textContent = getLocalMessage("hover_on");
        localStorage.setItem("Hovering_status", "on");
        console.log("Hover on");
        if (videoTargetsubtitle) {
          videoTargetsubtitle.style.position = "fixed";
          console.log("subtitle area found");
        } else {
          console.log("no subtitle area found");
        }
      } else if (
        window.location.href.indexOf("youtube.com/watch") > -1 &&
        videoTarget.style.position === "fixed"
      ) {
        // document.querySelector(".hover_button").textContent = "Hover Video";
        videoHoveringOff();
        buttonHoverringOff();
        document.querySelector(".hover_button").textContent = getLocalMessage("hover_off");
        localStorage.setItem("Hovering_status", "off");
        console.log("Hover off");
        if (videoTargetsubtitle) {
          videoTargetsubtitle.style.position = "";
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
  // hover on, video position fixed
  window.location.href.indexOf("youtube.com/watch") > -1 &&
  localStorage.getItem("Hovering_status") === "on" &&
  videoTarget.style.position === "fixed") {
    buttonHoverringOn();
    document.querySelector(".hover_button").textContent = getLocalMessage("hover_on");
    console.log("on");
  } else if (
  // hover off, video position normal
  window.location.href.indexOf("youtube.com/watch") > -1 &&
  localStorage.getItem("Hovering_status") === "off" &&
  videoTarget.style.position === "") {
    buttonHoverringOff();
    document.querySelector(".hover_button").textContent = getLocalMessage("hover_off");
    console.log("off");
  } else if (
  // hover on, video position normal
  window.location.href.indexOf("youtube.com/watch") > -1 &&
  localStorage.getItem("Hovering_status") === "on" &&
  videoTarget.style.position === "") {
    videoHoveringOn();
    buttonHoverringOn();
    
    document.querySelector(".hover_button").textContent = getLocalMessage("hover_on");
    console.log("on");
  } else if (
  // hover off, video position fixed
  window.location.href.indexOf("youtube.com/watch") > -1 &&
  localStorage.getItem("Hovering_status") === "off" &&
  videoTarget.style.position === "fixed") {
    videoHoveringOff();
    buttonHoverringOff();
    document.querySelector(".hover_button").textContent = getLocalMessage("hover_off");
    console.log("off");
  } else {
    console.log("hover system broken");
  }
});