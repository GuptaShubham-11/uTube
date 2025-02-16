import { useState } from 'react';
import { UploadCloud, Video, Image, Text } from 'lucide-react';
import { Alert, Spinner } from '../components';
import { videoApi } from '../api/video.js';
import { useNavigate } from 'react-router-dom';

export default function UploadVideo() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpload = async () => {
    const { title, description, videoFile, thumbnail } = formData;
    if (!title || !description || !videoFile || !thumbnail) {
      setAlert({ type: 'warning', message: 'Please fill all fields and upload files.' });
      return;
    }

    const uploadData = new FormData();
    Object.entries(formData).forEach(([key, value]) => uploadData.append(key, value));

    setLoading(true);
    try {
      const response = await videoApi.uploadVideo(uploadData);
      setLoading(false);

      if (response.statusCode < 400) {
        setAlert({ type: 'success', message: 'Video uploaded successfully!' });
        setTimeout(() => navigate('/videos'), 3000);
      } else {
        setAlert({ type: 'error', message: response.message || 'Video upload failed.' });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ type: 'error', message: error.message || 'Video upload failed.' });
    }
  };

  const inputFields = [
    { label: 'Video Title', name: 'title', Icon: Text },
    { label: 'Video Description', name: 'description', Icon: Text, textarea: true },
    { label: 'Upload Video', name: 'videoFile', Icon: Video, type: 'file', accept: 'video/*' },
    { label: 'Upload Thumbnail', name: 'thumbnail', Icon: Image, type: 'file', accept: 'image/*' },
  ];

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold text-center mb-6">Upload Video</h1>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {inputFields.map(({ label, name, Icon, textarea, type, accept }, idx) => (
        <div key={idx} className="mb-4 relative">
          <Icon className="absolute left-3 top-3 text-gray-500" size={20} />
          {textarea ? (
            <textarea
              name={name}
              placeholder={label + '...'}
              value={formData[name]}
              onChange={handleChange}
              rows="4"
              className="pl-10 w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500 dark:focus:border-blue-400"
            />
          ) : type === 'file' ? (
            <input
              type="file"
              name={name}
              accept={accept}
              onChange={handleChange}
              className="pl-10 w-full border p-2 rounded-lg outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent-light file:text-white hover:opacity-85"
            />
          ) : (
            <input
              type="text"
              name={name}
              placeholder={label + '...'}
              value={formData[name]}
              onChange={handleChange}
              className="pl-10 w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500 dark:focus:border-blue-400"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleUpload}
        className="w-full px-6 py-3 mt-4 text-lg font-semibold rounded-lg bg-primary-light text-white hover:opacity-90 cursor-pointer transition flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? <Spinner /> : <UploadCloud size={20} />} Upload
      </button>
    </div>
  );
}
