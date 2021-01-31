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

$("#prevBtn").click(function () {
  console.log("PC")
  moveToSelected("prev");
});

$("#nextBtn").click(function () {
  moveToSelected("next");
});
var all = document.getElementsByTagName("video");
for(var i = 0, max = all.length; i < max; i++)
{
  var videoNode = all[i]
  console.log(videoNode);
  if (videoNode && i != 0) {
    var videoName = videoNode.getAttribute("name");
    console.log("Video Clicked" + videoName);
    videoNode.addEventListener('click', function(event){
      event.preventDefault();
      var videoName = event.target.getAttribute("name");
      $('#' + videoName).click();
      console.log("Video Clicked" + videoName);
    });
  }
}

$("#video_file1").change(function(e) {

  console.log("SUBMIT FORM DATA")

  var form = new FormData($("form[name='upload_form']")[0]);  
  // // Make the ajax call
  $.ajax({
      url: 'http://localhost:3000/handleDanceComparison',
      type: 'POST',
      beforeSend: function(request) {
        request.setRequestHeader("Access-Control-Allow-Origin", "*");
      },
      // crossDomain:true, 
      success: function (res) {
         // your code after succes
         console.log("RESSSS "+JSON.stringify(res))
      },      
      data: form,                
      cache: false,
      contentType: false,
      processData: false,
      dataType:"json"
  });  


  // var xhr = new XMLHttpRequest();
  // xhr.open("POST", "http://localhost:3000/handleDanceComparison"); 
  // xhr.onload = function(event){ 
  //     alert("Success, server responded with: " + event.target.response); // raw response
  // }; 
  // // or onerror, onabort
  // var formData = new FormData($("form[name='upload_form']")[0]); 
  // xhr.send(formData);


  e.preventDefault();
})


// $("#video_file1").change(function(e) {

//   console.log("SUBMIT FORM DATA")

//   // console.log("RESSSS "+res)

//   $("form[name='upload_form']").submit(function(e){
//     e.preventDefault();    
//     var formData = new FormData(this);

//     $.ajax({
//         url: 'http://66b1681cb990.ngrok.io/handleDanceComparison',
//         type: 'POST',
//         data: formData,
//         crossDomain:true, 
//         success: function (data) {
//             alert(data)
//         },
//         cache: false,
//         contentType: false,
//         processData: false
//     });
//   });
//   e.preventDefault();
// })
