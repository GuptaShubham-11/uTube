import { useEffect, useState } from "react";
import { XCircle, UserRound } from "lucide-react";
import { subscriptionApi } from "../api/subscription";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components";

export default function Subscriber() {
    const [subscribers, setSubscribers] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch subscribers
    useEffect(() => {
        const fetchSubscribers = async () => {
            setLoading(true);
            try {
                const response = await subscriptionApi.getChannelsSubscriber(user?._id);
                if (response.statusCode < 400 && Array.isArray(response.message)) {
                    setSubscribers(response.message);
                }
            } catch (error) {
                console.error("Error fetching subscribers:", error);
            }
            setLoading(false);
        };

        if (user?._id) {
            fetchSubscribers();
        }
    }, [user?._id]);

    // Handle Unsubscribe
    const handleUnsubscribe = async (id) => {
        setLoading(true);
        try {
            const response = await subscriptionApi.toggleSubscribeButton(id, user?._id);
            if (response.statusCode < 400) {
                setSubscribers((prev) => prev.filter((subscriber) => subscriber.subscriberDetails._id !== id));
            }
        } catch (error) {
            console.error("Error unsubscribing:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Subscribers</h1>

            {loading ? (
                <div className="flex justify-center mt-10">
                    <Spinner size={28} />
                </div>
            ) : subscribers.length === 0 ? (
                <p className="text-lg text-secondary-dark dark:text-secondary-light text-center">
                    You have no subscribers yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {subscribers.map(({ subscriberDetails }) => (
                        <div
                            key={subscriberDetails._id}
                            className="border border-secondary-light dark:border-secondary-dark rounded-xl shadow-md p-6 flex flex-col items-center gap-4 transition-all transform hover:scale-105 bg-white dark:bg-gray-900 cursor-pointer"
                            onClick={() => navigate(`/channel/${subscriberDetails._id}`)}
                        >
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full border-4 border-primary-light dark:border-primary-dark flex items-center justify-center overflow-hidden">
                                {subscriberDetails.avatar ? (
                                    <img
                                        src={subscriberDetails.avatar}
                                        alt={subscriberDetails.fullname}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserRound size={48} className="text-gray-500 dark:text-gray-400" />
                                )}
                            </div>

                            {/* Subscriber Info */}
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                                    {subscriberDetails.fullname}
                                </h2>
                            </div>

                            {/* Unsubscribe Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnsubscribe(subscriberDetails._id);
                                }}
                                className="w-full px-4 py-2 flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                <XCircle size={20} />
                                {loading ? "Removing..." : "Remove"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
