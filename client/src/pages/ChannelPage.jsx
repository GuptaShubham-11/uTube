import { useEffect, useState } from 'react';
import { userApi } from '../api/user.js';
import { subscriptionApi } from '../api/subscription.js';
import { useSelector, useDispatch } from 'react-redux';
import { Check, UserRound, Camera, Image as ImageIcon, Save, EditIcon } from 'lucide-react';
import { Alert, Spinner, VideoList, Playlist, WatchHistory } from '../components';
import { setVideo } from '../features/videoSlice.js';

export default function ChannelPage() {
  const [channelData, setChannelData] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(channelData?.isSubscribed);
  const [activeTab, setActiveTab] = useState('videos');
  const dispatch = useDispatch();

  const fetchChannelData = async () => {
    try {
      const response = await userApi.getUserChannelProfile(user?._id);
      if (response.statusCode < 400) {
        setChannelData(response?.message);
        setNewName(response?.message?.fullname);
        setIsSubscribed(response?.message?.isSubscribed);
        dispatch(setVideo({ isSubscribed: response?.message?.isSubscribed }));
      } else {
        setAlert({ type: 'error', message: 'Failed to fetch channel data.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to fetch channel data.' });
    }
  };

  const toggleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await subscriptionApi.toggleSubscribeButton(channelData?._id);
      setLoading(false);

      if (response.statusCode < 400) {
        setChannelData({ ...channelData, isSubscribed });
        setIsSubscribed(!isSubscribed);
        dispatch(setVideo({ isSubscribed }));
      } else {
        setAlert({ type: 'error', message: 'Failed to toggle subscription.' });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ type: 'error', message: error.message || 'Failed to toggle subscription.' });
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [user, isSubscribed]);

  const handleNameChange = async () => {
    try {
      const response = await userApi.updateFullname({ fullname: newName });
      if (response.statusCode < 400) {
        setChannelData({ ...channelData, fullname: newName });
        setAlert({ type: 'success', message: 'Name updated successfully!' });
        setEditingName(false);
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to update name.' });
    }
  };

  const handleImageUpload = async (type, file) => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      const response =
        type === 'avatar'
          ? await userApi.updateAvatar(formData)
          : await userApi.updateCoverImage(formData);

      if (response.statusCode < 400) {
        setChannelData({ ...channelData, [type]: response?.message });
        setAlert({
          type: 'success',
          message: `${type === 'avatar' ? 'Profile' : 'Banner'} image updated!`,
        });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Image update failed.' });
    }
  };

  return (
    <div className="mt-16 min-h-screen font-sans">
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      {/* Banner Image */}
      <div className="relative group">
        <img
          src={user?.coverImage || 'https://source.unsplash.com/1200x400/?technology'}
          alt="Channel Banner"
          className="w-full h-64 md:h-70 object-cover"
        />
        <label className="absolute bottom-4 right-4 cursor-pointer bg-background-dark hover:bg-black p-2 rounded">
          <ImageIcon className="text-white" size={20} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload('coverImage', e.target.files[0])}
          />
        </label>
      </div>

      {/* Channel Info */}
      <div className="p-6 flex flex-col md:flex-row items-center justify-between border border-secondary-light dark:border-secondary-dark">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={user?.avatar || 'https://source.unsplash.com/100x100/?person'}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-primary-light dark:border-primary-dark object-cover"
            />
            <label className="absolute bottom-1 right-2 cursor-pointer bg-background-dark hover:bg-black bg-opacity-60 p-2 rounded-full">
              <Camera className="text-white" size={18} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload('avatar', e.target.files[0])}
              />
            </label>
          </div>
          <div>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent text-black dark:text-white"
                />
                <button onClick={handleNameChange} className="text-accent-light">
                  <Save size={24} />
                </button>
              </div>
            ) : (
              <h1
                className="flex text-3xl font-bold cursor-pointer text-black dark:text-white"
                onClick={() => setEditingName(true)}
              >
                {user?.fullname || 'Unknown'}{' '}
                <EditIcon size={20} className="hover:text-cyan-400 dark:hover:text-cyan-600" />
              </h1>
            )}
            <p className="text-text-light dark:text-text-dark font-semibold">
              {channelData?.subscribersToCount?.toLocaleString()} subscribers
            </p>
          </div>
        </div>
        <button
          className={`mt-4 md:mt-0 px-6 py-3 flex items-center gap-2 text-white rounded-lg shadow-lg transition
            ${isSubscribed ? 'bg-gray-500' : 'bg-red-600'}`}
          onClick={toggleSubscribe}
        >
          {loading ? <Spinner /> : !isSubscribed ? <UserRound /> : <Check size={20} />}
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        {['videos', 'playlists', 'history'].map((tab) => (
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
        {activeTab === 'videos' && <VideoList />}
        {activeTab === 'playlists' && <Playlist />}
        {activeTab === 'history' && <WatchHistory />}
      </div>
    </div>
  );
}
