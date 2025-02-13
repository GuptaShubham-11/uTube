import { PlusCircle, PlaySquare } from 'lucide-react';

const playlists = [
  {
    id: 1,
    name: 'Chill Vibes',
    thumbnail: 'https://source.unsplash.com/300x200/?music,relax',
  },
  {
    id: 2,
    name: 'Workout Mix',
    thumbnail: 'https://source.unsplash.com/300x200/?gym,music',
  },
  {
    id: 3,
    name: 'Coding Focus',
    thumbnail: 'https://source.unsplash.com/300x200/?code,music',
  },
  {
    id: 4,
    name: 'Top Hits',
    thumbnail: 'https://source.unsplash.com/300x200/?pop,music',
  },
];

export default function Playlist() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Playlists</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-light text-white dark:bg-primary-dark rounded-lg hover:brightness-110">
            <PlusCircle size={20} />
            Create Playlist
          </button>
        </div>

        {/* Playlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="relative group">
              <img
                src={playlist.thumbnail}
                alt={playlist.name}
                className="w-full h-40 object-cover rounded-lg shadow-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <PlaySquare className="text-white" size={40} />
              </div>
              <p className="mt-2 text-lg font-medium text-gray-800 dark:text-white">
                {playlist.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
