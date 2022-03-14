document.addEventListener('yt-navigate-finish', function collapsibleElement (){
    const injectElement = document.createElement('div');
    let collapseButton = document.getElementsByClassName("related-collapse");
    var i;
    injectElement.innerHTML = '<button type="button" class="related-collapse">Close Related Videos</button>';
    document.querySelector("#meta").appendChild(injectElement);
    for (i = 0; i < collapseButton.length; i++) {
        collapseButton[i].addEventListener("click", function () {
          var targetStuff = document.querySelector("#related");
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
    console.log("리로드 했을때 로컬스토리지 = "+ localStorage.getItem('related_display'));
});


// document.addEventListener('yt-navigate-finish', function loadLocalStorage() {
//   if (localStorage.getItem('related_display') = 'display_none' ) {
//     console.log("111111111111111111111111111");
//     targetStuff.style.display = "";
//   } else {
//       console.log("22222222222222222222222222222");
//       targetStuff.style.display = "none";
//     }
// })
