// Include required libs
var express = require("express");
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

var completion = function(arg1, arg2){

}

webRequest("http://google.com/image.png", function(data){
  // data = actual image data
})


var imageData;
webRequestSync("http://google.com/image.png", imageData)


app.get("/", function(req, res) {
  dance_handler.processUploadedDance("12345", "rawDanceUploads\\12345.mp4", function(){

  })
  // res.sendFile(__dirname + "/index.html");
});

// Video POST handler.
// app.post("/video_upload", function (req, res) {
//   upload_video(req, function(err, data) {

//     if (err) {
//       return res.status(404).end(JSON.stringify(err));
//     }

//     res.send(data);
//   });
// });

// Create folder for uploading files.
var filesDir = path.join(path.dirname(require.main.filename), "uploads");

if (!fs.existsSync(filesDir)){
  fs.mkdirSync(filesDir);
}

app.post("/handleDanceComparison", (req, res) => {
  var danceId = req.body.danceId;


});




// Init server.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
