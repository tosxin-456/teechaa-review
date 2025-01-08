// redux/slices/quizSlice.js
import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
    name: "quiz",
    initialState: {
        currentQuestionIndex: 0,
        selectedAnswers: {},
        timeLeft: 0,
        selectedSubject: "",
        quizData: [],
    },
    reducers: {
        setQuizData: (state, action) => {
            state.quizData = action.payload;
        },
        selectAnswer: (state, { payload: { subject, questionIndex, option } }) => {
            if (!state.selectedAnswers[subject]) {
                state.selectedAnswers[subject] = {};
            }
            state.selectedAnswers[subject][questionIndex] = option;
        },
        nextQuestion: (state) => {
            state.currentQuestionIndex += 1;
        },
        setTimeLeft: (state, action) => {
            state.timeLeft = action.payload;
        },
        setSubject: (state, action) => {
            state.selectedSubject = action.payload;
            state.currentQuestionIndex = 0;
        },
    },
});

export const {
    setQuizData,
    selectAnswer,
    nextQuestion,
    setTimeLeft,
    setSubject,
} = quizSlice.actions;

export default quizSlice.reducer;
