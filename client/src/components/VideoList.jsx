import { useEffect, useState } from 'react';
import { Video, Edit, Trash, Save, X, Upload } from 'lucide-react';
import { dashboardApi } from '../api/dashboard.js';
import { Spinner, Alert, Button } from '.'; // Import Button Component
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setVideo } from '../features/videoSlice.js';
import { videoApi } from '../api/video.js';
import { all } from 'axios';

const VideoList = ({ channelId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isOwner = user?._id === channelId;

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await dashboardApi.getChannelVideos(channelId);
        setLoading(false);

        if (response.statusCode < 400) {
          setVideos(response.message);
          dispatch(setVideo({ allVideos: response.message }));
        } else {
          setAlert({ type: 'error', message: 'Failed to fetch videos.' });
        }
      } catch (error) {
        setLoading(false);
        setAlert({ type: 'error', message: error.message || 'Failed to fetch videos.' });
      }
    };
    fetchVideos();
  }, [channelId]);

  const handleVideoClick = (video) => {
    dispatch(setVideo({ video }));
    navigate(`/video`);
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await videoApi.deleteVideo(videoId);
      setVideos(videos.filter((video) => video._id !== videoId));
      setAlert({ type: 'success', message: 'Video deleted successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to delete video.' });
    }
  };

  const handleUpdateVideo = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editingVideo.title);
      formData.append('description', editingVideo.description);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      const response = await videoApi.updateVideo(editingVideo._id, formData);

      if (response.statusCode < 400) {
        setVideos(
          videos.map((v) =>
            v._id === editingVideo._id ? { ...editingVideo, thumbnail: response.thumbnailUrl } : v
          )
        );
        setEditingVideo(null);
        setAlert({ type: 'success', message: 'Video updated successfully!' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to update video.' });
    }
  };

  return (
    <div className="p-4">
      {alert && (
        <div className="fixed top-5 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}{' '}
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Video size={32} /> Videos
      </h2>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden 
                         transform transition duration-300 hover:scale-105"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => handleVideoClick(video)}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{video.views} views</p>
                {isOwner && (
                  <div className="flex justify-between mt-3">
                    <Button
                      size="icon"
                      onClick={() => setEditingVideo(video)}
                      className="bg-transparent"
                    >
                      <Edit size={18} className="text-blue-500" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => handleDeleteVideo(video._id)}
                      className="bg-transparent"
                    >
                      <Trash size={18} className="text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-2xl font-bold">No videos found 🫣.</p>
      )}
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">Edit Video</h3>
            <input
              type="text"
              value={editingVideo.title}
              onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              value={editingVideo.description}
              onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              placeholder="Description"
            ></textarea>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Upload New Thumbnail:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="w-full p-2 border rounded"
              />
              <Upload size={20} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setEditingVideo(null)} className="bg-transparent">
                <X size={20} className="text-red-500" />
              </Button>
              <Button onClick={handleUpdateVideo} disabled={loading} className="bg-transparent">
                {loading ? <Spinner /> : <Save size={20} className="text-green-500" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoList;
