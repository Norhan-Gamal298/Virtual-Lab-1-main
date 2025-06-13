import React, { useEffect, useState } from 'react';
import logoDarkImg from "../assets/logo-background.png";
import logoLightImg from "../assets/logo-background-light-new.png";

import { useTheme } from "../ThemeProvider";


const PageIntro = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className='mt-[16rem] mb-[40rem] relative transition-colors duration-200 text-[44px] poppins-regular'>
            <h2 className='relative z-3 text-[#1F2937] dark:text-[#F3F4F6] transition-colors duration-200 font-medium mb-[1rem]'>
                Struggling to learn Image Processing?<br />
                Virtual Lab makes it easy
            </h2>
            <p className='relative z-3 text-[18px]'>
                If you're interested in Image Processing but don't know where to begin, Virtual Lab is here for you!<br /><br />
                We offer simplified explanations, practical examples, and an interactive virtual lab where you can experiment and see real results.<br />Learn step-by-step — the fun, easy way.
            </p>

            {/* Image container with both dark and light images stacked */}
            <div className="image-wrapper">
                <img
                    className={`logoImgIntro absolute top-[-10rem] left-0 shadow-[inset_0px_4px_250px_100px_#0f0f0f,inset_0px_-100px_150px_0px_#0f0f0f] right-0 mx-auto transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'
                        }`}
                    src={logoDarkImg}
                    alt="Dark Logo"
                />
                <img
                    className={`logoImgIntro absolute top-[-10rem] left-0 right-0 mx-auto transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'
                        }`}
                    src={logoLightImg}
                    alt="Light Logo"
                />
            </div>
        </div>
    );
};

export default PageIntro;
