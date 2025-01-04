import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosAlarm } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

const ExamPage = () => {
    const { state } = useLocation();
    const { selectedQuizData, timeLeft: initialTimeLeft, mode } = state || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft || 300);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();
    const [selectedSubject, setSelectedSubject] = useState(selectedQuizData?.[0]?.subject);

    const currentSubjectData = selectedQuizData?.find(
        (subject) => subject.subject === selectedSubject
    );
    const totalQuestions = currentSubjectData?.questions?.length || 0;

    useEffect(() => {
        if (mode === "exam" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [mode, timeLeft]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? `0${minutes}` : minutes}:${secs < 10 ? `0${secs}` : secs}`;
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

    const handleExit = () => {
        setShowConfirmModal(true);
    };

    const confirmExit = () => {
        setShowConfirmModal(false);
        navigate(-1);
    };

    const cancelExit = () => {
        setShowConfirmModal(false);
    };

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
        setCurrentQuestionIndex(0);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleOptionSelect = (questionIndex, optionIndex) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: optionIndex,
        }));
    };

    const handleSubmit = () => {
        const results = currentSubjectData.questions.map((question, index) => ({
            question: question.question,
            selectedOption: selectedAnswers[index],
            correctOption: question.correctOption,
            isCorrect: selectedAnswers[index] === question.correctOption,
        }));

        console.log("Exam Results:", results);
        navigate("/results", { state: { results, selectedSubject } });
    };

    // Use MathJax to render the questions when the question changes
    useEffect(() => {
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }, [currentQuestionIndex, currentSubjectData]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            <nav className="bg-[#2148C0] shadow-md px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Exam</h1>
            </nav>

            <div className="bg-white shadow py-3 px-4 sm:px-6">
                <div className="text-base sm:text-lg flex flex-wrap items-center gap-2">
                    <span className="font-bold text-gray-700">Select Subject: </span>
                    {selectedQuizData.map((subject) => (
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
                    <div className="text-center justify-between flex mb-6">
                        <button
                            onClick={handleExit}
                            className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                        >
                            <FaArrowLeft className="text-xl" />
                            Back
                        </button>
                        <button
                            onClick={toggleSidebar}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center transition"
                        >
                            {isSidebarOpen ? "Hide" : "Show"} Sidebar
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-[#2148C0]">
                            {currentSubjectData?.topic} - Question {currentQuestionIndex + 1} / {totalQuestions}
                        </h2>
                        {mode === "exam" && (
                            <div className="text-gray-700 w-[100px] flex items-center font-semibold">
                                <IoIosAlarm className="text-3xl text-[#2148C0] animate-swing" />
                                <span className="ml-2 text-xl">{formatTime(timeLeft)}</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md overflow-y-auto ">
                        <h3
                            className="text-base sm:text-lg font-semibold mb-4"
                            dangerouslySetInnerHTML={{
                                __html: currentSubjectData?.questions[currentQuestionIndex]?.question,
                            }}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentSubjectData?.questions[currentQuestionIndex]?.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg shadow-md border border-gray-300 cursor-pointer ${selectedAnswers[currentQuestionIndex] === index
                                            ? "bg-blue-100 border-blue-500"
                                            : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => handleOptionSelect(currentQuestionIndex, index)}
                                >
                                    <span>
                                        {String.fromCharCode(65 + index)}. {option}
                                    </span>
                                </div>
                            ))}
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
                        {currentQuestionIndex < totalQuestions - 1 ? (
                            <button
                                onClick={handleNext}
                                className={`px-4 py-2 rounded-lg ${currentQuestionIndex < totalQuestions - 1
                                        ? "bg-[#2148C0] text-white hover:bg-blue-600"
                                        : "bg-gray-300 text-gray-500"
                                    }`}
                            >
                                Next <FaArrowRight className="inline ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </main>

                {isSidebarOpen && (
                    <aside className="absolute sm:relative w-full sm:w-64 bg-white shadow-lg p-4 border-l z-30">
                        <h3 className="text-lg font-bold mb-4">Questions</h3>
                        <div className="grid grid-cols-8 sm:grid-cols-4 gap-2">
                            {currentSubjectData?.questions.map((_, index) => {
                                const isSelected = currentQuestionIndex === index;

                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center ${isSelected ? "border-blue-500" : ""
                                            }`}
                                    >
                                        <button
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold ${isSelected ? "text-white bg-blue-500" : "bg-gray-300"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>
                )}

                {showConfirmModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-bold mb-4">Confirm Exit</h2>
                            <p className="text-gray-700 mb-4">Are you sure you want to leave the quiz?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={cancelExit}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmExit}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamPage;
