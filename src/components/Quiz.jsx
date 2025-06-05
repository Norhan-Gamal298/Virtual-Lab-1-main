import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle, FiArrowLeft, FiArrowRight, FiSend, FiLoader, FiAlertCircle } from "react-icons/fi";

const Quiz = ({ chapterId }) => {
    // State to hold the quiz questions
    const [questions, setQuestions] = useState([]);
    // State to track the current question index
    const [current, setCurrent] = useState(0);
    // State to store user's selected answers
    const [userAnswers, setUserAnswers] = useState([]);
    // State to indicate whether the quiz has been submitted
    const [isSubmitted, setIsSubmitted] = useState(false);
    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Quiz metadata
    const [quizTitle, setQuizTitle] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Retrieve user data (specifically email) from local storage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user?.email;

    // Timer effect
    useEffect(() => {
        if (startTime && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [startTime, isSubmitted]);

    useEffect(() => {
        // Fetch questions when the component mounts or when chapterId changes
        const fetchQuestions = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // First, try to fetch topics.json to get the chapter title
                let chapterTitle = `Chapter ${chapterId}`;
                try {
                    const topicsResponse = await fetch("/topics.json");
                    if (topicsResponse.ok) {
                        const topicsData = await topicsResponse.json();
                        const chapter = topicsData.find((_, index) => index + 1 === parseInt(chapterId));
                        if (chapter) {

                            chapterTitle = chapter.chapter;
                        }
                    }
                } catch (topicsError) {
                    console.warn("Could not fetch topics data:", topicsError);
                }

                setQuizTitle(chapterTitle);

                // Fetch the quiz questions JSON file based on the chapterId
                const response = await fetch(`/quizzes/chapter${chapterId}.json`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error("No questions found in the quiz data");
                }

                // Shuffle the questions randomly and pick the first 10 (or all if less than 10)
                const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, Math.min(10, data.length));

                setQuestions(shuffled);
                setUserAnswers(new Array(shuffled.length).fill(undefined));
                setStartTime(Date.now());

            } catch (error) {
                console.error('Error loading quiz:', error);
                setError(error.message);
                setQuestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (chapterId) {
            fetchQuestions();
        }
    }, [chapterId]);

    // Handle selecting an answer for the current question
    const handleAnswer = (option) => {
        if (isSubmitted) return;
        const updated = [...userAnswers];
        updated[current] = option;
        setUserAnswers(updated);
    };

    // Move to the next question
    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        }
    };

    // Move to the previous question
    const handlePrev = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    // Calculate the total score based on correct answers
    const getScore = () =>
        questions.reduce(
            (score, q, idx) => (userAnswers[idx] === q.answer ? score + 1 : score),
            0
        );

    // Get percentage score
    const getPercentage = () => Math.round((getScore() / questions.length) * 100);

    // Handle submitting the quiz
    const submitQuiz = async () => {
        setIsSubmitting(true);

        const score = getScore();
        const percentage = getPercentage();
        const timeTaken = timeElapsed;

        // Prepare result data to send to the server
        const resultData = {
            email,
            quizId: `chapter${chapterId}`,
            chapterTitle: quizTitle,
            score,
            totalQuestions: questions.length,
            percentage,
            timeTaken,
            answers: userAnswers,
            timestamp: new Date().toISOString()
        };

        console.log("Sending quiz result to backend:", resultData);

        try {
            // Send the quiz result to the server
            const response = await fetch("http://localhost:8080/api/quiz-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resultData),
            });

            if (response.ok) {
                console.log("Quiz result saved successfully");
                setIsSubmitted(true);
            } else {
                const errorText = await response.text();
                console.error("Failed to save quiz result:", errorText);
                // Still show results even if saving failed
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error("Error while saving quiz result:", error);
            // Still show results even if saving failed
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get progress percentage
    const getProgress = () => ((current + 1) / questions.length) * 100;

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 text-center border border-gray-100 dark:border-gray-700">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <FiLoader size={48} className="text-indigo-600 dark:text-blue-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Loading Quiz...</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we prepare your questions</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 text-center border border-gray-100 dark:border-gray-700">
                    <FiAlertCircle size={48} className="text-red-500 dark:text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Quiz Not Available</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-indigo-600 dark:bg-blue-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // No questions available
    if (questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 text-center border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No Questions Available</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">This quiz doesn't have any questions yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Quiz Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                    🧠 {quizTitle} Quiz
                </h2>
                <div className="flex justify-center items-center gap-6 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <FiClock size={18} />
                        <span>{formatTime(timeElapsed)}</span>
                    </div>
                    <div className="text-sm">
                        {questions.length} Questions
                    </div>
                </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(getProgress())}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-blue-500 dark:to-purple-500 h-2 rounded-full transition-all duration-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgress()}%` }}
                    />
                </div>
            </div>

            {/* Quiz Card */}
            <motion.div
                layout
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/20 p-8 border border-gray-100 dark:border-gray-700"
            >
                {!isSubmitted ? (
                    <>
                        {/* Question Counter */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                Question {current + 1} of {questions.length}
                            </span>
                            <div className="flex gap-2">
                                {questions.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-3 h-3 rounded-full transition-colors ${idx === current
                                            ? "bg-indigo-500 dark:bg-blue-500"
                                            : userAnswers[idx] !== undefined
                                                ? "bg-green-400 dark:bg-green-500"
                                                : "bg-gray-200 dark:bg-gray-600"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Current Question */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-100 leading-relaxed">
                                    {questions[current].question}
                                </h3>

                                {/* Answer Options */}
                                <div className="space-y-4">
                                    {questions[current].options.map((option, idx) => {
                                        const selectedAnswer = userAnswers[current];
                                        const isSelected = selectedAnswer === option;

                                        return (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAnswer(option)}
                                                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-300 ${isSelected
                                                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 dark:border-indigo-500 text-indigo-800 dark:text-indigo-200 shadow-md"
                                                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                                                        ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400"
                                                        : "border-gray-300 dark:border-gray-500"
                                                        }`}>
                                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </div>
                                                    <span className="font-medium">{option}</span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex justify-between items-center">
                            <button
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handlePrev}
                                disabled={current === 0}
                            >
                                <FiArrowLeft size={18} />
                                Previous
                            </button>

                            {current === questions.length - 1 ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                    onClick={submitQuiz}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <FiLoader className="animate-spin" size={18} /> : <FiSend size={18} />}
                                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                                </motion.button>
                            ) : (
                                <button
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 dark:bg-blue-600 text-white rounded-xl hover:bg-indigo-600 dark:hover:bg-blue-700 transition-colors"
                                    onClick={handleNext}
                                >
                                    Next
                                    <FiArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    // Results View
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="mb-8">
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getPercentage() >= 70
                                ? "bg-green-100 dark:bg-green-900/30"
                                : getPercentage() >= 50
                                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                                    : "bg-red-100 dark:bg-red-900/30"
                                }`}>
                                {getPercentage() >= 70 ? (
                                    <FiCheckCircle size={40} className="text-green-600 dark:text-green-400" />
                                ) : (
                                    <FiXCircle size={40} className={getPercentage() >= 50
                                        ? "text-yellow-600 dark:text-yellow-400"
                                        : "text-red-600 dark:text-red-400"} />
                                )}
                            </div>

                            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quiz Complete!</h3>
                            <p className="text-gray-600 dark:text-gray-300">Here are your results for {quizTitle}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{getScore()}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Correct Answers</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">out of {questions.length}</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{getPercentage()}%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Score</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {getPercentage() >= 70 ? "Excellent!" : getPercentage() >= 50 ? "Good job!" : "Keep practicing!"}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{formatTime(timeElapsed)}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Time Taken</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Total duration</div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-indigo-500 dark:bg-blue-600 text-white rounded-xl hover:bg-indigo-600 dark:hover:bg-blue-700 transition-colors"
                            >
                                Retake Quiz
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Back to Quizzes
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Quiz;