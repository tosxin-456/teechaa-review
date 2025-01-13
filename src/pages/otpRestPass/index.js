import React, { useState, useEffect, useRef } from "react";
import bg from "../../assets/first_bg.png"; // Background image path
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config/apiConfig";

const OTPResetPage = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(localStorage.getItem("otpTimer") || 420); // Load timer from localStorage
    const [resendAvailable, setResendAvailable] = useState(false);
    const inputRefs = useRef([]);
    const user_id = JSON.parse(localStorage.getItem('user_id'));
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const email = localStorage.getItem("email");

        try {
            const otpString = otp.join("");
            if (otpString.length < 6) {
                alert("Please enter the complete OTP.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp: otpString, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Something went wrong!");
                return;
            }

            alert("OTP Verified Successfully!");
            navigate(`/reset-password`); // Navigate to the reset password page
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Error verifying OTP. Please try again.");
        }
    };


    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    const newTimer = prev - 1;
                    localStorage.setItem("otpTimer", newTimer); // Save updated timer to localStorage
                    return newTimer;
                });
            }, 1000);
        } else {
            setResendAvailable(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes.toString().padStart(2, "0")}:${(seconds % 60)
            .toString()
            .padStart(2, "0")}`;
    };

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return; // Only allow numeric input
        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1); // Keep single character per box
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };


    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e, index) => {
        const pastedValue = e.clipboardData.getData("Text");
        const newOtp = [...otp];
        const otpArr = pastedValue.split("").slice(0, 6); // Only consider the first 6 characters
        otpArr.forEach((digit, i) => {
            if (i + index < otp.length) {
                newOtp[i + index] = digit;
            }
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(otpArr.length + index, otp.length - 1)]?.focus();
    };

    const handleResend = async () => {
        const timerDuration = 420;
        setTimer(timerDuration);
        setResendAvailable(false);
        setOtp(new Array(6).fill(""));
        localStorage.setItem("otpTimer", timerDuration);
        const email = localStorage.getItem('email')
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/generate-new-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("A new OTP has been sent! Please check your email.");
            } else {
                alert(data.message || "Unable to resend OTP. Please try again later.");
            }
        } catch (error) {
            console.error("Error generating new OTP:", error);
            alert("Error sending OTP. Please try again.");
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
                backgroundColor: "#2148C0",
            }}
        >
            <div className="flex flex-col bg-transparent rounded-lg w-[100%] max-w-md px-8 py-10 md:py-12 backdrop-blur-sm bg-opacity-80">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Enter OTP
                </h1>
                <p className="text-white text-center mb-6">
                    Enter the 6-digit OTP sent to your email.
                </p>

                {/* OTP Input */}
                <div className="flex justify-center gap-2 mb-6">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={value}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={(e) => handlePaste(e, index)} // Handle paste event
                            ref={(input) => (inputRefs.current[index] = input)}
                            className="w-12 h-12 md:w-14 md:h-14 text-2xl text-center text-white bg-transparent border-2 border-white rounded-md focus:outline-none focus:ring focus:ring-[#2148C0] focus:border-[#2148C0] placeholder-white"
                        />
                    ))}
                </div>

                {/* Timer */}
                <div className="text-center text-white mb-6">
                    <button
                        onClick={handleResend}
                        className="text-white font-semibold hover:underline"
                    // disabled={resendAvailable}
                    >
                        Resend OTP
                    </button>
                    <div>
                        {resendAvailable ? (
                            <span className="text-white">
                                OTP Expired. You can resend the OTP.
                            </span>
                        ) : (
                            <span>
                                OTP expires in{" "}
                                <span className="font-semibold text-[#FDCB00]">
                                    {formatTime(timer)}
                                </span>
                            </span>
                        )}
                    </div>
                </div>


                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-white text-[#2148C0] py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default OTPResetPage;
