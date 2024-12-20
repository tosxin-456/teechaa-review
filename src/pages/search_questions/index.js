import React, { useState } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchQuestions = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        year: "",
        subject: "",
        difficulty: "",
        examType: "",
        query: "",
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        alert(`Searching for questions with filters: ${JSON.stringify(filters, null, 2)}`);
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-white to-blue-50">

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-6 py-10">
                {/* Back Button */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                    >
                        <FaArrowLeft className="text-xl" />
                        Back
                    </button>
                </div>

                {/* Welcome Section */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-[#2148C0] mb-3">Search Questions</h2>
                    <p className="text-lg text-gray-600">Filter by year, subject, exam type, or search directly using keywords.</p>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Search Input */}
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

                        {/* Year Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                            <select
                                name="year"
                                value={filters.year}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#2148C0] focus:border-[#2148C0] shadow-sm"
                            >
                                <option value="">Select Year</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                            </select>
                        </div>

                        {/* Subject Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <select
                                name="subject"
                                value={filters.subject}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#2148C0] focus:border-[#2148C0] shadow-sm"
                            >
                                <option value="">Select Subject</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="English">English</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="History">History</option>
                            </select>
                        </div>

                        {/* Exam Type Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                            <select
                                name="examType"
                                value={filters.examType}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#2148C0] focus:border-[#2148C0] shadow-sm"
                            >
                                <option value="">Select Exam Type</option>
                                <option value="JAMB">JAMB</option>
                                <option value="WAEC">WAEC</option>
                                <option value="NECO">NECO</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Button */}
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
            </main>

            {/* Footer */}
            <footer className="text-center text-gray-300 py-4 bg-[#2148C0] text-sm">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SearchQuestions;
