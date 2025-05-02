import { useState, useEffect } from "react";
// import questionsData from "../../public/quizzes/chapter1.json";

const Quiz = ({ chapterId }) => {
    // State to hold the quiz questions
    const [questions, setQuestions] = useState([]);
    // State to track the current question index
    const [current, setCurrent] = useState(0);
    // State to store user's selected answers
    const [userAnswers, setUserAnswers] = useState([]);
    // State to indicate whether the quiz has been submitted
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Retrieve user data (specifically email) from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email; // Safe access in case user is null

    useEffect(() => {
        // Fetch questions when the component mounts or when chapterId changes
        const fetchQuestions = async () => {
            try {
                // Fetch the quiz questions JSON file based on the chapterId
                const response = await fetch(`/quizzes/chapter${chapterId}.json`);

                if (!response.ok) throw new Error('Failed to fetch questions');

                const data = await response.json();

                // Shuffle the questions randomly and pick the first 10
                const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);

                setQuestions(shuffled); // Set the fetched and shuffled questions

            } catch (error) {
                console.error('Error loading quiz:', error);
                setQuestions([]); // Set empty if error occurs
            }
        };

        fetchQuestions();
    }, [chapterId]); // Depend on chapterId

    // Handle selecting an answer for the current question
    const handleAnswer = (option) => {
        if (isSubmitted) return; // Prevent changing answers after submission
        const updated = [...userAnswers];
        updated[current] = option; // Update the selected answer
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

    // Handle submitting the quiz
    const submitQuiz = async () => {
        setIsSubmitted(true); // Prevent further answer changes after submission
        
        const score = getScore(); // Calculate the score
        
        // Prepare result data to send to the server
        const resultData = {
            email, // Taken from localStorage
            quizId: `chapter${chapterId}`, // Which chapter's quiz
            score,
            totalQuestions: questions.length,
        };
        
        console.log("Sending quiz result to backend:", resultData);

        try {
            // Send the quiz result to the server (localhost API)
            const response = await fetch("http://localhost:8080/api/quiz-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resultData),
            });

            if (response.ok) {
                console.log("Quiz result saved successfully");
            } else {
                const errorText = await response.text();
                console.error("Failed to save quiz result:", errorText);
            }
        } catch (error) {
            console.error("Error while saving quiz result:", error);
        }
    };
        
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Quiz Title */}
            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
                🧠 Chapter 1 Quiz
            </h2>

            {/* Display quiz only if questions are loaded */}
            {questions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
                    {/* Question Tracker */}
                    <div className="mb-4 text-gray-700 font-semibold">
                        Question {current + 1} of {questions.length}
                    </div>

                    {/* Current Question */}
                    <h3 className="text-xl font-semibold mb-6 text-gray-900">
                        {questions[current].question}
                    </h3>

                    {/* Answer Options */}
                    <div className="space-y-3">
                        {questions[current].options.map((option, idx) => {
                            const selectedAnswer = userAnswers[current];
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === questions[current].answer;
                            const isUnanswered = selectedAnswer === undefined;

                            // Style the answer buttons based on their state
                            let optionClass = "bg-gray-50 hover:bg-gray-100 border-gray-300";

                            if (isSubmitted) {
                                // After submission
                                if (isCorrect) {
                                    optionClass =
                                        "bg-green-100 border-green-400 text-green-800"; // Correct answer
                                } else if (isSelected || isUnanswered) {
                                    optionClass =
                                        "bg-red-100 border-red-400 text-red-800"; // Wrong or unanswered
                                } else {
                                    optionClass = "bg-gray-100 border-gray-300"; // Neutral
                                }
                            } else if (isSelected) {
                                // While answering
                                optionClass =
                                    "bg-blue-100 border-blue-400 text-blue-800";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border text-black transition-colors ${optionClass}`}
                                    disabled={isSubmitted} // Disable buttons after submit
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex justify-between items-center">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
                            onClick={handlePrev}
                            disabled={current === 0} // Disable Prev on first question
                        >
                            ← Previous
                        </button>

                        {isSubmitted ? (
                            // After submission, show the final score
                            <div className="text-lg font-bold text-indigo-700">
                                ✅ Score: {getScore()} / {questions.length}
                            </div>
                        ) : current === questions.length - 1 ? (
                            // If on last question, show submit button
                            <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                onClick={submitQuiz}
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            // Otherwise show Next button
                            <button
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                onClick={handleNext}
                            >
                                Next →
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
