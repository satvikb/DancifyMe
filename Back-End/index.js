// Include required libs
var express = require("express");
const fileUpload = require('express-fileupload');
var mime = require('mime-types')
var resolve = require('path').resolve
var app = express();
var bodyParser = require("body-parser")
var path = require("path");
var fs = require("fs");
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfprobePath(resolve("ffprobe.exe"));

var dance_handler = require("./dance_handler")

app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(express.static(resolve("../Front-End")))

// Create folder for uploading files.
var filesDir = path.join(path.dirname(require.main.filename), "uploads");

if (!fs.existsSync(filesDir)){
  fs.mkdirSync(filesDir);
}

app.post("/handleDanceComparison", (req, res) => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  console.log("FORM BODY "+JSON.stringify(req.body))
  var tutorialDanceId = req.body.tutorialDanceId; // TODO send from client

  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  res.set('Content-Type', 'application/json');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.videofile;
  var randomDanceID = getRandomInt(10000);
  uploadPath = resolve('rawDanceUploads/' + randomDanceID + "." + mime.extension(sampleFile.mimetype));

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    
    ffmpeg.ffprobe(uploadPath, function(err, metadata) {
      // console.log("Metadata " + JSON.stringify(metadata)+"_"+uploadPath);
      var streams = metadata["streams"]
      var highestFps = 0
      var longestDuration = 0
      for(var i = 0; i < streams.length; i++){
        var s = streams[i];
        var fps = parseInt(s["avg_frame_rate"].split("/")[0])
        var dur = parseInt(s["duration"])

        longestDuration = dur > longestDuration ? dur : longestDuration
        highestFps = fps > highestFps ? fps : highestFps
      }

      // TODO uploadPath isnt relative as required
      dance_handler.processUploadedDance(randomDanceID, uploadPath, function(normalizedKeypointsLocation){
        var tutorialDataPath = dance_handler.getNormalizedDanceDataURL(tutorialDanceId)
        var answerObject = dance_handler.compareTwoNormalizedDances(tutorialDataPath, normalizedKeypointsLocation)
        console.log("Compare "+normalizedKeypointsLocation+"__with tutorial "+tutorialDataPath+"__"+JSON.stringify(answerObject))
        answerObject["fps"] = highestFps
        answerObject["duration"] = longestDuration

        res.send(answerObject)
      });
    });
    console.log("FILE UPLOADED "+randomDanceID)
    // res.send({"message":"post done"});
  });
});

// dance_handler.processTutorialVideo("handsUpload", "rawDanceUploads/Upload.mp4", function(normalizedDataURL){
//   // dance_handler.compareTwoNormalizedDances(normalizedDataURL, normalizedDataURL)
//   // dance_handler.compareTwoNormalizedDances(resolve("processedDances/TUTORIAL_HANDS/TUTORIAL_HANDS.json"), resolve("processedDances/gabe/gabe.json"))
// });

// dance_handler.compareTwoNormalizedDances(resolve("processedDances/TUTORIAL_HANDS/TUTORIAL_HANDS.json"), resolve("processedDances/handsUpload/handsUpload.json"))
// dance_handler.compareTwoNormalizedDances(resolve("processedDances/TUTORIAL_HANDS/TUTORIAL_HANDS.json"), resolve("processedDances/edison/edison.json"))
// dance_handler.compareTwoNormalizedDances(resolve("processedDances/TUTORIAL_HANDS/TUTORIAL_HANDS.json"), resolve("processedDances/arnav/arnav.json"))
// dance_handler.compareTwoNormalizedDances(resolve("processedDances/TUTORIAL_HANDS/TUTORIAL_HANDS.json"), resolve("processedDances/arnav2/arnav2.json"))
// dance_handler.compareTwoNormalizedDances(resolve("processedDances/TUTORIAL_HANDS/TUTORIAL_HANDS.json"), resolve("processedDances/gabe/gabe.json"))

// Init server.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
