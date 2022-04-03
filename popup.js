const popcatImg = document.getElementsByClassName("popcat");
var popcatsfx = chrome.runtime.getURL("sfx/popcat.mp3");
var poppop = new Audio(popcatsfx);

for (i = 0; i < popcatImg.length; i++) { 
    popcatImg[i].addEventListener("click", function () {
        poppop.play();
        console.log("pop");
    })
}