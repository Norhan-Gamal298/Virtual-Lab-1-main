// Import necessary React hooks and libraries
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Icon for close button
import { useDispatch } from "react-redux"; // To dispatch actions to Redux store
import { useNavigate } from "react-router-dom"; // To programmatically navigate after login
import { setCredentials } from "../features/auth/authSlice"; // Redux action to set user credentials
import { authAPI } from "../features/auth/authAPI"; // API methods for authentication

// SignInModal component takes onClose (function to close the modal) and switchToSignUp (function to switch to SignUp modal)
const SignInModal = ({ onClose, switchToSignUp }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form input state for user email and password
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  // State to handle form validation errors
  const [errors, setErrors] = useState([]);
  // State to handle API errors (e.g., wrong credentials)
  const [apiError, setApiError] = useState(null);

  // Regular expression to validate email format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Function to validate form fields before submitting
  const validateForm = () => {
    let newErrors = {};

    // Check email
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Check password
    if (!userData.password) {
      newErrors.password = "Password is required";
    }

    // Update errors state
    setErrors(newErrors);

    // Return true if no errors, otherwise false
    return Object.keys(newErrors).length === 0;
  };

  // Update userData state whenever user types in input fields
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First validate the form
    if (validateForm()) {
      try {
        // Call the login API
        const response = await authAPI.login(userData);

        // Dispatch user info and token to Redux store
        dispatch(
          setCredentials({ user: response.user, token: response.token })
        );

        // Clear any previous API error
        setApiError(null);

        // Close the modal
        onClose();

        // Navigate user to profile page
        navigate("/profile");
      } catch (error) {
        // If login fails, show error message
        console.error("Error during login:", error.message);
        setApiError(error.message);
      }
    }
  };

  // State to control modal entrance animation
  const [visible, setVisible] = useState(false);

  // On component mount, trigger animation by setting visible to true after a small delay
  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  // Main modal JSX
  return (
    <div style={styles.modalOverlay}>
      <div
        style={{
          ...styles.modalContent,
          transform: visible ? "translateY(0)" : "translateY(50px)", // Animate up on appear
          opacity: visible ? 1 : 0, // Fade in
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] bg-transparent border-0 text-[#fff] cursor-pointer "
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Modal Heading */}
        <h2 className="text-4xl font-bold text-center mt-[4rem]">
          Welcome back! <br /> Sign in to continue
        </h2>

        {/* Sign In Form */}
        <form
          onSubmit={handleSubmit}
          className="signInForm mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 px-[31px]"
        >
          {/* Email Field */}
          <div className="sm:col-span-6">
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-[#A1A1A1]"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                className="block w-full rounded-[7px] bg-[#0a0a0a] px-3 py-3 text-base text-[white] outline-1 -outline-offset-1 outline-[#252525] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
              />
              {/* Show validation error if any */}
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="sm:col-span-6">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-[#A1A1A1]"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                name="password"
                type="password"
                value={userData.password}
                onChange={handleChange}
                className="block w-full rounded-[7px] bg-[#0a0a0a] px-3 py-3 text-base text-[white] outline-1 -outline-offset-1 outline-[#252525] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
              />
              {/* Show validation error if any */}
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </div>

          {/* API Error message */}
          {apiError && (
            <p className="text-red-500 text-sm sm:col-span-6">{apiError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="sm:col-span-6 rounded-[7px] px-3 py-2 text-sm font-semibold bg-white text-gray-950 shadow-xs hover:bg-[white] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-400"
          >
            Sign In
          </button>

          {/* Link to Reset Password */}
          <p className="text-sm sm:col-span-6 text-center text-[#a1a1a1]">
            Forgot your password?{" "}
            <span className="text-white cursor-pointer">Reset it here</span>
          </p>
        </form>

        {/* Switch to Sign Up */}
        <div>
          <p
            className="text-sm sm:col-span-6 text-center text-[#a1a1a1] mt-3 pt-3.5 pb-3.5 border-t-1 border-[#252525] relative"
            onClick={switchToSignUp}
          >
            Don't have an account?{" "}
            <span className="text-white cursor-pointer">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Inline styles for modal overlay and content
const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.9)", // Dark semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "opacity 0.9s ease-in-out", // Smooth fade in/out
  },
  modalContent: {
    background: "#0a0a0a", // Modal background color
    border: "1px solid #252525", // Border color
    borderRadius: "18px",
    width: "500px",
    minHeight: "auto",
    maxHeight: "90vh", // So it doesn't exceed screen height
    overflowY: "none",
    transition: "transform 0.4s ease-in-out, opacity 0.4s ease-in-out",
    position: "relative",
  },
};

export default SignInModal;
