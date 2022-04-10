var oldHref = document.location.href;
if (window.location.href.indexOf('youtube.com/shorts') > -1) {
    window
        .location
        .replace(window.location.toString().replace(/shorts/, '/watch/'));
}
window.onload = function () {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('youtube.com/shorts') > -1) {
                    window
                        .location
                        .replace(window.location.toString().replace(/shorts/, '/watch/'));
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

document.addEventListener('yt-navigate-finish', function collapsibleElement() {
    const injectElement = document.createElement('div');
    injectElement
        .classList
        .add('collapseParent');
    let collapseButton = document.getElementsByClassName("related-collapse");
    let hoverButton = document.getElementsByClassName("related-collapse_another");
    let pipButton = document.getElementsByClassName("related-collapse_another_another");

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
    var i;
    injectElement.innerHTML =`
    <button class="related-collapse">Close Related Videos</button>
    <button class="related-collapse_another">Hover Video</button>
    <button class="related-collapse_another_another">PIP</button>`;
    const insertbeforestuff = document.querySelector("#ticket-shelf");
    if (document.querySelector("#primary-inner")) {
        document
            .querySelector("#primary-inner")
            .insertBefore(injectElement, insertbeforestuff);
    } else {
        console.log("Hello!");
    }

    const extensionParent = document.querySelector('.collapseParent');
    if (document.getElementsByClassName('collapseParent').length >= 2) {
        console.log("oh there are more than one elements.");
        document
            .querySelector('.collapseParent')
            .parentNode
            .removeChild(extensionParent);
        console.log("killed duplicated button");
    } else {
        console.log("seems like normal?");
    }

    for (i = 0; i < collapseButton.length; i++) {
        collapseButton[i].addEventListener("click", function () {
            if (window.location.href.indexOf('youtube.com/watch') > -1 && targetStuff.style.display === "") {
                targetStuff.style.display = "none";
                localStorage.setItem("related_display", 'display_none');
                document
                    .querySelector(".related-collapse")
                    .textContent = 'Open Related Videos';
                console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
                autoTheathreModeOn();
                console.log("on");
            } else {
                targetStuff.style.display = "";
                localStorage.setItem("related_display", 'display_normal');
                console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
                document
                    .querySelector(".related-collapse")
                    .textContent = 'Close Related Videos';
                autoTheathreModeOff();
                console.log("off");
            }
        });
    };
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
        document
            .querySelector('.collapseParent')
            .style
            .position = "fixed";
        document
            .querySelector('.collapseParent')
            .style
            .left = "50%";
        document
            .querySelector('.collapseParent')
            .style
            .bottom = "13%";
        document
            .querySelector('.collapseParent')
            .style
            .zIndex = "601";
        console.log("buttonHoverringOn");
    }
    function buttonHoverringOff() {
        document
            .querySelector('.collapseParent')
            .style
            .position = "";
        document
            .querySelector('.collapseParent')
            .style
            .left = "";
        document
            .querySelector('.collapseParent')
            .style
            .bottom = "";
        document
            .querySelector('.collapseParent')
            .style
            .zIndex = "";
        console.log("buttonHoverringOff");
    }

    for (i = 0; i < hoverButton.length; i++) {
        hoverButton[i].addEventListener("click", function () {
            if (window.location.href.indexOf('youtube.com/watch') > -1 && videotarget.style.position === "") {
                document
                    .querySelector(".related-collapse_another")
                    .textContent = 'Drop Video';
                localStorage.setItem("Hovering_status", 'on');
                videoHoveringOn();
                buttonHoverringOn();
                console.log("Hover on");
                if (videotargetsubtitle) {
                    videotargetsubtitle.style.position = "fixed";
                    console.log("subtitle area found");
                } else {
                    console.log("no subtitle area found");
                }
            } else if (window.location.href.indexOf('youtube.com/watch') > -1 && videotarget.style.position === "fixed") {
                document
                    .querySelector(".related-collapse_another")
                    .textContent = 'Hover Video';
                localStorage.setItem("Hovering_status", 'off');
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
    };

    if (window.location.href.indexOf('youtube.com/watch') > -1 && localStorage.getItem('Hovering_status') === 'on' && videotarget.style.position === "fixed") {
        setTimeout(function () {
            buttonHoverringOn();
            document
                .querySelector(".related-collapse_another")
                .textContent = 'Drop Video';
            console.log("on");
        }, 1500);
    } else if (window.location.href.indexOf('youtube.com/watch') > -1 && localStorage.getItem('Hovering_status') === 'off' && videotarget.style.position === "") {
        document
            .querySelector(".related-collapse_another")
            .textContent = 'Hover Video';
        buttonHoverringOff();
        console.log("off");
    } else {
        console.log("hover system broken");
    }
    if (window.location.href.indexOf('youtube.com/watch') > -1 && targetStuff && collapseButton && localStorage.getItem('related_display') === 'display_none') {
        targetStuff.style.display = "none";
        document
            .querySelector(".related-collapse")
            .textContent = 'Open Related Videos';
        setTimeout(function () {
            autoTheathreModeOn();
            console.log("autoTheathreModeOn3");
        }, 1500);
    } else if (window.location.href.indexOf('youtube.com/watch') > -1 && targetStuff && collapseButton && localStorage.getItem('related_display') === 'display_normal') {
        targetStuff.style.display = "";
        document
            .querySelector(".related-collapse")
            .textContent = 'Close Related Videos';
    } else {
        console.log(
            "Now you are in the lobby. which means there's no button to modify now."
        );
    }

function pipbyGoogle() {
  function findLargestPlayingVideo() {
    const videos = Array.from(document.querySelectorAll('video'))
      .filter(video => video.readyState != 0)
      .filter(video => video.disablePictureInPicture == false)
      .sort((v1, v2) => {
        const v1Rect = v1.getClientRects()[0]||{width:0,height:0};
        const v2Rect = v2.getClientRects()[0]||{width:0,height:0};
        return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
      });
  
    if (videos.length === 0) {
      return;
    }
    return videos[0];
  }
  async function requestPictureInPicture(video) {
    await video.requestPictureInPicture();
    video.setAttribute('__pip__', true);
    video.addEventListener('leavepictureinpicture', event => {
      video.removeAttribute('__pip__');
    }, { once: true });
    new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
  }
  function maybeUpdatePictureInPictureVideo(entries, observer) {
    const observedVideo = entries[0].target;
    if (!document.querySelector('[__pip__]')) {
      observer.unobserve(observedVideo);
      return;
    }
    const video = findLargestPlayingVideo();
    if (video && !video.hasAttribute('__pip__')) {
      observer.unobserve(observedVideo);
      requestPictureInPicture(video);
    }
  }
  (async () => {
    const video = findLargestPlayingVideo();
    if (!video) {
      return;
    }
    if (video.hasAttribute('__pip__')) {
      document.exitPictureInPicture();
      return;
    }
    await requestPictureInPicture(video);
    chrome.runtime.sendMessage({ message: 'enter' });
  })();
}

for (i = 0; i < pipButton.length; i++) {
  pipButton[i].addEventListener("click", function () {
      if (window.location.href.indexOf('youtube.com/watch') > -1) {
        pipbyGoogle();
          console.log("PIP mode on");
      } else {
          console.log("PIP mode off");
      }
  });
};


});