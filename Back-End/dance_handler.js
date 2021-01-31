const { exec } = require('child_process');
var resolve = require('path').resolve
var fs = require('fs');
var path = require('path');

module.exports = {
    /* 
        Back-End/
            rawDancesUploads/
                upload21341.mp4
            rawDanceFrames/
                danceID/
                    keyframeCompilation.json
                    keyframe1.json
                    keyframe2.json
            processedDances/
                danceID/
                    danceID.dce
    */
   /* maybe dont separate tutorial dances from raw
            rawTutorialDances/
                danceID/
                    danceName.mp4
                    keyframe1.json,...
                    keyframeCompilation.json
            tutorialDances/
                danceName/
                    danceName.dce
   */

    // rawDanceUploads/12345.mp4
    // C:\Users\Satvik\Documents\Development\Hackathons\SwampHacks 2021\DancifyMe\Back-End\rawDanceUploads
    processUploadedDance: function(danceID, relativeDanceVideoURL, completion) {
        // run openpose on the dance.mp4
        var openPoseLocation = "openpose"
        var absoluteDanceURL = resolve(relativeDanceVideoURL)
        var jsonWriteLocation = resolve("rawDanceFrames/"+danceID+"/")
        console.log(absoluteDanceURL)
        exec('bin\\OpenPoseDemo.exe --frame_step 5 --number_people_max 1 --video \"'+absoluteDanceURL+"\" --write_json \""+jsonWriteLocation+"\"",  {cwd: openPoseLocation}, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                console.log("ERR "+err)
                return;
            }
            
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            console.log("DONE WITH OPEN POSE")

            

            var combinedKeyframeDataLocation = resolve(jsonWriteLocation+"/keyframeCompilation.json")
            var normalizedKeyframeLocation = module.exports.getNormalizedDanceDataURL(danceID)
            // processOpenPoseKeyframes
            module.exports.processOpenPoseKeyframes(jsonWriteLocation, combinedKeyframeDataLocation)
            // normalizeKeyframeData
            module.exports.normalizeKeyframeData(combinedKeyframeDataLocation, normalizedKeyframeLocation)
            
            completion(normalizedKeyframeLocation)
        });
    },
    processOpenPoseKeyframes: function(keyframesFolder, danceFileOutputURL){
        // combine all the keyframes into a single JSON file
        /*
            {
                "frames":{
                    "0": [x1,y1,c1,x2,y2,c2,...],
                    "5": [x1,y1,c1,x2,y2,c2,...]
                }
            }
        */

        // 1 get all the files in the directory
        // 2 sort files
        // 3 loop through file data and append to final frame array
        // 4 save final frame array
        
        fs.readdir(keyframesFolder, function(err, filenames) { // 1
            if (err) {
                console.log(err);
                return;
            }
            filenames.sort() // 2

            var finalFrameArray = {}

            filenames.forEach(function(filename) {
                var rawData = fs.readFileSync(keyframesFolder + filename, 'utf-8');
                var frameNum = filename.split("_")[1]

                var keypointData = JSON.parse(rawData)
                var peopleData = keypointData["people"]
                if(peopleData.length > 0){
                    var personKeypoints = peopleData[0]["pose_keypoints_2d"]
                    finalFrameArray[frameNum+""] = personKeypoints
                }
            });

            fs.writeFileSync(danceFileOutputURL, JSON.stringify({"frames":finalFrameArray}))
        });

    },
    normalizeKeyframeData: function(rawDanceFileURL, normalizedDanceURL){ // save to normalizedDanceURL
        // 1 loop through each frame
        // 2 calculate bounding box
        // 3 normalize body part location based on BB
        // 4 save new file

        /*
        {
            "frames":{
                "0":[x1,y1,c1,x2,y2,c2,...],
                "1":[x1,y1,c1,x2,y2,c2,...]
            }
        }
        */

        var rawData = fs.readFileSync(rawDanceFileURL, 'utf-8');
        var danceData = JSON.parse(rawData)
        var frameData = danceData["frames"]

        var normalizedData = {}

        if(frameData != undefined){
            for (var frameNum in frameData) {
                // check if the property/key is defined in the object itself, not in parent
                if (frameData.hasOwnProperty(frameNum)) {           
                    var keypointData = frameData[frameNum] // [x1,y1,c1,x2,y2,c2,...]
                    // calculate bounding box (BB)
                    // Calculate two corner points (top left, bottom right)
                    // Parse array to separate values into separate array
                    for ( i = 0; i < keypointData.length - 1; i += 3) {
                        var xValsArray = new Array();
                        var yValsArray = new Array();
                        xValsArray.push(keypointData[i]);
                        yValsArray.push(keypointData[i + 1]);
                    }

                    var minYVal = Math.min(yValsArray);
                    var minXVal = Math.min(xValsArray);

                    var maxYVal = Math.max(yValsArray);
                    var maxXVal = Math.max(xValsArray);
                    // normalize all x and y with BB (between 0-1)

                    // x_norm = (x - x_min )/ x_width; y_norm = (y - y_min)/y_width
                    var x_width = maxXVal - minXVal;
                    var y_width = maxYVal - minYVal;

                    /* var normalizedXValsArray = xValsArray;
                    var normalizedYValsArray = yValsArray;
                    
                    for (i = 0; i < xValsArray - 1; i++) {
                        normalizedXValsArray[i] = (xValsArray[i] - minXVal) / x_width;
                        normalizedYValsArray[i] = (yValsArray[i] - minYVal) / y_width;
                    }
                    */

                    // save the new array with the same confidence values
                    var normalizedArray = keyPointData;
                    for (i = 0; i < keypointData.length - 1; i += 3) {
                        normalizedArray[i] = (keypointData[i] - minXVal) / x_width;
                        normalizedArray[i+1] = (keypointData[i+1] - minYVal) / y_width;
                    }
                    normalizedData[frameNum] = normalizedArray
                }
            }
            fs.writeFileSync(normalizedDanceURL, JSON.stringify({"frames":normalizedData}))
        }
        return normalizedData;
    },
    compareTwoNormalizedDances: function(tutorialDanceFileURL, normalizedDanceURL){
        /*
            tutorialDanceFileURL
            Tutorial Dances have all frames processed/normalized, and a specific startFrame specified
            
            {
                "frames":{
                    "0":[...],
                    "1":[...],
                    "2":[...]
                },
                "startFrame":10
            }

        */

        
        const BODY_PART_VALID_THRESHOLD = 0.5; // the confidence of the body part has to be at least 50% for it to be considered a valid body part
        const BODY_PART_DISTANCE_CLOSE_THRESHOLD = 0.05; // the body parts have to be within 5% of each other
        const FIRST_FRAME_CONSIDERED_THRESHOLD = 0.5; // 50% of the body parts in the uploaded dance frame has to match with the first frame of the tutorial dance.

        function compareTwoNormalizedFrames(frame1, frame2){
            // frame1 = [x1, y1, c1, x2, y2, c2, ...]
            // frame2 = [x1, y1, c1, x2, y2, c2, ...]

            // return percent of body parts in right place

            var numOfBodyPartsCompared = 0;
            var numOfBodyPartsCorrect = 0;
            for(var i = 0; i < frame1.length; i += 3){
                var f1x = frame1[i]
                var f1y = frame1[i+1]
                var f1c = frame1[i+2]

                var f2x = frame2[i]
                var f2y = frame2[i+1]
                var f2c = frame1[i+2]

                if(f1c > BODY_PART_VALID_THRESHOLD && f2c > BODY_PART_VALID_THRESHOLD){
                    numOfBodyPartsCompared += 1;

                    // test if the two body parts are close
                    var xCompare = Math.abs(f1x - f2x)
                    var yCompare = Math.abs(f1y - f2y)
                    
                    if(xCompare < BODY_PART_DISTANCE_CLOSE_THRESHOLD && yCompare < BODY_PART_DISTANCE_CLOSE_THRESHOLD){
                        numOfBodyPartsCorrect += 1;
                    }
                }
            }

            return numOfBodyPartsCorrect / numOfBodyPartsCompared
        }

        var tutorialDanceDataRaw = fs.readFileSync(tutorialDanceFileURL, 'utf-8')
        var turorialDanceData = JSON.parse(tutorialDanceDataRaw)
        var turorialDanceFrames = turorialDanceData["frames"]
        var tutorialStartFrameNum = tutorialDanceData["startFrame"] == undefined ? tutorialDanceData["startFrame"] : 0
        var tutorialStartFrameData = tutorialDanceFrames[tutorialStartFrameNum]

        var uploadedDanceDataRaw = fs.readFileSync(normalizedDanceURL, 'utf-8')
        var uploadedDanceData = JSON.parse(uploadedDanceDataRaw)
        var uploadedDanceFrames = uploadedDanceData["frames"]
        
        // calculate most likely uploaded start frame
        // then for each likely start frame calculate the dance corectness

        var possibleAnswerArrays = {}

        if(uploadedDanceFrames != undefined){
            for (var frameNum in uploadedDanceFrames) {
                if (uploadedDanceFrames.hasOwnProperty(frameNum)) {
                    var uploadedFrame = uploadedDanceFrames[frameNum]
                    // compare frame with start frame
                    var bodyPartCorrectPercent = compareTwoNormalizedFrames(uploadedFrame, tutorialStartFrameData)
                    if(bodyPartCorrectPercent > FIRST_FRAME_CONSIDERED_THRESHOLD){
                        // this is a candidate frame for the first frame
                        calculateDanceSimilarity(frameNum)
                    }
                }
            }
        }

        function calculateDanceSimilarity(uploadedFirstFrame){
            // create sort for dance
            // Create items array
            var danceFramesArray = Object.keys(uploadedDanceFrames).map(function(key) {
                return [key, uploadedDanceFrames[key]];
            });
            
            // Sort the array based on the second element
            items.sort(function(first, second) {
                return second[0] - first[0];
            });
  
            // calculate the confidence of each frame
            var numberOfFramesCompared = 0;
            var totalComputation = []
            for(var i = 0; i < items.length; i++){
                var frameData = items[i]
                var frameNum = frameData[0]
                var frameKeypoints = frameData[1]

                if(frameNum > uploadedFirstFrame){
                    // valid frame to test
                    var tutorialFrame = tutorialDanceFrames[frameNum]
                    if(tutorialFrame != undefined){
                        // compare the two frames
                        var similarity = compareTwoNormalizedFrames(frameKeypoints, tutorialFrame)
                        totalComputation.push([frameNum, similarity])
                        numberOfFramesCompared += 1
                    }
                }
            }
            // TODO calculate the best totalComputation value
            if(totalComputation.length > 0){
                return totalComputation[0][1]
            }else{
                console.log("No dance similarity")
                return 0;
            }
        }
        

       // returns an array of floats
       // TODO length take into account number of uploaded frames processed
       // min(tutorialVidFrames - startFrame, uploadedVidFrames - uploadedStartFrame)
       // from [0-1] showing how close the input frame i is close to turorial frame i
    },
    processTutorialVideo: function(tutorialName, danceURL, completion){
        module.exports.processUploadedDance(tutorialName, danceURL, function(normalizedKeyframeLocation){
            completion(normalizedKeyframeLocation)
        })
    },
    getNormalizedDanceDataURL:function(danceID){
        var processedDancesDir = resolve('processedDances/'+danceID);

        if (!fs.existsSync(processedDancesDir)){
            fs.mkdirSync(processedDancesDir);
        }
        return resolve(processedDancesDir+"/"+danceID+".json");
    }
}