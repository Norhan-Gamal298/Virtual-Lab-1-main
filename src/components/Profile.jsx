import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import PersonalInfo from './PersonalInfo';
import UserAchievements from './UserAchievements';
import PasswordTab from './PasswordTab';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("overview");

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading user profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 poppins-regular">
            <div className="flex flex-col md:flex-row gap-8">
                <ProfileSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <main className="flex-1">
                    <div className="dark:bg-[#1E1E1E] border dark:border-[#292929] border-[#D1D5DB] rounded-xl shadow-lg overflow-hidden transition-all duration-300">
                        {activeTab === "overview" && (
                            <div className="p-6 md:p-8">
                                <ProfileHeader user={user} />
                                <hr className="border-[#E5E7EB] dark:border-[#323232] my-8" />
                                <PersonalInfo user={user} />
                            </div>
                        )}

                        {activeTab === "achievements" && (
                            <div className="p-6 md:p-8">
                                <UserAchievements />
                            </div>
                        )}

                        {activeTab === "password" && (
                            <div className="p-6 md:p-8">
                                <PasswordTab />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;