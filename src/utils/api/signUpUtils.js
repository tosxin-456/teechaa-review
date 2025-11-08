import { toast } from 'sonner';
import { API_BASE_URL } from '../../config/apiConfig';

export const handleTogglePassword = (showPassword, setShowPassword) => {
  setShowPassword(!showPassword);
};


export const createUser = async (data) => {
  // console.log(data)
  try {
    const { firstName, lastName, email, phoneNumber, password, gender } = data;

    if (!firstName || !lastName || !email || !phoneNumber || !password || !gender) {
      toast.error("All fields are required.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/users-reviewers/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      const { user } = responseData;
      toast.success("User registered successfully");
      console.log("User registered:", response);
      // navigate(`/home`, { state: { user } });
    } else {
      // Log the response status and body to debug
      const result = await response.json();
      console.log("Error response:", result);
      toast.error(result.message || "Registration failed.");
    }

  } catch (error) {
    // Catch any unexpected errors, such as network issues
    console.error("An error occurred:", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};

