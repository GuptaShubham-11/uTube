import { useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';
import { subscriptionApi } from '../api/subscription';
import { useSelector } from 'react-redux';
import { Spinner, Alert } from '../components';
import { useNavigate } from 'react-router-dom';

export default function Subscribed() {
  const [subscriberChannels, setSubscriberChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchSubscribedChannels = async () => {
    setLoading(true);
    try {
      const response = await subscriptionApi.getChannelsSubscriber(user?._id);

      if (response.statusCode < 400) {
        setSubscriberChannels(response.message);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch subscribed channels.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchSubscribedChannels();
  }, [user?._id]);


  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark px-6 py-8">
      {alert && (
        <div className="fixed top-15 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center">Subscribers</h1>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Spinner size={28} />
        </div>
      ) : subscriberChannels.length === 0 ? (
        <p className="text-lg text-secondary-dark dark:text-secondary-light text-center">
          You're not subscribed to any channels.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subscriberChannels.map((channel) => (
            <div
              key={channel.subscriber}
              className="border border-secondary-light dark:border-secondary-dark rounded-xl shadow-md p-6 flex flex-col items-center gap-4 transition-all transform hover:scale-105 bg-white dark:bg-gray-900"
            >
              {/* Channel Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-primary-light dark:border-primary-dark flex items-center justify-center overflow-hidden">
                {channel?.subscriberDetails?.avatar ? (
                  <img
                    src={channel?.subscriberDetails?.avatar}
                    alt={channel?.subscriberDetails?.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound size={48} className="text-gray-500 dark:text-gray-400" />
                )}
              </div>

              {/* Channel Info */}
              <div className="text-center" onClick={() => navigate(`/channel/${channel?.subscriber}`)}>
                <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark cursor-pointer">
                  {channel?.subscriberDetails?.fullname}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
