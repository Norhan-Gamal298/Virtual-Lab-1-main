import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from "../features/auth/authAPI";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import countries from '../../countries';
import { FiMail, FiLock, FiUser, FiArrowRight, FiArrowLeft, FiPhone, FiGlobe, FiCalendar, FiBook, FiBriefcase, FiClock, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import logoLight from "../assets/Logo-Light.png";
import logoDark from "../assets/Logo-Dark.png";

const MultiStepRegistration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    // Form data state
    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",

        // Step 2: Personal Details
        phoneNumber: "",
        gender: "",
        country: "",
        dateOfBirth: "",

        // Step 3: Education & Preferences
        educationalLevel: "High School",
        fieldOfStudy: "",
        professionalStatus: "Student",
        emailNotifications: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    const [errors, setErrors] = useState({});

    // Validation patterns
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const namePattern = /^[A-Za-z]+$/;
    const phonePattern = /^\+?[\d\s-]{10,}$/;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateStep = () => {
        let newErrors = {};

        if (step === 1) {
            if (!formData.firstName.trim()) {
                newErrors.firstName = "First name is required";
            } else if (!namePattern.test(formData.firstName)) {
                newErrors.firstName = "First name should only contain letters";
            }

            if (!formData.lastName.trim()) {
                newErrors.lastName = "Last name is required";
            } else if (!namePattern.test(formData.lastName)) {
                newErrors.lastName = "Last name should only contain letters";
            }

            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!emailPattern.test(formData.email)) {
                newErrors.email = "Invalid email format";
            }

            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (!passwordPattern.test(formData.password)) {
                newErrors.password =
                    "Password must be at least 8 characters long and include an uppercase, lowercase, number, and special character";
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        if (step === 2) {
            if (formData.phoneNumber && !phonePattern.test(formData.phoneNumber)) {
                newErrors.phoneNumber = "Invalid phone number format";
            }

            if (!formData.country) {
                newErrors.country = "Country is required";
            }

            if (!formData.dateOfBirth) {
                newErrors.dateOfBirth = "Date of birth is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = (e) => {
        e.preventDefault();
        if (validateStep()) {
            setDirection(1);
            setStep(prev => prev + 1);
        } else {
            Object.values(errors).forEach(error => {
                toast.error(error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            });
        }
    };

    const prevStep = () => {
        setDirection(-1);
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step !== 3) return;
        if (!validateStep()) return;

        try {
            setIsLoading(true);
            const response = await authAPI.register(formData);
            setRegisteredEmail(formData.email);
            setShowConfirmation(true);

            if (response.user && response.token) {
                dispatch(setCredentials({ user: response.user, token: response.token }));
                navigate("/profile");
            }
        } catch (error) {
            toast.error(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, x: direction > 0 ? 20 : -20 }, // Reduced from 100px
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'tween', // Simpler than spring
                duration: 0.1, // Faster transition
                when: "beforeChildren",
                staggerChildren: 0.05 // Reduced stagger
            }
        },
        exit: { opacity: 0, x: direction > 0 ? -20 : 20 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 }, // Reduced from 20px
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.01 }}
            className="p-8 bg-white/80 dark:bg-[#1e1e1e] backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/30"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
            >
                <img
                    className="p-[0.5rem] h-[65px]! w-auto navLogo  m-auto mb-[1rem] transition-all duration-300"
                    src={isDark ? logoDark : logoLight}
                    alt="logo"
                />
            </motion.div>

            <hr className='w-[125%] justify-self-center mb-[2rem] text-[#ececec] dark:text-[#353535]' />

            <div className="text-center mb-8">
                <motion.h1
                    key={`title-${step}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.01 }}
                    className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2"
                >
                    {step === 1 && "Create Your Account"}
                    {step === 2 && "Personal Details"}
                    {step === 3 && "Complete Your Profile"}
                </motion.h1>
                <motion.p
                    key={`subtitle-${step}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.01 }}
                    className="text-center text-gray-600 dark:text-gray-400"
                >
                    {step === 1 && "Join us to get started"}
                    {step === 2 && "Tell us more about yourself"}
                    {step === 3 && "Finalize your preferences"}
                </motion.p>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mb-8">
                {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex flex-col items-center flex-1">
                        <motion.div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${step === stepNumber
                                ? 'bg-[#2563EB] dark:bg-[#7C3AED] text-white'
                                : step > stepNumber
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 dark:bg-[#2f2f2f] text-gray-600 dark:text-gray-300'
                                }`}
                            whileHover={{ scale: step >= stepNumber ? 1.1 : 1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                            {step > stepNumber ? (
                                <FiCheck className="w-5 h-5" />
                            ) : (
                                <span className="font-medium">{stepNumber}</span>
                            )}
                        </motion.div>
                        <span className={`text-xs font-medium ${step === stepNumber
                            ? 'text-[#2563EB] dark:text-[#7C3AED]'
                            : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {stepNumber === 1 ? 'Account' : stepNumber === 2 ? 'Details' : 'Preferences'}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="text-gray-400" />
                                        </div>
                                        <input
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="text-gray-400" />
                                        </div>
                                        <input
                                            name="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                    {errors.lastName && (
                                        <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants} className="md:col-span-2">
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
                                            className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="text-gray-400" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                                    </p>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLock className="text-gray-400" />
                                        </div>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Step 2: Personal Details */}
                        {step === 2 && (
                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiPhone className="text-gray-400" />
                                        </div>
                                        <input
                                            name="phoneNumber"
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                                            placeholder="+1 (123) 456-7890"
                                        />
                                    </div>
                                    {errors.phoneNumber && (
                                        <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gender
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-[#323232] bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200 appearance-none"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="text-gray-400" />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Country
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiGlobe className="text-gray-400" />
                                        </div>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.country ? 'border-red-500' : 'border-gray-300 dark:border-[#323232]'} bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200 appearance-none`}
                                            required
                                        >
                                            <option value="">Select country</option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.country && (
                                        <p className="mt-2 text-sm text-red-600">{errors.country}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                                                onChange={(newValue) => {
                                                    setFormData({ ...formData, dateOfBirth: newValue ? newValue.toDate() : null });
                                                }}
                                                maxDate={dayjs()}
                                                slotProps={{
                                                    textField: {
                                                        variant: 'outlined',
                                                        error: !!errors.dateOfBirth,
                                                        fullWidth: true,
                                                        placeholder: "Select date of birth",
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    {errors.dateOfBirth && (
                                        <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Step 3: Education & Preferences */}
                        {step === 3 && (
                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Highest Education Level
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiBook className="text-gray-400" />
                                        </div>
                                        <select
                                            name="educationalLevel"
                                            value={formData.educationalLevel}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-[#323232] bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200 appearance-none"
                                        >
                                            <option value="High School">High School</option>
                                            <option value="University">University</option>
                                            <option value="Bachelor's">Bachelor's Degree</option>
                                            <option value="Master's">Master's Degree</option>
                                            <option value="Doctorate">Doctorate</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Field of Study
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiBook className="text-gray-400" />
                                        </div>
                                        <input
                                            name="fieldOfStudy"
                                            type="text"
                                            value={formData.fieldOfStudy}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-[#323232] bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200"
                                            placeholder="Computer Science, Business, etc."
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Professional Status
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiBriefcase className="text-gray-400" />
                                        </div>
                                        <select
                                            name="professionalStatus"
                                            value={formData.professionalStatus}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-[#323232] bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200 appearance-none"
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Employed">Employed</option>
                                            <option value="Unemployed">Unemployed</option>
                                            <option value="Self-employed">Self-employed</option>
                                            <option value="Retired">Retired</option>
                                        </select>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Time Zone
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiClock className="text-gray-400" />
                                        </div>
                                        <select
                                            name="timeZone"
                                            value={formData.timeZone}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-[#323232] bg-[#F9FAFB] dark:bg-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200 appearance-none"
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Europe/London">London (GMT)</option>
                                            <option value="Europe/Paris">Paris (CET)</option>
                                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                                        </select>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="md:col-span-2">
                                    <div className="flex items-center">
                                        <motion.input
                                            name="emailNotifications"
                                            type="checkbox"
                                            checked={formData.emailNotifications}
                                            onChange={handleChange}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-300"
                                            whileTap={{ scale: 0.95 }}
                                        />
                                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Receive email notifications
                                        </label>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="md:col-span-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        By joining, you agree to our{" "}
                                        <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="mt-8 flex justify-between">
                    {step > 1 ? (
                        <motion.button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 font-medium flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiArrowLeft className="mr-2" />
                            Back
                        </motion.button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <motion.button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-3 rounded-lg bg-blue-600 dark:bg-[#7C3AED] text-white font-medium hover:bg-blue-700 dark:hover:bg-[#6D28D9] focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors duration-300 flex items-center"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Continue
                            <FiArrowRight className={`ml-2 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                        </motion.button>
                    ) : (
                        <motion.button
                            type="submit"
                            disabled={isLoading || step < 3}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            whileHover={{ scale: isLoading ? 1 : 1.05 }}
                            whileTap={{ scale: isLoading ? 1 : 0.95 }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </>
                            ) : (
                                <>
                                    Complete Registration
                                    <FiArrowRight className={`ml-2 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </form>

            {step === 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-center"
                >
                    <p className="text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 dark:text-[#7C3AED] font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            )}

            {/* Confirmation Popup */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-white dark:bg-[#1e1e1e] p-6 rounded-lg max-w-md w-full border border-white/20 dark:border-gray-700/30"
                        >
                            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                                Please confirm your email
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                We've sent a confirmation email to <strong>{registeredEmail}</strong>.
                                Please check your inbox and click the verification link
                                to complete your registration.
                            </p>
                            <div className="flex justify-end">
                                <motion.button
                                    onClick={() => {
                                        setShowConfirmation(false);
                                        navigate('/login');
                                    }}
                                    className="px-4 py-2 bg-blue-600 dark:bg-[#7C3AED] text-white rounded-md hover:bg-blue-700 dark:hover:bg-[#6D28D9] transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    OK
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MultiStepRegistration;