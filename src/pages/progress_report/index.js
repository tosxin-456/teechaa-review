import React, { useEffect, useState } from "react";
import { FaSearch, FaArrowLeft, FaSave, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config/apiConfig";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#d45087", "#2ca02c"];

const examData = [
    { year: 2021, subject: "Mathematics", correct: 30, examType: "WAEC" },
    { year: 2021, subject: "English", correct: 25, examType: "WAEC" },
    { year: 2021, subject: "Physics", correct: 20, examType: "JAMB" },
    { year: 2022, subject: "Mathematics", correct: 25, examType: "WAEC" },
    { year: 2022, subject: "English", correct: 20, examType: "JAMB" },
    { year: 2022, subject: "Physics", correct: 30, examType: "WAEC" },
    { year: 2023, subject: "Mathematics", correct: 50, examType: "JAMB" },
    { year: 2023, subject: "English", correct: 45, examType: "WAEC" },
    { year: 2023, subject: "Physics", correct: 10, examType: "JAMB" },
];

const ProgressReport = () => {
    const [selectedYear, setSelectedYear] = useState("All");
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [selectedExamType, setSelectedExamType] = useState("All");
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.user_id
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUserProgress = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.user_id;

            if (!userId) {
                // setError("User not logged in.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/progress/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch user results');
                }

                const progressiveData = await response.json();
                setLoading(false)
                console.log('Normalized Data:', progressiveData);
                setProgressData(progressiveData);
            } catch (error) {
                console.error('Error fetching result data:', error.message);
                // setError('Failed to fetch user results.');
            }
        };


        fetchUserProgress();
    }, []);

    if (loading) {
        return <div>Loading progress...</div>;
    }

    if (progressData.length === 0) {
        return <div>No progress data available for this user.</div>;
    }



    const filteredData = progressData.filter((entry) => {
        return (
            (selectedYear === "All" || entry.year === Number(selectedYear)) &&
            (selectedSubject === "All" || entry.subject === selectedSubject) &&
            (selectedExamType === "All" || entry.examType === selectedExamType)
        );
    });

    const goBack = () => {
        navigate(-1);
    };


    const lineChartData = (() => {
        const allYears = [...new Set(progressData.map((item) => item.year))];
        const minYear = Math.min(...allYears);
        const maxYear = Math.max(...allYears);

        // Create a range of years from minYear to maxYear
        const yearRange = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

        // Fill in missing data for each year
        return yearRange.map((year) => {
            const yearData = filteredData.filter((entry) => entry.year === year);
            const dataEntry = { year };

            yearData.forEach((entry) => {
                dataEntry[entry.subject] = entry.correct;
            });

            return dataEntry;
        });
    })();


    const donutChartData = filteredData.reduce((acc, entry) => {
        const found = acc.find((item) => item.subject === entry.subject);
        if (!found) {
            acc.push({ subject: entry.subject, value: entry.correct });
        } else {
            found.value += entry.correct;
        }
        return acc;
    }, []);

    const totalCorrect = filteredData.reduce((sum, entry) => sum + entry.correct, 0);
    const aggregatePercentage = filteredData.length
        ? ((totalCorrect / (filteredData.length * 50)) * 100).toFixed(2)
        : 0;

    const subjectAnalysis = donutChartData.map((entry) => ({
        subject: entry.subject,
        mean: (entry.value / filteredData.filter((data) => data.subject === entry.subject).length).toFixed(2),
    }));

    const handleSave = () => {
        // Logic to save the report as a file
        console.log("Save report functionality coming soon!");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>

            <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
                {/* Back Button */}
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

                {/* Welcome Section */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-[#2148C0] mb-3">Progress Report</h2>
                    <p className="text-lg text-gray-600">Filter by year, subject, exam type, or search directly using keywords.</p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <select
                        className="p-2 border rounded"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="All">All Years</option>
                        {[...new Set(progressData.map((item) => item.year))].map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <select
                        className="p-2 border rounded"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="All">All Subjects</option>
                        {[...new Set(progressData.map((item) => item.subject))].map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>

                    <select
                        className="p-2 border rounded"
                        value={selectedExamType}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                    >
                        <option value="All">All Exam Types</option>
                        {[...new Set(progressData.map((item) => item.examType))].map((examType) => (
                            <option key={examType} value={examType}>
                                {examType}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg lg:w-[80%] lg:m-auto shadow-lg">
                    {/* Donut Chart */}
                    <div className="flex flex-col items-center justify-center">
                        <PieChart width={300} height={300}>
                            <Pie
                                data={donutChartData}
                                dataKey="value"
                                nameKey="subject"
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                fill="#82ca9d"
                                paddingAngle={5}
                                labelLine={false}
                            >
                                {donutChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <div className="absolute text-center text-gray-800 font-bold text-xl">
                            {aggregatePercentage}%
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="overflow-auto">
                        <LineChart
                            width={400}
                            height={300}
                            data={lineChartData}
                            className="mx-auto"
                        >
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {Object.keys(lineChartData[0] || {})
                                .filter((key) => key !== "year")
                                .map((subject, index) => (
                                    <Line
                                        key={subject}
                                        type="monotone"
                                        dataKey={subject}
                                        name={subject}
                                        stroke={COLORS[index % COLORS.length]}
                                        strokeWidth={2}
                                        dot={false} // Removes circle markers
                                    />
                                ))}
                        </LineChart>
                        <p className="mt-4 text-center text-gray-700 font-semibold">
                            Progress based on years answered and latest data
                        </p>
                    </div>
                </div>

                {/* Subject Analysis */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Subject Analysis</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b text-left p-2">Subject</th>
                                <th className="border-b text-left p-2">Mean Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectAnalysis.map((item, index) => (
                                <tr key={index}>
                                    <td className="border-b p-2">{item.subject}</td>
                                    <td className="border-b p-2">{item.mean}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Exam History</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b text-left p-2">Date</th>
                                <th className="border-b text-left p-2">Subject</th>
                                <th className="border-b text-left p-2">Score (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progressData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border-b p-2">
                                        {new Date(item.createdAt).toLocaleDateString()} {/* Formats the date */}
                                    </td>
                                    <td className="border-b p-2">{item.subject}</td>
                                    <td className="border-b p-2">
                                        {item.correct}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            {/* Footer */}
            <footer className="text-center text-gray-300 py-4 bg-[#2148C0] text-sm">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ProgressReport;
