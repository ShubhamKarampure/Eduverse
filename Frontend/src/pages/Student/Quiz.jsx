import axios from "axios";
import React, { useEffect, useState } from "react";
import { quizRoute, submitQuiz } from "../../APIRoutes/index.js";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { host } from "../../APIRoutes/index.js";

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${quizRoute}/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setQuizData(response.data.course.quiz);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuiz();
  }, []);

  console.log(quizData);

  const handleOptionClick = (option) => {
   if(user.role==='Teacher'){
    return
   }
    setSelectedOption(option);

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = {
      ...quizData[currentQuestion],
      user_answer: option,
    };
    setUserAnswers(updatedAnswers);
    console.log(userAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const calculateMarks = () => {
    let marks = 0;
    userAnswers.forEach((answer, index) => {
      if (answer.user_answer === quizData[index].answer) {
        marks += 2; // Increment marks for correct answers
      }
    });
    return marks;
  };

  const handleSubmit = async () => {
    const marks = calculateMarks();
    setScore(marks); // Update score state
    const submissionData = {
      course: `${id}`,
      student: user._id,
      marks,
      questions: userAnswers,
    };
    console.log(submissionData);
    try {
      const response = await axios.post(`${submitQuiz}`, submissionData, {
        withCredentials: true,
      });
      if (response.data.success) {
        setFeedback(response.data.evaluation.evaluation);
        setShowReview(true); // Show the review after submission
        toast({
          title: "Success",
          description: "Quiz submitted successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: "Please try again",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0); // Reset to the first question
    setUserAnswers([]); // Clear user's answers
    setSelectedOption(null); // Clear selected option
    setShowReview(false); // Hide the review and show the quiz again
    setFeedback([]); // Clear feedback
    setScore(0); // Reset score
  };

  const navigate = useNavigate();

  return (
    <>
      {loading ? (
        <p className="text-center text-xl font-bold text-sky-500">
          Please wait...
        </p>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-[80%] bg-white rounded-lg shadow-lg p-6">
            {showReview ? (
              <>
                {/* Quiz Review Section */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Quiz Review
                </h2>

                {/* Display the score */}
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <h3 className="text-xl font-semibold">
                    Your Score: {score}/{quizData.length * 2}
                  </h3>
                </div>

                {quizData.map((question, index, answer) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold">
                      Q{index + 1}. {question.question}
                    </h3>
                    <p className="mt-2">
                      <strong>Your Answer:</strong>{" "}
                      {question.options[userAnswers[index]?.user_answer]}
                    </p>
                    <p>
                      <strong>Correct Answer:</strong>{" "}
                      {question.options[question.answer]}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Feedback:</strong> {feedback[index]?.feedback}
                    </p>
                  </div>
                ))}

                {/* Retake Quiz Button */}
                <div className="flex justify-center mt-8">
                  <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={retakeQuiz}
                  >
                    Retake Quiz
                  </button>
                </div>
              </>
            ) : (
              quizData.length > 0 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      {`Q${currentQuestion + 1}. ${
                        quizData[currentQuestion].question
                      }`}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {Object.keys(quizData[currentQuestion].options).map(
                      (key) => (
                        <div
                          key={key}
                          className={`p-4 border rounded-lg transition-colors  
                            ${
                              user.role==='Student'?"cursor-pointer":""
                            }${
                            user.role === "Teacher" &&
                            quizData[currentQuestion].answer === key
                              ? "bg-green-400 text-black"
                              : ""
                          } ${
                            selectedOption === key
                              ? "bg-blue-500 text-white"
                              :  `bg-gray-200 ${user.role==='Teacher'?"":"hover:bg-gray-300 cursor-default"}`
                          } `}
                          onClick={() => handleOptionClick(key)}
                        >
                          {console.log(key)}
                          {quizData[currentQuestion].options[key]}
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 ${
                        currentQuestion === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </button>

                    {currentQuestion === quizData.length - 1 ? (
                      user.role === "Student" ? (
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          onClick={() => {
                            navigate(`/home/course-details/${id}`);
                          }}
                        >
                          Return to course
                        </button>
                      )
                    ) : (
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={handleNext}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;
