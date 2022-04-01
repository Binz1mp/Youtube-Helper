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


    function autoTheathreModeOn() {
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

    function autoTheathreModeOff() {
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

    const targetStuff = document.querySelector("#related");
    // const targetStuff2 = document.querySelector("#secondary");
    var i;
    injectElement.innerHTML = '<button class="related-collapse">Close Related Videos</button>';
    // for vertical and wide mode start //
    const insertbeforestuff = document.querySelector("#ticket-shelf");
    // for vertical and wide mode end //

    if (document.querySelector("#primary-inner")) {

      // for vertical and wide mode start //
      document.querySelector("#primary-inner").insertBefore(injectElement, insertbeforestuff);
      setTimeout(function () {
      document.querySelector(".collapseParent").insertBefore(popcatChanInject, insertbeforestuffForpopCat);}, 5000)
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
      setTimeout(function () {
      autoTheathreModeOff();
      console.log("autoTheathreModeOff3");
      },1500);
    } else {
        console.log("Now you are in the lobby. which means there's no button to modify now.");
      }
});
