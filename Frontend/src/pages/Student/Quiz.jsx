import axios from "axios";
import React, { useEffect, useState } from "react";
import { quizRoute } from "../../APIRoutes";
import { useNavigate, useParams } from "react-router-dom";

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${quizRoute}/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setQuizData(response.data.course.quiz);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = {
      ...quizData[currentQuestion],
      user_answer: option,
    };
    setUserAnswers(updatedAnswers);
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
    const submissionData = {
      course: id,
      student: user._id,
      marks,
      questions: userAnswers,
    };
    console.log(submissionData);
    // Submit logic here, if needed.
  };

  return (
    <>
      {loading ? (
        <p className="text-center text-xl font-bold text-sky-500">
          Please wait...
        </p>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
            {quizData.length > 0 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {`Q${currentQuestion + 1}. ${
                      quizData[currentQuestion].question
                    }`}
                  </h2>
                </div>

                <div className="space-y-4">
                  {Object.keys(quizData[currentQuestion].options).map((key) => {
                    const isCorrect = quizData[currentQuestion].answer === key;
                    return (
                      <div
                        key={key}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors 
                                                ${
                                                  selectedOption === key
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 hover:bg-gray-300"
                                                } 
                                                ${
                                                  user.role === "Teacher" &&
                                                  isCorrect
                                                    ? "border-green-500 bg-green-200"
                                                    : ""
                                                }`}
                        onClick={() => handleOptionClick(key)}
                      >
                        {quizData[currentQuestion].options[key]}
                      </div>
                    );
                  })}
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
                    user.role === "Teacher" ? (
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={() => navigate(`/home/course-details/${id}`)}
                      >
                        Go to Courses
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={handleSubmit}
                      >
                        Submit
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;
