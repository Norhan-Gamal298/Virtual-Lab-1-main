import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/auth/authSlice";
// import { authAPI } from "../features/auth/authAPI";
const PersonalInfo = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); // Get the logged-in user from Redux

    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({}); // To store validation errors
    const [userInfo, setUserInfo] = useState({
        FullName: "",
        Email: "",
    });

    const validateInput = (field, value) => {
        let error = "";

        if (field === "FullName") {
            if (!/^[a-zA-Z\s]{3,50}$/.test(value)) {
                error = "Invalid name (only letters, min 3 chars)";
            }
        } else if (field === "Email") {
            if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                error = "Invalid email format";
            }
        } else if (field === "Phone") {
            if (!/^\+?\d{10,15}$/.test(value)) {
                error = "Invalid phone number";
            }
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
        return error === "";
    };
    // Fetch user data from Redux or backend
    useEffect(() => {
        if (user) {
            setUserInfo({
                FullName: `${user.firstName} ${user.lastName}`,
                Email: user.email,
                // Phone: user.phone || "", // Default to empty if phone is not available
            });
        }
    }, [user]);

    const handleChange = (e, field) => {
        const newValue = e.target.innerText.trim();
        setUserInfo({ ...userInfo, [field]: newValue });

        validateInput(field, newValue);
    };

    const handleEdit = () => {
        if (editing) {
            dispatch(updateUser(userInfo));
        }
        setEditing(!editing);
    };

    return (
        <div className="personalInfo mt-[2rem] poppins-medium">
            <div className="flex justify-between mb-5">
                <h3 className="inter-semi-bold">Personal Info</h3>
                <button className="p-2 px-7 border border-[#252525] rounded-[8px] inter-medium" onClick={handleEdit}>
                    {editing ? "Save" : "Edit"}
                </button>
            </div>

            <div className="flex gap-9">
                {Object.entries(userInfo).map(([key, value]) => (
                    <div className="flex flex-col" key={key}>
                        <span className="dark:text-[#ffffff80] transition-colors duration-200">{key.replace(/([A-Z])/g, " $1")}</span>
                        <p
                            contentEditable={editing}
                            suppressContentEditableWarning={true}
                            className={`editable pt-2 ${errors[key] ? "border-red-500" : "border-gray-300"
                                }`}
                            onBlur={(e) => handleChange(e, key)}
                        >
                            {value}
                        </p>
                        {errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonalInfo;
