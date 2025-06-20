import React, { useState, useEffect, useRef } from 'react';
import logoDarkImg from "../assets/logo-background.png";
import logoLightImg from "../assets/logo-background-light-new.png";
import { useTheme } from "../ThemeProvider";

const PageIntro = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            {
                threshold: 0.2, // Trigger when 20% of the component is visible
                rootMargin: '0px 0px -100px 0px' // Start animation slightly before it comes into view
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={sectionRef}
            className='mt-[8rem] md:mt-[12rem] lg:mt-[16rem] mb-[20rem] md:mb-[30rem] lg:mb-[40rem] relative transition-colors duration-200 text-[28px] sm:text-[36px] md:text-[40px] lg:text-[44px] poppins-regular px-4 sm:px-6 lg:px-8'
        >
            {/* Main heading with reveal animation */}
            <div className="overflow-hidden">
                <h2
                    className={`relative z-10 text-gray-800 dark:text-gray-100 transition-all duration-1000 ease-out font-medium mb-[0.5rem] md:mb-[1rem] leading-tight transform ${isVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-full opacity-0'
                        }`}
                >
                    Struggling to learn Image Processing?<br />
                    Virtual Lab makes it easy
                </h2>
            </div>

            {/* Paragraph with delayed reveal animation */}
            <div className="overflow-hidden">
                <p
                    className={`relative z-10 text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] text-gray-600 dark:text-gray-300 mt-4 md:mt-6 leading-relaxed transition-all duration-1000 ease-out delay-300 transform ${isVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-full opacity-0'
                        }`}
                >
                    If you're interested in Image Processing but don't know where to begin, Virtual Lab is here for you!<br /><br />
                    We offer simplified explanations, practical examples, and an interactive virtual lab where you can experiment and see real results.<br />Learn step-by-step — the fun, easy way.
                </p>
            </div>

            {/* Image container with fade-in and scale animation */}
            <div
                className={`image-wrapper mt-12 md:mt-16 lg:mt-20 transition-all duration-1200 ease-out delay-600 transform ${isVisible
                        ? 'translate-y-0 opacity-100 scale-100'
                        : 'translate-y-8 opacity-0 scale-95'
                    }`}
            >
                <img
                    className={`logoImgIntro absolute top-[-5rem] sm:top-[-7rem] md:top-[-8rem] lg:top-[-10rem] left-0 right-0 mx-auto transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`}
                    src={logoDarkImg}
                    alt="Dark Logo"
                />
                <img
                    className={`logoImgIntro absolute top-[-5rem] sm:top-[-7rem] md:top-[-8rem] lg:top-[-10rem] left-0 right-0 mx-auto transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'}`}
                    src={logoLightImg}
                    alt="Light Logo"
                />
            </div>

            {/* Optional: Add some floating animation to the logo */}
            <style jsx>{`
                .logoImgIntro {
                    animation: ${isVisible ? 'floatGentle 6s ease-in-out infinite' : 'none'};
                }

                @keyframes floatGentle {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default PageIntro;