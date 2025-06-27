import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import logoDark from "../assets/Logo-Dark.png";

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <Link to="/" className="inline-block mb-8">
                    {/* Your logo here */}
                    <img
                        src={logoDark}
                        alt="Logo"
                        className="h-12"
                    />
                </Link>

                <div className="max-w-md mx-auto">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;