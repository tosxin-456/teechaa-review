import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import bg from "../../assets/first_bg.png"; // Use the same background image as in LoginPage
import { createUser } from "../../utils/api/signUpUtils";
import { API_BASE_URL } from "../../config/apiConfig";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle phone number change
    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phoneNumber: value });
    };

    // Toggle password visibility
    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword } = formData;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log(formData)
        setLoading(true)
        try {
            const { firstName, lastName, email, phoneNumber, password, gender } = formData;
            const response = await fetch(`${API_BASE_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, email, phoneNumber, password, gender }), // Use formData here
            });

            // Check if the response is ok
            if (response.ok) {
                setLoading(false)
                const responseData = await response.json();
                const { user_id } = responseData;
                toast.success("User registered successfully");
                localStorage.setItem('user_id', user_id);

                navigate(`/otp`);
            } else {
                setLoading(false)
                // If the response is not ok, log the response status and body
                const result = await response.json();
                console.log("Error response:", result);
                toast.error(result.message || "Registration failed.");
                setError(result.message)
            }
        } catch (error) {
            setLoading(false)
            // Catch any unexpected errors
            console.error("Registration error:", error);
            toast.error("An unexpected error occurred.");
            setError("Check your internet connection")
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
                backgroundColor: "#2148C0", // Fallback background color
            }}
        >
            <div className="flex flex-col bg-transparent rounded-lg overflow-hidden w-[80%] max-w-4xl">
                <div className="w-[100%] m-auto md:w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center mb-6 text-white">TeeChaa</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* First Name and Last Name */}
                        <div className="md:flex md:space-x-4">
                            <div className="md:w-1/2">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-white bg-transparent text-white placeholder-white"
                                    required
                                />
                            </div>
                            <div className="md:w-1/2 mt-4 md:mt-0">
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-white bg-transparent text-white placeholder-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-white bg-transparent text-white placeholder-white"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <PhoneInput
                                country={"us"}
                                value={formData.phoneNumber}
                                onChange={handlePhoneChange}
                                inputClass="!w-full !mt-1 !p-2 !border !rounded-lg !bg-transparent !text-white !placeholder-white"
                                containerClass="text-white"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-white bg-transparent text-white placeholder-white"
                                required
                            >
                                <option value="" className="text-gray-600">
                                    Select Gender
                                </option>
                                <option value="male" className="text-black">Male</option>
                                <option value="female" className="text-black">Female</option>
                                <option value="other" className="text-black">Other</option>
                            </select>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-white bg-transparent text-white placeholder-white"
                                required
                            />
                            <span
                                onClick={togglePassword}
                                className="absolute right-3 top-5 cursor-pointer text-white"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-white bg-transparent text-white placeholder-white"
                                required
                            />
                            <span
                                onClick={toggleConfirmPassword}
                                className="absolute right-3 top-5 cursor-pointer text-white"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                                "Sign Up"
                            )}
                        </button>
                    </form>
                    <p className="m-auto text-red-800 mt-1 " >{error}</p>
                    {/* Extra Info */}
                    <p className="mt-4 text-center text-gray-400">
                        Already have an account?{" "}
                        <a href="/login" className="text-white hover:underline">
                            Log In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );


};

export default SignupPage;
