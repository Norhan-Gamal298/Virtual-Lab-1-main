import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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

    // Get theme context
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const handleLogout = () => {
        dispatch(logout());
        setShowDropdown(false);
        navigate("/");
    };

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-[var(--color-neutral-surface)] backdrop-blur-md border-b border-[var(--color-neutral-border)] shadow-sm px-4 py-3 poppins-regular transition-colors duration-300">
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
                        className="text-[var(--color-neutral-text-secondary)] hover:text-[var(--color-neutral-text-primary)] text-[16px] font-medium transition-colors"
                    >
                        Docs
                    </Link>
                    <Link
                        to="/about"
                        className="text-[var(--color-neutral-text-secondary)] hover:text-[var(--color-neutral-text-primary)] text-[16px] font-medium transition-colors"
                    >
                        About
                    </Link>
                    <Link
                        to="/blogs"
                        className="text-[var(--color-neutral-text-secondary)] hover:text-[var(--color-neutral-text-primary)] text-[16px] font-medium transition-colors"
                    >
                        Blog
                    </Link>
                    <Link
                        to="/community"
                        className="text-[var(--color-neutral-text-secondary)] hover:text-[var(--color-neutral-text-primary)] text-[16px] font-medium transition-colors"
                    >
                        Community
                    </Link>
                </div>

                <div className="flex items-center gap-3 select-none">
                    {/* Theme Toggle Button - Updated */}
                    <button
                        className="p-[12px] rounded-lg bg-[var(--color-neutral-background)] hover:bg-[var(--color-secondary-surface-tint)] text-[var(--color-neutral-text-secondary)] transition-colors border border-[var(--color-neutral-border)]"
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
                            className="p-[12px] rounded-lg bg-[var(--color-neutral-background)] hover:bg-[var(--color-secondary-surface-tint)] text-[var(--color-neutral-text-secondary)] transition-colors border border-[var(--color-neutral-border)]"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Open search"
                        >
                            <FiSearch size={22} />
                        </button>
                    )}

                    {user ? (
                        <div className="relative cursor-pointer">
                            <div
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2"
                            >
                                <img
                                    src={`${user.image || defaultAvatar}?v=${Date.now()}`}
                                    alt="User"
                                    className="w-10 h-10 rounded-lg object-cover border border-[var(--color-neutral-border)]"
                                />
                                <span className="text-[var(--color-neutral-text-primary)] font-medium hidden md:inline">
                                    {user.name}
                                </span>
                            </div>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-[var(--color-neutral-surface)] rounded-md shadow-lg border border-[var(--color-neutral-border)] z-50 overflow-hidden">
                                    <div
                                        className="px-4 py-3 text-[var(--color-neutral-text-primary)] hover:bg-[var(--color-secondary-surface-tint)] transition-colors duration-200 cursor-pointer"
                                        onClick={() => {
                                            setShowDropdown(false);
                                            navigate("/profile");
                                        }}
                                    >
                                        Profile Dashboard
                                    </div>
                                    <div
                                        className="px-4 py-3 text-[var(--color-neutral-text-primary)] hover:bg-[var(--color-secondary-surface-tint)] transition-colors duration-200 cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="px-5 py-2.5 rounded-lg bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-text-on-primary)] font-medium transition-colors"
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