import { useEffect, useState } from 'react';
import { XCircle, UserRound } from 'lucide-react';
import { subscriptionApi } from '../api/subscription';
import { useSelector } from 'react-redux';
import { Spinner, Alert } from '../components'; // Ensure Alert component exists
import { useNavigate } from 'react-router-dom';

export default function Subscribed() {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unsubscribeLoading, setUnsubscribeLoading] = useState(null); // Track individual unsubscribe
  const [alert, setAlert] = useState({ type: '', message: '' }); // Alert state

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      setLoading(true);
      try {
        const response = await subscriptionApi.getSubscribedChannels(user?._id);
        if (response.statusCode < 400) {
          setSubscribedChannels(response.message);
        }
      } catch (error) {
        console.error(error);
        setAlert({ type: 'error', message: 'Failed to fetch subscribed channels.' });
      }
      setLoading(false);
    };

    fetchSubscribedChannels();
  }, [user?._id]);

  const handleUnsubscribe = async (id) => {
    setUnsubscribeLoading(id);
    try {
      const response = await subscriptionApi.toggleSubscribeButton(user?._id, id);
      if (response.statusCode < 400) {
        setSubscribedChannels((prev) => prev.filter((channel) => channel._id !== id));
        setAlert({ type: 'success', message: 'Successfully unsubscribed!' });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Failed to unsubscribe.' });
    }
    setUnsubscribeLoading(null);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Subscribed Channels</h1>

      {/* Alert Component */}
      {alert && (
        <div className="fixed top-5 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Spinner size={28} />
        </div>
      ) : subscribedChannels.length === 0 ? (
        <p className="text-lg text-secondary-dark dark:text-secondary-light text-center">
          You're not subscribed to any channels.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subscribedChannels.map((channel) => (
            <div
              key={channel._id}
              className="border border-secondary-light dark:border-secondary-dark rounded-xl shadow-md p-6 flex flex-col items-center gap-4 transition-all transform hover:scale-105 bg-white dark:bg-gray-900"
            >
              {/* Channel Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-primary-light dark:border-primary-dark flex items-center justify-center overflow-hidden">
                {channel?.avatar ? (
                  <img
                    src={channel?.avatar}
                    alt={channel?.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound size={48} className="text-gray-500 dark:text-gray-400" />
                )}
              </div>

              {/* Channel Info */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                  {channel.fullname}
                </h2>
              </div>

              {/* Unsubscribe Button */}
              <button
                onClick={() => handleUnsubscribe(channel._id)}
                className="w-full px-4 py-2 flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={unsubscribeLoading === channel._id}
              >
                {unsubscribeLoading === channel._id ? <Spinner size={18} /> : <XCircle size={20} />}
                {unsubscribeLoading === channel._id ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
