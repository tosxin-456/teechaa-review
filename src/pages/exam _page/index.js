import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoIosAlarm } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuiz } from "../../utils/api/Redux/QuizContext";
import { API_BASE_URL } from "../../config/apiConfig";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import "katex/dist/katex.min.css";


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

const ToggleSwitch = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border cursor-pointer" onClick={() => onChange(!value)}>
        <span className="font-medium">{label}</span>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${value ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"} border transition-all`}>
            {value ? (
                <>
                    <FaCheckCircle className="text-green-600" />
                    <span className="text-green-600 font-semibold">True</span>
                </>
            ) : (
                <>
                    <FaTimesCircle className="text-red-600" />
                    <span className="text-red-600 font-semibold">False</span>
                </>
            )}
        </div>
    </div>
);

const QuestionCard = ({
    question,
    image,
    options,
    currentAnswer,
    questionCorrect,
    answerPresent,
    answerCorrect,
    imageCorrect,
    imagePresent,
    onCheckboxChange,
    explanation,
    isCorrect
}) => {
    console.log(explanation);

    // Track the image source dynamically
    const [imageSrc, setImageSrc] = useState(image ? `${API_BASE_URL}${image}` : null);

    useEffect(() => {
        if (window.MathJax) {
            window.MathJax.typesetPromise()
                .then(() => console.log("MathJax successfully updated for the new question."))
                .catch((err) => console.error("Error updating MathJax:", err));
        }
    }, [question, explanation]); // Update whenever question or explanation changes

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md overflow-auto">
            {/* Image Handling */}
            {imageSrc && (
                <div className="mb-4">
                    <img
                        src={imageSrc}
                        onError={(e) => {
                            if (e.target.src.endsWith(".jpg")) {
                                setImageSrc(`${API_BASE_URL}${image.replace(".jpg", ".png")}`);
                            } else if (e.target.src.endsWith(".png")) {
                                setImageSrc(null); // Hide image if both formats fail
                            }
                        }}
                        alt="Question Image"
                        className="rounded-lg w-full max-h-60 object-contain"
                    />
                    <div className="mt-2 space-y-2">
                        <ToggleSwitch label="Is the image above clear?" value={imageCorrect} onChange={(val) => onCheckboxChange("imageCorrect", val)} />
                        <ToggleSwitch label="Does the image relate to the question?" value={imagePresent} onChange={(val) => onCheckboxChange("imagePresent", val)} />
                    </div>
                </div>
            )}

            {/* Question */}
            <h3 className="text-lg font-semibold mb-4" dangerouslySetInnerHTML={{ __html: question }} />
            <ToggleSwitch label="Is the question clear?" value={questionCorrect} onChange={(val) => onCheckboxChange("questionCorrect", val)} />

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {options.map((option, index) => {
                    const isSelected = currentAnswer === option;
                    const isCorrectAnswer = isCorrect - 1 === index;
                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-lg shadow-md border flex items-center justify-between cursor-pointer 
                                ${isCorrectAnswer ? "bg-green-100 border-green-500" : "hover:bg-gray-200"} 
                                ${isSelected ? "bg-blue-100 border-blue-500" : ""}`}
                        >
                            <span>{String.fromCharCode(65 + index)}. {option}</span>
                            {isCorrectAnswer && <span className="text-green-600 font-bold">✔</span>}
                        </div>
                    );
                })}
            </div>

            {/* Answer Correctness Toggle */}
            <div className="mt-6">
                <ToggleSwitch label="Is the correct answer present in the options A-D?" value={answerPresent} onChange={(val) => onCheckboxChange("answerPresent", val)} />
            </div>
            <div className="mt-6">
                <ToggleSwitch label="Is the option selected correct??" value={answerCorrect} onChange={(val) => onCheckboxChange("answerCorrect", val)} />
            </div>
            

            {/* Explanation */}
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg overflow-auto">
                <h4 className="font-semibold text-[#2148C0]">Explanation:</h4>
                <p>{explanation}</p>
            </div>
        </div>
    );
};



const ExamPage = () => {
    const { quizData } = useQuiz();
    const navigate = useNavigate();
    const [showEntryModal, setShowEntryModal] = useState(true);
    const [currentSubject, setCurrentSubject] = useState(quizData?.[0]?.subject?.toUpperCase() || "");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    

    const handleCheckboxChange = (key, value) => {
        setCheckboxState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    


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
            window.MathJax?.typesetClear(); // Clear any previous MathJax rendering
            window.MathJax?.typesetPromise()
                .then(() => {
                    console.log("MathJax successfully updated for the new question.");
                })
                .catch((err) => {
                    console.error("Error updating MathJax:", err);
                });
        }
    }, [currentQuestionIndex, currentSubject]);

    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keyup", async (e) => {
        if (e.key === "PrintScreen" || e.key === "PrtSc") {
            try {
                await navigator.clipboard.writeText(""); // Clear clipboard
                alert("Screenshots are not allowed!");
            } catch (err) {
                console.error("Clipboard access denied:", err);
            }
        }
    });

    document.addEventListener("keydown", (e) => {
        if (
            e.key === "PrintScreen" ||
            e.key === "PrtSc" ||
            (e.ctrlKey && e.key === "p") ||  // Block Print
            (e.ctrlKey && e.key === "s") ||  // Block Save Page
            (e.ctrlKey && e.key === "c")     // Block Copy
        ) {
            e.preventDefault();
            alert("Screenshots are not allowed!");
        }
    });

    // setInterval(() => {
    //     if (navigator.plugins.length > 0) {
    //         alert("Screen recording tools are detected. Please close them.");
    //         window.location.reload();
    //     }
    // }, 5000);




    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.user_id;
    console.log(quizData)

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

    const handleNext = async () => {
        if (!user_id) {
            console.error("User ID is missing.");
            return;
        }

        // Ensure quizData and index are valid
        if (!quizData || quizData.length === 0 || currentQuestionIndex >= quizData.length) {
            console.error("Invalid question index or quiz data.");
            return;
        }

        // Get the current question
        const currentQuestion = quizData[currentQuestionIndex];
        if (!currentQuestion) return;

        // Format answer for submission
        const formattedAnswer = {
            user_id,
            question_id: currentQuestion.id,
            questionCorrect: checkboxState.questionCorrect ?? false,
            answerPresent: checkboxState.answerPresent ?? false,
            answerCorrect: checkboxState.answerCorrect ?? false,
            imageCorrect: checkboxState.imageCorrect ?? false,
            imagePresent: currentQuestion.image ? checkboxState.imagePresent ?? false : null,
            subject: currentQuestion.subject,
            year: currentQuestion.year,
            examType: currentQuestion.examType
        };

        console.log("Submitting answer:", formattedAnswer);

        try {
            const response = await fetch(`${API_BASE_URL}/api/answer-reviewers/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formattedAnswer),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to submit answer:", errorData.message);
                return;
            }

            console.log("Answer submitted successfully.");

            // Reset checkbox state after submission
            setCheckboxState({
                questionCorrect: false,
                answerPresent: false,
                imageCorrect: false,
                imagePresent: false
            });

            // Move to the next question if there are more left
            if (currentQuestionIndex < quizData.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            } else {
                console.log("Quiz completed.");
                // Handle quiz completion logic here (e.g., navigate to results)
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

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



    const handleExit = async () => {
        navigate(-1);
        localStorage.removeItem("timeLeft");
    };

    const [checkboxState, setCheckboxState] = useState({
        questionCorrect: currentSubjectQuestions[currentQuestionIndex]?.questionCorrect ?? false,
        answerPresent: currentSubjectQuestions[currentQuestionIndex]?.answerPresent ?? false,
        answerCorrect: currentSubjectQuestions[currentQuestionIndex]?.answerCorrect ?? false,
        imageCorrect: currentSubjectQuestions[currentQuestionIndex]?.imageCorrect ?? false,
        imagePresent: currentSubjectQuestions[currentQuestionIndex]?.imagePresent ?? false,
    });



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
            <div className="flex flex-grow  ">
                <main className="flex-1 p-6 overflow-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">
                            {currentSubject} - Question {currentQuestionIndex + 1} / {totalQuestions}
                        </h2>
                    </div>

                    {totalQuestions > 0 ? (
                        <QuestionCard
                            key={currentSubjectQuestions[currentQuestionIndex]?.id}
                            question={currentSubjectQuestions[currentQuestionIndex]?.question}
                            image={currentSubjectQuestions[currentQuestionIndex]?.image}
                            options={[
                                currentSubjectQuestions[currentQuestionIndex]?.option_a,
                                currentSubjectQuestions[currentQuestionIndex]?.option_b,
                                currentSubjectQuestions[currentQuestionIndex]?.option_c,
                                currentSubjectQuestions[currentQuestionIndex]?.option_d,
                            ]}
                            currentAnswer={selectedAnswers[currentSubjectQuestions[currentQuestionIndex]?.id] ?? null}
                            questionCorrect={checkboxState.questionCorrect}
                            answerPresent={checkboxState.answerPresent}
                            answerCorrect={checkboxState.answerCorrect}
                            imageCorrect={checkboxState.imageCorrect}
                            imagePresent={checkboxState.imagePresent}
                            onCheckboxChange={handleCheckboxChange}
                            explanation={currentSubjectQuestions[currentQuestionIndex]?.explanation}
                            isCorrect={currentSubjectQuestions[currentQuestionIndex]?.correctAnswer}
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
                                You are reviewing the questions to verify their accuracy. Please do not refresh the page, as this may result in losing your progress
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
                {showEntryModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-bold mb-4 text-center">Important Notice</h2>
                            <p className="text-gray-700 mb-4 text-center">
                                You are reviewing the questions to verify their accuracy. Please do not refresh the page, as this may result in losing your progress
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
