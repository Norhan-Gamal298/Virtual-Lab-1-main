import React, { useState } from 'react'

import defaultAvatar from "../assets/default-avatar.png"

const ProfileHeader = () => {

    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(reader.result);
            }
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid JPG or PNG file.");
        }
    }

    return (
        <div className="profileHeader flex items-center self-start">
            <img src={image || defaultAvatar} alt="Profile Picture" className='profileImg mr-4' />
            <div>
                <label htmlFor="avatarFile" className='cursor-pointer inline-block py-[10px] px-5'>Upload new photo</label>
                <input id='avatarFile' type="file" onChange={handleImageUpload} accept="image/png, image/jpeg" />
                <p className='mt-6'>At least 800x800 px recommended. JPG or PNG is allowed.</p>
            </div>

        </div >
    )
}

export default ProfileHeader