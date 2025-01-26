import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import "tailwindcss/tailwind.css";
import { API_BASE_URL } from "../../config/apiConfig";
import { FaSearch, FaArrowLeft, FaSave, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ClipLoader, RingLoader } from "react-spinners";
const ExamHistory = () => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserResults = async () => {
            setLoading(true)
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.user_id;

            if (!userId) return;

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
                setRawData(resultData.data);
            } catch (error) {
                console.error("Error fetching results:", error.message);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUserResults();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <RingLoader color="#4A90E2" size={50} />
                <p className="ml-4 text-blue-600 font-medium">Loading your progress...</p>
            </div>
        );
    }

    const exams = rawData.reduce((result, item) => {
        const existingExam = result.find((exam) => exam.id === item.test_id);

        if (!existingExam) {
            result.push({
                id: item.test_id,
                title: `Test ${item.test_id}`,
                date: new Date(item.createdAt).toISOString().split("T")[0],
                examType: item.question.examType,
                subjectCount: 1,
                totalQuestions: 0,
                correctAnswers: 0,
            });
        }



        const exam = result.find((exam) => exam.id === item.test_id);
        exam.totalQuestions += 1;
        exam.correctAnswers += item.is_correct ? 1 : 0;
        exam.subjectCount = new Set(
            rawData
                .filter((data) => data.test_id === exam.id)
                .map((data) => data.question.subject)
        ).size;
        exam.score = Math.round((exam.correctAnswers / exam.totalQuestions) * 100);

        return result;
    }, []);

    console.log(exams)

    const handleSave = () => {
        // Logic to save the report as a file
        console.log("Save report functionality coming soon!");
    };

    const handlePrint = () => {
        window.print();
    };

    const goBack = () => {
        navigate(-1);
    };

    if (exams.length === 0) {
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
                    <div className="flex gap-4">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                        >
                            <FaSave className="text-xl" />
                            Save
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                        >
                            <FaPrint className="text-xl" />
                            Print
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center flex-grow bg-gray-100">
                    <p className="text-lg font-medium text-gray-600">
                        No exam history available for this user.
                    </p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formattedData = exams.map((exam) => ({
        ...exam,
        // score: ((exam.score / exam.totalQuestions) * 100).toFixed(0),
        date: new Date(exam.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
    }));


    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                    >
                        <FaSave className="text-xl" />
                        Save
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                    >
                        <FaPrint className="text-xl" />
                        Print
                    </button>
                </div>
            </div>
            <h2 className="text-4xl font-extrabold text-[#2148C0] text-center mb-3">Exam History</h2>

            {/* Loading Indicator */}
            {loading ? (
                <div className="text-center text-gray-500">Loading your exam history...</div>
            ) : (
                <>
                    {/* Line Chart Section */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-600 mb-4">
                            Performance Over Time(%)
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={formattedData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fill: "#374151" }} />
                                <YAxis tick={{ fill: "#374151" }} domain={[0, 100]} />
                                <Tooltip
                                    formatter={(value) => `${value}%`}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Exam Table Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-600 mb-4">Exam Details</h2>
                        {exams.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 text-left">
                                            <th className="border border-gray-200 px-4 py-2">Title</th>
                                            <th className="border border-gray-200 px-4 py-2">Date</th>
                                            <th className="border border-gray-200 px-4 py-2">Exam Type</th>
                                            <th className="border border-gray-200 px-4 py-2">Subjects</th>
                                            {/* <th className="border border-gray-200 px-4 py-2">Answered</th> */}
                                            <th className="border border-gray-200 px-4 py-2">Total</th>
                                            <th className="border border-gray-200 px-4 py-2">Score (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exams.map((exam) => (
                                            <tr
                                                key={exam.id}
                                                className="hover:bg-gray-50 transition"
                                            >
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {exam.id}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {formatDate(exam.date)}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {exam.examType}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {exam.subjectCount}
                                                </td>
                                                {/* <td className="border border-gray-200 px-4 py-2">
                                                    {exam.correctAnswers}
                                                </td> */}
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {exam.totalQuestions}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {(exam.score).toFixed(2)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">No exams found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ExamHistory;
