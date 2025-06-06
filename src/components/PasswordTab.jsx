import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

const PasswordTab = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  // const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters, include an uppercase letter, lowercase letter, and a number."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/update-password?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setError("");
        alert("Password updated successfully. Please login again.");
        // Optional: logout and redirect to login
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password.");
    }
  };
  return (
    <div className="passwordTab bg-[#1a1a1a] p-6 w-140 text-white rounded-[20px]">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <label className="block text-sm mb-1">Current Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-128 bg-[#252525] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="relative">
          <label className="block text-sm mb-1">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-128 bg-[#252525] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="relative">
          <label className="block text-sm mb-1">Confirm New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-128 bg-[#252525] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-9 text-gray-500 hover:text-gray-300"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-128 bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default PasswordTab;
