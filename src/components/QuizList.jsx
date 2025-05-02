import React from 'react'
import topics from "../../public/topics.json"
const QuizList = ({ onSelect }) => {
    return (
        <div className="quiz-list">
            <h2>Select a Chapter Quiz</h2>
            {topics.map((chapter, index) => (
                <button key={index} onClick={() => onSelect(index)}>
                    {chapter.chapter}
                </button>
            ))}
        </div>
    )
}

export default QuizList
