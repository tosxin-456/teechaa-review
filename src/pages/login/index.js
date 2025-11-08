import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import bg from "../../assets/first_bg.png";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";
import { toast } from "sonner";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const togglePassword = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const { email, password } = formData;

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/users-reviewers/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }), // Send formData here for login
            });

            if (response.ok) {
                setIsLoading(false)
                const responseData = await response.json();
                const { token, user } = responseData; // Assuming only token is returned on successful login

                toast.success("User logged in successfully");

                // Store the token in localStorage (not the entire user object)
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);

                // Redirect to the dashboard
                navigate(`/dashboard`);
            } else {
                setIsLoading(false)
                const result = await response.json();
                console.log("Error response:", result);
                toast.error(result.message || "Login failed.");
                setError(result.message)
            }
        } catch (error) {
            setIsLoading(false)
            console.error("Login error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: '#2148C0'
            }}
        >
            <div className="flex flex-col md:flex-row bg-transparent rounded-lg overflow-hidden w-[100%] max-w-4xl">

                {/* Form Section */}
                <div className="w-[80%] m-auto md:w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center mb-6 text-white">TeeChaa</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <input
                                type="email"
                                id="email"
                                name="email"  // Add name attribute to link with formData
                                placeholder="EMAIL"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-white bg-transparent "
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password" // Add name attribute to link with formData
                                placeholder="PASSWORD"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300 bg-transparent "
                                required
                            />
                            {/* Eye Icon for Password Visibility */}
                            <span
                                onClick={togglePassword}
                                className="absolute right-3 top-4 cursor-pointer text-white"
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-white text-[#2148C0] p-2 rounded-lg hover:bg-gray-200 transition duration-300"
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-[#2148C0] m-auto "
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            ) : (
                                "LOGIN"
                            )}
                        </button>
                    </form>
                    <p className="m-auto text-red-800 bg-white mt-2 " >{error}</p>
                    <span onClick={() => navigate('/forgot-password')} className="w-full text-end mt-1 hover:cursor-pointer ">
                        <a className="text-white hover:underline">
                            Forgot Password?
                        </a>
                    </span>
                    {/* Extra Info */}
                    <p className="mt-4 text-center text-gray-400">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-white hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
