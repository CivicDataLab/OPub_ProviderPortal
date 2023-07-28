import { configureStore } from '@reduxjs/toolkit';
import addDatasetReducer from 'slices/addDatasetSlice';

export const dataStore = configureStore({
  reducer: {
    addDataset: addDatasetReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof dataStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof dataStore.dispatch;
