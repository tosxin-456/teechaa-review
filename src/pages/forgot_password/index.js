import React, { useState } from "react";
import bg from "../../assets/first_bg.png";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send email to the backend API to trigger OTP generation
            const response = await fetch(`${API_BASE_URL}/api/users-reviewers/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('email', email)
                alert(`OTP has been sent to ${email}`);
                navigate('/reset-otp');
            } else {
                // Handle errors like user not found or others
                const errorData = await response.json();
                alert(errorData.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            // Handle fetch or network errors
            console.error("Error sending OTP:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#2148C0",
            }}
        >
            <div className="bg-transparent bg-opacity-90 rounded-lg p-6 md:p-8  w-full max-w-md">
                <h1 className="text-2xl md:text-3xl font-bold text-[#2148C0] mb-4 text-center">
                    Forgot Password
                </h1>
                <p className="text-white mb-6 text-center">
                    Enter your email address, and we'll send you a password reset link.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-[#2148C0] focus:ring-[#2148C0] outline-none bg-transparent text-gray-800"
                            placeholder="EMAIL ADDRESS"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-white py-2 text-[#2148C0] rounded-lg  transition duration-300
                ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-200"
                            }`}
                    >
                        {loading ? "Sending..." : "Send Reset OTP"}
                    </button>
                </form>

                {/* Back to Login */}
                <p className="mt-4 text-center text-gray-200">
                    Remember your password?{" "}
                    <a
                        href="/login"
                        className="text-white font-semibold hover:underline"
                    >
                        Back to Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
