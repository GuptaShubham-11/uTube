import { configureStore } from '@reduxjs/toolkit';
import themeSlice from '../features/themeSlice.js';
import authSlice from '../features/authSlice.js';

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
  },
});
