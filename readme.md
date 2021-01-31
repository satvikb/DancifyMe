# DancifyMe

## Inspiration
Dancing is a fun way to learn new things and stay active during the pandemic, but those YouTube and TikTok videos make dancing look easy. You follow along, but it's quite hard to get everything right. With Dancify, you don't need an expert choreographer to tell you how to improve. We take user-uploaded videos of dances and give you the necessary information to keep improving!

## What it does
Dancify is a web application that allows users to select a dance then upload their dance video to the website. Dancify analyzes the user uploaded video and compares them to the reference dance video. Then, it generates an overall accuracy score and tells you at which points you can improve the most. 

## How we built it
To analyze the videos, we used OpenPose, an open-source human-pose estimation program. Since OpenPose automatically detects a person in a video and gives the pixel location of up to 25 body parts, we could get frame-by-frame information that allowed us to analyze the reference video, analyze the user uploads, and compare the two to generate scores and create certain suggestions.
To create the website, we used HTML, CSS, and JavaScript to build the user interface. We used Node.js and Ajax to handle user file uploads and download user uploads to the server where we run OpenPose.

## Challenges we ran into
Since OpenPose works with absolute pixel values, we had to normalize the reference videos. Furthermore, since user uploaded file videos are not guaranteed to be the same length as the reference video, we have to find potential start frames of the user uploaded video and make comparisons from that frame.

Also, the back end required multiple iterations to get right. We had to learn OpenPose's outputs and adapt our code to extract information. We needed to update how it interacted with the files as we came up with better feedback to provide to the users.

Lastly, the front end required a lot of work, especially as we experimented with features we have not used before. Many of the front-end challenges were positioning errors such as where and how to our carousel of dances. Those challenges had an easy fix. On the other hand, functionality error in the front-end were a bit more difficult. “Click” interactions in particular gave us a hard time, but we solved the issue event listeners.
 

## Accomplishments that we're proud of
- Creating a responsive website
- Making the UX/UI look retro themed and appealing
- Integrating OpenPose API for the first time
- Coming up with intuitive metrics to help people improve their dancing
- Developing a pipeline for analyzing the videos and getting the feedback to the user
- Connecting the back-end functionality to the front-end interface

## What we learned
We learned how to use OpenPose and compare the given outputs with each other by coming up with an algorithm. We also learned how to query the data and send the data to the front-end. Front-end developers for this project learned how to implement a video background for a website as well as implementing a carousel for different dance option. In addition, we learned how to make a form that opens file explorer and allows users to select their pre-recorded dance. 

## What's next for Dancify
For Dancify, we would want to implement automatic recording of user's dance videos, which would make the website easier to use. Having a page that plays the reference video and the user’s dance side by side would make Dancify a more interactive experience. We also want to incorporate a difficult level for each dance. This way, users can select their preferred difficulty level to practice. Afterwards, implementing a scoreboard system and gamifying the concept would help increase the competitive nature. Also, increasing the selection of dances and providing recommendations on specific moves to take to improve one's dance will be good.
