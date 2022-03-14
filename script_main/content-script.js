document.addEventListener('yt-navigate-finish', function collapsibleElement (){
    const injectElement = document.createElement('div');
    let collapseButton = document.getElementsByClassName("related-collapse");
    var i;

    injectElement.innerHTML = '<button type="button" class="related-collapse">Collapse Related Videos</button>';
    document.querySelector("#meta").appendChild(injectElement);

    for (i = 0; i < collapseButton.length; i++) {
        collapseButton[i].addEventListener("click", function () {
          this.classList.toggle("active");
          var targetStuff = document.querySelector("#related");
          if (targetStuff.style.display === "") {
              targetStuff.style.display = "none";
          } else {
              targetStuff.style.display = "";
          }
        });
      };
});