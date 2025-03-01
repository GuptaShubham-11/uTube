import { createSlice } from '@reduxjs/toolkit';

const initialStatus = {
  user: localStorage.getItem('user') || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialStatus,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
  },
});

export const { login, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
