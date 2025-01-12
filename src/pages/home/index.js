import React from "react";
import {
    FaSignOutAlt,
    FaUser,
    FaBook,
    FaQuestionCircle,
    FaChartLine,
    FaHistory,
    FaClipboardCheck,
    FaMoon,
    FaSun
} from "react-icons/fa"; // Icons
import Carousel from "../../components/dashboardCarousel";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize navigate function

    const sections = [
        { id: 1, title: "Take JAMB", description: "Prepare for the JAMB exam with the best resources and mock tests.", icon: <FaBook color="#2148C0" />, path: "/take-jamb" },
        { id: 2, title: "Take WAEC", description: "Ace your WAEC exam with our extensive study materials and practice tests.", icon: <FaClipboardCheck color="#2148C0" />, path: "/take-waec" },
        { id: 3, title: "Questions Search", description: "Find detailed questions and answers for exams.", icon: <FaQuestionCircle color="#2148C0" />, path: "/search-questions" },
        { id: 4, title: "Progress Report", description: "Track your progress and performance.", icon: <FaChartLine color="#2148C0" />, path: "/progress-report" },
        { id: 5, title: "Exam History", description: "Stay updated on your exams history", icon: <FaHistory color="#2148C0" />, path: "/exam-history"},
        { id: 6, title: "Result Checker", description: "Check your results instantly.", icon: <FaClipboardCheck color="#2148C0" />, path: "/result-checker" },
    ];

    const user = JSON.parse(localStorage.getItem('user'))

    const logout = () => {
        localStorage.clear();
        navigate('/');
    };


    return (
        <div className="min-h-screen flex flex-col bg-white shadow-md ">
            {/* Header */}
            <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
                <h1 className="text-2xl font-bold text-[#2148C0]">TeeChaa Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <button className="text-[#2148C0] flex items-center">
                        <FaMoon className="mr-2" />
                        <span className="hidden sm:inline">Dark Mode</span>
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-[#2148C0] flex items-center hover:underline"
                    >
                        <FaUser className="mr-2" />
                        <span className="hidden sm:inline">Profile</span>
                    </button>
                    <button
                        onClick={logout}
                        className="text-red-500 flex items-center hover:underline"
                    >
                        <FaSignOutAlt className="mr-2" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>


            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-4 lg:py-6">
                {/* Welcome Section */}
                <div className="text-center mb-4 lg:mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#2148C0] mb-2">Welcome Back, <span className="text-gray-600" >{user?.firstName}</span>!</h2>
                    <p className="text-gray-600">Explore the features below and get started.</p>
                </div>

                {/* Flex Container for Carousel and Sections */}
                <div className="flex flex-col rounded-md md:w-[80%] md:m-auto lg:flex-row-reverse md:p-2 lg:items-start lg:justify-center ">
                    {/* Carousel */}
                    <div className="lg:w-[40%] mb-4 lg:mb-0">
                        <Carousel />
                    </div>

                    {/* Sections Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 lg:w-[60%] hover:cursor-pointer ">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                onClick={() => navigate(section.path)} // Navigate to the specified path
                                className="bg-white text-[#2148C0] p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 flex flex-col justify-between"
                            >
                                <div className="flex items-center mb-2">
                                    <div className="text-white text-xl lg:text-xl mr-2">
                                        {section.icon}
                                    </div>
                                    <h3 className="text-sm lg:text-sm font-bold">{section.title}</h3>
                                </div>
                                <p className="text-gray-800 text-xs lg:text-xs mb-2">{section.description}</p>
                                <div className="flex-grow" /> {/* This will push the button to the bottom */}
                                <button className="w-full bg-[#2148C0] text-white p-3 rounded-lg text-sm lg:text-xs hover:bg-gray-500 transition">
                                    Get Started
                                </button>
                            </div>
                        ))}
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

export default Dashboard;
