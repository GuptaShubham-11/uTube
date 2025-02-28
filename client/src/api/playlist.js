import apiClient from './apiClient.js';

const createPlaylist = async (id, data) => {
  try {
    const response = await apiClient.post(`/playlist/${id}`, data);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getAllPlaylist = async (id) => {
  try {
    const response = await apiClient.get(`/playlist/user/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getPlaylistById = async (id) => {
  try {
    const response = await apiClient.get(`/playlist/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const deletePlaylist = async (id) => {
  try {
    const response = await apiClient.delete(`/playlist/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updatePlaylist = async (id, data) => {
  try {
    const response = await apiClient.patch(`/playlist/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const addVideoToPlaylist = async (playlistId, videoId) => {
  try {
    const response = await apiClient.patch(`/playlist/add/${videoId}/${playlistId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const removeVideoFromPlaylist = async (playlistId, videoId) => {
  try {
    const response = await apiClient.patch(`/playlist/remove/${videoId}/${playlistId}`);
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
