import pickle
import mediapipe as mp
import cv2
import numpy as np

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

model_dic = {  # missing Q Z
    "A": 1,
    "B": 1,
    "C": 3,
    "D": 1,
    "E": 1,
    "F": 1,
    "G": 3,
    "H": 3,
    "I": 3,
    "J": 3,
    "K": 1,
    "L": 1,
    "M": 2,
    "N": 3,
    "O": 3,
    "P": 2,
    "R": 2,
    "S": 1,
    "T": 2,
    "U": 3,
    "V": 3,
    "W": 3,
    "X": 3,
    "Y": 2,
}

action_dirs = [
    ["A", "B", "C", "D", "E", "F", "K", "L", "S"],
    ["G", "I", "M", "P", "R", "T", "V", "Y"],
    ["A", "C", "G", "H", "I", "J", "N", "O", "U", "V", "W", "X"],
]

models = [
    pickle.load(open("./asl_detection_models/model1.p", "rb"))["model"],
    pickle.load(open("./asl_detection_models/model2.p", "rb"))["model"],
    pickle.load(open("./asl_detection_models/model3.p", "rb"))["model"],
]

thresholds = [0.75, 0.7, 0.7]

hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)


def prediction_model(frame, char):
    data_aux = []
    x_list = []
    y_list = []

    to_guess = char

    frameFlipped = cv2.flip(frame, 1)

    if frame is not None:

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frameFlipped_rgb = cv2.cvtColor(frameFlipped, cv2.COLOR_BGR2RGB)
        prob = 0

        results = hands.process(frame_rgb)
        resultsFlipped = hands.process(frameFlipped_rgb)

        if resultsFlipped.multi_hand_landmarks and results.multi_hand_landmarks:
            for hand_landmarks in resultsFlipped.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frameFlipped,  # image to draw
                    hand_landmarks,  # model output
                    mp_hands.HAND_CONNECTIONS,  # hand connections
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style(),
                )

            for hand_landmarks in [results.multi_hand_landmarks[0]]:
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y

                    x_list.append(x)
                    y_list.append(y)

                min_x = min(x_list)
                min_y = min(y_list)

                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y

                    data_aux.append(x - min_x)
                    data_aux.append(y - min_y)

            model_num = model_dic[to_guess]

            model = models[model_num - 1]
            threshold = thresholds[model_num - 1]
            action_dir = action_dirs[model_num - 1]

            prediction = model.predict([np.asarray(data_aux)])
            prediction_prob = model.predict_proba([np.asarray(data_aux)])

            prob = np.max(prediction_prob)

            if prob > threshold:
                if prediction == to_guess:
                    prob = 100
            else:
                relative_index = action_dir.index(to_guess)
                prob = (int(prediction_prob[0][relative_index] * 100) // 10) * 10

        frameFlipped = cv2.resize(
            frameFlipped, (450, 350), fx=0.1, fy=0.1, interpolation=cv2.INTER_CUBIC
        )
    return frameFlipped, prob


