import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1/likes`,
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

const toggleVideoLike = async (videoId) => {
  try {
    const response = await apiClient.post(`/toggle/v/${videoId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const toggleCommentLike = async (commentId) => {
  try {
    const response = await apiClient.post(`/toggle/c/${commentId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const toggleTweetLike = async (tweetId) => {
  try {
    const response = await apiClient.post(`/toggle/t/${tweetId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getLikedVideos = async () => {
  try {
    const response = await apiClient.get('/videos');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const likeApi = {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
};
