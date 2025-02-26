import { useEffect, useState, useCallback } from 'react';
import { VideoCard } from '.';
import { videoApi } from '../api/video.js';

const SuggestedVideos = ({ currentVideoId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch suggested videos
  const fetchSuggestedVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await videoApi.getSuggestedVideos();
      if (response?.statusCode < 400) {
        // Filter out the currently playing video
        setVideos(response.message.filter((video) => video._id !== currentVideoId));
      } else {
        setError('Failed to load suggestions.');
      }
    } catch (err) {
      console.error('Error fetching suggested videos:', err);
      setError('An error occurred while fetching videos.');
    }
    setLoading(false);
  }, [currentVideoId]);

  useEffect(() => {
    fetchSuggestedVideos();
  }, [fetchSuggestedVideos]);

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-500">Loading suggested videos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video._id} video={video} />)
      ) : (
        <p className="text-gray-500">No suggested videos available.</p>
      )}
    </div>
  );
};

export default SuggestedVideos;
