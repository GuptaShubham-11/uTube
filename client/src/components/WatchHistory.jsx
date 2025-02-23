import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { userApi } from "../api/user.js";
import { Spinner } from ".";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await userApi.getWatchHistory("/api/v1/users/history");

      if (response.statusCode < 400) {
        setHistory(response?.message);
      } else {
        throw new Error("Failed to fetch watch history.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <History size={32} /> Watch History
      </h2>

      {loading && <Spinner />}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && history.length === 0 && (
        <p className="text-gray-500">No watch history available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {history.map((item) => (
          <div
            key={item?._id || item?.videoId}
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-md"
          >
            <img
              src={item?.thumbnail || "/default-thumbnail.jpg"}
              alt={item?.title || "No Title"}
              className="w-full h-40 object-cover rounded"
              loading="lazy"
            />
            <h3 className="mt-2 font-semibold text-lg text-gray-900 dark:text-white">
              {item?.title || "Untitled Video"}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
