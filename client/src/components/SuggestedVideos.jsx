import { useEffect, useState } from 'react';
import { VideoCard } from '.';
import { videoApi } from '../api/video.js';

const SuggestedVideos = ({ currentVideoId }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSuggestedVideos = async () => {
      try {
        const response = await videoApi.getSuggestedVideos();

        if (response?.statusCode < 400) {
          // Filter out the currently playing video
          const filteredVideos = response.message.filter(
            (video) => video._id !== currentVideoId
          );
          setVideos(filteredVideos);
        }
      } catch (error) {
        console.error('Error fetching suggested videos:', error);
      }
    };

    fetchSuggestedVideos();
  }, [currentVideoId]); // Re-fetch suggestions when video changes

  return (
    <div className="space-y-4">
      {videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video._id} video={video} />)
      ) : (
        <p className="text-gray-500">No suggested videos available.</p>
      )}
    </div>
  );
};

export default SuggestedVideos;
