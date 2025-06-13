import React from 'react'
import heroDarkBackground from "../assets/wave-background-dark.png";
import levelsDarkImg from "../assets/levels-dark.png"
import quizDarkImg from "../assets/quizzes-dark.png"
import terminalDarkImg from "../assets/terminal-dark.png"
import videoDarkImg from "../assets/video-dark.png"

const ImageFeatures = () => {
    return (
        <div className='imageFeatures poppins-regular relative mb-[10rem]'>
            {/* Two gradient backgrounds that will transition via opacity */}
            <div className='gradient-bg-light'></div>
            <div className='gradient-bg-dark'></div>

            <div className="flex flex-col h-full w-full items-center justify-center z-1 relative">
                <h2 className='text-[#F3F4F6] poppins-medium text-[44px] mb-[1rem] '>Why Use Virtual Lab</h2>
                <div className="grid h-full w-[1080px] gap-4 p-2 grid-cols-6 grid-rows-10 rounded-lg ">

                    <div
                        className="col-span-4 row-span-5 border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[40px] flex flex-col overflow-hidden px-8 pt-4 transition-all duration-300">
                        <div className='flex flex-col text-left mt-[2rem]'>
                            <h3 className='text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6]'>Beginner to Advanced friendly</h3>
                            <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>Whether you're just starting or have experience, there's <br /> something for you</span>
                        </div>
                        <img className='w-[380px] h-[240px] translate-y-[25px] self-end' src={levelsDarkImg} alt="" />
                    </div>

                    <div
                        className="col-span-2 row-span-5 border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[40px] shadow-md overflow-hidden px-8 pt-4 text-left transition-all duration-300"
                    >
                        <h3 className='text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem]'>Practice Quizzes</h3>
                        <div className='flex'>
                            <span className='min-w-[260px] text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>Short quizzes after each chapter help you test your understanding and track
                                your progress along
                                the way</span>
                            <img className='relative translate-x-[-200px] top-[8rem] self-end ' src={quizDarkImg} alt="" />
                        </div>
                    </div>

                    <div
                        className="col-span-3 row-span-5 border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[40px] shadow-md flex flex-col overflow-hidden text-left px-8 pt-4 transition-all duration-300"
                    >
                        <h3 className='text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem] text-left'>Live Virtual Lab</h3>
                        <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left'>Apply what you learn instantly, see the results in real-time</span>
                        <img className='w-[380px] h-[240px] self-center translate-y-[25px]' src={terminalDarkImg} alt="" />
                    </div>

                    <div
                        className="col-span-3 row-span-5 border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[40px] shadow-md flex items-center rounded-[40px] overflow-hidden px-8 pt-4 text-left transition-all duration-300"
                    >
                        <div className='flex flex-col text-left'>
                            <h3 className='text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem]'>Explanation Videos</h3>
                            <div className='flex'>
                                <span className='min-w-[260px] text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left'>Every concept is explained through clear, step-by-step video tutorials — making it easier to understand and follow</span>
                                <img className=' h-[290px] translate-y-[45px] self-end' src={videoDarkImg} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageFeatures