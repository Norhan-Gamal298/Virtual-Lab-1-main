import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Quiz from "../components/Quiz";

const QuizPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="
                    mb-4
                    text-[color:var(--color-text-primary)]
                    dark:text-[color:var(--color-dark-text-primary)]
                    bg-[color:var(--color-bg-default)]
                    dark:bg-[color:var(--color-dark-bg-subtle)]
                    py-2 px-3 rounded-lg
                    flex items-center gap-2 shadow
                    hover:bg-[color:var(--color-state-hover)]
                    dark:hover:bg-[color:var(--color-dark-state-hover)]
                    transition
                "
      >
        <FiArrowLeft className="text-2xl" />
        <span className="hidden sm:inline">Back</span>
      </button>
      <Quiz chapterId={chapterId} />
    </div>
  );
};

export default QuizPage;
