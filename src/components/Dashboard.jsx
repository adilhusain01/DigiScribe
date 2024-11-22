import { useState } from 'react';
import SubscriptionList from './SubscriptionList';
import NewSubscription from './NewSubscription';
import RewardsCard from './RewardsCard';
import { useDigiScribe } from '../contexts/DigiScribeContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const { loading, error } = useDigiScribe();

  const tabs = [
    { id: 'subscriptions', name: 'My Subscriptions' },
    { id: 'new', name: 'New Subscription' },
    { id: 'rewards', name: 'Rewards' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'subscriptions' && <SubscriptionList />}
            {activeTab === 'new' && <NewSubscription />}
            {activeTab === 'rewards' && <RewardsCard />}
          </>
        )}
      </div>
    </div>
  );
};


export default Dashboard