import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // Enable serializable check in development only
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: process.env.NODE_ENV !== 'production',
  }),
});