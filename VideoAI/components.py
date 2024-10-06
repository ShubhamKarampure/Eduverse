import streamlit as st
from urls import video_urls


def progress_bar(prog):
    if(prog > 0):
        return f"""
            <div class="progress-container">
                <div class="progress-bar" style="width: {prog}%;">{prog}%</div>
            </div>
            """
    else:
        return f"""
            <div class="progress-container">
                <div class="progress-bar" style="width: {prog}%;"></div>
            </div>
            """


def update_video(charachter):
    return f"""
        <div class="video-wrapper">
        <div class="text-overlay">
            {charachter}
        </div>
        <video width="350" height="290" autoplay loop autoplay muted style="transform: scale(1.75);">
            <source src="{video_urls[charachter]}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        </div> 
        """
    
