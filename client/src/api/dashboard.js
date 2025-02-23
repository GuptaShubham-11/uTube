import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to dynamically attach the token to each request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token if it exists
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getChannelVideos = async (channelId) => {
  try {
    const response = await apiClient.get(`/api/v1/dashboard/videos/${channelId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const dashboardApi = {
  getChannelVideos,
};
