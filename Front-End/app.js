var BODY_PART_ARRAY = {
    "0": "Nose",
    "1": "Neck",
    "2": "Right Shoulder",
    "3": "Right Elbow",
    "4": "Right Wrist",
    "5": "Left Shoulder",
    "6": "Left Elbow",
    "7": "Left Wrist",
    "8": "Mid Hip",
    "9": "Right Hip",
    "10": "Right Knee",
    "11": "Right Ankle",
    "12": "Left Hip",
    "13": "Left Knee",
    "14": "Left Ankle",
    "15": "Right Eye",
    "16": "Left Eye",
    "17": "Right Ear",
    "18": "Left Ear",
    "19": "Left Big Toe",
    "20": "Left Small Toe",
    "21": "Left Heel",
    "22": "Right Big Toe",
    "23": "Right Small Toe",
    "24": "Right Heel",
};

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
      $('#' + videoName).click(); // open file picker
      console.log("Video Clicked" + videoName);
    });
  }
}

$("#video_file1").change(function(e) {
  // var exampleData = {"startFrame":"60","totalDancePercent":0.8903061224489796,"incorrectParts":{"70":[3],"75":[3],"80":[3],"85":[3],"90":[3],"95":[3],"100":[3],"105":[3],"110":[3],"115":[3],"120":[3],"125":[3],"130":[3],"135":[3],"140":[3],"145":[3]},"fps":25,"duration":5}
  // updateModalDataWithResults(exampleData)
  showModal();
  uploadVideoWithFormId("video_file1_upload")
  e.preventDefault();
})

$("#video_file2").change(function(e) {
  showModal();
  uploadVideoWithFormId("video_file2_upload")
  e.preventDefault();
})

$("#video_file3").change(function(e) {
  showModal();
  uploadVideoWithFormId("video_file3_upload")
  e.preventDefault();
})

$("#video_file4").change(function(e) {
  showModal();
  uploadVideoWithFormId("video_file4_upload")
  e.preventDefault();
})

$("#video_file5").change(function(e) {
  showModal();
  uploadVideoWithFormId("video_file5_upload")
  e.preventDefault();
})

function uploadVideoWithFormId(formName){
  // var form = new FormData($("#"+formId)[0]);  
  var form = new FormData($("form[name='"+formName+"']")[0]);  

  console.log("SUBMIT FORM DATA")

  // Make the ajax call
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
         updateModalDataWithResults(res)

      },      
      data: form,                
      cache: false,
      contentType: false,
      processData: false,
      dataType:"json"
  });  
}

function showModal(){
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  var closeBtn = document.getElementById("modalClose");
  closeBtn.onclick = function() {
    console.log("CLOSEEE")
    modal.style.display = "none";
  }
  document.getElementById("modalPercent").innerHTML = "Processing Video"
  document.getElementById("weaknessText").innerHTML = "Here you will see when and how you went wrong during your dance!"
}

// When the user clicks anywhere outside of the modal, close it
function updateModalDataWithResults(results){
  var percentResult = results["totalDancePercent"];

  var totalPercent = percentResult == undefined ? 0 : (percentResult*100).toFixed(1)
  // var 
  var incorrectParts = results["incorrectParts"]
  var fps = results["fps"]

  var finalDisplayData = []
  var incorrectTotalString = ""

  if(incorrectParts != undefined){
    // Create items array
    var incorrectPartsItems = Object.keys(incorrectParts).map(function(key) {
      return [key, incorrectParts[key]];
    });

    // Sort the array based on the second element
    incorrectPartsItems.sort(function(first, second) {
      return second[0] - first[0];
    });

    for(var i = 0; i < incorrectPartsItems.length; i++){
      var partInfo = incorrectPartsItems[i]
      var frame = partInfo[0]
      var parts = partInfo[1]

      var realSeconds = frame/fps
      
      const partNames = parts.map(x => BODY_PART_ARRAY[x+""]);

      finalDisplayData.push([realSeconds, partNames])
    }
  }else{
    incorrectTotalString = "No matching dance pose was found in the entire video. Are you sure this is the right file?"
  }

  var modalPercent = document.getElementById("modalPercent");
  modalPercent.innerHTML = totalPercent+"%"

  for(var i = 0; i < finalDisplayData.length; i++){
    var d = finalDisplayData[i]
    var s = d[0]
    var ps = d[1]
    var finalString = ""
    var pString = ""
    for(var j = 0; j < ps.length; j++){
      pString += ps[j]+((j == ps.length - 1) ? "" : ", ")
    }

    
    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    
    var mins = pad(Math.floor(s/60), 2);
    var secs = pad((s % 60).toFixed(1), 4);

    var timeString = mins+":"+secs
    finalString = timeString + " - "+pString
    incorrectTotalString += finalString+"\n"
  }

  var weaknessText = document.getElementById("weaknessText");
  weaknessText.innerHTML = incorrectTotalString
}