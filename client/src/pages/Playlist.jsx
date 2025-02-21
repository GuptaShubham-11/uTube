import { SmilePlus, PlaySquare } from 'lucide-react';
import { Button } from '../components';

const playlists = [
  {
    id: 1,
    name: 'Chill Vibes',
    thumbnail: 'https://source.unsplash.com/400x250/?music,relax',
  },
  {
    id: 2,
    name: 'Workout Mix',
    thumbnail: 'https://source.unsplash.com/400x250/?gym,music',
  },
  {
    id: 3,
    name: 'Coding Focus',
    thumbnail: 'https://source.unsplash.com/400x250/?code,music',
  },
  {
    id: 4,
    name: 'Top Hits',
    thumbnail: 'https://source.unsplash.com/400x250/?pop,music',
  },
];

export default function Playlist() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
            🎵 Your Playlists
          </h1>
          <Button variant="primary" className="flex items-center gap-2" text={<SmilePlus />} />
        </div>

        {/* Playlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="relative group overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={playlist.thumbnail}
                alt={playlist.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlaySquare className="text-white" size={48} />
              </div>
              <p className="mt-2 text-xl font-semibold text-center text-gray-900 dark:text-white">
                {playlist.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
