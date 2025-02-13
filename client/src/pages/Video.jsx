import { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
  Bell,
  UserRound,
} from 'lucide-react';

const videoData = {
  id: 1,
  title: 'Mastering React in 10 Minutes!',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnail: 'https://source.unsplash.com/800x450/?technology,code',
  views: 158000,
  uploadDate: 'Feb 10, 2025',
  description:
    'Learn React fundamentals in just 10 minutes with this concise and easy-to-follow guide!',
  channel: {
    name: 'Code Master',
    avatar: 'https://source.unsplash.com/100x100/?developer,person',
    subscribers: 220000,
  },
  comments: [
    { id: 1, user: 'John Doe', comment: 'Awesome video! Super helpful.' },
    { id: 2, user: 'Jane Smith', comment: 'This made React so easy to understand!' },
  ],
  relatedVideos: [
    {
      id: 2,
      title: 'React State Management',
      thumbnail: 'https://source.unsplash.com/300x200/?react,state',
    },
    {
      id: 3,
      title: 'Tailwind CSS Mastery',
      thumbnail: 'https://source.unsplash.com/300x200/?tailwind,css',
    },
    {
      id: 4,
      title: 'Full Stack Development Guide',
      thumbnail: 'https://source.unsplash.com/300x200/?fullstack,developer',
    },
  ],
};

export default function VideoPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(452);
  const [dislikeCount, setDislikeCount] = useState(10);
  const [commentText, setCommentText] = useState('');

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video & Details */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="rounded-lg overflow-hidden shadow-lg bg-black">
            <video src={videoData.videoUrl} controls className="w-full h-[400px]" />
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-semibold">{videoData.title}</h1>
            <div className="flex justify-between items-center text-sm dark:text-secondary-dark text-secondary-light mt-2">
              <span>
                {videoData.views.toLocaleString()} views • {videoData.uploadDate}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => setLikeCount(likeCount + 1)}
                  className="flex items-center gap-1 text-primary-light dark:text-primary-dark hover:opacity-80"
                >
                  <ThumbsUp size={18} /> {likeCount}
                </button>
                <button
                  onClick={() => setDislikeCount(dislikeCount + 1)}
                  className="flex items-center gap-1 text-red-500 hover:opacity-80"
                >
                  <ThumbsDown size={18} /> {dislikeCount}
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
            <img src={videoData.channel.avatar} alt="channel" className="w-14 h-14 rounded-full" />
            <div className="flex-1">
              <h2 className="text-lg font-medium">{videoData.channel.name}</h2>
              <p className="text-sm dark:text-secondary-dark text-secondary-light">
                {videoData.channel.subscribers.toLocaleString()} subscribers
              </p>
            </div>
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isSubscribed
                  ? 'bg-gray-500 text-white'
                  : 'bg-accent-light dark:bg-accent-dark text-white'
              } transition`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Video Description */}
          <div className="mt-4 p-4 dark:bg-secondary-light bg-secondary-dark rounded-lg shadow">
            <p className="text-sm">{videoData.description}</p>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Comments</h3>
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <UserRound size={30} className="text-gray-600 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 rounded-lg dark:bg-secondary-light bg-secondary-dark focus:outline-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (commentText.trim()) {
                      videoData.comments.push({
                        id: Date.now(),
                        user: 'You',
                        comment: commentText,
                      });
                      setCommentText('');
                    }
                  }}
                  className="px-4 py-2 bg-accent-light dark:bg-accent-dark text-white rounded-lg"
                >
                  Post
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {videoData.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 border border-secondary-light dark:border-secondary-dark rounded-lg"
                  >
                    <p className="font-semibold">{comment.user}</p>
                    <p>{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Videos */}
        <div>
          <h3 className="text-xl font-semibold">Related Videos</h3>
          <div className="mt-4 space-y-4">
            {videoData.relatedVideos.map((video) => (
              <div
                key={video.id}
                className="flex gap-4 items-center border border-secondary-light dark:border-secondary-dark p-3 rounded-lg"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-28 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">{video.title}</p>
                  <p className="text-sm text-secondary-dark dark:text-secondary-light">
                    Channel Name
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
