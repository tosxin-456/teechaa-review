import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

export const SessionExpirationPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const location = useLocation(); // Get the current location

    useEffect(() => {
        const checkTokenValidity = () => {
            const token = localStorage.getItem("token"); // Retrieve the token from localStorage
            if (!token) {
                setShowPopup(true);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                if (decoded.exp < currentTime) {
                    setShowPopup(true); // Token is expired
                }
            } catch (error) {
                console.error("Invalid token", error);
                setShowPopup(true); // Token is invalid
            }
        };

        // Avoid showing the popup on specific routes
        if (
            ["/login", "/register", "/", "/forgot-password", "/otp", "/reset-password", "/reset-otp"].includes(location.pathname) // Check the current route
        ) {
            setShowPopup(false);
            return;
        }

        checkTokenValidity();
        const interval = setInterval(checkTokenValidity, 60 * 1000); // Check token every minute

        return () => clearInterval(interval);
    }, [location.pathname]); // Re-run the effect when the path changes

    if (!showPopup) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center bg-black z-[999] items-center bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg text-center">
                <h2>Your session has expired</h2>
                <p>Please log in again to continue.</p>
                <button
                    onClick={() => {
                        localStorage.removeItem("token"); // Remove the token
                        window.location.href = "/login"; // Redirect to login page
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Re-Login
                </button>
            </div>
        </div>
    );
};
