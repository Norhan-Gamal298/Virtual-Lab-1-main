import React, { useState } from "react";

const QuestionCard = ({ question, onCorrect, showAnswer, onShowAnswer }) => {
    const [selected, setSelected] = useState(null);
    const [feedback, setFeedback] = useState("");

    const handleAnswer = (option) => {
        setSelected(option);
        if (option === question.correctAnswer) {
            setFeedback("Correct! ✅");
            setTimeout(() => {
                setFeedback("");
                setSelected(null);
                onCorrect();
            }, 1000);
        } else {
            setFeedback("Incorrect ❌. Try again or reveal the answer.");
        }
    };

    return (
        <div className="question-card">
            <h2>{question.question}</h2>
            <div className="options">
                {question.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(option)}
                        className={selected === option ? "selected" : ""}
                        disabled={selected && selected === question.correctAnswer}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <p className="feedback">{feedback}</p>
            {showAnswer && (
                <p className="correct-answer">Answer: {question.correctAnswer}</p>
            )}
            {!showAnswer && (
                <button className="reveal" onClick={onShowAnswer}>
                    Show Correct Answer
                </button>
            )}
        </div>
    );
};

export default QuestionCard;
