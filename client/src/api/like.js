import apiClient from './apiClient.js';

const toggleVideoLike = async (videoId) => {
  try {
    const response = await apiClient.post(`/likes/toggle/v/${videoId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const toggleCommentLike = async (commentId) => {
  try {
    const response = await apiClient.post(`/likes/toggle/c/${commentId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const toggleTweetLike = async (tweetId) => {
  try {
    const response = await apiClient.post(`/likes/toggle/t/${tweetId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getLikedVideos = async () => {
  try {
    const response = await apiClient.get('/likes/videos');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const likeApi = {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
};
