import { useEffect, useState } from 'react';
import { VideoCard } from '.';
import { videoApi } from '../api/video.js';

const SuggestedVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSuggestedVideos = async () => {
      try {
        const response = await videoApi.getSuggestedVideos();

        if (response.statusCode < 400) {
          setVideos(response?.message);
        }
      } catch (error) {
        return error.response.data;
      }
    };
    fetchSuggestedVideos();
  }, []);

  return (
    <div className="space-y-4">
      {videos?.length > 0 && videos.map((video) => <VideoCard video={video} />)}
    </div>
  );
};

export default SuggestedVideos;
