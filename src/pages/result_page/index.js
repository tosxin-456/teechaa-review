import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("All");
    const navigate = useNavigate();
    const { state } = useLocation();
    const { result } = state || [];
    console.log(result)
    const subjects = [...new Set(result.map((r) => r.question.subject))];
    const filteredResults =
        selectedSubject === "All"
            ? result
            : result.filter((r) => r.question.subject === selectedSubject);

    const totalQuestions = filteredResults.length;
    const currentQuestion = filteredResults[currentQuestionIndex]?.question || {};
    const selectedOption = filteredResults[currentQuestionIndex]?.selected_option;
    const isCorrect = filteredResults[currentQuestionIndex]?.is_correct === 1;

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
        setCurrentQuestionIndex(0);
    };


    const goBack = () => {
        navigate('/result-checker');
    };

    useEffect(() => {
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }, [currentQuestionIndex, selectedSubject]);
    console.log(selectedOption)
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            <nav className="bg-[#2148C0] shadow-md px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Exam Results</h1>
                <div className="text-white">Total Questions: {totalQuestions}</div>
            </nav>

            <div className="p-4 sm:p-6 bg-white shadow-md">
                <div className="flex gap-4 overflow-x-auto">
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${selectedSubject === "All" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => handleSubjectChange("All")}
                    >
                        All
                    </button>
                    {subjects.map((subject, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-lg font-semibold ${selectedSubject === subject ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => handleSubjectChange(subject)}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center mt-6 ml-3 mb-6 ">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
            </div>
            <div className="flex-grow flex flex-col-reverse sm:flex-row">
                <main className="flex-1 p-4 sm:p-6 bg-white shadow-lg rounded-lg mx-4 sm:mx-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-[#2148C0]">
                            Question {currentQuestionIndex + 1} / {totalQuestions}
                        </h2>
                        <button
                            onClick={toggleSidebar}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center transition"
                        >
                            {isSidebarOpen ? "Hide" : "Show"} Sidebar
                        </button>
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
                        {/* Question */}
                        <h3 className="text-base sm:text-lg font-semibold mb-4">
                            {currentQuestion.question}
                        </h3>

                        {/* Answer Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {["A", "B", "C", "D"].map((option, index) => {
                                const optionValue = currentQuestion[`option_${option.toLowerCase()}`];
                                const isOptionCorrect = index + 1 === parseInt(currentQuestion.correctAnswer);
                                const isOptionSelected = selectedOption === option;

                                return (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg shadow-md flex items-center justify-between border ${isOptionCorrect
                                                ? "border-green-500 bg-green-50" // Correct answer
                                                : isOptionSelected
                                                    ? "border-red-500 bg-red-50" // Incorrect answer
                                                    : "border-gray-300" // Neutral
                                            }`}
                                    >
                                        <span>{option}. {optionValue}</span>
                                        {isOptionCorrect && <FaCheckCircle className="text-green-500 text-xl" />}
                                        {isOptionSelected && !isOptionCorrect && (
                                            <FaTimesCircle className="text-red-500 text-xl" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Unanswered Question Notice */}
                        {selectedOption === undefined || selectedOption === null || selectedOption==="" ? (
                            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                                <h4 className="font-semibold text-yellow-600">
                                    Question Not Answered
                                </h4>
                                <p>Please review this question and its explanation carefully.</p>
                            </div>
                        ) : null}

                        {/* Explanation */}
                        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                            <h4 className="font-semibold text-[#2148C0]">Explanation:</h4>
                            <p>{currentQuestion.explanation}</p>
                        </div>
                    </div>


                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleBack}
                            className={`px-4 py-2 rounded-lg ${currentQuestionIndex > 0
                                ? "bg-[#2148C0] text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500"
                                }`}
                            disabled={currentQuestionIndex === 0}
                        >
                            <FaArrowLeft className="inline mr-2" /> Back
                        </button>
                        <button
                            onClick={handleNext}
                            className={`px-4 py-2 rounded-lg ${currentQuestionIndex < totalQuestions - 1
                                ? "bg-[#2148C0] text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500"
                                }`}
                            disabled={currentQuestionIndex === totalQuestions - 1}
                        >
                            Next <FaArrowRight className="inline ml-2" />
                        </button>
                    </div>
                </main>

                {isSidebarOpen && (
                    <aside
                        className="absolute sm:relative w-full sm:w-64 bg-white shadow-lg p-4 border-l z-30"
                    >
                        <h3 className="text-lg font-bold mb-4">Attempted Questions</h3>
                        <div className="grid grid-cols-8 sm:grid-cols-4 gap-2">
                            {result.map((_, index) => {
                                const isAttempted = result[index]?.selected_option !== "";
                                const isSelected = currentQuestionIndex === index;
                                const isCorrectAttempt = result[index]?.is_correct === 1;
                                const isIncorrectOption = !isCorrectAttempt && isAttempted;

                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center ${isSelected ? " border-blue-500" : ""}`}
                                    >
                                        <button
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold ${isCorrectAttempt
                                                ? "bg-green-200 text-green-800"
                                                : isIncorrectOption
                                                    ? "bg-red-50 border-green-500"
                                                    : "bg-green-50 text-gray-700"
                                                } ${isSelected ? "bg-blue-200" : ""} transition-all`}
                                        >
                                            <span>{index + 1}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default ResultPage;
