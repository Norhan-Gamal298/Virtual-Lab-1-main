import { useState, useEffect } from 'react';
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbDashboard, TbUsers, TbBook, TbNews, TbSettings, TbUser, TbLogout } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../ThemeProvider";
import { PiExamFill } from "react-icons/pi";
import { HiOutlineUserGroup, HiOutlineShieldCheck } from "react-icons/hi";

const AdminSidebar = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : true;
    });

    const [expandedItems, setExpandedItems] = useState({});
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const menuItems = [
        {
            label: 'Dashboard',
            icon: <TbDashboard size={22} />,
            path: '/admin',
            exact: true
        },
        {
            label: 'Users Management',
            icon: <TbUsers size={22} />,
            path: '/admin/users',
            hasSubItems: true,
            subItems: [
                {
                    label: 'Students',
                    path: '/admin/users',
                    icon: <HiOutlineUserGroup size={18} />,
                    description: 'Manage student accounts'
                },
                {
                    label: 'Administrators',
                    path: '/admin/users/admins',
                    icon: <HiOutlineShieldCheck size={18} />,
                    description: 'Manage admin users',
                    allowedRoles: ['root']
                }
            ],
        },
        {
            label: 'Course Management',
            icon: <TbBook size={22} />,
            path: '/admin/content'
        },
        {
            label: 'Blogs Management',
            icon: <TbNews size={22} />,
            path: '/admin/blogs'
        },
        {
            label: 'Quizzes Management',
            icon: <PiExamFill size={22} />,
            path: '/admin/quizzes'
        },
    ];

    const isActive = (path, exact) => {
        return exact ? location.pathname === path : location.pathname.startsWith(path);
    };

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

    const sidebarVariants = {
        expanded: { width: 300 },
        collapsed: { width: 80 }
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
        hidden: {
            opacity: 0,
            maxHeight: 0,
            y: -10
        },
        visible: {
            opacity: 1,
            maxHeight: 300,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            maxHeight: 0,
            y: -10,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const subItemChildVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    const hoverTransition = {
        type: "tween",
        duration: 0.2
    };

    // Fixed button classes with proper hover, focus, and active states
    const buttonBaseClasses = "w-full h-12 flex items-center rounded-lg text-[#1F2937] dark:text-[#ffffff] bg-[#F5F7FA] dark:bg-[#1f1f1f] border border-[#E5E7EB] dark:border-[#3b3b3b] hover:bg-[#E0E7FF] hover:dark:bg-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 focus:bg-[#E0E7FF] focus:dark:bg-[#2d2d2d] active:bg-[#C7D2FE] active:dark:bg-[#3d3d3d] transition-all duration-200";

    // Fixed nav item classes with proper states
    const getNavItemClasses = (isActiveItem) => {
        return `w-full h-12 flex items-center rounded-lg text-[#1F2937] dark:text-[#ffffff] border transition-all duration-200 ${isActiveItem
            ? 'bg-indigo-50 dark:bg-[#2d2d2d] border-indigo-500 dark:border-indigo-500'
            : 'bg-[#F5F7FA] dark:bg-[#1f1f1f] border-[#E5E7EB] dark:border-[#3b3b3b] hover:bg-[#E0E7FF] hover:dark:bg-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 focus:bg-[#E0E7FF] focus:dark:bg-[#2d2d2d] active:bg-[#C7D2FE] active:dark:bg-[#3d3d3d]'
            }`;
    };

    return (
        <div className="relative">
            <motion.aside
                layout
                initial={sidebarCollapsed ? "collapsed" : "expanded"}
                animate={sidebarCollapsed ? "collapsed" : "expanded"}
                variants={sidebarVariants}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full bg-[#ffffff] dark:bg-[#1a1a1a] text-[#1F2937] sticky top-0 z-40 overflow-hidden shadow-lg flex flex-col transition-colors duration-300"
            >
                <div className="flex-1 flex flex-col">
                    {/* Header with toggle button */}
                    <div className="p-3 border-b dark:border-[#2d2d2d] border-[#E5E7EB]">
                        <motion.button
                            onClick={() => setSidebarCollapsed(prev => !prev)}
                            className={`${buttonBaseClasses} px-3`}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                                <span className="flex-shrink-0">
                                    {sidebarCollapsed ? (
                                        <TbLayoutSidebarRightCollapse size={22} className="text-indigo-600 dark:text-indigo-400" />
                                    ) : (
                                        <TbLayoutSidebarLeftCollapse size={22} className="text-indigo-600 dark:text-indigo-400" />
                                    )}
                                </span>
                                {!sidebarCollapsed && (
                                    <motion.span
                                        className="ml-3 text-sm font-medium whitespace-nowrap flex-1 text-left"
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={itemVariants}
                                    >
                                        Collapse
                                    </motion.span>
                                )}
                            </div>
                        </motion.button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
                        <ul className="space-y-2 mt-[5px]">
                            {menuItems.map((item) => (
                                <li key={item.label}>
                                    {item.hasSubItems ? (
                                        <motion.div
                                            className={`rounded-lg transition-all duration-300 ${isParentActive(item)
                                                ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-[#2d3748] dark:to-[#3b4455] dark:border-indigo-500 shadow-sm'
                                                : 'border-[#E5E7EB] bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] hover:bg-indigo-50 hover:dark:bg-[#2d2d2d] hover:shadow-sm'
                                                } border`}
                                        >
                                            <motion.button
                                                onClick={() => !sidebarCollapsed && toggleItemExpansion(item.label)}
                                                className="w-full h-12 flex items-center px-3 bg-transparent border-none rounded-lg hover:bg-[#E0E7FF] hover:dark:bg-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 focus:bg-[#E0E7FF] focus:dark:bg-[#2d2d2d] active:bg-[#C7D2FE] active:dark:bg-[#3d3d3d] transition-all duration-200"
                                                whileHover={{ scale: sidebarCollapsed ? 1.05 : 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                                                    <span className="text-xl flex-shrink-0 text-indigo-600 dark:text-indigo-400">{item.icon}</span>
                                                    {!sidebarCollapsed && (
                                                        <>
                                                            <motion.span
                                                                className="ml-3 text-sm font-medium whitespace-nowrap flex-1 text-left dark:text-white"
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="exit"
                                                                variants={itemVariants}
                                                            >
                                                                {item.label}
                                                            </motion.span>
                                                            {item.hasSubItems && (
                                                                <motion.span
                                                                    animate={{
                                                                        rotate: expandedItems[item.label] ? 90 : 0
                                                                    }}
                                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                    className="flex-shrink-0 text-gray-500 dark:text-white"
                                                                >
                                                                    <FiChevronRight size={16} />
                                                                </motion.span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </motion.button>

                                            <AnimatePresence>
                                                {(!sidebarCollapsed && expandedItems[item.label]) && (
                                                    <motion.div
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        variants={subItemVariants}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-3 pb-3">
                                                            <div className="border-l-2 border-indigo-200 dark:border-indigo-800 pl-4">
                                                                <motion.ul
                                                                    className="space-y-2"
                                                                    variants={subItemVariants}
                                                                >
                                                                    {item.subItems.map((subItem) => {
                                                                        if (subItem.allowedRoles && !subItem.allowedRoles.includes(user?.role)) return null;
                                                                        const isCurrentSubActive = location.pathname === subItem.path;
                                                                        return (
                                                                            <motion.li
                                                                                key={subItem.label}
                                                                                variants={subItemChildVariants}
                                                                            >
                                                                                <NavLink
                                                                                    to={subItem.path}
                                                                                    className={`group flex items-center p-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${isCurrentSubActive
                                                                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md transform scale-[1.02]'
                                                                                        : 'bg-[#f8fafc] dark:bg-[#393939] text-[#374151] dark:text-[#e2e8f0] hover:bg-indigo-50 dark:hover:bg-[#3b4455] hover:shadow-sm hover:transform hover:scale-[1.01] active:bg-indigo-100 dark:active:bg-[#4a5568]'
                                                                                        }`}
                                                                                >
                                                                                    <div className="flex items-center space-x-3 w-full">
                                                                                        <span className={`flex-shrink-0 ${isCurrentSubActive ? 'text-white' : 'text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'}`}>
                                                                                            {subItem.icon}
                                                                                        </span>
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <motion.span
                                                                                                variants={itemVariants}
                                                                                                className="text-sm font-medium block truncate"
                                                                                            >
                                                                                                {subItem.label}
                                                                                            </motion.span>
                                                                                            {subItem.description && (
                                                                                                <motion.span
                                                                                                    variants={itemVariants}
                                                                                                    className={`text-xs block truncate mt-0.5 ${isCurrentSubActive
                                                                                                        ? 'text-indigo-100'
                                                                                                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                                                                        }`}
                                                                                                >
                                                                                                    {subItem.description}
                                                                                                </motion.span>
                                                                                            )}
                                                                                        </div>
                                                                                        {isCurrentSubActive && (
                                                                                            <motion.div
                                                                                                initial={{ scale: 0 }}
                                                                                                animate={{ scale: 1 }}
                                                                                                className="w-2 h-2 bg-white rounded-full"
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                </NavLink>
                                                                            </motion.li>
                                                                        );
                                                                    })}
                                                                </motion.ul>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ) : (
                                        <NavLink
                                            to={item.path}
                                            end={item.exact}
                                            className={({ isActive: isActiveLink }) =>
                                                `${getNavItemClasses(isActiveLink)} px-3`
                                            }
                                        >
                                            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} w-full`}>
                                                <span className={`text-xl flex-shrink-0 ${isActive(item.path, item.exact) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-white'}`}>
                                                    {item.icon}
                                                </span>
                                                {!sidebarCollapsed && (
                                                    <motion.span
                                                        className="ml-3 text-sm font-medium whitespace-nowrap flex-1 text-left dark:text-white"
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        variants={itemVariants}
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </div>
                                        </NavLink>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Footer with theme toggle and logout */}
                <div className="p-3 border-t dark:border-[#2d2d2d] border-[#E5E7EB] space-y-2">
                    <motion.button
                        className={`${buttonBaseClasses} px-3`}
                        onClick={toggleTheme}
                        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} w-full`}>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={theme}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    {isDark ? (
                                        <FiSun className="text-yellow-300" size={22} />
                                    ) : (
                                        <FiMoon className="text-indigo-600" size={22} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            {!sidebarCollapsed && (
                                <motion.span
                                    className="ml-3 text-sm font-medium whitespace-nowrap flex-1 text-left"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={itemVariants}
                                >
                                    Switch Theme
                                </motion.span>
                            )}
                        </div>
                    </motion.button>

                    <motion.button
                        onClick={handleLogout}
                        className={`${buttonBaseClasses} px-3`}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} w-full`}>
                            <span className="text-xl flex-shrink-0 ">
                                <TbLogout size={22} />
                            </span>
                            {!sidebarCollapsed && (
                                <motion.span
                                    className="ml-3 text-sm font-medium whitespace-nowrap flex-1 text-left"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={itemVariants}
                                >
                                    Logout
                                </motion.span>
                            )}
                        </div>
                    </motion.button>
                </div>
            </motion.aside>
        </div>
    );
};

export default AdminSidebar;