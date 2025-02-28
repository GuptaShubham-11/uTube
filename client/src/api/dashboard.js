import apiClient from './apiClient.js';

const getChannelVideos = async (channelId) => {
  try {
    const response = await apiClient.get(`/dashboard/videos/${channelId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const dashboardApi = {
  getChannelVideos,
};
