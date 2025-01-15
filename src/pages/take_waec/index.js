import React, { useEffect, useState } from "react";
import { FaBook, FaPen, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";
import { useQuiz } from "../../utils/api/Redux/QuizContext";

const TakeWaecQuiz = () => {
    const [quizData, setLocalQuizData] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [filters, setFilters] = useState({});
    const [mode, setMode] = useState("");
    const [timeLeft, setTimeLeft] = useState(7200);
    const { setQuizData } = useQuiz();
    const [incompleteTests, setIncompleteTests] = useState([])
    // const { mode, setmode } = useState();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.user_id;

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/questions/exam/WAEC`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch questions");
                }

                const questions = await response.json();
                setLocalQuizData(questions);
            } catch (error) {
                console.error("Error fetching questions:", error.message);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        const fetchSolved = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/tests/continue/${user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch questions");
                }

                const incomplete = await response.json();
                // console.log(incomplete);

                const jambTests = incomplete.data.filter(test =>
                    test.answers.some(answer => answer.question.examType === "WAEC") // Filter by "JAMB" examType
                );

                // console.log(jambTests);
                setIncompleteTests(jambTests);
                console.log(jambTests)
            } catch (error) {
                console.error("Error fetching questions:", error.message);
            }
        };

        fetchSolved();
    }, [user_id]);



    const toggleSubject = (id) => {
        setSelectedSubjects((prev) =>
            prev.includes(id) ? prev.filter((subjectId) => subjectId !== id) : [...prev, id]
        );
    };

    const updateFilter = (subjectId, field, value) => {
        setFilters((prev) => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                [field]: value,
            },
        }));
    };

    const goBack = () => {
        navigate(-1);
    };

    const startQuiz = async () => {
        if (!mode || selectedSubjects.length === 0) return;

        const selectedQuizData = selectedSubjects.flatMap((subject_id) => {
            const allQuestions = quizData.filter((q) => q.subject_id === subject_id);
            createTest();

            if (mode === "exam") {
                const randomQuestions = allQuestions
                    .sort(() => Math.random() - 0.5)
                    .slice(0, Math.min(40, allQuestions.length));
                console.log(`Exam Questions for Subject ${subject_id}:`, randomQuestions);
                return randomQuestions;
            } else if (mode === "study") {
                const selectedYear = filters[subject_id]?.year;
                const yearFilteredQuestions = selectedYear
                    ? allQuestions.filter((q) => q.year === parseInt(selectedYear, 10))
                    : [];
                const limitedQuestions = yearFilteredQuestions
                    .sort(() => Math.random() - 0.5)
                    .slice(0, Math.min(40, yearFilteredQuestions.length));
                console.log(`Study Questions for Subject ${subject_id}:`, limitedQuestions);
                return limitedQuestions;
            }

            return [];
        });

        console.log("Final Selected Quiz Data:", selectedQuizData);
        setQuizData(selectedQuizData);

        const testId = await createTest();

        if (testId) {
            navigate("/exam", { state: { test_id: testId, time_left: timeLeft, mode } });
        } else {
            console.error("Test ID is not available");
        }
    };


    const continueQuiz = async () => {
        console.log("Incomplete Tests Data:", incompleteTests);

        const testId = incompleteTests[0]?.test_id;
        const mode = incompleteTests[0]?.answers[0]?.mode
        // console.log(mode)
        if (!testId) {
            console.error("Test ID is not available");
            return;
        }

        const selectedSubjects = incompleteTests.flatMap((test) =>
            test.answers.map((answer) => answer.question.subject_id)
        );

        // Collect already answered question IDs
        const incompleteQuestionIds = new Set(
            incompleteTests.flatMap((test) => test.answers.map((answer) => answer.question.id))
        );

        // Fetch remaining questions for selected subjects
        const selectedQuizData = selectedSubjects.flatMap((subject_id) =>
            quizData.filter((q) => q.subject_id === subject_id && !incompleteQuestionIds.has(q.id))
        );

        // Include previously answered questions
        let totalQuestions = incompleteTests.flatMap((test) =>
            test.answers.map((answer) => ({
                ...answer.question,
                selectedOption: answer.selected_option || null,
            }))
        );

        const remainingQuestionsToSelect = 40 - totalQuestions.length;
        if (remainingQuestionsToSelect > 0) {
            const additionalQuestions = selectedQuizData
                .sort(() => Math.random() - 0.5)
                .slice(0, remainingQuestionsToSelect)
                .map((question) => ({
                    ...question,
                    selectedOption: null,
                }));

            totalQuestions = [...totalQuestions, ...additionalQuestions];
        }

        console.log("Final Quiz Data:", totalQuestions);

        // Update quiz data state and navigate
        setQuizData(totalQuestions);

        navigate("/exam", {
            state: {
                test_id: testId,
                time_left: timeLeft,
                mode,
                quizData: totalQuestions,
            },
        });
    };







    // console.log(mode)


    const createTest = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tests/${user_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ user_id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create test");
            }

            const test = await response.json();
            localStorage.setItem('test_id', test.data.id);
            return test.data.id;
        } catch (error) {
            console.error("Error creating test:", error.message);
            return null;
        }
    };


    const uniqueSubjects = Array.from(
        new Map(quizData.map((quiz) => [quiz.subject_id, quiz.subject])).entries()
    );

    return (
        <div>
            <div className="flex items-center mb-2 mt-6">
                <button
                    onClick={goBack}
                    className="flex items-center ml-[30px] gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
            </div>
            <div className="min-h-screen bg-gray-50 py-10 px-6">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-center mb-8 text-[#2148C0]">
                        Take WAEC Quiz Now
                    </h1>

                    {/* Subject Selection */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Subjects</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {uniqueSubjects.map(([subjectId, subject]) => (
                                <label
                                    key={subjectId}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSubjects.includes(subjectId)}
                                        onChange={() => toggleSubject(subjectId)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="text-gray-700">{subject}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filters for Study Mode */}
                    {mode === "study" && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Filters (for each subject)
                            </h2>
                            {selectedSubjects.map((subjectId) => {
                                const subjectYears = [
                                    ...new Set(
                                        quizData
                                            .filter((quiz) => quiz.subject_id === subjectId)
                                            .map((quiz) => quiz.year)
                                    ),
                                ];

                                const subjectName = uniqueSubjects.find(
                                    ([id]) => id === subjectId
                                )?.[1];

                                return (
                                    <div
                                        key={subjectId}
                                        className="border rounded-lg p-4 mb-4 bg-gray-100"
                                    >
                                        <h3 className="text-md font-semibold text-gray-800 mb-2">
                                            {subjectName}
                                        </h3>
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">
                                                Year
                                            </label>
                                            <select
                                                value={filters[subjectId]?.year || ""}
                                                onChange={(e) =>
                                                    updateFilter(subjectId, "year", e.target.value)
                                                }
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                                            >
                                                <option value="">Select Year</option>
                                                {subjectYears.map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Modes */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Modes</h2>
                        <div className="flex justify-around">
                            <button
                                onClick={() => setMode("study")}
                                className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${mode === "study" ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                <FaBook className="text-2xl mb-2" />
                                <span>Study</span>
                            </button>
                            <button
                                onClick={() => setMode("exam")}
                                className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${mode === "exam" ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                <FaPen className="text-2xl mb-2" />
                                <span>Exam</span>
                            </button>
                        </div>
                    </div>

                    {/* Timer */}
                    {mode === "exam" && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Set Timer</h2>
                            <div className="flex items-center gap-4">
                                <FaClock className="text-blue-600 text-2xl" />
                                <input
                                    type="number"
                                    min="0"
                                    max="2"
                                    value={Math.floor(timeLeft / 3600)}
                                    onChange={(e) => {
                                        const hours = parseInt(e.target.value, 10) || 0;
                                        setTimeLeft(hours * 3600 + (timeLeft % 3600));
                                    }}
                                    className="w-16 p-2 border rounded-md focus:ring-2 focus:ring-blue-600 text-lg font-bold text-gray-700 text-center"
                                />
                                <span className="text-lg font-bold">:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={Math.floor((timeLeft % 3600) / 60)}
                                    onChange={(e) => {
                                        const minutes = parseInt(e.target.value, 10) || 0;
                                        setTimeLeft(
                                            Math.floor(timeLeft / 3600) * 3600 + minutes * 60
                                        );
                                    }}
                                    className="w-16 p-2 border rounded-md focus:ring-2 focus:ring-blue-600 text-lg font-bold text-gray-700 text-center"
                                />
                            </div>
                        </div>
                    )}

                    {/* Start Quiz Button */}
                    <div className="text-center">
                        <button
                            onClick={startQuiz}
                            disabled={!mode || selectedSubjects.length === 0} // Disabled if no subjects are selected
                            className={`px-6 py-3 rounded-md shadow-lg transition ${mode && selectedSubjects.length > 0
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                }`}
                        >
                            Start Quiz
                        </button>
                    </div>

                    {/* Incomplete Tests Section */}
                    {incompleteTests.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Incomplete Studies
                            </h2>
                            <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Continue where you left off:
                                </h3>
                                <div className="space-y-4">
                                    {incompleteTests.map((test, index) => {
                                        // Extract unique subjects using a Set
                                        const uniqueSubjects = Array.from(
                                            new Set(test.answers.map((answer) => answer.question.subject))
                                        );

                                        // Calculate progress
                                        const totalQuestions = 40// Dynamically get the total number of questions
                                        const answeredQuestions = test.answers.length; // Number of answered questions
                                        const progressPercentage = (answeredQuestions / totalQuestions) * 100;

                                        return (
                                            <div key={test.test_id} className="flex flex-col border-b py-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h4 className="text-md font-semibold text-gray-800">{`Study ${index + 1}`}</h4> {/* Display index + 1 */}
                                                        <span className="text-sm text-gray-600">
                                                            Subjects: {uniqueSubjects.join(", ")}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => continueQuiz(test.test_id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Continue
                                                    </button>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-600 mt-1">
                                                    {answeredQuestions} out of {totalQuestions} questions answered
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
            <footer className="text-center text-gray-300 py-4 bg-[#2148C0] text-sm">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );

};

export default TakeWaecQuiz;
