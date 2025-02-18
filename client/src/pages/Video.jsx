import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, Bookmark } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Comments, SuggestedVideos } from '../components';

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState('comments');
  const video = useSelector((state) => state.video.video);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video & Details */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="rounded-lg overflow-hidden shadow-lg bg-black">
            <video src={video?.videoFile} controls className="w-full h-[400px]" />
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-semibold">{video?.title}</h1>
            <div className="flex justify-between items-center text-sm dark:text-secondary-dark text-secondary-light mt-2">
              <span>
                {video.views.toLocaleString()} views • {video?.createdAt}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => setLikeCount(likeCount + 1)}
                  className="flex items-center gap-1 text-primary-light dark:text-primary-dark hover:opacity-80"
                >
                  <ThumbsUp size={18} /> {video?.likes}
                </button>
                <button
                  // onClick={() => setDislikeCount(dislikeCount + 1)}
                  className="flex items-center gap-1 text-red-500 hover:opacity-80"
                >
                  <ThumbsDown size={18} />
                </button>
                <button className="flex items-center gap-1 dark:text-secondary-dark text-secondary-light hover:opacity-80">
                  <Share2 size={18} /> Share
                </button>
                <button className="flex items-center gap-1 dark:text-secondary-dark text-secondary-light hover:opacity-80">
                  <Bookmark size={18} /> Save
                </button>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex items-center gap-4 mt-6 p-4 border border-secondary-light dark:border-secondary-dark rounded-lg shadow">
            <img src="/default.jpg" alt="channel" className="w-14 h-14 rounded-full" />
            <div className="flex-1">
              <h2 className="text-lg font-medium">{video.name}</h2>
              <p className="text-sm dark:text-secondary-dark text-secondary-light">
                {/* {videoData.subscribers.toLocaleString()} subscribers */}
              </p>
            </div>
            <button
              // onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-4 py-2 rounded-lg font-medium ${
                true ? 'bg-gray-500 text-white' : 'bg-accent-light dark:bg-accent-dark text-white'
              } transition`}
            >
              {video.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Video Description */}
          <div className="mt-4 p-4 dark:bg-secondary-light bg-secondary-dark rounded-lg shadow">
            <p className="text-sm">{video?.description}</p>
          </div>
        </div>

        <div className="flex border-b bg-gray-100 dark:bg-gray-800">
          {['comments', 'videos'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 p-4 text-center font-medium text-lg transition border-b-4 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-blue-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'comments' && <Comments videoId={video._id} />}
          {activeTab === 'videos' && <SuggestedVideos />}
        </div>
      </div>
    </div>
  );
}
