import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import repositoriesReducer from "./repositoriesSlice";
import aiCommentsReducer from "./aiCommentsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    repositories: repositoriesReducer,
    aiComments: aiCommentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
