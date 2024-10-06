import math

def page_setup():
    return """
    <style>

         
        /* deccrease upper padding */
        .st-emotion-cache-gh2jqd {
            width: 100%;
            padding: 0rem 1rem 10rem;
            max-width: 46rem;
        }

        /* hide header */
        header {
        visibility: hidden;
        height: 0%;
        }

      </style>
    """

def hide_navbar():
    return """
    <style>
        .st-emotion-cache-j7qwjs {
            display:none;
        }
        </style>
    """

def unhide_nav_bar() :
    return """
    <style>
        .st-emotion-cache-j7qwjs {
            display:block;
        }
        </style>
    """

def page_with_webcam_video() :
    return """
        <style>

        img {
        border-radius: 1rem;
        height:450px;
        width:350px;
        }

        .video-container {
            position: relative;
            width: 100%;
            display: flex; /* Use flexbox */
            justify-content: center; /* Center horizontally */
            align-items: center; /* Center vertically */
            padding: 2rem;
        }

        .video-wrapper {
        background-color: white;
        display: inline-block;
        width: 350px;
        height: 450px;
        overflow: hidden;
        position: relative;
        border-radius: 1rem; 
        align-content : center;
        transform: scaleX(-1);
        }

        .video-wrapper video {
        width: 100%;
        z-index: 1; /* Ensure video is behind text */
        }


        .text-overlay {
            position: absolute; 
            left: 6%;
            bottom: -7%;;
            color: #683aff;
            font-size:150px;
            z-index: 2;
            transform:scaleX(-1);
            text-align: center; /* center the text horizontally */
        }

        .video-wrapperquiz {
        background-color: white;
        width: 250px;
        height: 250px;
        overflow: hidden;
        position: relative;
        border-radius: 1rem;
        display: flex; /* Use flexbox */
        justify-content: center; /* Center horizontally */
        align-items: center; /* Center vertically */
        }

        .letterToFind {
        font-size: 190px;
        color: #ffe090;
        max-height: 20rem;
        text-align : center;
        }

        .progress-text {
        margin-top: 10px;
        text-align: center;
        }

        .progress-container {
        width: 100%;
        height: 2rem; 
        background-color: #683aff;
        border-radius: 5rem;
        position: relative;
        }

        .progress-bar {
        background-color: #ffe090; 
        height: 100%;
        border-radius: 5rem;
        width: 0;
        transition: width 0.3s ease-in-out;
        text-align: center;
        color: #683aff;
        font-size: 20px;
        font-weight: bold;
        line-height: 2rem;
        box-shadow: 10px 0 5px rgba(0, 0, 0, 0.2); /* Adjust values as needed */
        }

        /* quiz question */
        .question-text {
        font-family: 'Arial', sans-serif;
        font-size: 18px;
        color: #ffff;
        text-align: center;
        margin-bottom: 20px;
        }

        /* button */
        .st-emotion-cache-11to1yi {
        width: 100%;
        }   

        .st-emotion-cache-1gv5c5a p {
            word-break: break-word;
            margin-bottom: 0px;
            font-size: 25px;
        }
    
        </style>
    """

def profile():
    return """
<style>
*{
margin: 0px;
padding: 0px;
box-sizing: border-box;
font-family: 'Manrope', sans-serif;
list-style-type: none;
text-decoration: none;
}

.my_courses_details{
  padding: 50px;
  border-right:2px solid #f0f0f0;
}
.welcome-content{
  color: #ffe090;
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.9px;
}
.my_course_title{
  padding-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.my_course_title h1{
  color: #ffffff;
  font-size: 30px;
  font-weight: 700;
  line-height: normal;
}

</style>

"""

def letterprogress():
    return """
<style>
.my_course_details{
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 400px);
  gap: 30px;
  padding-top: 30px;
  stroke
}
.my_course_details .course-container{
  width: 350px;
  height: 200px;
  border-radius: 20px;
  padding: 15px;
}
.course-container.letter{
  background-color: #369fff;
  box-shadow: 0px 1px 30px 0px rgba(54, 159, 255, 0.4);
  background-image: url('https://freepngimg.com/save/130272-a-letter-download-hq/512x512');
  background-position: 90%;
  background-repeat: no-repeat;
}
.course-container.words{
  background-color: #ff993a;
  box-shadow: 0px 1px 30px 0px rgba(255, 153, 58, 0.4);
  background-image: url('images/train.png');
  background-position: 90%;
  background-repeat: no-repeat;
}

.my_course_details .circle{
    stroke-dashoffset:"300";
}

.circular-progress-container {
  position: relative;
  width: 52px;
  height: 52px;
}

.circular-progress-container .circle{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.circular-progress-container .circle circle{
  cx: 26px;
  cy: 26px;
  r: 24px;
}

.circular-progress-container .progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #ffffff;
}
</style>
"""
