import React from "react";
import no_internet from "../../assets/No connection-bro.svg";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-white">

            {/* Main Content */}
            <main className="flex-grow flex flex-col justify-center items-center container mx-auto px-4 py-4 lg:py-6">
                <div className="text-center">
                    <img
                        src={no_internet}
                        alt="404 Error Page Not Found"
                        className="max-w-full h-auto mb-4"
                    />
                    <h2 className="text-2xl mt-[-50px] lg:text-3xl font-bold text-[#2148C0] mb-2">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-[#2148C0] text-white px-4 py-2 rounded-lg text-sm lg:text-md hover:bg-gray-500 transition"
                    >
                        Refresh
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-gray-300 py-2 lg:py-4 bg-black bg-opacity-40">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default NotFound;
