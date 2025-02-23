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

const uploadVideo = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/videos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateVideo = async (videoId, data) => {
  try {
    const response = await apiClient.patch(`/api/v1/videos/${videoId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const deleteVideo = async (videoId) => {
  try {
    const response = await apiClient.delete(`/api/v1/videos/${videoId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getSuggestedVideos = async () => {
  try {
    const response = await apiClient.get('/api/v1/videos/suggested-videos');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getAllVideos = async ({ page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId = "" }) => {
  try {
    const response = await apiClient.get("/api/v1/videos", {
      params: { page, limit, query, sortBy, sortType, userId },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateVideoViews = async (videoId) => {
  try {
    const response = await apiClient.patch(`/api/v1/videos/${videoId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export const videoApi = {
  uploadVideo,
  updateVideo,
  deleteVideo,
  getSuggestedVideos,
  getAllVideos,
  updateVideoViews
};
