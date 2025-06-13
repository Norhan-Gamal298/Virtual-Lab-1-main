import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function QuizListPage() {
  const [chapters, setChapters] = useState([]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/quizzes")
      .then((res) => res.json())
      .then((data) => {
        // Group by chapterId and limit to 10 questions per chapter
        const chapterMap = {};
        data.forEach((q) => {
          if (!chapterMap[q.chapterId]) {
            chapterMap[q.chapterId] = { chapterId: q.chapterId, questions: [] };
          }
          if (chapterMap[q.chapterId].questions.length < 10) {
            chapterMap[q.chapterId].questions.push(q);
          }
        });
        setChapters(Object.values(chapterMap));
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-dark-bg-default dark:to-dark-bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/20">
          {/* Header with decorative elements */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-purple-500 p-8 text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/30 dark:bg-white/20"></div>
              <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-white/20 dark:bg-white/10"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white relative z-10">
              🧠 Knowledge Challenge
            </h2>
            <p className="mt-3 text-indigo-100 dark:text-blue-100 text-lg relative z-10">
              Test your understanding with interactive quizzes
            </p>
          </div>

          {/* Quiz cards grid */}
          <div className="p-8">
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {chapters.map((chapter, index) => (
                <motion.li
                  key={chapter.chapterId}
                  variants={item}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={`/quizzes/${chapter.chapterId}`}
                    className="block h-full bg-white dark:bg-gray-900 hover:bg-gradient-to-br from-white to-indigo-50 dark:hover:from-gray-900 dark:hover:to-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 text-center shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-indigo-100 dark:bg-blue-900/50 group-hover:bg-indigo-200 dark:group-hover:bg-blue-800/60 rounded-full transition-colors duration-300">
                      <span className="text-2xl text-gray-800 dark:text-blue-200 font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      Chapter {chapter.chapterId}
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                      {chapter.questions.length} questions
                    </p>
                    <div className="mt-4 text-indigo-600 dark:text-blue-400 font-medium flex items-center justify-center group-hover:text-indigo-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      Start Quiz
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Footer section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 border-t border-gray-100 dark:border-gray-700 rounded-b-2xl text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Select a quiz to test your knowledge. Each quiz contains multiple
              choice questions.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
