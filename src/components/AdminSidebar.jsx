import { useState } from 'react';
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbDashboard, TbUsers, TbBook, TbNews, TbSettings, TbUser, TbLogout } from "react-icons/tb";
import { motion, AnimatePresence, delay } from "framer-motion";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../ThemeProvider";
import { PiExamFill } from "react-icons/pi";


const AdminSidebar = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [expandedItems, setExpandedItems] = useState({});
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";


    const menuItems = [
        /* {
            label: 'Dashboard',
            icon: <TbDashboard size={28} />,
            path: '/admin',
            exact: true
        }, */
        {
            label: 'Users Management',
            icon: <TbUsers className='text-[#1F2937] dark:text-[#fff]' size={22} />,
            path: '/admin/users',
            hasSubItems: true,
            subItems: [
                {
                    label: 'Students',
                    path: '/admin/users'
                },
                {
                    label: 'Administrators',
                    path: '/admin/users/admins',
                    allowedRoles: ['root']
                }
            ],
        },
        {
            label: 'Course Management',
            icon: <TbBook className='text-[#1F2937] dark:text-[#fff]' size={22} />,
            path: '/admin/content'
        },
        {
            label: 'Blogs Management',
            icon: <TbNews className='text-[#1F2937] dark:text-[#fff]' size={22} />,
            path: '/admin/blogs'
        },
        {
            label: 'Quizzes Management',
            icon: <PiExamFill className='text-[#1F2937] dark:text-[#fff]' size={22} />, // You can replace this with a quiz-related icon if you like
            path: '/admin/quizzes'
        },
        /* {
            label: 'Settings',
            icon: <TbSettings size={28} />,
            path: '/admin/settings'
        },
        {
            label: 'Profile',
            icon: <TbUser size={28} />,
            path: '/admin/profile'
        } */
    ];

    const isActive = (path, exact) => {
        return exact ? location.pathname === path : location.pathname.startsWith(path);
    };

    // Check if any sub-item is active for parent item styling
    const isParentActive = (item) => {
        if (!item.hasSubItems) return false;
        return item.subItems.some(subItem => isActive(subItem.path));
    };

    const toggleItemExpansion = (label) => {
        setExpandedItems(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin/login');
    };

    // Animation variants for consistent transitions
    const sidebarVariants = {
        expanded: { width: 300 },
        collapsed: { width: 60 }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: -10,
            transition: {
                duration: 0.1,
                ease: "easeIn"
            }
        }
    };

    const subItemVariants = {
        hidden: { opacity: 0, maxHeight: 0 },
        visible: {
            opacity: 1,
            maxHeight: 200, // Adjust based on your content needs
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            maxHeight: 0,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const hoverTransition = {
        type: "tween",
        duration: 0.2
    };

    return (
        <motion.aside
            layout
            initial={sidebarCollapsed ? "collapsed" : "expanded"}
            animate={sidebarCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-[#fff] dark:bg-[#1a1a1a] text-[#1F2937] sticky top-0 z-40 overflow-hidden shadow-lg flex flex-col transition-colors duration-300"
        >
            <div className="flex-1 flex flex-col">
                <div className="p-2 border-b border-gray-800">
                    <motion.button
                        onClick={() => setSidebarCollapsed(prev => !prev)}
                        className="p-2 text-[#1F2937] dark:text-[#ffffff] bg-[#F5F7FA] dark:bg-[#1f1f1f] border border-[#323232] dark:border-[#3b3b3b] hover:dark:bg-[#454545] hover:bg-[#dedbf5] rounded-lg w-full flex justify-end transition-colors duration-300"
                        transition={hoverTransition}
                    >
                        {sidebarCollapsed ? (
                            <TbLayoutSidebarRightCollapse size={28} />
                        ) : (
                            <TbLayoutSidebarLeftCollapse size={28} />
                        )}
                    </motion.button>
                </div>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.label} className="place-items-start">
                                {item.hasSubItems ? (
                                    <motion.div
                                        layout
                                        className={`rounded-lg mr-auto flex flex-col whitespace-nowrap border transition-colors duration-300 ${isParentActive(item)
                                            ? 'border-[#6366f1] bg-[#e0e7ff] dark:bg-[#374151] dark:border-[#6366f1]'
                                            : 'border-[#525252] bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] hover:dark:bg-[#374151] hover:bg-[#e5e7eb]'
                                            }`}
                                    >
                                        <motion.button
                                            onClick={() => !sidebarCollapsed && toggleItemExpansion(item.label)}
                                            className={`flex items-center p-2 w-full rounded-lg justify-between transition-all duration-300 text-[#1F2937] dark:text-[#ffffff] justify-start mr-auto ${sidebarCollapsed ? '' : ''}`}
                                            transition={hoverTransition}
                                        >
                                            <div className="flex items-center">
                                                <span className="text-xl">{item.icon}</span>
                                                <AnimatePresence>
                                                    {!sidebarCollapsed && (
                                                        <motion.span
                                                            className="ml-2 text-sm"
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            variants={itemVariants}
                                                        >
                                                            {item.label}
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            {!sidebarCollapsed && item.hasSubItems && (
                                                <motion.span
                                                    animate={{
                                                        rotate: expandedItems[item.label] ? 90 : 0
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-xs"
                                                >
                                                    <FiChevronRight size={18} />
                                                </motion.span>
                                            )}
                                        </motion.button>

                                        <AnimatePresence>
                                            {(!sidebarCollapsed && expandedItems[item.label]) && (
                                                <motion.ul
                                                    layout
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={subItemVariants}
                                                    className="ml-6 overflow-hidden pb-2 bg-transparent"
                                                >
                                                    {item.subItems.map((subItem) => {
                                                        if (subItem.allowedRoles && !subItem.allowedRoles.includes(user?.role)) return null;
                                                        const isCurrentSubActive = location.pathname === subItem.path;
                                                        return (
                                                            <li key={subItem.label}>
                                                                <motion.div
                                                                    transition={hoverTransition}
                                                                    className="rounded-lg w-full"
                                                                >
                                                                    <NavLink
                                                                        to={subItem.path}
                                                                        className={`flex items-center p-2 justify-start text-sm rounded-lg w-full whitespace-nowrap mb-1 transition-all duration-300 ${isCurrentSubActive
                                                                            ? 'bg-[#3b82f6] text-white dark:bg-[#3b82f6] dark:text-white shadow-sm'
                                                                            : 'bg-transparent text-[#374151] dark:text-[#d1d5db] hover:bg-[#f3f4f6] dark:hover:bg-[#4b5563]'
                                                                            }`}
                                                                    >
                                                                        <motion.span
                                                                            variants={itemVariants}
                                                                        >
                                                                            {subItem.label}
                                                                        </motion.span>
                                                                    </NavLink>
                                                                </motion.div>
                                                            </li>
                                                        );
                                                    })}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        transition={hoverTransition}
                                        className="rounded-lg w-full mr-auto flex"
                                    >
                                        <NavLink
                                            to={item.path}
                                            end={item.exact}
                                            className={({ isActive }) =>
                                                `flex items-center text-[#1F2937] dark:text-[#ffffff] bg-[#F5F7FA] dark:bg-[#1f1f1f] border border-[#323232] dark:border-[#3b3b3b] transition-colors duration-300 p-[12px] dark:hover:bg-[#454545] hover:bg-[#dedbf5] rounded-lg w-[350px] whitespace-nowrap justify-start mr-auto  ${isActive ? 'dark:bg-[#454545] bg-[#dedbf5]' : ''} ${sidebarCollapsed ? "justify-center" : "justify-start "}`
                                            }
                                        >
                                            <span className="text-xl">{item.icon}</span>
                                            <AnimatePresence>
                                                {!sidebarCollapsed && (
                                                    <motion.span
                                                        className="ml-2 text-sm"
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        variants={itemVariants}
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </NavLink>
                                    </motion.div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="p-2 border-t border-gray-800 flex flex-col">
                <motion.button
                    className={`p-[12px] text-[#1F2937] dark:text-[#ffffff] rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-colors duration-300 border border-[#525252] mb-[10px] flex ${sidebarCollapsed ? '' : ''}`}
                    onClick={toggleTheme}
                    aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                    transition={hoverTransition}
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
                    <AnimatePresence>
                        {!sidebarCollapsed && (
                            <motion.span
                                className="ml-2 text-sm whitespace-nowrap"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={itemVariants}
                            >
                                Switch mode
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                <motion.button
                    onClick={handleLogout}
                    className="p-[12px] text-[#1F2937] dark:text-[#ffffff] flex rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-colors duration-300 border border-[#525252]"
                    transition={hoverTransition}
                >
                    <span className="text-xl"><TbLogout className='' size={22} /></span>
                    <AnimatePresence>
                        {!sidebarCollapsed && (
                            <motion.span
                                className="ml-2 text-sm whitespace-nowrap"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={itemVariants}
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.aside>
    );
};

export default AdminSidebar;