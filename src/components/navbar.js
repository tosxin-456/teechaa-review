import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Hamburger and Close icons
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [active, setActive] = useState('');

    const navLinks = [
        { name: 'Home', to: '/' },
        { name: 'Take JAMB', to: '/jamb' },
        { name: 'Take WAEC', to: '/waec' },
        { name: 'Progress Report', to: '/progress' },
        { name: 'Upcoming Tests', to: '/tests' },
        { name: 'Result Checker', to: '/results' },
    ];

    const handleLinkClick = (link) => {
        setActive(link);
        setIsMenuOpen(false); // Close the menu on link click
    };

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-10">
            <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="text-xl font-bold text-[#2148C0]">TeeChaa</div>

                {/* Hamburger Icon for Mobile */}
                <div className="lg:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#2148C0]">
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            className={`text-lg font-semibold text-[#2148C0] ${active === link.name ? 'text-blue-600' : ''}`}
                            onClick={() => handleLinkClick(link.name)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white shadow-md`}>
                <div className="flex flex-col items-center py-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            className={`text-lg font-semibold text-[#2148C0] py-2 w-full text-center ${active === link.name ? 'text-blue-600' : ''
                                }`}
                            onClick={() => handleLinkClick(link.name)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
