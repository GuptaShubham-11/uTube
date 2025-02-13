import { useState } from 'react';
import { XCircle, UserRound } from 'lucide-react';

const initialSubscribedChannels = [
  {
    id: 1,
    name: 'Tech Savvy',
    profileImage: 'https://source.unsplash.com/100x100/?person,technology',
    subscribers: 250000,
  },
  {
    id: 2,
    name: 'Code Master',
    profileImage: 'https://source.unsplash.com/100x100/?programming,developer',
    subscribers: 180000,
  },
  {
    id: 3,
    name: 'React Ninja',
    profileImage: 'https://source.unsplash.com/100x100/?react,frontend',
    subscribers: 220000,
  },
  {
    id: 4,
    name: 'UI/UX World',
    profileImage: 'https://source.unsplash.com/100x100/?design,uiux',
    subscribers: 150000,
  },
];

export default function Subscribed() {
  const [subscribedChannels, setSubscribedChannels] = useState(initialSubscribedChannels);

  const handleUnsubscribe = (id) => {
    setSubscribedChannels(subscribedChannels.filter((channel) => channel.id !== id));
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark p-8">
      <h1 className="text-3xl font-bold mb-6">Subscribed Channels</h1>

      {subscribedChannels.length === 0 ? (
        <p className="text-lg text-secondary-dark dark:text-secondary-light">
          You're not subscribed to any channels.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subscribedChannels.map((channel) => (
            <div
              key={channel.id}
              className="border border-secondary-light dark:border-secondary-dark rounded-lg shadow-lg p-5 flex flex-col items-center gap-4 transition hover:scale-105"
            >
              {/* Channel Avatar */}
              <div className="w-20 h-20 rounded-full border-4 border-primary-light dark:border-primary-dark flex items-center justify-center overflow-hidden">
                {channel.profileImage ? (
                  <img
                    src={channel.profileImage}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound size={40} className="text-gray-600 dark:text-gray-300" />
                )}
              </div>

              {/* Channel Info */}
              <div className="text-center">
                <h2 className="text-lg font-semibold">{channel.name}</h2>
                <p className="text-sm dark:text-secondary-dark text-secondary-light">
                  {channel.subscribers.toLocaleString()} subscribers
                </p>
              </div>

              {/* Unsubscribe Button */}
              <button
                onClick={() => handleUnsubscribe(channel.id)}
                className="px-4 py-2 flex items-center gap-2 text-white bg-accent-light dark:bg-accent-dark hover:opacity-90 rounded-lg transition-all"
              >
                <XCircle size={18} />
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
