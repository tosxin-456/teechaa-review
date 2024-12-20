import React, { useState } from "react";
import { FaBook, FaPen, FaClipboard, FaRandom, FaClock, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { QuizData } from "../../utils/questions";

const subjects = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "English" },
    { id: 3, name: "Physics" },
    { id: 4, name: "Chemistry" },
    { id: 5, name: "Biology" },
    { id: 6, name: "Government" },
];

const TakeWaecQuiz = () => {
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [filters, setFilters] = useState({});
    const [mode, setMode] = useState("");
    const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const goBack = () => {
        navigate(-1);
    };

    const toggleSubject = (id) => {
        setSelectedSubjects((prev) =>
            prev.includes(id)
                ? prev.filter((subjectId) => subjectId !== id)
                : [...prev, id]
        );

        if (selectedSubjects.includes(id)) {
            const newFilters = { ...filters };
            delete newFilters[id];
            setFilters(newFilters);
        }
    };

    const updateFilter = (subjectId, field, value) => {
        setFilters((prev) => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                [field]: value,
            },
        }));
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const startTimer = () => {
        setIsTimerRunning(true);
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 0) return prev - 1;
                clearInterval(interval);
                return 0;
            });
        }, 1000);
    };

    const handleTimeChange = (amount) => {
        if (!isTimerRunning) {
            setTimeLeft((prev) => Math.max(0, prev + amount));
        }
    };
    const navigate = useNavigate()

    return (
        <div>
            {/* Header with Back Button */}
            <div className="flex items-center mb-2 mt-6 ">
                <button
                    onClick={goBack}
                    className="flex items-center ml-[30px] gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                >
                    <FaArrowLeft className="text-xl" />
                    Back
                </button>
            </div>
            <div className="min-h-screen bg-gray-50 py-10 px-6">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-center mb-8 text-[#2148C0]">
                            Take WAEC Quiz Now
                        </h1>

                        <button
                            onClick={() => navigate('/schedule-exam')}
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 transition"
                        >
                            <FaCalendarAlt className="mr-2 text-2xl" />
                            Schedule Exam
                        </button>
                    </div>
                    {/* Subject Selection */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Subjects</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {QuizData.map((subject) => (
                                <label
                                    key={subject.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSubjects.includes(subject.id)}
                                        onChange={() => toggleSubject(subject.id)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="text-gray-700">{subject.subject}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filters for Each Subject */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Filters (for each subject)
                        </h2>
                        {selectedSubjects.map((subjectId) => {
                            const subject = subjects.find((s) => s.id === subjectId);
                            const subjectQuizData = QuizData.filter(
                                (quiz) => quiz.subject === subject.name && quiz.examType === "WAEC"
                            );

                            // Extract unique years for this subject
                            const years = [...new Set(subjectQuizData.map((quiz) => quiz.year))];

                            // Calculate the maximum number of questions (in multiples of 5)
                            const totalQuestions = subjectQuizData.reduce((acc, quiz) => acc + quiz.questions.length, 0);
                            const numQuestionOptions = Array.from(
                                { length: Math.floor(totalQuestions / 5) },
                                (_, index) => (index + 1) * 5
                            );

                            return (
                                <div
                                    key={subjectId}
                                    className="border rounded-lg p-4 mb-4 bg-gray-100"
                                >
                                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                                        {subject.name}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">
                                                Year
                                            </label>
                                            <select
                                                value={filters[subjectId]?.year || ""}
                                                onChange={(e) =>
                                                    updateFilter(subjectId, "year", e.target.value)
                                                }
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                                            >
                                                <option value="">Select Year</option>
                                                {years.map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-1">
                                                Number of Questions
                                            </label>
                                            <select
                                                value={filters[subjectId]?.numQuestions || ""}
                                                onChange={(e) =>
                                                    updateFilter(subjectId, "numQuestions", e.target.value)
                                                }
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                                            >
                                                <option value="">Select Number</option>
                                                {numQuestionOptions.map((num) => (
                                                    <option key={num} value={num}>
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                    {/* Modes */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Modes</h2>
                        <div className="flex justify-around">
                            <button
                                onClick={() => setMode("study")}
                                className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${mode === "study" ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                <FaBook className="text-2xl mb-2" />
                                <span>Study</span>
                            </button>
                            <button
                                onClick={() => setMode("practice")}
                                className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${mode === "practice" ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                <FaPen className="text-2xl mb-2" />
                                <span>Practice</span>
                            </button>
                            <button
                                onClick={() => setMode("mock")}
                                className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${mode === "mock" ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                <FaClipboard className="text-2xl mb-2" />
                                <span>Mock</span>
                            </button>
                            <button
                                onClick={() => setMode("goat")}
                                className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${mode === "goat" ? "bg-blue-600 text-white" : "bg-gray-200"
                                    }`}
                            >
                                <FaRandom className="text-2xl mb-2" />
                                <span>GOAT</span>
                            </button>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Set Timer</h2>
                        <div className="flex items-center gap-4">
                            <FaClock className="text-blue-600 text-2xl" />
                            <input
                                type="time"
                                step="1" // Allows specifying hours, minutes, and seconds
                                value={new Date(timeLeft * 1000).toISOString().substr(11, 8)} // Converts seconds to HH:MM:SS
                                onChange={(e) => {
                                    const [hours, minutes, seconds] = e.target.value.split(":").map(Number);
                                    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                                    setTimeLeft(totalSeconds);
                                }}
                                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-600 text-lg font-bold text-gray-700"
                            />
                        </div>
                    </div>



                    {/* Start Quiz Button */}
                    <div className="text-center">
                        <button
                            onClick={()=>navigate('/exam')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition"
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="text-center text-gray-300 py-4 bg-[#2148C0] text-sm">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default TakeWaecQuiz;
