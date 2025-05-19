import { useState } from 'react';
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbDashboard, TbUsers, TbBook, TbNews, TbSettings, TbUser } from "react-icons/tb";
import { motion } from "framer-motion";
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminSidebar = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    const menuItems = [
        {
            label: 'Dashboard',
            icon: <TbDashboard size={28} />,
            path: '/admin',
            exact: true
        },
        {
            label: 'Users Management',
            icon: <TbUsers size={28} />,
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
            ]
        },
        {
            label: 'Course Management',
            icon: <TbBook size={28} />,
            path: '/admin/courses'
        },
        {
            label: 'Blogs Management',
            icon: <TbNews size={28} />,
            path: '/admin/blogs'
        },
        {
            label: 'Settings',
            icon: <TbSettings size={28} />,
            path: '/admin/settings'
        },
        {
            label: 'Profile',
            icon: <TbUser size={28} />,
            path: '/admin/profile'
        }
    ];

    const isActive = (path, exact) => {
        return exact ? location.pathname === path : location.pathname.startsWith(path);
    };

    return (
        <motion.aside
            animate={{ width: sidebarCollapsed ? 80 : 240 }}
            className="h-full bg-[#1a1a1a] text-white sticky top-0 z-40 overflow-hidden shadow-lg"
        >
            <div className="h-full flex flex-col">
                <div className="p-2 border-b border-gray-800">
                    <button
                        onClick={() => setSidebarCollapsed(prev => !prev)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colorsflex "
                    >
                        {sidebarCollapsed ? (
                            <TbLayoutSidebarRightCollapse size={28} />
                        ) : (
                            <TbLayoutSidebarLeftCollapse size={28} />
                        )}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.label}>
                                {item.subItems ? (
                                    <div className={`rounded-lg ${isActive(item.path) ? 'bg-gray-800' : ''}`}>
                                        <div className={`flex items-center p-2 ${!sidebarCollapsed ? 'justify-between' : 'justify-center'}`}>
                                            <div className="flex items-center">
                                                <span className="text-xl">{item.icon}</span>
                                                {!sidebarCollapsed && (
                                                    <span className="ml-2 text-sm">{item.label}</span>
                                                )}
                                            </div>
                                        </div>

                                        {!sidebarCollapsed && (
                                            <ul className="ml-6 space-y-1">
                                                {item.subItems.map((subItem) => {
                                                    if (subItem.allowedRoles && !subItem.allowedRoles.includes(user?.role)) return null;
                                                    return (
                                                        <li key={subItem.label}>
                                                            <NavLink
                                                                to={subItem.path}
                                                                className={({ isActive }) =>
                                                                    `flex items-center p-2 text-sm rounded-lg hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-800' : ''
                                                                    }`
                                                                }
                                                            >
                                                                {subItem.label}
                                                            </NavLink>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <NavLink
                                        to={item.path}
                                        end={item.exact}
                                        className={({ isActive }) =>
                                            `flex items-center p-2 rounded-lg hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-800' : ''
                                            } ${sidebarCollapsed ? 'justify-center' : ''}`
                                        }
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        {!sidebarCollapsed && (
                                            <span className="ml-2 text-sm">{item.label}</span>
                                        )}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </motion.aside>
    );
};

export default AdminSidebar;