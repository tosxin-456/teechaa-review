import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosAlarm } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../utils/api/Redux/QuizContext";
import { API_BASE_URL } from "../../config/apiConfig";

const Navbar = () => (
    <nav className="bg-[#2148C0] shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Exam Portal</h1>
    </nav>
);

const Sidebar = ({ isOpen, groupedQuestions, onSelectSubject, onSelectQuestion, currentSubject, currentQuestionIndex, onClose }) => {
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <aside
            ref={sidebarRef}
            className={`fixed sm:relative sm:top-0 sm:left-0 sm:w-64 sm:h-[50vh] sm:mt-2 w-full h-[60%] bottom-0 bg-blue-50 shadow-lg p-6 border-t sm:border-r rounded-t-2xl sm:rounded-none z-40 transform sm:translate-x-0 transition-transform duration-300 overflow-y-auto sm:max-h-screen`}
        >
            <h3 className="text-xl font-bold text-blue-700 mb-6">Explore Subjects</h3>
            <div className="space-y-8">
                {Object.keys(groupedQuestions).map((subject) => (
                    <div key={subject} className="bg-white p-4 rounded-lg shadow-sm">
                        <h4
                            className={`text-lg font-semibold mb-4 cursor-pointer ${currentSubject === subject ? "text-blue-600" : "text-gray-800"}`}
                            onClick={() => onSelectSubject(subject)}
                        >
                            {subject}
                        </h4>
                        <div className="grid grid-cols-6 sm:grid-cols-5 gap-2 sm:gap-4">
                            {groupedQuestions[subject].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSelectQuestion(subject, index)}
                                    className={`w-9 h-9 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${currentSubject === subject && currentQuestionIndex === index
                                        ? "text-white bg-blue-500"
                                        : "bg-blue-100 hover:bg-blue-200"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>



    );
};



const Timer = ({ timeLeft }) => (
    <div className="text-gray-700 w-28 flex items-center font-semibold">
        <IoIosAlarm className="text-3xl text-[#2148C0] animate-pulse" />
        <span className="ml-2 text-xl">{timeLeft}</span>
    </div>
);

const ConfirmModal = ({ onCancel, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Exit</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to leave the quiz?</p>
            <div className="flex justify-end gap-4">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Exit
                </button>
            </div>
        </div>
    </div>
);

const QuestionCard = ({ question, options, currentAnswer, onOptionSelect }) => (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md overflow-y-auto">
        <h3
            className="text-lg font-semibold mb-4"
            dangerouslySetInnerHTML={{ __html: question }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-lg shadow-md border border-gray-300 cursor-pointer ${currentAnswer === index
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-200"
                        }`}
                    onClick={() => onOptionSelect(index)}
                >
                    <span>
                        {String.fromCharCode(65 + index)}. {option}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const ExamPage = () => {
    const { quizData } = useQuiz();
    const navigate = useNavigate();

    const [currentSubject, setCurrentSubject] = useState(quizData?.[0]?.subject?.toUpperCase() || "");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.user_id;
    const groupedQuestions = React.useMemo(() => {
        return (
            quizData?.reduce((acc, item) => {
                if (!acc[item.subject.toUpperCase()]) acc[item.subject.toUpperCase()] = [];
                acc[item.subject.toUpperCase()].push(item);
                return acc;
            }, {}) || {}
        );
    }, [quizData]);

    const currentSubjectQuestions = groupedQuestions[currentSubject] || [];
    const totalQuestions = currentSubjectQuestions.length;

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? `0${minutes}` : minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const saveAnswerToDatabase = async (selectedOptionIndex) => {
        try {
            const questionId = currentSubjectQuestions[currentQuestionIndex]?.id;
            const isCorrect = currentSubjectQuestions[currentQuestionIndex]?.correct_option === selectedOptionIndex;

            const response = await fetch(`${API_BASE_URL}/api/answer/${user_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id,
                    question_id: questionId,
                    selected_option: selectedOptionIndex,
                    is_correct: isCorrect,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save answer");
            }
        } catch (error) {
            console.error("Error saving answer:", error.message);
        }
    };

    const handleOptionSelect = (index) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentSubject]: {
                ...(prev[currentSubject] || {}),
                [currentQuestionIndex]: index,
            },
        }));
        saveAnswerToDatabase(index);
    };
    
    useEffect(() => {
        const fetchSavedAnswers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/answer/${user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch saved answers");
                }

                const answers = await response.json();
                console.log(answers)
                const formattedAnswers = answers.data.reduce((acc, answer) => {
                    const subject = answer.subject.toUpperCase();
                    if (!acc[subject]) acc[subject] = {};
                    acc[subject][answer.question_index] = answer.selected_option;
                    return acc;
                }, {});

                setSelectedAnswers(formattedAnswers);
                console.log(formattedAnswers)
            } catch (error) {
                console.error("Error fetching saved answers:", error.message);
            }
        };

        fetchSavedAnswers();
    }, []);


    const checkIfAnswerExists = async (questionId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/answer/${questionId}?user_id=${user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to check if answer exists");
            }

            const data = await response.json();
            return data && data.length > 0; 
        } catch (error) {
            console.error("Error checking if answer exists:", error.message);
            return false; 
        }
    };


    const handleSubmit = () => {
        console.log("Submitting Answers:", selectedAnswers);
    };

    const handleBackNavigation = () => {
        setShowConfirmModal(true);
    };

    const handleNext = async () => {
        const currentQuestionId = currentSubjectQuestions[currentQuestionIndex]?.id;
        const correctAnswer = currentSubjectQuestions[currentQuestionIndex]?.correctAnswer;
        const selectedOption = selectedAnswers[currentSubject]?.[currentQuestionIndex];

        if (currentQuestionId && selectedOption !== undefined) {
            const answerData = {
                selected_option: selectedOption,
            };

            // Check if the selected answer is correct
            const isCorrect = selectedOption === correctAnswer ? 1 : 0; // Use 1 for correct, 0 for incorrecct
            console.log(isCorrect)
            try {
                // Use POST to save the answer if it doesn't already exist
                const response = await fetch(`${API_BASE_URL}/api/answer/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...answerData,
                        user_id,
                        question_id: currentQuestionId,
                        is_correct: isCorrect,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to save answer");
                }
            } catch (error) {
                console.error("Error saving answer:", error.message);
            }
        }

        setCurrentQuestionIndex((prev) => prev + 1);
    };







    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            {showConfirmModal && (
                <ConfirmModal
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={() => navigate(-1)}
                />
            )}
            <Navbar />
            <div className="bg-white py-3 px-4">
                <div className="flex items-center gap-4">
                    {Object.keys(groupedQuestions).map((subject) => (
                        <button
                            key={subject}
                            onClick={() => {
                                setCurrentSubject(subject);
                                setCurrentQuestionIndex(0);
                            }}
                            className={`px-4 py-2 rounded-lg font-semibold ${subject === currentSubject
                                ? "bg-[#2148C0] text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>
            <div className="justify-between flex mx-auto w-[90%] mt-2">
                <button
                    onClick={handleBackNavigation}
                    className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300"
                >
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg> */}
                    <span>Questions Bar</span>
                </button>

            </div>
            <div className="flex flex-grow">
                <main className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">
                            {currentSubject} - Question {currentQuestionIndex + 1} / {totalQuestions}
                        </h2>
                        <Timer timeLeft={formatTime(timeLeft)} />
                    </div>

                    {totalQuestions > 0 ? (
                        <QuestionCard
                            question={currentSubjectQuestions[currentQuestionIndex]?.question}
                            options={[
                                currentSubjectQuestions[currentQuestionIndex]?.option_a,
                                currentSubjectQuestions[currentQuestionIndex]?.option_b,
                                currentSubjectQuestions[currentQuestionIndex]?.option_c,
                                currentSubjectQuestions[currentQuestionIndex]?.option_d,
                            ]}
                            currentAnswer={selectedAnswers[currentSubject]?.[currentQuestionIndex]}
                            onOptionSelect={handleOptionSelect}
                        />
                    ) : (
                        <p className="text-center text-gray-500">No questions available.</p>
                    )}

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                            className={`px-4 py-2 rounded-lg ${currentQuestionIndex > 0
                                ? "bg-[#2148C0] text-white hover:bg-blue-600"
                                : "bg-gray-300 text-gray-500"
                                }`}
                        >
                            <FaArrowLeft className="inline mr-2" /> Back
                        </button>
                        <button
                            onClick={
                                currentQuestionIndex < totalQuestions - 1
                                    ? handleNext // Call handleNext to move to the next question
                                    : handleSubmit // Call handleSubmit when at the last question
                            }
                            className={`px-4 py-2 rounded-lg ${currentQuestionIndex < totalQuestions - 1
                                ? "bg-[#2148C0] text-white hover:bg-blue-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                        >
                            {currentQuestionIndex < totalQuestions - 1 ? (
                                <>
                                    Next <FaArrowRight className="inline ml-2" />
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </main>

                <Sidebar
                    isOpen={isSidebarOpen}
                    groupedQuestions={groupedQuestions}
                    onSelectSubject={(subject) => setCurrentSubject(subject)}
                    onSelectQuestion={(subject, index) => {
                        setCurrentSubject(subject);
                        setCurrentQuestionIndex(index);
                        setSidebarOpen(false);
                    }}
                    currentSubject={currentSubject}
                    currentQuestionIndex={currentQuestionIndex}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>
        </div>
    );
};

export default ExamPage;
