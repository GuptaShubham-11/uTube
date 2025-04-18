import apiClient from './apiClient.js';

const wakeUpServer = async () => {
  try {
    const response = await apiClient.get('/users/wakeup');
    return response.data;
  } catch (error) {
    return error.response?.data || { message: 'An error occurred' };
  }
};

const signUp = async (data) => {
  try {
    const response = await apiClient.post('/users/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: 'An error occurred' };
  }
};

const login = async (data) => {
  try {
    const response = await apiClient.post('/users/login', data);
    return response.data;
  } catch (error) {
    return error.response?.data || { message: 'An error occurred' };
  }
};

const logout = async () => {
  try {
    const response = await apiClient.post('/users/logout');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const refreshAccessToken = async (token) => {
  try {
    const response = await apiClient.post('/users/refresh-token', token);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateFullname = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await apiClient.patch('/users/update-user-details', data, {
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
    const response = await apiClient.patch('/users/update-user-avatar', data, {
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
    const response = await apiClient.patch('/users/update-user-cover', data, {
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
    const response = await apiClient.get(`/users/c/${id}`, {
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
    const response = await apiClient.get('/users/history', {
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
    const response = await apiClient.post(`/users/update-history/${id}`, {
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
    const response = await apiClient.get('/users/current-user');
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
  wakeUpServer
};
