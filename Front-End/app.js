function moveToSelected(element) {
  console.log("MTS "+element)
  if (element == "next") {
    var selected = $(".selected").next();
  } else if (element == "prev") {
    var selected = $(".selected").prev();
  } else {
    var selected = element;
  }

  var next = $(selected).next();
  var prev = $(selected).prev();
  var prevSecond = $(prev).prev();
  var nextSecond = $(next).next();

  $(selected).removeClass().addClass("selected");
  $(selected).children().first().removeClass().addClass("selectedContainer")

  $(prev).removeClass().addClass("prev");
  $(prev).children().first().removeClass().addClass("prevContainer")

  $(next).removeClass().addClass("next");
  $(next).children().first().removeClass().addClass("nextContainer")

  $(nextSecond).removeClass().addClass("nextRightSecond");
  $(nextSecond).children().first().removeClass().addClass("nextRightSecondContainer")

  $(prevSecond).removeClass().addClass("prevLeftSecond");
  $(prevSecond).children().first().removeClass().addClass("prevLeftSecondContainer")

  $(nextSecond).nextAll().removeClass().addClass("hideRight");
  $(nextSecond).nextAll().children().first().removeClass().addClass("hideRightContainer")

  $(prevSecond).prevAll().removeClass().addClass("hideLeft");
  $(prevSecond).prevAll().children().first().removeClass().addClass("hideLeftContainer")

}

// Eventos teclado
$(document).keydown(function (e) {
  switch (e.which) {
    case 37: // left
      moveToSelected("prev");
      break;

    case 39: // right
      moveToSelected("next");
      break;

    default:
      return;
  }
  e.preventDefault();
});

// $("#carousel div").click(function () {
//   moveToSelected($(this));
// });

$("#prevBtn").click(function () {
  console.log("PC")
  moveToSelected("prev");
});

$("#nextBtn").click(function () {
  moveToSelected("next");
});
console.log("sc")

var all = document.getElementsByTagName("video");
for(var i = 0, max = all.length; i < max; i++)
{
  var videoNode = all[i]
  if (videoNode) {
    videoNode.addEventListener('click', function(event){
      event.preventDefault();
    });
  }
}

// TODO determine which dance to learn or hide all the learn buttons except
// for the currently selected video
$(".learnBtn").click(function () {
  // show a new window
  
});
