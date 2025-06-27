import MultiStepRegistration from './MultiStepRegistration'; // Adjust the path as necessary

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { authAPI } from "../features/auth/authAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";


const SignUpModal = ({ onClose, switchToSignIn }) => {

    return (

        <MultiStepRegistration onClose={onClose} switchToSignIn={switchToSignIn} />
    );
};

export default SignUpModal;