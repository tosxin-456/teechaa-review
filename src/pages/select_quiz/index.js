import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from "../../config/apiConfig";
import { ClipLoader, RingLoader } from "react-spinners";

const SelectQuiz = () => {
    const navigate = useNavigate();
    const [selectedExam, setSelectedExam] = useState({ examType: "", mode: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userResults, setUserResults] = useState([]);
    const [filters, setFilters] = useState({ examType: "", mode: "" });

    useEffect(() => {
        const fetchUserResults = async () => {
            // Start the loading state
            setLoading(true);

            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.user_id;

            if (!userId) {
                setError("User not logged in.");
                setLoading(false); // Stop loading if no user ID
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/answer/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            } finally {
                // Stop the loading state regardless of success or failure
                setLoading(false);
            }
        };

        fetchUserResults();
    }, []);


    const handleQuizSelection = (examType, mode) => {
        const filteredResults = userResults.filter(
            (item) =>
                item.question.examType === examType &&
                item.mode === mode
        );

        if (filteredResults.length === 0) {
            setError("No results found for the selected criteria.");
            return;
        }

        navigate("/result", { state: { result: filteredResults } });
    };

    const goBack = () => {
        navigate("/dashboard");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <RingLoader color="#4A90E2" size={50} />
                <p className="ml-4 text-blue-600 font-medium">Loading your progress...</p>
            </div>
        );
    }

    const getUniqueExamData = () => {
        const uniqueExamDataMap = new Map();

        userResults.forEach((item) => {
            const uniqueKey = `${item.question.examType}_${item.mode}`;
            if (!uniqueExamDataMap.has(uniqueKey)) {
                uniqueExamDataMap.set(uniqueKey, {
                    examType: item.question.examType,
                    mode: item.mode,
                });
            }
        });

        return Array.from(uniqueExamDataMap.values());
    };

    const examData = getUniqueExamData().filter(
        (data) =>
            (!filters.examType || data.examType === filters.examType) &&
            (!filters.mode || data.mode === filters.mode)
    );

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    if (userResults.length === 0) {
        return (
            <div className="flex flex-col h-full min-h-screen">
                <div className="flex items-center justify-between mb-6 px-4 py-2 bg-white shadow-sm">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                    >
                        <FaArrowLeft className="text-xl" />
                        Back
                    </button>
                </div>
                <div className="flex items-center justify-center flex-grow bg-gray-100">
                    <p className="text-lg font-medium text-gray-600">
                        No exam history available for this user.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex items-center mt-6 ml-3">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
            </div>

            <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 py-8 px-4">
                <h1 className="text-3xl text-center font-semibold text-[#2148C0] mb-6">
                    Check Your Quiz Result
                </h1>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                {/* Filters */}
                <div className="w-full max-w-4xl mb-6 flex flex-col md:flex-row gap-4">
                    <select
                        name="examType"
                        value={filters.examType}
                        onChange={handleFilterChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">All Exam Types</option>
                        {Array.from(new Set(userResults.map((item) => item.question.examType))).map(
                            (examType, index) => (
                                <option key={index} value={examType}>
                                    {examType}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        name="mode"
                        value={filters.mode}
                        onChange={handleFilterChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">All Modes</option>
                        {Array.from(new Set(userResults.map((item) => item.mode))).map((mode, index) => (
                            <option key={index} value={mode}>
                                {mode}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full max-w-4xl overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
                        <thead>
                            <tr className="bg-[#2148C0] text-white">
                                <th className="border border-gray-300 px-4 py-2">Exam Type</th>
                                <th className="border border-gray-300 px-4 py-2">Mode</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examData.length > 0 ? (
                                examData.map((data, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-blue-50 ${selectedExam.examType === data.examType && selectedExam.mode === data.mode ? "bg-blue-100" : ""}`}
                                    >
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {data.examType}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center capitalize">
                                            {data.mode}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <button
                                                className="px-4 py-2 bg-[#2148C0] text-white rounded-lg hover:bg-blue-600 transition"
                                                onClick={() =>
                                                    handleQuizSelection(
                                                        data.examType,
                                                        data.mode
                                                    )
                                                }
                                            >
                                                Check Result
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center text-gray-500 py-4"
                                    >
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <footer className="text-center text-gray-300 py-4 bg-black bg-opacity-40">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SelectQuiz;
