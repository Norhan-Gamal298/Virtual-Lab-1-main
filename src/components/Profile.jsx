import {  useState } from 'react'
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import PersonalInfo from './PersonalInfo';
import Bio from './Bio';
import UserAchievements from './UserAchievements';
import PasswordTab from './PasswordTab';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("overview");

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white text-xl">Loading user profile...</p>
            </div>
        )
    }

    return (
        <div className='profile-container flex gap-12 py-[5rem]'>
            <ProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {activeTab === "overview" && (
                <div className="flex-1 pr-8">
                    <ProfileHeader user={user} />
                    <hr className='border-[#98989840] mt-[4rem] mb-[2rem]' />
                    <PersonalInfo user={user} />
                    <Bio />
                </div>
            )}

            {activeTab === "achievements" && (
                <div className="flex-1 pr-8">
                    <UserAchievements />
                </div>
            )}

            {activeTab === "password" && (
                <div className="flex-1 pr-8">
                    <PasswordTab />
                </div>
            )}
        </div>
    )
}

export default Profile