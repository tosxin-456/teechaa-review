import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Result2Page = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result } = location.state || {};

    if (!result || result.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-2xl text-red-500">No Results Found</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-[#2148C0] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Map numeric answers back to letter options
    const getOptionLabel = (value) => {
        const optionsMap = { 1: "A", 2: "B", 3: "C", 4: "D" };
        return optionsMap[value] || value;
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex items-center mt-6 ml-3 bg-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
            </div>

            <main className="flex-grow flex flex-col items-center bg-gray-100 py-8">
                <h1 className="text-3xl font-semibold text-[#2148C0] mb-6">
                    Your Quiz Results
                </h1>

                <div className="grid gap-6 w-full max-w-4xl">
                    {result.map((item, index) => (
                        <div
                            key={index}
                            className={`p-4 border rounded-lg shadow-md ${item.isCorrect
                                ? "bg-green-50 border-green-500"
                                : "bg-red-50 border-red-500"
                                }`}
                        >
                            <h2 className="text-lg font-bold text-[#2148C0] mb-2">
                                Question {index + 1}
                            </h2>
                            <p className="text-gray-700 mb-2">
                                <strong>Question:</strong> {item.question}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Options:</strong>
                                <ul className="ml-4">
                                    {Object.entries(item.options).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    ))}
                                </ul>
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Correct Answer:</strong>{" "}
                                {getOptionLabel(item.correctAnswer)}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Your Answer:</strong>{" "}
                                {getOptionLabel(item.selectedOption)}
                            </p>
                            <p
                                className={`font-bold ${item.isCorrect ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {item.isCorrect ? "Correct" : "Incorrect"}
                            </p>
                            {item.explanation && (
                                <p className="text-gray-600 mt-2">
                                    <strong>Explanation:</strong> {item.explanation}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            <footer className="text-center text-gray-300 py-4 bg-black bg-opacity-40">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Result2Page;
