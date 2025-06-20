import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedCongratulations = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const userEmail = user?.email || JSON.parse(localStorage.getItem("user"))?.email;

    useEffect(() => {
        if (!userEmail) {
            navigate("/");
        }
    }, [userEmail, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] p-4">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl max-w-md w-full p-8 text-center">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-12 h-12 text-green-500 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Congratulations!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        You've completed the entire learning journey. Great job!
                    </p>
                </div>
                <div className="flex flex-col space-y-3">
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="px-4 py-2 border border-[#7C3AED] text-[#7C3AED] dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        View Achievements
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProtectedCongratulations;