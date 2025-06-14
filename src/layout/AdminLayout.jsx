import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-auto p-8 bg-brand-background dark:bg-dark-brand-background text-neutral-text-primary transition-colors duration-300 dark:bg-dark-neutral-surface dark:text-dark-text-primary duration-300 transition-all"
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AdminLayout;