import apiClient from './apiClient.js';

const toggleSubscribeButton = async (id) => {
  try {
    const response = await apiClient.post(`/subscriptions/c/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getSubscribedChannels = async (id) => {
  try {
    const response = await apiClient.get(`/subscriptions/c/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getChannelsSubscriber = async (id) => {
  try {
    const response = await apiClient.get(`/subscriptions/u/${id}`);
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
