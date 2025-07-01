import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import logoDark from "../assets/Logo-Dark.png";

const LoginPage = () => {
    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;