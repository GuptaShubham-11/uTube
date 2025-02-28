import apiClient from './apiClient.js';

const addComment = async (videoId, userId, content) => {
  try {
    const response = await apiClient.post(`/comments/${videoId}/${userId}`, { content });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateComment = async (commentId, content) => {
  try {
    const response = await apiClient.patch(`/comments/c/${commentId}`, { content });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/comments/c/${commentId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getAllVideoComments = async (videoId) => {
  try {
    const response = await apiClient.get(`/comments/${videoId}`);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const commentApi = {
  addComment,
  updateComment,
  deleteComment,
  getAllVideoComments,
};
