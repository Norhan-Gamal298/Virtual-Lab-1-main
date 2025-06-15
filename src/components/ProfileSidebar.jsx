import { FaUser, FaTrophy, FaLock, FaChevronRight } from "react-icons/fa";

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: FaUser },
    { id: "achievements", label: "Achievements", icon: FaTrophy },
    { id: "password", label: "Password", icon: FaLock }
  ];

  return (
    <aside className="w-full md:w-64">
      <div className="dark:bg-[#1E1E1E] border dark:border-[#292929] rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#292929]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Account Settings
          </h2>
        </div>
        <nav>
          <ul className="divide-y divide-gray-200 dark:divide-[#292929]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-200 ${activeTab === tab.id
                      ? "bg-purple-50 dark:bg-[#323232] text-purple-600 dark:text-purple-400"
                      : "hover:bg-purple-50 dark:hover:bg-[#323232] text-[#1F2937] dark:text-[#F3F4F6]"
                      }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`mr-3 ${activeTab === tab.id
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-[#1F2937] dark:text-gray-400"
                        }`} />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <FaChevronRight className="text-gray-400 text-xs" />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default ProfileSidebar;