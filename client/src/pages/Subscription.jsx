import { useState } from 'react';
import { Subscribed, Subscriber } from '../components';

export default function Subscription() {
    const [activeTab, setActiveTab] = useState('subscribed');

    return (
        <div className="mt-16 min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark p-6">
            {/* Tab Navigation */}
            <div className="flex justify-center items-center">
                <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
                    {['subscribed', 'subscribers'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-6 py-3 font-medium text-lg transition-all rounded-md 
                ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
                {activeTab === 'subscribed' && <Subscribed />}
                {activeTab === 'subscribers' && <Subscriber />}
            </div>
        </div>
    );
}
