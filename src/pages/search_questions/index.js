import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";

const SearchQuestions = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        year: "",
        subject: "",
        examType: "",
        query: "",
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [filterOptions, setFilterOptions] = useState({
        years: [],
        subjects: [],
        examTypes: [],
    });

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/questions/filter`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token from localStorage
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch filter options");
                const data = await response.json();
                setFilterOptions(data);
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };

        fetchFilterOptions();
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryString = new URLSearchParams({
                year: filters.year,
                subject: filters.subject,
                examType: filters.examType,
            }).toString();

            const response = await fetch(`${API_BASE_URL}/api/questions/search/${filters.query}?${queryString}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token from localStorage
                },
            });
            if (!response.ok) throw new Error("Failed to fetch search results");
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error during search:", error);
            setError("Result not found");
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }, [results]);

    const highlightText = (text, searchWord) => {
        if (!searchWord) return text;
        const regex = new RegExp(`(${searchWord})`, "gi"); // Case-insensitive match
        return text.replace(regex, '<span class="bg-yellow-300 font-bold">$1</span>');
    };

    console.log(results)
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-white to-blue-50">
            <main className="flex-grow container mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                    >
                        <FaArrowLeft className="text-xl" />
                        Back
                    </button>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-[#2148C0] mb-3">Search Questions</h2>
                    <p className="text-lg text-gray-600">Filter by year, subject, exam type, or search directly using keywords.</p>
                </div>

                {/* Filter Form */}
                <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-2 lg:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Keywords</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="query"
                                    value={filters.query}
                                    onChange={handleChange}
                                    placeholder="Enter keywords (e.g., algebra, independence, oxidation)"
                                    className="w-full border border-gray-300 rounded-lg p-3 pl-12 focus:ring-[#2148C0] focus:border-[#2148C0] shadow-sm"
                                />
                                <FaSearch className="absolute top-4 left-4 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                            <select
                                name="year"
                                value={filters.year}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#2148C0] focus:border-[#2148C0] shadow-sm"
                            >
                                <option value="">Select Year</option>
                                {filterOptions.years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <select
                                name="subject"
                                value={filters.subject}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#2148C0] focus:border-[#2148C0] shadow-sm"
                            >
                                <option value="">Select Subject</option>
                                {filterOptions.subjects.map((subject, index) => (
                                    <option key={index} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                            <select
                                name="examType"
                                value={filters.examType}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#2148C0] focus:border-[#2148C0] shadow-sm"
                            >
                                <option value="">Select Exam Type</option>
                                {filterOptions.examTypes.map((examType, index) => (
                                    <option key={index} value={examType}>
                                        {examType}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleSearch}
                            className="mt-6 bg-[#2148C0] text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition inline-flex items-center"
                        >
                            <FaSearch className="mr-2" />
                            Search Questions
                        </button>
                    </div>
                </div>

                {/* Results */}
                {loading && <p className="text-center mt-6 text-lg">Loading...</p>}
                {error && <p className="text-center mt-6 text-lg text-red-500">{error}</p>}

                {results.length > 0 && (
                    <div className="mt-10 bg-white overflow-y-auto h-[30rem] p-8 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-bold text-[#2148C0] mb-6">Search Results</h3>
                        {results.map((result) => (
                            <div key={result.id} className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                    {result.subject} ({result.examType}, {result.year})
                                </h4>
                                <p
                                    className="text-gray-600 mb-3"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightText(result.question, filters.query),
                                    }}
                                ></p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li dangerouslySetInnerHTML={{ __html: highlightText(`A: ${result.option_a}`, filters.query) }}></li>
                                    <li dangerouslySetInnerHTML={{ __html: highlightText(`B: ${result.option_b}`, filters.query) }}></li>
                                    <li dangerouslySetInnerHTML={{ __html: highlightText(`C: ${result.option_c}`, filters.query) }}></li>
                                    <li dangerouslySetInnerHTML={{ __html: highlightText(`D: ${result.option_d}`, filters.query) }}></li>
                                </ul>
                                <p className="mt-3 text-sm text-gray-500">
                                    <strong>Correct Answer:</strong>
                                    {result.correctAnswer === "1" && ` A: ${result.option_a}`}
                                    {result.correctAnswer === "2" && ` B: ${result.option_b}`}
                                    {result.correctAnswer === "3" && ` C: ${result.option_c}`}
                                    {result.correctAnswer === "4" && ` D: ${result.option_d}`}
                                </p>
                                <p
                                    className="mt-3 text-sm text-gray-500"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightText(result.explanation, filters.query),
                                    }}
                                ></p>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="text-center text-gray-300 py-4 bg-[#2148C0] text-sm">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SearchQuestions;
