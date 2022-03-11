
// function somestuff () {
//     var targetStuff = document.querySelector("#related");
//     setTimeout(targetStuff.style.display = "none", 1000);
// }

// setTimeout(somestuff, 1000);



// document.addEventListener('DOMContentLoaded', function() {
//     var checkButton = document.getElementById('magicbutton');
//     checkButton.addEventListener('click', function () {
//         document.body.style.backgroundColor = 'red';
//         alert("엘렐레");
//     })
//   })



// var toggle = false;
// chrome.runtime.onMessage.addListener(function() {
//   toggle = !toggle;
//   Array.prototype.forEach.call(document.querySelectorAll('#related'), function(el) {
//     el.className = el.className + "begone";
//   });
// });




function binieon (){
    const injectElement = document.createElement('div');
    injectElement.innerHTML = '<button type="button" class="related-collapse">Open Collapsible</button>';
    document.querySelector("#meta").appendChild(injectElement);
}


setTimeout(binieon, 2000);


var coll = document.getElementsByClassName("related-collapse");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    alert("1");
    var targetStuff = document.querySelector("#related");
    alert("2");
    if (targetStuff.style.display === "") {
        targetStuff.style.display = "none";
    } else {
        targetStuff.style.display = "";
    }
    alert("3");
  });
}
