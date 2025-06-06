import React, { useState } from "react";

const QuizResult = ({ questions, userAnswers, onBack }) => {
    const [selectedAnswers, setSelectedAnswers] = useState(
        userAnswers.map(() => null) // Initialize an array to track selected answers for each question
    );

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        const updatedSelectedAnswers = [...selectedAnswers];
        updatedSelectedAnswers[questionIndex] = answerIndex;
        setSelectedAnswers(updatedSelectedAnswers);
    };

    const score = questions.reduce((acc, q, i) => {
        return acc + (q.correctAnswer === userAnswers[i] ? 1 : 0);
    }, 0);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Your Score: {score} / {questions.length}</h2>
            {questions.map((q, i) => (
                <div key={i} className="mb-6">
                    <p className="font-semibold mb-2">
                        <strong>Q{i + 1}:</strong> {q.question}
                    </p>

                    <ul className="space-y-2">
                        {q.options.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleAnswerSelect(i, index)}
                                className={`cursor-pointer p-4 rounded-lg transition-colors ${selectedAnswers[i] === index
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-100 hover:bg-indigo-200"
                                    }`}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-2">
                        <p>
                            <strong>Your Answer:</strong> {q.options[userAnswers[i]] || "No Answer"}
                        </p>
                        <p>
                            <strong>Correct Answer:</strong> {q.options[q.correctAnswer]}
                        </p>
                    </div>
                </div>
            ))}
            <button
                onClick={onBack}
                className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
                Back to Quizzes
            </button>
        </div>
    );
};

export default QuizResult;
