import React from "react";
import { Link } from "react-router-dom";
import topics from "../../public/topics.json";

const QuizListPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
                    🧠 Choose a Quiz
                </h2>

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {topics.map((topic, index) => (
                        <li key={index}>
                            <Link
                                to={`/quizzes/${index + 1}`}
                                className="block bg-indigo-100 hover:bg-indigo-200 transition rounded-lg p-6 text-center shadow-sm"
                            >
                                <span className="text-xl font-semibold text-indigo-800">
                                    {topic.chapter}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QuizListPage;
