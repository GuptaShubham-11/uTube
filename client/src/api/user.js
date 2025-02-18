import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const signUp = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/users/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const login = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/users/login', data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const logout = async () => {
  try {
    const response = await apiClient.post('/api/v1/users/logout');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateFullname = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await apiClient.patch('/api/v1/users/update-user-details', data, {
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
    const response = await apiClient.patch('/api/v1/users/update-user-avatar', data, {
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
    const response = await apiClient.patch('/api/v1/users/update-user-cover', data, {
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
    const response = await apiClient.get(`/api/v1/users/c/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const userApi = {
  signUp,
  login,
  logout,
  getUserChannelProfile,
  updateFullname,
  updateAvatar,
  updateCoverImage,
};
