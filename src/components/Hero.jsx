import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/heroBackground.png";
import heroImg2 from "../assets/topography.svg";
const Hero = () => {
  return (
    <div className="h-full heroSection">
      <img className="drop-shadow-lg drop-shadow-indigo-500/50" src={heroImg2} alt="" />
      <div className="w-full h-full content-center">
        <h1 className="text-[#000] dark:text-[#fff] transition-color duration-200  text-[64px] font-black mb-[1rem]">
          Master Image Processing with <br /> Virtual Lab
        </h1>
        <p className="text-xl mb-[1rem] text-[#000] dark:text-[#fff] transition-color duration-200">
          Your Virtual Lab for Pixels and Vision. Explore cutting-edge
          techniques, enhance your skills, <br /> and unlock the power of OpenCV
          and MATLAB with interactive documentation. Dive deep into the world of
          pixels today!
        </p>
        <div className="flex justify-center gap-[2rem]">
          <Link to="/docs/chapter_1_1_what_is_image_processing" className="bg-brand-primary text-text-inverse">
            Get Started
          </Link>
          <a href="#siteIdentity" className="bg-bg-subtle text-[#000]">Learn more</a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
