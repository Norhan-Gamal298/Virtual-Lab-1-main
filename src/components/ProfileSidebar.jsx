import React from "react";
import { FaUser, FaTrophy, FaCog, FaLock } from "react-icons/fa";

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="proflieSidebar w-64 ml-[5%] h-full font-bold overflow-y-auto p-4">
      <ul className="flex flex-col relative">
        <li className="sidebarLabel mb-2">Edit Profile</li>
        <li
          className={`sidebarTab flex gap-4 p-2 items-center inter-bold ${activeTab === "overview" ? "active" : ""
            }`}
          onClick={() => setActiveTab("overview")}
        >
          <FaUser size={15} className="sidebarIcon" /> Overview
        </li>
        <hr className="my-3 text-[#272727]" />
        <li className="sidebarLabel mb-2">Progress</li>
        <li
          className={`sidebarTab flex gap-4 p-2 items-center inter-bold ${activeTab === "achievements" ? "active" : ""
            }`}
          onClick={() => setActiveTab("achievements")}
        >
          <FaTrophy size={15} className="sidebarIcon" /> Achievements
        </li>
        <hr className="my-3 text-[#272727]" />

        <li className="sidebarLabel mb-2 ">Settings</li>
        {/* <li className={`sidebarTab flex gap-4 p-2 items-center inter-bold ${activeTab === "preferences" ? "active" : ""}`} onClick={() => setActiveTab("preferences")}>
                    <FaCog size={15} className='sidebarIcon' /> Preferences
                </li> */}
        <li
          className={`sidebarTab flex gap-4 p-2 items-center inter-bold ${activeTab === "password" ? "active" : ""
            }`}
          onClick={() => setActiveTab("password")}
        >
          <FaLock size={15} className="sidebarIcon" /> Password
        </li>
      </ul>
    </aside>
  );
};

export default ProfileSidebar;
