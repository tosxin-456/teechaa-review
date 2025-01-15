import React, { useState } from "react";
import { Link } from "react-scroll";
import { FaBars, FaTimes, FaBook, FaChalkboardTeacher, FaEnvelope, FaHome, FaPhoneAlt, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import group from "../../assets/home_images/group_kids.svg";

const HomePage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div
        style={{
                fontFamily:' "Inter", serif;'
        }}
        className=" bg-gray-50">
            {/* Navbar */}
            <nav className="fixed w-full top-0 bg-white shadow-md z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-3xl font-bold text-[#2148C0] tracking-wide">TeeChaa</div>
                    <div className="hidden md:flex space-x-8">
                        <Link to="home" smooth={true} duration={500} className="text-lg text-gray-700 hover:text-[#2148C0] cursor-pointer transition-colors duration-300">
                            Home
                        </Link>
                        <Link to="about" smooth={true} duration={500} className="text-lg text-gray-700 hover:text-[#2148C0] cursor-pointer transition-colors duration-300">
                            About
                        </Link>
                        <Link to="features" smooth={true} duration={500} className="text-lg text-gray-700 hover:text-[#2148C0] cursor-pointer transition-colors duration-300">
                            Features
                        </Link>
                        <Link to="contact" smooth={true} duration={500} className="text-lg text-gray-700 hover:text-[#2148C0] cursor-pointer transition-colors duration-300">
                            Contact
                        </Link>
                        <Link onClick={() => navigate("/login")} className="bg-[#2148C0] mt-[-7px] text-white px-8 py-2 rounded-full text-lg font-semibold hover:bg-gray-600 transition-transform transform hover:scale-105 hover:cursor-pointer  ">
                            Login
                        </Link>
                    </div>
                    <div className="md:hidden text-2xl text-gray-700 cursor-pointer" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden text-center bg-white p-3 shadow-md">
                        <Link to="home" smooth={true} duration={500} className="block px-6 py-3 text-gray-700 hover:text-[#2148C0] cursor-pointer transition-colors duration-300" onClick={toggleMobileMenu}>
                            Home
                        </Link>
                        <Link to="about" smooth={true} duration={500} className="block px-6 py-3 text-gray-700 hover:text-[#2148C0] cursor-pointer transition-colors duration-300" onClick={toggleMobileMenu}>
                            About
                        </Link>
                        <Link to="features" smooth={true} duration={500} className="block px-6 py-3 text-gray-700 hover:text-[#2148C0] cursor-pointer transition-colors duration-300" onClick={toggleMobileMenu}>
                            Features
                        </Link>
                        <Link to="contact" smooth={true} duration={500} className="block px-6 py-3 text-gray-700 hover:text-[#2148C0] cursor-pointer transition-colors duration-300" onClick={toggleMobileMenu}>
                            Contact
                        </Link>
                        <Link onClick={() => navigate("/login")} className="bg-[#2148C0] mt-[-7px] text-white px-8 py-2 rounded-full text-lg font-semibold hover:bg-gray-600 transition-transform transform hover:scale-105 hover:cursor-pointer  ">
                            Login
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="h-screen mt-[200px] md:mt-0 flex flex-col justify-center items-center bg-white text-black text-center space-y-8">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 space-y-6 md:space-y-0">
                    <div className="text-center md:text-left">
                        <h1 className="text-6xl font-extrabold animate__animated animate__fadeIn">
                            Take student <br /> experience to the next level
                        </h1>
                        <p className="text-lg max-w-xl mx-auto leading-relaxed animate__animated animate__fadeIn animate__delay-1s md:mx-0">
                            Ace your exams with expertly curated study materials, past questions, and tutorials tailored for success in JAMB, WAEC, and more!
                        </p>
                        <button
                            onClick={() => navigate("/signup")}
                            className="bg-[#2148C0] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-600 transition-transform transform hover:scale-105 mt-4"
                        >
                            Get Started
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <img src={group} alt="Students" className="w-full max-w-md md:max-w-lg" />
                    </div>
                </div>
            </section>

            {/* Success Rate Section */}
            <section className="py-24 bg-gray-100 mt-7 md:mt-0 text-center">
                <h2 className="text-5xl font-bold text-[#2148C0] mb-8">Our Success Rate</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Join over <span className="text-[#2148C0] font-bold">10,000 students</span> who have excelled in their exams with our platform. Achieve more and stress less with TeeChaa.
                </p>
            </section>

            {/* How it Works Section */}
            <section className="py-24 bg-[white]">
                <h2 className="text-5xl font-bold text-center text-[#2148C0] mb-16">How It Works</h2>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                        <div className="flex justify-center items-center mb-4">
                            <FaCheckCircle className="text-6xl text-[#2148C0]" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Sign Up</h3>
                        <p className="text-gray-600">Create your account to access curated materials and tools for exam preparation.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                        <div className="flex justify-center items-center mb-4">
                            <FaBook className="text-6xl text-[#2148C0]" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Get Access</h3>
                        <p className="text-gray-600">Explore a vast library of tutorials, study notes, and past questions.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                        <div className="flex justify-center items-center mb-4">
                            <FaChalkboardTeacher className="text-6xl text-[#2148C0]" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Practice Questions</h3>
                        <p className="text-gray-600">Study or prepare for exams with categorized practice questions.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                        <div className="flex justify-center items-center mb-4">
                            <FaEnvelope className="text-6xl text-[#2148C0]" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Get Results</h3>
                        <p className="text-gray-600">Review your performance and identify areas for improvement.</p>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 TeeChaa. All rights reserved.</p>
                    <p className="text-sm mt-2">Built with passion for students around the world.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
