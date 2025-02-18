import React from 'react';
import { History } from 'lucide-react';

const WatchHistory = ({ history = [] }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <History size={24} /> Watch History
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {history.map((item) => (
          <div key={item.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-2 font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600">Watched on: {item.watchedAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
