import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaClock, FaCalendarTimes } from "react-icons/fa";
import { QuizData } from "../../utils/questions";
import { useNavigate } from "react-router-dom";
import { IoIosAlarm } from "react-icons/io";

const ExamPage = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(300); // Timer in seconds
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    const attemptedSubjects = QuizData;
    const [selectedSubject, setSelectedSubject] = useState(attemptedSubjects[0]?.topic);

    const handleSubjectChange = (topic) => {
        setSelectedSubject(topic);
        setCurrentQuestionIndex(0);
        setTimeRemaining(300); // Reset timer when subject changes
    };

    const currentSubjectData = attemptedSubjects.find(
        (subject) => subject.topic === selectedSubject
    );
    const currentQuestion = currentSubjectData.questions[currentQuestionIndex];
    const totalQuestions = currentSubjectData.questions.length;
    const [rotation, setRotation] = useState(0);
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

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
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

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            <nav className="bg-[#2148C0] shadow-md px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Exam</h1>
                <div className="text-white">
                    Subjects: <span className="font-semibold">{attemptedSubjects.length}</span>
                </div>
            </nav>

            <div className="bg-white shadow py-3 px-4 sm:px-6">
                <div className="text-base sm:text-lg flex flex-wrap items-center gap-2">
                    <span className="font-bold text-gray-700">Select Subject: </span>
                    {attemptedSubjects.map((subject) => (
                        <button
                            key={subject.topic}
                            onClick={() => handleSubjectChange(subject.topic)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedSubject === subject.topic
                                    ? "bg-[#2148C0] text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {subject.topic}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow flex flex-col-reverse sm:flex-row">
                <main className="flex-1 p-4 sm:p-6 bg-white shadow-lg rounded-lg mx-4 sm:mx-6">
                    <div className="text-center justify-between flex mb-6">
                        <button
                            onClick={() => navigate(-1)}
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
                            {selectedSubject} - Question {currentQuestionIndex + 1} / {totalQuestions}
                        </h2>
                        <div className="text-gray-700 w-[70px] flex items-center font-semibold">
                            <IoIosAlarm
                                className="text-3xl text-[#2148C0] animate-swing"
                            />
                            <span className="ml-2">{formatTime(timeRemaining)}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
                        <h3 className="text-base sm:text-lg font-semibold mb-4">
                            {currentQuestion.question}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg shadow-md border border-gray-300"
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
                        ref={sidebarRef}
                        className="absolute sm:relative w-full sm:w-64 bg-white shadow-lg p-4 border-l z-30"
                    >
                        <h3 className="text-lg font-bold mb-4">Questions</h3>
                        <div className="grid grid-cols-8 sm:grid-cols-4 gap-2">
                            {currentSubjectData.questions.map((_, index) => {
                                const isSelected = currentQuestionIndex === index;

                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center ${isSelected ? " border-blue-500" : ""}`}
                                    >
                                        <button
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold ${isSelected ? "bg-blue-100" : ""} transition-all`}
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

export default ExamPage;
