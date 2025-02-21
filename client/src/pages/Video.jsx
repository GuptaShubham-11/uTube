import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, Bookmark } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Comments, SuggestedVideos } from '../components';
import { subscriptionApi } from '../api/subscription.js';

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState('comments');
  const video = useSelector((state) => state.video.video);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(useSelector((state) => state.video.isSubscribed));

  const toggleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await subscriptionApi.toggleSubscribeButton(video?.channelId);
      setLoading(false);
      if (response.statusCode < 400) {
        setIsSubscribed((prev) => !prev);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    } catch (error) {
      setLoading(false);
      console.error('Error toggling subscription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark p-4 sm:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video & Details */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="rounded-xl overflow-hidden shadow-xl bg-black">
            <video
              src={video?.videoFile}
              controls
              className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
            />
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{video?.title}</h1>
            <div className="flex justify-between items-center text-sm text-secondary-light dark:text-secondary-dark mt-2">
              <span>
                {video?.views.toLocaleString()} views •{' '}
                {new Date(video?.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 text-primary-light dark:text-primary-dark hover:opacity-80">
                  <ThumbsUp size={20} /> {video?.likes}
                </button>
                <button className="flex items-center gap-2 text-red-500 hover:opacity-80">
                  <ThumbsDown size={20} />
                </button>
                <button className="flex items-center gap-2 text-secondary-light dark:text-secondary-dark hover:opacity-80">
                  <Share2 size={20} /> Share
                </button>
                <button className="flex items-center gap-2 text-secondary-light dark:text-secondary-dark hover:opacity-80">
                  <Bookmark size={20} /> Save
                </button>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex items-center gap-4 mt-6 p-4 border border-secondary-light dark:border-secondary-dark rounded-xl shadow-lg">
            <img src="/default.jpg" alt="channel" className="w-14 h-14 rounded-full" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{video?.Fullname}</h2>
              <p className="text-sm text-secondary-light dark:text-secondary-dark">
                {video?.subscribers || 0} subscribers
              </p>
            </div>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition ${isSubscribed ? 'bg-gray-400' : 'bg-accent-light dark:bg-accent-dark text-white'}`}
              onClick={toggleSubscribe}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Video Description */}
          <div className="mt-4 p-4 bg-secondary-light dark:bg-secondary-dark rounded-xl shadow-md">
            <p className="text-sm whitespace-pre-wrap">{video?.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="flex border-b border-secondary-light dark:border-secondary-dark w-full">
            {['Comments', 'Suggested'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 p-3 text-center font-medium text-lg transition border-b-4 ${activeTab === tab.toLowerCase()
                  ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark'
                  : 'border-transparent hover:border-blue-300'
                  }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 h-[800px] overflow-auto">
            {activeTab === 'comments' && <Comments videoId={video?._id} />}
            {activeTab === 'suggested' && <SuggestedVideos />}
          </div>
        </div>
      </div>
    </div>
  );
}
