import { useEffect, useState } from 'react';
import { Video, Edit, Trash, Save, X, Upload } from 'lucide-react';
import { dashboardApi } from '../api/dashboard.js';
import { Spinner, Alert } from '.';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setVideo } from '../features/videoSlice.js';
import { videoApi } from '../api/video.js';

const VideoList = ({ channelId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await dashboardApi.getChannelVideos(channelId);
        console.log(response);

        setLoading(false);

        if (response.statusCode < 400) {
          setVideos(response.message);
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
    dispatch(setVideo({ video: video }));
    navigate(`/video`);
  };

  const handleEditClick = (video) => {
    setEditingVideo(video);
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
        setVideos(videos.map((v) => (v._id === editingVideo._id ? { ...editingVideo, thumbnail: response.thumbnailUrl } : v)));
        setEditingVideo(null);
        setAlert({ type: 'success', message: 'Video updated successfully!' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to update video.' });
    }
  };

  return (
    <div className="p-4">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Video size={32} /> Videos
      </h2>
      {loading ? (
        <div className="flex items-center justify-center h-screen"><Spinner /></div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover cursor-pointer" onClick={() => handleVideoClick(video)} />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{video.views} views</p>
                <div className="flex justify-between mt-3">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditClick(video)}><Edit size={18} /></button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteVideo(video._id)}><Trash size={18} /></button>
                </div>
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
            <input type="text" value={editingVideo.title} onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
            <textarea value={editingVideo.description} onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })} className="w-full p-2 border rounded mb-2" placeholder="Description"></textarea>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">Upload New Thumbnail:</label>
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} className="w-full p-2 border rounded" />
              <Upload size={20} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="text-gray-500" onClick={() => setEditingVideo(null)}><X size={20} /></button>
              <button className="text-green-500 hover:text-green-700" onClick={handleUpdateVideo}>
                {loading ? <Spinner /> : <Save size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoList;
