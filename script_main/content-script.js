document.addEventListener('yt-navigate-finish', function collapsibleElement (){
    const injectElement = document.createElement('div');
    injectElement.classList.add('collapseParent');
    let collapseButton = document.getElementsByClassName("related-collapse");
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
              collapseButton.textContent = 'Open Related Videos';
              console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
          } else {
              targetStuff.style.display = "";
              // targetStuff2.style.display = "";
              // START_IN_THEATER_MODE = "false";
              localStorage.setItem("related_display", 'display_normal');
              console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
              collapseButton.textContent = 'Close Related Videos';
          }
        });
    };
    if (targetStuff && collapseButton && localStorage.getItem('related_display') === 'display_normal') {
      targetStuff.style.display = "";
      // targetStuff2.style.display = "";
      // START_IN_THEATER_MODE = "false";
      collapseButton.textContent = 'Close Related Videos';
    } else if (targetStuff && collapseButton && localStorage.getItem('related_display') === 'display_none') {
      targetStuff.style.display = "none";
      // targetStuff2.style.display = "none";
      // START_IN_THEATER_MODE = "true";
      collapseButton.textContent = 'Open Related Videos';
      } else {
        console.log("Now you are in the lobby. which means there's no button to modify now.");
      }
});
