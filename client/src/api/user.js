import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const signUp = async (data) => {
  try {
    const response = await apiClient.post('/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const login = async (data) => {
  try {
    const response = await apiClient.post('/login', data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const logout = async () => {
  try {
    const response = await apiClient.post('/logout');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const refreshAccessToken = async (token) => {
  try {
    const response = await apiClient.post('/refresh-token', token);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateFullname = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await apiClient.patch('/update-user-details', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateAvatar = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await apiClient.patch('/update-user-avatar', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateCoverImage = async (data) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await apiClient.patch('/update-user-cover', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getUserChannelProfile = async (id) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await apiClient.get(`/c/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getWatchHistory = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await apiClient.get('/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateWatchHistory = async (id) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await apiClient.post(`/update-history/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/current-user');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const userApi = {
  signUp,
  login,
  logout,
  refreshAccessToken,
  getUserChannelProfile,
  updateFullname,
  updateAvatar,
  updateCoverImage,
  getWatchHistory,
  updateWatchHistory,
  getCurrentUser,
};
