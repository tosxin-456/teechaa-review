import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaUniversity, FaArrowLeft } from "react-icons/fa";
import { examHistory, studentAnswers } from "../../utils/result_data";
import { QuizData } from "../../utils/questions";

const SelectQuiz = () => {
    const navigate = useNavigate();
    const [selectedExam, setSelectedExam] = useState({ examType: "", year: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleQuizSelection = (examType) => {
        if (!selectedExam.year) {
            alert("Please select the exam year.");
            return;
        }

        setLoading(true);
        setError("");

        // Fetch the student's answers
        const results = studentAnswers.filter(
            (item) => item.examType === examType && item.year === selectedExam.year
        );

        if (results.length === 0) {
            setError("No results found for the selected exam and year.");
            setLoading(false);
            return;
        }

        // Fetch questions matching examType and year
        const questions = QuizData.find(
            (item) =>
                item.examType === examType &&
                item.year === selectedExam.year &&
                item.subject === "Mathematics"
        )?.questions;

        if (!questions) {
            setError("No questions available for the selected exam type and year.");
            setLoading(false);
            return;
        }

        setLoading(false);

        // Navigate with results and questions
        navigate("/result", { state: { results, questions } });
    };

    const uniqueYears = (examType) => {
        return [
            ...new Set(studentAnswers.filter((item) => item.examType === examType).map((item) => item.year)),
        ];
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex items-center mt-6 ml-3 bg-gray-100 ">
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
            </div>
            <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 py-8">
                {/* Title */}
                <h1 className="text-3xl text-center font-semibold text-[#2148C0] mb-6 animate__animated animate__fadeIn">Check Your Quiz Result By Selecting The Year</h1>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 mb-4 animate__animated animate__shakeX">
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {/* WAEC Exam Section */}
                    <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg hover:shadow-2xl hover:bg-blue-50 transition-all duration-300">
                        <FaGraduationCap className="text-4xl text-[#2148C0] mb-4 transition-transform transform hover:scale-125" />
                        <h2 className="text-lg font-semibold text-[#2148C0] mb-2">WAEC</h2>

                        {/* WAEC Year Containers */}
                        <div className="grid grid-cols-2 gap-4">
                            {uniqueYears("WAEC").map((year) => (
                                <div
                                    key={year}
                                    className={`p-4 rounded-lg shadow-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-xl ${selectedExam.examType === "WAEC" && selectedExam.year === year
                                        ? "bg-[#2148C0] text-white"
                                        : "bg-white text-[#2148C0]"
                                        }`}
                                    onClick={() => setSelectedExam({ examType: "WAEC", year })}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* JAMB Exam Section */}
                    <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg hover:shadow-2xl hover:bg-blue-50 transition-all duration-300">
                        <FaUniversity className="text-4xl text-[#2148C0] mb-4 transition-transform transform hover:scale-125" />
                        <h2 className="text-lg font-semibold text-[#2148C0] mb-2">JAMB</h2>

                        {/* JAMB Year Containers */}
                        <div className="grid grid-cols-2 gap-4">
                            {uniqueYears("JAMB").map((year) => (
                                <div
                                    key={year}
                                    className={`p-4 rounded-lg shadow-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-xl ${selectedExam.examType === "JAMB" && selectedExam.year === year
                                        ? "bg-[#2148C0] text-white"
                                        : "bg-white text-[#2148C0]"
                                        }`}
                                    onClick={() => setSelectedExam({ examType: "JAMB", year })}
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Check Result Button */}
                <button
                    onClick={() => handleQuizSelection(selectedExam.examType)}
                    className="bg-[#2148C0] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mt-6 transform hover:scale-105"
                    disabled={loading || !selectedExam.year}
                >
                    {loading ? "Loading..." : "Check Result"}
                </button>
            </main>

            {/* Footer */}
            <footer className="text-center text-gray-300 py-4 bg-black bg-opacity-40">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SelectQuiz;
