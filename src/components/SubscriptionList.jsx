import { useDigiScribe } from '../contexts/DigiScribeContext';

const SubscriptionList = () => {
  const { userSubscriptions, cancelSubscription, processPayment, formatSubscriptionData } = useDigiScribe();

  return (
    <div className="space-y-6">
      {userSubscriptions.map((sub, index) => {
        const formattedSub = formatSubscriptionData(sub);
        return (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {formattedSub.serviceName}
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>Amount: {formattedSub.amount} ETH</p>
                <p>Next Payment: {formattedSub.nextPayment.toLocaleDateString()}</p>
                <p>Status: {formattedSub.active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => processPayment(index)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Pay Now
              </button>
              <button
                onClick={() => cancelSubscription(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      })}
      {userSubscriptions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No active subscriptions found.
        </div>
      )}
    </div>
  );
};

export default SubscriptionList