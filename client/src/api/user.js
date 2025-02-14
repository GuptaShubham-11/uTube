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

export const userApi = {
  signUp,
  login,
};
