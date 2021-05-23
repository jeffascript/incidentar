import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slice";
import allUsersReducer from "./allUsers.slice";
import allPostsReducer from "./posts.slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    allPosts: allPostsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
