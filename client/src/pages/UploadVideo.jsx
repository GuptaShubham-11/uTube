import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function UploadVideo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!title || !description || !video || !thumbnail) {
      alert('Please fill all fields and upload files.');
      return;
    }

    console.log({
      title,
      description,
      video,
      thumbnail,
    });

    alert('Video uploaded successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 text-text-light  dark:text-text-dark">
      <h1 className="text-3xl font-bold text-center mb-6">Upload Video</h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-lg font-medium">Video Title</label>
        <input
          type="text"
          placeholder="Enter video title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-secondary-light dark:border-secondary-dark bg-white dark:bg-gray-800 rounded-lg outline-none"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-lg font-medium">Description</label>
        <textarea
          placeholder="Enter video description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full px-4 py-2 border border-secondary-light dark:border-secondary-dark bg-white dark:bg-gray-800 rounded-lg outline-none"
        />
      </div>

      {/* Video Upload */}
      <div className="mb-4">
        <label className="block text-lg font-medium">Upload Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full border border-secondary-light dark:border-secondary-dark bg-white dark:bg-gray-800 p-2 rounded-lg"
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="mb-4">
        <label className="block text-lg font-medium">Upload Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="w-full border border-secondary-light dark:border-secondary-dark bg-white dark:bg-gray-800 p-2 rounded-lg"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="w-full px-6 py-2 text-lg font-semibold rounded-lg bg-primary-light text-white 
                dark:bg-primary-dark dark:text-background-dark hover:brightness-110 transition duration-300 flex items-center justify-center gap-2"
      >
        <UploadCloud size={20} /> Upload
      </button>
    </div>
  );
}
