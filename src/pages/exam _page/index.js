import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosAlarm } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";
import { toast } from "sonner";
import QuizData from "../../utils/questions";
const ExamPage = () => {
    const { state } = useLocation();
    const { selectedQuizData, timeLeft: initialTimeLeft, mode, examType, year } = state || {};
    const [quizData, setQuizData] = useState([]);
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

    useEffect(() => {
        if (selectedQuizData) {
            const transformedData = selectedQuizData.map((subject) => ({
                subject: subject.subject,
                questions: subject.questions.map((q) => ({
                    question: q.question,
                    options: [q.option_a, q.option_b, q.option_c, q.option_d],
                    correctOption: parseInt(q.correctAnswer) - 1, // Convert to 0-based index
                    explanation: q.explanation,
                })),
            }));
            setQuizData(transformedData);
        }
    }, [selectedQuizData]);


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
            [selectedSubject]: {
                ...(prev[selectedSubject] || {}),
                [questionIndex]: optionIndex,
            },
        }));
    };

    const examsData = []; 


    const handleSubmit = async () => {
        const transformedAnswers = Object.keys(selectedAnswers).reduce((acc, subject) => {
            const subjectAnswers = selectedAnswers[subject];
            const answersArray = Array(totalQuestions).fill(null).map((_, index) => subjectAnswers[index] || null);
            acc[subject] = answersArray;
            return acc;
        }, {});

        // Fetch user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            console.error("User not found in localStorage.");
            toast.error("User not logged in. Please log in and try again.");
            return;
        }

        const result = {
            user_id: user.user_id,
            user_answer_id: 1, // Adjust this if dynamic
            examType,          // Ensure this is defined
            year: 2010,        // Ensure this is dynamic if necessary
            answers: transformedAnswers,
        };

        console.log("Result payload:", result); 

        try {
            const response = await fetch(`${API_BASE_URL}/api/answer/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(result),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("API Response:", responseData);
                toast.success("Successfully uploaded your result");

                // Create the examsData array
                const examsData = Object.keys(transformedAnswers).map((subject) => {
                    const subjectAnswers = transformedAnswers[subject];
                    const currentSubjectData = QuizData.find((s) => s.subject === subject);
                    const totalQuestions = currentSubjectData.questions.length;

                    // Calculate correct answers
                    const correctAnswersCount = subjectAnswers.filter((answer, index) => {
                        return answer === currentSubjectData.questions[index].correctOption;
                    }).length;

                    // Calculate percentage score over 100
                    const scorePercentage = (correctAnswersCount / totalQuestions) * 100;

                    return {
                        user_id: result.user_id,
                        year: result.year,
                        subject,
                        examType: result.examType,
                        correct: Math.round(scorePercentage), // Round percentage to nearest whole number
                    };
                });

                console.log("Exams Data:", examsData); // Debugging examsData

                // Post each subject's data to /api/progress/
                for (const examData of examsData) {
                    try {
                        const progressResponse = await fetch(`${API_BASE_URL}/api/progress/`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(examData),
                        });

                        if (progressResponse.ok) {
                            console.log(`Progress for ${examData.subject} successfully saved.`);
                        } else {
                            const errorData = await progressResponse.json();
                            console.error(`Error saving progress for ${examData.subject}:`, errorData);
                            toast.error(`Failed to save progress for ${examData.subject}`);
                        }
                    } catch (progressError) {
                        console.error(`Fetch Error for ${examData.subject}:`, progressError);
                        toast.error(`An error occurred while saving progress for ${examData.subject}`);
                    }
                }
                const userResult = [result]
                // Navigate to result page
                navigate("/result", { state: { result: userResult } });
            } else {
                const errorData = await response.json();
                console.error("Error Response:", errorData);
                toast.error(errorData.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("An error occurred while submitting your result. Please try again.");
        }
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
                                    className={`p-4 rounded-lg shadow-md border border-gray-300 cursor-pointer ${selectedAnswers[selectedSubject]?.[currentQuestionIndex] === index
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
