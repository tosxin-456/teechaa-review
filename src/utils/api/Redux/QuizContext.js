import { createContext, useContext, useState } from "react";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [quizData, setQuizData] = useState([]);

    return (
        <QuizContext.Provider value={{ quizData, setQuizData }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);
