document.addEventListener("yt-navigate-finish", function collapsibleElement() {
  let removeRightButton = document.getElementsByClassName("remove_right_blank");
  const secondaryId = document.querySelector('#columns > #secondary');
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
  for (i = 0; i < removeRightButton.length; i++) {
    removeRightButton[i].addEventListener("click", function () {
      if (window.location.href.indexOf("youtube.com/watch") > -1 &&
      secondaryId.style.display === ""
      ) {
        secondaryId.style.display = "none";
        autoTheathreModeOn()
        document.querySelector(".remove_right_blank").textContent = "Reveal Right Blank";
        localStorage.setItem("right_blank_display", "display_none");
        console.log('button_removerightblank.js - 1');
        } else {
          secondaryId.style.display = "";
          autoTheathreModeOff()
          document.querySelector(".remove_right_blank").textContent = "Remove Right Blank";
          localStorage.setItem("right_blank_display", "display_normal");
          console.log('button_removerightblank.js - 2');
        }
    });
  }
  if (
    window.location.href.indexOf("youtube.com/watch") > -1 &&
    secondaryId &&
    removeRightButton &&
    localStorage.getItem("right_blank_display") === "display_none"
    ) {
    secondaryId.style.display = "none";
    document.querySelector(".remove_right_blank").textContent = "Reveal Right Blank";
    setTimeout(function () {
      autoTheathreModeOn();
      console.log("autoTheathreModeOn3");
    }, 1500);
    console.log('button_removerightblank.js - 3');
  } else if (
    window.location.href.indexOf("youtube.com/watch") > -1 &&
    secondaryId &&
    removeRightButton &&
    localStorage.getItem("right_blank_display") === "display_normal"
  ) {
    secondaryId.style.display = "";
    document.querySelector(".remove_right_blank").textContent = "Remove Right Blank";
    console.log('button_removerightblank.js - 4');
  } else {
    console.log("Now you are in the lobby. which means there's no button to modify now.");
  }
});