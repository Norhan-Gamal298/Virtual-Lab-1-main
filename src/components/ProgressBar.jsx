import React from "react";

const ProgressBar = ({ percentage }) => {
    return (
        <div className="w-full bg-gray-200 dark:bg-[#313030] rounded-full h-2.5">
            <div
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-2.5 rounded-full"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;