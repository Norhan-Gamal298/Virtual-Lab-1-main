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
            icon: <TbUsers size={28} />,
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
            icon: <TbBook size={28} />,
            path: '/admin/content'
        },
        {
            label: 'Blogs Management',
            icon: <TbNews size={28} />,
            path: '/admin/blogs'
        },
        {
            label: 'Quizzes Management',
            icon: <TbSettings size={28} />, // You can replace this with a quiz-related icon if you like
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
            className="h-full bg-[#1a1a1a] text-white sticky top-0 z-40 overflow-hidden shadow-lg flex flex-col"
        >
            <div className="flex-1 flex flex-col">
                <div className="p-2 border-b border-gray-800">
                    <motion.button
                        onClick={() => setSidebarCollapsed(prev => !prev)}
                        className="p-2 bg-[#202323] hover:bg-[#202323] rounded-lg w-full flex justify-center"
                        whileHover={{ backgroundColor: "#202323" }}
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
                                        className={`rounded-lg w-full mr-auto flex flex-col whitespace-nowrap ${isActive(item.path) ? 'bg-[#202323]' : ''}`}
                                    >
                                        <motion.button
                                            onClick={() => !sidebarCollapsed && toggleItemExpansion(item.label)}
                                            className={`flex items-center p-2 w-full rounded-lg justify-between   ${sidebarCollapsed ? 'justify-between' : 'justify-between'}`}
                                            whileHover={{ backgroundColor: "#202323" }}
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
                                                    transition={{ duration: 0.2, }}
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
                                                    className="ml-6 overflow-hidden"
                                                >
                                                    {item.subItems.map((subItem) => {
                                                        if (subItem.allowedRoles && !subItem.allowedRoles.includes(user?.role)) return null;
                                                        return (
                                                            <li key={subItem.label}>
                                                                <motion.div
                                                                    whileHover={{ backgroundColor: "#202323" }}
                                                                    transition={hoverTransition}
                                                                    className="rounded-lg w-full"
                                                                >
                                                                    <NavLink
                                                                        to={subItem.path}
                                                                        className={({ isActive }) =>
                                                                            `flex items-center p-2 text-sm rounded-lg w-full whitespace-nowrap ${isActive ? 'bg-[#202323]' : ''}`
                                                                        }
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
                                        whileHover={{ backgroundColor: "#202323" }}
                                        transition={hoverTransition}
                                        className="rounded-lg w-full mr-auto flex"
                                    >
                                        <NavLink
                                            to={item.path}
                                            end={item.exact}
                                            className={({ isActive }) =>
                                                `flex items-center p-2 rounded-lg w-full justify-start whitespace-nowrap ${isActive ? 'bg-[#202323]' : ''} ${sidebarCollapsed ? 'justify-center' : ''}`
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
                    className={`p-[12px] rounded-lg bg-[#1f1f1f] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-colors duration-300 border border-neutral-border mb-[10px] flex ${sidebarCollapsed ? '' : ''}`}
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
                    className={`p-[12px] flex rounded-lg bg-[#F5F7FA] dark:bg-[#1f1f1f] dark:border-[#3b3b3b] transition-colors duration-300 border border-neutral-border ${sidebarCollapsed ? '' : ''}`}
                    transition={hoverTransition}
                >
                    <span className="text-xl"><TbLogout className='text-[#000] dark:text-[#fff]' size={22} /></span>
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