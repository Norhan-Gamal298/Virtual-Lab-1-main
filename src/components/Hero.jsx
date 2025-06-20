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
    <div className="relative w-full min-h-screen sm:min-h-screen-auto flex items-center justify-center px-4 py-20 md:py-0 overflow-hidden poppins-regular">
      {/* Background images */}
      <img
        className="absolute bottom-0 left-0 w-full h-auto max-h-[50vh] opacity-100  dark:opacity-0 transition-opacity duration-500 object-cover"
        src={heroLightBackground}
        alt="Light theme background"
      />
      <img
        className="absolute bottom-0 left-0 w-full h-auto max-h-[50vh] opacity-0 dark:opacity-100 transition-opacity duration-500 object-cover"
        src={heroDarkBackground}
        alt="Dark theme background"
      />

      {/* Content container */}
      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
        <h1 className="text-gray-900 dark:text-gray-100 transition-colors duration-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-4 md:mb-6 leading-tight">
          Master Image Processing with <br className="hidden sm:block" /> Virtual Lab
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 transition-colors duration-200 mb-6 md:mb-8 max-w-3xl mx-auto">
          Virtual Lab is your platform to master Image Processing without the complexity — hands-on, step-by-step, and results you can see instantly!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8 mt-6 md:mt-8 w-full sm:w-auto">
          <button
            onClick={handleDocsClick}
            className="bg-[#1F2937] hover:bg-[#374151] dark:bg-[#F9FAFB] border dark:text-[#121212] py-3 px-6 sm:px-8 text-sm sm:text-base text-white rounded-lg transition-all duration-200 dark:hover:bg-[#7c3aed36] hover:text-[white]  hover:backdrop-blur-[3px] hover:border-solid hover:border-[#b589fe3b]"
          >
            Get Started
          </button>
          <Link
            to="/about"
            className="bg-[#F9FAFB] hover:bg-[#E5E7EB] text-[#1F2937] dark:bg-[#282525] dark:text-[#F3F4F6]  py-3 px-6 sm:px-8 text-sm sm:text-base border border-[#1f293763] dark:border-[#323232] rounded-lg transition-all duration-200 dark:hover:bg-[#00000036] hover:backdrop-blur-[1px] shadow-[0px_0px_7px_3px_rgba(0,0,0,0.2)]"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;