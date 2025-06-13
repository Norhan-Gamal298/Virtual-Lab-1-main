// Import necessary React hooks and libraries
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../features/auth/authSlice";
import { authAPI } from "../features/auth/authAPI";

const SignInModal = ({ onClose, switchToSignUp }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const validateForm = () => {
    let newErrors = {};

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!userData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await authAPI.login(userData);
        dispatch(setCredentials({ user: response.user, token: response.token }));
        setApiError(null);
        onClose();
        navigate("/profile");
      } catch (error) {
        setApiError(error.message);
      }
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetMessage("");
    setResetError("");
    try {
      const res = await fetch("http://localhost:8080/api/request-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetMessage("Check your email for a reset link.");
      } else {
        setResetError(data.error || "Error sending reset email.");
      }
    } catch (err) {
      setResetError("Network error.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/75 flex items-center justify-center transition-opacity duration-900 ease-in-out z-50">
      <div
        className={`relative w-[500px] bg-white dark:bg-[#0a0a0a] rounded-[18px] transition-all duration-400 ease-in-out transform ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1F2937] dark:text-white bg-transparent border-0 cursor-pointer"
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-4xl text-[#1F2937] dark:text-[#F3F4F6] font-bold text-center mt-16">
          Welcome back! <br /> Sign in to continue
        </h2>

        {showReset ? (
          <form onSubmit={handleResetSubmit} className="mt-8 px-8 pb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#A1A1A1]">
                Enter your email to reset password
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-[#393939] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              />
              {resetMessage && <p className="text-green-500 text-sm mt-2">{resetMessage}</p>}
              {resetError && <p className="text-red-500 text-sm mt-2">{resetError}</p>}
            </div>

            <button
              type="submit"
              className="w-full mt-4 rounded-lg bg-[#1F2937] dark:bg-[#F9FAFB] text-white dark:text-black py-3 text-sm font-semibold transition-colors dark:hover:bg-[#929292] dark:hover:text-white hover:bg-[#3d526f]"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              className="w-full text-sm text-[#a1a1a1] mt-2 underline cursor-pointer"
              onClick={() => setShowReset(false)}
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 px-8 pb-6"
          >
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-[#A1A1A1]">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-[#393939] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-[#A1A1A1]">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={userData.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-[#393939] bg-white dark:bg-[#1a1a1a] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {apiError && <p className="text-red-500 text-sm sm:col-span-6">{apiError}</p>}

            <button
              type="submit"
              className="sm:col-span-6 w-full mt-4 rounded-lg bg-[#1F2937] dark:bg-[#F9FAFB] text-white dark:text-black py-3 text-sm font-semibold transition-colors dark:hover:bg-[#929292] dark:hover:text-white hover:bg-[#3d526f]"
            >
              Sign In
            </button>

            <p className="text-sm sm:col-span-6 text-center text-[#a1a1a1] mt-2">
              Forgot your password?{" "}
              <span
                className="text-[#1F2937] dark:text-white underline cursor-pointer"
                onClick={() => setShowReset(true)}
              >
                Reset it here
              </span>
            </p>
          </form>
        )}

        <div>
          <p
            className="text-sm text-center text-[#a1a1a1] mt-3 py-3 border-t border-[#252525] cursor-pointer"
            onClick={switchToSignUp}
          >
            Don't have an account?{" "}
            <span className="text-[#1F2937] dark:text-white underline">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;