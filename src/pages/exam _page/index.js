import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosAlarm } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
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
            {options.map((option, index) => {
                const isSelected = currentAnswer === index;

                return (
                    <div
                        key={index}
                        className={`p-4 rounded-lg shadow-md border cursor-pointer ${isSelected
                            ? "bg-blue-100 border-blue-500"
                            : "hover:bg-gray-200"
                            }`}
                        onClick={() => onOptionSelect(index)}
                    >
                        <span>
                            {String.fromCharCode(65 + index)}. {option}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
);




const ExamPage = () => {
    const { quizData } = useQuiz();
    const [userResults, setUserResults] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { test_id, time_left, mode } = location.state || {};
    // console.log(test_id, time_left)
    const [showEntryModal, setShowEntryModal] = useState(true);
    const [currentSubject, setCurrentSubject] = useState(quizData?.[0]?.subject?.toUpperCase() || "");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [selectedExam, setSelectedExam] = useState({ examType: "", year: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const initialAnswers = quizData.reduce((acc, question) => {
            if (question.selectedOption) {
                acc[question.id] = question.selectedOption.charCodeAt(0) - 65; // Convert "A" to 0, "B" to 1, etc.
            }
            return acc;
        }, {});
        setSelectedAnswers(initialAnswers);
    }, [quizData]);

    useEffect(() => {
        if (window.MathJax) {
            window.MathJax.typesetClear(); // Clear any previous MathJax rendering
            window.MathJax.typesetPromise()
                .then(() => {
                    console.log("MathJax successfully updated for the new question.");
                })
                .catch((err) => {
                    console.error("Error updating MathJax:", err);
                });
        }
    }, [currentQuestionIndex, currentSubject]);


    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.user_id;

    const handleContinue = () => {
        setShowEntryModal(false);
    };

    const saveUnansweredQuestions = async () => {
        try {
            const unansweredQuestions = currentSubjectQuestions.filter((question) =>
                selectedAnswers[question.id] === undefined
            );

            const promises = unansweredQuestions.map((question) => {
                return fetch(`${API_BASE_URL}/api/answer/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        mode: "exam",
                        test_id,
                        user_id,
                        question_id: question.id,
                        selected_option: null,
                        is_correct: 0, // Assuming unanswered questions are marked incorrect
                    }),
                });
            });

            await Promise.all(promises);
            console.log("All unanswered questions saved as null.");
        } catch (error) {
            console.error("Error saving unanswered questions:", error.message);
        }
    };


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

    const [timeLeft, setTimeLeft] = useState(() => {
        const savedTime = localStorage.getItem("timeLeft");
        return savedTime ? parseInt(savedTime, 10) : time_left || 7200;
    });


    // Format the time for display
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? `0${minutes}` : minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    useEffect(() => {
        if (timeLeft <= 0 && mode === "exam") {
            saveUnansweredQuestions().then(() => {
                handleSubmit(); // Automatically submit when time expires
            });
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [timeLeft]);


    // Start countdown when timeLeft is greater than 0
    useEffect(() => {
        if (timeLeft <= 0 && mode === "exam") return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [timeLeft]);

    const saveAnswerToDatabase = async (selectedOptionIndex) => {
        try {
            const optionsMap = { 0: "A", 1: "B", 2: "C", 3: "D" };
            const correctMap = { A: "1", B: "2", C: "3", D: "4" };
            const questionId = currentSubjectQuestions[currentQuestionIndex]?.id;
            const isCorrect = currentSubjectQuestions[currentQuestionIndex]?.correct_option === correctMap[selectedOptionIndex];
            console.log(correctMap[selectedOptionIndex])
            const response = await fetch(`${API_BASE_URL}/api/answer/${user_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    test_id,
                    user_id,
                    question_id: questionId,
                    selected_option: optionsMap[selectedOptionIndex],
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

    const handleOptionSelect = async (index) => {
        const questionId = currentSubjectQuestions[currentQuestionIndex]?.id;

        if (!questionId) {
            console.error("Invalid question ID");
            return;
        }
        // Update the state for selected answers
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: index, // Use question ID as the key
        }));

        console.log(questionId, index, selectedAnswers)
        try {
            // Save the answer asynchronously
            await saveAnswerToDatabase(questionId, index);
            console.log(`Answer for question ${questionId} saved successfully: Option ${index}`);
        } catch (error) {
            console.error(`Failed to save answer for question ${questionId}:`, error.message);
            // Optional: Add retry logic or notify the user
        }
    };


    const handleNext = async () => {
        const currentQuestionId = currentSubjectQuestions[currentQuestionIndex]?.id; // Get current question ID
        const correctAnswer = currentSubjectQuestions[currentQuestionIndex]?.correctAnswer; // Get correct answer for comparison
        const selectedOption = selectedAnswers[currentQuestionId] !== undefined ? selectedAnswers[currentQuestionId] : null;
        const correctMap = { 0: "1", 1: "2", 2: "3", 3: "4" };
        const optionsMap = { 0: "A", 1: "B", 2: "C", 3: "D" };
        console.log("Selected Answers:", selectedAnswers);
        console.log("Current Question ID:", currentQuestionId);
        console.log("Selected Option:", selectedOption);
        console.log("Correct Answer:", correctAnswer);

        // Check if question ID and selected option are valid
        if (currentQuestionId && selectedOption !== undefined && selectedOption !== null) {
            const isCorrect = correctMap[selectedOption] === correctAnswer ? 1 : 0; // Determine correctness
            const answerData = {
                selected_option: optionsMap[selectedOption],
                is_correct: isCorrect,
                user_id,
                question_id: currentQuestionId,
                test_id,
                mode,
            };

            console.log("Answer Data:", answerData);

            try {
                // Check if the answer already exists
                const response = await fetch(
                    `${API_BASE_URL}/api/answer/update/${user_id}/${currentQuestionId}/${test_id}/${mode}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });

                const data = await response.json();

                if (data.success && data.answerExists) {
                    // If the answer exists, update it
                    const updateResponse = await fetch(
                        `${API_BASE_URL}/api/answer/update/${user_id}/${currentQuestionId}/${test_id}/${mode}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                            },
                            body: JSON.stringify(answerData),
                        }
                    );

                    if (!updateResponse.ok) {
                        throw new Error("Failed to update answer");
                    }
                    console.log("Answer updated successfully");
                } else {
                    // If the answer doesn't exist, create a new one
                    const createResponse = await fetch(`${API_BASE_URL}/api/answer/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify(answerData),
                    });

                    if (!createResponse.ok) {
                        throw new Error("Failed to save answer");
                    }
                    console.log("Answer saved successfully");
                }
            } catch (error) {
                console.error("Error handling answer:", error.message);
            }
        } else {
            console.warn("No option selected or invalid question ID.");
        }

        // If it's the last question, handle submission and navigate to results
        if (currentQuestionIndex === totalQuestions - 1) {
            handleSubmit();
        } else {
            // Otherwise, move to the next question
            setCurrentQuestionIndex((prev) => (prev < totalQuestions - 1 ? prev + 1 : prev));
        }
    };

    const handleSubmit = async () => {
        await saveUnansweredQuestions(); // Save unanswered questions
        const formattedAnswers = currentSubjectQuestions.map((question) => {
            const selectedOption = selectedAnswers[question.id];
            const isCorrect = selectedOption === question.correctAnswer ? 1 : 0;

            return {
                user_answer_id: question.id,
                user_id: user_id,
                question_id: question.id,
                test_id: test_id,
                selected_option: selectedOption,
                is_correct: isCorrect,
                mode: mode,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                question: {
                    id: question.id,
                    year: question.year,
                    examType: question.examType,
                    question: question.question,
                    image: question.image,
                    subject: question.subject,
                    explanation: question.explanation,
                    option_a: question.option_a,
                    option_b: question.option_b,
                    option_c: question.option_c,
                    option_d: question.option_d,
                    correctAnswer: question.correctAnswer,
                },
            };
        });

        console.log("Submitting Answers:", formattedAnswers);
        navigate("/result", { state: { result: formattedAnswers } });
    };

    const handleExit = async () => {
        if (mode === "exam") {
            await saveUnansweredQuestions(); // Save unanswered questions
        }
        navigate(-1); // Go back to the previous page
        localStorage.removeItem("timeLeft"); // Remove the saved timeLeft from localStorage
    };





    const handleBackNavigation = () => {
        setShowConfirmModal(true);
    };




    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            {showConfirmModal && (
                <ConfirmModal
                    onCancel={() => setShowConfirmModal(false)}
                    onConfirm={handleExit}
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
                    <span>Questions Bar</span>
                </button>

            </div>
            <div className="flex flex-grow">
                <main className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">
                            {currentSubject} - Question {currentQuestionIndex + 1} / {totalQuestions}
                        </h2>
                        {mode === "exam" && (
                            <Timer timeLeft={formatTime(timeLeft)} />
                        )}
                    </div>

                    {totalQuestions > 0 ? (
                        <QuestionCard
                            key={currentSubjectQuestions[currentQuestionIndex]?.id}
                            question={currentSubjectQuestions[currentQuestionIndex]?.question}
                            options={[
                                currentSubjectQuestions[currentQuestionIndex]?.option_a,
                                currentSubjectQuestions[currentQuestionIndex]?.option_b,
                                currentSubjectQuestions[currentQuestionIndex]?.option_c,
                                currentSubjectQuestions[currentQuestionIndex]?.option_d,
                            ]}
                            currentAnswer={selectedAnswers[currentSubjectQuestions[currentQuestionIndex]?.id] ?? null}
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
                                handleNext
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

                {showEntryModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-bold mb-4 text-center">Important Notice</h2>
                            <p className="text-gray-700 mb-4 text-center">
                                Please do not refresh the page while taking the exam. Refreshing the page may result in losing your progress.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setShowEntryModal(false)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    I Understand
                                </button>
                            </div>
                        </div>
                    </div>
                )}


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
