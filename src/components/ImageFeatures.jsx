import React from 'react';
import heroDarkBackground from "../assets/wave-background-dark.png";
import levelsDarkImg from "../assets/levels-dark.png";
import levelsLightImg from "../assets/levels-light.png";
import quizDarkImg from "../assets/quizzes-dark.png";
import quizLightImg from "../assets/quizzes-light.png";
import terminalDarkImg from "../assets/terminal-dark.png";
import terminalLightImg from "../assets/terminal-light.png";
import videoLightImg from "../assets/video-light.png";
import videoDarkImg from "../assets/video-dark.png";
import { useTheme } from "../ThemeProvider";

const ImageFeatures = () => {

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    return (
        <div className='imageFeatures poppins-regular relative mb-[5rem] md:mb-[10rem] pt-[20px] md:pt-[40px] text-[#F3F4F6]'>
            {/* Gradient backgrounds */}
            <div className='gradient-bg-light !h-[150px] md:!h-[395px]'></div>
            <div className='gradient-bg-dark !h-[150px] md:!h-[395px]'></div>

            <div className="flex flex-col h-full w-full items-center justify-center mt-[30px] md:mt-[55px] z-1 relative px-4">
                <h2 className='text-[#F3F4F6] poppins-medium text-[32px] md:text-[44px] mb-[1rem] text-center'>
                    Why Use Virtual Lab
                </h2>

                <div className="grid h-full w-full max-w-[1080px] gap-4 p-2 grid-cols-1 md:grid-cols-6 md:grid-rows-10 rounded-lg">
                    {/* Feature 1 */}
                    <div className="col-span-1 md:col-span-4 md:row-span-5 border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[24px] md:rounded-[40px] flex flex-col overflow-hidden px-4 md:px-8 pt-2 md:pt-4 transition-all duration-300">
                        <div className='flex flex-col text-left mt-[1rem] md:mt-[2rem]'>
                            <h3 className='text-[20px] md:text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6]'>
                                Beginner to Advanced friendly
                            </h3>
                            <span className='text-sm md:text-base text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>
                                Whether you're just starting or have experience, there's something for you
                            </span>
                        </div>
                        <img
                            className='w-[290px] h-[150px] md:w-[420px] md:h-[240px] translate-y-[15px] md:translate-y-[105px] self-end transition-all duration-300'
                            src={isDark ? levelsDarkImg : levelsLightImg}
                            alt="Skill levels"
                        />
                    </div>

                    {/* Feature 2 */}
                    <div className="col-span-1 md:col-span-2 md:row-span-5 border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[24px] md:rounded-[40px] shadow-md overflow-hidden px-4 md:px-8 pt-2 md:pt-4 text-left transition-all duration-300">
                        <h3 className='text-[20px] md:text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[1rem] md:mt-[2rem]'>
                            Practice Quizzes
                        </h3>
                        <div className='flex flex-col-reverse md:flex-row'>
                            <span className='text-sm md:text-base text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] md:min-w-[260px]'>
                                Short quizzes after each chapter help you test your understanding and track your progress
                            </span>
                            <img
                                className='w-[200px] h-[120px] md:w-auto md:h-auto self-center md:relative md:translate-x-[-200px] md:top-[8rem] mt-4 md:mt-0'
                                src={isDark ? quizDarkImg : quizLightImg}
                                alt="Quizzes"
                            />
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="col-span-1 md:col-span-3 md:row-span-5 border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[24px] md:rounded-[40px] shadow-md flex flex-col overflow-hidden text-left px-4 md:px-8 pt-2 md:pt-4 transition-all duration-300">
                        <div className='flex flex-col'>
                            <h3 className='text-[20px] md:text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[1rem] md:mt-[2rem] text-left'>
                                Live Virtual Lab
                            </h3>
                            <span className='text-sm md:text-base text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left'>
                                Apply what you learn instantly, see the results in real-time
                            </span>
                        </div>
                        <img
                            className='w-[240px] h-[150px] md:w-[380px] md:h-[240px] self-center translate-y-[15px] md:translate-y-[25px] mt-4 md:mt-0'
                            src={isDark ? terminalDarkImg : terminalLightImg}
                            alt="Terminal"
                        />
                    </div>

                    {/* Feature 4 */}
                    <div className="col-span-1 md:col-span-3 md:row-span-5 border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[24px] md:rounded-[40px] shadow-md flex items-start md:items-center rounded-[40px] overflow-hidden px-4 md:px-8 pt-2 md:pt-4 text-left transition-all duration-300">
                        <div className='flex flex-col text-left w-full'>
                            <h3 className='text-[20px] md:text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[1rem]'>
                                Explanation Videos
                            </h3>
                            <div className='flex flex-col md:flex-row'>
                                <span className='text-sm md:text-base text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left md:min-w-[260px]'>
                                    Every concept is explained through clear, step-by-step video tutorials
                                </span>
                                <img
                                    className='w-[250px] h-[120px] md:h-[290px] self-center md:self-end md:translate-y-[85px] mt-4 md:mt-0'
                                    src={isDark ? videoDarkImg : videoLightImg}
                                    alt="Videos"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageFeatures;