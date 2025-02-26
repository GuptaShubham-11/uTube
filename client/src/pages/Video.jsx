import { useEffect, useState, useCallback } from 'react';
import { ThumbsUp, Share2, UserRound, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Comments, SuggestedVideos, Alert, Spinner, Button } from '../components';
import { subscriptionApi } from '../api/subscription.js';
import { likeApi } from '../api/like.js';
import { userApi } from '../api/user.js';
import { videoApi } from '../api/video.js';
import { useNavigate } from 'react-router-dom';

export default function VideoPage() {
  const navigate = useNavigate();
  const reduxVideo = useSelector((state) => state.video.video);

  const [video, setVideo] = useState(reduxVideo);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(video?.isLiked || false);
  const [activeTab, setActiveTab] = useState('comments');

  useEffect(() => {
    if (!video?._id) return;
    updateWatchHistory();
    updateVideoViews();
    fetchChannelData();
  }, [video?._id]);

  const fetchChannelData = useCallback(async () => {
    if (!video?.ownerDetails?._id) return;
    try {
      const response = await userApi.getUserChannelProfile(video.ownerDetails._id);

      if (response.statusCode < 400) {
        setVideo((prev) => ({ ...prev, ownerDetails: response.message }));
        setIsSubscribed(response.message.isSubscribed);
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to fetch channel data' });
    }
  }, [video?.ownerDetails?._id]);

  const updateWatchHistory = useCallback(async () => {
    try {
      await userApi.updateWatchHistory(video._id);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to update watch history' });
    }
  }, [video?._id]);

  const updateVideoViews = useCallback(async () => {
    try {
      const response = await videoApi.updateVideoViews(video._id);
      if (response.statusCode < 400) {
        setVideo((prev) => ({ ...prev, views: response.message.views }));
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to update video views' });
    }
  }, [video?._id]);

  const toggleSubscribe = useCallback(async () => {
    if (!video?.ownerDetails?._id) return;
    setLoading(true);
    try {
      const response = await subscriptionApi.toggleSubscribeButton(video.ownerDetails._id);
      if (response.statusCode < 400) {
        setIsSubscribed((prev) => !prev);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Subscription failed!' });
    }
    setLoading(false);
  }, [video?.ownerDetails?._id]);

  const toggleLike = async () => {
    if (!video?._id) return;
    try {
      const response = await likeApi.toggleVideoLike(video._id);
      setIsLiked(response.message.likedBy ? true : false);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to toggle like' });
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark px-4 sm:px-6 pt-[80px]">
      {alert && (
        <div className="fixed top-20 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="rounded-xl overflow-hidden shadow-xl bg-black">
            <video
              src={video?.videoFile}
              controls
              className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
            />
          </div>

          {/* Video Info */}
          <div>
            <h1 className="text-2xl font-bold">{video?.title}</h1>
            <div className="flex justify-between items-center text-sm text-secondary-light dark:text-secondary-dark mt-2">
              <span>
                {video?.views?.toLocaleString()} views •{' '}
                {new Date(video?.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-4">
                <button
                  className={`flex items-center gap-2 p-2 rounded-lg transition ${
                    isLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-primary-dark dark:text-primary-light'
                  }`}
                  onClick={toggleLike}
                >
                  <ThumbsUp size={20} fill={isLiked ? 'white' : 'none'} />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
                <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-secondary-light dark:text-secondary-dark">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex items-center gap-4 p-4 border border-secondary-light dark:border-secondary-dark rounded-xl shadow-lg">
            <img
              src={video?.ownerDetails?.avatar || video?.owner?.avatar}
              alt="channel"
              className="w-14 h-14 border-4 border-primary-light rounded-full object-cover"
            />
            <div
              className="flex-1 cursor-pointer"
              onClick={() => navigate(`/channel/${video?.ownerDetails?._id || video?.owner?._id}`)}
            >
              <h2 className="text-lg text-text-light dark:text-text-dark font-semibold">
                {video?.ownerDetails?.fullname || video?.owner?.fullname}
              </h2>
            </div>
            <button
              className={`px-6 py-3 flex items-center gap-2 text-white rounded-lg shadow-lg transition ${
                isSubscribed ? 'bg-gray-500' : 'bg-red-600'
              }`}
              onClick={toggleSubscribe}
              disabled={loading}
            >
              {loading ? <Spinner /> : isSubscribed ? <Check size={20} /> : <UserRound />}
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Video Description */}
          <div className="p-4 bg-secondary-dark rounded-xl shadow-md">
            <p className="text-sm text-black whitespace-pre-wrap">{video?.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="flex border-b border-secondary-light dark:border-secondary-dark w-full">
            {['Comments', 'Suggested'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 p-3 text-center font-medium text-lg transition border-b-4 ${
                  activeTab === tab.toLowerCase()
                    ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark'
                    : 'border-transparent hover:border-blue-300'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 h-[800px] overflow-auto">
            {activeTab === 'comments' ? (
              <Comments videoId={video?._id} />
            ) : (
              <SuggestedVideos currentVideoId={video?._id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
