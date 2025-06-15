import { useState } from 'react';
import defaultAvatar from "../assets/default-avatar.png";

const ProfileHeader = ({ user }) => {
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid JPG or PNG file.");
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
                <img
                    src={image || defaultAvatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-[#323232] shadow-md"
                />
                <label
                    htmlFor="avatarFile"
                    className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                >
                    <span className="text-white text-sm font-medium">Change</span>
                </label>
                <input
                    id="avatarFile"
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg"
                    className="hidden"
                />
            </div>

            <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default ProfileHeader;