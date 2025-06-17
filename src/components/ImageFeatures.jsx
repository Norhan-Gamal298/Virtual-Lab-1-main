import React from 'react'
import heroDarkBackground from "../assets/wave-background-dark.png";
import levelsDarkImg from "../assets/levels-dark.png"
import quizDarkImg from "../assets/quizzes-dark.png"
import terminalDarkImg from "../assets/terminal-dark.png"
import videoDarkImg from "../assets/video-dark.png"

const ImageFeatures = () => {
    return (
        <div className='imageFeatures poppins-regular relative mb-[10rem] pt-[40px] text-[#F3F4F6]'>
            {/* Two gradient backgrounds that will transition via opacity */}
            <div className='gradient-bg-light'></div>
            <div className='gradient-bg-dark'></div>

            <div className="flex flex-col h-full w-full items-center justify-center mt-[55px] z-1 relative">
                <h2 className='text-[#F3F4F6] poppins-medium text-[32px] sm:text-[38px] lg:text-[44px] mb-[1rem] text-center px-4'>Why Use Virtual Lab</h2>

                {/* Mobile Layout - Stack vertically */}
                <div className="block lg:hidden w-full max-w-sm mx-auto space-y-6 px-4">
                    {/* Feature 1 - Beginner to Advanced */}
                    <div className="border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[40px] flex flex-col overflow-hidden px-6 pt-4 transition-all duration-300">
                        <div className='flex flex-col text-left mt-[2rem]'>
                            <h3 className='text-[24px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6]'>Beginner to Advanced friendly</h3>
                            <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>Whether you're just starting or have experience, there's something for you</span>
                        </div>
                        <img className='w-full max-w-[300px] h-auto translate-y-[25px] self-end' src={levelsDarkImg} alt="" />
                    </div>

                    {/* Feature 2 - Practice Quizzes */}
                    <div className="border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[40px] shadow-md overflow-hidden px-6 pt-4 text-left transition-all duration-300">
                        <h3 className='text-[24px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem]'>Practice Quizzes</h3>
                        <div className='flex flex-col'>
                            <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>Short quizzes after each chapter help you test your understanding and track your progress along the way</span>
                            <img className='w-full max-w-[200px] h-auto mt-8 self-center' src={quizDarkImg} alt="" />
                        </div>
                    </div>

                    {/* Feature 3 - Live Virtual Lab */}
                    <div className="border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[40px] shadow-md flex flex-col overflow-hidden text-left px-6 pt-4 transition-all duration-300">
                        <h3 className='text-[24px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem] text-left'>Live Virtual Lab</h3>
                        <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left'>Apply what you learn instantly, see the results in real-time</span>
                        <img className='w-full max-w-[300px] h-auto self-center translate-y-[25px]' src={terminalDarkImg} alt="" />
                    </div>

                    {/* Feature 4 - Explanation Videos */}
                    <div className="border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[40px] shadow-md flex flex-col overflow-hidden px-6 pt-4 text-left transition-all duration-300">
                        <div className='flex flex-col text-left'>
                            <h3 className='text-[24px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem]'>Explanation Videos</h3>
                            <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left'>Every concept is explained through clear, step-by-step video tutorials — making it easier to understand and follow</span>
                            <img className='w-full max-w-[250px] h-auto translate-y-[25px] self-center' src={videoDarkImg} alt="" />
                        </div>
                    </div>
                </div>

                {/* Tablet Layout */}
                <div className="hidden lg:hidden md:block w-full max-w-2xl mx-auto px-4">
                    <div className="grid gap-4 grid-cols-2 grid-rows-4">
                        {/* Feature 1 - Spans 2 columns */}
                        <div className="col-span-2 border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[40px] flex flex-col overflow-hidden px-6 pt-4 transition-all duration-300">
                            <div className='flex flex-col text-left mt-[2rem]'>
                                <h3 className='text-[26px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6]'>Beginner to Advanced friendly</h3>
                                <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>Whether you're just starting or have experience, there's something for you</span>
                            </div>
                            <img className='w-[320px] h-[200px] translate-y-[25px] self-end' src={levelsDarkImg} alt="" />
                        </div>

                        {/* Feature 2 */}
                        <div className="border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[40px] shadow-md overflow-hidden px-6 pt-4 text-left transition-all duration-300">
                            <h3 className='text-[26px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem]'>Practice Quizzes</h3>
                            <div className='flex flex-col'>
                                <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>Short quizzes after each chapter help you test your understanding</span>
                                <img className='w-[180px] h-auto mt-4 self-center' src={quizDarkImg} alt="" />
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[40px] shadow-md flex flex-col overflow-hidden text-left px-6 pt-4 transition-all duration-300">
                            <h3 className='text-[26px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem] text-left'>Live Virtual Lab</h3>
                            <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left'>Apply what you learn instantly, see results in real-time</span>
                            <img className='w-[280px] h-[180px] self-center translate-y-[25px]' src={terminalDarkImg} alt="" />
                        </div>

                        {/* Feature 4 - Spans 2 columns */}
                        <div className="col-span-2 border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[40px] shadow-md flex items-center overflow-hidden px-6 pt-4 text-left transition-all duration-300">
                            <div className='flex flex-col text-left'>
                                <h3 className='text-[26px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem]'>Explanation Videos</h3>
                                <div className='flex'>
                                    <span className='min-w-[300px] text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left'>Every concept is explained through clear, step-by-step video tutorials — making it easier to understand and follow</span>
                                    <img className='h-[250px] translate-y-[45px] self-end' src={videoDarkImg} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - Original Grid */}
                <div className="hidden lg:grid h-full w-full max-w-[1080px] xl:w-[1080px] gap-4 p-2 grid-cols-6 grid-rows-10 rounded-lg">
                    <div className="col-span-4 row-span-5 border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[40px] flex flex-col overflow-hidden px-8 pt-4 transition-all duration-300">
                        <div className='flex flex-col text-left mt-[2rem]'>
                            <h3 className='text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6]'>Beginner to Advanced friendly</h3>
                            <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>Whether you're just starting or have experience, there's <br /> something for you</span>
                        </div>
                        <img className='w-[380px] h-[240px] translate-y-[25px] self-end' src={levelsDarkImg} alt="" />
                    </div>

                    <div className="col-span-2 row-span-5 border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[40px] shadow-md overflow-hidden px-8 pt-4 text-left transition-all duration-300">
                        <h3 className='text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem]'>Practice Quizzes</h3>
                        <div className='flex'>
                            <span className='min-w-[260px] text-[#4B5563] dark:text-[#D1D5DB] mt-[5px]'>Short quizzes after each chapter help you test your understanding and track
                                your progress along
                                the way</span>
                            <img className='relative translate-x-[-200px] top-[8rem] self-end ' src={quizDarkImg} alt="" />
                        </div>
                    </div>

                    <div className="col-span-3 row-span-5 border-2 border-[#E5E7EB] dark:border-[#323232] backdrop-blur-[56px] rounded-[40px] shadow-md flex flex-col overflow-hidden text-left px-8 pt-4 transition-all duration-300">
                        <h3 className='text-[28px] poppins-bold text-[#1F2937] dark:text-[#F3F4F6] mt-[2rem] text-left'>Live Virtual Lab</h3>
                        <span className='text-[#4B5563] dark:text-[#D1D5DB] mt-[5px] text-left'>Apply what you learn instantly, see the results in real-time</span>
                        <img className='w-[380px] h-[240px] self-center translate-y-[25px]' src={terminalDarkImg} alt="" />
                    </div>

                    <div className="col-span-3 row-span-5 border-2 border-[#E5E7EB] backdrop-blur-[56px] dark:border-[#323232] rounded-[40px] shadow-md flex items-center rounded-[40px] overflow-hidden px-8 pt-4 text-left transition-all duration-300">
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