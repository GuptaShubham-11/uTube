import { useState } from 'react';
import { PlaySquare, Check, PlusCircle, UserRound } from 'lucide-react';

const channelData = {
  name: 'Tech Savvy',
  profileImage: 'https://source.unsplash.com/100x100/?person',
  bannerImage: 'https://source.unsplash.com/1200x400/?technology',
  subscribers: 250000,
  videos: [
    {
      id: 1,
      title: 'JavaScript for Beginners',
      thumbnail: 'https://source.unsplash.com/300x200/?javascript,code',
    },
    {
      id: 2,
      title: 'React Crash Course',
      thumbnail: 'https://source.unsplash.com/300x200/?react,code',
    },
    {
      id: 3,
      title: 'Advanced Node.js',
      thumbnail: 'https://source.unsplash.com/300x200/?nodejs,code',
    },
    {
      id: 4,
      title: 'UI/UX Design Basics',
      thumbnail: 'https://source.unsplash.com/300x200/?design,ui',
    },
  ],
  playlists: [
    { id: 1, name: 'Web Dev Mastery' },
    { id: 2, name: 'Data Structures & Algorithms' },
    { id: 3, name: 'Full Stack Projects' },
  ],
};

export default function ChannelPage() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="min-h-scree">
      {/* Banner Image */}
      <div className="relative">
        <img
          src={channelData.bannerImage}
          alt="Channel Banner"
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Channel Info Section */}
      <div className="p-6 flex items-center justify-between bg-white dark:bg-gray-800 border border-secondary-light dark:border-secondary-dark shadow-md">
        <div className="flex items-center gap-4">
          {/* Profile Image */}
          <img
            src={channelData.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{channelData.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {channelData.subscribers.toLocaleString()} subscribers
            </p>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={() => setSubscribed(!subscribed)}
          className={`px-4 py-2 flex items-center gap-2 text-white rounded-lg transition 
                        ${subscribed ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {subscribed ? <Check size={18} /> : <UserRound size={18} />}
          {subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* Main Content (Videos & Playlist Sidebar) */}
      <div className="flex gap-6 p-6">
        {/* Videos Section */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
            {channelData.videos.map((video) => (
              <div key={video.id} className="relative group ">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <PlaySquare className="text-white" size={40} />
                </div>
                <p className="mt-2 text-gray-800 dark:text-white">{video.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="w-64">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Playlists</h2>
          <div className="space-y-3">
            {channelData.playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <span className="text-gray-900 dark:text-white">{playlist.name}</span>
                <PlusCircle className="text-gray-500 dark:text-gray-400" size={18} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
