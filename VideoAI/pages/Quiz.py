import streamlit as st
import random
import time
from styles import page_setup, page_with_webcam_video
from urls import video_urls

# Initialize session state
if "page" not in st.session_state:
    st.session_state["page"] = "test"

st.markdown(page_setup(), unsafe_allow_html=True)
st.markdown(page_with_webcam_video(), unsafe_allow_html=True)

video_placeholder = st.empty()

question_placehoder = st.empty()
col1, col2 = st.columns([0.5, 0.5], gap="medium")


def update_video(character):
    return f"""
        <div class="video-container">
        <div class="video-wrapperquiz">
        <video width="300" height="250" autoplay controlsList="nodownload" loop style="transform: scaleX(-1);">
            <source src="{video_urls[character]}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        </div>
        </div>  
        """

def question():

    if "correct_option" not in st.session_state:
        st.session_state["correct_option"] = None

    if "options" not in st.session_state:
        st.session_state["options"] = None

    if st.session_state["correct_option"] is not None:
        video_placeholder.markdown(
            update_video(st.session_state["correct_option"]), unsafe_allow_html=True
        )

    if st.session_state["correct_option"] is None:
        st.session_state["correct_option"] = random.choice(list(video_urls.keys()))
        video_placeholder.markdown(
            update_video(st.session_state["correct_option"]), unsafe_allow_html=True
        )

        correct_option = st.session_state["correct_option"]
        remaining_chars = [char for char in video_urls.keys() if char != correct_option]
        incorrect_options = random.sample(remaining_chars, 3)
        if st.session_state["options"] is None:
            options = [correct_option] + incorrect_options
            random.shuffle(options)
            st.session_state["options"] = options

    question_placehoder.markdown(
        '<div style="display: flex; justify-content: center;padding-bottom:2rem;"><div style="background-color: #683aff; padding: 10px; border-radius: 15px; width: fit-content;"><p style="margin: 0;">Select the letter corresponding to the sign shown in the video.</p></div></div>',
        unsafe_allow_html=True,
    )
    option_buttons = {}

    # Create buttons in col1 for indices 0 and 1
    with col1:
        for idx, option in enumerate(st.session_state["options"][:2]):
            option_buttons[option] = st.button(f"{option}")

    # Create buttons in col2 for indices 2 and 3
    with col2:
        for idx, option in enumerate(st.session_state["options"][2:], start=2):
            option_buttons[option] = st.button(f"{option}")

        # Check the selected option
    for option, button in option_buttons.items():
        if button:
            if option == st.session_state["correct_option"]:
                st.success(
                    f"Perfect! It's letter {st.session_state['correct_option']}!"
                )
                st.balloons()
                st.session_state["correct_option"] = None
                st.session_state["options"] = None
                video_placeholder.empty()
                time.sleep(2)
                st.rerun()
            else:
                st.error("Sadly, that's not true. Try Again.")


question()

if st.button("GO BACK"):
    st.write('<meta http-equiv="refresh" content="0; url=https://your-specific-url.com">', unsafe_allow_html=True)