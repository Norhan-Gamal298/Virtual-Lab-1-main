import { useState } from "react";

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!newPassword || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset successful. You can now log in.");
      } else {
        setError(data.error || "Reset failed.");
      }
    } catch {
      setError("Network error.");
    }
  };

  if (!email || !token) {
    return <div className="p-8 text-center text-red-500">Invalid or missing reset link.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#181818] p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="block w-full mb-4 px-3 py-2 rounded bg-[#222] text-white"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="block w-full mb-4 px-3 py-2 rounded bg-[#222] text-white"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-2 rounded hover:bg-gray-200"
        >
          Reset Password
        </button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}