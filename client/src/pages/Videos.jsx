import { VideoCard, Alert, Spinner } from '../components';
import { videoApi } from '../api/video.js';
import { useEffect, useState, useCallback } from 'react';

export default function Videos() {
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchAllVideos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await videoApi.getAllVideos({});
      setLoading(false);

      if (response.statusCode < 400 && response?.message?.videos) {
        setVideos(response.message.videos);
      } else {
        setVideos([]); // Ensure it's an empty array if no videos exist
      }
    } catch (error) {
      setLoading(false);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to fetch videos!',
      });
    }
  }, []);

  useEffect(() => {
    fetchAllVideos();
  }, [fetchAllVideos]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Spinner size={26} />
        <p className="mt-2 text-gray-500">Fetching videos...</p>
      </div>
    );
  }

  return (
    <section className="p-4 max-w-6xl mx-auto mt-16">
      {alert && (
        <div className="fixed top-10 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-4">
        Recommended Videos
      </h2>

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No videos available.</p>
      )}
    </section>
  );
}
