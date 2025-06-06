import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-dark-900">
            <AdminSidebar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-auto p-8 bg-dark-900 text-gray-100"
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AdminLayout;