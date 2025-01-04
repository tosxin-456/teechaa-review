import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Results2Page = () => {
    const { state } = useLocation();
    const { results, selectedSubject } = state || {};
    const navigate = useNavigate();
    console.log(results)
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            <nav className="bg-[#2148C0] shadow-md px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Results</h1>
                <button
                    onClick={handleGoBack}
                    className="text-white bg-[#2148C0] hover:bg-blue-600 px-4 py-2 rounded-lg"
                >
                    Back to Exam
                </button>
            </nav>
            <div className="flex-grow p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#2148C0]">
                    {selectedSubject} - Exam Results
                </h2>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                    {results?.map((result, index) => (
                        <div
                            key={index}
                            className="mb-4 border-b border-gray-200 pb-4 last:border-0"
                        >
                            <h3 className="text-base sm:text-lg font-semibold mb-2">
                                {index + 1}. {result.question}
                            </h3>
                            <div>
                                <p>
                                    <strong>Your Answer:</strong>{" "}
                                    <span
                                        className={`font-bold ${result.isCorrect ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {result.selectedOption !== undefined
                                            ? String.fromCharCode(65 + result.selectedOption)
                                            : "Not Answered"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Correct Answer:</strong>{" "}
                                    <span className="font-bold text-green-500">
                                        {String.fromCharCode(65 + result.correctOption)}
                                    </span>
                                </p>
                                {result.isCorrect ? (
                                    <p className="text-green-500 font-semibold">Correct!</p>
                                ) : (
                                    <p className="text-red-500 font-semibold">Incorrect</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Results2Page;
