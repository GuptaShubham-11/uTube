export default function VideoCard({ video }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-background-light dark:bg-background-dark border border-secondary-light dark:border-secondary-dark">
      <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">
          {video.title}
        </h3>
        <p className="text-secondary-light dark:text-secondary-dark">{video.channel}</p>
      </div>
    </div>
  );
}
