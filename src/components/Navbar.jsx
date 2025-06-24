import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AuthModalManager from "./AuthModalManager";
import logo from "../assets/virtual-lab-logo.png";
import logoLight from "../assets/Logo-Light.png";
import logoDark from "../assets/Logo-Dark.png";
import SearchModal from "./SearchModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import defaultAvatar from "../assets/default-avatar.png";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../ThemeProvider";
import { authAPI } from "../features/auth/authAPI"; // Add this import


const Navbar = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [completionRate, setCompletionRate] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const token = useSelector(state => state.auth.token);

  const isDocsPage = location.pathname.startsWith("/docs");
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      if (user.hasProfileImage) {
        const imageUrl = authAPI.getProfileImageUrl(user.id);
        setProfileImage(imageUrl);
      } else {
        setProfileImage(null);
      }
    }
  }, [user?.id, user?.hasProfileImage]);
  // Get theme context
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  const handleDocsClick = async () => {
    try {
      setShowMobileMenu(false); // Close mobile menu
      const response = await fetch("http://localhost:8080/api/topics");
      if (!response.ok) throw new Error("Failed to fetch topics");
      const data = await response.json();

      const sortedChapters = [...data].sort((a, b) => {
        const numA = parseInt(a.chapter?.match(/^\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.chapter?.match(/^\d+/)?.[0] || "0", 10);
        return numA - numB;
      });

      const allTopics = sortedChapters.flatMap((chapter) =>
        [...chapter.topics].sort((a, b) => {
          const getParts = (t) => {
            const match = t.id.match(/^chapter_(\d+)_(\d+)_(\d+)_/);
            return match
              ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
              : [0, 0, 0];
          };
          const [a1, a2, a3] = getParts(a);
          const [b1, b2, b3] = getParts(b);
          return a1 - b1 || a2 - b2 || a3 - b3;
        })
      );

      if (allTopics.length > 0) {
        navigate(`/docs/${allTopics[0].id}`);
      } else {
        alert("No topics available.");
      }
    } catch (error) {
      console.error("Error loading docs:", error);
    }
  };

  const handleMobileLinkClick = () => {
    setShowMobileMenu(false);
  };

  // Handle clicks outside dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (!mobileMenuButton?.contains(event.target)) {
          setShowMobileMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    const fetchProgress = async () => {
      try {
        if (!email) return;

        const [chaptersRes, progressRes] = await Promise.all([
          fetch("http://localhost:8080/api/topics"),
          fetch(`http://localhost:8080/api/user-progress/${email}`),
        ]);

        const chaptersData = await chaptersRes.json();
        const progressData = await progressRes.json();

        const totalTopics = chaptersData.reduce(
          (total, chapter) => total + chapter.topics.length,
          0
        );

        const completedCount = Array.isArray(progressData)
          ? progressData.filter((t) => t.completed).length
          : Object.values(progressData).filter(Boolean).length;

        setCompletionRate(totalTopics ? (completedCount / totalTopics) * 100 : 0);
      } catch (err) {
        console.error("Failed to calculate user progress:", err);
      }
    };

    fetchProgress();
  }, []);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-brand-background dark:bg-dark-brand-background border-neutral-border shadow-sm px-4 py-3 poppins-regular transition-colors duration-300 dark:border-dark-neutral-border">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center text-center">
          <img
            className="p-[0.5rem] h-[45px]! w-auto navLogo transition-all duration-300"
            src={isDark ? logoDark : logoLight}
            alt="logo"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6 transition-colors duration-300">
          <button
            onClick={handleDocsClick}
            className="text-neutral-text-secondary hover:text-neutral-600 text-[16px] font-medium transition-colors dark:text-dark-text-secondary dark:hover:text-neutral-300"
          >
            Docs
          </button>
          <Link
            to="/about"
            className="text-neutral-text-secondary hover:text-neutral-600 text-[16px] font-medium transition-colors dark:text-dark-text-secondary dark:hover:text-neutral-300"
          >
            About
          </Link>
          <Link
            to="/blogs"
            className="text-neutral-text-secondary hover:text-neutral-600 text-[16px] font-medium transition-colors dark:text-dark-text-secondary dark:hover:text-neutral-300"
          >
            Blog
          </Link>
          <Link
            to="/community"
            className="text-neutral-text-secondary hover:text-neutral-600 text-[16px] font-medium transition-colors dark:text-dark-text-secondary dark:hover:text-neutral-300"
          >
            Community
          </Link>
        </div>

        {/* Desktop Right Side Controls */}
        <div className="hidden md:flex items-center gap-3 select-none transition duration-300">
          {/* Theme Toggle Button */}
          <button
            className="p-[12px] rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-colors duration-300 border border-neutral-border hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
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
                  <FiSun className="dark:text-white" size={24} />
                ) : (
                  <FiMoon className="dark:text-white" size={24} />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Search Button (only on docs page) */}
          {isDocsPage && (
            <button
              className="p-[12px] rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] duration-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-neutral-text-secondary transition-colors border border-neutral-border"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <FiSearch
                className="text-[#000] dark:text-[#fff] transition-colors duration-300"
                size={24}
              />
            </button>
          )}

          {/* User Profile or Sign Up */}
          {user ? (
            <div className="relative cursor-pointer" ref={dropdownRef}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2   rounded-lg transition-colors"
              >
                <div
                  className="p-[4px] rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                  style={{
                    background: `conic-gradient(#7c3aed ${completionRate}%, ${document.documentElement.classList.contains('dark') ? '#d1d1d1' : '#303135'
                      } ${completionRate}%)`,
                  }}
                >
                  <img
                    src={profileImage || defaultAvatar}
                    alt="User"
                    className="w-12 h-12 rounded-md object-cover border border-neutral-border bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-all duration-200"
                  />
                </div>
                <span className="font-medium text-neutral-text-primary dark:text-dark-text-primary">
                  {user.name}
                </span>
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#F5F7FA] dark:bg-[#1f1f1f] rounded-md shadow-lg border border-neutral-border dark:border-dark-neutral-border z-50 overflow-hidden">
                  <div
                    className="px-4 py-3 text-[#000] dark:text-[#fff] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/profile");
                    }}
                  >
                    Profile Dashboard
                  </div>
                  <div
                    className="px-4 py-3 text-[#000] dark:text-[#fff] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors duration-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Log out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-7 py-[12px] rounded-lg bg-[#F5F7FA] text-[14px] dark:bg-[#1f1f1f] border border-neutral-border dark:border-[#3b3b3b] text-primary-text dark:text-dark-text-primary transition-colors font-medium hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
              onClick={() => setActiveModal("signup")}
            >
              Sign Up
            </button>
          )}
        </div>

        {/* Mobile Right Side Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Theme Toggle Button (Mobile) */}
          <button
            className="p-2 rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-colors duration-300 border border-neutral-border hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
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
                  <FiSun className="dark:text-white" size={20} />
                ) : (
                  <FiMoon className="dark:text-white" size={20} />
                )}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Search Button (Mobile - only on docs page) */}
          {isDocsPage && (
            <button
              className="p-2 rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] duration-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-neutral-text-secondary transition-colors border border-neutral-border"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <FiSearch
                className="text-[#000] dark:text-[#fff] transition-colors duration-300"
                size={20}
              />
            </button>
          )}

          {/* User Avatar (Mobile) */}
          {user && (
            <div
              className="p-[2px] rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
              style={{
                background: `conic-gradient(#7c3aed ${completionRate}%, ${document.documentElement.classList.contains('dark') ? '#d1d1d1' : '#303135'
                  } ${completionRate}%)`,
              }}
              onClick={() => setShowMobileMenu(true)}
            >
              <img
                src={`${user.image || defaultAvatar}?v=${Date.now()}`}
                alt="User"
                className="w-8 h-8 rounded-md object-cover border border-neutral-border bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-all duration-200"
              />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-button"
            className="p-2 rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-colors duration-300 border border-neutral-border hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? (
              <FiX className="text-[#000] dark:text-[#fff]" size={20} />
            ) : (
              <FiMenu className="text-[#000] dark:text-[#fff]" size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-brand-background dark:bg-dark-brand-background border-l border-neutral-border dark:border-dark-neutral-border z-50 md:hidden shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-border dark:border-dark-neutral-border">
                <div className="flex items-center gap-3">
                  {user && (
                    <>
                      <div
                        className="p-[2px] rounded-lg transition-all duration-200"
                        style={{
                          background: `conic-gradient(#7c3aed ${completionRate}%, ${document.documentElement.classList.contains('dark') ? '#d1d1d1' : '#303135'
                            } ${completionRate}%)`,
                        }}
                      >
                        <img
                          src={`${user.image || defaultAvatar}?v=${Date.now()}`}
                          alt="User"
                          className="w-10 h-10 rounded-md object-cover border border-neutral-border bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b]"
                        />
                      </div>
                      <span className="font-medium text-neutral-text-primary dark:text-dark-text-primary">
                        {user.name}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
                >
                  <FiX className="text-[#000] dark:text-[#fff]" size={20} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="flex-1 p-4">
                <div className="space-y-1">
                  <button
                    onClick={handleDocsClick}
                    className="w-full text-left px-4 py-3 text-[16px] font-medium text-neutral-text-secondary dark:text-dark-text-secondary hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-all duration-200"
                  >
                    Docs
                  </button>
                  <Link
                    to="/about"
                    onClick={handleMobileLinkClick}
                    className="block px-4 py-3 text-[16px] font-medium text-neutral-text-secondary dark:text-dark-text-secondary hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-all duration-200"
                  >
                    About
                  </Link>
                  <Link
                    to="/blogs"
                    onClick={handleMobileLinkClick}
                    className="block px-4 py-3 text-[16px] font-medium text-neutral-text-secondary dark:text-dark-text-secondary hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-all duration-200"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/community"
                    onClick={handleMobileLinkClick}
                    className="block px-4 py-3 text-[16px] font-medium text-neutral-text-secondary dark:text-dark-text-secondary hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-all duration-200"
                  >
                    Community
                  </Link>
                </div>

                {user && (
                  <>
                    <div className="border-t border-neutral-border dark:border-dark-neutral-border my-4"></div>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left px-4 py-3 text-[16px] font-medium text-neutral-text-secondary dark:text-dark-text-secondary hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-all duration-200"
                      >
                        Profile Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-[16px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Footer */}
              {!user && (
                <div className="p-4 border-t border-neutral-border dark:border-dark-neutral-border">
                  <button
                    className="w-full px-7 py-3 rounded-lg bg-[#F5F7FA] text-[14px] dark:bg-[#1f1f1f] border border-neutral-border dark:border-[#3b3b3b] text-primary-text dark:text-dark-text-primary transition-colors font-medium hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                    onClick={() => {
                      setActiveModal("signup");
                      setShowMobileMenu(false);
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {activeModal && (
        <AuthModalManager
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </nav>
  );
};

export default Navbar;