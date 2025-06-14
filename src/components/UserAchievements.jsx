import React, { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import rookieBadge from "../assets/rookie-badge.jpg";
import { Link } from "react-router-dom";


const UserAchievements = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [animatedScores, setAnimatedScores] = useState({});
  const [chapters, setChapters] = useState([]);
  const [topicProgress, setTopicProgress] = useState({});
  const [completedTopicsCount, setCompletedTopicsCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  // FETCH CHAPTERS AND TOPICS DYNAMICALLY FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:8080/api/topics")
      .then((res) => res.json())
      .then((data) => {
        // Re-map the API response to match expected format
        const formattedChapters = data.map((chapter) => ({
          chapter: chapter.chapterTitle,
          topics: chapter.topics,
        }));
        setChapters(formattedChapters);
      })
      .catch((err) => console.error("Failed to load topics:", err));
  }, []);

  // FETCH USER PROGRESS
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        if (!email) throw new Error("Email is missing");
        const response = await fetch(
          `http://localhost:8080/api/user-progress/${email}`
        );
        if (!response.ok) throw new Error("Failed to fetch user progress");

        const data = await response.json();
        const progress = Array.isArray(data)
          ? data.reduce((acc, topic) => {
            acc[topic.id] = topic.completed;
            return acc;
          }, {})
          : data;

        setTopicProgress(progress);
        setCompletedTopicsCount(
          Object.keys(progress).filter((id) => progress[id]).length
        );
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    if (email) {
      fetchUserProgress();
    }
  }, [email]);

  // FETCH QUIZ RESULTS
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/quiz-results/${email}`
        );
        if (!response.ok) throw new Error("Failed to fetch quiz results");

        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    if (email) {
      fetchQuizResults();
    }
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

  return (
    <div className="flex flex-col py-4">
      {/* Achievements Card */}
      <div className="userAchievements bg-[#1a1a1a] p-6 w-200 text-white flex h-[max-content] items-center gap-[1rem] justify-between rounded-[20px]">
        <div className="learnProgressSection w-[80%] p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Your Achievements</h2>
          <p className="text-sm mt-1 text-gray-400">
            Completed {completedTopicsCount} topics across{" "}
            {chapters.reduce(
              (total, chapter) => total + chapter.topics.length,
              0
            )}{" "}
            topics
          </p>

          <div className="relative w-[80%] bg-gray-700 h-[20px] rounded-full mt-2">
            <div
              className="absolute top-0 left-0 h-[20px] bg-purple-500 rounded-full"
              style={{
                width: `${(Object.keys(topicProgress).filter((id) => topicProgress[id])
                  .length /
                  chapters.reduce(
                    (total, chapter) => total + chapter.topics.length,
                    0
                  )) *
                  100 || 0
                  }%`,
              }}
            ></div>
          </div>

          <p className="mt-3">
            You're <span className="font-bold text-yellow-400">Rookie</span> now
          </p>

          <Link
            to="/docs/chapter_1_1_what_is_image_processing"
            className="mt-4 flex items-center gap-2 px-4 py-2 border-3 border-[#252525] rounded-lg hover:bg-gray-700 transition"
          >
            Continue learning <MdKeyboardArrowRight size={20} />
          </Link>
        </div>

        <div className="achievementUserBadge">
          <div className="userBadge relative">
            <img
              className="achievementBadge"
              src={rookieBadge}
              alt="User Badge"
            />
          </div>
        </div>
      </div>

      {/* Completed Topics */}
      <div className="progressCard mt-6 bg-[#1a1a1a] p-6 rounded-[20px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Completed Topics</h2>
        {chapters.map((chapter) => {
          const completedTopics = chapter.topics.filter(
            (topic) => topicProgress[topic.id]
          );

          return (
            completedTopics.length > 0 && (
              <div key={chapter.chapter} className="mb-4">
                <h3 className="font-medium mb-2 text-purple-400">
                  {chapter.chapter}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {completedTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center gap-2 text-sm p-2 bg-gray-800 rounded"
                    >
                      <FiCheckCircle className="text-green-500 shrink-0" />
                      <span className="truncate">{topic.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          );
        })}

        {!user && (
          <div className="text-gray-400 text-sm mt-4">
            Sign in to track your learning progress
          </div>
        )}
      </div>

      {/* Solved Quizzes */}
      <div className="quizzesCard mt-6 bg-[#1a1a1a] p-6 rounded-[20px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Solved Quizzes</h2>
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="quiz-item border-1 border-[#393939] p-7 rounded-lg flex justify-between items-center mb-4"
          >
            <div>
              <h3 className="font-bold text-[1.3rem]">{quiz.quizId}</h3>
              <p className="text-[#878787] py-1">
                You got {quiz.score * 10}% correct
              </p>
              <button className="mt-2 px-4 py-2 border-3 border-[#252525] text-sm rounded-md hover:bg-gray-700 flex items-center gap-2">
                Review your answers
                <MdKeyboardArrowRight />
              </button>
            </div>

            <div className="relative w-30 h-30">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle
                  className="text-gray-700"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="16"
                  cx="18"
                  cy="18"
                ></circle>
                <circle
                  className={
                    quiz.score * 10 > 50 ? "text-green-500" : "text-red-500"
                  }
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="16"
                  cx="18"
                  cy="18"
                  strokeDasharray="100"
                  strokeDashoffset={100 - (animatedScores[quiz._id] * 10 || 0)}
                  style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
                ></circle>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[24px] font-bold">
                {quiz.score * 10}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAchievements;
