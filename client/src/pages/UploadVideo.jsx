import { useState } from 'react';
import { Video, Image, Text } from 'lucide-react';
import { Alert, Spinner, Button, Input } from '../components';
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
    { label: 'Video Title', name: 'title', Icon: <Text /> },
    { label: 'Video Description', name: 'description', Icon: <Text />, textarea: true },
    { label: 'Upload Video', name: 'videoFile', Icon: <Video />, type: 'file', accept: 'video/*' },
    {
      label: 'Upload Thumbnail',
      name: 'thumbnail',
      Icon: <Image />,
      type: 'file',
      accept: 'image/*',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto my-24 p-6 rounded-xl shadow-lg border border-secondary-light dark:border-secondary-dark text-text-light dark:text-text-dark">
      {alert && (
        <div className="fixed top-25 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <h1 className="text-4xl font-bold text-center mb-6">Upload Video</h1>
      {inputFields.map(({ label, name, Icon, textarea, type, accept }, idx) => (
        <div key={idx} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">{label}</span>
          </div>
          {textarea ? (
            <Input
              as="textarea"
              name={name}
              icon={Icon}
              placeholder={`${label}...`}
              value={formData[name]}
              onChange={handleChange}
              rows="4"
            />
          ) : type === 'file' ? (
            <Input type="file" name={name} icon={Icon} accept={accept} onChange={handleChange} />
          ) : (
            <Input
              type="text"
              name={name}
              icon={Icon}
              placeholder={`${label}...`}
              value={formData[name]}
              onChange={handleChange}
            />
          )}
        </div>
      ))}

      <Button
        text={loading ? <Spinner /> : `Upload`}
        onClick={handleUpload}
        variant="primary"
        disabled={loading}
        className="w-full mt-4 flex items-center justify-center gap-2"
      />
    </div>
  );
}
