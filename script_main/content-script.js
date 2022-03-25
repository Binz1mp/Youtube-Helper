document.addEventListener('yt-navigate-finish', function collapsibleElement (){
    const injectElement = document.createElement('div');
    injectElement.classList.add('collapseParent');
    let collapseButton = document.getElementsByClassName("related-collapse");

    function autoTheathreModeOn() {
      if (document.querySelector("ytd-watch-flexy[theater]") == null) {
        // var ytmeCallEventObject = document.createEvent("MouseEvents");
        // ytmeCallEventObject.initEvent("click", true, true);
        document.querySelector("button.ytp-size-button.ytp-button").click();
        var setTimeCall = setTimeout(() => {
          if (document.querySelector("ytd-watch-flexy[theater]") == null) {
            autoTheathreModeOn();
          } else {
            clearTimeout(setTimeCall);
          }
        }, 500);
      }
    }
    function autoTheathreModeOff() {
      // if (document.querySelector("ytd-watch-flexy[theater]")) {
      //   // var ytmeCallEventObject = document.createEvent("MouseEvents");
      //   // ytmeCallEventObject.initEvent("click", true, true);
      //   document.querySelector("button.ytp-size-button.ytp-button").click();
      //   var setTimeCall = setTimeout(() => {
      //     if (document.querySelector("ytd-watch-flexy[theater]")) {
      //       autoTheathreModeOff();
      //     } else {
      //       clearTimeout(setTimeCall);
      //     }
      //   }, 500);
      // }
      document.querySelector("button.ytp-size-button.ytp-button").click();
    }

    const targetStuff = document.querySelector("#related");
    // const targetStuff2 = document.querySelector("#secondary");
    var i;
    injectElement.innerHTML = '<button type="button" class="related-collapse">Close Related Videos</button>';
    // for vertical and wide mode start //
    const insertbeforestuff = document.querySelector("#ticket-shelf");
    // for vertical and wide mode end //

    if (document.querySelector("#primary-inner")) {

      // for vertical and wide mode start //
      document.querySelector("#primary-inner").insertBefore(injectElement, insertbeforestuff);
      // for vertical and wide mode end //

      // for only vertical mode start //
      // document.querySelector("#primary-inner").insertBefore(injectElement, targetStuff);
      // for only vertical mode end //

    } else {
      console.log("Hello!");
    }
    if (document.getElementsByClassName('collapseParent').length >= 2) {
      document.querySelector('.collapseParent').remove('.related-collapse');
      console.log("killed duplicated button");
    } else {
      console.log("seems like normal?");
      }
    for (i = 0; i < collapseButton.length; i++) {
        collapseButton[i].addEventListener("click", function () {
          // var fulltarget = document.querySelector("#related").style.display;
          if (targetStuff.style.display === "") {
              targetStuff.style.display = "none";
              // targetStuff2.style.display = "none";
              // START_IN_THEATER_MODE = "true";
              localStorage.setItem("related_display", 'display_none');
              document.querySelector(".related-collapse").textContent = 'Open Related Videos';
              console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
              autoTheathreModeOn();
          } else {
              targetStuff.style.display = "";
              // targetStuff2.style.display = "";
              // START_IN_THEATER_MODE = "false";
              localStorage.setItem("related_display", 'display_normal');
              console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
              document.querySelector(".related-collapse").textContent = 'Close Related Videos';
              autoTheathreModeOff();
          }
        });
    };
    if (targetStuff && collapseButton && localStorage.getItem('related_display') === 'display_normal') {
      targetStuff.style.display = "";
      // targetStuff2.style.display = "";
      // START_IN_THEATER_MODE = "false";
      document.querySelector(".related-collapse").textContent = 'Close Related Videos';
      autoTheathreModeOff()
    } else if (targetStuff && collapseButton && localStorage.getItem('related_display') === 'display_none') {
      targetStuff.style.display = "none";
      autoTheathreModeOn();
      // targetStuff2.style.display = "none";
      // START_IN_THEATER_MODE = "true";
      document.querySelector(".related-collapse").textContent = 'Open Related Videos';
      } else {
        console.log("Now you are in the lobby. which means there's no button to modify now.");
      }
});
