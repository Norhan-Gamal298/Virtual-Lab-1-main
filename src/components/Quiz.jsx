import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiArrowRight,
  FiSend,
  FiLoader,
  FiAlertCircle,
  FiEye,
  FiRefreshCw,
  FiHome,
} from "react-icons/fi";

const Quiz = ({ chapterId }) => {
  // State to hold the quiz questions
  const [questions, setQuestions] = useState([]);
  // State to track the current question index
  const [current, setCurrent] = useState(0);
  // State to store user's selected answers
  const [userAnswers, setUserAnswers] = useState([]);
  // State to indicate whether the quiz has been submitted
  const [isSubmitted, setIsSubmitted] = useState(false);
  // State to track if user is viewing answers
  const [viewingAnswers, setViewingAnswers] = useState(false);
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
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let chapterTitle = `Chapter ${chapterId}`;
        try {
          const topicsResponse = await fetch(
            `http://localhost:8080/api/topics/${chapterId}`
          );
          if (topicsResponse.ok) {
            const chapterData = await topicsResponse.json();
            if (chapterData && chapterData.chapter) {
              chapterTitle = chapterData.chapter;
            }
          }
        } catch (topicsError) {
          console.warn("Could not fetch chapter data:", topicsError);
        }
        setQuizTitle(chapterTitle);

        // ✅ Fetch from backend (MongoDB)
        const response = await fetch(
          `http://localhost:8080/api/quizzes/${chapterId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch questions: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No questions found in the database");
        }

        // Shuffle and limit to 10 questions
        const shuffled = data
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(10, data.length));

        setQuestions(shuffled);
        setUserAnswers(new Array(shuffled.length).fill(undefined));
        setStartTime(Date.now());
      } catch (error) {
        console.error("Error loading quiz:", error);
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
      timestamp: new Date().toISOString(),
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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get progress percentage
  const getProgress = () => ((current + 1) / questions.length) * 100;

  // Reset quiz
  const resetQuiz = () => {
    setIsSubmitted(false);
    setViewingAnswers(false);
    setCurrent(0);
    setUserAnswers(new Array(questions.length).fill(undefined));
    setStartTime(Date.now());
    setTimeElapsed(0);
  };

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
            <FiLoader
              size={48}
              className="text-indigo-600 dark:text-blue-400"
            />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Loading Quiz...
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please wait while we prepare your questions
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-8 text-center border border-gray-100 dark:border-gray-700">
          <FiAlertCircle
            size={48}
            className="text-red-500 dark:text-red-400 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            Quiz Not Available
          </h3>
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
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            No Questions Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            This quiz doesn't have any questions yet.
          </p>
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
        {!isSubmitted && (
          <div className="flex justify-center items-center gap-6 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <FiClock size={18} />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="text-sm">{questions.length} Questions</div>
          </div>
        )}
      </motion.div>

      {/* Progress Bar - Only show during quiz */}
      {!isSubmitted && (
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
      )}

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
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                                ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-400"
                                : "border-gray-300 dark:border-gray-500"
                              }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
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
                  {isSubmitting ? (
                    <FiLoader className="animate-spin" size={18} />
                  ) : (
                    <FiSend size={18} />
                  )}
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
        ) : viewingAnswers ? (
          // Answer Review View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                📋 Answer Review
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Review your answers and see the correct solutions
              </p>
            </div>

            {questions.map((question, idx) => {
              const userAnswer = userAnswers[idx];
              const correctAnswer = question.answer;
              const isCorrect = userAnswer === correctAnswer;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCorrect
                          ? "bg-green-500 dark:bg-green-600"
                          : "bg-red-500 dark:bg-red-600"
                        }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        {question.question}
                      </h4>

                      <div className="space-y-3">
                        {question.options.map((option, optionIdx) => {
                          const isUserAnswer = userAnswer === option;
                          const isCorrectOption = correctAnswer === option;

                          return (
                            <div
                              key={optionIdx}
                              className={`p-3 rounded-lg border-2 transition-all ${isCorrectOption
                                  ? "bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-500 text-green-800 dark:text-green-200"
                                  : isUserAnswer && !isCorrectOption
                                    ? "bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-500 text-red-800 dark:text-red-200"
                                    : "bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {isCorrectOption && (
                                    <FiCheckCircle className="text-green-600 dark:text-green-400" size={18} />
                                  )}
                                  {isUserAnswer && !isCorrectOption && (
                                    <FiXCircle className="text-red-600 dark:text-red-400" size={18} />
                                  )}
                                </div>
                                <span className="flex-1">{option}</span>
                                <div className="flex gap-2 text-sm">
                                  {isCorrectOption && (
                                    <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                      Correct
                                    </span>
                                  )}
                                  {isUserAnswer && (
                                    <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                      Your Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {userAnswer === undefined && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            ⚠️ No answer provided for this question
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <div className="flex justify-center gap-4 pt-6">
              <button
                onClick={() => setViewingAnswers(false)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FiArrowLeft size={18} />
                Back to Results
              </button>
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-500 dark:bg-blue-600 text-white rounded-xl hover:bg-indigo-600 dark:hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw size={18} />
                Retake Quiz
              </button>
            </div>
          </motion.div>
        ) : (
          // Results View
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getPercentage() >= 70
                    ? "bg-green-100 dark:bg-green-900/30"
                    : getPercentage() >= 50
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
              >
                {getPercentage() >= 70 ? (
                  <FiCheckCircle
                    size={40}
                    className="text-green-600 dark:text-green-400"
                  />
                ) : (
                  <FiXCircle
                    size={40}
                    className={
                      getPercentage() >= 50
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  />
                )}
              </div>

              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Quiz Complete!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Here are your results for {quizTitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {getScore()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Correct Answers
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  out of {questions.length}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {getPercentage()}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Score
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getPercentage() >= 70
                    ? "Excellent!"
                    : getPercentage() >= 50
                      ? "Good job!"
                      : "Keep practicing!"}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Time Taken
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total duration
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewingAnswers(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FiEye size={18} />
                View Answers
              </motion.button>
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-500 dark:bg-blue-600 text-white rounded-xl hover:bg-indigo-600 dark:hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw size={18} />
                Retake Quiz
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FiHome size={18} />
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