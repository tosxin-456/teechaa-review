import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; 
import bg from "../../assets/first_bg.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    // Toggle password visibility
    const togglePassword = () => setShowPassword(!showPassword);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        // alert("Login Successful!");
         navigate('/dashboard')
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor:'#2148C0'
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
                                placeholder="EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-white bg-transparent "
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            LOGIN
                        </button>
                    </form>
                    <span onClick={() => navigate('/forgot-password')} className="w-full text-end mt-2 hover:cursor-pointer ">
                            <a  className="text-white hover:underline">
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
