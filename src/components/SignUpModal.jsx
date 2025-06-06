import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Icon for closing the modal
import { authAPI } from "../features/auth/authAPI"; // API service for authentication operations
import { useNavigate } from "react-router-dom"; // For navigating to another page after signup
import { useDispatch } from "react-redux"; // To dispatch actions to Redux store
import { setCredentials } from "../features/auth/authSlice"; // Action to store user credentials globally

// SignUpModal component to render a signup form inside a modal
const SignUpModal = ({ onClose, switchToSignIn }) => {
    const navigate = useNavigate(); // Initialize navigation hook
    const dispatch = useDispatch(); // Initialize dispatch hook

    // State to hold the values of the signup form inputs
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // State to hold any validation or API errors
    const [errors, setErrors] = useState([]);

    // Regular expressions used for validating input fields
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email format
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Strong password: 1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 chars
    const namePattern = /^[A-Za-z]+$/; // Only letters allowed for names

    // Validate the form fields before submitting
    const validateForm = () => {
        let newErrors = {};

        // Validate first name field
        if (!userData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (!namePattern.test(userData.firstName)) {
            newErrors.firstName = "First name should only contain letters";
        }

        // Validate last name field
        if (!userData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (!namePattern.test(userData.lastName)) {
            newErrors.lastName = "Last name should only contain letters";
        }

        // Validate email field
        if (!userData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(userData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Validate password field
        if (!userData.password) {
            newErrors.password = "Password is required";
        } else if (!passwordPattern.test(userData.password)) {
            newErrors.password =
                "Password must be at least 8 characters long and include an uppercase, lowercase, number, and special character";
        }

        // Validate confirm password field
        if (!userData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (userData.password !== userData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        // Return true if no errors found
        return Object.keys(newErrors).length === 0;
    }

    // Update form values when user types in the inputs
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    // Submit the form after validating inputs
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the page from refreshing

        if (validateForm()) {
          try {
            // Call the API to register the new user
            const response = await authAPI.register(userData);
            console.log("User registered successfully:", response);

            // Save user data and token to Redux store
            dispatch(
              setCredentials({ user: response.user, token: response.token })
            );

            // Close the modal and redirect to the profile page
            onClose();
            navigate("/profile");
          } catch (error) {
            console.error("Error during registration:", error.message);
            setErrors({ apiError: error.message });
          }
        }
    };

    // For modal entrance animation (fade in effect)
    const [visible, setVisible] = useState(false);

    // Show the modal with animation after a slight delay
    useEffect(() => {
        setTimeout(() => setVisible(true), 10);
    }, []);

    return (
        <div style={styles.modalOverlay}>
            {/* Modal Content */}
            <div
                style={{
                    ...styles.modalContent,
                    transform: visible ? "translateY(0)" : "translateY(50px)",
                    opacity: visible ? 1 : 0
                }}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-[16px] right-[16px] bg-transparent border-0 text-[#fff] cursor-pointer ">
                    <AiOutlineClose size={24} />
                </button>

                {/* Modal Heading */}
                <h2 className='text-4xl font-bold text-center mt-[4rem]'>
                    Your road to master is <br /> just a sign-up away
                </h2>

                {/* Form Starts Here */}
                <form onSubmit={handleSubmit} className="signUpForm mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 px-[31px]">
                    
                    {/* First Name Field */}
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-[#A1A1A1]">
                            First name
                        </label>
                        <div className="mt-2">
                            <input
                                name="firstName"
                                type="text"
                                value={userData.firstName}
                                onChange={handleChange}
                                className="input-style"
                            />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                        </div>
                    </div>

                    {/* Last Name Field */}
                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-[#A1A1A1]">
                            Last name
                        </label>
                        <div className="mt-2">
                            <input
                                name="lastName"
                                type="text"
                                value={userData.lastName}
                                onChange={handleChange}
                                className="input-style"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-[#A1A1A1]">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                name="email"
                                type="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="input-style"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="sm:col-span-6">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-[#A1A1A1]">
                            Create a Password
                        </label>
                        <div className="mt-2">
                            <input
                                name="password"
                                type="password"
                                value={userData.password}
                                onChange={handleChange}
                                className="input-style"
                            />
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="sm:col-span-6">
                        <label htmlFor="repassword" className="block text-sm/6 font-medium text-[#A1A1A1]">
                            Rewrite your Password
                        </label>
                        <div className="mt-2">
                            <input
                                name="confirmPassword"
                                type="password"
                                value={userData.confirmPassword}
                                onChange={handleChange}
                                className="input-style"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Start Learning
                    </button>

                    {/* Terms and Conditions Notice */}
                    <p className='text-sm sm:col-span-6 text-center text-[#a1a1a1]'>
                        By joining, you agree to our <span className='text-white'>Terms of Service</span> and <span className='text-white'>Privacy Policy</span>
                    </p>
                </form>

                {/* Link to Switch to Login */}
                <div>
                    <p
                        className='text-sm sm:col-span-6 text-center text-[#a1a1a1] mt-3 pt-3.5 pb-3.5 border-t-1 border-[#252525] relative'
                        onClick={switchToSignIn}
                    >
                        Already have an account? <span className='text-white cursor-pointer'>Login</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

// Styles for the modal
const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.9)", // Dark transparent background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "opacity 0.9s ease-in-out", // Smooth transition
    },
    modalContent: {
        background: "#0a0a0a", // Modal background color
        border: "1px solid #252525",
        borderRadius: "18px",
        width: "640px",
        transition: "transform 0.4s ease-in-out, opacity 0.4s ease-in-out",
        position: "relative"
    },
};

export default SignUpModal;
