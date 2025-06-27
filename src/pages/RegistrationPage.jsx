import React from 'react';
import { Link } from 'react-router-dom';
import MultiStepRegistration from '../components/MultiStepRegistration';
import logoDark from "../assets/Logo-Dark.png";

const RegistrationPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-center mb-8">
                    <Link to="/" className="inline-block">
                        <img src={logoDark} alt="Logo" className="h-12 dark:hidden" />
                        <img src={logoDark} alt="Logo" className="h-12 hidden dark:block" />
                    </Link>
                </div>
                <div className="max-w-4xl mx-auto">
                    <MultiStepRegistration />
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;