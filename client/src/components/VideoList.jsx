import { useEffect, useState } from 'react';
import { Video } from 'lucide-react';
import { dashboardApi } from '../api/dashboard.js';
import { Spinner, Alert } from '.';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setVideo } from '../features/videoSlice.js';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await dashboardApi.getChannelVideos();
        setLoading(false);

        if (response.statusCode < 400) {
          setAlert({ type: 'success', message: 'Videos fetched successfully!' });
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
  }, []);

  const handleVideoClick = (video) => {
    // Handle video click event
    if (video) {
      console.log(video);
      dispatch(setVideo(video));
      navigate(`/video`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      {alert && (
        <div className="fixed top-25 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Video size={24} /> Videos
      </h2>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
              onClick={() => handleVideoClick(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold text-lg">{video.title}</h3>
              <p className="text-sm text-gray-600">{video.views} views</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-2xl font-bold">No videos found 🫣.</p>
      )}
    </div>
  );
};

export default VideoList;
