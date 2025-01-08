import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

    // Fetch unique filter values (e.g., years, subjects, exam types)
    const [filterOptions, setFilterOptions] = useState({
        years: [],
        subjects: [],
        examTypes: [],
    });

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch("/questions/filters");
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

        const queryString = new URLSearchParams(filters).toString();
        try {
            const response = await fetch(`/questions/search?${queryString}`);
            if (!response.ok) throw new Error("Failed to fetch search results");
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error during search:", error);
            setError("Failed to fetch search results. Please try again later.");
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

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-white to-blue-50">
            <main className="flex-grow container mx-auto px-6 py-10">
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

                <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

                {loading && <p className="text-center mt-6 text-lg">Loading...</p>}

                {error && <p className="text-center mt-6 text-lg text-red-500">{error}</p>}

                {results.length > 0 && (
                    <div className="mt-10 bg-white p-8 rounded-xl shadow-xl">
                        <h3 className="text-2xl font-bold text-[#2148C0] mb-6">Search Results</h3>
                        {results.map((result) => (
                            <div key={result.id} className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                    {result.subject} ({result.examType}, {result.year})
                                </h4>
                                <p className="text-gray-600 mb-3">{result.question}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>
                                        <strong>A:</strong> {result.option_a}
                                    </li>
                                    <li>
                                        <strong>B:</strong> {result.option_b}
                                    </li>
                                    <li>
                                        <strong>C:</strong> {result.option_c}
                                    </li>
                                    <li>
                                        <strong>D:</strong> {result.option_d}
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm text-gray-500">
                                    <strong>Correct Answer:</strong> {result[`option_${result.correctAnswer.toLowerCase()}`]}
                                </p>
                                <p className="mt-3 text-sm text-gray-500">
                                    <strong>Explanation:</strong> {result.explanation}
                                </p>
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
