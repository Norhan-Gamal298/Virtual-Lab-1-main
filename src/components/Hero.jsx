import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import heroLightBackground from "../assets/wave-background-light.png";
import heroDarkBackground from "../assets/wave-background-dark.png";

const Hero = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleDocsClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/topics");
      if (!response.ok) throw new Error("Failed to fetch topics");
      const data = await response.json();

      const sortedChapters = [...data].sort((a, b) => {
        const numA = parseInt(a.chapter?.match(/^\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.chapter?.match(/^\d+/)?.[0] || "0", 10);
        return numA - numB;
      });

      const allTopics = sortedChapters.flatMap((chapter) =>
        [...chapter.topics].sort((a, b) => {
          const getParts = (t) => {
            const match = t.id.match(/^chapter_(\d+)_(\d+)_(\d+)_/);
            return match
              ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
              : [0, 0, 0];
          };
          const [a1, a2, a3] = getParts(a);
          const [b1, b2, b3] = getParts(b);
          return a1 - b1 || a2 - b2 || a3 - b3;
        })
      );

      if (allTopics.length > 0) {
        navigate(`/docs/${allTopics[0].id}`);
      } else {
        alert("No topics available.");
      }
    } catch (error) {
      console.error("Error loading docs:", error);
    }
  };





  return (
    <div className="h-full heroSection h-screen relative">
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
        <p className="text-xl mb-[1rem] text-[#4B5563] dark:text-[#fff] transition-color duration-200">
          Virtual Lab is your platform to master Image Processing without the complexity — hands-on, step-<br />by-step, and results you can see instantly!
        </p>
        <div className="flex justify-center gap-[40px] mt-[3rem]">
          <button
            onClick={handleDocsClick}
            className="bg-[#1F2937] dark:bg-[#F9FAFB] dark:text-[#121212] py-[14px] px-[33px] text-[14px] text-text-inverse rounded-[11px] z-1">
            Get Started
          </button>
          <a href="#siteIdentity" className="bg-[#F9FAFB] text-[#1F2937] dark:bg-[#1E1E1E] dark:text-[#F3F4F6]  py-[14px] px-[33px] text-[14px] border-[1px] border-[#E5E7EB] rounded-[11px] dark:border-[#323232]">
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;