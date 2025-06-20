import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';

const AuthModalManager = ({ activeModal, setActiveModal }) => {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            {activeModal === 'signup' && (
                <SignUpModal
                    onClose={() => setActiveModal(null)}
                    switchToSignIn={() => setActiveModal('signin')}
                />
            )}

            {activeModal === 'signin' && (
                <SignInModal
                    onClose={() => setActiveModal(null)}
                    switchToSignUp={() => setActiveModal('signup')}
                />
            )}
        </>
    );
};

export default AuthModalManager;