import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./QuizSlice";

export const store = configureStore({
    reducer: {
        quiz: quizReducer,
    },
});
