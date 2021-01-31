// Include required libs
var express = require("express");
const fileUpload = require('express-fileupload');
var mime = require('mime-types')
var resolve = require('path').resolve

var app = express();
var bodyParser = require("body-parser")
var path = require("path");
var fs = require("fs");
var dance_handler = require("./dance_handler")
// var upload_file = require("./file_upload.js");
// var upload_image = require("./image_upload.js");
// var upload_video = require("./video_upload.js");

app.use(express.static(__dirname + "/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.get("/", function(req, res) {
  console.log("Here")
});


// Create folder for uploading files.
var filesDir = path.join(path.dirname(require.main.filename), "uploads");

if (!fs.existsSync(filesDir)){
  fs.mkdirSync(filesDir);
}

app.post("/handleDanceComparison", (req, res) => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  var tutorialDanceId = req.body.tutorialDanceId; // TODO send from client

  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.videofile;
  var randomDanceID = getRandomInt(10000);
  uploadPath = __dirname + '/rawDanceUploads/' + randomDanceID + "." + mime.extension(sampleFile.mimetype);

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    // TODO uploadPath isnt relative as required
    dance_handler.processUploadedDance(randomDanceID, uploadPath, function(normalizedKeypointsLocation){
      // 
      var tutorialDataPath = dance_handler.getNormalizedDanceDataURL(tutorialDanceId)
      dance_handler.compareTwoNormalizedDances(normalizedKeypointsLocation, tutorialDataPath)
    });
    // res.send('File uploaded!');
  });
});

dance_handler.processTutorialVideo("handsUpload", "rawDanceUploads/Upload.mp4", function(normalizedDataURL){
  // dance_handler.compareTwoNormalizedDances(normalizedDataURL, normalizedDataURL)
  // dance_handler.compareTwoNormalizedDances(resolve("processedDances/TUTORIAL_HANDS/TUTORIAL_HANDS.json"), resolve("processedDances/gabe/gabe.json"))
});

dance_handler.compareTwoNormalizedDances(resolve("processedDances/TUTORIAL_HANDS/TUTORIAL_HANDS.json"), resolve("processedDances/handsUpload/handsUpload.json"))

// Init server.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
