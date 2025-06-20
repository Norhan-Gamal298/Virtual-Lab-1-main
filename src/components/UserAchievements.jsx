import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiAward, FiBarChart2, FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";
import Badge from "./Badge"; // New component for achievement badges
import ProgressBar from "./ProgressBar"; // New component for progress visualization
import { MdKeyboardArrowRight } from "react-icons/md";

const UserAchievements = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [animatedScores, setAnimatedScores] = useState({});
  const [chapters, setChapters] = useState([]);
  const [topicProgress, setTopicProgress] = useState({});
  const [completedTopicsCount, setCompletedTopicsCount] = useState(0);
  const [loading, setLoading] = useState({
    chapters: true,
    progress: true,
    quizzes: true
  });
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  // Helper function to extract chapter number from quizId
  const getChapterNumberFromQuizId = (quizId) => {
    const match = quizId.match(/chapter(\d+)/i);
    return match ? match[1] : null;
  };

  // Format quiz title for display
  const formatQuizTitle = (quizId) => {
    const chapterNum = getChapterNumberFromQuizId(quizId);
    return chapterNum ? `Chapter ${chapterNum} Quiz` : quizId;
  };

  // Calculate overall progress percentage
  // Calculate overall progress percentage
  const calculateProgress = () => {
    const totalTopics = chapters.reduce(
      (total, chapter) => total + chapter.topics.length,
      0
    );
    const percentage = totalTopics > 0
      ? Math.round((completedTopicsCount / totalTopics) * 100)
      : 0;

    // Ensure percentage never exceeds 100
    return Math.min(percentage, 100);
  };

  // Determine achievement level based on progress
  const getAchievementLevel = () => {
    const progress = calculateProgress();
    if (progress >= 80) return { level: "Expert", color: "text-purple-400", badge: "expert-badge" };
    if (progress >= 50) return { level: "Advanced", color: "text-blue-400", badge: "advanced-badge" };
    if (progress >= 25) return { level: "Intermediate", color: "text-green-400", badge: "intermediate-badge" };
    return { level: "Rookie", color: "text-yellow-400", badge: "rookie-badge" };
  };

  // FETCH DATA WITH ERROR HANDLING
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        // Fetch chapters
        const chaptersRes = await fetch("http://localhost:8080/api/topics");
        if (!chaptersRes.ok) throw new Error("Failed to load topics");
        const chaptersData = await chaptersRes.json();
        setChapters(chaptersData.map(chapter => ({
          chapter: chapter.chapterTitle,
          topics: chapter.topics,
        })));
        setLoading(prev => ({ ...prev, chapters: false }));

        // Fetch user progress
        if (email) {
          const progressRes = await fetch(
            `http://localhost:8080/api/user-progress/${email}`
          );
          if (!progressRes.ok) throw new Error("Failed to fetch user progress");
          const progressData = await progressRes.json();

          const progress = Array.isArray(progressData)
            ? progressData.reduce((acc, topic) => {
              acc[topic.id] = topic.completed;
              return acc;
            }, {})
            : progressData;

          setTopicProgress(progress);
          setCompletedTopicsCount(
            Object.keys(progress).filter(id => progress[id]).length
          );
          setLoading(prev => ({ ...prev, progress: false }));
        }

        // Fetch quiz results
        if (email) {
          const quizzesRes = await fetch(
            `http://localhost:8080/api/quiz-results/${email}`
          );
          if (!quizzesRes.ok) throw new Error("Failed to fetch quiz results");
          const quizzesData = await quizzesRes.json();
          setQuizzes(quizzesData);
          setLoading(prev => ({ ...prev, quizzes: false }));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading({
          chapters: false,
          progress: false,
          quizzes: false
        });
      }
    };

    fetchData();
  }, [email]);

  // Animate scores
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedScores(
        quizzes.reduce((acc, quiz) => {
          acc[quiz._id] = quiz.score;
          return acc;
        }, {})
      );
    }, 100);
    return () => clearTimeout(timeout);
  }, [quizzes]);

  // Loading skeleton
  if (loading.chapters || loading.progress || loading.quizzes) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow p-6 animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 dark:bg-[#323232] rounded mb-4"></div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-[#323232] rounded mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-[#323232] rounded mb-2"></div>
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-[#323232] rounded mb-6"></div>
          <div className="h-10 w-1/4 bg-gray-200 dark:bg-[#323232] rounded"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#323232] rounded-xl shadow p-6 animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-[#323232] rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-[#323232] rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-[#323232] rounded-xl shadow p-6 animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-[#323232] rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-[#323232] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow p-6 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const achievementLevel = getAchievementLevel();
  const progressPercentage = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Achievement Summary Card */}
      <div className=" rounded-xl shadow overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
          <div className="md:flex-1 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiAward className="text-purple-500" /> Your Learning Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              You've completed {completedTopicsCount} of{" "}
              {chapters.reduce((total, chapter) => total + chapter.topics.length, 0)}{" "}
              topics across {chapters.length} chapters.
            </p>

            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {progressPercentage}%
                </span>
              </div>
              <ProgressBar percentage={progressPercentage} />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-gray-700 dark:text-gray-300">Level:</span>
              <span className={`font-semibold ${achievementLevel.color}`}>
                {achievementLevel.level}
              </span>
            </div>

            <Link
              to="/docs"
              className="mt-6 inline-flex items-center px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-purple-700 transition"
            >
              Continue Learning
              <FiBookOpen className="ml-2" />
            </Link>
          </div>

          <div className="flex justify-center md:block overflow-hidden rounded-[50%]">
            <Badge level={achievementLevel.level} />
          </div>
        </div>
      </div>

      {/* Progress Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Completed Topics */}
        <div className="bg-white dark:bg-[#262626] rounded-xl shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiCheckCircle className="dark:text-[#7C3AED]" /> Completed Topics
            </h2>

            {chapters.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                No chapters available
              </p>
            ) : (
              <div className="mt-4 space-y-6">
                {chapters.map((chapter) => {
                  const completedTopics = chapter.topics.filter(
                    (topic) => topicProgress[topic.id]
                  );

                  return (
                    completedTopics.length > 0 && (
                      <div key={chapter.chapter} className="space-y-2">
                        <h3 className="font-medium text-purple-600 dark:text-purple-400">
                          {chapter.chapter}
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          {completedTopics.map((topic) => (
                            <div
                              key={topic.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#7C3AED] rounded-lg break-all"
                            >
                              <FiCheckCircle size={20} className="dark:text-[#F3F4F6] flex-shrink-0" />
                              <span className="text-gray-800 dark:text-gray-200">
                                {topic.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })}

                {completedTopicsCount === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't completed any topics yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quiz Results */}
        <div className="bg-white dark:bg-[#262626] rounded-xl shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiBarChart2 className="text-blue-500" /> Quiz Results
            </h2>

            {quizzes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                No quiz results available
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {quizzes.map((quiz) => {
                  const chapterNumber = getChapterNumberFromQuizId(quiz.quizId);
                  const retakeUrl = chapterNumber
                    ? `/quizzes/${chapterNumber}`
                    : "/quizzes";
                  const scorePercentage = Math.round(quiz.score * 10);
                  const isPassing = scorePercentage >= 70;

                  return (
                    <div
                      key={quiz._id}
                      className="p-4 border-1 border-gray-200 dark:border-[#323232] rounded-lg transition "
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {formatQuizTitle(quiz.quizId)}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Score: {scorePercentage}%
                          </p>
                          <Link
                            to={retakeUrl}
                            className="mt-3 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                          >
                            Retake Quiz
                            <MdKeyboardArrowRight className="ml-1" />
                          </Link>
                        </div>
                        <div className="relative w-16 h-16">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <circle
                              className="dark:text-[#a5a5a5]"
                              strokeWidth="3"
                              stroke="currentColor"
                              fill="transparent"
                              r="15"
                              cx="18"
                              cy="18"
                            />
                            <circle
                              className={
                                isPassing ? "text-green-500" : "text-red-500"
                              }
                              strokeWidth="3"
                              stroke="currentColor"
                              strokeLinecap="round"
                              fill="transparent"
                              r="15"
                              cx="18"
                              cy="18"
                              strokeDasharray="100"
                              strokeDashoffset={100 - scorePercentage}
                              style={{ transition: "stroke-dashoffset 1s ease-out" }}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                            {scorePercentage}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAchievements;