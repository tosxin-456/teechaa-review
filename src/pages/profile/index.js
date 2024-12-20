import React, { useState } from "react";
import { FaEdit, FaTrash, FaCamera, FaArrowLeft } from "react-icons/fa";
import profile from "../../assets/Screenshot (5).png";
import bg from "../../assets/first_bg.png"; // background image
import { useNavigate } from "react-router-dom";

const StudentProfilePage = () => {
    const [student, setStudent] = useState({
        fullName: "Tosin Poppins",
        email: "tosin.poppins@example.com",
        phone: "+234 812 345 6789",
        gender: "Male",
        country: "Nigeria",
        state: "Lagos",
        DOB: "2000-01-15",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(student);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = () => {
        setStudent(formData);
        setIsEditing(false);
    };

    const handleDelete = () => {
        setDeleteModalOpen(false);
        alert("Profile deleted!");
        // Add delete logic here
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="bg-gray-200 bg-opacity-80 rounded-lg shadow-lg w-[90%] max-w-2xl p-4 md:p-12">
                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                    >
                        <FaArrowLeft className="text-xl" />
                        Back
                    </button>
                </div>

                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-6 relative">
                    <div className="relative group">
                        <img
                            src={profile}
                            alt="Profile"
                            className="w-32 h-32 rounded-full shadow-lg mb-4 object-cover object-center"
                        />
                        <FaCamera className="text-[#2148C0] hover:text-gray-700 text-2xl cursor-pointer absolute mt-[-40px] ml-[100px] transition-colors" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#2148C0] mt-2">{student.fullName}</h2>
                    <p className="text-gray-600">{student.email}</p>
                </div>

                {/* Profile Details */}
                <div className="space-y-6">
                    {!isEditing ? (
                        <>
                            <div className="space-y-4 text-sm sm:text-base">
                                {Object.entries(student).map(([key, value]) => (
                                    <p key={key} className="flex justify-between text-gray-700">
                                        <span className="font-semibold capitalize">{key}:</span>
                                        <span>{value}</span>
                                    </p>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-[#2148C0] text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                                >
                                    <FaEdit className="inline mr-2" /> Edit Profile
                                </button>
                                <button
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition"
                                >
                                    <FaTrash className="inline mr-2" /> Delete Profile
                                </button>
                            </div>
                        </>
                    ) : (
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate();
                            }}
                        >
                            {Object.keys(student).map((key) => (
                                <div key={key} className="flex flex-col">
                                    <label className="font-semibold text-gray-700 capitalize">{key}</label>
                                    <input
                                        type={key === "DOB" ? "date" : "text"}
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2148C0]"
                                    />
                                </div>
                            ))}

                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    type="submit"
                                    className="bg-[#2148C0] text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Delete Profile</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this profile? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* <footer className="text-center text-gray-300 py-4 bg-[#2148C0] text-sm mt-8">
                <p>&copy; {new Date().getFullYear()} TeeChaa CBT Application. All rights reserved.</p>
            </footer> */}
        </div>
    );
};

export default StudentProfilePage;
