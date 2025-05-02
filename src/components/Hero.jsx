import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/heroBackground.png";

const Hero = () => {
  return (
    <div className="h-full heroSection">
      <img src={heroImg} alt="" />
      <div className="w-full h-full content-center">
        <h1 className="text-[64px] font-black mb-[1rem]">
          Master Image Processing with <br /> Virtual Lab
        </h1>
        <p className="text-xl mb-[1rem]">
          Your Virtual Lab for Pixels and Vision. Explore cutting-edge
          techniques, enhance your skills, <br /> and unlock the power of OpenCV
          and MATLAB with interactive documentation. Dive deep into the world of
          pixels today!
        </p>
        <div className="flex justify-center gap-[2rem]">
          <Link to="/docs/chapter_1_1_what_is_image_processing">
            Get Started
          </Link>
          <a href="#siteIdentity">Learn more</a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
