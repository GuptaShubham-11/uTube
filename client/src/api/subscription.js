import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1/subscriptions`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to dynamically attach the token to each request
const dataa = apiClient.interceptors.request.use(
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

const toggleSubscribeButton = async (id) => {
  try {
    const response = await apiClient.post(`/c/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getSubscribedChannels = async (id) => {
  try {
    const response = await apiClient.get(`/c/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getChannelsSubscriber = async (id) => {
  try {
    const response = await apiClient.get(`/u/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const subscriptionApi = {
  toggleSubscribeButton,
  getSubscribedChannels,
  getChannelsSubscriber,
};
