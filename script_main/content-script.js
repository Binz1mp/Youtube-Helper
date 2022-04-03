var oldHref = document.location.href;
if (window.location.href.indexOf('youtube.com/shorts') > -1) {
    window.location.replace(window.location.toString().replace(/shorts/, '/watch/'));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('youtube.com/shorts') > -1) {
                    window.location.replace(window.location.toString().replace(/shorts/, '/watch/'));
                }
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
};

document.addEventListener('yt-navigate-finish', function collapsibleElement (){

    const injectElement = document.createElement('div');
    injectElement.classList.add('collapseParent');
    let collapseButton = document.getElementsByClassName("related-collapse");
    let hoverButton = document.getElementsByClassName("related-collapse_another");


    function autoTheathreModeOn() {
      window.onhashchange = function () {
      if (window.location.href.indexOf('youtube.com/watch') > -1) {
        if (document.querySelector("ytd-watch-flexy[theater]") == null) {
          var ytmeCallEventObject = document.createEvent("MouseEvents");
          ytmeCallEventObject.initEvent("click", true, true);
          document
            .querySelector("button.ytp-size-button.ytp-button")
            .dispatchEvent(ytmeCallEventObject);
            console.log("autoTheathreModeOn1");
        } else {
          console.log("eh?On");
        }
      }
    }
    if (window.location.href.indexOf('youtube.com/watch') > -1) {
      if (document.querySelector("ytd-watch-flexy[theater]") == null) {
        var ytmeCallEventObject = document.createEvent("MouseEvents");
        ytmeCallEventObject.initEvent("click", true, true);
        document
          .querySelector("button.ytp-size-button.ytp-button")
          .dispatchEvent(ytmeCallEventObject);
          console.log("autoTheathreModeOn1.5");
      } else {
        console.log("eh?On");
        }
  }
}

    function autoTheathreModeOff() {
      window.onhashchange = function () {
        if (window.location.href.indexOf('youtube.com/watch') > -1) {
        if (document.querySelector("ytd-watch-flexy[theater]")) {
          var ytmeCallEventObject = document.createEvent("MouseEvents");
          ytmeCallEventObject.initEvent("click", true, true);
          document
            .querySelector("button.ytp-size-button.ytp-button")
            .dispatchEvent(ytmeCallEventObject);
            console.log("autoTheathreModeOff1");
        } else {
          console.log("eh?Off");
          }
        }
      }
      if (window.location.href.indexOf('youtube.com/watch') > -1) {
        if (document.querySelector("ytd-watch-flexy[theater]")) {
          var ytmeCallEventObject = document.createEvent("MouseEvents");
          ytmeCallEventObject.initEvent("click", true, true);
          document
            .querySelector("button.ytp-size-button.ytp-button")
            .dispatchEvent(ytmeCallEventObject);
            console.log("autoTheathreModeOff1.5");
        } else {
          console.log("eh?Off");
          }
      }
    }

    const targetStuff = document.querySelector("#related");
    // const targetStuff2 = document.querySelector("#secondary");
    var i;
    injectElement.innerHTML = '<button class="related-collapse">Close Related Videos</button><button class="related-collapse_another">Hover Video</button>';
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

    const extensionParent = document.querySelector('.collapseParent');
    if (document.getElementsByClassName('collapseParent').length >= 2) {
      console.log("oh there are more than one elements.");
      document.querySelector('.collapseParent').parentNode.removeChild(extensionParent);
      console.log("killed duplicated button");
    } else {
      console.log("seems like normal?");
      }

    for (i = 0; i < collapseButton.length; i++) {
        collapseButton[i].addEventListener("click", function () {
          // var fulltarget = document.querySelector("#related").style.display;
          if (window.location.href.indexOf('youtube.com/watch') > -1 && targetStuff.style.display === "") {
              targetStuff.style.display = "none";
              // targetStuff2.style.display = "none";
              // START_IN_THEATER_MODE = "true";
              localStorage.setItem("related_display", 'display_none');
              document.querySelector(".related-collapse").textContent = 'Open Related Videos';
              console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
              autoTheathreModeOn();
              console.log("on");
          } else {
              targetStuff.style.display = "";
              // targetStuff2.style.display = "";
              // START_IN_THEATER_MODE = "false";
              localStorage.setItem("related_display", 'display_normal');
              console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
              document.querySelector(".related-collapse").textContent = 'Close Related Videos';
              autoTheathreModeOff();
              console.log("off");
          }
        });
    };
const videotarget = document.querySelector(".html5-video-container");
const videotargetzindex = document.querySelector("#player.style-scope.ytd-watch-flexy");
const videotargetzindextheatremode = document.querySelector("#player-container.style-scope.ytd-watch-flexy");
const videotargetzcontrolbar = document.querySelector(".ytp-chrome-bottom");
const videotargetsubtitle = document.querySelector(".ytp-caption-window-container#ytp-caption-window-container");
const videotargetgradient = document.querySelector(".ytp-gradient-bottom");

    for (i = 0; i < hoverButton.length; i++) {
      hoverButton[i].addEventListener("click", function () {
        if (window.location.href.indexOf('youtube.com/watch') > -1 && videotarget .style.position === "") {
            document.querySelector(".related-collapse_another").textContent = 'Drop Video';
            videotarget.style.position = "fixed";
            videotargetzindex.style.zIndex = "301";
            videotargetzindextheatremode.style.zIndex = "301";
            videotargetzcontrolbar.style.position = "fixed";
            videotargetsubtitle.style.position = "fixed";
            videotargetgradient.style.position = "fixed";
            console.log("Hover on");
        } else if (window.location.href.indexOf('youtube.com/watch') > -1 && videotarget .style.position === "fixed"){
          document.querySelector(".related-collapse_another").textContent = 'Hover Video';
          videotarget.style.position = "";
          videotargetzindex.style.zIndex = "10";
          videotargetzindextheatremode.style.zIndex = "10";
          videotargetzcontrolbar.style.position = "";
          videotargetsubtitle.style.position = "";
          videotargetgradient.style.position = "";
          console.log("Hover off");
        } else {
          console.log("something broken.");
        }
      });
    };

    if (window.location.href.indexOf('youtube.com/watch') > -1 &&targetStuff && collapseButton && localStorage.getItem('related_display') === 'display_none') {
      targetStuff.style.display = "none";
      // targetStuff2.style.display = "none";
      // START_IN_THEATER_MODE = "true";
      document.querySelector(".related-collapse").textContent = 'Open Related Videos';
      setTimeout(function () {
      autoTheathreModeOn();
      console.log("autoTheathreModeOn3");
      },1500);
      }
    else if (window.location.href.indexOf('youtube.com/watch') > -1 &&targetStuff && collapseButton && localStorage.getItem('related_display') === 'display_normal') {
      targetStuff.style.display = "";
      // targetStuff2.style.display = "";
      // START_IN_THEATER_MODE = "false";
      document.querySelector(".related-collapse").textContent = 'Close Related Videos';
      // setTimeout(function () {
      // autoTheathreModeOff();
      // console.log("autoTheathreModeOff3");
      // },1500);
    } else {
        console.log("Now you are in the lobby. which means there's no button to modify now.");
      }
});