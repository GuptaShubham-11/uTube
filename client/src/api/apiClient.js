import axios from 'axios';
import { store } from '../store/store.js';
import { logout, login } from '../features/authSlice.js';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor: Add access token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: Handle token expiration & refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status >= 400 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken =
          localStorage.getItem('refreshToken') || store.getState().auth?.refreshToken;
        if (!refreshToken) {
          console.error('[REFRESH TOKEN MISSING] Redirecting to login.');
          store.dispatch(logout());
          window.location.href = '/login'; // Redirect to login page
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/users/refresh-token`,
          { refreshToken: refreshToken },
          { withCredentials: true }
        );

        // ✅ Update Redux store with new token
        store.dispatch(
          login({
            user: store.getState().auth.user,
            accessToken: refreshResponse.data.accessToken,
            refreshToken: refreshResponse.data.refreshToken,
          })
        );

        // ✅ Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
