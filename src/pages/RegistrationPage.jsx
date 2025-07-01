import React from 'react';
import { Link } from 'react-router-dom';
import MultiStepRegistration from '../components/MultiStepRegistration';
import logoDark from "../assets/Logo-Dark.png";

const RegistrationPage = () => {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <MultiStepRegistration />
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;