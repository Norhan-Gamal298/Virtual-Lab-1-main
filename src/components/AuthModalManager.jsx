import React from 'react';
import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';

const AuthModalManager = ({ activeModal, setActiveModal }) => {
    return (
        <>
            {activeModal === 'signup' && (
                <SignUpModal
                    onClose={() => setActiveModal(null)}
                    switchToSignIn={() => setActiveModal('signin')} // ✅ Now defined
                />
            )}

            {activeModal === 'signin' && (
                <SignInModal
                    onClose={() => setActiveModal(null)}
                    switchToSignUp={() => setActiveModal('signup')} // ✅ Added for Sign In modal
                />
            )}
        </>
    );
};

export default AuthModalManager;
