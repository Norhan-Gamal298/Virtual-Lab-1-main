import React from 'react'
import { Link } from 'react-router-dom'

const PageOutro = () => {
    return (
        <div className='flex flex-col items-center pt-20 pb-[25rem] relative transition-all duration-300'>
            <h2 className='poppins-medium text-[44px] mb-[20px] text-[#1F2937] dark:text-[#F3F4F6] z-1'>Ready to start your Image Processing journey?</h2>
            <span className='text-[18px] text-[#4B5563] dark:text-[#D1D5DB] poppins-regular z-1'>Make learning simple, and practical — with Virtual Lab.</span>
            <Link to="/docs/chapter_1_1_what_is_image_processing" className='bg-[#1F2937] dark:bg-[#F9FAFB] text-[#ffffff] dark:text-[#121212] w-[150px] h-[50px] mt-[2rem] content-center poppins-semibold rounded-[11px] cursor-pointer z-1'>Get Started</Link>
            <div className='gradient-bg-light rotate-180 bottom-0'></div>
            <div className='gradient-bg-dark rotate-180  bottom-0'></div>
        </div>
    )
}

export default PageOutro
