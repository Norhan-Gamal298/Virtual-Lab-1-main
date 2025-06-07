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
                className="flex-1 overflow-auto p-8 bg-neutral-surface text-neutral-text-primary flex h-full dark:bg-dark-neutral-surface dark:text-dark-neutral-text-primary"
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AdminLayout;