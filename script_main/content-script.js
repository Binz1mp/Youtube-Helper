document.addEventListener("yt-navigate-finish", function collapsibleElement() {
  /**
 * localizing function
 * @param {"string"} messageName 
 * @returns localized text
 */
    function getLocalMessage(messageName) {
    return chrome.i18n.getMessage(messageName);
  }
  const injectElement = document.createElement("div");
  injectElement.classList.add("collapseParent");

  let collapseButton = document.getElementsByClassName("related_collapse_button");
  const targetStuff = document.querySelector("#related");
  var i;
  function autoTheathreModeOn() {
    window.onhashchange = function () {
      if (window.location.href.indexOf("youtube.com/watch") > -1) {
        if (document.querySelector("ytd-watch-flexy[theater]") == null) {
          var ytmeCallEventObject = document.createEvent("MouseEvents");
          ytmeCallEventObject.initEvent("click", true, true);
          document.querySelector("button.ytp-size-button.ytp-button").dispatchEvent(ytmeCallEventObject);
          console.log("autoTheathreModeOn1");
        } else {
          console.log("eh?On");
        }
      }
    };
    if (window.location.href.indexOf("youtube.com/watch") > -1) {
      if (document.querySelector("ytd-watch-flexy[theater]") == null) {
        var ytmeCallEventObject = document.createEvent("MouseEvents");
        ytmeCallEventObject.initEvent("click", true, true);
        document.querySelector("button.ytp-size-button.ytp-button").dispatchEvent(ytmeCallEventObject);
        console.log("autoTheathreModeOn1.5");
      } else {
        console.log("eh?On");
      }
    }
  }
  function autoTheathreModeOff() {
    window.onhashchange = function () {
      if (window.location.href.indexOf("youtube.com/watch") > -1) {
        if (document.querySelector("ytd-watch-flexy[theater]")) {
          var ytmeCallEventObject = document.createEvent("MouseEvents");
          ytmeCallEventObject.initEvent("click", true, true);
          document.querySelector("button.ytp-size-button.ytp-button").dispatchEvent(ytmeCallEventObject);
          console.log("autoTheathreModeOff1");
        } else {
          console.log("eh?Off");
        }
      }
    };
    if (window.location.href.indexOf("youtube.com/watch") > -1) {
      if (document.querySelector("ytd-watch-flexy[theater]")) {
        var ytmeCallEventObject = document.createEvent("MouseEvents");
        ytmeCallEventObject.initEvent("click", true, true);
        document.querySelector("button.ytp-size-button.ytp-button").dispatchEvent(ytmeCallEventObject);
        console.log("autoTheathreModeOff1.5");
      } else {
        console.log("eh?Off");
      }
    }
  }
  
  injectElement.innerHTML = `
  <button class="related_collapse_button">Close Related Videos</button>
  <button class="remove_right_blank">Remove Right Blank</button>
  <button class="hover_button">Hover Video</button>
  <button class="pip_button">PIP</button>
  <button class="top_button">Top</button>
  <button class="hover_controller">+</button>`;
  const insertBeforeStuff = document.querySelector("#ticket-shelf");
  if (document.querySelector("#below")) {
    document.querySelector("#below").insertBefore(injectElement, insertBeforeStuff);
    setTimeout(() => {
      if (document.querySelector("#below > ytd-merch-shelf-renderer.style-scope.ytd-watch-flexy")) {
        const blackLine = document.querySelector("#below > ytd-merch-shelf-renderer.style-scope.ytd-watch-flexy");
        blackLine.remove();
      }
    }, 2500);
  } else {
    console.log("Hello!");
  }
  
  if (document.getElementsByClassName("collapseParent").length >= 2) {
    const extensionParent = document.querySelector(".collapseParent");
    console.log("oh there are more than one elements.");
    // document.querySelector(".collapseParent").parentNode.removeChild(extensionParent);
    extensionParent.remove();
    console.log("killed duplicated button");
  } else {
    console.log("seems like normal?");
  }
  
  for (i = 0; i < collapseButton.length; i++) {
    collapseButton[i].addEventListener("click", function () {
      if (window.location.href.indexOf("youtube.com/watch") > -1 &&
      targetStuff.style.display === ""
        ) {
        targetStuff.style.display = "none";
        localStorage.setItem("related_display", "display_none");
        // document.querySelector(".related_collapse_button").textContent = "Open Related Videos";
        document.querySelector(".related_collapse_button").textContent = getLocalMessage("relatedVideo_on");
        console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem("related_display"));
        autoTheathreModeOn();
        console.log("on");
      } else {
        targetStuff.style.display = "";
        localStorage.setItem("related_display", "display_normal");
        console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem("related_display"));
        // document.querySelector(".related_collapse_button").textContent = "Close Related Videos";
        document.querySelector(".related_collapse_button").textContent = getLocalMessage("relatedVideo_off");
        autoTheathreModeOff();
        console.log("off");
      }
    });
  }

  if (
    window.location.href.indexOf("youtube.com/watch") > -1 &&
    targetStuff &&
    collapseButton &&
    localStorage.getItem("related_display") === "display_none"
    ) {
    targetStuff.style.display = "none";
    // document.querySelector(".related_collapse_button").textContent = "Open Related Videos";
    document.querySelector(".related_collapse_button").textContent = getLocalMessage("relatedVideo_on");
    setTimeout(function () {
      autoTheathreModeOn();
      console.log("autoTheathreModeOn3");
    }, 1500);
  } else if (
    window.location.href.indexOf("youtube.com/watch") > -1 &&
    targetStuff &&
    collapseButton &&
    localStorage.getItem("related_display") === "display_normal"
  ) {
    targetStuff.style.display = "";
    // document.querySelector(".related_collapse_button").textContent = "Close Related Videos";
    document.querySelector(".related_collapse_button").textContent = getLocalMessage("relatedVideo_off");
  } else {
    console.log("Now you are in the lobby. which means there's no button to modify now.");
  }
});