import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Quiz from '../components/Quiz';
const QuizPage = () => {

    const { chapterId } = useParams();
    const navigate = useNavigate();
    return (
        <div className="p-4">
            <button onClick={() => navigate(-1)} className="mb-4 text-black text-xl bg-white py-1 px-4 ">← Back</button>
            <Quiz chapterId={chapterId} /* chapterIndex={parseInt(chapterId) - 1} onBack={() => navigate("/quizzes")} */ />
        </div>
    )
}

export default QuizPage
