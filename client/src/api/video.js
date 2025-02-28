import apiClient from './apiClient.js';

const uploadVideo = async (data) => {
  try {
    const response = await apiClient.post('/videos/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateVideo = async (videoId, data) => {
  try {
    const response = await apiClient.patch(`/videos/${videoId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const deleteVideo = async (videoId) => {
  try {
    const response = await apiClient.delete(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getSuggestedVideos = async () => {
  try {
    const response = await apiClient.get('/videos/suggested-videos');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getAllVideos = async ({
  page = 1,
  limit = 10,
  query = '',
  sortBy = 'createdAt',
  sortType = 'desc',
  userId = '',
}) => {
  try {
    const response = await apiClient.get('', {
      params: { page, limit, query, sortBy, sortType, userId },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const updateVideoViews = async (videoId) => {
  try {
    const response = await apiClient.patch(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const videoApi = {
  uploadVideo,
  updateVideo,
  deleteVideo,
  getSuggestedVideos,
  getAllVideos,
  updateVideoViews,
};
