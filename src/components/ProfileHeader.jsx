import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authAPI } from '../features/auth/authAPI';
import { updateProfileImageStatus } from '../features/auth/authSlice';
import defaultAvatar from "../assets/default-avatar.png";

const ProfileHeader = ({ user }) => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();

    // Load profile image on component mount
    useEffect(() => {
        if (user.hasProfileImage) {
            const imageUrl = authAPI.getProfileImageUrl(user.id);
            setImage(imageUrl);
        }
    }, [user.hasProfileImage, user.id]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!(file.type === "image/jpeg" || file.type === "image/png")) {
            setError("Please upload a valid JPG or PNG file.");
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB.");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Upload image to server
            await authAPI.uploadProfileImage(file, token);

            // Update Redux state
            dispatch(updateProfileImageStatus({ hasProfileImage: true }));

            // Update local image display
            const imageUrl = authAPI.getProfileImageUrl(user.id);
            setImage(`${imageUrl}?t=${Date.now()}`); // Add timestamp to prevent caching

        } catch (error) {
            console.error("Error uploading profile image:", error);
            setError(error.message || "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleImageDelete = async () => {
        if (!user.hasProfileImage) return;

        setUploading(true);
        try {
            await authAPI.deleteProfileImage(token);

            // Update Redux state
            dispatch(updateProfileImageStatus({ hasProfileImage: false }));

            // Reset local image display
            setImage(null);

        } catch (error) {
            console.error("Error deleting profile image:", error);
            setError(error.message || "Failed to delete image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
                <img
                    src={image || defaultAvatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-[#323232] shadow-md"
                    onError={() => setImage(defaultAvatar)} // Fallback to default avatar on error
                />

                {/* Upload overlay */}
                <label
                    htmlFor="avatarFile"
                    className={`absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-300 cursor-pointer ${uploading ? 'opacity-80' : ''}`}
                >
                    <span className="text-white text-sm font-medium">
                        {uploading ? 'Uploading...' : 'Change'}
                    </span>
                </label>

                <input
                    id="avatarFile"
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg"
                    className="hidden"
                    disabled={uploading}
                />

                {/* Delete button for existing images */}
                {user.hasProfileImage && !uploading && (
                    <button
                        onClick={handleImageDelete}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        title="Delete profile image"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>

                {/* Error message display */}
                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;