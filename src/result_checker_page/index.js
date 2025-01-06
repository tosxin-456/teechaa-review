import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import QuizData from "../../utils/questions";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const { result } = state || {};
    console.log(result);

    const attemptedSubjects = QuizData.filter((subject) =>
        Object.keys(result?.answers || {}).includes(subject.subject)
    );

    const [selectedSubject, setSelectedSubject] = useState(attemptedSubjects[0]?.subject || "");

    const currentSubjectData = useMemo(() => {
        return attemptedSubjects.find((subject) => subject.subject === selectedSubject);
    }, [attemptedSubjects, selectedSubject]);

    const currentQuestion = useMemo(() => {
        return currentSubjectData?.questions[currentQuestionIndex];
    }, [currentSubjectData, currentQuestionIndex]);

    const totalQuestions = currentSubjectData?.questions.length || 0;

    const studentAnswerForSubject = useMemo(() => {
        return result?.answers[selectedSubject] || [];
    }, [result, selectedSubject]);


    const correctAnswersCount = studentAnswerForSubject.filter((answer, index) => {
        return answer === currentSubjectData?.questions[index]?.correctOption;
    }).length;

    const scorePercentage = Math.min((correctAnswersCount / totalQuestions) * 100, 50);
    console.log(scorePercentage);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
        setCurrentQuestionIndex(0); // Reset to the first question of the new subject
    };

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

    const attemptedCount = studentAnswerForSubject.filter((ans) => ans !== null).length;

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            <nav className="bg-[#2148C0] shadow-md px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Exam Results</h1>
                <div className="text-white">
                    Subjects Taken: <span className="font-semibold">{attemptedSubjects.length}</span>
                </div>
            </nav>

            <div className="bg-white shadow py-3 px-4 sm:px-6">
                <div className="text-base sm:text-lg flex flex-wrap items-center gap-2">
                    <span className="font-bold text-gray-700">Select Subject: </span>
                    {attemptedSubjects.map((subject) => (
                        <button
                            key={subject.subject}
                            onClick={() => handleSubjectChange(subject.subject)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedSubject === subject.subject
                                    ? "bg-[#2148C0] text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {subject.subject}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow flex flex-col-reverse sm:flex-row">
                <main className="flex-1 p-4 sm:p-6 bg-white shadow-lg rounded-lg mx-4 sm:mx-6">
                    <div className="text-center mb-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                        >
                            <FaArrowLeft className="text-xl" />
                            Back
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-[#2148C0]">
                            {selectedSubject} - Question {currentQuestionIndex + 1} / {totalQuestions}
                        </h2>
                        <button
                            onClick={toggleSidebar}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center transition"
                        >
                            {isSidebarOpen ? "Hide" : "Show"} Sidebar
                        </button>
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
                        <h3 className="text-base sm:text-lg font-semibold mb-4">
                            {currentQuestion?.question}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentQuestion?.options.map((option, index) => {
                                const isCorrect = currentQuestion.correctOption === index;
                                const isSelected = studentAnswerForSubject[currentQuestionIndex] === index;
                                return (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg shadow-md flex items-center justify-between border ${isCorrect
                                                ? "border-green-500 bg-green-50"
                                                : isSelected
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                    >
                                        <span>
                                            {String.fromCharCode(65 + index)}. {option}
                                        </span>
                                        {isCorrect && <FaCheckCircle className="text-green-500 text-xl" />}
                                        {isSelected && !isCorrect && (
                                            <FaTimesCircle className="text-red-500 text-xl" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {studentAnswerForSubject[currentQuestionIndex] === null ||
                            studentAnswerForSubject[currentQuestionIndex] === undefined ? (
                            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                                <h4 className="font-semibold text-yellow-700">Unanswered Question</h4>
                                <p>You did not select an answer for this question.</p>
                            </div>
                        ) : null}

                        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                            <h4 className="font-semibold text-[#2148C0]">Explanation:</h4>
                            <p>{currentQuestion?.explanation}</p>
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

                    <div className="mt-6">
                        <h3 className="font-bold text-xl">Your Score: {Math.round(scorePercentage)}%</h3>
                    </div>
                </main>

                {isSidebarOpen && (
                    <aside
                        ref={sidebarRef}
                        className="absolute sm:relative w-full sm:w-64 bg-white shadow-lg p-4 border-l z-30"
                    >
                        <h3 className="text-lg font-bold mb-4">Attempted Questions</h3>
                        <div className="grid grid-cols-8 sm:grid-cols-4 gap-2">
                            {currentSubjectData?.questions.map((_, index) => {
                                const isCorrect =
                                    studentAnswerForSubject[index] ===
                                    currentSubjectData.questions[index].correctOption;
                                const isAttempted = studentAnswerForSubject[index] !== null;
                                const isSelected = currentQuestionIndex === index;

                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center ${isSelected ? " border-blue-500" : ""
                                            }`}
                                    >
                                        <button
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold ${isCorrect
                                                    ? "bg-green-200 text-green-800"
                                                    : isAttempted
                                                        ? "bg-red-200 text-red-900"
                                                        : "bg-gray-200 text-gray-700"
                                                } ${isSelected ? "bg-blue-100" : ""
                                                } transition-all`}
                                        >
                                            <span>{index + 1}</span>
                                            <div className="ml-2">
                                                {isCorrect ? (
                                                    <FaCheckCircle className="text-green-600 text-lg" />
                                                ) : isAttempted ? (
                                                    <FaTimesCircle className="text-red-600 text-lg" />
                                                ) : (
                                                    <p className="text-gray-600">-</p>
                                                )}
                                            </div>
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