import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1/comments`,
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

const addComment = async (videoId, userId, content) => {
  try {
    const response = await apiClient.post(`/${videoId}/${userId}`, { content });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateComment = async (commentId, content) => {
  try {
    const response = await apiClient.patch(`/c/${commentId}`, { content });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/c/${commentId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getAllVideoComments = async (videoId) => {
  try {
    const response = await apiClient.get(`/${videoId}`);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const commentApi = {
  addComment,
  updateComment,
  deleteComment,
  getAllVideoComments,
};
