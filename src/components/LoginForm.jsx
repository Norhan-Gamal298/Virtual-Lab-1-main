import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { authAPI } from '../features/auth/authAPI';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import logoLight from '../assets/logo-light.png';
import logoDark from '../assets/logo-dark.png';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showReset, setShowReset] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validateForm = () => {
        let newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await authAPI.login(formData);
            dispatch(setCredentials({ user: response.user, token: response.token }));

            toast.success("Login successful! Redirecting...", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            navigate("/profile");
        } catch (error) {
            toast.error(error.message || "Login failed. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();

        if (!resetEmail) {
            toast.error("Email is required for password reset", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/request-reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resetEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Check your email for a reset link.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setShowReset(false);
            } else {
                toast.error(data.error || "Error sending reset email.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        } catch (err) {
            toast.error("Network error.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 poppins-regular transition-all duration-200">
            <div className="w-full max-w-md">
                <div className="relative">
                    {/* Glassmorphism container */}
                    <div className="bg-white/80 dark:bg-[#1e1e1e] backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/30">
                        {/* Decorative accent */}

                        {/* Logo */}
                        <div className="flex justify-center pt-8">
                            <img
                                src={logoLight}
                                alt="Logo"
                                className="h-12 dark:hidden"
                            />
                            <img
                                src={logoDark}
                                alt="Logo"
                                className="h-12 hidden dark:block"
                            />
                        </div>

                        {showReset ? (
                            <div className="px-8 py-8">
                                <button
                                    onClick={() => setShowReset(false)}
                                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
                                >
                                    <FiArrowLeft className="mr-2" />
                                    Back to login
                                </button>

                                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
                                    Reset Password
                                </h2>
                                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                                    Enter your email to receive a password reset link
                                </p>

                                <form onSubmit={handleResetSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMail className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-[#323232] bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200"
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center items-center py-3 px-4 rounded-lg dark:bg-[#7C3AED] text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 ${isLoading ? 'opacity-75' : ''}`}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Reset Link
                                                <FiArrowRight className={`ml-2 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="px-8 py-8">
                                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                                    Sign in to continue to your account
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMail className="text-gray-400" />
                                            </div>
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-[#E5E7EB] dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setShowReset(true)}
                                                className="text-sm text-blue-600 dark:text-purple-400 hover:text-blue-800 dark:hover:text-purple-300 transition-colors"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiLock className="text-gray-400" />
                                            </div>
                                            <input
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-[#E5E7EB] dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg bg-[#2563EB] dark:bg-[#7C3AED] text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-[#5B21B6] dark:focus:ring-offset-2 dark:focus:ring-offset-[#1e1e1e] transition-all duration-200 ${isLoading ? 'opacity-75' : ''}`}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Signing in...
                                                </>
                                            ) : (
                                                <>
                                                    Sign In
                                                    <FiArrowRight className={`ml-2 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white/80 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400">
                                                Don't have an account?
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            to="/register"
                                            className="w-full flex justify-center items-center py-3 px-4 rounded-lg border border-[#E5E7EB] dark:border-[#323232] bg-[#F9FAFB] dark:bg-[#1E1E1E] text-gray-700 dark:text-gray-300 font-medium hover:bg-[#e8e8e8] dark:hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-[#5B21B6] dark:focus:ring-offset-2 dark:focus:ring-offset-[#1e1e1e] transition-all duration-200"
                                        >
                                            <FiUser className="mr-2" />
                                            Create Account
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Virtual Lab. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default LoginForm;