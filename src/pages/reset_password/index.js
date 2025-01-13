import React, { useState } from "react";
import bg from "../../assets/first_bg.png";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Eye icons for visibility toggle
import { API_BASE_URL } from "../../config/apiConfig";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        const email = localStorage.getItem('email')
        try {
            const response = await fetch(`${ API_BASE_URL}/api/users/update-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    newPassword: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Password reset successful!");
                localStorage.clear()
                navigate("/login");
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            console.error("Error resetting password:", err);
            setError("An error occurred. Please try again.");
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
            <div className="bg-transparent bg-opacity-90 rounded-lg p-6 md:p-8 w-full max-w-md">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                    Reset Password
                </h1>
                <p className="text-white mb-6 text-center">
                    Enter your new password below.
                </p>

                {/* Error Message */}
                {error && (
                    <p className="text-red-600 text-sm font-medium text-center mb-4">
                        {error}
                    </p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-[#2148C0] focus:ring-[#2148C0] outline-none bg-transparent text-gray-200 placeholder-gray-400"
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-[#2148C0] focus:ring-[#2148C0] outline-none bg-transparent text-gray-200 placeholder-gray-400"
                            placeholder="Confirm new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                        >
                            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-[#2148C0] py-2 rounded-lg transition duration-300 font-semibold
                            ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-200"
                            }`}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
