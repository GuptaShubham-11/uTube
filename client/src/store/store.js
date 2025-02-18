import { configureStore } from '@reduxjs/toolkit';
import themeSlice from '../features/themeSlice.js';
import authSlice from '../features/authSlice.js';
import videoSlice from '../features/videoSlice.js';

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    video: videoSlice,
  },
});
