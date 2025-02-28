import { useEffect, useState } from 'react';
import { userApi } from '../api/user.js';
import { subscriptionApi } from '../api/subscription.js';
import { useSelector, useDispatch } from 'react-redux';
import { Check, UserRound, Camera, Image as ImageIcon, Save, EditIcon } from 'lucide-react';
import { Alert, Spinner, VideoList, Playlist, WatchHistory } from '../components';
import { setVideo } from '../features/videoSlice.js';
import { useParams } from 'react-router-dom';

export default function ChannelPage() {
  const [channelData, setChannelData] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  const isOwner = user?._id === id;

  const fetchChannelData = async () => {
    try {
      const response = await userApi.getUserChannelProfile(id);

      if (response.statusCode < 400) {
        setChannelData(response.message);
        setNewName(response.message.fullname);
        setIsSubscribed(response.message.isSubscribed);
      } else {
        setAlert({ type: 'error', message: 'Failed to fetch channel data.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to fetch channel data.' });
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [id, dispatch]);

  const toggleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await subscriptionApi.toggleSubscribeButton(channelData?._id);
      if (response.statusCode < 400) {
        setIsSubscribed(!isSubscribed);
      } else {
        setAlert({ type: 'error', message: 'Failed to toggle subscription.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to toggle subscription.' });
    }
    setLoading(false);
  };

  const handleNameChange = async () => {
    try {
      const response = await userApi.updateFullname({ fullname: newName });
      if (response.statusCode < 400) {
        setChannelData((prev) => ({ ...prev, fullname: newName }));
        setAlert({ type: 'success', message: 'Name updated successfully!' });
        setEditingName(false);
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to update name.' });
    }
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();

    // Ensure correct field name based on type
    if (type === 'avatar') {
      formData.append('avatar', file);
    } else if (type === 'coverImage') {
      formData.append('coverImage', file);
    } else {
      setAlert({ type: 'error', message: 'Invalid image type.' });
      return;
    }

    try {
      let response;
      if (type === 'avatar') {
        response = await userApi.updateAvatar(formData);
      } else if (type === 'coverImage') {
        response = await userApi.updateCoverImage(formData);
      }
      console.log(response);

      if (response?.statusCode < 400) {
        fetchChannelData();
        setAlert({ type: 'success', message: 'Image updated successfully!' });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload image.',
      });
    }
  };

  return (
    <div className="mt-16 min-h-screen px-4 sm:px-8">
      {alert && (
        <div className="fixed top-15 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}{' '}
      <div className="relative">
        <img
          src={channelData?.coverImage || '/default-cover.jpg'}
          alt="Channel Banner"
          className="w-full h-64 md:h-72 object-cover"
        />
        {isOwner && (
          <label className="absolute bottom-4 right-4 cursor-pointer bg-black p-2 rounded">
            <ImageIcon className="text-white" size={20} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'coverImage')}
            />
          </label>
        )}
      </div>
      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-300">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={channelData?.avatar || '/default-avatar.jpg'}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
            />
            {isOwner && (
              <label className="absolute bottom-0 right-0 cursor-pointer p-2 rounded-full bg-gray-800">
                <Camera className="text-white" size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'avatar')}
                />
              </label>
            )}
          </div>
          <div>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent"
                />
                <Save size={20} onClick={handleNameChange} className="cursor-pointer" />
              </div>
            ) : (
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {channelData?.fullname || 'Unknown'}{' '}
                {isOwner && (
                  <EditIcon
                    size={18}
                    onClick={() => setEditingName(true)}
                    className="cursor-pointer"
                  />
                )}
              </h1>
            )}
            <p className="text-gray-600">
              {channelData?.subscribersToCount?.toLocaleString()} subscribers
            </p>
          </div>
        </div>
        <button
          className={`px-6 py-3 flex items-center gap-2 text-white rounded-lg transition ${isSubscribed ? 'bg-gray-500' : 'bg-red-600'}`}
          onClick={toggleSubscribe}
        >
          {loading ? <Spinner /> : isSubscribed ? <Check size={20} /> : <UserRound size={20} />}
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>
      <div className="flex justify-center space-x-6 border-b border-gray-300 p-4">
        {['videos', 'playlists', 'history'].map((tab) =>
          !isOwner && tab === 'history' ? null : (
            <button
              key={tab}
              className={`px-4 py-2 text-lg font-semibold ${activeTab === tab ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>
      <div className="p-4">
        {activeTab === 'videos' && <VideoList channelId={id} />}
        {activeTab === 'playlists' && <Playlist channelId={id} />}
        {isOwner && activeTab === 'history' && <WatchHistory />}
      </div>
    </div>
  );
}
