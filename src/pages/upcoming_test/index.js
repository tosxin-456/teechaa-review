import React from "react";
import { FaArrowLeft, FaLaptopCode, FaBook, FaFlask } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const upcomingTestsData = [
    {
        testName: "Mathematics Mock Test",
        date: "2024-01-15",
        time: "10:00 AM",
        duration: "1 hour",
        description: "A practice test to prepare for WAEC Mathematics exam.",
        icon: <FaLaptopCode className="text-3xl text-[#2148C0]" />,
        clickable: true, // Make it clickable
        path: "/take-math-test" // Example path to navigate when clicked
    },
    {
        testName: "English Grammar Test",
        date: "2024-01-20",
        time: "2:00 PM",
        duration: "45 minutes",
        description: "A short test on English grammar and composition skills.",
        icon: <FaBook className="text-3xl text-[#2148C0]" />,
        clickable: false // Not clickable
    },
    {
        testName: "Physics Practical Exam",
        date: "2024-01-25",
        time: "9:00 AM",
        duration: "1.5 hours",
        description: "Focuses on practical experiments and theories for JAMB Physics.",
        icon: <FaFlask className="text-3xl text-[#2148C0]" />,
        clickable: true, // Make it clickable
        path: "/take-physics-test" // Example path to navigate when clicked
    },

];

const UpcomingTests = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
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
                </div>

                {/* Welcome Section */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-[#2148C0] mb-3">Upcoming Tests</h2>
                    <p className="text-lg text-gray-600">
                        Stay informed about your upcoming tests and prepare ahead.
                    </p>
                </div>

                {/* Upcoming Tests List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 lg:w-[80%] mx-auto">
                    {upcomingTestsData.map((test, index) => (
                        <div
                            key={index}
                            className={`bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between ${test.clickable ? "hover:cursor-pointer hover:scale-105 transform transition" : ""}`}
                            onClick={() => test.clickable && navigate(test.path)} // Navigate if clickable
                        >
                            <div className="flex items-center mb-4">
                                <div className="text-white text-xl mr-4">{test.icon}</div>
                                <h3 className="text-xl font-bold text-[#2148C0]">{test.testName}</h3>
                            </div>
                            <p className="text-gray-600 mb-2">
                                <strong>Date:</strong> {test.date}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Time:</strong> {test.time}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Duration:</strong> {test.duration}
                            </p>
                            <p className="text-gray-600 mb-4">
                                <strong>Description:</strong> {test.description}
                            </p>

                            {/* If clickable, add "Take Test" button */}
                            {test.clickable && (
                                <button className="w-full bg-[#2148C0] text-white p-3 rounded-lg text-sm hover:bg-gray-500 transition">
                                    Take Test
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
            </div>
                <footer className="text-center text-gray-300 py-4 bg-[#2148C0] text-sm mt-10">
                    <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
                </footer>
        </div>
    );
};

export default UpcomingTests;
