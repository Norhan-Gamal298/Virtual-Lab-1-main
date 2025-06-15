import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/auth/authSlice";

const PersonalInfo = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    const validateInput = (field, value) => {
        let error = "";
        if (field === "firstName" || field === "lastName") {
            if (!/^[a-zA-Z\s]{2,50}$/.test(value)) {
                error = "Invalid name (only letters, min 2 chars)";
            }
        } else if (field === "email") {
            if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                error = "Invalid email format";
            }
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
        return error === "";
    };

    useEffect(() => {
        if (user) {
            setUserInfo({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
        validateInput(name, value);
    };

    const handleSubmit = () => {
        // Validate all fields before submission
        const isValid = Object.keys(userInfo).every(field =>
            validateInput(field, userInfo[field])
        );

        if (isValid) {
            dispatch(updateUser(userInfo));
            setEditing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Personal Information
                </h3>
                {editing ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#323232] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                    >
                        Edit
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(userInfo).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        {editing ? (
                            <>
                                <input
                                    type={key === "email" ? "email" : "text"}
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors[key]
                                        ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900"
                                        : "border-[#D1D5DB] bg-[#F3F4F6] dark:border-[#525252] focus:ring-purple-200 dark:focus:ring-purple-900 dark:bg-[#323232] text-[#4B5563] dark:text-white"
                                        }`}
                                />
                                {errors[key] && (
                                    <p className="text-sm text-red-600">{errors[key]}</p>
                                )}
                            </>
                        ) : (
                            <p className="px-3 py-2 bg-[#F3F4F6] dark:bg-[#323232] rounded-lg text-[#4B5563] dark:text-white">
                                {value || "-"}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonalInfo;