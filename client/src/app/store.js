import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/userSlice';
import ratingReducer from '../features/ratings/ratingsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    ratings: ratingReducer
  },
});
