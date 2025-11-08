import React, { useEffect, useState } from "react";
import { FaBook, FaPen, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";
import { useQuiz } from "../../utils/api/Redux/QuizContext";
import { ClipLoader, RingLoader } from "react-spinners";


const TakeJambQuiz = () => {
    const [quizData, setLocalQuizData] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [filters, setFilters] = useState({});
    const [mode, setMode] = useState("");
    const [timeLeft, setTimeLeft] = useState(7200);
    const { setQuizData } = useQuiz();
    const [incompleteTests, setIncompleteTests] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    // const { mode, setmode } = useState();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.user_id;
    const subscribed = user && user.subscribed === false;


    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`${API_BASE_URL}/api/questions/exam/JAMB`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (!response.ok) {
                    setIsLoading(true)
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch questions");
                }
                setIsLoading(false)
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
                const response = await fetch(`${API_BASE_URL}/api/review-tests/continue/${user_id}`, {
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

                // Ensure data exists and is an array
                const tests = Array.isArray(incomplete?.data) ? incomplete.data : [];
                const jambTests = tests.filter(test => test.examType === "JAMB");

                // console.log("JAMB Tests:", jambTests);
                setIncompleteTests(jambTests);
            } catch (error) {
                console.error("Error fetching questions:", error.message);
            }
        };

        fetchSolved();
    }, [user_id]);



    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <ClipLoader color="#4A90E2" size={50} />
                <p className="ml-4 text-blue-600 font-medium">Loading ...</p>
            </div>
        );
    }

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
        if (selectedSubjects.length === 0) return;

        const selectedQuizData = selectedSubjects.flatMap((subject_id) => {
            const allQuestions = quizData.filter((q) => q.subject_id === subject_id);
            const selectedYear = filters[subject_id]?.year;

            // Get all questions for the selected year without filtering
            const yearFilteredQuestions = selectedYear
                ? allQuestions.filter((q) => q.year === parseInt(selectedYear, 10))
                : allQuestions; // If no year is selected, return all questions for the subject

            console.log(`Questions for Subject ${subject_id} (Year ${selectedYear}):`, yearFilteredQuestions);
            return yearFilteredQuestions;
        });

        console.log("Final Selected Quiz Data:", selectedQuizData);
        setQuizData(selectedQuizData);

        const testId = await createTest();

        if (testId) {
            navigate("/exam", { state: { test_id: testId, time_left: timeLeft } });
        } else {
            console.error("Test ID is not available");
        }
    };


    const continueQuiz = async (test) => {
        if (!test) {
            console.error("No valid test data provided.");
            return;
        }

        const { subject, year, examType, answered } = test;

        console.log("Test Data:", test);

        // Convert answered array to a lookup object for easy merging
        const answeredMap = new Map(answered.map(a => [a.question_id, a]));

        // Get all questions matching the subject and year
        let selectedQuestions = quizData.filter(q => q.subject === subject && q.year === year);

        // Merge answered data into selected questions
        selectedQuestions = selectedQuestions.map(q => {
            const answeredData = answeredMap.get(q.id) || {};

            return {
                ...q,
                selectedOption: null, // Reset selection for new attempt
                questionCorrect: answeredData.questionCorrect || 0,
                answerPresent: answeredData.answerPresent || 0,
                answerCorrect: answeredData.answerCorrect || 0,
                imageCorrect: answeredData.imageCorrect || 0,
                imagePresent: answeredData.imagePresent || 0,
                user_id: answeredData.user_id || null,
                createdAt: answeredData.createdAt || null,
                updatedAt: answeredData.updatedAt || null,
            };
        });

        console.log("Final Quiz Data:", answeredMap);

        // Update state and navigate
        setQuizData(selectedQuestions);

        // navigate("/exam", {
        //     state: {
        //         subject,
        //         year,
        //         examType,
        //         quizData: selectedQuestions, // Ensures all required fields are passed
        //     },
        // });
    };








    // console.log(mode)


    const createTest = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review-tests/${user_id}`, {
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
                        Review JAMB Quiz Now
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

                    {/* Year Selection for Each Selected Subject */}
                    {selectedSubjects.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Select Year for Each Subject
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
                                                onChange={(e) => updateFilter(subjectId, "year", e.target.value)}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                                            >
                                                <option value="">Select Year</option>
                                                {subjectYears
                                                    .slice()
                                                    .sort((a, b) => a - b)
                                                    .map((year) => (
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

                    {/* Start Quiz Button */}
                    <div className="text-center">
                        <button
                            onClick={startQuiz}
                            disabled={selectedSubjects.length === 0} // Disabled if no subjects are selected
                            className={`px-6 py-3 rounded-md shadow-lg transition ${selectedSubjects.length > 0
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                }`}
                        >
                            Start Quiz
                        </button>
                    </div>
                {/* Incomplete Tests Section */}
                {incompleteTests?.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Incomplete Reviews</h2>
                        <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">Continue where you left off:</h3>
                            <div className="space-y-4">
                                {incompleteTests.map((test, index) => {
                                    // Ensure subject is always an array (in case of multiple subjects in the future)
                                    const uniqueSubjects = [test.subject];

                                    // console.log("Unique Subjects:", uniqueSubjects);

                                    // Calculate total answered questions from the array length
                                    const answeredQuestions = Array.isArray(test.answered) ? test.answered.length : 0;
                                    const totalQuestions = test.totalQuestions || 0;

                                    const progressPercentage = totalQuestions ? (answeredQuestions / totalQuestions) * 100 : 0;

                                    return (
                                        <div key={index} className="flex flex-col border-b py-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h4 className="text-md font-semibold text-gray-800">{`Study ${index + 1}`}</h4>
                                                    <span className="text-sm text-gray-600">
                                                        {test.subject} {test.examType}, {test.year}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => continueQuiz(test)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${progressPercentage}%` }}></div>
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

export default TakeJambQuiz;
