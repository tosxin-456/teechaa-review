import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import Marquee from "react-fast-marquee";
import { API_BASE_URL } from "../config/apiConfig";

const SubscriptionModal = ({ onClose }) => {
    const [fullName, setFullName] = useState("");
    const [referenceId, setReferenceId] = useState("");
    const [amount, setAmount] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id;

    const [amountRaw, setAmountRaw] = useState("");

    const handleChange = (e) => {
        let value = e.target.value.replace(/,/g, ""); // Remove commas
        if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and one decimal point
            setAmountRaw(value);
        }
    };

    const handleSubmit = async () => {
        if (!fullName || !referenceId || !amountRaw || !image) {
            console.log(amountRaw)
            alert("Please fill all fields and upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("referenceId", referenceId);
        formData.append("amount", amountRaw);
        formData.append("image", image);

        setIsOpen(false);
        setShowBanner(false);
        onClose?.();

        try {
            const response = await fetch(`${API_BASE_URL}/api/sub/${userId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update user details");
            }
            alert("User details updated successfully!");
            localStorage.setItem('subcribed', true)
        } catch (error) {
            console.error("Error updating payment details:", error.message);
            alert("Error submitting the data.");
        }
    };

    useEffect(() => {
        const checkTokenValidity = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setShowBanner(true);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                if (decoded?.subscribed === false) {
                    setShowBanner(true);
                }
            } catch (error) {
                console.error("Invalid token", error);
                setShowBanner(true);
            }
        };

        if (["/login", "/register", "/", "/forgot-password", "/otp", "/reset-password", "/reset-otp", "/signup"].includes(location.pathname)) {
            setShowBanner(false);
            return;
        }

        checkTokenValidity();
    }, [location.pathname]);

    const accountNumber = "1234567890";

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <>
            {showBanner && !isOpen && (
                <div onClick={() => setIsOpen(true)} className="fixed top-0 left-0 w-full bg-red-600 text-white p-2 text-center cursor-pointer z-50">
                    <Marquee speed={50} gradient={false}>
                        <span className="font-bold">
                            Subscribe to enjoy full benefits &nbsp; • &nbsp; Subscribe to enjoy full benefits &nbsp; • &nbsp;
                        </span>
                    </Marquee>
                </div>
            )}
            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div className="bg-white rounded-2xl p-4 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-auto">
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">Subscription Payment</h2>
                        <p className="text-gray-600 text-center mb-4">Send your payment to this account and upload the proof of payment.</p>
                        <p className="text-lg font-semibold text-center text-blue-500 mb-6">{accountNumber}</p>

                        <div className="mb-4">
                            {preview && <img src={preview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg shadow-md" />}
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Reference ID</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={referenceId}
                                onChange={(e) => setReferenceId(e.target.value)}
                                placeholder="Enter reference ID"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={amountRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                onChange={handleChange}
                                placeholder="Enter amount"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="flex justify-between mt-6">
                            <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition" onClick={() => setIsOpen(false)}>
                                Cancel
                            </button>
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default SubscriptionModal;
