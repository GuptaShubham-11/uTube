import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.BASE_URL}/api/v1/playlist`,
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

const createPlaylist = async (id, data) => {
  try {
    const response = await apiClient.post(`/${id}`, data);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getAllPlaylist = async (id) => {
  try {
    const response = await apiClient.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getPlaylistById = async (id) => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const deletePlaylist = async (id) => {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updatePlaylist = async (id, data) => {
  try {
    const response = await apiClient.patch(`/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const addVideoToPlaylist = async (playlistId, videoId) => {
  try {
    const response = await apiClient.patch(`/add/${videoId}/${playlistId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const removeVideoFromPlaylist = async (playlistId, videoId) => {
  try {
    const response = await apiClient.patch(`/remove/${videoId}/${playlistId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const playlistApi = {
  createPlaylist,
  getAllPlaylist,
  deletePlaylist,
  updatePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistById,
};
