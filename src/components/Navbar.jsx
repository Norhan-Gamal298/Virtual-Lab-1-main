import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AuthModalManager from "./AuthModalManager";
import logo from "../assets/virtual-lab-logo.png";
import SearchModal from "./SearchModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import defaultAvatar from "../assets/default-avatar.png";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from "../ThemeProvider";

const Navbar = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const isDocsPage = location.pathname.startsWith("/docs");
    const dropdownRef = useRef(null);
    // Get theme context
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const handleLogout = () => {
        dispatch(logout());
        setShowDropdown(false);
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // Add when dropdown is shown
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-brand-background dark:bg-dark-brand-background border-neutral-border shadow-sm px-4 py-3 poppins-regular transition-colors duration-300 dark:border-dark-neutral-border">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center text-center">
                    <img
                        className="p-[0.5rem] h-[60px] w-auto navLogo dark:brightness-100"
                        src={logo}
                        alt="logo"
                    />
                </Link>

                <div className="flex gap-6 transition-colors duration-300">
                    <Link
                        to="/docs/chapter_1_1_what_is_image_processing"
                        className="text-neutral-text-secondary hover:text-neutral-text-primary text-[16px] font-medium transition-colors dark:text-dark-text-secondary dark:hover:text-dark-neutral-text-primary"
                    >
                        Docs
                    </Link>
                    <Link
                        to="/about"
                        className="text-neutral-text-secondary hover:text-neutral-text-primary text-[16px] font-medium transition-colors dark:text-dark-text-secondary dark:hover:text-dark-neutral-text-primary"
                    >
                        About
                    </Link>
                    <Link
                        to="/blogs"
                        className="text-neutral-text-secondary hover:text-neutral-text-primary text-[16px] font-medium transition-colors dark:text-dark-text-secondary dark:hover:text-dark-neutral-text-primary"
                    >
                        Blog
                    </Link>
                    <Link
                        to="/community"
                        className="text-neutral-text-secondary hover:text-neutral-text-primary text-[16px] font-medium transition-colors dark:text-dark-text-secondary dark:hover:text-dark-neutral-text-primary"
                    >
                        Community
                    </Link>
                </div>

                <div className="flex items-center gap-3 select-none transition duration-300">
                    {/* Theme Toggle Button */}
                    <button
                        className="p-[12px] rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-colors duration-300 border border-neutral-border "
                        onClick={toggleTheme}
                        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={theme}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isDark ? (
                                    <FiSun className="text-yellow-300" size={22} />
                                ) : (
                                    <FiMoon className="text-gray-700" size={22} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </button>

                    {isDocsPage && (
                        <button
                            className="p-[12px] rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] duration-300 hover:bg-secondary-surface-tint text-neutral-text-secondary transition-colors border border-neutral-border"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Open search"
                        >
                            <FiSearch className="text-[#000] dark:text-[#fff] transition-colors duration-300" size={22} />
                        </button>
                    )}

                    {user ? (
                        <div className="relative cursor-pointer" ref={dropdownRef}>
                            <div
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2"
                            >
                                <img
                                    src={`${user.image || defaultAvatar}?v=${Date.now()}`}
                                    alt="User"
                                    className="w-12 h-12 rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] object-cover border border-neutral-border "
                                />
                                <span className="font-medium hidden md:inline ">
                                    {user.name}
                                </span>
                            </div>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#F5F7FA] rounded-md shadow-lg border border-neutral-border z-50 overflow-hidden dark:border-dark-neutral-border">
                                    <div
                                        className="px-4 py-3 text-[#000] hover:bg-secondary-surface-tint transition-colors duration-200 cursor-pointer dark:hover:bg-dark-secondary-surface-tint"
                                        onClick={() => {
                                            setShowDropdown(false);
                                            navigate("/profile");
                                        }}
                                    >
                                        Profile Dashboard
                                    </div>
                                    <div
                                        className="px-4 py-3 text-[#000] hover:bg-secondary-surface-tint transition-colors duration-200 cursor-pointer dark:hover:bg-dark-secondary-surface-tint"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="px-5 py-2.5 rounded-lg bg-primary-base hover:bg-primary-hover text-primary-text transition-colors font-medium dark:bg-primary-base dark:hover:bg-primary-hover"
                            onClick={() => setActiveModal('signup')}
                        >
                            Sign Up
                        </button>
                    )}
                </div>

                {activeModal && (
                    <AuthModalManager activeModal={activeModal} setActiveModal={setActiveModal} />
                )}
            </div>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
};

export default Navbar;