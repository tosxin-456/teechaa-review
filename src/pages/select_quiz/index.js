import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaGraduationCap,
    FaUniversity,
    FaArrowLeft,
    FaBookOpen,
    FaClipboardCheck,
} from "react-icons/fa";
import { API_BASE_URL } from "../../config/apiConfig";

const SelectQuiz = () => {
    const navigate = useNavigate();
    const [selectedExam, setSelectedExam] = useState({ examType: "", year: "", mode: "", testId: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userResults, setUserResults] = useState([]);

    useEffect(() => {
        const fetchUserResults = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.user_id;

            if (!userId) {
                setError("User not logged in.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/answer/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch user results.");
                }

                const resultData = await response.json();
                setUserResults(resultData.data);
            } catch (error) {
                console.error("Error fetching results:", error.message);
                setError("Failed to fetch user results.");
            }
        };

        fetchUserResults();
    }, []);

    const handleQuizSelection = (examType, mode) => {
        if (!selectedExam.testId) {
            alert("Please select a test.");
            return;
        }

        setLoading(true);
        setError("");

        const filteredResults = userResults.filter(
            (item) =>
                item.question.examType === examType &&
                item.mode === mode &&
                item.test_id === selectedExam.testId
        );

        if (filteredResults.length === 0) {
            setError("No results found for the selected criteria.");
            setLoading(false);
            return;
        }

        setLoading(false);
        navigate("/result", { state: { result: filteredResults } });
    };

    const uniqueTests = (examType, mode) => {
        const filteredResults = userResults.filter(
            (item) => item.question.examType === examType && item.mode === mode
        );

        return [...new Set(filteredResults.map((item) => item.test_id))];
    };

    const hasExamData = (examType) => {
        return userResults.some((item) => item.question.examType === examType);
    };

    const goBack = () => {
        navigate("/dashboard");
    };

    if (!hasExamData("WAEC") && !hasExamData("JAMB")) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <p className="text-red-500 text-lg font-semibold">No such exam available.</p>
                <button
                    onClick={goBack}
                    className="mt-4 px-4 py-2 bg-[#2148C0] text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex items-center mt-6 ml-3 bg-gray-100">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
            </div>

            <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 py-8">
                <h1 className="text-3xl text-center font-semibold text-[#2148C0] mb-6">
                    Check Your Quiz Result
                </h1>

                {error && (
                    <div className="text-red-500 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {["WAEC", "JAMB"]
                        .filter((examType) => hasExamData(examType))
                        .map((examType) => (
                            <div
                                key={examType}
                                className="flex flex-col items-center p-6 border rounded-lg shadow-lg hover:shadow-2xl hover:bg-blue-50 transition-all duration-300"
                            >
                                {examType === "WAEC" ? (
                                    <FaGraduationCap className="text-4xl text-[#2148C0] mb-4 transition-transform transform hover:scale-125" />
                                ) : (
                                    <FaUniversity className="text-4xl text-[#2148C0] mb-4 transition-transform transform hover:scale-125" />
                                )}
                                <h2 className="text-lg font-semibold text-[#2148C0] mb-2">{examType}</h2>

                                {["study", "exam"].map((mode) => (
                                    <div key={mode} className="mb-4 w-full">
                                        <h3 className="text-md font-semibold text-[#2148C0] mb-2">
                                            {mode === "study" ? (
                                                <FaBookOpen className="inline-block mr-2" />
                                            ) : (
                                                <FaClipboardCheck className="inline-block mr-2" />
                                            )}
                                            {mode.toUpperCase()} Mode
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            {uniqueTests(examType, mode).map((testId, index) => (
                                                <div
                                                    key={testId}
                                                    className={`p-4 rounded-lg shadow-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-xl ${selectedExam.examType === examType &&
                                                        selectedExam.testId === testId &&
                                                        selectedExam.mode === mode
                                                        ? "bg-[#2148C0] text-white"
                                                        : "bg-white text-[#2148C0]"
                                                        }`}
                                                    onClick={() =>
                                                        setSelectedExam({
                                                            examType,
                                                            year: "", // No year required
                                                            mode,
                                                            testId,
                                                        })
                                                    }
                                                >
                                                    {mode === "study" ? "Study" : "Exam"} {index + 1}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                </div>

                <button
                    onClick={() => handleQuizSelection(selectedExam.examType, selectedExam.mode)}
                    className="bg-[#2148C0] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mt-6 transform hover:scale-105"
                    disabled={loading || !selectedExam.testId}
                >
                    {loading ? "Loading..." : "Check Result"}
                </button>
            </main>

            <footer className="text-center text-gray-300 py-4 bg-black bg-opacity-40">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SelectQuiz;
