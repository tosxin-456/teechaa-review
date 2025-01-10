import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import quizReducer from "./slices/quizSlice";

const persistConfig = {
    key: "quiz", 
    storage,
};

const persistedReducer = persistReducer(persistConfig, quizReducer);

export const store = configureStore({
    reducer: {
        quiz: persistedReducer,
    },
});

export const persistor = persistStore(store);
