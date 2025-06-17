import React from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";

const PageOutro = () => {
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
        <div className='flex flex-col items-center pt-20 pb-[25rem] relative transition-all duration-300 '>
            <h2 className='poppins-medium text-[44px] mb-[20px] text-[#1F2937] dark:text-[#F3F4F6] z-1'>Ready to start your Image Processing journey?</h2>
            <span className='text-[18px] text-[#4B5563] dark:text-[#D1D5DB] poppins-regular z-1'>Make learning simple, and practical — with Virtual Lab.</span>
            <button onClick={handleDocsClick} className='bg-[#1F2937] hover:bg-[#374151] dark:bg-[#F9FAFB] border text-[#ffffff] dark:text-[#121212] w-[150px] h-[50px] mt-[2rem] content-center poppins-semibold rounded-[11px] cursor-pointer z-1 tranistion-colors duration-200 dark:hover:bg-[#7c3aed36] hover:text-[white]  hover:backdrop-blur-[3px] hover:border-solid hover:border-[#b589fe3b]'>Get Started</button>
            <div className='gradient-bg-light rotate-180 bottom-0'></div>
            <div className='gradient-bg-dark rotate-180  bottom-0'></div>
        </div>
    )
}

export default PageOutro
