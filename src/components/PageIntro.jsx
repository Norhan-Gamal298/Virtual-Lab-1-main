import React from 'react';
import logoDarkImg from "../assets/logo-background.png";
import logoLightImg from "../assets/logo-background-light-new.png";
import { useTheme } from "../ThemeProvider";

const PageIntro = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className='mt-[8rem] md:mt-[12rem] lg:mt-[16rem] mb-[20rem] md:mb-[30rem] lg:mb-[40rem] relative transition-colors duration-200 text-[28px] sm:text-[36px] md:text-[40px] lg:text-[44px] poppins-regular px-4 sm:px-6 lg:px-8'>
            <h2 className='relative z-10 text-gray-800 dark:text-gray-100 transition-colors duration-200 font-medium mb-[0.5rem] md:mb-[1rem] leading-tight'>
                Struggling to learn Image Processing?<br />
                Virtual Lab makes it easy
            </h2>
            <p className='relative z-10 text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] text-gray-600 dark:text-gray-300 mt-4 md:mt-6 leading-relaxed'>
                If you're interested in Image Processing but don't know where to begin, Virtual Lab is here for you!<br /><br />
                We offer simplified explanations, practical examples, and an interactive virtual lab where you can experiment and see real results.<br />Learn step-by-step — the fun, easy way.
            </p>

            {/* Image container with both dark and light images stacked */}
            <div className="image-wrapper mt-12 md:mt-16 lg:mt-20">
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
        </div>
    );
};

export default PageIntro;