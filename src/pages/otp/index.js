import React, { useState, useEffect, useRef } from "react";
import bg from "../../assets/first_bg.png"; // Background image path

const OTPPage = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(420);
    const [resendAvailable, setResendAvailable] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
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
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1);
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

    const handleResend = () => {
        setTimer(120);
        setResendAvailable(false);
        setOtp(new Array(6).fill(""));
        alert("A new OTP has been sent!");
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
                    Enter the 6-digit OTP sent to your email/phone.
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
                            ref={(input) => (inputRefs.current[index] = input)}
                            className="w-12 h-12 md:w-14 md:h-14 text-2xl text-center text-white bg-transparent border-2 border-white rounded-md focus:outline-none focus:ring focus:ring-[#2148C0] focus:border-[#2148C0] placeholder-white"
                        />
                    ))}
                </div>

                {/* Timer */}
                <div className="text-center text-white mb-6">
                    {resendAvailable ? (
                        <button
                            onClick={handleResend}
                            className="text-white font-semibold hover:underline"
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <span>
                            Resend OTP in{" "}
                            <span className="font-semibold text-[#FDCB00]">
                                {formatTime(timer)}
                            </span>
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={() => alert(`OTP Submitted: ${otp.join("")}`)}
                    className="w-full bg-white text-[#2148C0] py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default OTPPage;
