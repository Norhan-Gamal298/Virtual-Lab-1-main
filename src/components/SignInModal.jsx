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

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  return (
    <div style={styles.modalOverlay}>
      <div
        style={{
          ...styles.modalContent,
          transform: visible ? "translateY(0)" : "translateY(50px)",
          opacity: visible ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] bg-transparent border-0 text-[#fff] cursor-pointer"
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-4xl font-bold text-center mt-[4rem]">
          Welcome back! <br /> Sign in to continue
        </h2>

        {showReset ? (
          <form
            onSubmit={async (e) => {
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
            }}
            className="mt-8 px-[31px]"
          >
            <label className="block text-sm font-medium text-[#A1A1A1] mb-2">
              Enter your email to reset password
            </label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="block w-full rounded-[7px] bg-[#0a0a0a] px-3 py-3 text-base text-[white] mb-2"
              required
            />
            <button
              type="submit"
              className="rounded-[7px] px-3 py-2 text-sm font-semibold bg-white text-gray-950 shadow-xs hover:bg-[white]"
            >
              Send Reset Link
            </button>
            {resetMessage && <p className="text-green-500 mt-2">{resetMessage}</p>}
            {resetError && <p className="text-red-500 mt-2">{resetError}</p>}
            <button
              type="button"
              className="text-sm text-[#a1a1a1] mt-2 underline"
              onClick={() => setShowReset(false)}
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="signInForm mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 px-[31px]"
          >
            <div className="sm:col-span-6">
              <label htmlFor="email" className="block text-sm font-medium text-[#A1A1A1]">
                Email address
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="block w-full rounded-[7px] bg-[#0a0a0a] px-3 py-3 text-base text-white placeholder:text-gray-400"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="password" className="block text-sm font-medium text-[#A1A1A1]">
                Password
              </label>
              <div className="mt-2">
                <input
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="block w-full rounded-[7px] bg-[#0a0a0a] px-3 py-3 text-base text-white placeholder:text-gray-400"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>

            {apiError && <p className="text-red-500 text-sm sm:col-span-6">{apiError}</p>}

            <button
              type="submit"
              className="sm:col-span-6 rounded-[7px] px-3 py-2 text-sm font-semibold bg-white text-gray-950 shadow-xs hover:bg-[white]"
            >
              Sign In
            </button>

            <p className="text-sm sm:col-span-6 text-center text-[#a1a1a1]">
              Forgot your password?{" "}
              <span
                className="text-white cursor-pointer"
                onClick={() => setShowReset(true)}
              >
                Reset it here
              </span>
            </p>
          </form>
        )}

        <div>
          <p
            className="text-sm sm:col-span-6 text-center text-[#a1a1a1] mt-3 pt-3.5 pb-3.5 border-t-1 border-[#252525] relative"
            onClick={switchToSignUp}
          >
            Don't have an account?{" "}
            <span className="text-white cursor-pointer">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "opacity 0.9s ease-in-out",
  },
  modalContent: {
    background: "#0a0a0a",
    border: "1px solid #252525",
    borderRadius: "18px",
    width: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    transition: "transform 0.4s ease-in-out, opacity 0.4s ease-in-out",
    position: "relative",
  },
};

export default SignInModal;

