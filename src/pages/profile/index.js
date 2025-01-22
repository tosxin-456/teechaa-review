import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCamera, FaArrowLeft } from "react-icons/fa";
// import profilePlaceholder from "../../assets/Screenshot (5).png";
import bg from "../../assets/first_bg.png"; // background image
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";
import WOW from "wowjs";
import "animate.css";

const StudentProfilePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id;
    const [student, setStudent] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const profilePlaceholder = 'https://www.gravatar.com/avatar/c7763a1c6be16ffb347e8500434b61eb?s=200&r=pg&d=mm'
    const [selectedImage, setSelectedImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(
        student.profile_image
            ? student.profile_image // Use the student's profile image if it exists
            : profilePlaceholder // Fallback to the placeholder if no profile image
    );


    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setSelectedImage(null);
    };


    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch user profile");
                }

                const userData = await response.json();
                const filteredData = {
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    email: userData.email || "",
                    phone: userData.phoneNumber || "",
                    gender: userData.gender || "",
                    dob: new Date(userData.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }) || "",
                    country: userData.country || "",
                    state: userData.state || "",
                };

                setStudent(filteredData);
                // console.log(filteredData)
                setFormData(filteredData);
                if (userData.profile_image) {
                    setProfileImagePreview(userData.profile_image); // Use the URL from the server
                } else {
                    setProfileImagePreview(profilePlaceholder); // Fallback to placeholder
                }
            } catch (error) {
                console.error("Error fetching user profile:", error.message);
            }
        };

        fetchProfile();
    }, [userId]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle image file selection
    // Handle image selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setProfileImagePreview(URL.createObjectURL(file)); // Temporary preview
        }
    };


    // Handle profile image update
    const handleImageUpdate = async () => {
        try {
            if (!selectedImage) {
                alert("Please select an image to upload.");
                return;
            }

            const formData = new FormData();
            formData.append("profile_image", selectedImage);

            const response = await fetch(`${API_BASE_URL}/api/users/profile-image/${userId}`, {
                method: "PATCH",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile image");
            }

            const result = await response.json();
            alert(result.message || "Profile image updated successfully.");

            // Update the profile image preview
            if (result.profile_image) {
                setProfileImagePreview(result.profile_image);
            }
            closeModal(); // Close modal after success
        } catch (error) {
            console.error("Error updating profile image:", error.message);
            alert("Failed to update profile image.");
        }
    };



    const handleUpdateDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // formData contains user details
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update user details");
            }

            const updatedData = await response.json();
            const filteredData = {
                firstName: updatedData.user.firstName || "",
                lastName: updatedData.user.lastName || "",
                email: updatedData.user.email || "",
                phone: updatedData.user.phoneNumber || "",
                gender: updatedData.user.gender || "",
                dob: new Date(updatedData.user.dob).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }) || "",
                country: updatedData.user.country || "",
                state: updatedData.user.state || "",
            };
            setStudent(filteredData);
            alert("User details updated successfully!");
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating user details:", error.message);
        }
    };



    // Delete profile
    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete profile");
            }

            alert("Profile deleted successfully!");
            localStorage.removeItem("user");
            navigate("/login");
        } catch (error) {
            console.error("Error deleting profile:", error.message);
        }
    };

    const handleDeleteImage = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/profile-image/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete profile image");
            }

            const result = await response.json();
            alert(result.message || "Profile image deleted successfully.");

            // Clear the profile image preview
            setProfileImagePreview(null);

            closeModal(); // Close modal after success
        } catch (error) {
            console.error("Error deleting profile image:", error.message);
            alert(error.message || "Failed to delete profile image.");
        }
    };


    // Navigate back
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
                <div className="flex items-center mb-6">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-[#2148C0] hover:text-blue-600 font-medium transition"
                    >
                        <FaArrowLeft className="text-xl" />
                        Back
                    </button>
                </div>

                <div className="flex flex-col items-center mb-6 relative">
                    <div className="relative group">
                        <img
                            src={profileImagePreview || profilePlaceholder}
                            alt="Profile"
                            className="w-32 h-32 rounded-full shadow-lg mb-4 object-cover object-center"
                        />
                        <button
                            onClick={openModal}
                            className="absolute mt-[-40px] ml-[100px] cursor-pointer"
                        >
                            <FaCamera className="text-[#2148C0] hover:text-gray-700 text-2xl transition-colors" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-[#2148C0] mt-2">
                        {`${student.firstName} ${student.lastName}`}
                    </h2>
                    <p className="text-gray-600">{student.email}</p>
                </div>

                <div className="space-y-6">
                    {!isEditing ? (
                        <>
                            {Object.entries(student).map(([key, value]) => (
                                <p key={key} className="flex justify-between text-gray-700">
                                    <span className="font-semibold capitalize">{key}:</span>
                                    <span>
                                        {typeof value === "object" && value !== null ? JSON.stringify(value) : value || "Not provided"}
                                    </span>
                                </p>
                            ))}


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
                                handleUpdateDetails();
                            }}
                        >
                            {Object.keys(student).map((key) => (
                                <div key={key} className="flex flex-col">
                                    <label className="font-semibold text-gray-700 capitalize">
                                        {key}
                                    </label>
                                    <input
                                        type={key === "dob" ? "date" : "text"}
                                        name={key}
                                        value={formData[key] || ""}
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
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-semibold text-center mb-4">Upload Profile Image</h2>
                        <div className="flex flex-col items-center">
                            {/* Profile Image Preview */}
                            {profileImagePreview ? (
                                <img
                                    src={profileImagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover mb-4 border border-gray-300"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 border border-gray-300">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}

                            {/* Upload Input */}
                            <label
                                htmlFor="profileImageInput"
                                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 cursor-pointer transition"
                            >
                                <i className="fas fa-upload mr-2"></i> Choose Image
                            </label>
                            <input
                                id="profileImageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={handleImageUpdate}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition"
                                >
                                    <i className="fas fa-check mr-2"></i> Upload
                                </button>
                                {profileImagePreview && (
                                    <button
                                        onClick={handleDeleteImage}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition"
                                    >
                                        <i className="fas fa-trash-alt mr-2"></i> Delete
                                    </button>
                                )}
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition"
                                >
                                    <i className="fas fa-times mr-2"></i> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to delete your profile?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfilePage;
