import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from "../../config/apiConfig";

const SelectQuiz = () => {
    const navigate = useNavigate();
    const [selectedExam, setSelectedExam] = useState({ examType: "", mode: "", testId: "" });
    const [selectedFilters, setSelectedFilters] = useState({
        year: "",
        examType: "",
        mode: "",
    });
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
                const response = await fetch(`${API_BASE_URL}/api/answer-reviewers/${userId}`, {
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
            }
        };

        fetchUserResults();
    }, []);

    const handleQuizSelection = (examType, mode, testId) => {
        const filteredResults = userResults.filter(
            (item) =>
                item.question.examType === examType &&
                item.mode === mode &&
                item.test_id === testId
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

    const getUniqueExamData = () => {
        const uniqueExamDataMap = new Map();

        userResults.forEach((item) => {
            const uniqueKey = `${item.question.examType}_${item.mode}_${item.test_id}`;
            if (!uniqueExamDataMap.has(uniqueKey)) {
                uniqueExamDataMap.set(uniqueKey, {
                    examType: item.question.examType,
                    mode: item.mode,
                    testId: item.test_id,
                    createdAt: item.createdAt,
                });
            }
        });

        return Array.from(uniqueExamDataMap.values());
    };

    const getFilterOptions = (key) => {
        const uniqueValues = new Set(
            userResults.map((item) =>
                key === "year"
                    ? new Date(item.createdAt).getFullYear()
                    : key === "examType"
                        ? item.question?.examType // Access examType from question
                        : item[key]
            )
        );
        return Array.from(uniqueValues);
    };
    

    const filteredExamData = getUniqueExamData().filter((data) => {
        const year = new Date(data.createdAt).getFullYear();
        return (
            (!selectedFilters.year || year === parseInt(selectedFilters.year)) &&
            (!selectedFilters.examType || data.examType === selectedFilters.examType) &&
            (!selectedFilters.mode || data.mode === selectedFilters.mode)
        );
    });

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

            <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 py-8">
                <h1 className="text-3xl text-center font-semibold text-[#2148C0] mb-6">
                    Check Your Quiz Result
                </h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="w-full max-w-4xl mb-6 flex gap-4">
                    <select
                        className="w-full p-2 border rounded-lg"
                        value={selectedFilters.year}
                        onChange={(e) =>
                            setSelectedFilters((prev) => ({
                                ...prev,
                                year: e.target.value,
                            }))
                        }
                    >
                        <option value="">All Years</option>
                        {getFilterOptions("year").map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-full p-2 border rounded-lg"
                        value={selectedFilters.examType}
                        onChange={(e) =>
                            setSelectedFilters((prev) => ({
                                ...prev,
                                examType: e.target.value,
                            }))
                        }
                    >
                        <option value="">All Exam Types</option>
                        {getFilterOptions("examType").map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-full p-2 border rounded-lg capitalize "
                        value={selectedFilters.mode}
                        onChange={(e) =>
                            setSelectedFilters((prev) => ({
                                ...prev,
                                mode: e.target.value,
                            }))
                        }
                    >
                        <option className="captalize" value="">All Modes</option>
                        {getFilterOptions("mode").map((mode) => (
                            <option className="capitalize" key={mode} value={mode}>
                                {mode}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full max-w-4xl">
                    <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
                        <thead>
                            <tr className="bg-[#2148C0] text-white">
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">Exam Type</th>
                                <th className="border border-gray-300 px-4 py-2">Mode</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExamData.map((data, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-blue-50 ${selectedExam.testId === data.testId ? "bg-blue-100" : ""
                                        }`}
                                >
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {new Date(data.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
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
                                                handleQuizSelection(data.examType, data.mode, data.testId)
                                            }
                                        >
                                            Check Result
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
