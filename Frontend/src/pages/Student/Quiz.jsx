import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { quizRoute } from '../../APIRoutes';

const Quiz = () => {
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${quizRoute}/67010a1224b7e62f0abab638`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setQuizData(response.data.course.quiz); // Set the quiz data from the response
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchQuiz();
    }, []);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null); // Reset the selected option for the next question
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedOption(null); // Reset the selected option for the previous question
        }
    };

    const handleSubmit = () => {
        alert('Quiz Submitted!');
    };

    return (
        <>
            {loading ? (
                <p className="text-center text-xl font-bold text-sky-500">Please wait...</p>
            ) : (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                        {quizData.length > 0 && (
                            <>
                                {/* Question */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        {`Q${currentQuestion + 1}. ${quizData[currentQuestion].question}`}
                                    </h2>
                                </div>

                                {/* Options */}
                                <div className="space-y-4">
                                    {Object.keys(quizData[currentQuestion].options).map((key) => (
                                        <div
                                            key={key}
                                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedOption === key
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            onClick={() => handleOptionClick(key)}
                                        >
                                            {quizData[currentQuestion].options[key]}
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="mt-6 flex justify-between">
                                    {/* Previous Button */}
                                    <button
                                        className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        onClick={handlePrevious}
                                        disabled={currentQuestion === 0}
                                    >
                                        Previous
                                    </button>

                                    {/* Next or Submit Button */}
                                    {currentQuestion === quizData.length - 1 ? (
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </button>
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

