import React from "react";
import rookieBadge from "../assets/avatars/rookieBadge.png";
import intermediateBadge from "../assets/avatars/intermediateBadge.png";
import advancedBadge from "../assets/avatars/advancedBadge.png";
import expertBadge from "../assets/avatars/expertBadge.png";

const Badge = ({ level }) => {
    const getBadgeImage = () => {
        switch (level.toLowerCase()) {
            case 'intermediate': return intermediateBadge;
            case 'advanced': return advancedBadge;
            case 'expert': return expertBadge;
            default: return rookieBadge;
        }
    };

    return (
        <div className="relative group w-40 h-40">
            {/* Glow Background */}
            <div className="absolute inset-0 rounded-full  transform translate-y-[6rem] bg-purple-500 opacity-60 blur-2xl z-0"></div>

            {/* Badge Image */}
            <img
                src={getBadgeImage()}
                alt={`${level} Badge`}
                className="relative w-full h-full rounded-full object-cover border-4 border-[#D1D5DB] dark:border-[#313030] shadow-lg transition-transform duration-300 group-hover:scale-105 z-10"
            />

            {/* Label */}
            <div className="absolute bottom-[8px] left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap z-20">
                {level}
            </div>
        </div>
    );
};

export default Badge;
