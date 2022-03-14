document.addEventListener('yt-navigate-finish', function collapsibleElement (){
    const injectElement = document.createElement('div');
    let collapseButton = document.getElementsByClassName("related-collapse");
    const targetStuff = document.querySelector("#related");
    var i;
    injectElement.innerHTML = '<button type="button" class="related-collapse">Close Related Videos</button>';
    document.querySelector("#primary-inner").insertBefore(injectElement, targetStuff);
    for (i = 0; i < collapseButton.length; i++) {
        collapseButton[i].addEventListener("click", function () {
          // var fulltarget = document.querySelector("#related").style.display;
          if (targetStuff.style.display === "") {
              targetStuff.style.display = "none";
              localStorage.setItem("related_display", 'display_none');
              document.querySelector(".related-collapse").textContent = 'Open Related Videos';
              console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
          } else {
              targetStuff.style.display = "";
              localStorage.setItem("related_display", 'display_normal');
              console.log("버튼클릭 로컬스토리지 = " + localStorage.getItem('related_display'));
              document.querySelector(".related-collapse").textContent = 'Close Related Videos';
          }
        });
        
    };
    if (localStorage.getItem('related_display') === 'display_normal') {
      document.querySelector("#related").style.display === ""
      document.querySelector(".related-collapse").textContent = 'Close Related Videos';
    } else {
      document.querySelector("#related").style.display = "none"
      document.querySelector(".related-collapse").textContent = 'Open Related Videos';
      }
});
