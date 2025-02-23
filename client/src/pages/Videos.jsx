import { VideoCard, Alert, Spinner } from '../components';
import { videoApi } from '../api/video.js';
import { useEffect, useState } from 'react';


export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchAllVideos = async () => {
    setLoading(true);
    try {
      const response = await videoApi.getAllVideos({});
      console.log(response);
      setLoading(false);

      if (response.statusCode < 400) {
        setVideos(response?.message?.videos);
      }
    } catch (error) {
      setLoading(false);
      setAlert({
        type: 'error',
        message: error.message || 'Videos fetch failed!',
      });
    }
  }

  useEffect(() => {
    fetchAllVideos();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={26} />
      </div>
    );
  }

  return (
    <section className="p-4 max-w-6xl mx-auto mt-16">
      {alert && (
        <div className="fixed top-5 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-4">
        Recommended Videos
      </h2>

      {/* Masonry Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  );
}
