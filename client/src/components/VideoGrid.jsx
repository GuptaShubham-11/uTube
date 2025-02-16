import VideoCard from './VideoCard';

const videos = [
  {
    id: 1,
    title: 'React Basics',
    channel: 'Code Academy',
    thumbnail: 'https://dummyimage.com/300',
  },
  {
    id: 2,
    title: 'Tailwind CSS Guide',
    channel: 'Dev Simplified',
    thumbnail: 'https://dummyimage.com/300',
  },
  {
    id: 3,
    title: 'JavaScript Tips',
    channel: 'JS Mastery',
    thumbnail: 'https://dummyimage.com/300',
  },
  {
    id: 4,
    title: 'Nextjs Basics',
    channel: 'Code Academy',
    thumbnail: 'https://dummyimage.com/300',
  },
  {
    id: 5,
    title: 'Bun Guide',
    channel: 'Dev Simplified',
    thumbnail: 'https://dummyimage.com/300',
  },
  {
    id: 6,
    title: 'Tech Tips',
    channel: 'JS Mastery',
    thumbnail: 'https://dummyimage.com/300',
  },
];

export default function VideoGrid() {
  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold text-primary-light dark:text-primary-dark">
        Recommended Videos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
