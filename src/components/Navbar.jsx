import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthModalManager from "./AuthModalManager";
import logo from "../assets/virtual-lab-logo.png";
import SearchModal from "./SearchModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import defaultAvatar from "../assets/default-avatar.png";
import { FiSearch } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from 'react';
import { ThemeContext } from '../ThemeProvider';

const Navbar = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const isDocsPage = location.pathname.startsWith("/docs");
    const { isDark, setIsDark } = useContext(ThemeContext);


    const handleLogout = () => {
        dispatch(logout());
        setShowDropdown(false);
        navigate("/");
    };

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md shadow-md border-b border-white/10 px-4 py-3 poppins-regular">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center">

                <Link to="/" style={styles.logo} className="flex items-center text-center">
                    <img className="p-[0.5rem]" src={logo} alt="logo" width={140} />
                </Link>

                <div className="flex gap-[1.5rem]" style={styles.navLinks}>
                    <Link to="/docs/chapter_1_1_what_is_image_processing" className="text-white text-[16px] transition-colors">Docs</Link>
                    <Link to="/about" className="text-white text-[16px] transition-colors">About</Link>
                    <Link to="/blogs" className="text-white text-[16px] transition-colors">Blog</Link>
                    <Link to="/community" className="text-white text-[16px] transition-colors">Community</Link>
                </div>


                {/*Dark/Light Mode toggler */}
                <div className="flex">
                    <div className="mx-4 flex mr-[0rem] items-center">
                        <div
                            onClick={() => setIsDark(prev => !prev)}
                            className="bg-[#1f1f1f] py-[16px] px-[16px] rounded-[12px] border border-[#3B3B3B] hover:bg-[#3B3B3B] cursor-pointer duration-200"
                        >
                            {isDark ? '🌙' : '☀️'}
                        </div>
                    </div>

                    <div className="flex gap-[1rem] items-center">
                        {isDocsPage && (
                            <div className="mx-4 flex mr-[0rem] items-center">
                                <div
                                    onClick={() => setIsSearchOpen(true)}
                                    className="bg-[#1f1f1f] py-[16px] px-[16px] rounded-[12px] border border-[#3B3B3B] hover:bg-[#3B3B3B] cursor-pointer"
                                >
                                    <FiSearch size={22} />
                                </div>
                            </div>
                        )}


                        {user ? (
                            <div className="relative cursor-pointer">
                                <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">
                                    <img
                                        src={`${user.image || defaultAvatar}?v=${Date.now()}`}
                                        alt="User"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="text-white font-semibold">{user.name}</span>
                                </div>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                                        <div className="px-4 py-2 cursor-pointer" onClick={() => {
                                            setShowDropdown(false);
                                            navigate("/profile");
                                        }}>
                                            Profile Dashboard
                                        </div>
                                        <div className="px-4 py-2  cursor-pointer" onClick={handleLogout}>
                                            Log out
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                className="bg-[#1f1f1f] text-[white] text-[14px] cursor-pointer border border-[#3B3B3B] py-[16px] px-[38px] hover:bg-[#3B3B3B] rounded-[12px] ease-in-out font-bold "
                                style={styles.button}
                                onClick={() => setActiveModal('signup')}
                            >
                                Sign Up
                            </button>
                        )}
                    </div>
                </div>


                {activeModal && (
                    <AuthModalManager activeModal={activeModal} setActiveModal={setActiveModal} />
                )}

            </div>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
};

const styles = {
    navbar: {
        fontFamily: "Poppins"
    },
    button: {
        fontFamily: "Poppins",
    },

};

export default Navbar;
