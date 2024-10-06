import streamlit as st
import cv2
import time
from model import prediction_model
from components import progress_bar,update_video
from styles import page_with_webcam_video

st.set_page_config(page_title="Sign Language", layout="wide")

hide_streamlit_style = """
                <style>
                div[data-testid="stToolbar"] {
                visibility: hidden;
                height: 0%;
                position: fixed;
                }
                div[data-testid="stDecoration"] {
                visibility: hidden;
                height: 0%;
                position: fixed;
                }
                div[data-testid="stStatusWidget"] {
                visibility: hidden;
                height: 0%;
                position: fixed;
                }
                #MainMenu {
                visibility: hidden;
                height: 0%;
                }
                header {
                visibility: hidden;
                height: 0%;
                }
                footer {
                visibility: hidden;
                height: 0%;
                }
                </style>
                """
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

cv2.destroyAllWindows()
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

st.markdown(page_with_webcam_video(), unsafe_allow_html=True)

if "alphabet" not in st.session_state:
    st.session_state["alphabet"] = 0

ALPHABET_LIST = {
    0:"A",
    1:"B",
    2:"C",
    3:"D",
    4:"E",
    5:"F",
    6:"G",
    7:"H",
    8:"I",
    9:"J",
    10:"K",
    11:"L",
    12:"M",
    13:"N",
    14:"O",
    15:"P",
    16:"R",
    17:"S",
    18:"T",
    19:"U",
    20:"V",
    21:"W",
    22:"X",
    23:"Y",
}

NUM_ALPHABETS = len(ALPHABET_LIST)

# Element struction
col1, col2 = st.columns([0.5, 0.5])
with col1:
    video_placeholder = st.empty()  # to display video
    video_placeholder.markdown(
        update_video(ALPHABET_LIST[st.session_state["alphabet"]]),
        unsafe_allow_html=True,
    )
with col2:
    webcam_placeholder = st.empty()  # to display webcam

matched_placeholder = st.empty()

# creating the progress bar
prob = 0
progress_bar_placeholder = st.empty()



while True:

    if cap is not None or cap.isOpened():
        ret, frame = cap.read()
    else:
        st.write("loading")

    if ret:

        charachter = ALPHABET_LIST[st.session_state["alphabet"]]
        frame, prob = prediction_model(frame,charachter)

        webcam_placeholder.image(frame, channels="BGR")

        progress_bar_placeholder.markdown(
            progress_bar(prob),
            unsafe_allow_html=True,
        )

        if prob == 100:
            st.balloons()

            video_placeholder.empty()
            # WORD_LIST[current_word_index] # Aroosh
            try:
              
                print("added_letter")
                pass
            except Exception as e:
                print(e)            


            print(st.session_state["alphabet"])

            st.session_state["alphabet"] = ( st.session_state["alphabet"] + 1 ) % NUM_ALPHABETS

            time.sleep(2)

            video_placeholder.markdown(
                update_video(ALPHABET_LIST[st.session_state["alphabet"]]),
                unsafe_allow_html=True,
            )


cap.release()
cv2.destroyAllWindows()


