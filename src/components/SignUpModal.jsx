import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const SignUpModal = ({ onClose, switchToSignIn }) => {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const namePattern = /^[A-Za-z]+$/;

    useEffect(() => {
        setTimeout(() => setVisible(true), 10);
    }, []);

    const validateForm = () => {
        let newErrors = {};
        if (!userData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (!namePattern.test(userData.firstName)) {
            newErrors.firstName = "First name should only contain letters";
        }

        if (!userData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (!namePattern.test(userData.lastName)) {
            newErrors.lastName = "Last name should only contain letters";
        }

        if (!userData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(userData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!userData.password) {
            newErrors.password = "Password is required";
        } else if (!passwordPattern.test(userData.password)) {
            newErrors.password =
                "Password must be at least 8 characters long and include an uppercase, lowercase, number, and special character";
        }

        if (!userData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (userData.password !== userData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Simulate API call
                console.log('Registering user:', userData);
                // const response = await authAPI.register(userData);
                // dispatch(setCredentials({ user: response.user, token: response.token }));
                setShowNotification(true);
            } catch (error) {
                setErrors({ apiError: error.message });
            }
        }
    };

    const handleNotificationClose = () => {
        setShowNotification(false);
        onClose();
        // navigate("/profile");
    };

    return (
        <div className="fixed inset-0 bg-[#000000]/75 bg-opacity-70 flex items-center justify-center transition-opacity duration-900 ease-in-out z-50">
            <div
                className={`relative w-[640px] bg-white dark:bg-[#0a0a0a] rounded-[18px] transition-all duration-400 ease-in-out transform ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#1F2937] dark:text-white bg-transparent border-0 cursor-pointer"
                >
                    <X size={24} />
                </button>

                <h2 className="text-4xl text-[#1F2937] dark:text-[#F3F4F6] font-bold text-center mt-16">
                    Your road to master is <br /> just a sign-up away
                </h2>

                <div
                    onSubmit={handleSubmit}
                    className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 px-8 pb-6"
                >
                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-[#A1A1A1]">
                            First name
                        </label>
                        <input
                            name="firstName"
                            type="text"
                            value={userData.firstName}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-md border border-[#393939] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-[#A1A1A1]">
                            Last name
                        </label>
                        <input
                            name="lastName"
                            type="text"
                            value={userData.lastName}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-md border border-[#393939] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    </div>

                    <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-[#A1A1A1]">
                            Email address
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-md border border-[#393939] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-[#A1A1A1]">
                            Create a Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={userData.password}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-md border border-[#393939] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-[#A1A1A1]">
                            Rewrite your Password
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={userData.confirmPassword}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-md border border-[#393939] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="sm:col-span-6 w-full mt-4 rounded-lg bg-[#1F2937] dark:bg-[#F9FAFB] text-white dark:text-black py-3 text-sm font-semibold transition-colors dark:hover:bg-[#929292] dark:hover:text-white hover:bg-[#3d526f] "
                    >
                        Start Learning
                    </button>

                    <p className="text-sm sm:col-span-6 text-center text-[#a1a1a1] mt-2">
                        By joining, you agree to our{" "}
                        <span className="text-[#1F2937] dark:text-white underline">Terms of Service</span> and{" "}
                        <span className="text-[#1F2937] dark:text-white underline">Privacy Policy</span>
                    </p>
                </div>

                <div>
                    <p
                        className="text-sm text-center text-[#a1a1a1] mt-3 py-3 border-t border-[#252525] cursor-pointer"
                        onClick={switchToSignIn}
                    >
                        Already have an account?{" "}
                        <span className="text-[#1F2937] dark:text-white underline">Login</span>
                    </p>
                </div>
            </div>

            {/* Email Verification Notification */}
            {showNotification && (
                <div className="fixed inset-0 bg-[#000000]/75 bg-opacity-70 flex items-center justify-center z-60">
                    <div className="relative w-[480px] bg-white dark:bg-[#0a0a0a] rounded-[18px] p-8 transform transition-all duration-300 ease-in-out">
                        <button
                            onClick={handleNotificationClose}
                            className="absolute top-4 right-4 text-[#1F2937] dark:text-white bg-transparent border-0 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold text-[#1F2937] dark:text-[#F3F4F6] mb-3">
                                Account Created Successfully!
                            </h3>

                            <p className="text-sm text-[#A1A1A1] mb-6 leading-relaxed">
                                We've sent a verification email to <span className="text-[#1F2937] dark:text-white font-medium">{userData.email}</span>.
                                Please check your inbox and click the verification link to activate your account.
                            </p>

                            <button
                                onClick={handleNotificationClose}
                                className="w-full rounded-lg bg-[#1F2937] dark:bg-[#F9FAFB] text-white dark:text-black py-3 text-sm font-semibold transition-colors dark:hover:bg-[#929292] dark:hover:text-white hover:bg-[#3d526f]"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUpModal;