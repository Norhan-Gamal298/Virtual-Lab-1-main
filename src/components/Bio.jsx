import React, { useState } from 'react'

const Bio = () => {
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState("");


    const handleEdit = () => setEditing(!editing);

    return (
        <div className='bioSection border border-[#252525] mt-[2rem] p-5'>
            <div className='flex justify-between mb-3'>
                <h3 className='inter-semi-bold'>Bio</h3>
                <button className='p-2 px-7 border border-[#252525] inter-medium' onClick={handleEdit}>{editing ? "Save" : "Edit"}</button>

            </div>
            {editing ? (
                <textarea
                    className="w-full bg-[#252525] p-3 rounded-lg text-white"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

            ) : (
                <p>{bio}</p>
            )}
        </div>
    );
};

export default Bio