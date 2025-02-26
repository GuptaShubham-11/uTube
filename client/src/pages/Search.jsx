import { useState, useEffect, useCallback } from 'react';
import { Search, Loader, Frown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { videoApi } from '../api/video.js';
import debounce from 'lodash.debounce';
import { Alert } from '../components';
import { useDispatch } from 'react-redux';
import { setVideo } from '../features/videoSlice.js';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const dispatch = useDispatch();

  const fetchVideos = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) return;
    setLoading(true);
    try {
      const response = await videoApi.getAllVideos({ query: searchQuery });
      setLoading(false);
      if (response.statusCode < 400) {
        setVideos(response?.message?.videos);
      }
    } catch (error) {
      setLoading(false);
      setAlert({ type: 'error', message: 'Failed to fetch videos!' });
    }
  };

  const debouncedFetch = useCallback(debounce(fetchVideos, 500), []);

  useEffect(() => {
    debouncedFetch(query);
  }, [query, debouncedFetch]);

  return (
    <div className="mt-16 min-h-screen p-6 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <div className="max-w-3xl mx-auto">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-4 text-gray-500 dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for videos..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 text-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Video Results */}
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center">
              <Loader
                className="animate-spin text-primary-light dark:text-primary-dark"
                size={32}
              />
            </div>
          ) : videos.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {videos.map((video) => (
                <Link to={`/video`} key={video.id}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg transition"
                    onClick={() => dispatch(setVideo({ video: video }))}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h2 className="text-lg font-semibold">{video.title}</h2>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ) : query.length >= 3 ? (
            <div className="flex flex-col items-center mt-6">
              <Frown size={50} className="text-gray-500 dark:text-gray-400" />
              <p className="text-lg mt-2">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
