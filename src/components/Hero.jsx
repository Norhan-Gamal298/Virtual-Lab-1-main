import React from "react";
import { Link } from "react-router-dom";
import heroLightBackground from "../assets/wave-background-light.png";
import heroDarkBackground from "../assets/wave-background-dark.png";

const Hero = () => {
  return (
    <div className="h-full heroSection mb-[8rem] relative">
      {/* Both images with theme-dependent opacity */}
      <img
        className="absolute bottom-[-8rem] w-full opacity-100 dark:opacity-0 transition-opacity duration-500"
        src={heroLightBackground}
        alt="Light theme background"
      />
      <img
        className="absolute bottom-[-8rem] w-full opacity-0 dark:opacity-100 transition-opacity duration-500"
        src={heroDarkBackground}
        alt="Dark theme background"
      />

      <div className="w-full h-full content-center poppins-regular">
        <h1 className="text-[#1F2937] dark:text-[#F3F4F6] transition-color duration-200 text-[64px] font-medium mb-[1rem]">
          Master Image Processing with <br /> Virtual Lab
        </h1>
        <p className="text-xl mb-[1rem] text-[#000] dark:text-[#fff] transition-color duration-200">
          Virtual Lab is your platform to master Image Processing without the complexity — hands-on, step-<br />by-step, and results you can see instantly!
        </p>
        <div className="flex justify-center gap-[40px] mt-[3rem]">
          <Link to="/docs/chapter_1_1_what_is_image_processing" className="bg-[#1F2937] dark:bg-[#F9FAFB] dark:text-[#121212] py-[14px] px-[33px] text-[14px] text-text-inverse rounded-[11px]">
            Get Started
          </Link>
          <a href="#siteIdentity" className="bg-[#F9FAFB] text-[#1F2937] dark:bg-[#1E1E1E] dark:text-[#F3F4F6]  py-[14px] px-[33px] text-[14px] border-[1px] border-[#E5E7EB] rounded-[11px] dark:border-[#323232]">
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;